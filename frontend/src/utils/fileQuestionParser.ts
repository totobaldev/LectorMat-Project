import type { ModuleCategory } from '../store/useTeacherStore';
import mammoth from 'mammoth';
import { readRosterFile } from './pdfParser';

/**
 * Supported question typologies across educational resources.
 */
export type QuestionType = 'multiple-choice' | 'true-false' | 'open-reflection';

export interface ParsedQuestionOption {
  label: string; // e.g. "A", "B", "C", "D"
  text: string;
  isCorrect?: boolean;
}

export interface ParsedQuestion {
  id: string;
  number: number;
  type?: QuestionType;
  code?: string; // Curricular code or problem code (e.g. "G01", "D01", "1")
  context?: string; // Contextual text, reading passage, or technical setup
  questionText: string; // Enunciado o consigna directa de la pregunta
  options: ParsedQuestionOption[];
  correctIndex: number;
  explanation?: string; // Retroalimentación pedagógica y justificación
  level?: string; // Nivel cognitivo o fase: "Literal", "Inferencial", "Crítico", etc.
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAPA 0: EXTRACCIÓN DE TEXTO BINARIO (Word DOCX / PDF / TXT)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extracts full raw text from uploaded files (PDF via PDF.js, Word DOCX via Mammoth, or native FileReader).
 * Operates 100% on the client browser without server overhead.
 */
export async function readDocumentText(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  // 1. Word Documents (.docx)
  if (ext === 'docx') {
    try {
      const buffer = await file.arrayBuffer();
      const res = await mammoth.extractRawText({ arrayBuffer: buffer });
      if (res && res.value && res.value.trim().length > 0) {
        return res.value;
      }
    } catch (err) {
      console.warn('[DOCX Extraction Error] attempting fallback:', err);
    }
  }

  // 2. PDF Documents or text files via readRosterFile (PDF.js coordinate grouping)
  try {
    const text = await readRosterFile(file);
    if (text && text.trim().length > 0) {
      return text;
    }
  } catch (err) {
    console.warn('[Document Read Error]:', err);
  }

  // 3. Native FileReader fallback for plain text formats
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAPA 1: PRE-SANITIZACIÓN Y NORMALIZACIÓN DEL TEXTO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sanitizes and normalizes the input document text into a standardized format.
 * - Normalizes Windows/Unix line breaks (\r\n -> \n) and strips zero-width/unicode artifacts.
 * - Standardizes answer keys and feedback headers with checkmarks or caps.
 * - Converts lowercase option prefixes (a), b), etc.) to uppercase (A), B)).
 * - Unpacks inline options into distinct line entries.
 * - Unifies curricular codes (e.g. G01 · Inicial) to a homogeneous 'Problema G01 ·' prefix.
 * - Merges standalone problem numbers and titles on separated lines (e.g. 'Problema 1\nEl sensor').
 */
