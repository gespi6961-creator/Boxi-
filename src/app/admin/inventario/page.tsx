'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileSpreadsheet, Check, AlertCircle, Package, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import Link from 'next/link';

interface InventarioRow {
  nombre: string;
  sku: string | null;
  stock: number;
  producto_id?: string;
  estado?: 'actualizado' | 'no_encontrado' | 'error';
}

export default function InventarioPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [datos, setDatos] = useState<InventarioRow[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState<{ exitosos: number; noEncontrados: number; errores: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setResultado(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setError('El archivo está vacío o no tiene datos válidos.');
          return;
        }

        // Ver las columnas disponibles
        const primerRow = jsonData[0] as any;
        const columnas = Object.keys(primerRow);

        const rows: InventarioRow[] = jsonData.map((row: any) => {
          // Buscar nombre en cualquier columna que contenga "nombre", "name", "producto", "description"
          const nombreCol = columnas.find(c => 
            c.toLowerCase().includes('nombre') || 
            c.toLowerCase().includes('name') || 
            c.toLowerCase().includes('producto') ||
            c.toLowerCase().includes('description')
          );
          
          // Buscar SKU en cualquier columna que contenga "sku", "codigo", "code"
          const skuCol = columnas.find(c => 
            c.toLowerCase().includes('sku') || 
            c.toLowerCase().includes('codigo') || 
            c.toLowerCase().includes('code')
          );
          
          // Buscar stock en cualquier columna que contenga "stock", "existencia", "cantidad", "quantity"
          const stockCol = columnas.find(c => 
            c.toLowerCase().includes('stock') || 
            c.toLowerCase().includes('existencia') || 
            c.toLowerCase().includes('cantidad') ||
            c.toLowerCase().includes('quantity')
          );

          const nombre = nombreCol ? String(row[nombreCol] || '').trim() : '';
          const sku = skuCol ? String(row[skuCol] || '').trim() || null : null;
          const stockRaw = stockCol ? row[stockCol] : 0;
          const stock = parseInt(String(stockRaw)) || 0;

          return { nombre, sku, stock };
        }).filter((row) => row.nombre.length > 0);

        if (rows.length === 0) {
          setError('No se encontraron productos válidos. Verifica que tu Excel tenga columnas de nombre y stock.');
          return;
        }

        setDatos(rows);
      } catch (err) {
        setError('Error al leer el archivo: ' + (err as Error).message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const procesarInventario = async () => {
    setProcesando(true);
    setError('');
    const supabase = getSupabase();
    let exitosos = 0;
    let noEncontrados = 0;
    let errores = 0;

    for (let i = 0; i < datos.length; i++) {
      const row = datos[i];
      try {
        // Buscar producto por nombre o SKU
        let query = supabase.from('productos').select('id');
        
        if (row.sku) {
          // Buscar variante por SKU
          const { data: variante } = await supabase
            .from('variantes')
            .select('id, producto_id')
            .eq('sku', row.sku)
            .single();

          if (variante) {
            // Actualizar stock de la variante
            const { error: updateError } = await supabase
              .from('variantes')
              .update({ stock: row.stock })
              .eq('id', variante.id);

            if (updateError) throw updateError;
            exitosos++;
            setDatos(prev => prev.map((d, idx) => idx === i ? { ...d, estado: 'actualizado' } : d));
            continue;
          }
        }

        // Buscar por nombre (parcial)
        const { data: productos } = await supabase
          .from('productos')
          .select('id')
          .ilike('nombre', `%${row.nombre}%`)
          .limit(1);

        if (productos && productos.length > 0) {
          // Actualizar o crear variante default
          const productoId = productos[0].id;
          
          const { data: varianteExistente } = await supabase
            .from('variantes')
            .select('id')
            .eq('producto_id', productoId)
            .eq('nombre', 'Único')
            .single();

          if (varianteExistente) {
            await supabase
              .from('variantes')
              .update({ stock: row.stock })
              .eq('id', varianteExistente.id);
          } else {
            await supabase
              .from('variantes')
              .insert({
                producto_id: productoId,
                nombre: 'Único',
                stock: row.stock,
                precio: null,
                activa: true,
              });
          }
          
          exitosos++;
          setDatos(prev => prev.map((d, idx) => idx === i ? { ...d, estado: 'actualizado' } : d));
        } else {
          noEncontrados++;
          setDatos(prev => prev.map((d, idx) => idx === i ? { ...d, estado: 'no_encontrado' } : d));
        }
      } catch (err) {
        errores++;
        setDatos(prev => prev.map((d, idx) => idx === i ? { ...d, estado: 'error' } : d));
      }
    }

    setResultado({ exitosos, noEncontrados, errores });
    setProcesando(false);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#C85A00] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/admin" className="inline-flex items-center text-[#C85A00] hover:text-[#A04800] mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver al Admin
      </Link>

      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Gestión de Inventario</h1>

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">Formato del Excel</h3>
        <p className="text-sm text-blue-700 mb-3">Tu archivo debe tener estas columnas:</p>
        <div className="bg-white rounded-lg p-3 font-mono text-sm">
          <p><strong>nombre</strong> — Nombre del producto (obligatorio)</p>
          <p><strong>sku</strong> — Código SKU de la variante (opcional)</p>
          <p><strong>stock</strong> — Cantidad en existencia (obligatorio)</p>
        </div>
        <p className="text-sm text-blue-600 mt-3">
          Si no tienes SKU, el sistema buscará el producto por nombre.
        </p>
      </div>

      {/* Upload */}
      <div className="bg-white border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#C85A00]/10 rounded-lg flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-[#C85A00]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#1A1A1A]">Subir archivo Excel</h3>
            <p className="text-sm text-gray-500">Formatos aceptados: .xlsx, .xls, .csv</p>
          </div>
          <label className="cursor-pointer bg-[#C85A00] text-white px-4 py-2 rounded-lg hover:bg-[#A04800] transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Seleccionar archivo
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Datos cargados */}
      {datos.length > 0 && (
        <div className="bg-white border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1A1A1A]">
              {datos.length} productos encontrados en el archivo
            </h3>
            <button
              onClick={procesarInventario}
              disabled={procesando}
              className="bg-[#C85A00] text-white px-4 py-2 rounded-lg hover:bg-[#A04800] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {procesando ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  Actualizar Inventario
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Producto</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">SKU</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Stock</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((row, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="py-2 px-3">{row.nombre}</td>
                    <td className="py-2 px-3 text-gray-500">{row.sku || '—'}</td>
                    <td className="py-2 px-3 font-medium">{row.stock}</td>
                    <td className="py-2 px-3">
                      {row.estado === 'actualizado' && (
                        <span className="text-green-600 flex items-center gap-1"><Check className="w-4 h-4" /> Actualizado</span>
                      )}
                      {row.estado === 'no_encontrado' && (
                        <span className="text-yellow-600">No encontrado</span>
                      )}
                      {row.estado === 'error' && (
                        <span className="text-red-600">Error</span>
                      )}
                      {!row.estado && <span className="text-gray-400">Pendiente</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resultado */}
      {resultado && (
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-[#1A1A1A] mb-4">Resultado</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{resultado.exitosos}</p>
              <p className="text-sm text-green-700">Actualizados</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{resultado.noEncontrados}</p>
              <p className="text-sm text-yellow-700">No encontrados</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{resultado.errores}</p>
              <p className="text-sm text-red-700">Errores</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
