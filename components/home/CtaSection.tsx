'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  return (
    <section className="min-h-[100vh] p-0 m-0 relative flex items-center justify-center snap-start">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-950/20 -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center space-y-6 max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Get Started Today
        </h2>
        <p className="text-lg text-muted-foreground">
          Scan your product labels and discover the healthiness of your food with our easy-to-use app.
        </p>
        <Button
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Try Now
        </Button>
      </motion.div>
    </section>
  );
};

export default CtaSection;
