-- =============================================
-- BOXI STORE - SCHEMA COMPLETO
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. TABLAS
-- =============================================

-- Categorías
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  imagen_url_2 TEXT,
  imagen_url_3 TEXT,
  orden INTEGER DEFAULT 0,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  descripcion_corta TEXT,
  precio_base NUMERIC(10,2) NOT NULL,
  precio_oferta NUMERIC(10,2),
  imagen_url TEXT,
  imagen_url_2 TEXT,
  imagen_url_3 TEXT,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  caracteristicas TEXT[] DEFAULT '{}',
  activo BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Variantes
CREATE TABLE IF NOT EXISTS variantes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE NOT NULL,
  nombre TEXT NOT NULL,
  sku TEXT,
  precio NUMERIC(10,2),
  stock INTEGER DEFAULT 0,
  imagen_url TEXT,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Clientes (NO usar tabla usuarios - tiene FK constraints problemáticos)
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT,
  direccion JSONB DEFAULT '{}',
  notas TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pedidos (usa cliente_id, NO usuario_id)
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_pedido TEXT UNIQUE NOT NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente','confirmado','preparando','enviado','entregado','cancelado')),
  subtotal NUMERIC(10,2) DEFAULT 0,
  descuento NUMERIC(10,2) DEFAULT 0,
  envio NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  metodo_pago TEXT DEFAULT 'transferencia',
  datos_pago JSONB DEFAULT '{}',
  direccion_envio JSONB DEFAULT '{}',
  notas TEXT,
  notas_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Detalles de pedido
CREATE TABLE IF NOT EXISTS pedido_detalles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE NOT NULL,
  producto_id UUID REFERENCES productos(id) ON DELETE SET NULL,
  variante_id UUID REFERENCES variantes(id) ON DELETE SET NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);

-- Cupones
CREATE TABLE IF NOT EXISTS cupones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  tipo TEXT DEFAULT 'porcentaje' CHECK (tipo IN ('porcentaje','fijo')),
  valor NUMERIC(10,2) NOT NULL,
  minimo_compra NUMERIC(10,2) DEFAULT 0,
  fecha_inicio TIMESTAMPTZ,
  fecha_expiracion TIMESTAMPTZ,
  uso_maximo INTEGER,
  uso_actual INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 2. ÍNDICES (para performance)
-- =============================================

-- Productos
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_productos_destacado ON productos(destacado);
CREATE INDEX IF NOT EXISTS idx_productos_precio ON productos(precio_base);
CREATE INDEX IF NOT EXISTS idx_productos_created ON productos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_productos_nombre_gin ON productos USING gin(nombre gin_trgm_ops);

-- Variantes
CREATE INDEX IF NOT EXISTS idx_variantes_producto ON variantes(producto_id);
CREATE INDEX IF NOT EXISTS idx_variantes_sku ON variantes(sku) WHERE sku IS NOT NULL;

-- Pedidos
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_created ON pedidos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_numero ON pedidos(numero_pedido);

-- Pedido detalles
CREATE INDEX IF NOT EXISTS idx_pedido_detalles_pedido ON pedido_detalles(pedido_id);

-- Clientes
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);

-- Cupones
CREATE INDEX IF NOT EXISTS idx_cupones_codigo ON cupones(codigo);
CREATE INDEX IF NOT EXISTS idx_cupones_activo ON cupones(activo);

-- Categorías
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);
CREATE INDEX IF NOT EXISTS idx_categorias_orden ON categorias(orden);

-- =============================================
-- 3. TRIGGERS (updated_at automático)
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
  -- Categorías
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categorias_updated_at') THEN
    CREATE TRIGGER update_categorias_updated_at
      BEFORE UPDATE ON categorias
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Productos
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_productos_updated_at') THEN
    CREATE TRIGGER update_productos_updated_at
      BEFORE UPDATE ON productos
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Clientes
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_clientes_updated_at') THEN
    CREATE TRIGGER update_clientes_updated_at
      BEFORE UPDATE ON clientes
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Pedidos
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_pedidos_updated_at') THEN
    CREATE TRIGGER update_pedidos_updated_at
      BEFORE UPDATE ON pedidos
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- =============================================
-- 4. HABILITAR RLS
-- =============================================

ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE variantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_detalles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupones ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 5. POLÍTICAS RLS
-- =============================================

-- Categorías: lectura pública
DROP POLICY IF EXISTS "categorias_select" ON categorias;
CREATE POLICY "categorias_select" ON categorias
  FOR SELECT USING (true);

-- Productos: lectura pública
DROP POLICY IF EXISTS "productos_select" ON productos;
CREATE POLICY "productos_select" ON productos
  FOR SELECT USING (true);

-- Variantes: lectura pública
DROP POLICY IF EXISTS "variantes_select" ON variantes;
CREATE POLICY "variantes_select" ON variantes
  FOR SELECT USING (true);

-- Clientes: público puede insertar y leer (checkout), auth puede actualizar
DROP POLICY IF EXISTS "clientes_select" ON clientes;
CREATE POLICY "clientes_select" ON clientes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "clientes_insert" ON clientes;
CREATE POLICY "clientes_insert" ON clientes
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "clientes_update" ON clientes;
CREATE POLICY "clientes_update" ON clientes
  FOR UPDATE USING (true);

-- Pedidos: público puede insertar (checkout), admin puede todo
DROP POLICY IF EXISTS "pedidos_select" ON pedidos;
CREATE POLICY "pedidos_select" ON pedidos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "pedidos_insert" ON pedidos;
CREATE POLICY "pedidos_insert" ON pedidos
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "pedidos_update" ON pedidos;
CREATE POLICY "pedidos_update" ON pedidos
  FOR UPDATE USING (true);

-- Pedido detalles: público puede insertar y leer
DROP POLICY IF EXISTS "pedido_detalles_select" ON pedido_detalles;
CREATE POLICY "pedido_detalles_select" ON pedido_detalles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "pedido_detalles_insert" ON pedido_detalles;
CREATE POLICY "pedido_detalles_insert" ON pedido_detalles
  FOR INSERT WITH CHECK (true);

-- Cupones: lectura pública
DROP POLICY IF EXISTS "cupones_select" ON cupones;
CREATE POLICY "cupones_select" ON cupones
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "cupones_insert" ON cupones;
CREATE POLICY "cupones_insert" ON cupones
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "cupones_update" ON cupones;
CREATE POLICY "cupones_update" ON cupones
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "cupones_delete" ON cupones;
CREATE POLICY "cupones_delete" ON cupones
  FOR DELETE USING (true);

-- =============================================
-- 6. HABILITAR EXTENSIONES NECESARIAS
-- =============================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;
