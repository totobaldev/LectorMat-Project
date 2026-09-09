-- =============================================================================
-- LectorMat - Database Schema
-- PostgreSQL | Pure DDL | No ORM
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE module_type AS ENUM ('M1', 'M2', 'M3');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- TABLES
-- =============================================================================

-- users
CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  rut           VARCHAR(12) UNIQUE,                   -- e.g. "12345678-9"
  full_name     VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  username      VARCHAR(255),
  password_hash VARCHAR(255),                         -- Contraseña generada (ej: NOMBREalbornoz)
  role          user_role   NOT NULL DEFAULT 'student',
  area          VARCHAR(100),                         -- Área técnico-profesional
  career        VARCHAR(150),                         -- Carrera específica
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  users           IS 'Usuarios del sistema (estudiantes y docentes)';
COMMENT ON COLUMN users.full_name IS 'Nombre completo del usuario';
COMMENT ON COLUMN users.email     IS 'Correo electrónico institucional';

-- courses
CREATE TABLE IF NOT EXISTS courses (
  id          VARCHAR(100) PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- course_sections
CREATE TABLE IF NOT EXISTS course_sections (
  id            VARCHAR(100) PRIMARY KEY,
  course_id     VARCHAR(100) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  section_order INT          NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- course_units (Unidades dentro de cada Sección)
CREATE TABLE IF NOT EXISTS course_units (
  id            VARCHAR(100) PRIMARY KEY,
  section_id    VARCHAR(100) NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  subtitle      VARCHAR(255),
  unit_order    INT          NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- course_section_resources (Recursos Multiformato H5P, PDF, Word en las 3 modalidades)
CREATE TABLE IF NOT EXISTS course_section_resources (
  id            VARCHAR(100) PRIMARY KEY,
  section_id    VARCHAR(100) NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  unit_id       VARCHAR(100) REFERENCES course_units(id) ON DELETE SET NULL,
  module_type   VARCHAR(50)  DEFAULT 'comprension', -- 'comprension', 'metodo', 'interactivo'
  resource_type VARCHAR(50)  DEFAULT 'h5p',         -- 'h5p', 'pdf', 'word'
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  file_name     VARCHAR(255),
  file_path     VARCHAR(500),
  file_size     BIGINT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- section_students
CREATE TABLE IF NOT EXISTS section_students (
  id                 VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_id          VARCHAR(100) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  section_id         VARCHAR(100) NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  user_id            VARCHAR(100) NOT NULL,
  generated_password VARCHAR(255) NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_section_student UNIQUE (section_id, user_id)
);

-- exercises
CREATE TABLE IF NOT EXISTS exercises (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  module_type  module_type  NOT NULL,
  area_tag     VARCHAR(100) NOT NULL,               -- área temática del ejercicio
  content_json JSONB        NOT NULL,               -- enunciado, opciones, respuesta, hints
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- progress_logs
CREATE TABLE IF NOT EXISTS progress_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_id      SMALLINT    NOT NULL CHECK (unit_id BETWEEN 0 AND 4),
  module_id    module_type NOT NULL,
  score        NUMERIC(5,2) CHECK (score BETWEEN 0 AND 100),
  is_completed BOOLEAN     NOT NULL DEFAULT FALSE,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_progress_logs_user_id ON progress_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_module_area ON exercises(module_type, area_tag);
CREATE INDEX IF NOT EXISTS idx_course_units_section ON course_units(section_id);
CREATE INDEX IF NOT EXISTS idx_resources_unit ON course_section_resources(unit_id);
CREATE INDEX IF NOT EXISTS idx_section_students_course ON section_students(course_id);
CREATE INDEX IF NOT EXISTS idx_section_students_user ON section_students(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =============================================================================
-- UNIQUE CONSTRAINTS
-- =============================================================================

ALTER TABLE progress_logs DROP CONSTRAINT IF EXISTS uq_progress_user_unit_module;
ALTER TABLE progress_logs ADD CONSTRAINT uq_progress_user_unit_module UNIQUE (user_id, unit_id, module_id);