export function sanitizeAndNormalizeText(rawText: string): string {
  if (!rawText) return '';

  let text = rawText
    // 1.1 Saltos de línea y caracteres invisibles
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ');

  // 1.2 Normalizar prefijos de respuesta correcta con caracteres especiales (✔, ✓, ✅, ☑, mayúsculas sostenidas)
  text = text.replace(
    /^[ \t]*[✔✓✅☑\*\-•]?\s*(?:RESPUESTA\s+CORRECTA|Respuesta\s+correcta|RESPUESTA|Respuesta|CLAVE|Clave)\s*[:\-–—]\s*/gmi,
    'Respuesta correcta: '
  );

  // 1.3 Normalizar prefijos de retroalimentación
  text = text.replace(
    /^[ \t]*[✔✓✅☑\*\-•]?\s*(?:RETROALIMENTACI[OÓ]N(?:\s+SI\s+ELEGISTE[^\n:]*)?|Retroalimentaci[oó]n(?:\s+si\s+elegiste[^\n:]*)?)\s*[:\-–—]\s*/gmi,
    'Retroalimentación: '
  );

  // 1.4 Normalizar prefijos de soluciones y justificaciones
  text = text.replace(
    /^[ \t]*[✔✓✅☑\*\-•]?\s*(?:SOLUCI[OÓ]N(?:\s+DETALLADA)?|Soluci[oó]n(?:\s+detallada)?|JUSTIFICACI[OÓ]N|Justificaci[oó]n|EXPLICACI[OÓ]N|Explicaci[oó]n)\s*[:\-–—]\s*/gmi,
    'Solución: '
  );

  // 1.5 Normalizar opciones: convertir a), (a), a. a mayúscula A) al inicio de línea
  text = text.replace(/^[ \t]*\(?([a-eA-E])\)?[ \t]*[\.\)\]\-–—][ \t]+/gm, (_, letter) => {
    return `${letter.toUpperCase()}) `;
  });

  // 1.6 Desglosar opciones inline colocadas en la misma línea (ej: "A) 10   B) 20   C) 30")
  text = text.replace(/([^\n])\s{2,}([B-Eb-e])[\)\.\-–—]\s+/g, (_, prev, letter) => {
    return `${prev}\n${letter.toUpperCase()}) `;
  });

  // 1.7 Normalizar códigos curriculares (Guía 1: G01 · Inicial, D01 · Intermedio, E01 · ...)
  // Transforma: ^(G01) · -> Problema G01 ·
  text = text.replace(/^[ \t]*([GDE]\d{1,3})\s*[·•\-\.][ \t]*/gm, 'Problema $1 · ');

  // 1.8 Unificar títulos de problemas que vienen en línea separada y sin punto (Guía 2)
  // "Problema 1\nEl sensor de distancia" -> "Problema 1. El sensor de distancia"
  text = text.replace(
    /^(Problema\s+[A-Za-z0-9]+)[ \t]*\n[ \t]*([^\n\r]+)/gm,
    (match, header, nextLine) => {
      const trimmedNext = nextLine.trim();
      // No unificar si la siguiente línea es una opción, respuesta, o un nuevo delimitador de ítem
      if (
        trimmedNext.length > 85 ||
        /^(?:[A-E]\)|Respuesta correcta:|Retroalimentación:|Solución:|Problema|Pregunta|Ejercicio|Actividad|Caso|Ítem|Item|\d+[\.\)])/i.test(
          trimmedNext
        )
      ) {
        return match;
      }
      const cleanHeader = header.trim();
      if (cleanHeader.endsWith('.')) {
        return `${cleanHeader} ${trimmedNext}`;
      }
      return `${cleanHeader}. ${trimmedNext}`;
    }
  );

  return text;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAPA 2: SEGMENTACIÓN POR BLOQUES AISLADOS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Divides the normalized text into standalone problem/question blocks using lookahead regex.
 * Guarantees that parsing failure in one block does not cascade into or contaminate neighboring questions.
 */
