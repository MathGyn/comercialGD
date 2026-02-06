/**
 * Script para verificar se as collections _GD existem no Firestore
 * Execute: npx tsx scripts/check-collections.ts
 */

const admin = require('firebase-admin');
const { readFileSync } = require('fs');

// Carrega a service account key
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkCollections() {
  const collections = [
    'banners_GD',
    'quickLinks_GD',
    'locations_GD',
    'teamMembers_GD',
    'developmentContacts_GD',
    'settings_GD',
    'projects_GD',
    'customerService_GD',
    'rateLimits_GD'
  ];

  console.log('\n🔍 Verificando collections no Firestore...\n');

  for (const collectionName of collections) {
    try {
      const snapshot = await db.collection(collectionName).limit(1).get();
      if (snapshot.empty) {
        console.log(`⚠️  ${collectionName} - Existe mas está VAZIA`);
      } else {
        console.log(`✅ ${collectionName} - Existe com ${snapshot.size} documento(s)`);
      }
    } catch (error) {
      console.log(`❌ ${collectionName} - Erro: ${error.message}`);
    }
  }

  console.log('\n');
  process.exit(0);
}

checkCollections();
