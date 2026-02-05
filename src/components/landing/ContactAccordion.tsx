import { motion } from 'framer-motion';
import { MessageCircle, Phone, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useDevelopmentContacts } from '@/hooks/useFirestore';
import type { DevelopmentContact } from '@/types/firebase';

interface ContactItemProps {
  contact: DevelopmentContact;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const ContactItem = ({ contact, isOpen, onToggle, index }: ContactItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden"
    >
      {/* Header - large touch target */}
      <motion.button
        whileTap={{ backgroundColor: 'hsl(var(--secondary))' }}
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 min-h-[64px] transition-colors"
      >
        <span className="font-medium text-[15px] text-left">{contact.building}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </motion.button>
      
      {/* Content */}
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 pt-1 flex flex-col gap-2.5">
          {/* WhatsApp - primary action */}
          <motion.a
            whileTap={{ scale: 0.98 }}
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 flex items-center justify-center gap-2.5 bg-status-launch hover:bg-status-launch/90 text-primary-foreground rounded-xl text-[13px] font-medium transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </motion.a>
          
          {/* Phone - secondary action */}
          <motion.a
            whileTap={{ scale: 0.98 }}
            href={`tel:${contact.phone.replace(/\D/g, '')}`}
            className="h-12 flex items-center justify-center gap-2.5 bg-secondary hover:bg-secondary/80 rounded-xl text-[13px] font-medium transition-colors"
          >
            <Phone className="w-4 h-4" />
            {contact.phone}
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ContactAccordion = () => {
  const { data: developmentContacts, loading } = useDevelopmentContacts({ realtime: true });
  const [openId, setOpenId] = useState<string | null>(null);

  if (loading) return null;
  if (!developmentContacts || developmentContacts.length === 0) return null;

  return (
    <section id="contacts" className="py-10">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
      >
        Atendimento
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-[1.625rem] font-semibold mt-2 mb-6 leading-tight"
      >
        Contato direto
      </motion.h2>

      {/* Accordion */}
      <div className="flex flex-col gap-2.5">
        {developmentContacts.map((contact, index) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            isOpen={openId === contact.id}
            onToggle={() => setOpenId(openId === contact.id ? null : contact.id)}
            index={index}
          />
        ))}
      </div>
      </div>
    </section>
  );
};

export default ContactAccordion;
