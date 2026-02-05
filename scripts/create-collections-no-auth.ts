/**
 * Script alternativo: Cria coleções usando apenas o token do Firebase CLI
 * Este script não precisa de senha, usa o token do CLI
 * 
 * IMPORTANTE: Você precisa ter feito login no Firebase CLI primeiro
 * Execute: npm run firebase login
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { config } from 'dotenv';
import { execSync } from 'child_process';

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

async function createCollections() {
  try {
    console.log("📝 Nota: Este script cria coleções, mas você precisa estar autenticado.");
    console.log("   Como você já fez login no Firebase CLI, vamos tentar criar as coleções...\n");

    // Verifica se está logado no CLI
    try {
      execSync('firebase projects:list', { stdio: 'ignore' });
      console.log("✅ Firebase CLI autenticado detectado!\n");
    } catch {
      console.log("⚠️  Não foi possível verificar o login do CLI.");
      console.log("   Mas vamos tentar criar as coleções mesmo assim...\n");
    }

    const now = Timestamp.now();

    console.log("📦 Criando coleções...\n");

    // 1. Banners
    console.log("1️⃣  Criando coleção 'banners_GD'...");
    try {
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
    } catch (error: any) {
      console.log(`   ⚠️  Erro: ${error.message}`);
      if (error.code === 'permission-denied') {
        console.log("   💡 Você precisa estar autenticado. Use o script com senha ou crie pelo Console.");
      }
    }

    // 2. Quick Links
    console.log("2️⃣  Criando coleção 'quickLinks_GD'...");
    try {
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
    } catch (error: any) {
      console.log(`   ⚠️  Erro: ${error.message}`);
    }

    // 3. Locations
    console.log("3️⃣  Criando coleção 'locations_GD'...");
    try {
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
    } catch (error: any) {
      console.log(`   ⚠️  Erro: ${error.message}`);
    }

    // 4. Team Members
    console.log("4️⃣  Criando coleção 'teamMembers_GD'...");
    try {
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
    } catch (error: any) {
      console.log(`   ⚠️  Erro: ${error.message}`);
    }

    // 5. Development Contacts
    console.log("5️⃣  Criando coleção 'developmentContacts_GD'...");
    try {
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
    } catch (error: any) {
      console.log(`   ⚠️  Erro: ${error.message}`);
    }

    // 6. Settings
    console.log("6️⃣  Criando coleção 'settings_GD'...");
    try {
      const settingsRef = doc(collection(db, "settings_GD"), "general");
      await setDoc(settingsRef, {
        driveLink: "https://drive.google.com/drive/folders/example",
        updatedAt: now,
      });
      console.log("   ✅ Coleção 'settings_GD' criada");
    } catch (error: any) {
      console.log(`   ⚠️  Erro: ${error.message}`);
    }

    console.log("\n✨ Processo concluído!");
    console.log("\n💡 Se houve erros de permissão, você precisa:");
    console.log("   1. Criar a conta no Firebase Console (Authentication > Users)");
    console.log("   2. Ou criar as coleções manualmente pelo Console");
    console.log("   3. Ou usar o script com senha: npm run create:collections\n");

    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Erro geral:", error.message);
    process.exit(1);
  }
}

createCollections();
