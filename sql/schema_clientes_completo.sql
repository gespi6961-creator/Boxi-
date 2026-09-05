-- =============================================
-- BOXI TEC - BASE DE DATOS COMPLETA DE CLIENTES
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. TABLA PRINCIPAL DE CLIENTES (mejorada)
-- =============================================

-- Verificar si la tabla existe y agregar columnas faltantes
DO $$
BEGIN
  -- Agregar columna apellido si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'apellido') THEN
    ALTER TABLE clientes ADD COLUMN apellido TEXT;
  END IF;

  -- Agregar columna fecha_nacimiento si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'fecha_nacimiento') THEN
    ALTER TABLE clientes ADD COLUMN fecha_nacimiento DATE;
  END IF;

  -- Agregar columna genero si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'genero') THEN
    ALTER TABLE clientes ADD COLUMN genero TEXT CHECK (genero IN ('masculino', 'femenino', 'otro', 'no_especificado'));
  END IF;

  -- Agregar columna avatar_url si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'avatar_url') THEN
    ALTER TABLE clientes ADD COLUMN avatar_url TEXT;
  END IF;

  -- Agregar columna ultimo_pedido_at si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'ultimo_pedido_at') THEN
    ALTER TABLE clientes ADD COLUMN ultimo_pedido_at TIMESTAMPTZ;
  END IF;

  -- Agregar columna total_pedidos si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'total_pedidos') THEN
    ALTER TABLE clientes ADD COLUMN total_pedidos INTEGER DEFAULT 0;
  END IF;

  -- Agregar columna total_gastado si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'total_gastado') THEN
    ALTER TABLE clientes ADD COLUMN total_gastado NUMERIC(10,2) DEFAULT 0;
  END IF;

  -- Agregar columna preferencias si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'preferencias') THEN
    ALTER TABLE clientes ADD COLUMN preferencias JSONB DEFAULT '{}';
  END IF;

  -- Agregar columna origen_registro si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'origen_registro') THEN
    ALTER TABLE clientes ADD COLUMN origen_registro TEXT DEFAULT 'web';
  END IF;
END $$;


-- =============================================
-- 2. TABLA DE DIRECCIONES (multiples por cliente)
-- =============================================

CREATE TABLE IF NOT EXISTS direcciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  etiqueta TEXT DEFAULT 'Principal', -- Principal, Trabajo, Casa, etc.
  nombre TEXT, -- Nombre de quien recibe
  telefono TEXT, -- Telefono de contacto
  calle TEXT NOT NULL,
  numero TEXT,
  colonia TEXT,
  ciudad TEXT NOT NULL,
  estado TEXT NOT NULL,
  codigo_postal TEXT NOT NULL,
  referencias TEXT,
  predeterminada BOOLEAN DEFAULT false,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indices para direcciones
CREATE INDEX IF NOT EXISTS idx_direcciones_cliente ON direcciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_direcciones_predeterminada ON direcciones(predeterminada) WHERE predeterminada = true;


-- =============================================
-- 3. TABLA DE NOTAS DE CLIENTE (historial de notas internas)
-- =============================================

CREATE TABLE IF NOT EXISTS cliente_notas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  nota TEXT NOT NULL,
  tipo TEXT DEFAULT 'general' CHECK (tipo IN ('general', 'pedido', 'soporte', 'seguimiento', 'importante')),
  creada_por TEXT, -- email del admin que creo la nota
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cliente_notas_cliente ON cliente_notas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cliente_notas_tipo ON cliente_notas(tipo);


-- =============================================
-- 4. TABLA DE CONTACTOS ADICIONALES del cliente
-- =============================================

CREATE TABLE IF NOT EXISTS cliente_contactos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  nombre TEXT NOT NULL,
  relacion TEXT, -- familiar, amigo, coworker, etc.
  telefono TEXT,
  email TEXT,
  es_emergencia BOOLEAN DEFAULT false,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cliente_contactos_cliente ON cliente_contactos(cliente_id);


-- =============================================
-- 5. TABLA DE INTERESES / PREFERENCIAS del cliente
-- =============================================