export function segmentIntoQuestionBlocks(text: string): string[] {
  if (!text.trim()) return [];

  // Detectar si el documento utiliza palabras clave estructurales
  const hasKeywordDelimiters = /^[ \t]*(?:Problema|Pregunta|Ejercicio|Actividad|Caso|Ítem|Item)\s+[A-Za-z0-9]+/mi.test(text);

  let delimiterPattern: RegExp;
  if (hasKeywordDelimiters) {
    // Si contiene palabras clave de enunciado, nos apoyamos en ellas para evitar que
    // enumeraciones secundarias dentro de un problema corten el bloque.
    delimiterPattern = /(?=^[ \t]*(?:(?:Problema|Pregunta|Ejercicio|Actividad|Caso|Ítem|Item)\s+[A-Za-z0-9]+|[GDE]\d{1,3}\s*·))/mi;
  } else {
    // Fallback: Si el documento solo cuenta con listas numeradas (1. , 2) , etc.)
    delimiterPattern = /(?=^[ \t]*(?:(?:Problema|Pregunta|Ejercicio|Actividad|Caso|Ítem|Item)\s+[A-Za-z0-9]+|[GDE]\d{1,3}\s*·|\d+[\.\)]\s+))/mi;
  }

  const rawBlocks = text.split(delimiterPattern);

  // Filtrar bloques vacíos o preámbulos iniciales que no sean preguntas
  return rawBlocks
    .map((b) => b.trim())
    .filter((b) => {
      if (!b) return false;
      return /^(?:(?:Problema|Pregunta|Ejercicio|Actividad|Caso|Ítem|Item)\s+[A-Za-z0-9]+|[GDE]\d{1,3}\s*·|\d+[\.\)]\s+)/i.test(b);
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAPA 3: EXTRACCIÓN AISLADA POR BLOQUE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parses an isolated block into a structured ParsedQuestion object.
 * Extracts stem, options (2-5 options), correct answer letter, and pedagogical feedback.
 * Detects development/open reflection exercises (e.g. lines of underscores '___') and types them as 'open-reflection'.
 */
export function parseSingleBlock(
  blockText: string,
  questionIndex: number,
  _fileName?: string
): ParsedQuestion | null {
  if (!blockText.trim()) return null;

  // 3.1 Extraer clave de respuesta y retroalimentación
  let correctKey: string | null = null;
  let answerInlineFeedback = '';
  let explicitFeedback = '';

  // Buscar respuesta correcta con letra identificadora (ej: "Respuesta correcta: C", "Respuesta correcta: A) ...")
  const answerMatch = blockText.match(
    /^[ \t]*Respuesta correcta:\s*\(?([A-Ea-e])\)?(?:[ \t]*[\)\.\-–—]?[ \t]*([^\n\r]*)|$)/mi
  );

  if (answerMatch) {
    correctKey = answerMatch[1].toUpperCase();
    answerInlineFeedback = (answerMatch[2] || '').trim();
  } else {
    // En preguntas abiertas de reflexión, la respuesta correcta puede ser una frase modelo sin letra
    const openAnswerMatch = blockText.match(
      /^[ \t]*Respuesta correcta:\s*([^\n\r]+)/mi
    );
    if (openAnswerMatch) {
      answerInlineFeedback = openAnswerMatch[1].trim();
    }
  }

  // Buscar sección de retroalimentación / solución / justificación
  const feedbackMatch = blockText.match(
    /(?:^|\n)[ \t]*(?:Retroalimentaci[oó]n|Soluci[oó]n|Explicaci[oó]n|Justificaci[oó]n)\s*[:\-–—]?\s*([\s\S]*)/i
  );

  if (feedbackMatch) {
    explicitFeedback = (feedbackMatch[1] || '').trim();
  }

  // Combinar texto de justificación
  let combinedFeedback = '';
  if (answerInlineFeedback && explicitFeedback) {
    combinedFeedback = `${answerInlineFeedback}\n\n${explicitFeedback}`;
  } else {
    combinedFeedback = explicitFeedback || answerInlineFeedback || 'Respuesta validada por el análisis del enunciado.';
  }

  // 3.2 Segmentar el cuerpo del ítem antes de la sección de respuesta y retroalimentación
  const cutoffRegex = /(?:^|\n)[ \t]*(?:Respuesta correcta:|Retroalimentaci[oó]n:|Soluci[oó]n:)/i;
  const cutoffMatch = blockText.search(cutoffRegex);
  const questionAndOptionsText = cutoffMatch !== -1 ? blockText.substring(0, cutoffMatch) : blockText;

  const lines = questionAndOptionsText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  // 3.3 Extraer alternativas (opciones A a E)
  const firstOptionLineIndex = lines.findIndex((l) => /^[A-E]\)\s+/.test(l));
  const options: ParsedQuestionOption[] = [];

  if (firstOptionLineIndex !== -1) {
    let currentOpt: ParsedQuestionOption | null = null;
    for (let i = firstOptionLineIndex; i < lines.length; i++) {
      const line = lines[i];
      const optMatch = line.match(/^([A-E])\)\s*(.*)/);
      if (optMatch) {
        if (currentOpt) options.push(currentOpt);
        const label = optMatch[1].toUpperCase();
        currentOpt = {
          label,
          text: optMatch[2].trim(),
          isCorrect: correctKey ? label === correctKey : false,
        };
      } else if (currentOpt) {
        // Línea de continuación de la opción
        currentOpt.text += ' ' + line;
      }
    }
    if (currentOpt) options.push(currentOpt);
  }

  // 3.4 Detección tipológica (Múltiple, Verdadero/Falso, o Reflexión/Desarrollo)
  const hasBlankLines = /_{3,}/.test(blockText);
  const hasFewOrNoOptions = options.length < 2;
  const isOpenReflection = hasBlankLines || hasFewOrNoOptions;

  let questionType: QuestionType = 'multiple-choice';

  if (isOpenReflection) {
    questionType = 'open-reflection';
    // Para garantizar interactividad fluida en InteractiveQuestionRunner, instanciamos opciones de reflexión
    if (options.length === 0) {
      options.push(
        {
          label: 'A',
          text: 'He completado mi desarrollo / reflexión personal',
          isCorrect: true,
        },
        {
          label: 'B',
          text: 'Revisar retroalimentación y solución docente',
          isCorrect: true,
        }
      );
    }
  } else if (options.length === 2 && options.some((o) => /verdadero|falso/i.test(o.text))) {
    questionType = 'true-false';
  }

  // 3.5 Sincronizar índice correcto
  let correctIndex = 0;
  if (correctKey) {
    const foundIdx = options.findIndex((o) => o.label === correctKey);
    if (foundIdx !== -1) {
      correctIndex = foundIdx;
      options.forEach((o, idx) => {
        o.isCorrect = idx === foundIdx;
      });
    }
  } else if (options.length > 0) {
    options[0].isCorrect = true;
    correctIndex = 0;
  }

  // 3.6 Header, Contexto y Enunciado
  const stemLines = firstOptionLineIndex !== -1 ? lines.slice(0, firstOptionLineIndex) : lines;
  const headerLine = stemLines[0] || '';

  // Extraer código curricular o número
  let code: string | undefined = undefined;
  const codeMatch = headerLine.match(/^(?:Problema|Pregunta|Ejercicio|Actividad|Caso|Ítem|Item)\s+([A-Za-z0-9]+)/i);
  if (codeMatch) {
    code = codeMatch[1];
  }

  // Extraer título limpio del encabezado si existe
  const rawTitle = headerLine
    .replace(/^(?:Problema|Pregunta|Ejercicio|Actividad|Caso|Ítem|Item)\s+[A-Za-z0-9]+[\.\s]*/i, '')
    .replace(/^[·•\-\.]\s*/, '')
    .trim();

  // Filtrar líneas de formato vacío o rayas de desarrollo puras (___)
  const bodyLines = stemLines.slice(1);
  const meaningfulBodyLines = bodyLines.filter((l) => !/^[_\s–—\-]{3,}$/.test(l));

  let context: string | undefined = undefined;
  let questionText = '';

  if (meaningfulBodyLines.length === 0) {
    questionText = rawTitle || headerLine;
  } else if (meaningfulBodyLines.length === 1) {
    questionText = meaningfulBodyLines[0];
    if (rawTitle) {
      context = rawTitle;
    }
  } else {
    // Buscar si hay signo de interrogación inicial ¿
    const qMarkIdx = meaningfulBodyLines.findIndex((l) => l.includes('¿'));
    if (qMarkIdx !== -1) {
      const contextLines = meaningfulBodyLines.slice(0, qMarkIdx);
      const promptLines = meaningfulBodyLines.slice(qMarkIdx);
      const joinedContext = contextLines.join(' ').trim();
      context = rawTitle ? (joinedContext ? `${rawTitle}. ${joinedContext}` : rawTitle) : joinedContext;
      questionText = promptLines.join(' ').trim();
    } else {
      // En guías sin signos ¿?, tomar la última línea como prompt de acción y las anteriores como contexto
      questionText = meaningfulBodyLines[meaningfulBodyLines.length - 1].trim();
      const prevContext = meaningfulBodyLines.slice(0, meaningfulBodyLines.length - 1).join(' ').trim();
      context = rawTitle ? (prevContext ? `${rawTitle}. ${prevContext}` : rawTitle) : prevContext;
    }
  }

  return {
    id: `q_${code || questionIndex}`,
    number: questionIndex,
    code,
    type: questionType,
    context: context && context.trim() ? context.trim() : undefined,
    questionText: questionText.trim() || headerLine,
    options,
    correctIndex,
    explanation: combinedFeedback,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAPA 4: GUARDRAIL DE FALLBACK Y PIPELINE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Detects structural cognitive level headers and section divisions in pedagogical guides:
 * - "■  NIVEL LITERAL", "Nivel Literal", "Literal"
 * - "■  NIVEL INFERENCIAL", "Nivel Inferencial", "Inferencial"
 * - "■  NIVEL CRÍTICO", "Nivel Crítico", "Crítico"
 * - "Parte I: Gramática", "Parte II: Extracción de Datos", "Parte III: Especialidad"
 */
export function extractSectionMarkers(text: string): { level: string; index: number }[] {
  const markers: { level: string; index: number }[] = [];
  const regex = /(?:^[ \t]*[■•\-\*]?\s*(?:NIVEL|Nivel|PARTE|Parte\s+[I|V|X\d]+)\s*[:\-–—\s]*([^\n\r]+)|(?:Taxonom[ií]a\s+cognitiva\s*:\s*([^\n\r]+)))/gmi;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    const rawMatch = (m[1] || m[2] || '').trim();

    // Ignore lines that mention all 3 at once (e.g. "Taxonomía cognitiva: Literal · Inferencial · Crítico")
    if (
      (/literal/i.test(rawMatch) && /inferencial/i.test(rawMatch)) ||
      (/inferencial/i.test(rawMatch) && /cr[ií]tico/i.test(rawMatch))
    ) {
      continue;
    }

    let levelName = rawMatch;
    if (/literal/i.test(rawMatch)) levelName = 'Literal';
    else if (/inferencial/i.test(rawMatch)) levelName = 'Inferencial';
    else if (/cr[ií]tico/i.test(rawMatch)) levelName = 'Crítico';
    else if (/gram[aá]tica/i.test(rawMatch)) levelName = 'Gramática Simple';
    else if (/extracci[oó]n/i.test(rawMatch)) levelName = 'Extracción de Datos';
    else if (/especialidad/i.test(rawMatch)) levelName = 'Especialidad';

    markers.push({ level: levelName, index: m.index });
  }

  return markers;
}

