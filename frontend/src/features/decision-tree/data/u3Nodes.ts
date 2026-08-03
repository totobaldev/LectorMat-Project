// ─── Type ─────────────────────────────────────────────────────────────────────

export interface DecisionNode {
  id: string;
  question: string;
  hint?: string;
  yesNodeId: string | null;
  noNodeId: string | null;
  isFinal: boolean;
  finalMethod?: string;
  finalSub?: string;    // fórmula corta
  finalDetail?: string; // explicación extendida
  finalExample?: string; // caso técnico real
}

// ─── Árbol — Unidad 3: Trigonometría ─────────────────────────────────────────
//
//  N1: ¿Triángulo rectángulo?
//    SÍ → N2 | NO → N3
//  N2: ¿Tengo ángulo agudo + lado, y busco otro lado/ángulo?
//    SÍ → F:Razones | NO → F:Pitagoras
//  N3: ¿Tengo 2 lados y el ángulo entre ellos, o los 3 lados?
//    SÍ → F:Coseno  | NO → N4
//  N4: ¿Tengo 2 ángulos y un lado, o 2 lados y el ángulo opuesto?
//    SÍ → F:Seno    | NO → F:Funciones
//
// ─────────────────────────────────────────────────────────────────────────────

export const u3Nodes: DecisionNode[] = [
  // ── Preguntas ──────────────────────────────────────────────────────────────
  {
    id: 'N1',
    question: '¿Se trata de un problema en un triángulo rectángulo?',
    hint: 'Busca si la figura tiene un ángulo de 90° explícito o una esquina cuadrada marcada.',
    yesNodeId: 'N2',
    noNodeId: 'N3',
    isFinal: false,
  },
  {
    id: 'N2',
    question: '¿Conozco un ángulo agudo y un lado, y busco otro lado u ángulo?',
    hint: 'Ej: tienes la hipotenusa y el ángulo de 30°, y quieres el cateto opuesto.',
    yesNodeId: 'F:Razones',
    noNodeId: 'F:Pitagoras',
    isFinal: false,
  },
  {
    id: 'N3',
    question: '¿Conozco dos lados y el ángulo entre ellos, o los tres lados del triángulo?',
    hint: 'Ej: tienes lados a=8, b=6 y el ángulo C=120° entre ellos, o bien los tres lados a, b, c.',
    yesNodeId: 'F:Coseno',
    noNodeId: 'N4',
    isFinal: false,
  },
  {
    id: 'N4',
    question: '¿Conozco dos ángulos y un lado, o dos lados y el ángulo opuesto a uno de ellos?',
    hint: 'Ej: tienes el lado a=10 con su ángulo opuesto A=45°, y otro ángulo B=60°.',
    yesNodeId: 'F:Seno',
    noNodeId: 'F:Funciones',
    isFinal: false,
  },

  // ── Terminales ─────────────────────────────────────────────────────────────
  {
    id: 'F:Razones',
    question: '',
    yesNodeId: null,
    noNodeId: null,
    isFinal: true,
    finalMethod: 'Razones Trigonométricas (SOH-CAH-TOA)',
    finalSub: 'sen θ = op/hip · cos θ = ad/hip · tan θ = op/ad',
    finalDetail:
      'Las razones trigonométricas relacionan ángulos con lados en un triángulo rectángulo. Son la herramienta base para calcular alturas, distancias y ángulos inaccesibles.',
    finalExample:
      'Un técnico mide la inclinación de una rampa: ángulo 30° y longitud 5 m. Con sen(30°)=0.5 calcula la altura: 5 × 0.5 = 2.5 m.',
  },
  {
    id: 'F:Pitagoras',
    question: '',
    yesNodeId: null,
    noNodeId: null,
    isFinal: true,
    finalMethod: 'Teorema de Pitágoras',
    finalSub: 'c² = a² + b²',
    finalDetail:
      'En un triángulo rectángulo, el cuadrado de la hipotenusa es la suma de los cuadrados de los catetos. No necesitas los ángulos, solo dos lados.',
    finalExample:
      'Un soldador verifica la diagonal de una placa 3 m × 4 m: c = √(9+16) = √25 = 5 m.',
  },
  {
    id: 'F:Coseno',
    question: '',
    yesNodeId: null,
    noNodeId: null,
    isFinal: true,
    finalMethod: 'Teorema del Coseno',
    finalSub: 'c² = a² + b² − 2ab · cos(C)',
    finalDetail:
      'Generaliza a Pitágoras para cualquier triángulo. Calcula el lado opuesto a un ángulo conocido, o deduce un ángulo conociendo los tres lados.',
    finalExample:
      'Un electricista calcula el cable entre dos puntos: a=8, b=6, C=120°. c² = 64+36−2(8)(6)cos(120°) = 148 → c ≈ 12.2 m.',
  },
  {
    id: 'F:Seno',
    question: '',
    yesNodeId: null,
    noNodeId: null,
    isFinal: true,
    finalMethod: 'Teorema del Seno',
    finalSub: 'a / sen(A) = b / sen(B) = c / sen(C)',
    finalDetail:
      'Relaciona lados y ángulos opuestos en cualquier triángulo. Ideal cuando conoces proporciones opuestas y las razones directas no aplican.',
    finalExample:
      'Un topógrafo conoce a=10 m (ángulo A=45°) y B=60°. Calcula b = 10·sen(60°)/sen(45°) ≈ 12.25 m.',
  },
  {
    id: 'F:Funciones',
    question: '',
    yesNodeId: null,
    noNodeId: null,
    isFinal: true,
    finalMethod: 'Funciones Trigonométricas y Modelos Oscilatorios',
    finalSub: 'f(t) = A · sen(ωt + φ)',
    finalDetail:
      'Modela fenómenos periódicos: vibraciones, corriente alterna, movimiento de pistones. Útil cuando el problema es dinámico u ondulatorio, no geométrico estático.',
    finalExample:
      'La corriente de un motor: i(t) = 10·sen(100πt). El técnico obtiene frecuencia 50 Hz y corriente máxima 10 A directamente de la fórmula.',
  },
];

/** Mapa id → nodo para lookup O(1) */
export const u3NodesMap = new Map<string, DecisionNode>(
  u3Nodes.map((n) => [n.id, n])
);

export const U3_ROOT_NODE_ID = 'N1';
