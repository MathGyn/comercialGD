import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK
admin.initializeApp();

// Configurações de Rate Limiting
const RATE_LIMITS = {
  // Usuários não autenticados
  public: {
    read: { limit: 100, window: 60000 }, // 100 por minuto
    upload: { limit: 5, window: 3600000 }, // 5 por hora
  },
  // Usuários autenticados
  authenticated: {
    read: { limit: 500, window: 60000 }, // 500 por minuto
    write: { limit: 100, window: 60000 }, // 100 por minuto
    upload: { limit: 20, window: 3600000 }, // 20 por hora
  },
  // Admins
  admin: {
    read: { limit: 1000, window: 60000 }, // 1000 por minuto
    write: { limit: 500, window: 60000 }, // 500 por minuto
    upload: { limit: 100, window: 3600000 }, // 100 por hora
  },
};

/**
 * Helper para verificar rate limit
 */
async function checkRateLimit(
  uid: string | null,
  action: string,
  isAdmin: boolean
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  // Determina o tipo de usuário e limites
  let limits;
  if (!uid) {
    limits = RATE_LIMITS.public;
  } else if (isAdmin) {
    limits = RATE_LIMITS.admin;
  } else {
    limits = RATE_LIMITS.authenticated;
  }

  // Busca o limite específico para a ação
  const actionLimit = limits[action as keyof typeof limits];
  if (!actionLimit) {
    // Se não houver limite específico, permite
    return { allowed: true, remaining: Infinity, resetAt: Date.now() + 60000 };
  }

  const { limit, window } = actionLimit;
  const now = Date.now();
  const windowStart = now - window;

  // Identificador único para o rate limit (uid ou IP)
  const identifier = uid || 'anonymous';

  // Busca requisições recentes
  const rateLimitRef = admin.firestore().collection('rateLimits_GD');
  const recentRequests = await rateLimitRef
    .where('identifier', '==', identifier)
    .where('action', '==', action)
    .where('timestamp', '>', windowStart)
    .orderBy('timestamp', 'desc')
    .get();

  const count = recentRequests.size;
  const allowed = count < limit;
  const remaining = Math.max(0, limit - count);
  const resetAt = now + window;

  // Se permitido, registra a requisição
  if (allowed) {
    await rateLimitRef.add({
      identifier,
      action,
      timestamp: now,
      uid: uid || null,
    });
  }

  return { allowed, remaining, resetAt };
}

/**
 * Cloud Function para verificar rate limit antes de operações
 */
export const checkRateLimitCallable = functions.https.onCall(async (data, context) => {
  const { action } = data;
  const uid = context.auth?.uid || null;
  const isAdmin = context.auth?.token?.admin === true;

  if (!action) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Ação é obrigatória'
    );
  }

  try {
    const result = await checkRateLimit(uid, action, isAdmin);
    return result;
  } catch (error: any) {
    console.error('Erro ao verificar rate limit:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Erro ao verificar rate limit'
    );
  }
});

/**
 * Cloud Function para limpar registros antigos de rate limit
 * Executa a cada hora para manter o Firestore limpo
 */
export const cleanupRateLimits = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async () => {
    const oneHourAgo = Date.now() - 3600000;

    const oldRecords = await admin.firestore()
      .collection('rateLimits_GD')
      .where('timestamp', '<', oneHourAgo)
      .limit(500)
      .get();

    const batch = admin.firestore().batch();
    oldRecords.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Limpeza: ${oldRecords.size} registros antigos removidos`);
  });

/**
 * Cloud Function para obter estatísticas de rate limit do usuário
 */
export const getRateLimitStats = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuário não autenticado'
    );
  }

  const isAdmin = context.auth?.token?.admin === true;
  const limits = isAdmin ? RATE_LIMITS.admin : RATE_LIMITS.authenticated;
  const now = Date.now();

  const stats: Record<string, { used: number; limit: number; resetAt: number }> = {};

  for (const [action, config] of Object.entries(limits)) {
    const windowStart = now - config.window;
    const recentRequests = await admin.firestore()
      .collection('rateLimits_GD')
      .where('identifier', '==', uid)
      .where('action', '==', action)
      .where('timestamp', '>', windowStart)
      .get();

    stats[action] = {
      used: recentRequests.size,
      limit: config.limit,
      resetAt: now + config.window,
    };
  }

  return stats;
});