/**
 * Main parser entry point.
 * Follows the 4-layer decoupled architecture:
 * 1. Sanitization & Normalization
 * 2. Block Segmentation
 * 3. Isolated Block Extraction with Cognitive Level Attribution
 * 4. Fallback Guardrail (only invokes generateStructuredStepQuestions if parsedQuestions is empty)
 */
export function parseResourceToQuestions(
  rawText: string,
  fileName: string,
  moduleType: ModuleCategory = 'comprension'
): ParsedQuestion[] {
  const cleanRaw = (rawText || '').trim();
  if (!cleanRaw) {
    return generateStructuredStepQuestions('', fileName, moduleType);
  }

  // 1. Capa 1: Sanitización y Normalización
  const normalizedText = sanitizeAndNormalizeText(cleanRaw);
  const sectionMarkers = extractSectionMarkers(normalizedText);

  // 2. Capa 2: Segmentación por Bloques Aislados
  const rawBlocks = segmentIntoQuestionBlocks(normalizedText);

  // 3. Capa 3: Extracción Aislada por Bloque y Asignación de Nivel Cognitivo
  const parsedQuestions: ParsedQuestion[] = [];
  let searchPos = 0;

  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[i];
    const blockSnippet = block.slice(0, 40);
    const pos = normalizedText.indexOf(blockSnippet, searchPos);
    if (pos !== -1) {
      searchPos = pos + block.length;
    }

    // Determinar nivel cognitivo a partir de los marcadores estructurales del documento
    let assignedLevel: string | undefined = undefined;
    if (sectionMarkers.length > 0) {
      const activeMarkers = sectionMarkers.filter((m) => m.index <= (pos !== -1 ? pos : 0));
      if (activeMarkers.length > 0) {
        assignedLevel = activeMarkers[activeMarkers.length - 1].level;
      } else {
        assignedLevel = sectionMarkers[0].level;
      }
    }

    const parsed = parseSingleBlock(block, parsedQuestions.length + 1, fileName);
    if (parsed) {
      if (assignedLevel) {
        parsed.level = assignedLevel;
      }
      parsedQuestions.push(parsed);
    }
  }

  // Si no se encontraron encabezados de nivel explícitos pero hay múltiples preguntas (>= 3):
  // Particionar canónicamente en los 3 niveles de la taxonomía: Literal, Inferencial, Crítico
  if (parsedQuestions.length >= 3 && !parsedQuestions.some((q) => Boolean(q.level))) {
    const total = parsedQuestions.length;
    const third = Math.floor(total / 3);
    const rem = total % 3;
    const p1End = third + (rem === 2 ? 1 : 0);
    const p2End = p1End + third + (rem >= 1 ? 1 : 0);

    parsedQuestions.forEach((q, idx) => {
      if (idx < p1End) {
        q.level = 'Literal';
      } else if (idx < p2End) {
        q.level = 'Inferencial';
      } else {
        q.level = 'Crítico';
      }
    });
  }

  // 4. Capa 4: Guardrail de Fallback
  // Solo conmutar a generador sintético si tras procesar todos los bloques no se extrajo ninguna pregunta
  if (parsedQuestions.length >= 1) {
    return parsedQuestions;
  }

  return generateStructuredStepQuestions(cleanRaw, fileName, moduleType);
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERADOR SINTÉTICO (FALLBACK PARA MATERIAL TEÓRICO / EXPOSITIVO)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generates fallback options if a paragraph analysis needs plausible numerical or conceptual distractors.
 */
