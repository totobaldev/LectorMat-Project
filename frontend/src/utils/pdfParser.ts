import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker to use unpkg CDN worker for bundle compatibility
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export interface ParsedStudent {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  username: string; // Institutional email
  password: string; // FIRSTNAME+lastname (e.g. IANaguilera)
}

/**
 * Normalizes text removing diacritics (accents) for clean password generation.
 */
function cleanString(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

/**
 * Generates student password according to rule:
 * First Name in UPPERCASE + Main Last Name in lowercase.
 * Example: "Ian Bryan Josué", "Aguilera Torres" -> "IANaguilera"
 */
export function generateStudentPassword(firstName: string, lastName: string): string {
  const cleanFirst = cleanString(firstName);
  const cleanLast = cleanString(lastName);

  // Take primary first name (first word) and primary last name (first word)
  const primaryFirst = cleanFirst.split(/\s+/)[0] || 'ESTUDIANTE';
  const primaryLast = cleanLast.split(/\s+/)[0] || 'lectormat';

  const upperFirst = primaryFirst.toUpperCase();
  const lowerLast = primaryLast.toLowerCase();

  return `${upperFirst}${lowerLast}`;
}

/**
 * Smartly parses raw text content (from PDF extraction, CSV, or pasted text)
 * into structured student records. Handles tabular columns (tab, pipe, comma)
 * and INACAP PDF table structures.
 */
export function parseStudentRosterText(rawText: string): ParsedStudent[] {
  const lines = rawText.split(/\r?\n/);
  const students: ParsedStudent[] = [];
  const seenEmails = new Set<string>();

  const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Ignore headers and PDF footers
    const lowerLine = trimmed.toLowerCase();
    if (
      (lowerLine.includes('nombre') && lowerLine.includes('correo')) ||
      lowerLine.includes('tcpdf') ||
      lowerLine.includes('página') ||
      lowerLine.includes('page ') ||
      lowerLine.includes('powered by')
    ) {
      continue;
    }

    const emailMatch = trimmed.match(emailRegex);
    if (!emailMatch) continue;

    const email = emailMatch[0].toLowerCase();
    if (seenEmails.has(email)) continue;

    // Extract text before email
    const emailIndex = trimmed.indexOf(emailMatch[0]);
    const namePart = trimmed.substring(0, emailIndex).trim();

    if (!namePart) continue;

    let firstName = '';
    let lastName = '';

    // Check if line contains tab separators (\t) or pipe (|) or comma (,)
    if (namePart.includes('\t')) {
      const parts = namePart.split('\t').map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        firstName = parts[0];
        lastName = parts.slice(1).join(' ');
      }
    } else if (namePart.includes('|')) {
      const parts = namePart.split('|').map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        firstName = parts[0];
        lastName = parts.slice(1).join(' ');
      }
    } else if (namePart.includes(',')) {
      const parts = namePart.split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        // e.g. "Aguilera Torres, Ian Bryan"
        lastName = parts[0];
        firstName = parts[1];
      }
    }

    // Fallback: Smart name/surname splitting based on email hint or Chilean 2-surname structure
    if (!firstName || !lastName) {
      const words = namePart.split(/\s+/).filter(Boolean);
      
      // Try email hint matching (e.g. ian.aguilera02 -> ian = first name, aguilera = surname)
      const emailUser = email.split('@')[0].replace(/[0-9_.-]+$/, '');
      const emailParts = emailUser.split(/[._-]/).filter(Boolean);
      
      if (emailParts.length >= 2) {
        const surnameHint = emailParts[1].toLowerCase();
        const matchIndex = words.findIndex(w => cleanString(w).toLowerCase() === cleanString(surnameHint));
        if (matchIndex > 0) {
          firstName = words.slice(0, matchIndex).join(' ');
          lastName = words.slice(matchIndex).join(' ');
        }
      }

      // Default split for Chilean names: last 2 words are surnames, preceding words are given names
      if (!firstName || !lastName) {
        if (words.length >= 4) {
          firstName = words.slice(0, words.length - 2).join(' ');
          lastName = words.slice(words.length - 2).join(' ');
        } else if (words.length === 3) {
          firstName = `${words[0]} ${words[1]}`;
          lastName = words[2];
        } else if (words.length === 2) {
          firstName = words[0];
          lastName = words[1];
        } else {
          firstName = words[0] || 'Estudiante';
          lastName = 'Inacap';
        }
      }
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const password = generateStudentPassword(firstName, lastName);

    seenEmails.add(email);
    students.push({
      firstName,
      lastName,
      fullName,
      email,
      username: email,
      password,
    });
  }

  return students;
}

/**
 * Reads text content from a File (.pdf, .csv, .txt, etc.)
 */
export async function readRosterFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return parsePdfFileContent(file);
  }

  // Fallback for CSV, TXT, etc.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

/**
 * Extract PDF text page-by-page using PDF.js library with line position grouping
 */
async function parsePdfFileContent(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    const pdfDoc = await loadingTask.promise;

    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Group text items by Y position (line position)
      const lineMap = new Map<number, { x: number; text: string }[]>();

      for (const item of textContent.items as any[]) {
        if (!item.str || !item.str.trim()) continue;

        // Round Y coordinate to group items on roughly the same line
        const y = Math.round(item.transform[5] * 2) / 2;
        const x = item.transform[4];

        if (!lineMap.has(y)) {
          lineMap.set(y, []);
        }
        lineMap.get(y)!.push({ x, text: item.str });
      }

      // Sort lines top-to-bottom (descending Y)
      const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);

      for (const y of sortedY) {
        // Sort items on the line left-to-right (ascending X)
        const items = lineMap.get(y)!.sort((a, b) => a.x - b.x);
        
        // Join with tab if items have horizontal gap (tabular columns), otherwise space
        let lineText = '';
        for (let i = 0; i < items.length; i++) {
          if (i > 0) {
            const gap = items[i].x - items[i - 1].x;
            lineText += gap > 80 ? '\t' : ' ';
          }
          lineText += items[i].text;
        }
        pageTexts.push(lineText);
      }
    }

    return pageTexts.join('\n');
  } catch (err) {
    console.warn('PDF.js parsing failed, using fallback stream reader:', err);
    return parsePdfFallbackRaw(file);
  }
}

/**
 * Fallback PDF raw text extractor
 */
async function parsePdfFallbackRaw(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const decoder = new TextDecoder('latin1');
  const rawString = decoder.decode(bytes);

  const textMatches = rawString.match(/\(([^)]+)\)\s*(?:Tj|TJ|'|")/g);
  if (textMatches && textMatches.length > 0) {
    return textMatches.map(m => m.replace(/^\(/, '').replace(/\)\s*(?:Tj|TJ|'|")?$/, '')).join(' ');
  }
  return rawString;
}
