import { motion } from 'framer-motion';
import { MessageCircle, Instagram } from 'lucide-react';
import { useTeamMembers } from '@/hooks/useFirestore';
import type { TeamMember } from '@/types/firebase';

const TeamSection = () => {
  const { data: teamMembers, loading } = useTeamMembers({ realtime: true });

  const formatInstagramUrl = (instagram: string | undefined): string | null => {
    if (!instagram) return null;
    // Remove @ se existir e espaços
    const clean = instagram.replace('@', '').trim();
    if (!clean) return null;
    return `https://instagram.com/${clean}`;
  };

  if (loading) return null;
  if (!teamMembers || teamMembers.length === 0) return null;

  return (
    <section id="team" className="py-10">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
      >
        Especialistas
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-[1.625rem] font-semibold mt-2 mb-6 leading-tight"
      >
        Nossa Equipe
      </motion.h2>

      {/* Cards - 2 columns on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {teamMembers.map((member, index) => {
          const instagramUrl = formatInstagramUrl(member.instagram);
          
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative overflow-hidden rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm"
            >
              {/* Photo - vertical on mobile, square on desktop */}
              <div className="relative aspect-[3/4] md:aspect-square w-full bg-muted">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    console.error(`Erro ao carregar imagem de ${member.name}:`, member.avatar);
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80';
                  }}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                
                {/* Action buttons - visible on hover */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 backdrop-blur-sm">
                  {instagramUrl && (
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white shadow-lg"
                      aria-label={`Instagram de ${member.name}`}
                    >
                      <Instagram className="w-5 h-5" />
                    </motion.a>
                  )}
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg"
                    aria-label={`WhatsApp de ${member.name}`}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <p className="text-[15px] md:text-[15px] font-semibold leading-tight text-foreground">
                  {member.name}
                </p>
                <p className="text-[12px] md:text-[12px] text-muted-foreground mt-0.5">
                  {member.role}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      </div>
    </section>
  );
};

export default TeamSection;