function defaultOptionsForText(qText: string): ParsedQuestionOption[] {
  const numbers = qText.match(/-?\d+(?:[.,]\d+)?/g);
  if (numbers && numbers.length > 0) {
    const num = parseFloat(numbers[0].replace(',', '.'));
    if (!isNaN(num) && num !== 0) {
      const v1 = num;
      const v2 = Math.round(num * 1.5 * 100) / 100;
      const v3 = Math.round(num * 0.5 * 100) / 100;
      const v4 = Math.round(num * 2 * 100) / 100;
      return [
        { label: 'A', text: `${v1} (según las condiciones iniciales del planteamiento)`, isCorrect: true },
        { label: 'B', text: `${v2} (sobrestimando la razón de cambio calculada)`, isCorrect: false },
        { label: 'C', text: `${v3} (desestimando el factor multiplicativo asociado)`, isCorrect: false },
        { label: 'D', text: `${v4} (duplicando el valor nominal)`, isCorrect: false },
      ];
    }
  }

  return [
    { label: 'A', text: 'Resultado coherente con las condiciones planteadas en el modelo', isCorrect: true },
    { label: 'B', text: 'Valor obtenido omitiendo las restricciones del problema', isCorrect: false },
    { label: 'C', text: 'Incompatible con las variables descritas en la sección', isCorrect: false },
    { label: 'D', text: 'Requiere parámetros adicionales no detallados en el texto', isCorrect: false },
  ];
}

