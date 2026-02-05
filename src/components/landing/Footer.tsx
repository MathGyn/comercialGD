import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-10 px-5 mt-4">
      <div className="max-w-7xl mx-auto">
        {/* Logos das empresas parceiras */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-8 pb-8 border-b border-border/30"
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
              className="h-12 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all"
            />
          </a>
          <a
            href="https://etica.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <img
              src="/Etica.svg"
              alt="Ética"
              className="h-6 md:h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all"
            />
          </a>
          <a
            href="https://temazec.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <img
              src="/Temazec.svg"
              alt="Temazec"
              className="h-6 md:h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all"
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
