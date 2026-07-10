'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CarritoItem, Producto, Variante, Cupon } from '@/types';

const CARRITO_KEY = 'boxi_carrito';

// Obtener carrito del localStorage
function getCarritoStorage(): CarritoItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CARRITO_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Guardar carrito en localStorage
function setCarritoStorage(items: CarritoItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
}

export function useCarrito() {
  const [items, setItems] = useState<CarritoItem[]>([]);
  const [cupon, setCupon] = useState<Cupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito al montar
  useEffect(() => {
    setItems(getCarritoStorage());
    setIsLoaded(true);
  }, []);

  // Actualizar localStorage cuando cambian los items
  useEffect(() => {
    if (isLoaded) {
      setCarritoStorage(items);
    }
  }, [items, isLoaded]);

  // Agregar producto al carrito
  const agregar = useCallback((producto: Producto, variante: Variante, cantidad: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.variante.id === variante.id
      );

      if (existingIndex >= 0) {
        // Actualizar cantidad
        const newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          cantidad: newItems[existingIndex].cantidad + cantidad,
        };
        return newItems;
      }

      // Agregar nuevo item
      return [...prev, { producto, variante, cantidad }];
    });
  }, []);

  // Actualizar cantidad de un item
  const actualizarCantidad = useCallback((varianteId: string, cantidad: number) => {
    if (cantidad < 1) return;
    
    setItems((prev) =>
      prev.map((item) =>
        item.variante.id === varianteId ? { ...item, cantidad } : item
      )
    );
  }, []);

  // Eliminar item del carrito
  const eliminar = useCallback((varianteId: string) => {
    setItems((prev) => prev.filter((item) => item.variante.id !== varianteId));
  }, []);

  // Limpiar carrito
  const limpiar = useCallback(() => {
    setItems([]);
    setCupon(null);
  }, []);

  // Aplicar cupón
  const aplicarCupon = useCallback((nuevoCupon: Cupon) => {
    setCupon(nuevoCupon);
  }, []);

  // Remover cupón
  const removerCupon = useCallback(() => {
    setCupon(null);
  }, []);

  // Calcular subtotal
  const subtotal = items.reduce((total, item) => {
    const precio = item.variante.precio ?? item.producto.precio_base;
    return total + precio * item.cantidad;
  }, 0);

  // Calcular descuento
  let descuento = 0;
  if (cupon) {
    if (cupon.tipo === 'porcentaje') {
      descuento = subtotal * (cupon.valor / 100);
    } else {
      descuento = Math.min(cupon.valor, subtotal);
    }
  }

  // Total de items
  const totalItems = items.reduce((total, item) => total + item.cantidad, 0);

  // Total final
  const total = subtotal - descuento;

  return {
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
  };
}
