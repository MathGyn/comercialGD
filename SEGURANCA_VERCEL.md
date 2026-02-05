# 🔒 Guia de Segurança - Site na Vercel

## ⚠️ Problema: "Site Não Confiável"

Algumas pessoas estão recebendo avisos de segurança ao acessar o site. Vamos entender e resolver isso.

---

## 🔍 **Possíveis Causas do Aviso**

### 1️⃣ **Domínio Personalizado Sem SSL Configurado**
Se você usa um domínio próprio (ex: `eltoncleimoveis.com.br`), o SSL pode não estar ativo.

**Como verificar:**
- Acesse: https://vercel.com → Seu Projeto → Settings → Domains
- Verifique se aparece ✅ **"SSL Certificate: Active"**

**Se aparecer ⚠️ "Pending" ou ❌ "Failed":**
1. Aguarde até 24h para propagação DNS
2. Verifique se os registros DNS estão corretos
3. Remova e adicione o domínio novamente na Vercel

---

### 2️⃣ **Link Compartilhado Sem HTTPS**
Se alguém compartilhar o link com `http://` ao invés de `https://`

**Solução implementada:**
✅ Adicionado header `upgrade-insecure-requests` que força HTTPS automaticamente

---

### 3️⃣ **Conteúdo Misto (Mixed Content)**
Quando o site HTTPS carrega recursos (imagens, scripts) via HTTP

**Verifique no código:**
```javascript
// ❌ ERRADO (HTTP)
<img src="http://exemplo.com/imagem.jpg" />

// ✅ CORRETO (HTTPS ou relativo)
<img src="https://exemplo.com/imagem.jpg" />
<img src="/imagem.jpg" />
```

**Como identificar:**
1. Abra o site no Chrome
2. Pressione F12 (DevTools)
3. Vá na aba **Console**
4. Procure por avisos de "Mixed Content"

---

### 4️⃣ **Cache do Navegador**
O navegador pode ter guardado uma versão antiga do site sem HTTPS

**Solução para usuários:**
- **Chrome/Edge:** Ctrl + Shift + Delete → Limpar cache
- **Firefox:** Ctrl + Shift + Delete → Limpar dados de navegação
- **Safari:** Cmd + Option + E → Limpar cache

---

## ✅ **Configurações de Segurança Implementadas**

Atualizei o [vercel.json](vercel.json) com headers de segurança:

```json
{
  "headers": [
    {
      "key": "Strict-Transport-Security",
      "value": "max-age=31536000; includeSubDomains"
      // 👆 Força HTTPS por 1 ano
    },
    {
      "key": "Content-Security-Policy",
      "value": "upgrade-insecure-requests"
      // 👆 Converte HTTP → HTTPS automaticamente
    },
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
      // 👆 Previne ataques MIME
    },
    {
      "key": "X-Frame-Options",
      "value": "DENY"
      // 👆 Previne Clickjacking
    },
    {
      "key": "X-XSS-Protection",
      "value": "1; mode=block"
      // 👆 Proteção contra XSS
    }
  ]
}
```

---

## 🚀 **Como Aplicar as Mudanças**

### 1️⃣ **Fazer Deploy na Vercel**

```bash
# Se usar Vercel CLI
vercel --prod

# Se usar Git (GitHub/GitLab)
git add vercel.json
git commit -m "feat: melhorar headers de segurança"
git push origin main
```

A Vercel fará deploy automático após o push!

---

### 2️⃣ **Verificar se Funcionou**

Após o deploy (2-5 minutos):

1. **Teste de SSL:**
   - Acesse: https://www.ssllabs.com/ssltest/
   - Cole a URL do seu site
   - Aguarde análise
   - Resultado esperado: **A ou A+**

2. **Teste de Segurança:**
   - Acesse: https://securityheaders.com
   - Cole a URL do seu site
   - Resultado esperado: **A ou superior**

3. **Teste Manual:**
   - Acesse o site
   - Verifique o **cadeado verde** 🔒 na barra de endereço
   - Clique no cadeado → "A conexão é segura"

---

## 🔧 **Checklist de Configuração Vercel**

### No Dashboard da Vercel:

