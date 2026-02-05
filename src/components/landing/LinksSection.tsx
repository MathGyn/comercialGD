import { motion } from 'framer-motion';
import { ExternalLink, Instagram, Facebook, Youtube, Globe, FileText, FolderOpen } from 'lucide-react';
import { useQuickLinks } from '@/hooks/useFirestore';
import { settingsCollection } from '@/lib/firestore-helpers';
import { useEffect, useState } from 'react';

const iconMap: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  website: <Globe className="w-5 h-5" />,
  document: <FileText className="w-5 h-5" />,
  default: <ExternalLink className="w-5 h-5" />,
};

const LinksSection = () => {
  const { data: quickLinks, loading } = useQuickLinks({ realtime: true });
  const [driveLink, setDriveLink] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsCollection.get();
        if (settings && settings.driveLink) {
          setDriveLink(settings.driveLink);
        }
      } catch (error) {
        console.error('Erro ao carregar settings:', error);
      }
    };
    loadSettings();
  }, []);

  if (loading) return null;
  if ((!quickLinks || quickLinks.length === 0) && !driveLink) return null;

  const allLinks = quickLinks || [];
  const [featuredLink, ...otherLinks] = allLinks;

  return (
    <section id="links" className="py-10">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
        {/* Header */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
        >
          Acesso rápido
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[1.625rem] font-semibold mt-2 mb-6 leading-tight"
        >
          Links Úteis
        </motion.h2>

        {/* Layout: Mobile tem featured separado, Desktop em grid único */}

        {/* Featured Link apenas no mobile - Primeira linha */}
        {(featuredLink || driveLink) && (
          <motion.a
            href={featuredLink?.url || driveLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              scale: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="flex md:hidden flex-col items-center justify-center p-6 bg-white dark:bg-white/5 rounded-[20px] border border-gray-200 dark:border-gray-700 hover:border-primary/40 dark:hover:border-primary/40 transition-all shadow-md hover:shadow-lg group w-full h-[140px] mb-3"
          >
            <div className="text-center w-full">
              <p className="text-[22px] font-bold leading-tight text-gray-900 dark:text-gray-50 mb-1.5">
                {featuredLink?.title || 'Drive Geral'}
              </p>
              {(featuredLink?.description || driveLink) && (
                <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-tight line-clamp-2">
                  {featuredLink?.description || 'Acesse todos os materiais'}
                </p>
              )}
            </div>
          </motion.a>
        )}

        {/* Grid unificado - Desktop: todos juntos / Mobile: só os outros */}
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {/* Featured Link - apenas desktop */}
          {(featuredLink || driveLink) && (
            <motion.a
              href={featuredLink?.url || driveLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="hidden md:flex flex-col items-center justify-center p-5 bg-white dark:bg-white/5 rounded-[20px] border border-gray-200 dark:border-gray-700 hover:border-primary/40 dark:hover:border-primary/40 transition-all shadow-md hover:shadow-lg group aspect-square"
            >
              <div className="text-center w-full">
                <p className="text-[22px] font-bold leading-tight text-gray-900 dark:text-gray-50 mb-1.5">
                  {featuredLink?.title || 'Drive Geral'}
                </p>
                {(featuredLink?.description || driveLink) && (
                  <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-tight line-clamp-2">
                    {featuredLink?.description || 'Acesse todos os materiais'}
                  </p>
                )}
              </div>
            </motion.a>
          )}

          {/* Outros Links */}
          {otherLinks.map((link, index) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: (index + 1) * 0.06, duration: 0.35 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center justify-center gap-2 p-3 bg-[#6d6b6b] dark:bg-[#6d6b6b] rounded-[20px] border border-gray-600/50 dark:border-gray-600/50 hover:border-gray-500 dark:hover:border-gray-500 hover:bg-[#7d7b7b] dark:hover:bg-[#7d7b7b] transition-all group aspect-square w-full"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-[14px] bg-white/20 dark:bg-white/20 flex items-center justify-center text-white group-hover:text-primary dark:group-hover:text-primary transition-colors shadow-sm flex-shrink-0">
                {iconMap[link.icon] || iconMap.default}
              </div>

              <div className="text-center w-full flex-shrink-0">
                <p className="text-[11px] md:text-[13px] font-semibold leading-tight text-white mb-0.5">
                  {link.title}
                </p>
                {link.description && (
                  <p className="text-[9px] md:text-[11px] text-white/80 leading-tight line-clamp-2">
                    {link.description}
                  </p>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LinksSection;