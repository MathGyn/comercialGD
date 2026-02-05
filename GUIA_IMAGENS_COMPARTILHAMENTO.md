# 📸 Guia de Imagens de Compartilhamento (Open Graph)

## 🎯 O que é Open Graph?

Open Graph (OG) é o protocolo que define como seu site aparece quando compartilhado em:
- 📱 WhatsApp
- 📘 Facebook
- 🐦 Twitter/X
- 💼 LinkedIn
- 📧 Email (alguns clientes)

---

## ✅ **CONFIGURAÇÃO ATUAL:**

### Arquivo Configurado:
- **Localização:** `/public/og-image.webp`
- **URL pública:** `https://comercialgyn.com.br/og-image.webp`
- **Meta tags:** ✅ Configuradas no [index.html](index.html:19-32)

---

## 📏 **ESPECIFICAÇÕES TÉCNICAS**

### **Dimensões Recomendadas:**

| Plataforma | Tamanho Ideal | Proporção | Mínimo |
|------------|---------------|-----------|---------|
| **WhatsApp** | 1200x630 px | 1.91:1 | 600x315 px |
| **Facebook** | 1200x630 px | 1.91:1 | 600x315 px |
| **Twitter** | 1200x675 px | 16:9 | 600x335 px |
| **LinkedIn** | 1200x627 px | 1.91:1 | 1080x608 px |

**Recomendação universal:** **1200x630 pixels** (funciona em todas)

### **Formato do Arquivo:**

| Formato | Suporte | Tamanho | Qualidade | Recomendado |
|---------|---------|---------|-----------|-------------|
| **JPG** | ✅ Universal | Médio | Boa | ✅ Sim |
| **PNG** | ✅ Universal | Grande | Ótima | ⚠️ Só se precisar transparência |
| **WebP** | ✅ Moderno | Pequeno | Excelente | ✅ **Melhor opção** |
| GIF | ⚠️ Limitado | Grande | Baixa | ❌ Não |

**Você está usando:** ✅ **WebP** (ótima escolha!)

### **Peso do Arquivo:**
- **Máximo:** 8 MB (limite do Facebook)
- **Recomendado:** < 300 KB
- **Ideal:** 100-200 KB

---

## 🎨 **DICAS DE DESIGN**

### 1️⃣ **Área Segura (Safe Zone)**
Diferentes plataformas cortam as bordas de formas diferentes:

```
┌─────────────────────────────────────┐
│                                     │ ← 10% topo (pode ser cortado)
│     ┌─────────────────────┐        │
│     │                     │        │
│     │   ÁREA SEGURA       │        │ ← Conteúdo importante aqui
│     │                     │        │
│     └─────────────────────┘        │
│                                     │ ← 10% base (pode ser cortado)
└─────────────────────────────────────┘
    ↑                           ↑
   10%                         10%
(bordas laterais podem ser cortadas)
```

**Regra de ouro:** Mantenha logo, texto e elementos importantes **no centro da imagem**.

### 2️⃣ **Tamanho do Texto**
- **Título principal:** Mínimo 60-80px
- **Subtítulo:** Mínimo 40-50px
- **Texto pequeno:** Evite! Ficará ilegível no mobile

### 3️⃣ **Cores**
✅ **BOM:**
- Alto contraste (branco sobre escuro, escuro sobre claro)
- Cores vibrantes e chamativas
- Sólidas ou com gradientes suaves

❌ **EVITAR:**
- Cores muito similares (baixo contraste)
- Gradientes complexos (podem dar banda no WhatsApp)
- Texto sobre imagens sem fundo

### 4️⃣ **Elementos Visuais**
✅ Incluir:
- Logo da empresa (grande e visível)
- Título claro e objetivo
- Imagem de destaque (empreendimento/produto)
- Call-to-action sutil

❌ Evitar:
- Muita informação (menos é mais)
- Texto em fontes serifadas pequenas
- Imagens genéricas de banco de imagens

---

## 📂 **ESTRUTURA DE ARQUIVOS**

```
/public/
  ├── og-image.webp          ← Imagem principal (você já tem!)
  ├── og-image-facebook.jpg  ← (Opcional) Versão específica Facebook
  ├── og-image-twitter.jpg   ← (Opcional) Versão específica Twitter
  └── favicon.svg            ← Ícone do site
```

