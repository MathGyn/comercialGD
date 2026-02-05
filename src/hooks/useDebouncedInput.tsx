import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Hook para gerenciar inputs com debounce
 * Atualiza o estado local imediatamente, mas só salva no Firestore após o usuário parar de digitar
 */
export const useDebouncedInput = <T,>(
  initialValue: T,
  onSave: (value: T) => Promise<void>,
  debounceMs: number = 1000
) => {
  const [localValue, setLocalValue] = useState<T>(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Função debounced para salvar no Firestore
  const debouncedSave = useDebouncedCallback(
    async (value: T) => {
      setIsSaving(true);
      try {
        await onSave(value);
      } catch (error) {
        console.error('Erro ao salvar:', error);
      } finally {
        setIsSaving(false);
        setIsEditing(false);
      }
    },
    debounceMs
  );

  // Salvar imediatamente (para onBlur)
  const saveImmediately = useCallback(async () => {
    debouncedSave.cancel(); // Cancela o debounce pendente
    setIsSaving(true);
    setIsEditing(false);
    try {
      await onSave(localValue);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  }, [localValue, onSave, debouncedSave]);

  // Atualiza valor local quando o valor inicial muda (vindo do Firestore)
  // Mas só se o usuário não estiver editando
  useEffect(() => {
    if (!isEditing && initialValue !== localValue) {
      setLocalValue(initialValue);
    }
  }, [initialValue, isEditing]);

  // Handler para onChange
  const handleChange = useCallback((value: T) => {
    setIsEditing(true);
    setLocalValue(value);
    debouncedSave(value);
  }, [debouncedSave]);

  // Handler para onFocus
  const handleFocus = useCallback(() => {
    setIsEditing(true);
  }, []);

  return {
    value: localValue,
    onChange: handleChange,
    onBlur: saveImmediately,
    onFocus: handleFocus,
    isSaving,
  };
};
