'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const FAVORITOS_KEY = 'boxi_favoritos';

function getFavoritosStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(FAVORITOS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setFavoritosStorage(ids: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVORITOS_KEY, JSON.stringify(ids));
}

interface FavoritosContextType {
  favoritos: string[];
  isLoaded: boolean;
  toggleFavorito: (productoId: string) => void;
  esFavorito: (productoId: string) => boolean;
}

const FavoritosContext = createContext<FavoritosContextType | null>(null);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setFavoritos(getFavoritosStorage());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setFavoritosStorage(favoritos);
    }
  }, [favoritos, isLoaded]);

  const toggleFavorito = useCallback((productoId: string) => {
    setFavoritos((prev) =>
      prev.includes(productoId)
        ? prev.filter((id) => id !== productoId)
        : [...prev, productoId]
    );
  }, []);

  const esFavorito = useCallback(
    (productoId: string) => favoritos.includes(productoId),
    [favoritos]
  );

  return (
    <FavoritosContext.Provider value={{ favoritos, isLoaded, toggleFavorito, esFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos debe usarse dentro de un FavoritosProvider');
  }
  return context;
}
