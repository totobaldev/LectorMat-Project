// ═══════════════════════════════════════════════════════════════════════════════
// U1 – Funciones Polinómicas: Banco de Preguntas
// Fuente: OneDrive_1_16-9-2026/FUNCIONES POLINOMICAS U1/
// Semanas 1-3 con 10 variantes por módulo (se selecciona 1 representativa)
// ═══════════════════════════════════════════════════════════════════════════════

export type QuestionType = 'numeric' | 'multichoice' | 'short_answer';

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  number: number;
  type: QuestionType;
  context: string;            // Enunciado del problema (lectura)
  questionText: string;       // Pregunta específica
  hint?: string;              // Ayuda de comprensión
  explanation: string;        // Retroalimentación
  points: number;
  // Para multichoice
  options?: QuizOption[];
  // Para numeric
  correctAnswer?: number;
  tolerance?: number;
  // Para short_answer
  acceptedAnswers?: string[];
}

export interface QuizProblem {
  id: string;
  title: string;
  unit: number;
  week: number;
  moduleType: 'comprension' | 'metodo' | 'interactivo';
  totalPoints: number;
  context: string;            // Contexto general del problema
  questions: QuizQuestion[];
}

// ─── SEMANA 1: EL PRECIO DEL COMBUSTIBLE (Función Afín) ─────────────────────

