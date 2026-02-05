import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useCustomerService } from '@/hooks/useFirestore';

const CustomerServiceSection = () => {
  const { data: services, loading } = useCustomerService({ realtime: true });

  if (loading) return null;
  if (!services || services.length === 0) return null;

  // Função para limpar o telefone e criar link do WhatsApp
  const getWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return `https://wa.me/55${cleaned}`;
  };

  return (
    <section id="customer-service" className="py-10">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
        {/* Header */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
        >
          Suporte
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[1.625rem] font-semibold mt-2 mb-6 leading-tight"
        >
          Atendimento ao Cliente
        </motion.h2>

        {/* Grid de atendimento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service: any, index: number) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: index * 0.1, duration: 0.35 }}
              className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/30 hover:bg-secondary/30 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-1 text-foreground">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {service.responsible}
              </p>

              <div className="space-y-3">
                {service.phone && (
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {/* Botão de Ligar */}
                      <a
                        href={`tel:${service.phone}`}
                        className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors group"
                        title="Ligar"
                      >
                        <Phone className="w-5 h-5 text-primary" />
                      </a>

                      {/* Botão de WhatsApp */}
                      <a
                        href={getWhatsAppLink(service.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center hover:bg-green-500/20 transition-colors group"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
                      </a>
                    </div>
                    <span className="text-[15px] text-muted-foreground">{service.phone}</span>
                  </div>
                )}

                {service.email && (
                  <a
                    href={`mailto:${service.email}`}
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[15px]">{service.email}</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerServiceSection;