CREATE TABLE IF NOT EXISTS cliente_intereses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  interes TEXT NOT NULL, -- texto libre del interes
  nivel TEXT DEFAULT 'medio' CHECK (nivel IN ('bajo', 'medio', 'alto')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cliente_intereses_cliente ON cliente_intereses(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cliente_intereses_categoria ON cliente_intereses(categoria_id);


-- =============================================
-- 6. TABLA DE SESIONES / ACTIVIDAD del cliente
-- =============================================

CREATE TABLE IF NOT EXISTS cliente_actividad (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL, -- login, vista_producto, carrito, pedido, etc.
  descripcion TEXT,
  datos JSONB DEFAULT '{}', -- info adicional (producto visto, monto, etc.)
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cliente_actividad_cliente ON cliente_actividad(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cliente_actividad_tipo ON cliente_actividad(tipo);
CREATE INDEX IF NOT EXISTS idx_cliente_actividad_created ON cliente_actividad(created_at DESC);


-- =============================================
-- 7. TABLA DE LISTA DE DESEOS (favoritos mejorados)
-- =============================================

CREATE TABLE IF NOT EXISTS lista_deseos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE NOT NULL,
  notificar_cambio_precio BOOLEAN DEFAULT false,
  notificar_stock BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(cliente_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_lista_deseos_cliente ON lista_deseos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_lista_deseos_producto ON lista_deseos(producto_id);


-- =============================================
-- 8. TABLA DE RESEÑAS DE PRODUCTOS
-- =============================================

CREATE TABLE IF NOT EXISTS resenas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE NOT NULL,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
  calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
  titulo TEXT,
  comentario TEXT,
  aprobada BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(cliente_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_resenas_cliente ON resenas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_resenas_producto ON resenas(producto_id);
CREATE INDEX IF NOT EXISTS idx_resenas_calificacion ON resenas(calificacion);
CREATE INDEX IF NOT EXISTS idx_resenas_aprobada ON resenas(aprobada);


-- =============================================
-- 9. TRIGGERS para updated_at automatico
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  -- Direcciones
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_direcciones_updated_at') THEN
    CREATE TRIGGER update_direcciones_updated_at
      BEFORE UPDATE ON direcciones
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Resenas
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_resenas_updated_at') THEN
    CREATE TRIGGER update_resenas_updated_at
      BEFORE UPDATE ON resenas
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;


-- =============================================
-- 10. TRIGGER para actualizar estadisticas del cliente
-- =============================================

CREATE OR REPLACE FUNCTION actualizar_estadisticas_cliente()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar total_pedidos, total_gastado y ultimo_pedido_at
  UPDATE clientes SET
    total_pedidos = (
      SELECT COUNT(*) FROM pedidos
      WHERE cliente_id = NEW.cliente_id
      AND estado NOT IN ('cancelado')
    ),
    total_gastado = (
      SELECT COALESCE(SUM(total), 0) FROM pedidos
      WHERE cliente_id = NEW.cliente_id
      AND estado NOT IN ('cancelado')
    ),
    ultimo_pedido_at = (
      SELECT MAX(created_at) FROM pedidos
      WHERE cliente_id = NEW.cliente_id
    )
  WHERE id = NEW.cliente_id;

  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_actualizar_estadisticas_cliente') THEN
    CREATE TRIGGER trigger_actualizar_estadisticas_cliente
      AFTER INSERT OR UPDATE ON pedidos
      FOR EACH ROW
      WHEN (NEW.cliente_id IS NOT NULL)
      EXECUTE FUNCTION actualizar_estadisticas_cliente();
  END IF;
END $$;


-- =============================================
-- 11. HABILITAR RLS
-- =============================================

ALTER TABLE direcciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cliente_notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cliente_contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cliente_intereses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cliente_actividad ENABLE ROW LEVEL SECURITY;
ALTER TABLE lista_deseos ENABLE ROW LEVEL SECURITY;
ALTER TABLE resenas ENABLE ROW LEVEL SECURITY;


-- =============================================
-- 12. POLITICAS RLS
-- =============================================

-- DIRECCIONES
DROP POLICY IF EXISTS "direcciones_select" ON direcciones;
CREATE POLICY "direcciones_select" ON direcciones FOR SELECT USING (true);

DROP POLICY IF EXISTS "direcciones_insert" ON direcciones;
CREATE POLICY "direcciones_insert" ON direcciones FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "direcciones_update" ON direcciones;
CREATE POLICY "direcciones_update" ON direcciones FOR UPDATE USING (true);

DROP POLICY IF EXISTS "direcciones_delete" ON direcciones;
CREATE POLICY "direcciones_delete" ON direcciones FOR DELETE USING (true);


-- CLIENTE NOTAS
DROP POLICY IF EXISTS "cliente_notas_select" ON cliente_notas;
CREATE POLICY "cliente_notas_select" ON cliente_notas FOR SELECT USING (true);

DROP POLICY IF EXISTS "cliente_notas_insert" ON cliente_notas;
CREATE POLICY "cliente_notas_insert" ON cliente_notas FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "cliente_notas_update" ON cliente_notas;
CREATE POLICY "cliente_notas_update" ON cliente_notas FOR UPDATE USING (true);

DROP POLICY IF EXISTS "cliente_notas_delete" ON cliente_notas;
CREATE POLICY "cliente_notas_delete" ON cliente_notas FOR DELETE USING (true);


-- CLIENTE CONTACTOS
DROP POLICY IF EXISTS "cliente_contactos_select" ON cliente_contactos;
CREATE POLICY "cliente_contactos_select" ON cliente_contactos FOR SELECT USING (true);

DROP POLICY IF EXISTS "cliente_contactos_insert" ON cliente_contactos;
CREATE POLICY "cliente_contactos_insert" ON cliente_contactos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "cliente_contactos_update" ON cliente_contactos;
CREATE POLICY "cliente_contactos_update" ON cliente_contactos FOR UPDATE USING (true);

DROP POLICY IF EXISTS "cliente_contactos_delete" ON cliente_contactos;
CREATE POLICY "cliente_contactos_delete" ON cliente_contactos FOR DELETE USING (true);


-- CLIENTE INTERESES
DROP POLICY IF EXISTS "cliente_intereses_select" ON cliente_intereses;
CREATE POLICY "cliente_intereses_select" ON cliente_intereses FOR SELECT USING (true);

DROP POLICY IF EXISTS "cliente_intereses_insert" ON cliente_intereses;
CREATE POLICY "cliente_intereses_insert" ON cliente_intereses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "cliente_intereses_delete" ON cliente_intereses;
CREATE POLICY "cliente_intereses_delete" ON cliente_intereses FOR DELETE USING (true);


-- CLIENTE ACTIVIDAD
DROP POLICY IF EXISTS "cliente_actividad_select" ON cliente_actividad;
CREATE POLICY "cliente_actividad_select" ON cliente_actividad FOR SELECT USING (true);

DROP POLICY IF EXISTS "cliente_actividad_insert" ON cliente_actividad;
CREATE POLICY "cliente_actividad_insert" ON cliente_actividad FOR INSERT WITH CHECK (true);


-- LISTA DE DESEOS
DROP POLICY IF EXISTS "lista_deseos_select" ON lista_deseos;
CREATE POLICY "lista_deseos_select" ON lista_deseos FOR SELECT USING (true);

DROP POLICY IF EXISTS "lista_deseos_insert" ON lista_deseos;
CREATE POLICY "lista_deseos_insert" ON lista_deseos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "lista_deseos_delete" ON lista_deseos;
CREATE POLICY "lista_deseos_delete" ON lista_deseos FOR DELETE USING (true);


-- RESEÑAS
DROP POLICY IF EXISTS "resenas_select" ON resenas;
CREATE POLICY "resenas_select" ON resenas FOR SELECT USING (true);

DROP POLICY IF EXISTS "resenas_insert" ON resenas;
CREATE POLICY "resenas_insert" ON resenas FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "resenas_update" ON resenas;
CREATE POLICY "resenas_update" ON resenas FOR UPDATE USING (true);


-- =============================================
-- 13. VISTA UTIL para dashboard de clientes
-- =============================================

CREATE OR REPLACE VIEW vista_clientes_dashboard AS
SELECT
  c.id,
  c.nombre,
  c.apellido,
  c.email,
  c.telefono,
  c.direccion,
  c.fecha_nacimiento,
  c.genero,
  c.avatar_url,
  c.total_pedidos,
  c.total_gastado,
  c.ultimo_pedido_at,
  c.origen_registro,
  c.activo,
  c.created_at,
  c.updated_at,
  -- Contar direcciones
  (SELECT COUNT(*) FROM direcciones d WHERE d.cliente_id = c.id AND d.activa = true) AS total_direcciones,
  -- Contar favoritos
  (SELECT COUNT(*) FROM lista_deseos ld WHERE ld.cliente_id = c.id) AS total_favoritos,
  -- Contar reseñas
  (SELECT COUNT(*) FROM resenas r WHERE r.cliente_id = c.id) AS total_resenas,
  -- Calificacion promedio
  (SELECT ROUND(AVG(r.calificacion), 1) FROM resenas r WHERE r.cliente_id = c.id) AS calificacion_promedio,
  -- Ultimo pedido
  (SELECT numero_pedido FROM pedidos p WHERE p.cliente_id = c.id ORDER BY p.created_at DESC LIMIT 1) AS ultimo_numero_pedido,
  -- Dias desde ultimo pedido
  CASE
    WHEN c.ultimo_pedido_at IS NOT NULL THEN
      EXTRACT(DAY FROM now() - c.ultimo_pedido_at)::INTEGER
    ELSE NULL
  END AS dias_ultimo_pedido
FROM clientes c
WHERE c.activo = true
ORDER BY c.total_gastado DESC;


-- =============================================
-- 14. FUNCION para buscar clientes
-- =============================================

CREATE OR REPLACE FUNCTION buscar_clientes(termino TEXT)
RETURNS TABLE (
  id UUID,
  nombre TEXT,
  email TEXT,
  telefono TEXT,
  total_pedidos BIGINT,
  total_gastado NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.nombre,
    c.email,
    c.telefono,
    c.total_pedidos::BIGINT,
    c.total_gastado
  FROM clientes c
  WHERE c.activo = true
    AND (
      c.nombre ILIKE '%' || termino || '%'
      OR c.email ILIKE '%' || termino || '%'
      OR c.telefono ILIKE '%' || termino || '%'
    )
  ORDER BY c.total_gastado DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;
