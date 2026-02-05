import { useState, useCallback } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

interface RateLimitStats {
  [action: string]: {
    used: number;
    limit: number;
    resetAt: number;
  };
}

/**
 * Hook para gerenciar rate limiting
 * 
 * @example
 * const { checkRateLimit, getStats } = useRateLimit();
 * 
 * const handleAction = async () => {
 *   const result = await checkRateLimit('write');
 *   if (result.allowed) {
 *     // Executa a ação
 *   } else {
 *     // Mostra mensagem de rate limit
 *   }
 * };
 */
export const useRateLimit = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  /**
   * Verifica se uma ação pode ser executada baseado no rate limit
   */
  const checkRateLimit = useCallback(
    async (action: 'read' | 'write' | 'upload'): Promise<RateLimitResult> => {
      setLoading(true);
      try {
        const checkRateLimitCallable = httpsCallable<{ action: string }, RateLimitResult>(
          functions,
          'checkRateLimitCallable'
        );

        const result = await checkRateLimitCallable({ action });
        const data = result.data;

        if (!data.allowed) {
          const resetDate = new Date(data.resetAt);
          const minutesUntilReset = Math.ceil((data.resetAt - Date.now()) / 60000);

          toast({
            title: 'Rate Limit Excedido',
            description: `Você atingiu o limite de ${action}. Tente novamente em ${minutesUntilReset} minuto(s).`,
            variant: 'destructive',
          });
        }

        return data;
      } catch (error: any) {
        console.error('Erro ao verificar rate limit:', error);
        
        // Em caso de erro, permite a ação (fail-open)
        // Isso evita que erros na Cloud Function bloqueiem a aplicação
        return {
          allowed: true,
          remaining: Infinity,
          resetAt: Date.now() + 60000,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Obtém estatísticas de rate limit do usuário
   */
  const getStats = useCallback(async (): Promise<RateLimitStats | null> => {
    if (!user) {
      return null;
    }

    try {
      const getRateLimitStats = httpsCallable<never, RateLimitStats>(
        functions,
        'getRateLimitStats'
      );

      const result = await getRateLimitStats();
      return result.data;
    } catch (error: any) {
      console.error('Erro ao obter estatísticas de rate limit:', error);
      return null;
    }
  }, [user]);

  /**
   * Wrapper para executar uma ação com verificação de rate limit
   */
  const executeWithRateLimit = useCallback(
    async <T,>(
      action: 'read' | 'write' | 'upload',
      fn: () => Promise<T>
    ): Promise<T> => {
      const rateLimitResult = await checkRateLimit(action);

      if (!rateLimitResult.allowed) {
        throw new Error('Rate limit excedido');
      }

      return fn();
    },
    [checkRateLimit]
  );

  return {
    checkRateLimit,
    getStats,
    executeWithRateLimit,
    loading,
  };
};
