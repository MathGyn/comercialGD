import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface TactileCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  delay?: number;
}

const TactileCard = ({ icon, title, subtitle, onClick, delay = 0 }: TactileCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay, duration: 0.35 }}
      whileTap={{ scale: 0.975, backgroundColor: 'hsl(var(--secondary))' }}
      onClick={onClick}
      className="w-full flex items-center gap-4 min-h-[72px] px-4 py-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/30 active:bg-secondary transition-colors duration-150"
    >
      {/* Icon Container - larger for better touch */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center text-foreground">
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 text-left min-w-0">
        <h3 className="font-medium text-[15px] text-foreground leading-tight">{title}</h3>
        {subtitle && (
          <p className="text-[13px] text-muted-foreground mt-0.5 truncate">{subtitle}</p>
        )}
      </div>

      {/* Arrow - larger touch feedback */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
        <ChevronRight className="w-5 h-5 text-muted-foreground/60" />
      </div>
    </motion.button>
  );
};

export default TactileCard;
