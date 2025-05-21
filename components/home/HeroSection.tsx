// components/home/HeroSection.tsx
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { ArrowRight } from 'lucide-react';
import { useDropzone, FileRejection } from 'react-dropzone';

const HeroSection = () => {
  // … hooks and dropzone logic remain unchanged …

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center justify-center px-6 md:px-8 overflow-hidden snap-start"
    >
      {/* Background grid & overlay omitted for brevity */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Heading & subtitle Animations omitted… */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center justify-center space-y-4 pt-4"
        >
          <Button
            size="lg"
            variant="outline"
            className="border-primary/20 hover:bg-primary/10 hover:text-white w-56 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faAndroid} className="mr-2 h-5 w-5" />
            Android Aplikacija
            <ArrowRight className="ml-2 h-4 w-4 text-primary" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-primary/20 hover:bg-primary/10 hover:text-white w-56 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faApple} className="mr-2 h-5 w-5" />
            iOS Aplikacija
          </Button>

          {/* Dropzone & preview… */}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
