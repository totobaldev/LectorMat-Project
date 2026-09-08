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

-- ── Demo Students ────────────────────────────────────────────────────────────

INSERT INTO users (id, full_name, email, username, password_hash, role, career)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Ana Gómez',       'a.gomez@inacapmail.cl',    'a.gomez@inacapmail.cl',    'ANAgomez',      'student', 'Ingeniería en Informática'),
  ('b0000000-0000-0000-0000-000000000002', 'Luis Martínez',   'l.martinez@inacapmail.cl',  'l.martinez@inacapmail.cl',  'LUISmartinez',  'student', 'Diseño Gráfico'),
  ('b0000000-0000-0000-0000-000000000003', 'Sofía Castro',    's.castro@inacapmail.cl',    's.castro@inacapmail.cl',    'SOFIAcastro',   'student', 'Ingeniería en Administración'),
  ('b0000000-0000-0000-0000-000000000004', 'Pedro Morales',   'p.morales@inacapmail.cl',   'p.morales@inacapmail.cl',   'PEDROmorales',  'student', 'Técnico en Mecánica Automotriz'),
  ('b0000000-0000-0000-0000-000000000005', 'Camila Silva',    'c.silva@inacapmail.cl',     'c.silva@inacapmail.cl',     'CAMILAsilva',   'student', 'Gastronomía Internacional')
ON CONFLICT (email) DO NOTHING;

-- ── Enroll students in C1 ────────────────────────────────────────────────────

INSERT INTO section_students (id, course_id, section_id, user_id, generated_password)
VALUES
  ('ss_1', 'tc1', 'c1', 'b0000000-0000-0000-0000-000000000001', 'ANAgomez'),
  ('ss_2', 'tc1', 'c1', 'b0000000-0000-0000-0000-000000000002', 'LUISmartinez'),
  ('ss_3', 'tc1', 'c1', 'b0000000-0000-0000-0000-000000000003', 'SOFIAcastro'),
  ('ss_4', 'tc1', 'c4', 'b0000000-0000-0000-0000-000000000004', 'PEDROmorales'),
  ('ss_5', 'tc1', 'c4', 'b0000000-0000-0000-0000-000000000005', 'CAMILAsilva')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED COMPLETE
-- ═══════════════════════════════════════════════════════════════════════════════
