# 🛡️ Rate Limiting - O que é e Como Funciona

## O que é Rate Limiting?

**Rate Limiting** (limitação de taxa) é um mecanismo de segurança que controla a quantidade de requisições que um usuário ou sistema pode fazer em um determinado período de tempo.

## 🎯 Por que é Importante?

### Proteção Contra:

1. **Ataques de Força Bruta**
   - Tentativas repetidas de login com senhas incorretas
   - Previne que atacantes tentem milhões de combinações

2. **Abuso de API**
   - Previne que usuários façam requisições excessivas
   - Protege seus recursos e custos do Firebase

3. **DDoS (Distributed Denial of Service)**
   - Limita o impacto de ataques que tentam sobrecarregar o sistema
   - Protege a disponibilidade do serviço

4. **Scraping/Bots**
   - Previne que bots façam requisições massivas
   - Protege seus dados e reduz custos

## 📊 Exemplos Práticos

### Sem Rate Limiting ❌

```
Usuário malicioso pode fazer:
- 10.000 tentativas de login por segundo
- 1 milhão de requisições ao Firestore por minuto
- Upload de milhares de arquivos simultaneamente
```

**Resultado:**
- Custos altos no Firebase
- Sistema sobrecarregado
- Dados expostos ou corrompidos

### Com Rate Limiting ✅

```
Limites configurados:
- Máximo 5 tentativas de login por minuto
- Máximo 100 requisições ao Firestore por minuto
- Máximo 10 uploads por hora
```

**Resultado:**
- Custos controlados
- Sistema estável
- Dados protegidos

## 🔧 Como Implementar Rate Limiting no Firebase

### 1. Rate Limiting no Firestore Rules

O Firestore não tem rate limiting nativo nas regras, mas você pode implementar usando:

#### Opção A: Cloud Functions com Rate Limiting

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Armazena contadores no Firestore
const rateLimiter = async (uid: string, action: string, limit: number, window: number) => {
  const now = Date.now();
  const windowStart = now - window;
  
  // Busca requisições recentes
  const recentRequests = await admin.firestore()
    .collection('rateLimits')
    .where('uid', '==', uid)
    .where('action', '==', action)
    .where('timestamp', '>', windowStart)
    .get();
  
  if (recentRequests.size >= limit) {
    throw new functions.https.HttpsError(
      'resource-exhausted',
      'Rate limit exceeded'
    );
  }
  
  // Registra nova requisição
  await admin.firestore().collection('rateLimits').add({
    uid,
    action,
    timestamp: now,
  });
};
```

#### Opção B: Usar Cloud Functions com Bibliotecas

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requisições por IP
});
```

### 2. Rate Limiting no Firebase Authentication

O Firebase Authentication já tem rate limiting automático:

- **Email/Password**: 5 tentativas por minuto por IP
- **Verificação de Email**: 1 email por minuto
- **Reset de Senha**: 1 email por hora

### 3. Rate Limiting no Storage

Você pode implementar rate limiting no Storage usando Cloud Functions:

```typescript
export const uploadWithRateLimit = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  
  // Verifica rate limit
  await rateLimiter(uid, 'upload', 10, 3600000); // 10 uploads por hora
  
  // Processa upload...
});
```

## 📈 Níveis de Rate Limiting Recomendados

### Para Usuários Não Autenticados (Público)

```
- Leitura Firestore: 100 requisições/minuto
- Upload Storage: 5 arquivos/hora
- Tamanho máximo: 5MB por arquivo
```

### Para Usuários Autenticados

```
- Leitura Firestore: 500 requisições/minuto
- Escrita Firestore: 100 requisições/minuto
- Upload Storage: 20 arquivos/hora
- Tamanho máximo: 10MB por arquivo
```

### Para Admins

```
- Leitura Firestore: 1000 requisições/minuto
- Escrita Firestore: 500 requisições/minuto
- Upload Storage: 100 arquivos/hora
- Tamanho máximo: 50MB por arquivo
```

## 🚨 Quando Implementar?

### ✅ Implemente Rate Limiting se:

- Você tem uma API pública
- Você permite uploads de arquivos
- Você tem custos altos no Firebase
- Você quer prevenir abuso
- Você tem dados sensíveis

### ⚠️ Não é Urgente se:

- Aplicação é apenas interna
- Poucos usuários
- Dados não são sensíveis
- Você já tem outras proteções

## ✅ Rate Limiting Implementado!

O sistema de rate limiting foi implementado com sucesso! 

### O que foi implementado:

1. ✅ **Cloud Functions** para verificar rate limits
   - `checkRateLimitCallable` - Verifica se uma ação pode ser executada
   - `getRateLimitStats` - Obtém estatísticas de uso
   - `cleanupRateLimits` - Limpeza automática de registros antigos

2. ✅ **Hook `useRateLimit`** no frontend
   - Verificação de rate limit antes de ações
   - Wrapper automático para executar ações com rate limiting
   - Estatísticas de uso em tempo real

3. ✅ **Limites configuráveis** por tipo de usuário
   - Público, Autenticado, Admin
   - Diferentes limites para read, write, upload

### Como usar:

Veja o guia completo em: **[IMPLEMENTAR_RATE_LIMITING.md](./IMPLEMENTAR_RATE_LIMITING.md)**

### Exemplo rápido:

```tsx
import { useRateLimit } from '@/hooks/useRateLimit';

const { executeWithRateLimit } = useRateLimit();

// Executar ação com rate limiting automático
await executeWithRateLimit('write', async () => {
  await updateDocument();
});
```

## 📚 Recursos

- [Firebase Quotas and Limits](https://firebase.google.com/docs/firestore/quotas)
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)

## 🎯 Resumo

**Rate Limiting** é uma camada de proteção que:
- ✅ Previne abuso e ataques
- ✅ Controla custos
- ✅ Mantém o sistema estável
- ✅ Protege dados sensíveis

Para sua aplicação atual, o Firebase já tem proteções básicas. Rate limiting avançado pode ser implementado no futuro se necessário.
