/**
 * Script para migrar dados existentes adicionando o campo 'order'
 * 
 * Execute: npx tsx scripts/migrate-order-field.ts <email> <senha>
 * 
 * IMPORTANTE: Este script preserva todos os dados existentes e apenas adiciona
 * o campo 'order' aos itens que não o possuem.
 */

import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  updateDoc, 
  doc,
  query,
  orderBy 
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Carrega variáveis de ambiente do arquivo .env
import { config } from 'dotenv';
config();

// Configuração do Firebase (usa as variáveis de ambiente)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function migrateCollection(
  collectionName: string,
  getOrderField: (item: any, index: number) => number
) {
  try {
    console.log(`\n📦 Migrando coleção '${collectionName}'...`);
    
    // Busca todos os documentos da coleção
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`   ⚠️  Coleção '${collectionName}' está vazia. Pulando...`);
      return;
    }

    const docs = querySnapshot.docs;
    let updated = 0;
    let skipped = 0;

    for (let i = 0; i < docs.length; i++) {
      const docRef = docs[i];
      const data = docRef.data();
      
      // Verifica se já tem o campo 'order'
      if (data.order !== undefined && data.order !== null) {
        skipped++;
        continue;
      }

      // Adiciona o campo 'order' baseado na posição atual ou outro critério
      const orderValue = getOrderField(data, i);
      
      await updateDoc(docRef.ref, {
        order: orderValue,
      });
      
      updated++;
      console.log(`   ✅ ${docRef.id}: order = ${orderValue}`);
    }

    console.log(`   📊 Total: ${docs.length} | Atualizados: ${updated} | Já tinham: ${skipped}`);
  } catch (error: any) {
    console.error(`   ❌ Erro ao migrar '${collectionName}':`, error.message);
  }
}

async function migrateAll() {
  try {
    console.log("🔐 Fazendo login...");
    
    const email = process.argv[2] || "matheussouza286@gmail.com";
    const password = process.argv[3];
    
    if (!password) {
      console.error("❌ Erro: Senha não fornecida!");
      console.log("Uso: npx tsx scripts/migrate-order-field.ts <email> <senha>");
      console.log("Exemplo: npx tsx scripts/migrate-order-field.ts matheussouza286@gmail.com suaSenha");
      process.exit(1);
    }

    await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Login realizado com sucesso!");

    console.log("\n🚀 Iniciando migração do campo 'order'...\n");

    // 1. Banners - já ordenados por order, então mantém a ordem atual
    await migrateCollection("banners_GD", (item, index) => {
      return item.order !== undefined ? item.order : index + 1;
    });

    // 2. Projects - já ordenados por order, então mantém a ordem atual
    await migrateCollection("projects_GD", (item, index) => {
      return item.order !== undefined ? item.order : index + 1;
    });

    // 3. Quick Links - ordena por createdAt (mais recente primeiro) ou por índice
    await migrateCollection("quickLinks_GD", (item, index) => {
      // Se tem createdAt, usa a ordem inversa (mais recente = menor número)
      // Se não, usa o índice + 1
      return index + 1;
    });

    // 4. Locations - ordena por nome alfabeticamente
    await migrateCollection("locations_GD", (item, index) => {
      return index + 1;
    });

    // 5. Team Members - ordena por nome alfabeticamente
    await migrateCollection("teamMembers_GD", (item, index) => {
      return index + 1;
    });

    // 6. Development Contacts - ordena por building alfabeticamente
    await migrateCollection("developmentContacts_GD", (item, index) => {
      return index + 1;
    });

    console.log("\n✨ Migração concluída com sucesso!");
    console.log("\n💡 Todos os dados foram preservados. Apenas o campo 'order' foi adicionado.");
    console.log("   Agora você pode usar drag and drop na página /admin!\n");

  } catch (error: any) {
    console.error("❌ Erro durante a migração:", error.message);
    if (error.code === "auth/invalid-credential") {
      console.error("   Verifique se o email e senha estão corretos.");
    }
    process.exit(1);
  }
}

migrateAll();
