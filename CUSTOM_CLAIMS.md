# 🔐 Custom Claims - Guia de Segurança

## O que são Custom Claims?

Custom Claims são atributos personalizados que podem ser adicionados ao token JWT do Firebase Authentication. Eles permitem verificar permissões de usuário sem expor informações sensíveis (como emails) nas regras de segurança.

## 🎯 Por que usar Custom Claims?

### ❌ Problema Anterior (Expor Emails)
```javascript
// Antes: Emails expostos nas regras
function isAdmin() {
  return request.auth.token.email == 'matheussouza286@gmail.com' ||
         request.auth.token.email == 'eltoncleey@gmail.com';
}
```

**Problemas:**
- Emails visíveis no código fonte
- Difícil de gerenciar múltiplos admins
- Precisa atualizar regras toda vez que adiciona/remove admin

### ✅ Solução com Custom Claims
```javascript
// Agora: Verificação segura via Custom Claims
function isAdmin() {
  return request.auth.token.admin == true;
}
```

**Vantagens:**
- Emails não são expostos
- Fácil de gerenciar (apenas executar um script)
- Mais seguro e escalável

## 📋 Como Configurar

### 1. Instalar Firebase Admin SDK

```bash
npm install firebase-admin
```

### 2. Obter Service Account Key

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Project Settings** (ícone de engrenagem)
4. Clique na aba **Service Accounts**
5. Clique em **"Generate new private key"**
6. Salve o arquivo JSON como `serviceAccountKey.json` na raiz do projeto
7. **IMPORTANTE**: O arquivo já está no `.gitignore` - nunca commite este arquivo!

### 3. Definir Custom Claim para um Usuário

Execute o script com o email do usuário que deseja tornar admin:

```bash
npm run set:admin matheussouza286@gmail.com
```

O script irá:
- Carregar a service account key
- Buscar o usuário pelo email
- Definir o custom claim `admin: true` no token do usuário

### 4. Usuário Precisa Fazer Logout e Login

⚠️ **IMPORTANTE**: Após definir o custom claim, o usuário precisa:
1. Fazer logout da aplicação
2. Fazer login novamente

Isso é necessário porque o token JWT é atualizado apenas quando o usuário faz login.

## 🔄 Como Funciona

### Fluxo de Autenticação

```
1. Usuário faz login → Firebase gera token JWT
2. Token contém: email, uid, e custom claims (admin: true)
3. Regras do Firestore/Storage verificam: request.auth.token.admin == true
4. Se true → permite acesso de admin
```

### Estrutura do Token

```json
{
  "email": "matheussouza286@gmail.com",
  "uid": "abc123...",
  "admin": true  // ← Custom Claim
}
```

## 📝 Adicionar/Remover Admins

### Adicionar Novo Admin

```bash
npm run set:admin novo-admin@email.com
```

### Remover Admin

Para remover permissões de admin, você precisa definir o custom claim como `false`:

```bash
# Você pode modificar o script set-custom-claims.ts
# para aceitar um parâmetro --remove ou criar um script separado
```

Ou edite o script `set-custom-claims.ts` e altere:
```typescript
await admin.auth().setCustomUserClaims(user.uid, {
  admin: false,  // Remove permissão
});
```

## 🔒 Regras de Segurança Atualizadas

### Firestore Rules

```javascript
function isAdmin() {
  return isAuthenticated() && request.auth.token.admin == true;
}
```

### Storage Rules

```javascript
function isAdmin() {
  return request.auth != null && request.auth.token.admin == true;
}
```

## ⚠️ Segurança

### ✅ Boas Práticas

1. **Nunca commite `serviceAccountKey.json`**
   - Já está no `.gitignore`
   - Se acidentalmente commitar, gere uma nova key imediatamente

2. **Mantenha a Service Account Key segura**
   - Não compartilhe o arquivo
   - Use apenas em ambientes seguros (servidor, CI/CD)

3. **Revise permissões regularmente**
   - Remova admins que não precisam mais de acesso
   - Monitore quem tem permissões de admin

4. **Use diferentes Service Accounts para diferentes ambientes**
   - Desenvolvimento, Staging, Produção

## 🚀 Próximos Passos

1. Instale o `firebase-admin`: `npm install firebase-admin`
2. Gere a Service Account Key no Firebase Console
3. Execute `npm run set:admin <seu-email>` para cada admin
4. Faça logout e login novamente na aplicação
5. Teste as permissões de admin

## 📚 Recursos

- [Firebase Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