/**
 * Generator that creates structured step-by-step reading checkpoints for theoretical texts without explicit items.
 */
function generateStructuredStepQuestions(
  text: string,
  fileName: string,
  moduleType: ModuleCategory
): ParsedQuestion[] {
  const title = (fileName || 'Material de Estudio').replace(/\.[^/.]+$/, '');

  const paragraphs = (text || '')
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 30);

  if (paragraphs.length >= 2) {
    return paragraphs.map((para, idx) => {
      const snippet = para.length > 180 ? para.substring(0, 180) + '...' : para;
      return {
        id: `q_doc_${idx + 1}`,
        number: idx + 1,
        type: 'multiple-choice',
        context: snippet,
        questionText: `Pregunta ${idx + 1} (${title}): Respecto al análisis presentado en esta sección, ¿cuál es la deducción o cálculo clave correspondiente?`,
        options: defaultOptionsForText(para),
        correctIndex: 0,
        explanation: 'Deducción validada por el análisis directo del texto presentado.',
      };
    });
  }

  const contextSnippet = paragraphs[0] || `Contenido de estudio extraído del archivo ${fileName}.`;

  if (moduleType === 'comprension') {
    return [
      {
        id: 'q_m1_1',
        number: 1,
        level: 'Literal',
        type: 'multiple-choice',
        context: contextSnippet,
        questionText: `Según el documento "${title}", ¿cuál es el objetivo principal del análisis de variables presentado?`,
        options: [
          { label: 'A', text: 'Identificar la relación de causa-efecto entre las variables de estudio', isCorrect: true },
          { label: 'B', text: 'Eliminar los datos atípicos sin realizar análisis previo', isCorrect: false },
          { label: 'C', text: 'Sustituir el cálculo matemático por estimaciones arbitrarias', isCorrect: false },
          { label: 'D', text: 'Modificar las constantes del problema de forma aleatoria', isCorrect: false },
        ],
        correctIndex: 0,
        explanation: 'En la comprensión lectora aplicada, el primer paso es establecer la relación lógica entre variables.',
      },
      {
        id: 'q_m1_2',
        number: 2,
        level: 'Inferencial',
        type: 'multiple-choice',
        context: contextSnippet,
        questionText: '¿Qué información o dato clave es imprescindible extraer antes de iniciar el cálculo?',
        options: [
          { label: 'A', text: 'La variable independiente y sus unidades de medida asociadas', isCorrect: true },
          { label: 'B', text: 'El número total de páginas de la guía técnica', isCorrect: false },
          { label: 'C', text: 'El formato de archivo en que se almacenan los datos', isCorrect: false },
          { label: 'D', text: 'La fecha de publicación del texto original', isCorrect: false },
        ],
        correctIndex: 0,
        explanation: 'Las unidades de medida determinan la escala y coherencia de las ecuaciones del modelo.',
      },
      {
        id: 'q_m1_3',
        number: 3,
        level: 'Crítico',
        type: 'multiple-choice',
        context: contextSnippet,
        questionText: '¿Cuál de las siguientes conclusiones se deduce del texto revisado?',
        options: [
          { label: 'A', text: 'El comportamiento del sistema depende directamente de los parámetros iniciales', isCorrect: true },
          { label: 'B', text: 'Las funciones del modelo son independientes del contexto planteado', isCorrect: false },
          { label: 'C', text: 'No existe relación cuantitativa entre los componentes del problema', isCorrect: false },
          { label: 'D', text: 'Los valores calculados son invariables ante cualquier cambio', isCorrect: false },
        ],
        correctIndex: 0,
        explanation: 'Los valores iniciales condicionan la gráfica y comportamiento de la función.',
      },
    ];
  }

  if (moduleType === 'metodo') {
    return [
      {
        id: 'q_m2_1',
        number: 1,
        level: 'Literal',
        type: 'multiple-choice',
        context: contextSnippet,
        questionText: `Paso 1 del Método en "${title}": ¿Qué condición determina la elección del árbol de decisión?`,
        options: [
          { label: 'A', text: 'Verificar si la razón de cambio entre los intervalos es constante o exponencial', isCorrect: true },
          { label: 'B', text: 'Seleccionar el método por preferencia sin evaluar las diferencias', isCorrect: false },
          { label: 'C', text: 'Aplicar la fórmula más extensa sin simplificar términos', isCorrect: false },
          { label: 'D', text: 'Sumar todos los términos ignorando los exponentes', isCorrect: false },
        ],
        correctIndex: 0,
        explanation: 'El árbol de decisión evalúa primero el tipo de crecimiento antes de estructurar la fórmula.',
      },
      {
        id: 'q_m2_2',
        number: 2,
        level: 'Inferencial',
        type: 'multiple-choice',
        context: contextSnippet,
        questionText: 'Paso 2 del Método: Al despejar la incógnita en la ecuación planteada, ¿qué regla matemática debemos aplicar?',
        options: [
          { label: 'A', text: 'Aplicar la operación inversa correspondiente a cada miembro de la igualdad', isCorrect: true },
          { label: 'B', text: 'Multiplicar ambos lados por cero para anular denominadores', isCorrect: false },
          { label: 'C', text: 'Invertir arbitrariamente el signo de los términos independientes', isCorrect: false },
          { label: 'D', text: 'Ignorar los términos exponenciales durante el procedimiento', isCorrect: false },
        ],
        correctIndex: 0,
        explanation: 'Las operaciones inversas conservan la equivalencia matemática en cada paso del despeje.',
      },
      {
        id: 'q_m2_3',
        number: 3,
        level: 'Crítico',
        type: 'multiple-choice',
        context: contextSnippet,
        questionText: 'Paso 3 del Método: ¿Cómo validamos que la solución encontrada es matemáticamente correcta?',
        options: [
          { label: 'A', text: 'Reemplazando el valor obtenido en la ecuación inicial y verificando la igualdad', isCorrect: true },
          { label: 'B', text: 'Aceptando el resultado sin comprobar las restricciones del dominio', isCorrect: false },
          { label: 'C', text: 'Cambiando las unidades de medida en el resultado final', isCorrect: false },
          { label: 'D', text: 'Dividiendo la respuesta entre la cantidad de variables', isCorrect: false },
        ],
        correctIndex: 0,
        explanation: 'La sustitución directa en la ecuación original es la prueba definitiva de validez.',
      },
    ];
  }

  // Banco Interactivo (M3)
  return [
    {
      id: 'q_m3_1',
      number: 1,
      level: 'Literal',
      type: 'multiple-choice',
      context: contextSnippet,
      questionText: `Problema 1 (${title}): Calcule el valor de la función cuando la variable independiente se incrementa en un 50%.`,
      options: [
        { label: 'A', text: 'Se multiplica el valor base por el factor correspondiente a 1.50', isCorrect: true },
        { label: 'B', text: 'Se resta 0.50 al total sin modificar el exponente', isCorrect: false },
        { label: 'C', text: 'El valor se reduce a la mitad independientemente de la tasa', isCorrect: false },
        { label: 'D', text: 'Permanece constante sin ningún cambio significativo', isCorrect: false },
      ],
      correctIndex: 0,
      explanation: 'Un aumento del 50% equivale a multiplicar por el factor relativo (1 + 0.50) = 1.50.',
    },
    {
      id: 'q_m3_2',
      number: 2,
      level: 'Inferencial',
      type: 'multiple-choice',
      context: contextSnippet,
      questionText: 'Problema 2: En una aplicación práctica de especialidad, ¿cuál es el resultado de evaluar la tasa acumulada?',
      options: [
        { label: 'A', text: 'Crece de manera geométrica según la t-ésima potencia de la razón', isCorrect: true },
        { label: 'B', text: 'Decrece linealmente restando un valor fijo en cada periodo', isCorrect: false },
        { label: 'C', text: 'Se oscila periódicamente entre valores positivos y negativos', isCorrect: false },
        { label: 'D', text: 'Tiende a cero en el primer intervalo de tiempo', isCorrect: false },
      ],
      correctIndex: 0,
      explanation: 'Las acumulaciones compuestas siguen un patrón exponencial geométrico.',
    },
    {
      id: 'q_m3_3',
      number: 3,
      level: 'Crítico',
      type: 'multiple-choice',
      context: contextSnippet,
      questionText: 'Problema 3: Si se requiere optimizar el proceso analizado en el recurso, ¿cuál es la mejor decisión técnica?',
      options: [
        { label: 'A', text: 'Ajustar la constante de proporcionalidad para minimizar el margen de error', isCorrect: true },
        { label: 'B', text: 'Ignorar las restricciones operativas del sistema', isCorrect: false },
        { label: 'C', text: 'Incrementar indefinidamente las variables sin control', isCorrect: false },
        { label: 'D', text: 'Omitir la evaluación de resultados al finalizar', isCorrect: false },
      ],
      correctIndex: 0,
      explanation: 'La optimización requiere minimizar el error de ajuste entre el modelo y los datos reales.',
    },
  ];
}
