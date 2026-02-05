# 🛡️ Como Implementar Rate Limiting

Este guia explica como usar o sistema de rate limiting implementado na aplicação.

## 📋 Pré-requisitos

1. Firebase CLI instalado: `npm install -g firebase-tools`
2. Projeto Firebase configurado
3. Cloud Functions habilitadas no Firebase Console

## 🚀 Configuração Inicial

### 1. Instalar Dependências das Cloud Functions

```bash
cd functions
npm install
```

### 2. Compilar as Cloud Functions

```bash
cd functions
npm run build
```

### 3. Fazer Deploy das Cloud Functions

```bash
# Na raiz do projeto
firebase deploy --only functions
```

Ou apenas uma função específica:

```bash
firebase deploy --only functions:checkRateLimitCallable
firebase deploy --only functions:getRateLimitStats
firebase deploy --only functions:cleanupRateLimits
```

## 📊 Limites Configurados

### Usuários Não Autenticados (Público)
- **Leitura**: 100 requisições/minuto
- **Upload**: 5 arquivos/hora

### Usuários Autenticados
- **Leitura**: 500 requisições/minuto
- **Escrita**: 100 requisições/minuto
- **Upload**: 20 arquivos/hora

### Admins
- **Leitura**: 1000 requisições/minuto
- **Escrita**: 500 requisições/minuto
- **Upload**: 100 arquivos/hora

## 💻 Como Usar no Frontend

### Exemplo Básico

```tsx
import { useRateLimit } from '@/hooks/useRateLimit';

function MyComponent() {
  const { checkRateLimit, executeWithRateLimit } = useRateLimit();

  const handleWrite = async () => {
    // Verifica rate limit antes de executar
    const result = await checkRateLimit('write');
    
    if (result.allowed) {
      // Executa a ação
      await updateDocument();
      console.log(`Restam ${result.remaining} requisições`);
    }
  };

  // Ou use o wrapper automático
  const handleWriteWithWrapper = async () => {
    try {
      await executeWithRateLimit('write', async () => {
        await updateDocument();
      });
    } catch (error) {
      // Rate limit excedido ou outro erro
      console.error(error);
    }
  };

  return <button onClick={handleWrite}>Salvar</button>;
}
```

### Exemplo com Upload

```tsx
import { useRateLimit } from '@/hooks/useRateLimit';

function ImageUpload() {
  const { executeWithRateLimit } = useRateLimit();

  const handleUpload = async (file: File) => {
    try {
      await executeWithRateLimit('upload', async () => {
        // Upload da imagem
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
      });
    } catch (error) {
      // Rate limit excedido
    }
  };

  return <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />;
}
```

### Verificar Estatísticas

```tsx
import { useRateLimit } from '@/hooks/useRateLimit';
import { useEffect, useState } from 'react';

function RateLimitStats() {
  const { getStats } = useRateLimit();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await getStats();
      setStats(data);
    };
    loadStats();
  }, []);

  if (!stats) return <div>Carregando...</div>;

  return (
    <div>
      <h3>Rate Limit Stats</h3>
      {Object.entries(stats).map(([action, data]) => (
        <div key={action}>
          <p>{action}: {data.used} / {data.limit}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔧 Integração com Hooks Existentes

### Atualizar useFirestore para usar Rate Limiting

Você pode modificar o hook `useFirestore` para incluir rate limiting automaticamente:

```tsx
import { useRateLimit } from './useRateLimit';

// No hook useCollection ou useFirestore
const { executeWithRateLimit } = useRateLimit();

const add = async (data: Omit<T, "id">) => {
  return executeWithRateLimit('write', async () => {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  });
};
```

## 🧪 Testar Rate Limiting

### 1. Testar Localmente

```bash
# Iniciar emulador
firebase emulators:start --only functions

# Em outro terminal, testar a função
curl -X POST http://localhost:5001/comercialeltoncley/us-central1/checkRateLimitCallable \
  -H "Content-Type: application/json" \
  -d '{"data": {"action": "write"}}'
```

### 2. Testar no Frontend

Crie um botão de teste que faz múltiplas requisições rapidamente:

```tsx
const testRateLimit = async () => {
  for (let i = 0; i < 150; i++) {
    try {
      await checkRateLimit('write');
      console.log(`Requisição ${i + 1} permitida`);
    } catch (error) {
      console.log(`Requisição ${i + 1} bloqueada`);
      break;
    }
  }
};
```

## 📝 Regras do Firestore para Rate Limits

As Cloud Functions criam uma coleção `rateLimits` no Firestore. Certifique-se de que as regras permitem apenas leitura/escrita pelas Cloud Functions:

```javascript
// Adicione isso ao firestore.rules
match /rateLimits/{rateLimitId} {
  // Apenas Cloud Functions podem escrever
  allow write: if false;
  // Apenas usuários autenticados podem ler seus próprios registros
  allow read: if request.auth != null && 
                 request.auth.uid == resource.data.uid;
}
```

## 🔄 Limpeza Automática

A função `cleanupRateLimits` executa automaticamente a cada hora para remover registros antigos (mais de 1 hora). Isso mantém o Firestore limpo e reduz custos.

## ⚠️ Troubleshooting

### Erro: "Function not found"
- Certifique-se de que as Cloud Functions foram deployadas
- Verifique se o nome da função está correto
- Confirme que está usando a região correta (us-central1 por padrão)

### Rate limit não está funcionando
- Verifique se a coleção `rateLimits` está sendo criada no Firestore
- Confirme que as regras do Firestore permitem a criação de documentos
- Verifique os logs das Cloud Functions: `firebase functions:log`

### Performance lenta
- A verificação de rate limit adiciona uma chamada extra à Cloud Function
- Considere cachear resultados no frontend para ações frequentes
- Use `executeWithRateLimit` apenas para ações críticas

## 📚 Recursos

- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
