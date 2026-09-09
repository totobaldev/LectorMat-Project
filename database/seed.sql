-- =============================================================================
-- LectorMat - Seed Data (Development)
-- Run AFTER schema.sql
-- =============================================================================

-- ── Teacher User ─────────────────────────────────────────────────────────────

INSERT INTO users (id, full_name, email, username, password_hash, role, area, career)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Prof. Bastián',
  'docente@inacap.cl',
  'docente@inacap.cl',
  '1234', -- Will be auto-hashed on first login
  'teacher',
  'Matemáticas',
  'Docente Técnico-Profesional'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, full_name, email, username, password_hash, role, area, career)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Prof. Cristóbal',
  'cristobal@inacap.cl',
  'cristobal@inacap.cl',
  '1234',
  'teacher',
  'Matemáticas',
  'Docente Técnico-Profesional'
)
ON CONFLICT (email) DO NOTHING;

-- ── Course: Trigonometría y Geometría ────────────────────────────────────────

INSERT INTO courses (id, name, description)
VALUES (
  'tc1',
  'Trigonometría y Geometría',
  'Curso de trigonometría básica y sus aplicaciones geométricas.'
)
ON CONFLICT (id) DO NOTHING;

-- ── Sections ─────────────────────────────────────────────────────────────────

INSERT INTO course_sections (id, course_id, title, section_order)
VALUES
  ('c1', 'tc1', 'C1', 1),
  ('c4', 'tc1', 'C4', 2)
ON CONFLICT (id) DO NOTHING;

-- ── Units ────────────────────────────────────────────────────────────────────

INSERT INTO course_units (id, section_id, title, subtitle, unit_order)
VALUES (
  'u3',
  'c1',
  'Unidad 3: Trigonometría y Geometría',
  'Programa Transforma 2026',
  1
)
ON CONFLICT (id) DO NOTHING;

-- ── Resources ────────────────────────────────────────────────────────────────

INSERT INTO course_section_resources (id, section_id, unit_id, module_type, resource_type, name, description, file_name, file_size)
VALUES
  ('res_1', 'c1', 'u3', 'comprension', 'pdf', 'Deducción de Medidas y Distancias', 'Guía práctica en formato PDF.', 'Guia_Trigonometria_U3.pdf', 1548576),
  ('res_2', 'c1', 'u3', 'metodo', 'word', 'Clasificador de Teoremas y Funciones', 'Documento Word con tablas y teoría.', 'Clasificador_Teoremas.docx', 854000),
  ('res_3', 'c1', 'u3', 'interactivo', 'h5p', 'Resolución de problemas de Trigonometría aplicados', 'Actividad interactiva paquete H5P.', 'Trigonometria_Interactivas.h5p', 4200000)
ON CONFLICT (id) DO NOTHING;


-- ── Admin Account ────────────────────────────────────────────────────────────
INSERT INTO users (id, full_name, email, username, password_hash, role, career)
VALUES ('d0000000-0000-0000-0000-000000000001', 'Administrador', 'admin@inacap.cl', 'admin@inacap.cl', 'admin123', 'admin', 'Administración')
ON CONFLICT (email) DO NOTHING;

-- ── Demo Students ────────────────────────────────────────────────────────────

INSERT INTO users (id, full_name, email, username, password_hash, role, career)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Ana Gómez',       'a.gomez@inacapmail.cl',    'a.gomez@inacapmail.cl',    'ANAgomez',      'student', 'Ingeniería en Informática'),
  ('b0000000-0000-0000-0000-000000000002', 'Luis Martínez',   'l.martinez@inacapmail.cl',  'l.martinez@inacapmail.cl',  'LUISmartinez',  'student', 'Diseño Gráfico'),
  ('b0000000-0000-0000-0000-000000000003', 'Sofía Castro',    's.castro@inacapmail.cl',    's.castro@inacapmail.cl',    'SOFIAcastro',   'student', 'Ingeniería en Administración'),
  ('b0000000-0000-0000-0000-000000000004', 'Pedro Morales',   'p.morales@inacapmail.cl',   'p.morales@inacapmail.cl',   'PEDROmorales',  'student', 'Técnico en Mecánica Automotriz'),
  ('b0000000-0000-0000-0000-000000000005', 'Camila Silva',    'c.silva@inacapmail.cl',     'c.silva@inacapmail.cl',     'CAMILAsilva',   'student', 'Gastronomía Internacional')
