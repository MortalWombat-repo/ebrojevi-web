// components/home/CtaSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-transparent to-blue-950/20">
      {/* Content wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center space-y-6 max-w-xl mx-auto p-6 bg-card/60 backdrop-blur-md rounded-2xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Pridružite nam se danas!
        </h2>
        <p className="text-lg text-muted-foreground">
          Skenirajte deklaracije, analizirajte E-brojeve i saznajte sve što
          želite o svojim proizvodima – potpuno besplatno.
        </p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Počnite odmah
        </Button>
      </motion.div>
    </section>
  );
};

export default CtaSection;
