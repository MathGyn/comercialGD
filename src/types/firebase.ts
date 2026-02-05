// Tipos TypeScript para dados do Firebase

import { User } from "firebase/auth";
import { DocumentData, Timestamp } from "firebase/firestore";

// Tipos para coleções do Firestore
export interface BannerData {
  id: string;
  imageDesktop: string;
  imageMobile: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface QuickLink {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon: string;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  wazeLink: string;
  mapsLink: string;
  lat: number;
  lng: number;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  whatsapp: string;
  instagram?: string;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface DevelopmentContact {
  id: string;
  building: string;
  phone: string;
  whatsapp: string;
  email: string;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  status: 'launch' | 'construction' | 'ready' | 'sold';
  statusLabel: string;
  image: string;
  driveLink?: string;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface GeneralSettings {
  driveLink: string;
  updatedAt?: Timestamp;
}

// Tipo para usuário autenticado
export interface AuthUser extends User {
  // Adicione campos customizados do usuário aqui se necessário
}

// Helper type para converter Firestore Timestamp para Date
export type WithDates<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: Date;
  updatedAt?: Date;
};