,
  ('c0000000-0000-0000-0000-000000000001', 'Ian Bryan Josué Aguilera Torres', 'ian.aguilera02@inacapmail.cl', 'ian.aguilera02@inacapmail.cl', 'ian.aguilera02', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000002', 'Felipe Andrés Ancamilla Arias', 'felipe.ancamilla@inacapmail.cl', 'felipe.ancamilla@inacapmail.cl', 'felipe.ancamilla', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000003', 'Benjamín Alonso Arias Ortiz', 'benjamin.arias19@inacapmail.cl', 'benjamin.arias19@inacapmail.cl', 'benjamin.arias19', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000004', 'Victoria Belén Contreras Lagos', 'victoria.contreras10@inacapmail.cl', 'victoria.contreras10@inacapmail.cl', 'victoria.contreras10', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000005', 'Jeison Ignacio Escobar Barra', 'jeison.escobar02@inacapmail.cl', 'jeison.escobar02@inacapmail.cl', 'jeison.escobar02', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000006', 'Sebastián Ignacio Figueroa Ríos', 'sebastian.figueroa69@inacapmail.cl', 'sebastian.figueroa69@inacapmail.cl', 'sebastian.figueroa69', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000007', 'Jaime Tomas Gomez Cifuentes', 'jaime.gomez23@inacapmail.cl', 'jaime.gomez23@inacapmail.cl', 'jaime.gomez23', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000008', 'Vicente Elias Fernando Gonzalez Lobos', 'vicente.gonzalez70@inacapmail.cl', 'vicente.gonzalez70@inacapmail.cl', 'vicente.gonzalez70', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000009', 'Leandro Antonio Gutiérrez Gutiérrez', 'leandro.gutierrez07@inacapmail.cl', 'leandro.gutierrez07@inacapmail.cl', 'leandro.gutierrez07', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000010', 'Elías José Henríquez Echeverría', 'elias.henriquez05@inacapmail.cl', 'elias.henriquez05@inacapmail.cl', 'elias.henriquez05', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000011', 'Jose Antonio Inostroza Riquelme', 'jose.inostroza45@inacapmail.cl', 'jose.inostroza45@inacapmail.cl', 'jose.inostroza45', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000012', 'Jean Paul Phillipe Lozano Herrera', 'jean.lozano@inacapmail.cl', 'jean.lozano@inacapmail.cl', 'jean.lozano', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000013', 'Neftali Alexander Mellado Ortiz', 'neftali.mellado@inacapmail.cl', 'neftali.mellado@inacapmail.cl', 'neftali.mellado', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000014', 'Moisés Aaron Panes León', 'moises.panes@inacapmail.cl', 'moises.panes@inacapmail.cl', 'moises.panes', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000015', 'Matías Eduardo Parra Saldivia', 'matias.parra56@inacapmail.cl', 'matias.parra56@inacapmail.cl', 'matias.parra56', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000016', 'Alex Ignacio Pérez Terán', 'alex.perez39@inacapmail.cl', 'alex.perez39@inacapmail.cl', 'alex.perez39', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000017', 'Vicente Ignacio Pezo Valdebenito', 'vicente.pezo@inacapmail.cl', 'vicente.pezo@inacapmail.cl', 'vicente.pezo', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000018', 'Juan Mauricio Ponce Olave', 'juan.ponce40@inacapmail.cl', 'juan.ponce40@inacapmail.cl', 'juan.ponce40', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000019', 'Andy Alexander Retamal Caro', 'andy.retamal@inacapmail.cl', 'andy.retamal@inacapmail.cl', 'andy.retamal', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000020', 'Lissette Andrea Salamanca Mella', 'lissette.salamanca@inacapmail.cl', 'lissette.salamanca@inacapmail.cl', 'lissette.salamanca', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000021', 'Jesus Andrés Sepúlveda Aravena', 'jesus.sepulveda10@inacapmail.cl', 'jesus.sepulveda10@inacapmail.cl', 'jesus.sepulveda10', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000022', 'Sebastian Ignacio Sepulveda Rosales', 'sebastian.sepulveda106@inacapmail.cl', 'sebastian.sepulveda106@inacapmail.cl', 'sebastian.sepulveda106', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000023', 'Benjamín Alonso Toloza Capetillo', 'benjamin.toloza06@inacapmail.cl', 'benjamin.toloza06@inacapmail.cl', 'benjamin.toloza06', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000024', 'Duvan Alfonso Torres Rodriguez', 'duvan.torres@inacapmail.cl', 'duvan.torres@inacapmail.cl', 'duvan.torres', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000025', 'Joaquín Exequiel Villagrán Salgado', 'joaquin.villagran02@inacapmail.cl', 'joaquin.villagran02@inacapmail.cl', 'joaquin.villagran02', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000026', 'Joaquin Alonso Albornoz Pino', 'joaquin.albornoz03@inacapmail.cl', 'joaquin.albornoz03@inacapmail.cl', 'joaquin.albornoz03', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000027', 'Bayron Gabriel Betancur Mieres', 'bayron.betancur@inacapmail.cl', 'bayron.betancur@inacapmail.cl', 'bayron.betancur', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000028', 'David Ignacio Burgos Alvarez', 'david.burgos14@inacapmail.cl', 'david.burgos14@inacapmail.cl', 'david.burgos14', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000029', 'Franz Aaron Carrasco Rubilar', 'franz.carrasco@inacapmail.cl', 'franz.carrasco@inacapmail.cl', 'franz.carrasco', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000030', 'Jhoan Tupac Thedys Escobar Yañez', 'jhoan.escobar@inacapmail.cl', 'jhoan.escobar@inacapmail.cl', 'jhoan.escobar', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000031', 'Jaime Antonio Fabres Salgado', 'jaime.fabres@inacapmail.cl', 'jaime.fabres@inacapmail.cl', 'jaime.fabres', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000032', 'Martin Ignacio Friz Palacios', 'martin.friz02@inacapmail.cl', 'martin.friz02@inacapmail.cl', 'martin.friz02', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000033', 'Martín Ignacio Lobos Ríos', 'martin.lobos05@inacapmail.cl', 'martin.lobos05@inacapmail.cl', 'martin.lobos05', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000034', 'Ivan Mauro Mora Morales', 'ivan.mora04@inacapmail.cl', 'ivan.mora04@inacapmail.cl', 'ivan.mora04', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000035', 'Isaac Abdel Muñoz González', 'isaac.munoz15@inacapmail.cl', 'isaac.munoz15@inacapmail.cl', 'isaac.munoz15', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000036', 'Dyllan Ignacio Palma Garrido', 'dyllan.palma@inacapmail.cl', 'dyllan.palma@inacapmail.cl', 'dyllan.palma', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000037', 'Florencia Puga Rodríguez', 'florencia.puga@inacapmail.cl', 'florencia.puga@inacapmail.cl', 'florencia.puga', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000038', 'Danitza Yuliette Reyes Obreque', 'danitza.reyes04@inacapmail.cl', 'danitza.reyes04@inacapmail.cl', 'danitza.reyes04', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000039', 'Mariel Noemi Robles Morales', 'mariel.robles@inacapmail.cl', 'mariel.robles@inacapmail.cl', 'mariel.robles', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000040', 'Lissette Andrea Salamanca Mella', 'lissette.salamanca@inacapmail.cl', 'lissette.salamanca@inacapmail.cl', 'lissette.salamanca', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000041', 'Juan Andrés Valdebenito Aguirre', 'juan.valdebenito25@inacapmail.cl', 'juan.valdebenito25@inacapmail.cl', 'juan.valdebenito25', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000042', 'Bastián Alexis Vega Ríos', 'bastian.vega20@inacapmail.cl', 'bastian.vega20@inacapmail.cl', 'bastian.vega20', 'student', 'Técnico-Profesional'),
  ('c0000000-0000-0000-0000-000000000043', 'Andel Bastián Veloso Beltrán', 'andel.veloso@inacapmail.cl', 'andel.veloso@inacapmail.cl', 'andel.veloso', 'student', 'Técnico-Profesional')
ON CONFLICT (email) DO NOTHING;

-- ── Enroll students in C1 ────────────────────────────────────────────────────

INSERT INTO section_students (id, course_id, section_id, user_id, generated_password)
VALUES
  ('ss_1', 'tc1', 'c1', 'b0000000-0000-0000-0000-000000000001', 'ANAgomez'),
  ('ss_2', 'tc1', 'c1', 'b0000000-0000-0000-0000-000000000002', 'LUISmartinez'),
  ('ss_3', 'tc1', 'c1', 'b0000000-0000-0000-0000-000000000003', 'SOFIAcastro'),
  ('ss_4', 'tc1', 'c4', 'b0000000-0000-0000-0000-000000000004', 'PEDROmorales'),
  ('ss_5', 'tc1', 'c4', 'b0000000-0000-0000-0000-000000000005', 'CAMILAsilva')
,
  ('ss_100', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000001', 'ian.aguilera02'),
  ('ss_101', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000002', 'felipe.ancamilla'),
  ('ss_102', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000003', 'benjamin.arias19'),
  ('ss_103', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000004', 'victoria.contreras10'),
  ('ss_104', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000005', 'jeison.escobar02'),
  ('ss_105', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000006', 'sebastian.figueroa69'),
  ('ss_106', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000007', 'jaime.gomez23'),
  ('ss_107', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000008', 'vicente.gonzalez70'),
  ('ss_108', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000009', 'leandro.gutierrez07'),
  ('ss_109', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000010', 'elias.henriquez05'),
  ('ss_110', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000011', 'jose.inostroza45'),
  ('ss_111', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000012', 'jean.lozano'),
  ('ss_112', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000013', 'neftali.mellado'),
  ('ss_113', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000014', 'moises.panes'),
  ('ss_114', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000015', 'matias.parra56'),
  ('ss_115', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000016', 'alex.perez39'),
  ('ss_116', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000017', 'vicente.pezo'),
  ('ss_117', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000018', 'juan.ponce40'),
  ('ss_118', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000019', 'andy.retamal'),
  ('ss_119', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000020', 'lissette.salamanca'),
  ('ss_120', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000021', 'jesus.sepulveda10'),
  ('ss_121', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000022', 'sebastian.sepulveda106'),
  ('ss_122', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000023', 'benjamin.toloza06'),
  ('ss_123', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000024', 'duvan.torres'),
  ('ss_124', 'tc1', 'c1', 'c0000000-0000-0000-0000-000000000025', 'joaquin.villagran02'),
  ('ss_126', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000026', 'joaquin.albornoz03'),
  ('ss_127', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000027', 'bayron.betancur'),
  ('ss_128', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000028', 'david.burgos14'),
  ('ss_129', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000029', 'franz.carrasco'),
  ('ss_130', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000030', 'jhoan.escobar'),
  ('ss_131', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000031', 'jaime.fabres'),
  ('ss_132', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000032', 'martin.friz02'),
  ('ss_133', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000033', 'martin.lobos05'),
  ('ss_134', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000034', 'ivan.mora04'),
  ('ss_135', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000035', 'isaac.munoz15'),
  ('ss_136', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000036', 'dyllan.palma'),
  ('ss_137', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000037', 'florencia.puga'),
  ('ss_138', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000038', 'danitza.reyes04'),
  ('ss_139', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000039', 'mariel.robles'),
  ('ss_140', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000040', 'lissette.salamanca'),
  ('ss_141', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000041', 'juan.valdebenito25'),
  ('ss_142', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000042', 'bastian.vega20'),
  ('ss_143', 'tc1', 'c4', 'c0000000-0000-0000-0000-000000000043', 'andel.veloso')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED COMPLETE
-- ═══════════════════════════════════════════════════════════════════════════════
