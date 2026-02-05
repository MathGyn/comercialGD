# 🔒 Como Configurar as Regras de Storage do Firebase

## 📋 Passo a Passo

### 1. Copiar as Regras

1. Abra o arquivo `storage.rules` que foi criado no projeto
2. Copie TODO o conteúdo do arquivo

### 2. Colar no Firebase Console

1. No Firebase Console, vá em **Storage**
2. Clique na aba **"Rules"** (Regras)
3. **Delete todo o conteúdo** que está no editor
4. **Cole o conteúdo** do arquivo `storage.rules`
5. Clique no botão **"Publicar"** (ou "Publish")

### 3. Entender as Regras

As regras que você vai colar fazem o seguinte:

- ✅ **Leitura pública**: Qualquer pessoa pode ver/download das imagens
- 🔐 **Escrita protegida**: Apenas você (com email `matheussouza286@gmail.com`) pode fazer upload

### 4. Testar

Depois de configurar, teste fazendo upload de uma imagem no painel admin.

---

## ⚠️ Importante

- **NÃO deixe as regras padrão** - elas podem ser inseguras
- **Teste antes de publicar** - use o laboratório de testes se disponível
- **Mantenha backup** - salve as regras antigas antes de substituir

---

## 🎯 Próximos Passos

Depois de configurar as regras:

1. ✅ Teste o upload de imagem no painel admin
2. ✅ Verifique se as imagens aparecem corretamente
3. ✅ Confirme que as imagens estão sendo otimizadas
