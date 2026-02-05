# Guia de Uso do Firebase

Este documento descreve como usar o Firebase na aplicação Comercial Eltoncley.

## 📋 Configuração

### Variáveis de Ambiente

As credenciais do Firebase estão configuradas em variáveis de ambiente. Certifique-se de que o arquivo `.env` existe e contém todas as variáveis necessárias:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

## 🔐 Autenticação

### Hook useAuth

O hook `useAuth` fornece funcionalidades completas de autenticação:

```tsx
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const { user, loading, signIn, signOut } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn('email@example.com', 'password');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <p>Olá, {user.email}</p>
          <button onClick={signOut}>Sair</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Entrar</button>
      )}
    </div>
  );
}
```

### Métodos Disponíveis

- `signIn(email, password)` - Fazer login
- `signUp(email, password, displayName?)` - Criar conta
- `signOut()` - Fazer logout
- `resetPassword(email)` - Enviar email de recuperação
- `sendVerification()` - Enviar email de verificação
- `updateUserProfile(displayName, photoURL?)` - Atualizar perfil

## 📊 Firestore

### Hook useCollection

Para buscar e gerenciar coleções:

```tsx
import { useBanners } from '@/hooks/useFirestore';
import { orderBy } from 'firebase/firestore';

function BannersList() {
  const { data: banners, loading, add, update, remove } = useBanners({ realtime: true });

  const handleAdd = async () => {
    await add({
      imageDesktop: 'https://...',
      imageMobile: 'https://...',
      buttonText: 'Saiba Mais',
      buttonLink: 'https://...',
      order: 1,
    });
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {banners.map(banner => (
        <div key={banner.id}>
          <h3>{banner.buttonText}</h3>
          <button onClick={() => remove(banner.id)}>Remover</button>
        </div>
      ))}
    </div>
  );
}
```

### Hooks Específicos Disponíveis

- `useBanners()` - Banners do home
- `useQuickLinks()` - Links úteis
- `useLocations()` - Localizações
- `useTeamMembers()` - Membros da equipe
- `useDevelopmentContacts()` - Contatos de empreendimentos

### Funções Auxiliares

Para operações mais complexas, use as funções auxiliares:

```tsx
import { bannersCollection } from '@/lib/firestore-helpers';

// Buscar todos os banners
const banners = await bannersCollection.getAll();

// Buscar por ID
const banner = await bannersCollection.getById('banner-id');

// Adicionar novo banner
const id = await bannersCollection.add({
  imageDesktop: 'https://...',
  imageMobile: 'https://...',
  buttonText: 'Saiba Mais',
  buttonLink: 'https://...',
  order: 1,
});

// Atualizar banner
await bannersCollection.update(id, {
  buttonText: 'Novo Texto',
});

// Deletar banner
await bannersCollection.delete(id);
```

### Coleções Disponíveis

- `bannersCollection` - Banners
- `quickLinksCollection` - Links úteis
- `locationsCollection` - Localizações
- `teamMembersCollection` - Membros da equipe
- `developmentContactsCollection` - Contatos
- `settingsCollection` - Configurações gerais

## 🗄️ Storage

Para upload de arquivos:

```tsx
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadImage = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

// Uso
const imageUrl = await uploadImage(file, 'banners/banner-1.jpg');
```

## 📝 Tipos TypeScript

Todos os tipos estão disponíveis em `@/types/firebase`:

```tsx
import type { BannerData, QuickLink, Location, TeamMember } from '@/types/firebase';

const banner: BannerData = {
  id: '1',
  imageDesktop: 'https://...',
  imageMobile: 'https://...',
  buttonText: 'Saiba Mais',
  buttonLink: 'https://...',
  order: 1,
};
```

## 🔄 Modo Realtime

Para atualizações em tempo real, use a opção `realtime: true`:

```tsx
const { data } = useBanners({ realtime: true });
// Os dados serão atualizados automaticamente quando houver mudanças no Firestore
```

## ⚠️ Próximos Passos no Firebase Console

1. **Configurar Regras de Segurança do Firestore:**
   - Acesse Firebase Console > Firestore Database > Rules
   - Configure regras apropriadas para cada coleção

2. **Configurar Regras de Storage:**
   - Acesse Firebase Console > Storage > Rules
   - Configure permissões de upload/download

3. **Configurar Authentication:**
   - Acesse Firebase Console > Authentication > Sign-in method
   - Habilite os métodos de autenticação desejados (Email/Password, Google, etc.)

4. **Criar as Coleções no Firestore:**
   - `banners`
   - `quickLinks`
   - `locations`
   - `teamMembers`
   - `developmentContacts`
   - `settings` (documento único com ID "general")

## 🚀 Exemplo Completo

```tsx
import { useAuth } from '@/hooks/useAuth';
import { useBanners } from '@/hooks/useFirestore';
import { Button } from '@/components/ui/button';

function AdminPanel() {
  const { user, signOut } = useAuth();
  const { data: banners, add, update, remove } = useBanners({ realtime: true });

  if (!user) {
    return <div>Você precisa estar autenticado</div>;
  }

  return (
    <div>
      <h1>Painel Admin</h1>
      <Button onClick={signOut}>Sair</Button>
      
      <div>
        <h2>Banners</h2>
        {banners.map(banner => (
          <div key={banner.id}>
            <p>{banner.buttonText}</p>
            <Button onClick={() => remove(banner.id)}>Remover</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 📚 Recursos Adicionais

- [Documentação Firebase](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
