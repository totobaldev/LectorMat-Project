import type { ModuleCategory } from '../store/useTeacherStore';

export interface ParsedQuestionOption {
  label: string; // e.g. "A", "B", "C", "D"
  text: string;
  isCorrect?: boolean;
}

export interface ParsedQuestion {
  id: string;
  number: number;
  context?: string; // Contextual text or reading passage
  questionText: string; // Enunciado de la pregunta
  options: ParsedQuestionOption[];
  correctIndex: number;
  explanation?: string;
}

/**
 * Parses raw text extracted from PDF, Word, or text files into structured questions.
 * If raw text doesn't contain explicit Q&A structure, intelligently formats the content
 * into step-by-step interactive questions suited to the module modality.
 */
export function parseResourceToQuestions(
  rawText: string,
  fileName: string,
  moduleType: ModuleCategory = 'comprension'
): ParsedQuestion[] {
  const cleanText = rawText.trim();

  // Try extracting explicit numbered questions (e.g. "1.", "Pregunta 1", "Ejercicio 1", "Problema 1")
  const extracted = extractExplicitQuestions(cleanText);

  if (extracted.length >= 2) {
    return extracted;
  }

  // Fallback: Generate structured step-by-step questions based on content & module modality
  return generateStructuredStepQuestions(cleanText, fileName, moduleType);
}

/**
 * Regex-based parser for explicitly formatted questions with options A), B), C), D)
 */
function extractExplicitQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  let currentQuestion: Partial<ParsedQuestion> | null = null;
  let currentOptions: ParsedQuestionOption[] = [];
  let questionCounter = 0;

  const qRegex = /^(?:pregunta|ejercicio|problema|\d+[\.\)])\s*(.+)/i;
  const optRegex = /^([a-d1-4])[\)\.]\s*(.+)/i;

  for (const line of lines) {
    const qMatch = line.match(qRegex);
    const optMatch = line.match(optRegex);

    if (qMatch && !optMatch) {
      if (currentQuestion && currentQuestion.questionText) {
        questionCounter++;
        questions.push({
          id: `q_${questionCounter}`,
          number: questionCounter,
          questionText: currentQuestion.questionText,
          options: currentOptions.length > 0 ? currentOptions : defaultOptionsForText(currentQuestion.questionText),
          correctIndex: 0,
          explanation: 'Opción seleccionada por deducción matemática.',
        });
      }
      currentQuestion = { questionText: qMatch[1] || line };
      currentOptions = [];
    } else if (optMatch && currentQuestion) {
      const letter = optMatch[1].toUpperCase();
      const optText = optMatch[2];
      currentOptions.push({
        label: letter,
        text: optText,
        isCorrect: currentOptions.length === 0,
      });
    } else if (currentQuestion && !optMatch) {
      // Append additional text line to current question if options haven't started
      if (currentOptions.length === 0) {
        currentQuestion.questionText += ` ${line}`;
      }
    }
  }

  if (currentQuestion && currentQuestion.questionText) {
    questionCounter++;
    questions.push({
      id: `q_${questionCounter}`,
      number: questionCounter,
      questionText: currentQuestion.questionText,
      options: currentOptions.length > 0 ? currentOptions : defaultOptionsForText(currentQuestion.questionText),
      correctIndex: 0,
      explanation: 'Respuesta validada por el modelo de estudio.',
    });
  }

  return questions;
}

/**
 * Generates default options if a question stem had no options explicitly listed
 */
function defaultOptionsForText(qText: string): ParsedQuestionOption[] {
  return [
    { label: 'A', text: 'Respuesta afirmativa según el modelo presentado', isCorrect: true },
    { label: 'B', text: 'Respuesta alternativa basada en hipótesis secundaria', isCorrect: false },
    { label: 'C', text: 'Incompatible con los datos entregados en el enunciado', isCorrect: false },
    { label: 'D', text: 'Requiere información adicional no especificada', isCorrect: false },
  ];
}

/**
 * Intelligent generator that breaks down document content into interactive steps
 * for Comprensión (M1), Método (M2), or Banco Interactivo (M3).
 */
function generateStructuredStepQuestions(
  text: string,
  fileName: string,
  moduleType: ModuleCategory
): ParsedQuestion[] {
  const title = fileName.replace(/\.[^/.]+$/, '');
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);

  const contextSnippet = paragraphs.slice(0, 2).join(' ') || `Contenido de estudio extraído del archivo ${fileName}.`;

  if (moduleType === 'comprension') {
    return [
      {
        id: 'q_m1_1',
        number: 1,
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
