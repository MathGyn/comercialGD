# 🚀 Próximos Passos - Configuração do Firebase

## ✅ O que já foi feito:
- [x] Firebase instalado e configurado
- [x] Variáveis de ambiente configuradas
- [x] Hooks e utilitários criados
- [x] Regras de segurança do Firestore configuradas

## 📋 Próximos Passos (em ordem):

### 1. Configurar Authentication no Firebase Console

**Por que:** Para você poder fazer login e ter acesso de admin.

**Como fazer:**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `comercialeltoncley`
3. Vá em **Authentication** (no menu lateral)
4. Clique em **"Começar"** (se for a primeira vez)
5. Vá na aba **"Sign-in method"** (Métodos de entrada)
6. Clique em **"Email/Password"**
7. Ative a opção **"Email/Password"** e clique em **"Salvar"**

**Importante:** Depois disso, você precisará criar sua conta de usuário (veja passo 2).

---

### 2. Criar sua Conta de Admin

**Por que:** Você precisa de uma conta para fazer login e acessar o painel admin.

**Como fazer:**
1. No Firebase Console, vá em **Authentication** > **Users**
2. Clique em **"Adicionar usuário"** (ou "Add user")
3. Digite seu email: `matheussouza286@gmail.com`
4. Digite uma senha temporária (você pode mudar depois)
5. Clique em **"Adicionar"**

**Ou** você pode criar a conta diretamente na aplicação (se implementarmos um formulário de registro).

---

### 3. Criar as Coleções no Firestore

**Por que:** As coleções precisam existir para você poder salvar dados.

**Como fazer:**
1. No Firebase Console, vá em **Firestore Database**
2. Clique na aba **"Dados"** (Data)
3. Clique em **"Iniciar coleção"** (Start collection)

**Crie as seguintes coleções:**

#### Coleção: `banners`
- Clique em "Iniciar coleção"
- ID da coleção: `banners`
- Adicione um documento de exemplo (pode deletar depois):
  - Campo: `imageDesktop` (string) - Valor: `https://example.com/image.jpg`
  - Campo: `imageMobile` (string) - Valor: `https://example.com/image.jpg`
  - Campo: `buttonText` (string) - Valor: `Saiba Mais`
  - Campo: `buttonLink` (string) - Valor: `https://example.com`
  - Campo: `order` (number) - Valor: `1`

#### Coleção: `quickLinks`
- ID da coleção: `quickLinks`
- Documento de exemplo:
  - Campo: `title` (string) - Valor: `Exemplo`
  - Campo: `description` (string) - Valor: `Descrição`
  - Campo: `url` (string) - Valor: `https://example.com`
  - Campo: `icon` (string) - Valor: `default`

#### Coleção: `locations`
- ID da coleção: `locations`
- Documento de exemplo:
  - Campo: `name` (string) - Valor: `Exemplo`
  - Campo: `address` (string) - Valor: `Endereço exemplo`
  - Campo: `wazeLink` (string) - Valor: `https://waze.com/...`
  - Campo: `mapsLink` (string) - Valor: `https://maps.google.com/...`
  - Campo: `lat` (number) - Valor: `-16.7056`
  - Campo: `lng` (number) - Valor: `-49.2647`

#### Coleção: `teamMembers`
- ID da coleção: `teamMembers`
- Documento de exemplo:
  - Campo: `name` (string) - Valor: `Nome Exemplo`
  - Campo: `role` (string) - Valor: `Cargo`
  - Campo: `avatar` (string) - Valor: `https://example.com/avatar.jpg`
  - Campo: `whatsapp` (string) - Valor: `5511999999999`

#### Coleção: `developmentContacts`
- ID da coleção: `developmentContacts`
- Documento de exemplo:
  - Campo: `building` (string) - Valor: `Empreendimento Exemplo`
  - Campo: `phone` (string) - Valor: `+55 11 0000-0000`
  - Campo: `whatsapp` (string) - Valor: `5511999999999`
  - Campo: `email` (string) - Valor: `contato@example.com`

#### Coleção: `settings`
- ID da coleção: `settings`
- ID do documento: `general`
- Documento:
  - Campo: `driveLink` (string) - Valor: `https://drive.google.com/...`

**Dica:** Você pode deletar os documentos de exemplo depois. O importante é que as coleções existam.

---

### 4. Configurar Regras de Storage (Opcional)

**Por que:** Se você for fazer upload de imagens diretamente pelo Firebase Storage.

**Como fazer:**
1. No Firebase Console, vá em **Storage**
2. Clique em **"Começar"** (se for a primeira vez)
3. Vá na aba **"Rules"**
4. Cole as seguintes regras:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permite leitura pública de imagens
    match /{allPaths=**} {
      allow read: if true;
      // Apenas admins podem fazer upload
      allow write: if request.auth != null && 
                      request.auth.token.email == 'matheussouza286@gmail.com';
    }
  }
}
```

5. Clique em **"Publicar"**

---

### 5. Implementar Autenticação no Painel Admin

**Por que:** O painel admin precisa verificar se o usuário está autenticado antes de permitir acesso.

**O que precisa ser feito:**
- Adicionar verificação de autenticação na página Admin
- Criar uma página de login
- Proteger a rota `/admin` para apenas usuários autenticados

**Posso fazer isso agora se você quiser!** 🚀

---

### 6. Testar a Integração

**Como testar:**
1. Inicie a aplicação: `npm run dev`
2. Tente acessar `/admin` (deve pedir login)
3. Faça login com seu email e senha
4. Teste criar, editar e deletar dados
5. Verifique se os dados aparecem na página principal

---

## 🎯 Resumo Rápido

1. ✅ **Firebase configurado** - Feito
2. ⏳ **Authentication** - Configure no Console
3. ⏳ **Criar conta admin** - Crie no Console
4. ⏳ **Criar coleções** - Crie no Firestore
5. ⏳ **Storage (opcional)** - Configure se precisar
6. ⏳ **Implementar login** - Posso fazer agora!

---

## 💡 Dica

Você pode fazer os passos 1, 2, 3 e 4 no Firebase Console agora, e depois eu implemento o sistema de login na aplicação. Ou podemos fazer tudo junto - você escolhe!
