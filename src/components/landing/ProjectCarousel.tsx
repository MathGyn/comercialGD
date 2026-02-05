import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { useProjects } from '@/hooks/useFirestore';
import type { Project } from '@/types/firebase';

const StatusBadge = ({ status, label }: { status: Project['status']; label: string }) => {
  const statusClasses: Record<Project['status'], string> = {
    launch: 'badge-launch',
    construction: 'badge-construction',
    ready: 'badge-ready',
    sold: 'badge-sold',
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide ${statusClasses[status]}`}>
      {label}
    </span>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex-shrink-0 w-[88vw] max-w-[360px] md:w-[320px] lg:w-[380px] snap-center"
      data-project-card
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="relative h-[480px] rounded-3xl overflow-hidden"
      >
        {/* Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.image})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-5 left-5">
          <StatusBadge status={project.status} label={project.statusLabel} />
        </div>

        {/* Content - in thumb zone */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
          <h3 className="text-2xl font-semibold mb-2 leading-tight">{project.name}</h3>
          <p className="text-muted-foreground text-sm mb-4">{project.location}</p>
          
          {project.driveLink && (
            <a
              href={project.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Acessar Drive
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectCarousel = () => {
  const { data: projects, loading } = useProjects({ realtime: true });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Drag handlers para desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    // Não iniciar drag se clicar em links ou botões
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    
    const container = scrollRef.current;
    if (!container) return;
    
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    const container = scrollRef.current;
    if (!container) return;
    
    setIsDragging(false);
    container.style.cursor = 'grab';
    container.style.userSelect = '';
  };

  const handleMouseUp = () => {
    const container = scrollRef.current;
    if (!container) return;
    
    setIsDragging(false);
    container.style.cursor = 'grab';
    container.style.userSelect = '';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = scrollRef.current;
    if (!container) return;
    
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Velocidade do scroll
    container.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !projects || projects.length === 0) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      
      // Obter a largura real do primeiro card
      const firstCard = container.querySelector('[data-project-card]') as HTMLElement;
      if (!firstCard) return;
      
      const cardWidth = firstCard.offsetWidth;
      const gap = 16; // gap-4 = 16px
      const totalCardWidth = cardWidth + gap;
      
      // Calcular o índice baseado na posição de scroll (apenas para os dots)
      const index = Math.round(scrollLeft / totalCardWidth);
      const clampedIndex = Math.max(0, Math.min(index, projects.length - 1));
      
      setActiveIndex(clampedIndex);
    };

    // Inicializar
    handleScroll();
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [projects]);

  if (loading) return null;
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-5 md:px-10 lg:px-16 mb-6">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
          >
            Portfólio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[1.625rem] font-semibold mt-2 leading-tight"
          >
            Empreendimentos
          </motion.h2>
        </div>

        {/* Carousel - full bleed with horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 px-5 md:px-10 lg:px-16 overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
            />
          ))}
          {/* End spacer */}
          <div className="flex-shrink-0 w-3 md:w-10" />
        </div>

        {/* Pagination Dots - larger touch targets */}
        <div className="flex justify-center gap-2 mt-8 px-5">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const container = scrollRef.current;
                if (container) {
                  const firstCard = container.querySelector('[data-project-card]') as HTMLElement;
                  if (firstCard) {
                    const cardWidth = firstCard.offsetWidth;
                    const gap = 16; // gap-4 = 16px
                    const totalCardWidth = cardWidth + gap;
                    container.scrollTo({ left: totalCardWidth * index, behavior: 'smooth' });
                  }
                }
              }}
              className="p-2 -m-2" // larger touch target
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'w-6 bg-foreground' 
                    : 'w-1.5 bg-muted-foreground/40'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectCarousel;
