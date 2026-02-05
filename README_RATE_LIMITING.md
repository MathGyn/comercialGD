# 🛡️ Rate Limiting - Guia Rápido

## ✅ Status: Implementado

O sistema de rate limiting está pronto para uso!

## 🚀 Deploy Rápido

### 1. Instalar dependências

```bash
npm run functions:install
```

### 2. Compilar

```bash
npm run functions:build
```

### 3. Fazer deploy

```bash
npm run functions:deploy
```

## 💻 Uso no Frontend

```tsx
import { useRateLimit } from '@/hooks/useRateLimit';

function MyComponent() {
  const { executeWithRateLimit } = useRateLimit();

  const handleSave = async () => {
    try {
      await executeWithRateLimit('write', async () => {
        // Sua ação aqui
        await saveData();
      });
    } catch (error) {
      // Rate limit excedido
    }
  };
}
```

## 📊 Limites

- **Público**: 100 read/min, 5 upload/hora
- **Autenticado**: 500 read/min, 100 write/min, 20 upload/hora  
- **Admin**: 1000 read/min, 500 write/min, 100 upload/hora

## 📚 Documentação Completa

- [IMPLEMENTAR_RATE_LIMITING.md](./IMPLEMENTAR_RATE_LIMITING.md) - Guia completo
- [RATE_LIMITING.md](./RATE_LIMITING.md) - Explicação do conceito
