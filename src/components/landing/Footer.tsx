import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-10 px-5 mt-4">
      <div className="max-w-7xl mx-auto">
        {/* Logo da Gama Dias */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mb-8 pb-8 border-b border-border/30"
        >
          <a
            href="https://gamadias.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <img
              src="/Gama Dias.svg"
              alt="Gama Dias"
              className="h-16 md:h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all"
            />
          </a>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-[13px] text-muted-foreground">
            © 2026 Todos os direitos reservados. Criado por{' '}
            <a
              href="https://www.behance.net/MatheusSouza"
              target="_blank"
              rel="noopener noreferrer"
              className="text-inherit no-underline hover:no-underline focus:no-underline active:no-underline cursor-pointer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Matheus Souza
            </a>
            .
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
