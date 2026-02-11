/**
 * Migração de quickLinks: adiciona iconUrl quando ausente.
 *
 * Uso:
 *   npx tsx scripts/migrate-quicklinks-icon-field.ts <email> <senha>
 */

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, updateDoc, doc, Timestamp } from "firebase/firestore";
import { config } from "dotenv";

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
const auth = getAuth(app);
const db = getFirestore(app);

async function migrateCollection(collectionName: string): Promise<{ updated: number; total: number }> {
  const snapshot = await getDocs(collection(db, collectionName));
  let updated = 0;

  for (const item of snapshot.docs) {
    const data = item.data();
    if (data.iconUrl === undefined) {
      await updateDoc(doc(db, collectionName, item.id), {
        iconUrl: "",
        updatedAt: Timestamp.now(),
      });
      updated++;
    }
  }

  return { updated, total: snapshot.size };
}

async function runMigration() {
  try {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.error("Uso: npx tsx scripts/migrate-quicklinks-icon-field.ts <email> <senha>");
      process.exit(1);
    }

    console.log("🔐 Autenticando...");
    await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Login realizado com sucesso.");

    const collections = ["quickLinks", "quickLinks_GD"];
    let totalUpdated = 0;

    for (const name of collections) {
      try {
        const result = await migrateCollection(name);
        totalUpdated += result.updated;
        console.log(`📦 ${name}: ${result.updated}/${result.total} documentos atualizados.`);
      } catch (error) {
        console.warn(`⚠️ Não foi possível migrar ${name}.`, error);
      }
    }

    console.log(`✨ Migração concluída. Total alterado: ${totalUpdated}.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro na migração de iconUrl em quickLinks:", error);
    process.exit(1);
  }
}

runMigration();
