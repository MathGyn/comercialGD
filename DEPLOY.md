# 🚀 Guia de Deploy - Elton Cley Comercial

## 🔒 Solução para "Site Não Confiável"

O aviso de "site não confiável" acontece quando o site **não usa HTTPS** (conexão segura). Este projeto agora está configurado com **Firebase Hosting**, que oferece:

✅ **HTTPS automático e gratuito**
✅ **CDN global** (site rápido no mundo todo)
✅ **Domínio personalizado com SSL**
✅ **Certificado SSL renovado automaticamente**

---

## 📋 Pré-requisitos

1. **Node.js** instalado (v18 ou superior)
2. **Firebase CLI** instalado
3. **Conta Firebase** autenticada

---

## 🛠️ Passo a Passo para Deploy

### 1️⃣ **Build do Projeto**
```bash
npm run build
```
Isso cria a pasta `dist/` com os arquivos otimizados para produção.

### 2️⃣ **Deploy para Firebase Hosting**
```bash
npm run deploy
```
ou
```bash
firebase deploy --only hosting
```

### 3️⃣ **Deploy Completo (Hosting + Functions + Rules)**
```bash
npm run deploy:all
```
ou
```bash
firebase deploy
```

---

## 🌐 URLs do Projeto

Após o deploy, seu site estará disponível em:

**URL Firebase (automática):**
```
https://comercialeltoncley.web.app
https://comercialeltoncley.firebaseapp.com
```

Ambas URLs terão **HTTPS automático** e **certificado SSL válido**.

---

## 🔧 Configurar Domínio Personalizado (Opcional)

Se você quiser usar um domínio próprio (ex: `eltoncleimoveis.com.br`):

### 1️⃣ **No Firebase Console**
1. Acesse: https://console.firebase.google.com
2. Selecione o projeto **comercialeltoncley**
3. Vá em **Hosting** no menu lateral
4. Clique em **Adicionar domínio personalizado**
5. Digite seu domínio (ex: `eltoncleimoveis.com.br`)
6. Siga as instruções para adicionar registros DNS

### 2️⃣ **No seu Registrador de Domínio**
Adicione os registros DNS fornecidos pelo Firebase:
- Tipo: **A** ou **TXT** (conforme instruções)
- Nome: **@** ou **www**
- Valor: (fornecido pelo Firebase)

### 3️⃣ **Aguarde Propagação**
- DNS: 5 minutos a 48 horas
- SSL: Automático após DNS propagado

✅ **Firebase gerencia o certificado SSL automaticamente!**

---

## 📱 Testando o Deploy

Após o deploy, teste:

1. ✅ Acesse a URL do Firebase
2. ✅ Verifique o **cadeado verde** no navegador (HTTPS)
3. ✅ Teste em diferentes dispositivos
4. ✅ Verifique se todas as funcionalidades funcionam

---

## 🆘 Solução de Problemas

### ❌ "Site não confiável" ainda aparece?

**Possíveis causas:**

1. **Cache do navegador:** Limpe o cache (Ctrl+F5)
2. **DNS não propagado:** Aguarde até 48h se usar domínio personalizado
3. **HTTP redirect:** Certifique-se de acessar com `https://`

### ❌ Erro "Cannot find module 'dist'"

Execute o build antes do deploy:
```bash
npm run build
npm run deploy
```

### ❌ Erro "No targets to deploy"

Verifique se o `firebase.json` tem a configuração de hosting:
```json
{
  "hosting": {
    "public": "dist",
    ...
  }
}
```

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento local
npm run dev

# Build de produção
npm run build

# Preview do build (sem deploy)
npm run preview

# Deploy apenas hosting
npm run deploy

# Deploy completo (hosting + functions + rules)
npm run deploy:all

# Deploy apenas functions
npm run functions:deploy

# Ver logs das functions
npm run functions:logs
```

---

## 🔐 Segurança Garantida

Com Firebase Hosting, você terá:

✅ **SSL/TLS automático** (HTTPS)
✅ **Certificado válido** renovado automaticamente
✅ **HTTP → HTTPS redirect** automático
✅ **Headers de segurança** configurados
✅ **DDoS protection** incluído
✅ **CDN global** com edge caching

---

## 📞 Suporte

Se tiver dúvidas sobre o deploy:
1. Documentação oficial: https://firebase.google.com/docs/hosting
2. Console Firebase: https://console.firebase.google.com

---

**✨ Agora seu site terá conexão segura (HTTPS) e não mostrará mais avisos de "site não confiável"!**
