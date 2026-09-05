-- Habilitar RLS en pedidos y pedido_detalles si no está habilitado
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_detalles ENABLE ROW LEVEL SECURITY;

-- Política para insertar pedidos (cualquiera puede crear un pedido)
DROP POLICY IF EXISTS "Anyone can insert pedidos" ON pedidos;
CREATE POLICY "Anyone can insert pedidos" ON pedidos
  FOR INSERT
  WITH CHECK (true);

-- Política para leer pedidos (solo admins)
DROP POLICY IF EXISTS "Admins can read pedidos" ON pedidos;
CREATE POLICY "Admins can read pedidos" ON pedidos
  FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email IN ('gespi6961@gmail.com')
  ));

-- Política para actualizar pedidos (solo admins)
DROP POLICY IF EXISTS "Admins can update pedidos" ON pedidos;
CREATE POLICY "Admins can update pedidos" ON pedidos
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email IN ('gespi6961@gmail.com')
  ));

-- Política para insertar detalles de pedido (cualquiera puede insertar)
DROP POLICY IF EXISTS "Anyone can insert pedido_detalles" ON pedido_detalles;
CREATE POLICY "Anyone can insert pedido_detalles" ON pedido_detalles
  FOR INSERT
  WITH CHECK (true);

-- Política para leer detalles de pedido (solo admins)
DROP POLICY IF EXISTS "Admins can read pedido_detalles" ON pedido_detalles;
CREATE POLICY "Admins can read pedido_detalles" ON pedido_detalles
  FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email IN ('gespi6961@gmail.com')
  ));
