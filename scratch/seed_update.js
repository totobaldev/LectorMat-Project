const fs = require('fs');

const students = [
  { name: 'Ian Bryan Josué Aguilera Torres', email: 'ian.aguilera02@inacapmail.cl' },
  { name: 'Felipe Andrés Ancamilla Arias', email: 'felipe.ancamilla@inacapmail.cl' },
  { name: 'Benjamín Alonso Arias Ortiz', email: 'benjamin.arias19@inacapmail.cl' },
  { name: 'Victoria Belén Contreras Lagos', email: 'victoria.contreras10@inacapmail.cl' },
  { name: 'Jeison Ignacio Escobar Barra', email: 'jeison.escobar02@inacapmail.cl' },
  { name: 'Sebastián Ignacio Figueroa Ríos', email: 'sebastian.figueroa69@inacapmail.cl' },
  { name: 'Jaime Tomas Gomez Cifuentes', email: 'jaime.gomez23@inacapmail.cl' },
  { name: 'Vicente Elias Fernando Gonzalez Lobos', email: 'vicente.gonzalez70@inacapmail.cl' },
  { name: 'Leandro Antonio Gutiérrez Gutiérrez', email: 'leandro.gutierrez07@inacapmail.cl' },
  { name: 'Elías José Henríquez Echeverría', email: 'elias.henriquez05@inacapmail.cl' },
  { name: 'Jose Antonio Inostroza Riquelme', email: 'jose.inostroza45@inacapmail.cl' },
  { name: 'Jean Paul Phillipe Lozano Herrera', email: 'jean.lozano@inacapmail.cl' },
  { name: 'Neftali Alexander Mellado Ortiz', email: 'neftali.mellado@inacapmail.cl' },
  { name: 'Moisés Aaron Panes León', email: 'moises.panes@inacapmail.cl' },
  { name: 'Matías Eduardo Parra Saldivia', email: 'matias.parra56@inacapmail.cl' },
  { name: 'Alex Ignacio Pérez Terán', email: 'alex.perez39@inacapmail.cl' },
  { name: 'Vicente Ignacio Pezo Valdebenito', email: 'vicente.pezo@inacapmail.cl' },
  { name: 'Juan Mauricio Ponce Olave', email: 'juan.ponce40@inacapmail.cl' },
  { name: 'Andy Alexander Retamal Caro', email: 'andy.retamal@inacapmail.cl' },
  { name: 'Lissette Andrea Salamanca Mella', email: 'lissette.salamanca@inacapmail.cl' },
  { name: 'Jesus Andrés Sepúlveda Aravena', email: 'jesus.sepulveda10@inacapmail.cl' },
  { name: 'Sebastian Ignacio Sepulveda Rosales', email: 'sebastian.sepulveda106@inacapmail.cl' },
  { name: 'Benjamín Alonso Toloza Capetillo', email: 'benjamin.toloza06@inacapmail.cl' },
  { name: 'Duvan Alfonso Torres Rodriguez', email: 'duvan.torres@inacapmail.cl' },
  { name: 'Joaquín Exequiel Villagrán Salgado', email: 'joaquin.villagran02@inacapmail.cl' },
];

let seedSQL = fs.readFileSync('database/seed.sql', 'utf8');

let userInserts = [];
let enrollInserts = [];

students.forEach((s, idx) => {
  const uuid = `c0000000-0000-0000-0000-${String(idx + 1).padStart(12, '0')}`;
  const pass = s.email.split('@')[0];
  userInserts.push(`  ('${uuid}', '${s.name}', '${s.email}', '${s.email}', '${pass}', 'student', 'Técnico-Profesional')`);
  enrollInserts.push(`  ('ss_${100 + idx}', 'tc1', 'c1', '${uuid}', '${pass}')`);
});

const userInsertStr = userInserts.join(',\n');
const enrollInsertStr = enrollInserts.join(',\n');

// Append to the existing inserts
seedSQL = seedSQL.replace(
  `ON CONFLICT (email) DO NOTHING;

-- ── Enroll students in C1`,
  `,\n${userInsertStr}\nON CONFLICT (email) DO NOTHING;\n\n-- ── Enroll students in C1`
);

seedSQL = seedSQL.replace(
  `ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED COMPLETE`,
  `,\n${enrollInsertStr}\nON CONFLICT (id) DO NOTHING;\n\n-- ═══════════════════════════════════════════════════════════════════════════════\n-- SEED COMPLETE`
);

// Add admin account
const adminAccount = `
-- ── Admin Account ────────────────────────────────────────────────────────────
INSERT INTO users (id, full_name, email, username, password_hash, role, career)
VALUES ('d0000000-0000-0000-0000-000000000001', 'Administrador', 'admin@inacap.cl', 'admin@inacap.cl', 'admin123', 'admin', 'Administración')
ON CONFLICT (email) DO NOTHING;
`;

seedSQL = seedSQL.replace('-- ── Demo Students', adminAccount + '\n-- ── Demo Students');

fs.writeFileSync('database/seed.sql', seedSQL);
console.log('Seed SQL updated.');
