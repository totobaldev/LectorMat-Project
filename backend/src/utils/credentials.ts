/**
 * Normalizes text removing diacritics (accents) for clean password generation.
 */
function cleanString(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

/**
 * Generates student password according to rule:
 * First Name in UPPERCASE + Main Last Name in lowercase.
 * Example: "Joaquín Alonso", "Albornoz Pino" -> "JOAQUINalbornoz"
 */
export function generateStudentPassword(firstName: string, lastName: string): string {
  const cleanFirst = cleanString(firstName);
  const cleanLast = cleanString(lastName);

  const primaryFirst = cleanFirst.split(/\s+/)[0] || 'ESTUDIANTE';
  const primaryLast = cleanLast.split(/\s+/)[0] || 'lectormat';

  const upperFirst = primaryFirst.toUpperCase();
  const lowerLast = primaryLast.toLowerCase();

  return `${upperFirst}${lowerLast}`;
}

export function parseNameParts(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 4) {
    return { firstName: `${parts[0]} ${parts[1]}`, lastName: parts.slice(2).join(' ') };
  }
  if (parts.length === 3) {
    return { firstName: `${parts[0]} ${parts[1]}`, lastName: parts[2] };
  }
  if (parts.length === 2) {
    return { firstName: parts[0], lastName: parts[1] };
  }
  return { firstName: parts[0] || 'Estudiante', lastName: 'Matriculado' };
}
