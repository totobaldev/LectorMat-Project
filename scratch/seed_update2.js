const fs = require('fs');

const c1_students = [
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

const c4_students = [
  { name: 'Joaquin Alonso Albornoz Pino', email: 'joaquin.albornoz03@inacapmail.cl' },
  { name: 'Bayron Gabriel Betancur Mieres', email: 'bayron.betancur@inacapmail.cl' },
  { name: 'David Ignacio Burgos Alvarez', email: 'david.burgos14@inacapmail.cl' },
  { name: 'Franz Aaron Carrasco Rubilar', email: 'franz.carrasco@inacapmail.cl' },
  { name: 'Jhoan Tupac Thedys Escobar Yañez', email: 'jhoan.escobar@inacapmail.cl' },
  { name: 'Jaime Antonio Fabres Salgado', email: 'jaime.fabres@inacapmail.cl' },
  { name: 'Martin Ignacio Friz Palacios', email: 'martin.friz02@inacapmail.cl' },
  { name: 'Martín Ignacio Lobos Ríos', email: 'martin.lobos05@inacapmail.cl' },
  { name: 'Ivan Mauro Mora Morales', email: 'ivan.mora04@inacapmail.cl' },
  { name: 'Isaac Abdel Muñoz González', email: 'isaac.munoz15@inacapmail.cl' },
  { name: 'Dyllan Ignacio Palma Garrido', email: 'dyllan.palma@inacapmail.cl' },
  { name: 'Florencia Puga Rodríguez', email: 'florencia.puga@inacapmail.cl' },
  { name: 'Danitza Yuliette Reyes Obreque', email: 'danitza.reyes04@inacapmail.cl' },
  { name: 'Mariel Noemi Robles Morales', email: 'mariel.robles@inacapmail.cl' },
  { name: 'Lissette Andrea Salamanca Mella', email: 'lissette.salamanca@inacapmail.cl' },
  { name: 'Juan Andrés Valdebenito Aguirre', email: 'juan.valdebenito25@inacapmail.cl' },
  { name: 'Bastián Alexis Vega Ríos', email: 'bastian.vega20@inacapmail.cl' },
  { name: 'Andel Bastián Veloso Beltrán', email: 'andel.veloso@inacapmail.cl' }
];

let seedSQL = fs.readFileSync('database/seed.sql', 'utf8');

let userInserts = [];
let enrollInserts = [];
let offset = 26; // since C1 used 1..25

c4_students.forEach((s, idx) => {
  const i = offset + idx;
  const uuid = `c0000000-0000-0000-0000-${String(i).padStart(12, '0')}`;
  const pass = s.email.split('@')[0];
  userInserts.push(`  ('${uuid}', '${s.name}', '${s.email}', '${s.email}', '${pass}', 'student', 'Técnico-Profesional')`);
  enrollInserts.push(`  ('ss_${100 + i}', 'tc1', 'c4', '${uuid}', '${pass}')`);
});

const userInsertStr = userInserts.join(',\n');
const enrollInsertStr = enrollInserts.join(',\n');

// Append to the existing inserts for C1 which ended with ON CONFLICT DO NOTHING
// But wait, it's easier to just append before the "ON CONFLICT" of the last insert.
// Wait, my previous script added C1 and it ended with ON CONFLICT DO NOTHING.
seedSQL = seedSQL.replace(
  `'joaquin.villagran02', 'student', 'Técnico-Profesional')\nON CONFLICT`,
  `'joaquin.villagran02', 'student', 'Técnico-Profesional'),\n${userInsertStr}\nON CONFLICT`
);

seedSQL = seedSQL.replace(
  `'joaquin.villagran02')\nON CONFLICT`,
  `'joaquin.villagran02'),\n${enrollInsertStr}\nON CONFLICT`
);

fs.writeFileSync('database/seed.sql', seedSQL);

// Now generate markdown file
let md = `# Credenciales de Acceso LectorMat\n\n`;

md += `## 👥 Administradores / Docentes\n\n`;
md += `| Rol | Nombre | Correo / Usuario | Contraseña |\n`;
md += `|---|---|---|---|\n`;
md += `| Administrador | Admin | \`admin@inacap.cl\` | \`admin123\` |\n`;
md += `| Docente | Prof. Bastián | \`docente@inacap.cl\` | \`1234\` |\n`;
md += `| Docente | Prof. Cristóbal | \`cristobal@inacap.cl\` | \`1234\` |\n\n`;

md += `## 🎓 Estudiantes - Sección C1\n\n`;
md += `| Nombre | Correo | Contraseña |\n`;
md += `|---|---|---|\n`;
c1_students.forEach(s => {
  md += `| ${s.name} | \`${s.email}\` | \`${s.email.split('@')[0]}\` |\n`;
});

md += `\n## 🎓 Estudiantes - Sección C4\n\n`;
md += `| Nombre | Correo | Contraseña |\n`;
md += `|---|---|---|\n`;
c4_students.forEach(s => {
  md += `| ${s.name} | \`${s.email}\` | \`${s.email.split('@')[0]}\` |\n`;
});

fs.writeFileSync('CREDENCIALES.md', md);
console.log('Done');
