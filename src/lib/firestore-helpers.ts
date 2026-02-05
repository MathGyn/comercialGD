// Funções auxiliares para trabalhar com Firestore
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

// Helper para converter Timestamp do Firestore para Date
export const timestampToDate = (timestamp: Timestamp | null | undefined): Date | null => {
  if (!timestamp) return null;
  return timestamp.toDate();
};

// Helper para converter Date para Timestamp do Firestore
export const dateToTimestamp = (date: Date | null | undefined): Timestamp | null => {
  if (!date) return null;
  return Timestamp.fromDate(date);
};

// Helper para converter documento do Firestore para objeto com datas
export const convertFirestoreDoc = <T extends DocumentData>(
  docData: DocumentData
): T & { createdAt?: Date; updatedAt?: Date } => {
  const data = { ...docData };
  
  if (data.createdAt instanceof Timestamp) {
    data.createdAt = data.createdAt.toDate();
  }
  if (data.updatedAt instanceof Timestamp) {
    data.updatedAt = data.updatedAt.toDate();
  }
  
  return data as T & { createdAt?: Date; updatedAt?: Date };
};

// Função genérica para buscar um documento
export async function getDocument<T extends DocumentData>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  
  return null;
}

// Função genérica para buscar todos os documentos de uma coleção
export async function getCollection<T extends DocumentData>(
  collectionName: string,
  constraints: any[] = []
): Promise<T[]> {
  const q = query(collection(db, collectionName), ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as T)
  );
}

// Função genérica para adicionar um documento
export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: Omit<T, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  
  return docRef.id;
}

// Função genérica para atualizar um documento
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: Partial<Omit<T, "id" | "createdAt">>
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// Função genérica para deletar um documento
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  const docRef = doc(db, collectionName, documentId);
  await deleteDoc(docRef);
};

// Funções específicas para as coleções do projeto
export const bannersCollection = {
  getAll: () => getCollection("banners_GD", [orderBy("order", "asc")]),
  getById: (id: string) => getDocument("banners_GD", id),
  add: (data: Omit<any, "id" | "createdAt" | "updatedAt">) => addDocument("banners_GD", data),
  update: (id: string, data: Partial<any>) => updateDocument("banners_GD", id, data),
  delete: (id: string) => deleteDocument("banners_GD", id),
};

export const quickLinksCollection = {
  getAll: () => getCollection("quickLinks_GD", [orderBy("createdAt", "desc")]),
  getById: (id: string) => getDocument("quickLinks_GD", id),
  add: (data: Omit<any, "id" | "createdAt" | "updatedAt">) => addDocument("quickLinks_GD", data),
  update: (id: string, data: Partial<any>) => updateDocument("quickLinks_GD", id, data),
  delete: (id: string) => deleteDocument("quickLinks_GD", id),
};

export const locationsCollection = {
  getAll: () => getCollection("locations_GD", [orderBy("name", "asc")]),
  getById: (id: string) => getDocument("locations_GD", id),
  add: (data: Omit<any, "id" | "createdAt" | "updatedAt">) => addDocument("locations_GD", data),
  update: (id: string, data: Partial<any>) => updateDocument("locations_GD", id, data),
  delete: (id: string) => deleteDocument("locations_GD", id),
};

export const teamMembersCollection = {
  getAll: () => getCollection("teamMembers_GD", [orderBy("name", "asc")]),
  getById: (id: string) => getDocument("teamMembers_GD", id),
  add: (data: Omit<any, "id" | "createdAt" | "updatedAt">) => addDocument("teamMembers_GD", data),
  update: (id: string, data: Partial<any>) => updateDocument("teamMembers_GD", id, data),
  delete: (id: string) => deleteDocument("teamMembers_GD", id),
};

export const developmentContactsCollection = {
  getAll: () => getCollection("developmentContacts_GD", [orderBy("building", "asc")]),
  getById: (id: string) => getDocument("developmentContacts_GD", id),
  add: (data: Omit<any, "id" | "createdAt" | "updatedAt">) => addDocument("developmentContacts_GD", data),
  update: (id: string, data: Partial<any>) => updateDocument("developmentContacts_GD", id, data),
  delete: (id: string) => deleteDocument("developmentContacts_GD", id),
};

export const settingsCollection = {
  get: () => getDocument("settings_GD", "general"),
  update: (data: Partial<any>) => updateDocument("settings_GD", "general", data),
};

export const customerServiceCollection = {
  getAll: () => getCollection("customerService_GD", [orderBy("order", "asc")]),
  getById: (id: string) => getDocument("customerService_GD", id),
  add: (data: Omit<any, "id" | "createdAt" | "updatedAt">) => addDocument("customerService_GD", data),
  update: (id: string, data: Partial<any>) => updateDocument("customerService_GD", id, data),
  delete: (id: string) => deleteDocument("customerService_GD", id),
};
