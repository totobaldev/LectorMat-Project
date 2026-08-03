export interface Exercise {
  id: number;
  category: 'grammar' | 'extraction' | 'specialty';
  question: string;
  context?: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export const EXERCISES_ADMIN: Exercise[] = [
  // CATEGORIA 1: COMPRENSIÓN GRAMATICAL SIMPLE (10 ejercicios)
  {
    id: 1,
    category: 'grammar',
    question: 'En el enunciado: "El costo inicial es alto; sin embargo, las ganancias compensarán el gasto", ¿qué función cumple el conector "sin embargo"?',
    options: [
      'Indica que la ganancia se calcula restando el costo de inmediato.',
      'Establece una oposición o contraste entre la desventaja del costo y el beneficio futuro.',
      'Expresa una condición matemática de igualdad absoluta.'
    ],
    correctIdx: 1,
    explanation: '"Sin embargo" es un conector adversativo que introduce una limitación o contraste entre dos ideas.'
  },
  {
    id: 2,
    category: 'grammar',
    question: 'Si se lee: "La depreciación anual es de $100.000 siempre que el uso no exceda las 1.000 horas", ¿cuál es la condición necesaria para que se mantenga dicha depreciación?',
    options: [
      'Que el uso sea estrictamente menor o igual a 1.000 horas.',
      'Que el activo se venda después del primer año.',
      'Que el costo total sea de $100.000.'
    ],
    correctIdx: 0,
    explanation: 'La frase "siempre que" introduce una condición sine qua non, limitando el valor a un rango de uso de hasta 1.000 horas.'
  },
  {
    id: 3,
    category: 'grammar',
    question: '¿Qué significa matemáticamente la expresión "A es el triple de B aumentado en 5 unidades"?',
    options: [
      'A = 3 · (B + 5)',
      'A = 3 · B + 5',
      'A + 5 = 3 · B'
    ],
    correctIdx: 1,
    explanation: 'La coma implícita o el orden gramatical indica que primero se calcula el triple de B (3B) y luego se le adicionan 5 unidades (+5).'
  },
  {
    id: 4,
    category: 'grammar',
    question: 'En la frase: "Las mermas disminuyen a razón de un 5% mensual", ¿qué tipo de progresión o cambio de valor sugiere gramaticalmente la palabra "razón de un 5%"?',
    options: [
      'Un cambio exponencial decreciente, pues es un porcentaje acumulativo.',
      'Un cambio lineal constante, porque disminuye exactamente 5 pesos cada mes.',
      'Un comportamiento oscilatorio periódico.'
    ],
    correctIdx: 0,
    explanation: 'Las tasas porcentuales se aplican sobre saldos acumulados sucesivos, generando un decrecimiento exponencial.'
  },
  {
    id: 5,
    category: 'grammar',
    question: 'Identifique el sujeto y la variable dependiente implícita en: "El éxito comercial de la campaña determina el flujo de caja neto mensual".',
    options: [
      'El sujeto es la campaña; la variable dependiente es el flujo de caja neto mensual.',
      'El sujeto es el flujo; la variable dependiente es el éxito comercial.',
      'No hay variables medibles en esta oración.'
    ],
    correctIdx: 0,
    explanation: 'La acción de "determinar" indica que el flujo de caja (efecto/variable dependiente) es modificado por la campaña (causa/variable independiente).'
  },
  {
    id: 6,
    category: 'grammar',
    question: 'En la expresión contable: "Los egresos netos equivalen a la suma de los costos fijos más los costos variables prorrateados", la palabra "equivalen" representa comercialmente:',
    options: [
      'Un signo de desigualdad o límite presupuestario.',
      'Un signo de igualdad matemática (=).',
      'Una aproximación estadística variable.'
    ],
    correctIdx: 1,
    explanation: '"Equivaler" es sinónimo gramatical directo de igualdad matemática en el modelamiento de ecuaciones.'
  },
  {
    id: 7,
    category: 'grammar',
    question: 'Si un contrato reza: "Se cobrará una multa de $50.000 por cada día de atraso tras la fecha de vencimiento", ¿cuál de las siguientes opciones expresa correctamente la variable independiente?',
    options: [
      'La multa total a pagar.',
      'El valor original del contrato de servicios.',
      'La cantidad de días de atraso acumulados después del vencimiento.'
    ],
    correctIdx: 2,
    explanation: 'Los días de atraso son la variable que se puede contar libremente (independiente), determinando la multa resultante (dependiente).'
  },
  {
    id: 8,
    category: 'grammar',
    question: 'En la frase: "El valor del inventario decae paulatinamente hasta estabilizarse en el valor de desecho", el término "estabilizarse" indica gráficamente:',
    options: [
      'Un punto de inflexión donde la curva empieza a subir infinitamente.',
      'Una asíntota u horizonte horizontal que la variable no cruzará.',
      'Que el valor del inventario llega a cero de inmediato.'
    ],
    correctIdx: 1,
    explanation: '"Estabilizarse" significa que el comportamiento decreciente cesa y se mantiene constante en un límite o cota inferior.'
  },
  {
    id: 9,
    category: 'grammar',
    question: '¿Cuál es la interpretación gramatical correcta de la expresión "A lo más 500 unidades"?',
    options: [
      'La producción debe ser estrictamente mayor a 500 unidades.',
      'La producción puede tomar cualquier valor menor o igual a 500 unidades.',
      'La producción debe ser exactamente igual a 500 unidades.'
    ],
    correctIdx: 1,
    explanation: '"A lo más" o "como máximo" impone una restricción de cota superior: menor o igual (≤ 500).'
  },
  {
    id: 10,
    category: 'grammar',
    question: 'En la oración: "Dado que la demanda aumentó en un factor de dos, duplicamos los turnos", el conector "Dado que" cumple la función de:',
    options: [
      'Introducir la premisa o causa que justifica la consecuencia matemática.',
      'Presentar un contraejemplo de la situación.',
      'Establecer una suposición incierta de simulación.'
    ],
    correctIdx: 0,
    explanation: '"Dado que" es un conector causal que establece la condición inicial de la cual se deriva la acción.'
  },

  // CATEGORIA 2: COMPRENSIÓN Y EXTRACCIÓN DE DATOS (10 ejercicios)
  {
    id: 11,
    category: 'extraction',
    context: 'Un almacén minorista compra cajas de mercadería por un valor de $40.000 cada una. El proveedor cobra un flete de envío fijo de $15.000 sin importar la cantidad de cajas encargadas.',
    question: '¿Cuáles son los parámetros constantes identificados en el texto para estructurar el costo total?',
    options: [
      'Costo por caja de $15.000 y flete variable de $40.000.',
      'Costo variable unitario de $40.000 por caja y costo fijo de flete de $15.000.',
      'Un costo lineal directo de $55.000 por caja sin costos fijos.'
    ],
    correctIdx: 1,
    explanation: 'El flete es constante e independiente del número de cajas (costo fijo), mientras que cada caja añade $40.000 (costo variable por unidad).'
  },
  {
    id: 12,
    category: 'extraction',
    context: 'Un fondo mutuo rinde una tasa de interés compuesto del 8% anual. Un inversor deposita un capital inicial de $5.000.000 con la meta de retirar los fondos cuando el saldo acumulado llegue a $8.000.000.',
    question: '¿Cuál es el valor inicial de la inversión (C_0) y el valor objetivo final (V_f) descritos en el problema?',
    options: [
      'C_0 = $8.000.000; V_f = $5.000.000',
      'C_0 = $5.000.000; V_f = $8.000.000',
      'C_0 = $5.000.000; V_f = $5.400.000'
    ],
    correctIdx: 1,
    explanation: 'El capital de inicio depositado es de $5.000.000 (C_0) y la meta final a la que se desea llegar es $8.000.000 (V_f).'
  },
  {
    id: 13,
    category: 'extraction',
    context: 'Un analista de ventas reporta que la venta de paraguas en la región sur sube linealmente un promedio de 120 unidades por cada milímetro de lluvia registrado durante el mes.',
    question: '¿Cuál es la tasa de cambio o pendiente de este modelo de ventas?',
    options: [
      '120 unidades por milímetro de lluvia.',
      'La lluvia acumulada total del mes.',
      'El número de paraguas vendidos al inicio del año.'
    ],
    correctIdx: 0,
    explanation: 'La pendiente representa el incremento por unidad de la variable independiente. En este caso, sube 120 unidades por cada milímetro de lluvia.'
  },
  {
    id: 14,
    category: 'extraction',
    context: 'Una fábrica textil amortiza el costo de sus máquinas de coser industriales. Una máquina adquirida por $2.400.000 pierde $300.000 de su valor contable cada año transcurrido de su vida de servicio útil.',
    question: '¿Qué datos numéricos representan la ordenada al origen (n) y la pendiente (m) del valor de la máquina respecto al tiempo t en años?',
    options: [
      'n = $300.000; m = -2.400.000',
      'n = $2.400.000; m = -300.000',
      'n = $2.400.000; m = +300.000'
    ],
    correctIdx: 1,
    explanation: 'El valor inicial al año t=0 es $2.400.000 (n). Como el valor se pierde o descuenta con el tiempo, la pendiente m es negativa: -300.000.'
  },
  {
    id: 15,
    category: 'extraction',
    context: 'Para lanzar un nuevo producto lácteo, se realiza una inversión publicitaria inicial de $4.500.000. El precio neto de venta de cada yogurt es de $600 y su costo de producción es de $200.',
    question: '¿Cuál es el margen de contribución unitario (ganancia bruta por cada unidad vendida) obtenido de los datos del texto?',
    options: [
      '$600 por unidad.',
      '$400 por unidad, que es la diferencia entre el precio de venta ($600) y su costo ($200).',
      '$200 por unidad.'
    ],
    correctIdx: 1,
    explanation: 'El margen de contribución es la utilidad unitaria directa: Precio ($600) - Costo de producción ($200) = $400.'
  },
  {
    id: 16,
    category: 'extraction',
    context: 'Un contrato de arriendo de oficinas comerciales estipula un incremento anual de renta del 3.5% sobre el valor del año anterior de forma sucesiva debido a la inflación acumulada de la economía.',
    question: '¿Qué tipo de modelo de cambio representa este arriendo y cuál es su factor multiplicador anual?',
    options: [
      'Modelo exponencial con factor multiplicador de 1.035 (1 + 0.035).',
      'Modelo lineal con incremento fijo de $3.500 al año.',
      'Modelo logarítmico con factor de 0.965.'
    ],
    correctIdx: 0,
    explanation: 'El arriendo sube porcentualmente sobre el valor inmediatamente anterior. Un aumento del 3.5% equivale a multiplicar por (1 + 0.035) = 1.035 en un modelo exponencial.'
  },
  {
    id: 17,
    category: 'extraction',
    context: 'La capacidad de producción de una planta embotelladora está limitada a un máximo de 50.000 botellas semanales. Actualmente operan al 80% de dicha capacidad máxima para evitar sobrecalentamiento.',
    question: '¿Cuántas botellas semanales produce efectivamente la planta según los datos?',
    options: [
      '50.000 botellas.',
      '40.000 botellas, calculando el 80% de 50.000.',
      '10.000 botellas.'
    ],
    correctIdx: 1,
    explanation: 'La producción efectiva es 0.80 · 50.000 = 40.000 botellas semanales.'
  },
  {
    id: 18,
    category: 'extraction',
    context: 'Un emprendedor solicita un crédito bancario de consumo por $10.000.000 a pagar en 36 cuotas fijas mensuales de $380.000 cada una para financiar capital de trabajo.',
    question: '¿Cuánto pagará el emprendedor en intereses y costos financieros totales al término de los 36 meses?',
    options: [
      '$13.680.000, multiplicando directamente la cuota por los meses.',
      '$3.680.000, que es la diferencia entre el monto total pagado ($13.680.000) y el capital prestado ($10.000.000).',
      '$10.000.000 exactos.'
    ],
    correctIdx: 1,
    explanation: 'El monto devuelto total es 36 · $380.000 = $13.680.000. Restando el capital inicial de $10 millones, el costo por interés es de $3.680.000.'
  },
  {
    id: 19,
    category: 'extraction',
    context: 'Un informe contable muestra que para alcanzar el punto de equilibrio (donde no hay ganancias ni pérdidas), la empresa debe vender exactamente 1.200 unidades mensuales de su software de contabilidad.',
    question: '¿Qué significa el punto de equilibrio según el texto?',
    options: [
      'El momento donde los ingresos por ventas igualan exactamente a la suma de los costos fijos y variables.',
      'La cantidad máxima de productos que se pueden almacenar en bodega.',
      'Que la empresa está obligada a cerrar por insolvencia comercial.'
    ],
    correctIdx: 0,
    explanation: 'El punto de equilibrio es el volumen de ventas donde la utilidad neta es cero, es decir, los ingresos compensan con exactitud los gastos.'
  },
  {
    id: 20,
    category: 'extraction',
    context: 'El presupuesto de marketing asigna un 60% de sus fondos a redes sociales, un 25% a marketing de contenidos y el saldo restante de $1.500.000 a anuncios tradicionales en prensa.',
    question: '¿Cuál es el monto total del presupuesto de marketing asignado de acuerdo con la distribución?',
    options: [
      '$10.000.000, ya que el 15% restante equivale a los $1.500.000.',
      '$6.000.000 en total.',
      '$4.500.000 en total.'
    ],
    correctIdx: 0,
    explanation: 'Si el 60% y el 25% están asignados, queda un 15% para prensa. Si el 15% es de $1.500.000, el presupuesto completo (100%) es de $10.000.000.'
  },

  // CATEGORIA 3: ESPECIALIDAD Y MODELAMIENTO (10 ejercicios)
  {
    id: 21,
    category: 'specialty',
    question: 'Si una maquinaria pesada adquirida en $20.000.000 se deprecia linealmente hasta alcanzar un valor de desecho de $2.000.000 en 10 años, ¿cuál es su valor anual de depreciación?',
    options: [
      '$2.000.000 anuales.',
      '$1.800.000 anuales, dividiendo los $18.000.000 de devaluación acumulable por 10 años.',
      '$1.000.000 anuales.'
    ],
    correctIdx: 1,
    explanation: 'La pérdida total es $20M - $2M = $18M. Dividido entre 10 años resulta en $1.800.000 de depreciación anual constante.'
  },
  {
    id: 22,
    category: 'specialty',
    question: '¿Cuál es la fórmula lineal que expresa el valor de un activo V(t) que parte en $8.000.000 y se deprecia $800.000 por año?',
    options: [
      'V(t) = 8.000.000 - 800.000 · t',
      'V(t) = 8.000.000 · (0.9)^t',
      'V(t) = 800.000 · t'
    ],
    correctIdx: 0,
    explanation: 'Representa una función lineal de la forma V(t) = n - mt, donde la ordenada al origen es $8M y la tasa constante m es -$800k.'
  },
  {
    id: 23,
    category: 'specialty',
    question: 'Si el costo de producción total de un servicio administrativo es C(x) = 1.200.000 + 4.500 · x, ¿qué representa el número 1.200.000?',
    options: [
      'El precio de venta sugerido al cliente.',
      'El costo fijo mensual (arriendos, sueldos base) que no depende de la cantidad de servicios x.',
      'El costo variable unitario de los insumos administrativos.'
    ],
    correctIdx: 1,
    explanation: 'En las funciones lineales de costos C(x) = CF + CV·x, el término independiente (CF) representa la estructura de costos fijos estables.'
  },
  {
    id: 24,
    category: 'specialty',
    question: 'Si se espera que las ventas de un negocio de asesoría crezcan a una tasa compuesta del 12% anual, partiendo de $10.000.000 en ventas el año cero, ¿qué modelo matemático describe las ventas en el año t?',
    options: [
      'S(t) = 10.000.000 + 1.200.000 · t',
      'S(t) = 10.000.000 · (1.12)^t',
      'S(t) = 10.000.000 · (0.12)^t'
    ],
    correctIdx: 1,
    explanation: 'El crecimiento compuesto se modela mediante una función exponencial de la forma C_0 · (1 + r)^t. Con r = 0.12, la base multiplicadora es 1.12.'
  },
  {
    id: 25,
    category: 'specialty',
    question: 'Para un local de comida rápida, los ingresos totales son I(x) = 3.500 · x y los costos totales son C(x) = 600.000 + 1.500 · x. ¿A partir de cuántas unidades vendidas "x" el negocio obtiene utilidades reales (punto de equilibrio)?',
    options: [
      'A partir de 300 unidades vendidas.',
      'A partir de 400 unidades vendidas, igualando 3.500x = 600.000 + 1.500x, lo que nos da 2.000x = 600.000.',
      'A partir de 150 unidades.'
    ],
    correctIdx: 1,
    explanation: 'Igualando Ingresos y Costos: 3500x - 1500x = 600.000 => 2000x = 600.000 => x = 300 unidades. Por lo tanto, sobre 300 unidades vendidas se obtiene utilidad (punto de equilibrio es 300).'
  },
  {
    id: 26,
    category: 'specialty',
    question: 'Un analista financiero aplica el indicador VAN (Valor Actual Neto) para evaluar si un proyecto es rentable. Si el VAN calculado resulta menor a cero (VAN < 0), ¿cuál es la decisión administrativa adecuada?',
    options: [
      'Rechazar el proyecto, pues el retorno de inversión no cubre el costo de capital exigido.',
      'Aceptar el proyecto sin vacilaciones de inmediato.',
      'Aumentar el precio de venta unitario hasta que el costo fijo sea cero.'
    ],
    correctIdx: 0,
    explanation: 'Un VAN negativo indica que el proyecto destruye valor económico y no cumple con la tasa de retorno mínima requerida por los inversionistas.'
  },
  {
    id: 27,
    category: 'specialty',
    question: 'Si una empresa amortiza una deuda bancaria mediante cuotas fijas (sistema francés de amortización), ¿qué ocurre gramaticalmente con la proporción de intereses y capital en cada cuota transcurrida?',
    options: [
      'La proporción de intereses aumenta y el abono a capital disminuye.',
      'Los intereses y el capital se mantienen constantes a la mitad en todas las cuotas.',
      'La proporción de interés disminuye progresivamente en cada cuota y el abono a capital aumenta.'
    ],
    correctIdx: 2,
    explanation: 'En el sistema francés, al disminuir el saldo adeudado neto por los pagos acumulativos, el interés sobre saldo decae, incrementando el abono al capital principal.'
  },
  {
    id: 28,
    category: 'specialty',
    question: 'Un contrato comercial estipula un cobro de penalización que crece exponencialmente con la fórmula P(d) = 5.000 · (1.5)^d, donde d son los días de demora. ¿Cuál es el costo si el contratista se atrasa exactamente 2 días?',
    options: [
      '$11.250, multiplicando 5.000 por 1.5 al cuadrado (2.25).',
      '$7.500 en total.',
      '$15.000 en total.'
    ],
    correctIdx: 0,
    explanation: 'Evaluando d=2: P(2) = 5.000 · 1.5^2 = 5.000 · 2.25 = $11.250.'
  },
  {
    id: 29,
    category: 'specialty',
    question: 'En un balance contable, si la ecuación fundamental de la contabilidad es Activo = Pasivo + Patrimonio, ¿cómo se despeja el Patrimonio neto de una sucursal?',
    options: [
      'Patrimonio = Activo + Pasivo',
      'Patrimonio = Activo - Pasivo',
      'Patrimonio = Pasivo - Activo'
    ],
    correctIdx: 1,
    explanation: 'Despejando algebraicamente de forma directa: Pasivo pasa restando al otro lado, resultando en Patrimonio = Activo - Pasivo.'
  },
  {
    id: 30,
    category: 'specialty',
    question: 'Si un inversionista evalúa que un activo financiero duplica su valor cada 4 años, ¿qué modelo de crecimiento representa mejor este comportamiento financiero?',
    options: [
      'Modelo lineal continuo de adición unitaria.',
      'Modelo exponencial con base de potencia 2, expresada como V(t) = C · 2^(t/4).',
      'Modelo trigonométrico con oscilaciones de mercado anuales.'
    ],
    correctIdx: 1,
    explanation: 'El crecimiento de duplicación periódica recurrente se modela de forma exponencial usando la base 2 dividiendo el tiempo por el periodo del ciclo de duplicación (t/4).'
  }
];

export const EXERCISES_MECANICA: Exercise[] = [
  // CATEGORIA 1: COMPRENSIÓN GRAMATICAL SIMPLE (10 ejercicios)
  {
    id: 1,
    category: 'grammar',
    question: 'En el manual técnico: "Aplique torque progresivo sobre la culata del cilindro; de lo contrario, se deformará la junta de estanqueidad", ¿qué función cumple la frase "de lo contrario"?',
    options: [
      'Indica que la deformación es un evento beneficioso para el sellado.',
      'Establece una advertencia o consecuencia negativa directa si no se cumple la instrucción anterior.',
      'Expresa que ambas acciones ocurren al mismo tiempo de forma simétrica.'
    ],
    correctIdx: 1,
    explanation: '"De lo contrario" introduce la consecuencia adversa directa que ocurriría si la regla del torque no se ejecuta apropiadamente.'
  },
  {
    id: 2,
    category: 'grammar',
    question: 'Si la guía de mecanizado dice: "La tolerancia dimensional es admisible con tal de que el error de diámetro no supere los 0.05 mm", ¿qué condición establece "con tal de que"?',
    options: [
      'Una condición obligatoria que restringe el error a un máximo de 0.05 mm.',
      'Que el error puede superar libremente los 0.05 mm en cualquier pieza.',
      'Que la pieza debe ser de 0.05 mm de diámetro exacto.'
    ],
    correctIdx: 0,
    explanation: '"Con tal de que" es un conector condicional que restringe el error admisible a un límite superior absoluto.'
  },
  {
    id: 3,
    category: 'grammar',
    question: '¿Qué significa matemáticamente en un plano la frase "El diámetro de la brida A es la mitad del diámetro de la brida B disminuido en 3 mm"?',
    options: [
      'Diámetro A = (Diámetro B / 2) - 3',
      'Diámetro A = (Diámetro B - 3) / 2',
      'Diámetro A = Diámetro B - 1.5'
    ],
    correctIdx: 0,
    explanation: 'Representa la mitad del diámetro B (Diámetro B / 2) y a ese valor resultante se le resta 3 mm (-3).'
  },
  {
    id: 4,
    category: 'grammar',
    question: 'En el manual: "La presión del circuito hidráulico disminuye en proporción inversa al área transversal del pistón", ¿qué significa gramaticalmente "proporción inversa"?',
    options: [
      'Que a mayor área transversal del pistón, la presión resultante disminuye.',
      'Que ambas variables suben y bajan juntas en la misma proporción.',
      'Que la presión se mantiene constante sin importar el pistón.'
    ],
    correctIdx: 0,
    explanation: 'La relación inversamente proporcional significa que un incremento en una variable (área) produce un decremento en la otra (presión).'
  },
  {
    id: 5,
    category: 'grammar',
    question: 'Identifique el sujeto y el efecto mecánico dependiente en: "La fuerza centrípeta ejercida por la velocidad del volante afecta la tensión de la correa de transmisión".',
    options: [
      'El sujeto/causa es la velocidad del volante; la variable afectada o dependiente es la tensión de la correa.',
      'La correa es la causa; el volante es la variable dependiente de empuje.',
      'No hay relación de causa y efecto en esta oración.'
    ],
    correctIdx: 0,
    explanation: 'La fuerza (causa o variable independiente) afecta o modifica el estado de tensión de la correa (efecto o variable dependiente).'
  },
  {
    id: 6,
    category: 'grammar',
    question: 'En la instrucción: "El caudal neto de salida equivale a la diferencia entre el caudal de entrada de la bomba y las pérdidas por fricción", la palabra "diferencia" representa mecánicamente:',
    options: [
      'Una operación aritmética de suma (+).',
      'Una operación aritmética de resta o sustracción (-).',
      'Una multiplicación de factores viscosos.'
    ],
    correctIdx: 1,
    explanation: '"Diferencia" es el término gramatical y matemático que describe el resultado de restar dos cantidades.'
  },
  {
    id: 7,
    category: 'grammar',
    question: 'Si se lee: "El motor térmico consume combustible a razón de 2.5 litros por cada hora de operación continua", la variable independiente es:',
    options: [
      'El total de combustible consumido por el estanque.',
      'Las horas de operación continua que transcurren.',
      'La capacidad de almacenamiento de litros.'
    ],
    correctIdx: 1,
    explanation: 'El tiempo transcurrido en horas es la variable que avanza libremente (independiente), determinando el consumo (dependiente).'
  },
  {
    id: 8,
    category: 'grammar',
    question: 'En la frase: "La velocidad angular del árbol de transmisión se modera gradualmente hasta detenerse por completo", el término "detenerse" describe físicamente:',
    options: [
      'Que la velocidad angular disminuye y se estabiliza en un valor de cero (0 rad/s).',
      'Que la velocidad aumenta infinitamente.',
      'Un comportamiento oscilatorio senoidal.'
    ],
    correctIdx: 0,
    explanation: '"Detenerse por completo" en cinemática representa que la variable física de velocidad se hace cero.'
  },
  {
    id: 9,
    category: 'grammar',
    question: '¿Cuál es la interpretación gramatical correcta de "El largo del perno debe ser de al menos 45 mm"?',
    options: [
      'El perno debe medir exactamente 45 mm sin variaciones.',
      'El perno puede medir cualquier dimensión menor o igual a 45 mm.',
      'El perno debe tener una longitud mayor o igual a 45 mm (≥ 45 mm).'
    ],
    correctIdx: 2,
    explanation: '"Al menos" impone un requerimiento de cota inferior mínima: el valor debe ser mayor o igual a 45 mm.'
  },
  {
    id: 10,
    category: 'grammar',
    question: 'En la oración: "Puesto que el engranaje conductor gira a 1.200 RPM, el engranaje conducido reduce su velocidad", ¿cuál es el conector que presenta la justificación de entrada?',
    options: [
      'El conector "Puesto que", que introduce la premisa del giro del engranaje conductor.',
      'El engranaje conducido de salida.',
      'El número de revoluciones por minuto.'
    ],
    correctIdx: 0,
    explanation: '"Puesto que" es un conector de causa o condición que presenta la variable de entrada del sistema.'
  },

  // CATEGORIA 2: COMPRENSIÓN Y EXTRACCIÓN DE DATOS (10 ejercicios)
  {
    id: 11,
    category: 'extraction',
    context: 'Un tornero corta pasadores cilíndricos de acero. El largo bruto de la barra inicial es de 3.000 mm. Por cada pasador de 120 mm cortado, la sierra del torno desgasta un excedente fijo de 5 mm de material debido al espesor del disco.',
    question: '¿Cuánto material total de la barra se consume por cada pasador fabricado con éxito?',
    options: [
      '120 mm exactos, sin considerar el corte.',
      '125 mm, sumando el largo del pasador y el desgaste fijo del disco de la sierra.',
      '115 mm en total.'
    ],
    correctIdx: 1,
    explanation: 'El consumo por pieza es de 120 mm más los 5 mm destruidos por la herramienta, totalizando 125 mm de material por pasador.'
  },
  {
    id: 12,
    category: 'extraction',
    context: 'Un compresor neumático eleva la presión de un tanque acumulador. Inicialmente, el tanque registra una presión de 20 PSI. Al encenderse, la presión se eleva de manera lineal a razón de 15 PSI por minuto de funcionamiento.',
    question: '¿Cuál es la presión inicial del acumulador (P_0) y la tasa constante de incremento de presión obtenida del texto?',
    options: [
      'P_0 = 15 PSI; tasa = 20 PSI por minuto.',
      'P_0 = 20 PSI; tasa = 15 PSI por minuto de funcionamiento.',
      'P_0 = 20 PSI; tasa = 35 PSI por minuto.'
    ],
    correctIdx: 1,
    explanation: 'La presión de partida es de 20 PSI (P_0) y el ritmo constante de subida es de 15 PSI por cada minuto avanzado.'
  },
  {
    id: 13,
    category: 'extraction',
    context: 'El manual de un motor diésel indica que el desgaste abrasivo de los anillos de pistón aumenta un promedio de 0.02 mm por cada 100 horas de funcionamiento continuo a plena carga.',
    question: '¿Cuál es la tasa de cambio o desgaste promedio de los anillos por cada hora transcurrida de acuerdo a los datos?',
    options: [
      '0.02 mm por hora.',
      '0.0002 mm por hora, dividiendo los 0.02 mm entre las 100 horas.',
      '2 mm de desgaste acumulativo.'
    ],
    correctIdx: 1,
    explanation: 'La tasa unitaria es el desgaste por hora: 0.02 mm / 100 h = 0.0002 mm por cada hora de operación.'
  },
  {
    id: 14,
    category: 'extraction',
    context: 'Una caldera de vapor industrial trabaja a una temperatura estable inicial de 180°C. Al activar el sistema de enfriamiento de emergencia, la temperatura desciende linealmente a razón de 4°C por segundo transcurrido.',
    question: '¿Qué valores representan la ordenada de origen (T_0) y la pendiente (m) del enfriamiento en un modelo de temperatura respecto al tiempo t en segundos?',
    options: [
      'T_0 = 180°C; m = -4',
      'T_0 = 180°C; m = +4',
      'T_0 = 4°C; m = -180'
    ],
    correctIdx: 0,
    explanation: 'La temperatura parte de 180°C (T_0) y decae (pendiente negativa) a un ritmo constante de 4°C por segundo, resultando en m = -4.'
  },
  {
    id: 15,
    category: 'extraction',
    context: 'Un ensamble mecánico transmite rotación con una polea conductora de 20 cm de diámetro conectada mediante correa a una polea conducida de 10 cm de diámetro.',
    question: '¿Cuál es la relación de transmisión de este acoplamiento (relación de velocidad entre conductora y conducida)?',
    options: [
      'La polea conducida gira a la mitad de velocidad que la conductora.',
      'Giran exactamente a la misma velocidad angular.',
      'La polea conducida gira al doble de velocidad (2:1) de la conductora porque su diámetro es la mitad.'
    ],
    correctIdx: 2,
    explanation: 'Las velocidades de rotación son inversamente proporcionales a los diámetros. Como la conducida tiene la mitad de diámetro, girará el doble de rápido para mantener el caudal tangencial.'
  },
  {
    id: 16,
    category: 'extraction',
    context: 'Una bomba hidráulica centrífuga incrementa su desgaste por fricción acumulativo. Las pruebas de fatiga muestran que el desgaste de los álabes del impulsor aumenta un 5% cada mes de uso pesado sobre el nivel del mes anterior.',
    question: '¿Qué tipo de cambio representa el desgaste de la bomba y cuál es su factor multiplicador mensual?',
    options: [
      'Modelo exponencial con factor multiplicador mensual de 1.05.',
      'Modelo lineal con desgaste fijo de 5 mm mensuales.',
      'Modelo oscilatorio periódico con desfase de 0.95.'
    ],
    correctIdx: 0,
    explanation: 'Al aumentar un porcentaje sobre el saldo acumulado anterior, se trata de un crecimiento exponencial con base 1 + 0.05 = 1.05.'
  },
  {
    id: 17,
    category: 'extraction',
    context: 'Un sistema hidráulico de freno aplica una presión máxima segura de 80 Bar. Por motivos de fatiga del material, la válvula limitadora de seguridad corta el flujo cuando se alcanza el 95% de este límite máximo.',
    question: '¿A qué presión exacta se activa el dispositivo de seguridad según los datos?',
    options: [
      '80 Bar.',
      '76 Bar, que representa el 95% del límite máximo seguro de 80 Bar.',
      '75 Bar de presión nominal.'
    ],
    correctIdx: 1,
    explanation: 'La presión de corte de la válvula es de 0.95 · 80 Bar = 76 Bar.'
  },
  {
    id: 18,
    category: 'extraction',
    context: 'Se requiere taladrar un bloque de acero de alta dureza de 60 mm de espesor total. El avance de la broca helicoidal seleccionada es de 0.15 mm por cada vuelta completa del husillo del taladro.',
    question: '¿Cuántas vueltas completas del husillo de la máquina son necesarias para perforar transversalmente el bloque de lado a lado?',
    options: [
      '60 vueltas completas.',
      '400 vueltas completas, dividiendo el espesor total de 60 mm entre el avance de 0.15 mm por vuelta.',
      '150 vueltas de corte.'
    ],
    correctIdx: 1,
    explanation: 'N_vueltas = Espesor_total / Avance_vuelta = 60 / 0.15 = 400 vueltas del husillo para cruzar la pieza.'
  },
  {
    id: 19,
    category: 'extraction',
    context: 'Un rodamiento de bolas está diseñado para operar un periodo de 10.000 horas bajo una carga radial de 5 Kilonewtons sin presentar signos de descascarillado o fatiga de rodadura.',
    question: '¿Qué representa el límite de 10.000 horas según las especificaciones?',
    options: [
      'La vida útil nominal del rodamiento bajo la carga de operación especificada.',
      'La velocidad de rotación en RPM del eje del motor.',
      'La temperatura de fusión del acero templado de la jaula.'
    ],
    correctIdx: 0,
    explanation: 'Es la duración de diseño o ciclo de fatiga seguro estipulado por el fabricante bajo condiciones nominales.'
  },
  {
    id: 20,
    category: 'extraction',
    context: 'Un tanque de combustible cilíndrico de una grúa móvil tiene una capacidad total de 120 litros. Al inicio de la jornada, el indicador marca un 75% de llenado de petróleo diésel.',
    question: '¿Cuántos litros exactos de combustible contiene el tanque antes de comenzar el trabajo?',
    options: [
      '120 litros en total.',
      '90 litros de combustible, calculando el 75% de los 120 litros nominales.',
      '100 litros de diésel.'
    ],
    correctIdx: 1,
    explanation: 'La cantidad inicial de combustible disponible es de 0.75 · 120 = 90 litros.'
  },

  // CATEGORIA 3: ESPECIALIDAD Y MODELAMIENTO (10 ejercicios)
  {
    id: 21,
    category: 'specialty',
    question: 'Si una broca helicoidal penetra de manera lineal un bloque a razón constante de 0.25 mm por segundo, ¿cuál es el modelo matemático de la profundidad de penetración P(t) en función de los segundos "t"?',
    options: [
      'P(t) = 0.25 · t',
      'P(t) = 0.25 · 2^t',
      'P(t) = t / 0.25'
    ],
    correctIdx: 0,
    explanation: 'Al tratarse de un avance constante lineal sin profundidad previa (partiendo del origen), la función es lineal simple: P(t) = v · t = 0.25t.'
  },
  {
    id: 22,
    category: 'specialty',
    question: 'En un cigüeñal, la biela transmite fuerza a un muñón descentrado de radio R. El torque útil generado en función del ángulo A respecto al eje de aplicación de fuerza es T(A) = F · R · sen(A). ¿En qué ángulo el torque transferido es máximo?',
    options: [
      'A = 0°, porque la fuerza se transmite directamente en la misma línea del eje del cilindro.',
      'A = 90°, ya que la fuerza incide de forma perpendicular al brazo de palanca (sen(90°) = 1, valor máximo).',
      'A = 45°.'
    ],
    correctIdx: 1,
    explanation: 'El torque es máximo cuando la fuerza es perpendicular al radio de giro. Matemáticamente, el seno de 90° es 1 (su cota superior máxima).'
  },
  {
    id: 23,
    category: 'specialty',
    question: 'Un taller de estructuras metálicas utiliza un cilindro hidráulico para doblar perfiles de hierro. Si se aplica una fuerza inclinada F a 60° respecto a la horizontal, ¿con qué fórmula trigonométrica calculamos el componente vertical directo de fuerza?',
    options: [
      'F_vertical = F · sen(60°), porque corresponde al cateto opuesto respecto a la horizontal.',
      'F_vertical = F · cos(60°), correspondiente al cateto adyacente.',
      'F_vertical = F / sen(60°)'
    ],
    correctIdx: 0,
    explanation: 'El componente vertical en esta configuración representa el cateto opuesto del ángulo horizontal de 60°, por lo que se calcula usando la razón trigonométrica Seno.'
  },
  {
    id: 24,
    category: 'specialty',
    question: 'El desgaste de la herramienta de corte de un torno aumenta un 10% por cada hora de corte debido al calentamiento por fricción. Si partimos con un desgaste base de 0.05 mm, ¿qué modelo matemático describe el desgaste D(t) tras "t" horas de mecanizado?',
    options: [
      'D(t) = 0.05 + 0.10 · t',
      'D(t) = 0.05 · (1.10)^t',
      'D(t) = 0.05 · (0.10)^t'
    ],
    correctIdx: 1,
    explanation: 'El aumento porcentual constante por hora (10%) representa un crecimiento exponencial acumulativo, con factor multiplicador de 1.10.'
  },
  {
    id: 25,
    category: 'specialty',
    question: 'La vibración de un árbol de transmisión desbalanceado fluctúa cíclicamente de forma armónica entre -0.5 mm y +0.5 mm de holgura. ¿Cuál es el modelo más representativo de esta vibración radial V(t) en función del tiempo?',
    options: [
      'V(t) = 0.5 · t',
      'V(t) = 0.5 · sen(w · t), que modela la naturaleza periódica oscilante entre cotas simétricas.',
      'V(t) = 0.5 · (1.5)^t'
    ],
    correctIdx: 1,
    explanation: 'Las oscilaciones y vibraciones mecánicas continuas alrededor de una posición de equilibrio central se representan mediante modelos trigonométricos periódicos (seno/coseno).'
  },
  {
    id: 26,
    category: 'specialty',
    question: 'Para levantar una carga mediante un sistema de poleas (aparejo industrial), la ventaja mecánica ideal es M = 4 (reduce a la cuarta parte el esfuerzo). Si deseamos levantar un motor de 200 kg de peso, ¿qué fuerza de tiro teórica debemos aplicar?',
    options: [
      '50 kg-fuerza de tiro, dividiendo los 200 kg de peso de la carga entre la ventaja mecánica de 4.',
      '800 kg-fuerza de tiro.',
      '200 kg-fuerza constante.'
    ],
    correctIdx: 0,
    explanation: 'La ventaja mecánica reduce el esfuerzo requerido multiplicando la fuerza aplicada. Fuerza_tiro = Carga / M = 200 / 4 = 50 kg-fuerza.'
  },
  {
    id: 27,
    category: 'specialty',
    question: 'Un perno métrico M10 tiene un paso de rosca constante de 1.5 mm. Esto significa que el perno avanza linealmente 1.5 mm por cada vuelta de apriete. ¿Cuántas vueltas completas se requieren para apretar un espesor de 15 mm?',
    options: [
      '1.5 vueltas de ajuste.',
      '10 vueltas completas de apriete, dividiendo el espesor de 15 mm entre el paso de rosca de 1.5 mm.',
      '15 vueltas de apriete.'
    ],
    correctIdx: 1,
    explanation: 'El avance lineal es linealmente proporcional a las vueltas. N_vueltas = Espesor / Paso = 15 / 1.5 = 10 vueltas.'
  },
  {
    id: 28,
    category: 'specialty',
    question: 'En un motor de combustión, el volumen V de un cilindro en función de la altura h del pistón se expresa como V(h) = V_camara + Pi · R^2 · h. ¿Qué tipo de modelo matemático rige esta relación física?',
    options: [
      'Modelo lineal, donde la variable h tiene exponente unitario y el volumen se incrementa de forma constante.',
      'Modelo exponencial, porque el área circular se eleva al cuadrado.',
      'Modelo trigonométrico periódico.'
    ],
    correctIdx: 0,
    explanation: 'V(h) es una función lineal respecto a la altura h, ya que R es una constante fija y el volumen útil aumenta proporcionalmente al recorrido.'
  },
  {
    id: 29,
    category: 'specialty',
    question: 'Si una transmisión por cadena acopla un piñón conductor de 12 dientes girando a 600 RPM con una corona conducida de 36 dientes, ¿a qué velocidad rotará la corona conducida?',
    options: [
      '1.800 RPM, triplicando la velocidad base.',
      '200 RPM, dividiendo las 600 RPM entre 3 (ya que la corona tiene el triple de dientes y gira más lento).',
      '600 RPM, porque la velocidad tangencial se conserva intacta.'
    ],
    correctIdx: 1,
    explanation: 'La relación de velocidades es inversa a la relación de dientes. Piñón conductor (12) a corona conducida (36) es una reducción de 1:3. 600 RPM / 3 = 200 RPM.'
  },
  {
    id: 30,
    category: 'specialty',
    question: 'Si un fluido viscoso es bombeado por una tubería hidráulica cerrada y su velocidad útil promedio disminuye a la mitad por cada 10 metros de cañería debido a las pérdidas de carga por fricción, ¿qué modelo describe la velocidad en función de los metros?',
    options: [
      'Un modelo lineal decreciente de pérdida unitaria.',
      'Un modelo exponencial decreciente con base de potencia 0.5 (1/2), de la forma v(x) = v_0 · (0.5)^(x/10).',
      'Un modelo trigonométrico amortiguado.'
    ],
    correctIdx: 1,
    explanation: 'La reducción porcentual acumulada (caer a la mitad) en tramos repetitivos corresponde a un decaimiento de tipo exponencial.'
  }
];