const U1_S1_COMBUSTIBLE: QuizProblem = {
  id: 'u1-s1-combustible',
  title: 'El Precio del Combustible',
  unit: 1,
  week: 1,
  moduleType: 'comprension',
  totalPoints: 25,
  context: 'Si en determinada semana del año (semana 0) el precio de la bencina es $1230 y sabiendo que el fondo de estabilización FEPCO inyecta dinero, de forma que el precio de la bencina no suba más de 10 pesos por semana y suponiendo que en cada semana comienza a subir el máximo posible.',
  questions: [
    {
      id: 'u1s1-q1',
      number: 1,
      type: 'numeric',
      context: 'El precio de la bencina en la semana 0 es $1230 y sube $10 por semana.',
      questionText: 'Complete la tabla: ¿Cuál es el valor de la gasolina en la semana 0?',
      hint: 'El valor en la semana 0 es el precio inicial mencionado en el enunciado.',
      explanation: 'En la semana 0 el precio es el valor inicial: $1230.',
      points: 1,
      correctAnswer: 1230,
      tolerance: 0,
    },
    {
      id: 'u1s1-q2',
      number: 2,
      type: 'numeric',
      context: 'El precio de la bencina en la semana 0 es $1230 y sube $10 por semana.',
      questionText: '¿Cuál es el valor de la gasolina en la semana 1?',
      hint: 'Suma el incremento semanal ($10) al precio inicial.',
      explanation: 'Semana 1: 1230 + 10·1 = $1240.',
      points: 1,
      correctAnswer: 1240,
      tolerance: 0,
    },
    {
      id: 'u1s1-q3',
      number: 3,
      type: 'numeric',
      context: 'El precio de la bencina en la semana 0 es $1230 y sube $10 por semana.',
      questionText: '¿Cuál es el valor de la gasolina en la semana 2?',
      hint: 'Aplica la fórmula f(x) = 10x + 1230 con x = 2.',
      explanation: 'Semana 2: 1230 + 10·2 = $1250.',
      points: 1,
      correctAnswer: 1250,
      tolerance: 0,
    },
    {
      id: 'u1s1-q4',
      number: 4,
      type: 'numeric',
      context: 'El precio de la bencina en la semana 0 es $1230 y sube $10 por semana.',
      questionText: '¿Cuál es el valor de la gasolina en la semana 3?',
      hint: 'Aplica la fórmula f(x) = 10x + 1230 con x = 3.',
      explanation: 'Semana 3: 1230 + 10·3 = $1260.',
      points: 1,
      correctAnswer: 1260,
      tolerance: 0,
    },
    {
      id: 'u1s1-q5',
      number: 5,
      type: 'numeric',
      context: 'El precio de la bencina en la semana 0 es $1230 y sube $10 por semana.',
      questionText: '¿Cuál es el valor de la gasolina en la semana 4?',
      hint: 'Aplica la fórmula f(x) = 10x + 1230 con x = 4.',
      explanation: 'Semana 4: 1230 + 10·4 = $1270.',
      points: 1,
      correctAnswer: 1270,
      tolerance: 0,
    },
    {
      id: 'u1s1-q6',
      number: 6,
      type: 'multichoice',
      context: 'El precio sube linealmente $10 cada semana partiendo de $1230.',
      questionText: '¿Cuál de las gráficas representa mejor el valor de la gasolina en cada semana?',
      hint: 'El precio sube de forma constante ($10 por semana), por lo que la gráfica debe ser una línea recta con pendiente positiva.',
      explanation: 'Como el incremento es constante ($10/semana), el comportamiento es lineal con pendiente positiva. La Gráfica 1 muestra esta línea recta ascendente.',
      points: 3,
      options: [
        { text: 'Gráfica 1: Línea recta ascendente (pendiente positiva)', isCorrect: true },
        { text: 'Gráfica 2: Curva exponencial creciente', isCorrect: false },
        { text: 'Gráfica 3: Línea recta descendente (pendiente negativa)', isCorrect: false },
        { text: 'Gráfica 4: Parábola con vértice máximo', isCorrect: false },
      ],
    },
    {
      id: 'u1s1-q7',
      number: 7,
      type: 'short_answer',
      context: 'El precio sube $10 por semana desde $1230.',
      questionText: 'Represente mediante una expresión algebraica el valor de la gasolina en función de las semanas transcurridas (x). Formato: sin espacios, ej: 2x+1000',
      hint: 'Una función afín tiene la forma f(x) = mx + n, donde m es la pendiente (incremento semanal) y n es el valor inicial.',
      explanation: 'La función es f(x) = 10x + 1230, donde 10 es el incremento semanal y 1230 es el valor inicial.',
      points: 3,
      acceptedAnswers: ['10x+1230', '1230+10x'],
    },
    {
      id: 'u1s1-q8',
      number: 8,
      type: 'numeric',
      context: 'Si el precio de la gasolina en La Serena se modela con f(x) = 6x + 1078.',
      questionText: '¿En qué semana el valor de la gasolina alcanzará un valor aproximado de $1150?',
      hint: 'Despeja x de la ecuación: 1150 = 6x + 1078. Resta 1078 a ambos lados y luego divide por 6.',
      explanation: '1150 = 6x + 1078 → 6x = 72 → x = 12. La gasolina alcanza $1150 en la semana 12.',
      points: 3,
      correctAnswer: 12,
      tolerance: 0,
    },
    {
      id: 'u1s1-q9',
      number: 9,
      type: 'numeric',
      context: 'Si el precio de la gasolina en La Serena se modela con f(x) = 6x + 1078.',
      questionText: 'Si las alzas continúan en forma sostenida, ¿qué valor podría alcanzar la gasolina en la semana 51?',
      hint: 'Evalúa la función en x = 51: f(51) = 6·51 + 1078.',
      explanation: 'f(51) = 6·51 + 1078 = 306 + 1078 = $1384.',
      points: 2,
      correctAnswer: 1384,
      tolerance: 0,
    },
    {
      id: 'u1s1-q10',
      number: 10,
      type: 'short_answer',
      context: 'El valor de la gasolina comienza a bajar 4 pesos todas las semanas iniciando con un valor de $1250.',
      questionText: 'Determine la expresión funcional que modela el precio en función de las semanas transcurridas. Formato: sin espacios, ej: -2x+1000',
      hint: 'La pendiente es negativa (baja $4 por semana) y el valor inicial es $1250. Usa la forma f(x) = mx + n.',
      explanation: 'f(x) = -4x + 1250. La pendiente negativa (-4) indica que el precio baja $4 por semana.',
      points: 3,
      acceptedAnswers: ['-4x+1250', '1250-4x'],
    },
    {
      id: 'u1s1-q11',
      number: 11,
      type: 'numeric',
      context: 'Un cliente consume 20 litros de bencina por semana. La bencina baja $4/semana desde $1250. Complete la tabla de ahorro.',
      questionText: '¿Cuánto dinero ahorró el cliente en la semana 1 por 20 litros?',
      hint: 'En la semana 1 el precio bajó $4. El ahorro por 20 litros = 4 × 20 = $80.',
      explanation: 'Baja de precio semana 1: $4. Ahorro = 4 × 20 litros = $80.',
      points: 1,
      correctAnswer: 80,
      tolerance: 0,
    },
    {
      id: 'u1s1-q12',
      number: 12,
      type: 'numeric',
      context: 'Un cliente consume 20 litros por semana. La bencina baja $4/semana desde $1250.',
      questionText: '¿Cuánto dinero ahorró el cliente en la semana 2 por 20 litros?',
      hint: 'En la semana 2 el precio bajó $8 respecto al inicial. Ahorro = 8 × 20.',
      explanation: 'Baja acumulada semana 2: $8. Ahorro = 8 × 20 = $160.',
      points: 1,
      correctAnswer: 160,
      tolerance: 0,
    },
    {
      id: 'u1s1-q13',
      number: 13,
      type: 'numeric',
      context: 'Un cliente consume 20 litros por semana. La bencina baja $4/semana desde $1250.',
      questionText: '¿Cuál es el total ahorrado durante las 5 semanas?',
      hint: 'Suma todos los ahorros semanales: 80 + 160 + 240 + 320 + 400.',
      explanation: 'Total = 80 + 160 + 240 + 320 + 400 = $1200.',
      points: 1,
      correctAnswer: 1200,
      tolerance: 0,
    },
  ],
};

