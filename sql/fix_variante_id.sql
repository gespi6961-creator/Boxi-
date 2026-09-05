-- Hacer variante_id nullable en pedido_detalles
DO $$
BEGIN
  -- Primero eliminar la foreign key si existe
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'pedido_detalles_variante_id_fkey'
  ) THEN
    ALTER TABLE pedido_detalles DROP CONSTRAINT pedido_detalles_variante_id_fkey;
  END IF;

  -- Hacer la columna nullable
  ALTER TABLE pedido_detalles ALTER COLUMN variante_id DROP NOT NULL;

  -- Recrear la foreign key como nullable
  ALTER TABLE pedido_detalles
    ADD CONSTRAINT pedido_detalles_variante_id_fkey
    FOREIGN KEY (variante_id) REFERENCES variantes(id);
END $$;
