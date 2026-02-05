import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '@/hooks/useFirestore';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const isMobile = useIsMobile();
  const { data: banners, loading, error } = useBanners({ realtime: true });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Timeout de segurança para não ficar em loading infinito
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
        console.warn('Timeout ao carregar banners');
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [loading]);

  // Use banners from Firestore or empty array
  const bannersData = banners || [];
  const currentBanner = bannersData[currentIndex];

  const goToNext = () => {
    if (bannersData.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % bannersData.length);
  };

  const goToPrev = () => {
    if (bannersData.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + bannersData.length) % bannersData.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    if (bannersData.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [bannersData.length]);

  // Reset index when banners change
  useEffect(() => {
    if (bannersData.length > 0 && currentIndex >= bannersData.length) {
      setCurrentIndex(0);
    }
  }, [bannersData.length, currentIndex]);

  // Show loading only if still loading (with timeout protection)
  if (loading && bannersData.length === 0 && !loadingTimeout && !error) {
    return (
      <section ref={ref} className="relative h-[100svh] w-full overflow-hidden bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </section>
    );
  }

  // If no banners (after loading or error), show empty state
  if (bannersData.length === 0) {
    return (
      <section ref={ref} className="relative h-[100svh] w-full overflow-hidden bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground px-4">
          <p className="text-lg mb-2">Nenhum banner cadastrado</p>
          <p className="text-sm">Acesse o painel admin para adicionar banners</p>
          {error && (
            <p className="text-xs text-destructive mt-2">Erro: {error.message}</p>
          )}
        </div>
      </section>
    );
  }

  // Ensure we have a valid current banner
  if (!currentBanner) {
    // Reset to first banner if current index is invalid
    if (bannersData.length > 0) {
      setCurrentIndex(0);
      return null; // Will re-render
    }
    return null;
  }

  const currentImage = isMobile ? currentBanner.imageMobile : currentBanner.imageDesktop;

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      {/* Parallax Background - Full image only */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[110%]"
      >
        <motion.div
          key={currentBanner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentImage})` }}
        />
        {/* Subtle gradient at bottom for transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </motion.div>

      {/* Banner Button */}
      {currentBanner.buttonText && currentBanner.buttonLink && (
        <motion.div
          key={`btn-${currentBanner.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute bottom-32 inset-x-0 z-20 flex justify-center"
        >
          <a
            href={currentBanner.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-white/90 hover:scale-105 transition-all duration-200"
          >
            {currentBanner.buttonText}
          </a>
        </motion.div>
      )}

      {/* Carousel Navigation */}
      {bannersData.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {bannersData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll Indicator - minimal and subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