// ─── SEMANA 2: ALTURA DE UN PROYECTIL (Función Cuadrática) ──────────────────

const U1_S2_PROYECTIL: QuizProblem = {
  id: 'u1-s2-proyectil',
  title: 'Altura de un Proyectil',
  unit: 1,
  week: 2,
  moduleType: 'metodo',
  totalPoints: 25,
  context: 'Un objeto es lanzado hacia arriba desde una cierta altura, llega a un punto donde alcanza una máxima altura y cae al suelo. La función h(t) que modela la altura del objeto (en metros) en un tiempo t (en segundos) está dada por: h(t) = −0,5t² + 4,8t + 18.',
  questions: [
    {
      id: 'u1s2-q1',
      number: 1,
      type: 'numeric',
      context: 'h(t) = −0,5t² + 4,8t + 18 modela la altura del objeto en metros.',
      questionText: '¿Desde qué altura fue lanzado el objeto?',
      hint: 'La altura inicial es h(0). Evalúa la función cuando t = 0.',
      explanation: 'h(0) = −0,5·0² + 4,8·0 + 18 = 18 metros. El objeto fue lanzado desde 18 m de altura.',
      points: 2,
      correctAnswer: 18,
      tolerance: 0,
    },
    {
      id: 'u1s2-q2',
      number: 2,
      type: 'numeric',
      context: 'h(t) = −0,5t² + 4,8t + 18',
      questionText: '¿Cuál es la altura que alcanza el objeto a los 5 segundos del movimiento?',
      hint: 'Evalúa h(5) = −0,5·25 + 4,8·5 + 18.',
      explanation: 'h(5) = −0,5·25 + 24 + 18 = −12,5 + 24 + 18 = 29,5 metros.',
      points: 2,
      correctAnswer: 29.5,
      tolerance: 0.2,
    },
    {
      id: 'u1s2-q3',
      number: 3,
      type: 'numeric',
      context: 'h(t) = −0,5t² + 4,8t + 18. ¿En qué instante de tiempo el objeto se encuentra a una altura de 20 m?',
      questionText: '¿Cuál es el menor valor de tiempo en que el objeto está a 20 m de altura?',
      hint: 'Resuelve 20 = −0,5t² + 4,8t + 18. Es decir: 0,5t² − 4,8t + 2 = 0. Usa la fórmula cuadrática.',
      explanation: 'Resolviendo: t² − 9,6t + 4 = 0. t = (9,6 ± √(92,16 − 16)) / 2 = (9,6 ± 8,72) / 2. Menor valor: t ≈ 0,44 s.',
      points: 2,
      correctAnswer: 0.44,
      tolerance: 0.2,
    },
    {
      id: 'u1s2-q4',
      number: 4,
      type: 'numeric',
      context: 'h(t) = −0,5t² + 4,8t + 18. ¿En qué instante de tiempo el objeto se encuentra a una altura de 20 m?',
      questionText: '¿Cuál es el mayor valor de tiempo en que el objeto está a 20 m de altura?',
      hint: 'Usa la fórmula cuadrática y toma la raíz mayor.',
      explanation: 'Mayor valor: t = (9,6 + 8,72) / 2 ≈ 9,16 s.',
      points: 2,
      correctAnswer: 9.16,
      tolerance: 0.2,
    },
    {
      id: 'u1s2-q5',
      number: 5,
      type: 'numeric',
      context: 'h(t) = −0,5t² + 4,8t + 18. El vértice indica el punto máximo.',
      questionText: '¿En qué segundo el objeto deja de subir y empieza a bajar? (tiempo del vértice)',
      hint: 'El tiempo del vértice se calcula con t = −b/(2a). Aquí a = −0,5 y b = 4,8.',
      explanation: 't = −4,8 / (2·(−0,5)) = −4,8 / (−1) = 4,8 segundos.',
      points: 1,
      correctAnswer: 4.8,
      tolerance: 0.2,
    },
    {
      id: 'u1s2-q6',
      number: 6,
      type: 'numeric',
      context: 'h(t) = −0,5t² + 4,8t + 18',
      questionText: '¿Cuánto tiempo demora el objeto en caer al suelo desde que inicia el movimiento?',
      hint: 'Resuelve h(t) = 0, es decir: −0,5t² + 4,8t + 18 = 0. Toma la raíz positiva.',
      explanation: 'Resolviendo: t² − 9,6t − 36 = 0. t = (9,6 + √(92,16 + 144)) / 2 ≈ 12,5 s.',
      points: 5,
      correctAnswer: 12.5,
      tolerance: 0.2,
    },
    {
      id: 'u1s2-q7',
      number: 7,
      type: 'numeric',
      context: 'h(t) = −0,5t² + 4,8t + 18. El vértice está en t = 4,8 s.',
      questionText: '¿Cuál es la máxima altura que alcanza el objeto?',
      hint: 'Evalúa h(4,8) = −0,5·(4,8)² + 4,8·4,8 + 18.',
      explanation: 'h(4,8) = −0,5·23,04 + 23,04 + 18 = −11,52 + 23,04 + 18 = 29,52 ≈ 29,5 metros.',
      points: 4,
      correctAnswer: 29.5,
      tolerance: 0.2,
    },
    {
      id: 'u1s2-q8',
      number: 8,
      type: 'multichoice',
      context: 'h(t) = −0,5t² + 4,8t + 18 es una parábola con concavidad negativa (a < 0).',
      questionText: '¿Cuál de las siguientes gráficas representa mejor a la función h(t)?',
      hint: 'Como a = −0,5 < 0, la parábola se abre hacia abajo. Además, h(0) = 18 > 0, así que la gráfica comienza por encima del eje x.',
      explanation: 'La Gráfica 2 muestra una parábola que se abre hacia abajo, comenzando desde una altura positiva (18 m) y terminando en t ≈ 12,5 s.',
      points: 4,
      options: [
        { text: 'Gráfica 1: Parábola abierta hacia arriba', isCorrect: false },
        { text: 'Gráfica 2: Parábola abierta hacia abajo, con h(0) > 0', isCorrect: true },
        { text: 'Gráfica 3: Línea recta descendente', isCorrect: false },
        { text: 'Gráfica 4: Curva exponencial', isCorrect: false },
      ],
    },
  ],
};

