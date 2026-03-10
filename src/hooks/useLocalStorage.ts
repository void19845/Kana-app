import { useState, useCallback } from 'react';

/**
 * Séance 5 — useLocalStorage
 * Hook générique qui synchronise un état React avec le localStorage.
 *
 * Concepts utilisés :
 *   - useState avec lazy initialization (fonction en paramètre)
 *     → évite de lire le localStorage à chaque render
 *   - useCallback pour stabiliser les références de fonctions
 *   - try/catch pour protéger contre les erreurs de quota / navigation privée
 *
 * Usage :
 *   const [bestScore, setBestScore] = useLocalStorage('kana_best', 0);
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {

  // ── Lazy initialization ──────────────────────────────────────────────────
  // La fonction passée à useState n'est exécutée qu'une seule fois (au montage).
  // Sans lazy init, localStorage.getItem() serait appelé à chaque render.
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      // localStorage indisponible (navigation privée, extension, quota)
      return initialValue;
    }
  });

  // ── Setter synchronisé ───────────────────────────────────────────────────
  // Accepte une valeur directe ou une fonction de mise à jour (comme useState)
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue(prev => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Écriture échouée — l'état React reste à jour, juste pas persisté
          console.warn(`useLocalStorage: impossible d'écrire "${key}"`);
        }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
