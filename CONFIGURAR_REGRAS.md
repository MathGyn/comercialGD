# 🔒 Como Configurar as Regras de Segurança do Firestore

## 📋 Passo a Passo

### 1. Copiar as Regras

1. Abra o arquivo `firestore.rules` que foi criado no projeto
2. Copie TODO o conteúdo do arquivo

### 2. Colar no Firebase Console

1. No Firebase Console, na aba **"Regras"** (que você está vendo agora)
2. **Delete todo o conteúdo** que está no editor (o código atual que permite acesso livre)
3. **Cole o conteúdo** do arquivo `firestore.rules`
4. Clique no botão **"Publicar"** (ou "Publish") no topo da página

### 3. Entender as Regras

As regras que você vai colar fazem o seguinte:

- ✅ **Leitura pública**: Qualquer pessoa pode ler os dados (banners, links, localizações, etc.)
- 🔐 **Escrita protegida**: Apenas usuários autenticados e com permissão de admin podem criar, editar ou deletar

### 4. Configurar Admin (Importante!)

As regras atuais usam **Custom Claims** para verificar se o usuário é admin. Isso é mais seguro porque não expõe emails nas regras.

#### Como Funciona

As regras verificam se o usuário tem o custom claim `admin: true`:

```javascript
function isAdmin() {
  return isAuthenticated() && request.auth.token.admin == true;
}
```

#### Como Adicionar um Novo Admin

**Método Recomendado: Usar Custom Claims**

1. Certifique-se de que o usuário existe no Firebase Authentication
2. Execute o script para definir o custom claim:

```bash
npm run set:admin email-do-usuario@exemplo.com
```

3. O usuário precisa fazer **logout e login novamente** para que o token seja atualizado

**📖 Documentação Completa:** Veja `CUSTOM_CLAIMS.md` para instruções detalhadas.

#### Criar Conta para o Novo Admin

1. No Firebase Console, vá em **Authentication** > **Users**
2. Clique em **"Adicionar usuário"** (Add user)
3. Digite o email e senha do novo admin
4. Clique em **"Adicionar usuário"**

**OU** o novo admin pode se registrar diretamente na aplicação através da página de login.

#### Configuração Inicial (Primeira Vez)

Se você ainda não configurou Custom Claims:

1. Instale o Firebase Admin SDK: `npm install firebase-admin`
2. Gere a Service Account Key no Firebase Console (Project Settings > Service Accounts)
3. Salve como `serviceAccountKey.json` na raiz do projeto
4. Execute `npm run set:admin <seu-email>` para cada admin
5. Faça logout e login novamente na aplicação

**📖 Veja `CUSTOM_CLAIMS.md` para instruções completas.**

### 5. Testar as Regras

1. No Firebase Console, use o **"Laboratório de testes de regras"** (abaixo do editor)
2. Teste cenários como:
   - Usuário não autenticado tentando ler (deve funcionar ✅)
   - Usuário não autenticado tentando escrever (deve falhar ❌)
   - Usuário autenticado como admin tentando escrever (deve funcionar ✅)

## ⚠️ Importante

- **NÃO deixe as regras atuais** - elas permitem acesso total até 2026 e são inseguras
- **Teste antes de publicar** - use o laboratório de testes
- **Mantenha backup** - salve as regras antigas antes de substituir (caso precise reverter)

## 🚀 Próximos Passos

Depois de configurar as regras:

1. Configure a autenticação no Firebase Console
2. Crie as coleções no Firestore
3. Teste o acesso através da aplicação
