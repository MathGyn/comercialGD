# 🚀 Script de Inicialização das Coleções

Este script cria automaticamente todas as coleções necessárias no Firestore.

## 📋 Pré-requisitos

1. ✅ Authentication configurado no Firebase Console
2. ✅ Conta de usuário criada (com email e senha)
3. ✅ Arquivo `.env` configurado com as credenciais do Firebase

## 🎯 Como Usar

### Opção 1: Usando npm script

```bash
npm run init:collections matheussouza286@gmail.com suaSenha
```

### Opção 2: Usando tsx diretamente

```bash
npx tsx scripts/init-collections.ts matheussouza286@gmail.com suaSenha
```

## 📝 O que o script faz?

1. Faz login no Firebase com suas credenciais
2. Cria as seguintes coleções:
   - `banners` - Banners do home
   - `quickLinks` - Links úteis
   - `locations` - Localizações
   - `teamMembers` - Membros da equipe
   - `developmentContacts` - Contatos de empreendimentos
   - `settings` - Configurações gerais

3. Cria um documento de exemplo em cada coleção (você pode deletar depois)

## ⚠️ Importante

- O script cria documentos de exemplo que você pode deletar depois
- O importante é que as coleções sejam criadas
- Você precisa ter permissão de admin (conforme as regras do Firestore)

## 🔍 Verificando se funcionou

Após executar o script:

1. Acesse o Firebase Console
2. Vá em Firestore Database > Dados
3. Verifique se as coleções aparecem na lista

## ❌ Problemas Comuns

**Erro: "Senha não fornecida"**
- Certifique-se de passar o email e senha como argumentos

**Erro: "auth/invalid-credential"**
- Verifique se o email e senha estão corretos
- Certifique-se de que a conta foi criada no Firebase Console

**Erro: "Permission denied"**
- Verifique se as regras do Firestore permitem escrita para seu email
- Certifique-se de que você está usando o email correto (`matheussouza286@gmail.com`)
