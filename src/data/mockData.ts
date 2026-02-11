import bannerDesktop from '@/assets/banner-desktop.webp';
import bannerMobile from '@/assets/banner-mobile.webp';
import projectLake from '@/assets/projects/lake.webp';
import projectLinea from '@/assets/projects/linea.webp';
import projectReserva from '@/assets/projects/reserva.webp';
import projectSynergia from '@/assets/projects/synergia.webp';
import projectUrban from '@/assets/projects/urban.webp';
import projectVertice from '@/assets/projects/vertice.webp';
import teamEltoncley from '@/assets/team/eltoncley.png';
import teamDouglas from '@/assets/team/douglas.png';
import teamEmilia from '@/assets/team/emilia.png';
import teamAlessandra from '@/assets/team/alessandra.png';
import teamKariston from '@/assets/team/kariston.png';

export interface Project {
  id: string;
  name: string;
  location: string;
  status: 'launch' | 'construction' | 'sold';
  statusLabel: string;
  image: string;
  driveLink?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  whatsapp: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  wazeLink: string;
  mapsLink: string;
  lat: number;
  lng: number;
}

export interface DevelopmentContact {
  id: string;
  building: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export const projects: Project[] = [
  {
    id: '1',
    name: 'Lake',
    location: 'Goiânia, GO',
    status: 'sold',
    statusLabel: 'Vendido',
    image: projectLake,
    driveLink: 'https://drive.google.com/drive/folders/example1',
  },
  {
    id: '2',
    name: 'Linea',
    location: 'Goiânia, GO',
    status: 'sold',
    statusLabel: 'Vendido',
    image: projectLinea,
    driveLink: 'https://drive.google.com/drive/folders/example2',
  },
  {
    id: '3',
    name: 'Reserva',
    location: 'Goiânia, GO',
    status: 'sold',
    statusLabel: 'Vendido',
    image: projectReserva,
    driveLink: 'https://drive.google.com/drive/folders/example3',
  },
  {
    id: '4',
    name: 'Synergia Bueno',
    location: 'Setor Bueno, Goiânia',
    status: 'launch',
    statusLabel: 'Lançamento',
    image: projectSynergia,
    driveLink: 'https://drive.google.com/drive/folders/example4',
  },
  {
    id: '5',
    name: 'Urban Garden',
    location: 'Goiânia, GO',
    status: 'construction',
    statusLabel: 'Em Obras',
    image: projectUrban,
    driveLink: 'https://drive.google.com/drive/folders/example5',
  },
  {
    id: '6',
    name: 'Vértice',
    location: 'Goiânia, GO',
    status: 'sold',
    statusLabel: 'Vendido',
    image: projectVertice,
    driveLink: 'https://drive.google.com/drive/folders/example6',
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Eltoncley',
    role: 'Diretor Comercial',
    avatar: teamEltoncley,
    whatsapp: '5562999999999',
  },
  {
    id: '2',
    name: 'Douglas',
    role: 'Consultor de Vendas',
    avatar: teamDouglas,
    whatsapp: '5562988888888',
  },
  {
    id: '3',
    name: 'Emília',
    role: 'Consultora de Vendas',
    avatar: teamEmilia,
    whatsapp: '5562977777777',
  },
  {
    id: '4',
    name: 'Alessandra',
    role: 'Consultora de Vendas',
    avatar: teamAlessandra,
    whatsapp: '5562966666666',
  },
  {
    id: '5',
    name: 'Kariston',
    role: 'Consultor de Vendas',
    avatar: teamKariston,
    whatsapp: '5562955555555',
  },
];

export const locations: Location[] = [
  {
    id: '1',
    name: 'Escritório Central',
    address: 'Av. T-63, 1000 - Setor Bueno, Goiânia',
    wazeLink: 'https://waze.com/ul?ll=-16.7056,-49.2647',
    mapsLink: 'https://maps.google.com/?q=-16.7056,-49.2647',
    lat: -16.7056,
    lng: -49.2647,
  },
  {
    id: '2',
    name: 'Stand Synergia',
    address: 'Setor Bueno, Goiânia',
    wazeLink: 'https://waze.com/ul?ll=-16.7100,-49.2600',
    mapsLink: 'https://maps.google.com/?q=-16.7100,-49.2600',
    lat: -16.7100,
    lng: -49.2600,
  },
  {
    id: '3',
    name: 'Stand Urban Garden',
    address: 'Goiânia, GO',
    wazeLink: 'https://waze.com/ul?ll=-16.6800,-49.2550',
    mapsLink: 'https://maps.google.com/?q=-16.6800,-49.2550',
    lat: -16.6800,
    lng: -49.2550,
  },
];

export const developmentContacts: DevelopmentContact[] = [
  {
    id: '1',
    building: 'Edifício Aurora',
    phone: '+55 11 3000-0001',
    whatsapp: '5511999990001',
    email: 'aurora@incorporadora.com',
  },
  {
    id: '2',
    building: 'Residencial Horizonte',
    phone: '+55 11 3000-0002',
    whatsapp: '5511999990002',
    email: 'horizonte@incorporadora.com',
  },
  {
    id: '3',
    building: 'Torre Solaris',
    phone: '+55 11 3000-0003',
    whatsapp: '5511999990003',
    email: 'solaris@incorporadora.com',
  },
];

export interface BannerData {
  id: string;
  imageDesktop: string;
  imageMobile: string;
  buttonText: string;
  buttonLink: string;
  order: number;
}

export const bannersData: BannerData[] = [
  {
    id: '1',
    imageDesktop: bannerDesktop,
    imageMobile: bannerMobile,
    buttonText: 'Saiba mais',
    buttonLink: 'https://example.com/aurora',
    order: 1,
  },
];

export const campaignData = {
  title: 'Arquitetura que transforma vidas',
  subtitle: 'Empreendimentos exclusivos em São Paulo',
  bannerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
};

export const generalSettings = {
  driveLink: 'https://drive.google.com/drive/folders/seu-link-aqui',
};

export interface QuickLink {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon?: string;
  iconUrl?: string;
}

export const quickLinks: QuickLink[] = [
  {
    id: '1',
    title: 'Instagram',
    description: '@incorporadora',
    url: 'https://instagram.com',
    icon: 'instagram',
  },
  {
    id: '2',
    title: 'Site Oficial',
    description: 'Conheça todos os projetos',
    url: 'https://example.com',
    icon: 'website',
  },
  {
    id: '3',
    title: 'Catálogo Digital',
    description: 'Baixe nosso catálogo completo',
    url: 'https://example.com/catalogo',
    icon: 'document',
  },
  {
    id: '4',
    title: 'YouTube',
    description: 'Vídeos dos empreendimentos',
    url: 'https://youtube.com',
    icon: 'youtube',
  },
];
