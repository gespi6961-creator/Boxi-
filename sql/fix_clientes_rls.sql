-- Fix RLS para clientes - permite que usuarios autenicados lean y actualicen
-- Ejecutar en Supabase SQL Editor

-- Eliminar políticas anteriores si existen
DROP POLICY IF EXISTS "clientes_select_own" ON clientes;
DROP POLICY IF EXISTS "clientes_update_own" ON clientes;
DROP POLICY IF EXISTS "clientes_insert_public" ON clientes;

-- Permitir SELECT a usuarios autenticados (ven todos los registros)
CREATE POLICY "clientes_select_auth" ON clientes
  FOR SELECT USING (true);

-- Permitir INSERT público (para checkout sin auth)
CREATE POLICY "clientes_insert_public" ON clientes
  FOR INSERT WITH CHECK (true);

-- Permitir UPDATE a usuarios autenticados
CREATE POLICY "clientes_update_auth" ON clientes
  FOR UPDATE USING (true);
