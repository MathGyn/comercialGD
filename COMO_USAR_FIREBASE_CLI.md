# 🔥 Como Usar o Firebase CLI

## 1️⃣ Fazer Login

Execute no terminal:

```bash
npm run firebase login
```

Ou se preferir usar npx diretamente:

```bash
npx firebase login
```

Isso vai abrir o navegador para você fazer login com sua conta Google (a mesma do Firebase Console).

---

## 2️⃣ Inicializar o Projeto (se necessário)

Se ainda não inicializou o Firebase no projeto:

```bash
npm run firebase init firestore
```

Ou:

```bash
npx firebase init firestore
```

**Mas você pode pular esse passo** se só quer criar as coleções manualmente.

---

## 3️⃣ Criar as Coleções no Firestore

### Opção A: Pelo Console (Mais Fácil) 🎯

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `comercialeltoncley`
3. Vá em **Firestore Database** > **Dados**
4. Clique em **"Iniciar coleção"** (Start collection)
5. Crie as seguintes coleções:

#### Coleção: `banners`
- ID da coleção: `banners`
- Adicione um documento qualquer (pode deletar depois):
  - Campo: `test` (string) - Valor: `test`

#### Coleção: `quickLinks`
- ID da coleção: `quickLinks`
- Adicione um documento qualquer

#### Coleção: `locations`
- ID da coleção: `locations`
- Adicione um documento qualquer

#### Coleção: `teamMembers`
- ID da coleção: `teamMembers`
- Adicione um documento qualquer

#### Coleção: `developmentContacts`
- ID da coleção: `developmentContacts`
- Adicione um documento qualquer

#### Coleção: `settings`
- ID da coleção: `settings`
- ID do documento: `general`
- Adicione um documento com:
  - Campo: `driveLink` (string) - Valor: `https://drive.google.com/...`

**Pronto!** As coleções estão criadas. Você pode deletar os documentos de teste depois.

---

### Opção B: Usando o CLI (Avançado)

Se quiser usar o CLI para criar, você precisaria de um script mais complexo. Mas a **Opção A pelo Console é muito mais simples** e recomendada! 😊

---

## 📝 Comandos Úteis do Firebase CLI

```bash
# Ver status do login
npm run firebase login:list

# Fazer logout
npm run firebase logout

# Ver projetos disponíveis
npm run firebase projects:list

# Usar um projeto específico
npm run firebase use comercialeltoncley

# Ver informações do projeto atual
npm run firebase projects:list
```

---

## ✅ Resumo Rápido

1. **Fazer login:** `npm run firebase login`
2. **Criar coleções:** Pelo Console (mais fácil) ou pelo CLI
3. **Pronto!** As coleções estão criadas e você pode começar a usar

---

## 💡 Dica

A forma mais fácil é criar as coleções pelo **Firebase Console** mesmo. É visual, rápido e não precisa de comandos complexos!
