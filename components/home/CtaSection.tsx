'use client';

import { motion } from 'framer-motion';

const CtaSection = () => {
  return (
    <section className="p-0 m-0 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-950/20 -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Add any remaining content here if needed */}
      </motion.div>
    </section>
  );
};

export default CtaSection;
