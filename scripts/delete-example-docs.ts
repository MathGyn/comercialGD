/**
 * Script para deletar os documentos "example" das coleções
 * 
 * Execute: npm run delete:examples <email> <senha>
 * 
 * Exemplo: npm run delete:examples matheussouza286@gmail.com suaSenha
 * 
 * IMPORTANTE: Este script requer autenticação. Forneça email e senha como argumentos.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { config } from 'dotenv';

config();

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

async function deleteExampleDocs() {
  try {
    // Solicita email e senha via argumentos da linha de comando
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.error("❌ Erro: Email e senha são obrigatórios!");
      console.log("\n📖 Uso:");
      console.log("   npm run delete:examples <email> <senha>");
      console.log("\n📝 Exemplo:");
      console.log("   npm run delete:examples matheussouza286@gmail.com suaSenha");
      process.exit(1);
    }

    console.log("🔐 Autenticando...");
    await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Autenticado com sucesso!\n");

    console.log("🗑️  Deletando documentos 'example'...\n");

    const collections = [
      "banners",
      "quickLinks",
      "locations",
      "teamMembers",
      "developmentContacts",
    ];

    for (const collectionName of collections) {
      try {
        console.log(`🗑️  Deletando 'example' de '${collectionName}'...`);
        const docRef = doc(db, collectionName, "example");
        await deleteDoc(docRef);
        console.log(`   ✅ Documento deletado de '${collectionName}'`);
      } catch (error: any) {
        if (error.code === "not-found") {
          console.log(`   ⚠️  Documento 'example' não encontrado em '${collectionName}' (já foi deletado?)`);
        } else {
          console.log(`   ❌ Erro ao deletar de '${collectionName}': ${error.message}`);
        }
      }
    }

    // Settings não tem "example", tem "general" que deve ser mantido
    console.log("\n💡 Nota: A coleção 'settings' tem o documento 'general' que deve ser mantido.");
    console.log("   Se quiser limpar os dados dele, faça manualmente pelo Console.\n");

    console.log("✨ Processo concluído!\n");

    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Erro:", error.message);
    if (error.code === "auth/invalid-credential") {
      console.error("   Verifique se o email e senha estão corretos.");
    }
    process.exit(1);
  }
}

deleteExampleDocs();
