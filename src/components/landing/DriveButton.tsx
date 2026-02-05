import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';
import { useFirestore } from '@/hooks/useFirestore';
import { settingsCollection } from '@/lib/firestore-helpers';
import { useEffect, useState } from 'react';

const DriveButton = () => {
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

  if (!driveLink) return null;

  return (
    <section className="py-6 px-4">
      <div className="max-w-7xl mx-auto flex justify-center">
        <motion.a
          href={driveLink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-6 py-4 bg-card border border-border/50 rounded-2xl hover:border-foreground/30 transition-colors shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-foreground" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground">Drive Geral</p>
            <p className="text-sm text-muted-foreground">Acesse todos os materiais</p>
          </div>
        </motion.a>
      </div>
    </section>
  );
};

export default DriveButton;
