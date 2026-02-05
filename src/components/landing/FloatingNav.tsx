import { motion, AnimatePresence } from 'framer-motion';

interface FloatingNavProps {
  isVisible: boolean;
  onNavigate: (section: string) => void;
}

const FloatingNav = ({ isVisible, onNavigate }: FloatingNavProps) => {
  const navItems = [
    { section: 'projects', label: 'Empreendimentos' },
    { section: 'links', label: 'Links' },
    { section: 'team', label: 'Equipe' },
    { section: 'locations', label: 'Localização' },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          {/* Gradient fade background */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background via-background/70 to-transparent pointer-events-none" />
          
          {/* Nav content - just text links */}
          <div className="relative flex items-center justify-center gap-6 px-5 pt-4 pb-2">
            {navItems.map((item) => (
              <motion.button
                key={item.section}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(item.section)}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default FloatingNav;