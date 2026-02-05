# 🚀 Como Configurar Variáveis de Ambiente no Vercel

## 📋 Passo a Passo

### 1. Acessar o Painel do Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login na sua conta
3. Selecione o projeto `comercialeltoncley` (ou o nome do seu projeto)

### 2. Configurar Variáveis de Ambiente

1. No painel do projeto, vá em **Settings** (Configurações)
2. No menu lateral, clique em **Environment Variables** (Variáveis de Ambiente)
3. Clique em **Add New** (Adicionar Nova)

### 3. Adicionar Cada Variável

Adicione as seguintes variáveis uma por uma:

#### Variáveis Obrigatórias:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

#### Como Adicionar:

1. **Name** (Nome): `VITE_FIREBASE_API_KEY`
2. **Value** (Valor): Cole o valor do seu arquivo `.env` local
3. **Environment** (Ambiente): Selecione:
   - ✅ **Production** (Produção)
   - ✅ **Preview** (Preview/Staging)
   - ✅ **Development** (Desenvolvimento) - opcional
4. Clique em **Save** (Salvar)

Repita para todas as 7 variáveis.

### 4. Valores das Variáveis

Os valores estão no seu arquivo `.env` local. Você pode verificar com:

```bash
cat .env
```

**⚠️ IMPORTANTE:** Copie os valores exatamente como estão, sem espaços extras.

### 5. Após Adicionar Todas as Variáveis

1. Vá em **Deployments** (Implantações)
2. Clique nos três pontos (⋯) do último deployment
3. Selecione **Redeploy** (Reimplantar)
4. Ou faça um novo commit para triggerar um novo deploy

## 🔍 Verificar se Está Funcionando

Após o redeploy, acesse sua aplicação e verifique no console do navegador:

```javascript
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
```

Se aparecer o valor (não `undefined`), está funcionando! ✅

## 📝 Exemplo Visual

```
┌─────────────────────────────────────┐
│ Name: VITE_FIREBASE_API_KEY         │
│ Value: [cole o valor aqui]          │
│                                     │
│ Environment:                       │
│ ☑ Production                       │
│ ☑ Preview                          │
│ ☐ Development                      │
│                                     │
│ [Save] [Cancel]                    │
└─────────────────────────────────────┘
```

## ⚠️ Dicas Importantes

1. **Não commite o `.env`** - Já está no `.gitignore` ✅
2. **Use valores diferentes por ambiente** - Se necessário, pode ter valores diferentes para Production e Preview
3. **Após adicionar variáveis** - Sempre faça um redeploy para aplicar as mudanças
4. **Verifique os valores** - Certifique-se de copiar os valores corretos do seu `.env` local

## 🚨 Troubleshooting

### Variáveis não estão funcionando?

1. Verifique se todas as variáveis começam com `VITE_`
2. Certifique-se de que selecionou os ambientes corretos (Production, Preview)
3. Faça um redeploy após adicionar as variáveis
4. Limpe o cache do Vercel se necessário

### Como limpar cache no Vercel?

1. Vá em **Settings** > **General**
2. Role até **Clear Build Cache**
3. Clique em **Clear**

## 🔧 Configuração de Rotas (SPA)

Para que rotas como `/admin` funcionem corretamente no Vercel, o arquivo `vercel.json` já está configurado no projeto. Ele redireciona todas as rotas para `index.html`, permitindo que o React Router gerencie as rotas.

Se você ainda receber erro 404 em rotas como `/admin`:

1. Certifique-se de que o arquivo `vercel.json` está no repositório
2. Faça um novo deploy após adicionar o `vercel.json`
3. O Vercel aplicará automaticamente as configurações

## 📚 Recursos

- [Documentação Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel - SPA Routing](https://vercel.com/docs/configuration#routes)
- [Vercel Dashboard](https://vercel.com/dashboard)
