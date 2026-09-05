-- Agregar columna cliente_id a pedidos si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pedidos' AND column_name = 'cliente_id'
  ) THEN
    ALTER TABLE pedidos ADD COLUMN cliente_id UUID REFERENCES clientes(id);
    CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON pedidos(cliente_id);
  END IF;
END $$;

-- Agregar columna notas a pedidos si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pedidos' AND column_name = 'notas'
  ) THEN
    ALTER TABLE pedidos ADD COLUMN notas TEXT;
  END IF;
END $$;

-- Agregar columna notas_admin a pedidos si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pedidos' AND column_name = 'notas_admin'
  ) THEN
    ALTER TABLE pedidos ADD COLUMN notas_admin TEXT;
  END IF;
END $$;
