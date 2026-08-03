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
  CREATE TYPE user_role AS ENUM ('student', 'teacher');
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
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  rut         VARCHAR(12) NOT NULL UNIQUE,          -- e.g. "12345678-9"
  role        user_role   NOT NULL DEFAULT 'student',
  area        VARCHAR(100),                         -- Área técnico-profesional
  career      VARCHAR(150),                         -- Carrera específica
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  users         IS 'Usuarios del sistema (estudiantes y docentes)';
COMMENT ON COLUMN users.rut     IS 'RUT chileno sin puntos, con guión';
COMMENT ON COLUMN users.area    IS 'Área técnico-profesional (e.g. Construcción, Electricidad)';
COMMENT ON COLUMN users.career  IS 'Carrera o especialidad dentro del área';

-- exercises
CREATE TABLE IF NOT EXISTS exercises (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  module_type  module_type  NOT NULL,
  area_tag     VARCHAR(100) NOT NULL,               -- área temática del ejercicio
  content_json JSONB        NOT NULL,               -- enunciado, opciones, respuesta, hints
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  exercises              IS 'Banco de ejercicios por módulo y área';
COMMENT ON COLUMN exercises.content_json IS 'Estructura: {statement, options[], answer, hints[], difficulty}';

-- progress_logs
CREATE TABLE IF NOT EXISTS progress_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_id      SMALLINT    NOT NULL CHECK (unit_id BETWEEN 0 AND 4), -- 0 = pre-módulo
  module_id    module_type NOT NULL,
  score        NUMERIC(5,2) CHECK (score BETWEEN 0 AND 100),
  is_completed BOOLEAN     NOT NULL DEFAULT FALSE,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  progress_logs          IS 'Registro de progreso por usuario, unidad y módulo';
COMMENT ON COLUMN progress_logs.unit_id  IS '0 = pre-módulo diagnóstico, 1-4 = unidades temáticas';
COMMENT ON COLUMN progress_logs.score    IS 'Porcentaje de aciertos (0.00 - 100.00)';

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_progress_logs_user_id
  ON progress_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_progress_logs_user_unit
  ON progress_logs(user_id, unit_id, module_id);

CREATE INDEX IF NOT EXISTS idx_exercises_module_area
  ON exercises(module_type, area_tag);

-- =============================================================================
-- UNIQUE CONSTRAINTS
-- =============================================================================

-- Un usuario no puede tener dos registros de progreso para la misma combinación
ALTER TABLE progress_logs
  DROP CONSTRAINT IF EXISTS uq_progress_user_unit_module;

ALTER TABLE progress_logs
  ADD CONSTRAINT uq_progress_user_unit_module
  UNIQUE (user_id, unit_id, module_id);
