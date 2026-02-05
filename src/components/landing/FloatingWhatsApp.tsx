import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { settingsCollection } from '@/lib/firestore-helpers';

const FloatingWhatsApp = () => {
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsCollection.get();
        if (settings) {
          setWhatsappPhone(settings.whatsappPhone || '');
          setWhatsappMessage(settings.whatsappMessage || 'Olá! Gostaria de mais informações.');
        }
      } catch (error) {
        console.error('Erro ao carregar settings:', error);
      }
    };
    loadSettings();
  }, []);

  if (!whatsappPhone) return null;

  const getWhatsAppLink = () => {
    const cleaned = whatsappPhone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(whatsappMessage);
    return `https://wa.me/55${cleaned}?text=${encodedMessage}`;
  };

  return (
    <motion.a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all group"
      title="Fale conosco no WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />

      {/* Pulse animation ring */}
      <motion.span
        className="absolute inset-0 rounded-full bg-green-500"
        animate={{
          scale: [1, 1.3, 1.3],
          opacity: [0.7, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </motion.a>
  );
};

export default FloatingWhatsApp;
