#!/bin/bash

# Script para criar coleções no Firestore usando Firebase CLI
# Execute: bash scripts/create-collections.sh

echo "🔥 Criando coleções no Firestore..."

# Verifica se está logado
firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Erro: Você precisa fazer login primeiro!"
    echo "Execute: npm run firebase login"
    exit 1
fi

echo "✅ Login verificado!"

# Nota: O Firebase CLI não tem um comando direto para criar coleções vazias
# A forma mais fácil é criar um documento temporário em cada coleção

echo ""
echo "📝 Nota: O Firebase CLI não pode criar coleções vazias."
echo "   A forma mais fácil é criar pelo Console:"
echo "   1. Acesse: https://console.firebase.google.com/"
echo "   2. Firestore Database > Dados"
echo "   3. Clique em 'Iniciar coleção'"
echo "   4. Crie as coleções: banners, quickLinks, locations, teamMembers, developmentContacts, settings"
echo ""
echo "   Ou você pode usar o script TypeScript que criamos anteriormente."
echo ""
