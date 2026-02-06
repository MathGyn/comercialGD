import { motion } from 'framer-motion';
import { Navigation, MapPin } from 'lucide-react';
import { useLocations } from '@/hooks/useFirestore';
import type { Location } from '@/types/firebase';
import { generateMapEmbedUrl, isValidUrl } from '@/utils/maps';

const LocationCard = ({ location, index }: { location: Location; index: number }) => {
  // Gera URL de embed com sistema de prioridades inteligente
  const mapEmbedUrl = generateMapEmbedUrl(
    location.address,
    location.mapsLink,
    location.lat,
    location.lng
  );

  // Valida se os links estão preenchidos
  const hasWazeLink = isValidUrl(location.wazeLink);
  const hasMapsLink = isValidUrl(location.mapsLink);
  const hasAnyLink = hasWazeLink || hasMapsLink;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/30"
    >
      {/* Map Embed */}
      <div className="relative w-full h-[180px] md:h-[200px]">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa - ${location.name}`}
          className="grayscale hover:grayscale-0 transition-all duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Location header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-foreground" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-[15px] leading-tight">{location.name}</h3>
            <p className="text-[13px] text-muted-foreground mt-1 leading-snug">{location.address}</p>
          </div>
        </div>

        {/* CTA Buttons - Exibição condicional */}
        {hasAnyLink && (
          <div className="flex gap-2">
            {hasWazeLink && (
              <motion.a
                whileTap={{ scale: 0.97 }}
                href={location.wazeLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`${hasMapsLink ? 'flex-1' : 'w-full'} h-12 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 rounded-xl text-[13px] font-medium transition-colors`}
              >
                <Navigation className="w-4 h-4" />
                Waze
              </motion.a>
            )}
            {hasMapsLink && (
              <motion.a
                whileTap={{ scale: 0.97 }}
                href={location.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`${hasWazeLink ? 'flex-1' : 'w-full'} h-12 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 rounded-xl text-[13px] font-medium transition-colors`}
              >
                <MapPin className="w-4 h-4" />
                Maps
              </motion.a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MapSection = () => {
  const { data: locations, loading } = useLocations({ realtime: true });

  if (loading) return null;
  if (!locations || locations.length === 0) return null;

  return (
    <section id="locations" className="py-10">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
        {/* Header */}
        <div className="mb-6">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
        >
          Localização
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[1.625rem] font-semibold mt-2 leading-tight"
        >
          Visite-nos
        </motion.h2>
      </div>

      {/* Location Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location, index) => (
          <LocationCard 
            key={location.id} 
            location={location} 
            index={index}
          />
        ))}
      </div>
      </div>
    </section>
  );
};

export default MapSection;
