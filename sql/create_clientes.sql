-- Tabla de clientes para BOXI Store
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  direccion JSONB DEFAULT '{}',
  notas TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_telefono ON clientes(telefono);

-- RLS (Row Level Security)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Política para admins (leer y escribir)
CREATE POLICY "Admins can manage clientes" ON clientes
  FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email IN ('gespi6961@gmail.com')
  ));

-- Política para insertar desde formularios públicos (opcional)
CREATE POLICY "Anyone can insert clientes" ON clientes
  FOR INSERT
  WITH CHECK (true);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