**Você só precisa de `og-image.webp`** (já configurado!)

---

## 🧪 **COMO TESTAR**

### 1️⃣ **Testar no WhatsApp:**
1. Abra o WhatsApp Web: https://web.whatsapp.com
2. Cole o link: `https://comercialgyn.com.br`
3. **Aguarde 5-10 segundos** antes de enviar
4. A prévia deve aparecer com sua imagem!

⚠️ **WhatsApp cacheia por ~7 dias!** Se atualizar a imagem, pode demorar para aparecer.

### 2️⃣ **Debugger do Facebook:**
```
https://developers.facebook.com/tools/debug/
```
1. Cole: `https://comercialgyn.com.br`
2. Clique em **"Depurar"**
3. Veja como aparece no Facebook
4. Clique em **"Buscar novas informações"** para limpar cache

### 3️⃣ **Debugger do Twitter:**
```
https://cards-dev.twitter.com/validator
```
1. Cole: `https://comercialgyn.com.br`
2. Clique em **"Preview card"**
3. Veja como aparece no Twitter/X

### 4️⃣ **Debugger do LinkedIn:**
```
https://www.linkedin.com/post-inspector/
```
1. Cole: `https://comercialgyn.com.br`
2. Veja preview no LinkedIn

### 5️⃣ **Teste Visual Rápido:**
```
https://www.opengraph.xyz/url/https%3A%2F%2Fcomercialgyn.com.br
```
Mostra como aparece em várias plataformas simultaneamente!

---

## 🔄 **COMO ATUALIZAR A IMAGEM**

### Passo 1: Criar/Editar Imagem
- Use Canva, Photoshop, Figma, etc.
- Exportar em **1200x630 pixels**
- Salvar como **WebP** (ou JPG se não tiver WebP)

### Passo 2: Substituir Arquivo
```bash
# Sobrescrever arquivo na pasta public
cp nova-imagem.webp /public/og-image.webp
```

### Passo 3: Deploy
```bash
git add public/og-image.webp
git commit -m "feat: atualizar imagem de compartilhamento"
git push origin main
```

### Passo 4: Limpar Cache
Após deploy (5 minutos):
1. **Facebook:** https://developers.facebook.com/tools/debug/ → "Buscar novas informações"
2. **Twitter:** https://cards-dev.twitter.com/validator
3. **WhatsApp:** Pode levar até 7 dias (ou use link com parâmetro: `?v=2`)

**Dica:** Adicione versão na URL para forçar atualização:
```html
<meta property="og:image" content="https://comercialgyn.com.br/og-image.webp?v=2" />
```

---

## 🎨 **TEMPLATES RECOMENDADOS**

### Template 1: Foco no Empreendimento
```
┌─────────────────────────────────────┐
│                                     │
│   [LOGO]          [Foto grande do  │
│                    empreendimento]  │
│   TÍTULO GRANDE                     │
│   Subtítulo menor                   │
│                                     │
└─────────────────────────────────────┘
```

### Template 2: Foco em Texto
```
┌─────────────────────────────────────┐
│                                     │
│        [LOGO CENTRALIZADA]          │
│                                     │
│      TÍTULO EM DESTAQUE             │
│      ───────────────────            │
│      Descrição curta aqui           │
│                                     │
└─────────────────────────────────────┘
```

### Template 3: Split (Dois Lados)
```
┌─────────────────────────────────────┐
│            │                        │
│   TEXTO    │    [IMAGEM]           │
│   AQUI     │     GRANDE            │
│  [LOGO]    │                        │
│            │                        │
└─────────────────────────────────────┘
```

---

## 🛠️ **FERRAMENTAS PARA CRIAR A IMAGEM**

### Gratuitas:
1. **Canva** (mais fácil)
   - https://www.canva.com
   - Template: "Facebook Post" (1200x630)
   - ✅ Recomendado para iniciantes

2. **Figma** (mais profissional)
   - https://www.figma.com
   - Frame: 1200x630px
   - ✅ Melhor para designers

3. **GIMP** (open source)
   - https://www.gimp.org
   - ✅ Alternativa ao Photoshop