// ─── SEMANA 3: AJUSTES GEOGEBRA (Funciones Aplicadas) ───────────────────────

const U1_S3_AJUSTES: QuizProblem = {
  id: 'u1-s3-ajustes',
  title: 'Ajustes Lineales y Cuadráticos',
  unit: 1,
  week: 3,
  moduleType: 'interactivo',
  totalPoints: 20,
  context: 'Dados conjuntos de datos reales, el estudiante debe identificar si el ajuste es lineal o cuadrático, determinar la expresión algebraica y evaluar la función.',
  questions: [
    {
      id: 'u1s3-q1',
      number: 1,
      type: 'multichoice',
      context: 'Una corredora de seguros realiza un test de habilidades a todos sus empleados, los cuales posteriormente entregan un balance mensual de sus ventas en millones de pesos. Los datos muestran un crecimiento constante.',
      questionText: '¿Qué tipo de función se ajusta mejor a un conjunto de datos con crecimiento constante entre períodos consecutivos?',
      hint: 'Si la diferencia entre valores consecutivos es constante, el crecimiento es lineal. Si la diferencia de diferencias es constante, es cuadrático.',
      explanation: 'Un crecimiento constante (diferencias iguales entre valores consecutivos) corresponde a una función lineal f(x) = mx + n.',
      points: 3,
      options: [
        { text: 'Función lineal f(x) = mx + n', isCorrect: true },
        { text: 'Función cuadrática f(x) = ax² + bx + c', isCorrect: false },
        { text: 'Función exponencial f(x) = a·bˣ', isCorrect: false },
        { text: 'Función logarítmica f(x) = a·ln(x) + b', isCorrect: false },
      ],
    },
    {
      id: 'u1s3-q2',
      number: 2,
      type: 'numeric',
      context: 'Una función lineal pasa por los puntos (2, 15) y (5, 27).',
      questionText: '¿Cuál es la pendiente (m) de la función lineal?',
      hint: 'La pendiente se calcula como m = (y₂ − y₁) / (x₂ − x₁) = (27 − 15) / (5 − 2).',
      explanation: 'm = (27 − 15) / (5 − 2) = 12 / 3 = 4.',
      points: 3,
      correctAnswer: 4,
      tolerance: 0,
    },
    {
      id: 'u1s3-q3',
      number: 3,
      type: 'numeric',
      context: 'Una función lineal tiene pendiente m = 4 y pasa por el punto (2, 15).',
      questionText: '¿Cuál es el coeficiente de posición (n) de la función lineal?',
      hint: 'Usa y = mx + n → 15 = 4·2 + n → n = 15 − 8.',
      explanation: '15 = 4·2 + n → n = 15 − 8 = 7. La función es f(x) = 4x + 7.',
      points: 3,
      correctAnswer: 7,
      tolerance: 0,
    },
    {
      id: 'u1s3-q4',
      number: 4,
      type: 'numeric',
      context: 'La función que modela las ventas es f(x) = 4x + 7 (en millones).',
      questionText: '¿Cuál es el valor de las ventas esperadas en el período x = 10?',
      hint: 'Evalúa f(10) = 4·10 + 7.',
      explanation: 'f(10) = 40 + 7 = 47 millones.',
      points: 3,
      correctAnswer: 47,
      tolerance: 0,
    },
    {
      id: 'u1s3-q5',
      number: 5,
      type: 'multichoice',
      context: 'Un conjunto de datos muestra que la diferencia entre valores consecutivos NO es constante, pero la diferencia de las diferencias SÍ es constante.',
      questionText: '¿Qué tipo de ajuste corresponde cuando la segunda diferencia es constante?',
      hint: 'Si las diferencias de primer orden varían pero las de segundo orden son constantes, la relación es cuadrática.',
      explanation: 'Una segunda diferencia constante es la característica de una función cuadrática f(x) = ax² + bx + c.',
      points: 4,
      options: [
        { text: 'Ajuste cuadrático f(x) = ax² + bx + c', isCorrect: true },
        { text: 'Ajuste lineal f(x) = mx + n', isCorrect: false },
        { text: 'Ajuste exponencial f(x) = a·eˣ', isCorrect: false },
        { text: 'Ningún ajuste posible', isCorrect: false },
      ],
    },
    {
      id: 'u1s3-q6',
      number: 6,
      type: 'numeric',
      context: 'Una función cuadrática h(t) = −5t² + 30t + 40 modela la altura de un proyectil.',
      questionText: '¿Cuál es la altura máxima que alcanza el proyectil?',
      hint: 'Primero calcula t del vértice: t = −b/(2a) = −30/(2·(−5)) = 3. Luego evalúa h(3).',
      explanation: 't = 3 s. h(3) = −5·9 + 30·3 + 40 = −45 + 90 + 40 = 85 metros.',
      points: 4,
      correctAnswer: 85,
      tolerance: 0.1,
    },
  ],
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const U1_PROBLEMS: QuizProblem[] = [
  U1_S1_COMBUSTIBLE,
  U1_S2_PROYECTIL,
  U1_S3_AJUSTES,
];

export const U1_ALL_QUESTIONS: QuizQuestion[] = U1_PROBLEMS.flatMap(p => p.questions);
