-- Permitir que los usuarios se inserten a sí mismos en la tabla usuarios
-- Ejecutar en Supabase SQL Editor

-- 1. Política para que usuarios autenticados se inserten a sí mismos
DROP POLICY IF EXISTS "usuarios_insert_own" ON usuarios;
CREATE POLICY "usuarios_insert_own" ON usuarios
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Política para que usuarios vean su propio registro
DROP POLICY IF EXISTS "usuarios_select_own" ON usuarios;
CREATE POLICY "usuarios_select_own" ON usuarios
  FOR SELECT
  USING (auth.uid() = id);

-- 3. Política para que usuarios actualicen su propio registro
DROP POLICY IF EXISTS "usuarios_update_own" ON usuarios;
CREATE POLICY "usuarios_update_own" ON usuarios
  FOR UPDATE
  USING (auth.uid() = id);
