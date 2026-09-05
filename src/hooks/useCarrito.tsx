'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { CarritoItem, Producto, Variante, Cupon } from '@/types';

const CARRITO_KEY = 'boxi_carrito';

function getCarritoStorage(): CarritoItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CARRITO_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setCarritoStorage(items: CarritoItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
}

function crearVarianteDefault(producto: Producto): Variante {
  return {
    id: `default-${producto.id}`,
    producto_id: producto.id,
    nombre: 'Único',
    sku: null,
    precio: producto.precio_oferta ?? producto.precio_base,
    stock: Infinity,
    imagen_url: null,
    activa: true,
    created_at: new Date().toISOString(),
  };
}

interface CarritoContextType {
  items: CarritoItem[];
  cupon: Cupon | null;
  isLoaded: boolean;
  totalItems: number;
  subtotal: number;
  descuento: number;
  total: number;
  agregar: (producto: Producto, variante?: Variante | null, cantidad?: number) => void;
  actualizarCantidad: (varianteId: string, cantidad: number) => void;
  eliminar: (varianteId: string) => void;
  limpiar: () => void;
  aplicarCupon: (cupon: Cupon) => void;
  removerCupon: () => void;
}

const CarritoContext = createContext<CarritoContextType | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CarritoItem[]>([]);
  const [cupon, setCupon] = useState<Cupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setItems(getCarritoStorage());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setCarritoStorage(items);
    }
  }, [items, isLoaded]);

  const agregar = useCallback((producto: Producto, variante?: Variante | null, cantidad: number = 1) => {
    const varianteFinal = variante ?? crearVarianteDefault(producto);
    
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.variante.id === varianteFinal.id
      );

      if (existingIndex >= 0) {
        const newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          cantidad: cantidad,
        };
        return newItems;
      }

      return [...prev, { producto, variante: varianteFinal, cantidad }];
    });
  }, []);

  const actualizarCantidad = useCallback((varianteId: string, cantidad: number) => {
    if (cantidad < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.variante.id === varianteId ? { ...item, cantidad } : item
      )
    );
  }, []);

  const eliminar = useCallback((varianteId: string) => {
    setItems((prev) => prev.filter((item) => item.variante.id !== varianteId));
  }, []);

  const limpiar = useCallback(() => {
    setItems([]);
    setCupon(null);
  }, []);

  const aplicarCupon = useCallback((nuevoCupon: Cupon) => {
    setCupon(nuevoCupon);
  }, []);

  const removerCupon = useCallback(() => {
    setCupon(null);
  }, []);

  const subtotal = items.reduce((total, item) => {
    const precio = item.variante.precio ?? item.producto.precio_base;
    return total + precio * item.cantidad;
  }, 0);

  let descuento = 0;
  if (cupon) {
    if (cupon.tipo === 'porcentaje') {
      descuento = subtotal * (cupon.valor / 100);
    } else {
      descuento = Math.min(cupon.valor, subtotal);
    }
  }

  const totalItems = items.reduce((total, item) => total + item.cantidad, 0);
  const total = subtotal - descuento;

  return (
    <CarritoContext.Provider
      value={{
        items,
        cupon,
        isLoaded,
        totalItems,
        subtotal,
        descuento,
        total,
        agregar,
        actualizarCantidad,
        eliminar,
        limpiar,
        aplicarCupon,
        removerCupon,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
  }
  return context;
}
