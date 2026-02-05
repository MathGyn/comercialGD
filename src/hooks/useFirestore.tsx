import { useState, useEffect } from "react";
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
  limit,
  onSnapshot,
  QueryConstraint,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UseFirestoreOptions {
  realtime?: boolean;
}

interface UseFirestoreReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

interface UseCollectionReturn<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  add: (data: Omit<T, "id">) => Promise<string>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

// Hook para buscar um documento único
export const useFirestore = <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  options: UseFirestoreOptions = {}
): UseFirestoreReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        setData(null);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.realtime) {
      const docRef = doc(db, collectionName, documentId);
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setData({ id: docSnap.id, ...docSnap.data() } as T);
          } else {
            setData(null);
          }
          setLoading(false);
        },
        (err) => {
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      fetchData();
    }
  }, [collectionName, documentId, options.realtime]);

  return { data, loading, error, refresh: fetchData };
};

// Função auxiliar para ordenar documentos no cliente
// Garante que itens sem 'order' também apareçam (com order = Infinity)
const sortDocuments = <T extends DocumentData>(docs: T[]): T[] => {
  return [...docs].sort((a, b) => {
    const orderA = a.order !== undefined && a.order !== null ? a.order : Infinity;
    const orderB = b.order !== undefined && b.order !== null ? b.order : Infinity;
    return orderA - orderB;
  });
};

// Hook para buscar uma coleção
export const useCollection = <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  options: UseFirestoreOptions = {}
): UseCollectionReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as T)
      );
      
      // Ordena no cliente para garantir que todos apareçam
      // Itens sem 'order' vão para o final (order = Infinity)
      const sortedDocs = sortDocuments(docs);
      setData(sortedDocs);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.realtime) {
      try {
        const q = query(collection(db, collectionName), ...constraints);
        console.log(`[useFirestore] Iniciando listener para ${collectionName}`);
        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            console.log(`[useFirestore] ${collectionName} atualizado:`, querySnapshot.docs.length, 'documentos');
            const docs = querySnapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as T)
            );
            // Ordena no cliente para garantir que todos apareçam
            // Itens sem 'order' vão para o final (order = Infinity)
            const sortedDocs = sortDocuments(docs);
            setData(sortedDocs);
            setLoading(false);
          },
          (err) => {
            console.error(`[useFirestore] Erro ao buscar ${collectionName}:`, err);
            setError(err as Error);
            setData([]);
            setLoading(false);
          }
        );

        return () => {
          console.log(`[useFirestore] Removendo listener de ${collectionName}`);
          unsubscribe();
        };
      } catch (err) {
        console.error(`[useFirestore] Erro ao criar query para ${collectionName}:`, err);
        setError(err as Error);
        setData([]);
        setLoading(false);
      }
    } else {
      fetchData();
    }
  }, [collectionName, JSON.stringify(constraints), options.realtime]);

  const add = async (newData: Omit<T, "id">) => {
    const docRef = await addDoc(collection(db, collectionName), {
      ...newData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  };

  const update = async (id: string, updateData: Partial<T>) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, collectionName, id));
  };

  return { data, loading, error, add, update, remove, refresh: fetchData };
};

// Funções auxiliares para queries comuns
// Busca todos os documentos e ordena no cliente para garantir que itens sem 'order' também apareçam
export const useBanners = (options?: UseFirestoreOptions) => {
  return useCollection("banners_GD", [], options);
};

export const useQuickLinks = (options?: UseFirestoreOptions) => {
  return useCollection("quickLinks_GD", [], options);
};

export const useLocations = (options?: UseFirestoreOptions) => {
  return useCollection("locations_GD", [], options);
};

export const useTeamMembers = (options?: UseFirestoreOptions) => {
  return useCollection("teamMembers_GD", [], options);
};

export const useDevelopmentContacts = (options?: UseFirestoreOptions) => {
  return useCollection("developmentContacts_GD", [], options);
};

export const useProjects = (options?: UseFirestoreOptions) => {
  return useCollection("projects_GD", [], options);
};

export const useCustomerService = (options?: UseFirestoreOptions) => {
  return useCollection("customerService_GD", [], options);
};