- [ ] Projeto conectado ao Git
- [ ] Build executando sem erros
- [ ] Domínio configurado (se usar personalizado)
- [ ] SSL ativo no domínio
- [ ] Environment variables configuradas

### Verificação de Domínio:

```bash
# 1. Verificar se SSL está ativo
curl -I https://seusite.com.br | grep -i "strict-transport"

# 2. Verificar redirecionamento HTTP → HTTPS
curl -I http://seusite.com.br
# Deve retornar: 301 ou 308 (redirect para HTTPS)
```

---

## 🛠️ **Solução para Domínio Personalizado**

Se você usa domínio próprio e está com problema de SSL:

### 1️⃣ **Na Vercel:**
1. Acesse: https://vercel.com → Seu Projeto
2. Settings → Domains
3. Clique em **Add Domain**
4. Digite: `seudominio.com.br` e `www.seudominio.com.br`
5. Anote os valores DNS fornecidos

### 2️⃣ **No Registrador do Domínio:**
Adicione os registros DNS:

```
Tipo: A
Nome: @
Valor: 76.76.21.21

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

### 3️⃣ **Aguarde:**
- Propagação DNS: 5 minutos a 48 horas
- SSL automático: 5-30 minutos após DNS propagar
- Não há custo adicional!

---

## 📱 **Instruções para Usuários que Veem o Aviso**

Compartilhe com quem reportar o problema:

### Passos Rápidos:
1. **Limpar cache do navegador** (Ctrl + Shift + Delete)
2. **Acessar com HTTPS:** Certifique-se de usar `https://` no início da URL
3. **Atualizar navegador:** Use versão mais recente do Chrome/Firefox/Safari
4. **Testar em aba anônima:** Ctrl + Shift + N (Chrome) ou Ctrl + Shift + P (Firefox)
5. **Verificar antivírus:** Alguns antivírus bloqueiam sites novos temporariamente

### Se o problema persistir:
- Peça para tirar print do aviso exato
- Verifique qual navegador está usando
- Teste em outro dispositivo/rede

---

## 📊 **Monitoramento Contínuo**

### Ferramentas Gratuitas:

1. **SSL Checker:**
   - https://www.sslshopper.com/ssl-checker.html
   - Verifica validade do certificado

2. **Security Headers:**
   - https://securityheaders.com
   - Analisa headers de segurança

3. **Vercel Analytics:**
   - Dashboard da Vercel → Analytics
   - Monitora performance e erros

---

## 🆘 **Problemas Comuns**

### ❌ "NET::ERR_CERT_AUTHORITY_INVALID"
**Causa:** Certificado SSL inválido ou expirado
**Solução:**
1. Vercel renova automaticamente, aguarde 24h
2. Se persistir, remova e re-adicione o domínio na Vercel

### ❌ "Mixed Content Blocked"
**Causa:** Recursos HTTP em página HTTPS
**Solução:**
1. Abra DevTools (F12) → Console
2. Identifique recursos HTTP
3. Altere para HTTPS ou use URLs relativas

### ❌ "HSTS Policy"
**Causa:** Navegador forçando HTTPS mas site não responde
**Solução:**
1. Verifique se HTTPS está funcionando
2. Limpe HSTS no navegador: `chrome://net-internals/#hsts`

---

## ✨ **Resumo das Melhorias**

Com as configurações atualizadas:

✅ **HTTPS forçado** - Todos os acessos via conexão segura
✅ **Headers de segurança** - Proteção contra ataques comuns
✅ **SSL/TLS ativo** - Certificado válido renovado automaticamente
✅ **Redirecionamento automático** - HTTP → HTTPS transparente
✅ **Cache otimizado** - Performance melhorada
✅ **Conformidade** - Atende padrões modernos de segurança

---

## 📞 **Próximos Passos**

1. **Fazer deploy** das novas configurações
2. **Testar** em diferentes navegadores
3. **Monitorar** relatórios de usuários
4. **Compartilhar** a URL sempre com `https://`

**Após o deploy, peça para os usuários que reportaram testarem novamente!**

---

**🔐 Com essas configurações, seu site terá segurança de nível empresarial!**
