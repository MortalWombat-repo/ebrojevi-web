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
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Mouse move effect for background grid
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !gridRef.current) return;

      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - left;
      const mouseY = e.clientY - top;

      const relativeX = mouseX / width;
      const relativeY = mouseY / height;

      const rotateX = (relativeY - 0.5) * 10;
      const rotateY = (relativeX - 0.5) * 10;
      const translateX = (relativeX - 0.5) * 40;
      const translateY = (relativeY - 0.5) * 40;

      gridRef.current.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translate(${translateX}px, ${translateY}px)
      `;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Dropzone logic
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError('');
      if (rejectedFiles.length > 0) {
        setError('Please upload a valid image file (jpg, jpeg, png).');
        return;
      }
      const file = acceptedFiles[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
  });

  // Clean up image URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  return (
    <section
      ref={containerRef}
      className="relative h-full flex items-center justify-center px-6 md:px-8 overflow-hidden"
    >
      {/* Animated dot grid background */}
      <div className="absolute inset-0 z-0">
        <div
          ref={gridRef}
          className="absolute inset-0 transition-transform duration-[50ms] ease-out"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(132, 255, 132, 0.5) 2.5px, transparent 2.5px)',
            backgroundSize: '40px 40px',
            backgroundPosition: 'center',
            transformOrigin: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332]/50 to-[#141c28]/50 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
        >
          Skenirajte deklaraciju
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          Skenirajte vaše deklaracije i saznajte koliko je zdrava hrana koju
          mislite konzumirati
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center justify-center space-y-4 pt-4"
        >
          <Button
            size="lg"
            variant="outline"
            className="w-56 flex items-center justify-center text-muted-foreground/70 border-primary/20 hover:bg-primary/10 hover:text-white"
          >
            <FontAwesomeIcon icon={faAndroid} className="mr-2 h-5 w-5" />
            Android Aplikacija
            <ArrowRight className="ml-2 h-4 w-4 text-primary" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-56 flex items-center justify-center text-muted-foreground/70 border-primary/20 hover:bg-primary/10 hover:text-white"
          >
            <FontAwesomeIcon icon={faApple} className="mr-2 h-5 w-5" />
            iOS Aplikacija
          </Button>

          {/* Image Dropzone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full max-w-md mx-auto pt-4"
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed border-primary/20 rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'bg-primary/10' : 'hover:bg-primary/10'
              } w-full h-32 flex flex-col items-center justify-center`}
            >
              <input {...getInputProps()} />
              <FontAwesomeIcon
                icon={faImage}
                className="h-8 w-8 text-primary/50 mb-2"
              />
              {isDragActive ? (
                <p className="text-muted-foreground text-sm">
                  Drop the image here...
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Povucite i ispustite sliku ovdje ili kliknite za odabir iz
                  preglednika datoteka
                </p>
              )}
            </div>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            {image && (
              <div className="mt-4">
                <img
                  src={image}
                  alt="Uploaded preview"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