4. **Photopea** (Photoshop online grátis)
   - https://www.photopea.com
   - ✅ Não precisa instalar nada

### Pagas:
- Adobe Photoshop
- Adobe Illustrator
- Sketch (Mac)

---

## 📊 **CHECKLIST DE QUALIDADE**

Antes de publicar, verifique:

- [ ] Dimensões: 1200x630 pixels
- [ ] Formato: WebP, JPG ou PNG
- [ ] Peso: < 300 KB
- [ ] Logo visível e legível
- [ ] Texto grande (mínimo 60px)
- [ ] Alto contraste
- [ ] Elementos importantes no centro (não nas bordas)
- [ ] Testado no WhatsApp
- [ ] Testado no Facebook Debugger
- [ ] URL absoluta nas meta tags (com https://)
- [ ] Cache limpo após atualização

---

## 🔍 **META TAGS ATUAIS**

Seu site está configurado com as seguintes meta tags (no [index.html](index.html)):

```html
<!-- Open Graph / WhatsApp / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://comercialgyn.com.br/" />
<meta property="og:title" content="Comercial Eltoncley - Empreendimentos Imobiliários" />
<meta property="og:description" content="Descubra os melhores empreendimentos..." />
<meta property="og:image" content="https://comercialgyn.com.br/og-image.webp" />
<meta property="og:image:type" content="image/webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Comercial Eltoncley - Empreendimentos Imobiliários" />
<meta property="og:site_name" content="Comercial Eltoncley" />
<meta property="og:locale" content="pt_BR" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Comercial Eltoncley - Empreendimentos Imobiliários" />
<meta name="twitter:description" content="Descubra os melhores empreendimentos..." />
<meta name="twitter:image" content="https://comercialgyn.com.br/og-image.webp" />
```

✅ **Tudo configurado corretamente!**

---

## 🆘 **PROBLEMAS COMUNS**

### ❌ Imagem não aparece no WhatsApp
**Causas:**
1. Cache do WhatsApp (até 7 dias)
2. Imagem muito pesada (> 8 MB)
3. URL incorreta ou quebrada
4. Servidor bloqueando bot do WhatsApp

**Soluções:**
1. Aguardar ou adicionar `?v=2` na URL
2. Comprimir imagem
3. Verificar URL no navegador: `https://comercialgyn.com.br/og-image.webp`
4. Verificar headers do servidor

### ❌ Imagem cortada errada
**Causa:** Elementos importantes nas bordas

**Solução:** Manter elementos no centro (zona segura)

### ❌ Imagem aparece, mas antiga
**Causa:** Cache das plataformas

**Solução:**
1. Facebook: Debugger → "Buscar novas informações"
2. Adicionar versão na URL: `og-image.webp?v=2`

---

## 📱 **EXEMPLO DE COMPARTILHAMENTO**

### WhatsApp (aparece assim):
```
┌─────────────────────────────┐
│ [Sua imagem og-image.webp] │
│                             │
│ Comercial Eltoncley -       │
│ Empreendimentos Imobiliários│
│                             │
│ Descubra os melhores...     │
│                             │
│ comercialgyn.com.br         │
└─────────────────────────────┘
```

---

## 🎓 **RECURSOS ADICIONAIS**

### Documentação Oficial:
- Open Graph: https://ogp.me/
- Twitter Cards: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
- Facebook OG: https://developers.facebook.com/docs/sharing/webmasters

### Ferramentas Úteis:
- Compressor de Imagem: https://tinypng.com/ ou https://squoosh.app/
- Gerador de OG Image: https://www.opengraph.xyz/
- Preview de OG: https://metatags.io/

---

## ✅ **RESUMO RÁPIDO**

**Seu site já está configurado!** 🎉

- ✅ Arquivo: `/public/og-image.webp`
- ✅ URL: `https://comercialgyn.com.br/og-image.webp`
- ✅ Meta tags: Configuradas
- ✅ Formato: WebP (moderno e leve)
- ✅ Dimensões: 1200x630 (ideal)

**Para atualizar:**
1. Criar nova imagem (1200x630)
2. Salvar como `og-image.webp`
3. Substituir em `/public/`
4. Fazer commit e push
5. Limpar cache no Facebook Debugger

---

**🚀 Pronto para compartilhar!**
