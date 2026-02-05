/**
 * Script para inicializar as coleções do Firestore
 * 
 * Execute: npx tsx scripts/init-collections.ts
 * 
 * IMPORTANTE: Você precisa estar autenticado no Firebase.
 * Este script cria documentos de exemplo em cada coleção.
 * Você pode deletar esses documentos depois - o importante é que as coleções existam.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, Timestamp } from "firebase/firestore";
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

async function initCollections() {
  try {
    console.log("🔐 Fazendo login...");
    
    // Solicita email e senha
    const email = process.argv[2] || "matheussouza286@gmail.com";
    const password = process.argv[3];
    
    if (!password) {
      console.error("❌ Erro: Senha não fornecida!");
      console.log("Uso: npx tsx scripts/init-collections.ts <email> <senha>");
      console.log("Exemplo: npx tsx scripts/init-collections.ts matheussouza286@gmail.com suaSenha");
      process.exit(1);
    }

    // Faz login
    await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Login realizado com sucesso!");

    const now = Timestamp.now();

    console.log("\n📦 Criando coleções...\n");

    // 1. Banners
    console.log("1️⃣  Criando coleção 'banners_GD'...");
    const bannerRef = doc(collection(db, "banners_GD"), "example");
    await setDoc(bannerRef, {
      imageDesktop: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
      imageMobile: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&q=80",
      buttonText: "Saiba Mais",
      buttonLink: "https://example.com",
      order: 1,
      createdAt: now,
      updatedAt: now,
    });
    console.log("   ✅ Coleção 'banners_GD' criada");

    // 2. Quick Links
    console.log("2️⃣  Criando coleção 'quickLinks_GD'...");
    const linkRef = doc(collection(db, "quickLinks_GD"), "example");
    await setDoc(linkRef, {
      title: "Link Exemplo",
      description: "Descrição do link",
      url: "https://example.com",
      icon: "default",
      createdAt: now,
      updatedAt: now,
    });
    console.log("   ✅ Coleção 'quickLinks_GD' criada");

    // 3. Locations
    console.log("3️⃣  Criando coleção 'locations_GD'...");
    const locationRef = doc(collection(db, "locations_GD"), "example");
    await setDoc(locationRef, {
      name: "Localização Exemplo",
      address: "Endereço exemplo, 123",
      wazeLink: "https://waze.com/ul?ll=-16.7056,-49.2647",
      mapsLink: "https://maps.google.com/?q=-16.7056,-49.2647",
      lat: -16.7056,
      lng: -49.2647,
      createdAt: now,
      updatedAt: now,
    });
    console.log("   ✅ Coleção 'locations_GD' criada");

    // 4. Team Members
    console.log("4️⃣  Criando coleção 'teamMembers_GD'...");
    const teamRef = doc(collection(db, "teamMembers_GD"), "example");
    await setDoc(teamRef, {
      name: "Membro Exemplo",
      role: "Cargo Exemplo",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      whatsapp: "5511999999999",
      createdAt: now,
      updatedAt: now,
    });
    console.log("   ✅ Coleção 'teamMembers_GD' criada");

    // 5. Development Contacts
    console.log("5️⃣  Criando coleção 'developmentContacts_GD'...");
    const contactRef = doc(collection(db, "developmentContacts_GD"), "example");
    await setDoc(contactRef, {
      building: "Empreendimento Exemplo",
      phone: "+55 11 0000-0000",
      whatsapp: "5511999999999",
      email: "contato@example.com",
      createdAt: now,
      updatedAt: now,
    });
    console.log("   ✅ Coleção 'developmentContacts_GD' criada");

    // 6. Settings
    console.log("6️⃣  Criando coleção 'settings_GD'...");
    const settingsRef = doc(collection(db, "settings_GD"), "general");
    await setDoc(settingsRef, {
      driveLink: "https://drive.google.com/drive/folders/example",
      updatedAt: now,
    });
    console.log("   ✅ Coleção 'settings_GD' criada");

    console.log("\n✨ Todas as coleções foram criadas com sucesso!");
    console.log("\n💡 Dica: Você pode deletar os documentos 'example' no Firebase Console.");
    console.log("   O importante é que as coleções agora existem.\n");

  } catch (error: any) {
    console.error("❌ Erro ao criar coleções:", error.message);
    if (error.code === "auth/invalid-credential") {
      console.error("   Verifique se o email e senha estão corretos.");
    }
    process.exit(1);
  }
}

initCollections();
