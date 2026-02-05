/**
 * Script para definir Custom Claims de admin no Firebase
 * 
 * Custom Claims são atributos personalizados no token JWT do usuário
 * que permitem verificar permissões sem expor emails nas regras de segurança.
 * 
 * Execute: npm run set:admin <email>
 * 
 * IMPORTANTE: Este script requer o Firebase Admin SDK e uma service account.
 * 
 * Como configurar:
 * 1. No Firebase Console, vá em Project Settings > Service Accounts
 * 2. Clique em "Generate new private key"
 * 3. Salve o arquivo JSON como "serviceAccountKey.json" na raiz do projeto
 * 4. Adicione "serviceAccountKey.json" ao .gitignore
 * 5. Instale o firebase-admin: npm install firebase-admin
 */

import admin from 'firebase-admin';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

config();

async function setAdminClaim() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.error('❌ Erro: Email é obrigatório!');
      console.log('\n📖 Uso:');
      console.log('   npm run set:admin <email>');
      console.log('\n📝 Exemplo:');
      console.log('   npm run set:admin matheussouza286@gmail.com');
      process.exit(1);
    }

    // Tenta carregar a service account key
    let serviceAccount;
    const keyPath = join(process.cwd(), 'serviceAccountKey.json');

    try {
      const serviceAccountKey = readFileSync(keyPath, 'utf8');
      serviceAccount = JSON.parse(serviceAccountKey);
    } catch (error) {
      console.error('❌ Erro: Não foi possível carregar serviceAccountKey.json');
      console.log('\n📋 Como configurar:');
      console.log('1. No Firebase Console, vá em Project Settings > Service Accounts');
      console.log('2. Clique em "Generate new private key"');
      console.log('3. Salve o arquivo JSON como "serviceAccountKey.json" na raiz do projeto');
      console.log('4. Adicione "serviceAccountKey.json" ao .gitignore');
      console.log('5. Instale o firebase-admin: npm install firebase-admin\n');
      process.exit(1);
    }

    // Inicializa o Firebase Admin SDK
    // Verifica se já existe uma app inicializada
    const apps = admin.apps || [];
    if (apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    }

    // Busca o usuário pelo email
    const user = await admin.auth().getUserByEmail(email);

    if (!user) {
      console.error(`❌ Erro: Usuário com email ${email} não encontrado.`);
      console.log('\n💡 Dica: Certifique-se de que o usuário existe no Firebase Authentication.');
      process.exit(1);
    }

    // Define o custom claim "admin: true"
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
    });

    console.log(`\n✅ Custom claim de admin definido com sucesso para: ${email}`);
    console.log(`   UID: ${user.uid}`);
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   O usuário precisa fazer logout e login novamente para que o token seja atualizado.');
    console.log('   As regras do Firestore e Storage agora verificam request.auth.token.admin == true\n');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erro:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.error('   Usuário não encontrado. Verifique se o email está correto.');
    }
    process.exit(1);
  }
}

setAdminClaim();
