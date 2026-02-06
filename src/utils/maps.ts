/**
 * Utilitários para trabalhar com links do Google Maps e coordenadas
 */

export interface MapCoordinates {
  lat: number;
  lng: number;
}

/**
 * Extrai coordenadas de diferentes formatos de URL do Google Maps
 * Suporta:
 * - Links encurtados (maps.app.goo.gl)
 * - Formato padrão (@lat,lng)
 * - Formato query (?q=lat,lng)
 * - Formato place (/place/nome/@lat,lng)
 */
export function extractCoordinatesFromMapsUrl(url: string): MapCoordinates | null {
  if (!url) return null;

  try {
    // Remove espaços e normaliza a URL
    const cleanUrl = url.trim();

    // Padrão 1: Formato @lat,lng,zoom (mais comum)
    // Exemplo: https://maps.google.com/maps?q=Av.+Exemplo,+123&ll=-23.550520,-46.633308&z=17
    // Exemplo: https://www.google.com/maps/place/Nome+Local/@-23.550520,-46.633308,17z
    const atPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const atMatch = cleanUrl.match(atPattern);
    if (atMatch) {
      return {
        lat: parseFloat(atMatch[1]),
        lng: parseFloat(atMatch[2])
      };
    }

    // Padrão 2: Formato ?q=lat,lng
    // Exemplo: https://maps.google.com/?q=-23.550520,-46.633308
    const qPattern = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const qMatch = cleanUrl.match(qPattern);
    if (qMatch) {
      return {
        lat: parseFloat(qMatch[1]),
        lng: parseFloat(qMatch[2])
      };
    }

    // Padrão 3: Formato ll=lat,lng (usado em alguns links)
    // Exemplo: https://maps.google.com/maps?ll=-23.550520,-46.633308
    const llPattern = /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const llMatch = cleanUrl.match(llPattern);
    if (llMatch) {
      return {
        lat: parseFloat(llMatch[1]),
        lng: parseFloat(llMatch[2])
      };
    }

    // Padrão 4: Formato /maps/@lat,lng (usado em URLs diretas)
    // Exemplo: https://www.google.com/maps/@-23.550520,-46.633308,17z
    const slashPattern = /\/maps\/@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const slashMatch = cleanUrl.match(slashPattern);
    if (slashMatch) {
      return {
        lat: parseFloat(slashMatch[1]),
        lng: parseFloat(slashMatch[2])
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao extrair coordenadas da URL:', error);
    return null;
  }
}

/**
 * Gera URL de embed do Google Maps com sistema de prioridades:
 * 1. Prioridade 1: Usar o endereço completo (mais confiável)
 * 2. Prioridade 2: Extrair coordenadas do link do Google Maps
 * 3. Prioridade 3: Usar coordenadas lat/lng armazenadas
 */
export function generateMapEmbedUrl(
  address: string,
  mapsLink?: string,
  lat?: number,
  lng?: number
): string {
  // Prioridade 1: Usar endereço completo
  if (address && address.trim()) {
    const encodedAddress = encodeURIComponent(address.trim());
    return `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;
  }

  // Prioridade 2: Extrair coordenadas do link do Google Maps
  if (mapsLink) {
    const coords = extractCoordinatesFromMapsUrl(mapsLink);
    if (coords) {
      return `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&output=embed`;
    }
  }

  // Prioridade 3: Usar coordenadas armazenadas
  if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
    return `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
  }

  // Fallback: usar coordenadas padrão (centro de São Paulo)
  // Isso garante que o mapa sempre será exibido, mesmo sem dados completos
  console.warn('Nenhuma localização válida encontrada, usando coordenadas padrão');
  return 'https://maps.google.com/maps?q=-23.550520,-46.633308&output=embed';
}

/**
 * Valida se uma URL é um link válido
 */
export function isValidUrl(url: string): boolean {
  if (!url || !url.trim()) return false;

  try {
    new URL(url.trim());
    return true;
  } catch {
    return false;
  }
}
