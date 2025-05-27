'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faXmark, faCrop, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useDropzone, FileRejection } from 'react-dropzone';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const HeroSection = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [showGrid, setShowGrid] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !gridRef.current) return;

      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - left;
      const mouseY = e.clientY - top;

      const relativeX = mouseX / width;
      const relativeY = mouseY / height;

      const rotateX = (relativeY - 0.5) * 10;
      const rotateY = (relativeX - 0.5) * 10;
      const translateX = (relativeX - 0.5) * 40;
      const translateY = (relativeY - 0.5) * 40;

      if (gridRef.current) {
        gridRef.current.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translate(${translateX}px, ${translateY}px)
        `;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No 2d context');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas is empty'));
          resolve(blob);
        },
        'image/jpeg',
        1
      );
    });
  };

  const extractENumbers = (text: string): string => {
    const regex = /\bE(?:(?:\d{4})|(?:\d{3}[a-z])|(?:\d{3}))\b/g;
    const matches = text.match(regex);
    return matches ? matches.join(', ') : '';
  };

  const processImage = async (file: File) => {
    setIsLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to process image');
      }

      const data = await response.json();
      if (data.error) throw new Error(data.details || data.error);

      const eNumbers = extractENumbers(data.text || '');
      router.push(`/database${eNumbers ? `?eNumbers=${encodeURIComponent(eNumbers)}` : ''}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 399; // Increased from 133 to 399 (3x larger)
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not get canvas context'));

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError('');
      if (rejectedFiles.length > 0) {
        setError('Please upload a valid image file (jpg, jpeg, png).');
        return;
      }
      const file = acceptedFiles[0];
      if (file) {
        try {
          setOriginalFile(file);
          setShowGrid(false);
          const thumbnailUrl = await createThumbnail(file);
          setImage(thumbnailUrl);
          setCrop(undefined);
          setIsCropping(false);
          setTimeout(() => previewRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } catch (err) {
          setError('Failed to create image preview');
        }
      }
    },
    []
  );

  const handleCropComplete = async () => {
    if (!imgRef.current || !crop || !originalFile) return;

    try {
      const croppedBlob = await getCroppedImg(imgRef.current, crop);
      const croppedFile = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });
      const thumbnailUrl = await createThumbnail(croppedFile);
      setImage(thumbnailUrl);
      setOriginalFile(croppedFile);
      setIsCropping(false);
      processImage(croppedFile);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    }
  };

  const clearImage = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setOriginalFile(null);
    setError('');
    setIsCropping(false);
    setCrop(undefined);
    setShowGrid(true);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  return (
    <section
      ref={containerRef}
      className="relative h-full flex items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        {showGrid && (
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
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332]/50 to-[#141c28]/50 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 w-full">
        {!image && (
          <>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mt-[-8px]"
            >
              Skenirajte deklaraciju
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-[-8px]"
            >
              Skenirajte vaše deklaracije i saznajte koliko je zdrava hrana koju mislite konzumirati
            </motion.p>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center justify-center space-y-4 pt-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full max-w-md pt-4"
          >
            {image && (
              <div ref={previewRef} className="mt-4 max-h-[500px] overflow-auto">
                {isCropping ? (
                  <div className="relative">
                    <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={undefined}>
                      <img
                        ref={imgRef}
                        src={image}
                        alt="Upload preview"
                        className="block mx-auto max-w-full max-h-96 h-auto rounded-lg shadow-md"
                      />
                    </ReactCrop>
                    <div className="mt-4 flex justify-end gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCropping(false);
                          setCrop(undefined);
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCropComplete} disabled={isLoading}>
                        <FontAwesomeIcon icon={faCheck} className="mr-2 h-4 w-4" />
                        Apply Crop
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <img
                      src={image}
                      alt="Upload preview"
                      className="block mx-auto max-w-full max-h-96 h-auto rounded-lg shadow-md"
                    />
                    <div className="mt-4 flex justify-center gap-2 flex-wrap">
                      <Button onClick={() => setIsCropping(true)} disabled={isLoading}>
                        <FontAwesomeIcon icon={faCrop} className="mr-2 h-4 w-4" />
                        Crop
                      </Button>
                      <Button
                        onClick={() => originalFile && processImage(originalFile)}
                        disabled={isLoading}
                      >
                        Upload
                      </Button>
                      <Button variant="outline" onClick={clearImage} disabled={isLoading}>
                        <FontAwesomeIcon icon={faXmark} className="mr-2 h-4 w-4" />
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed border-primary/20 rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'bg-primary/10' : 'hover:bg-primary/10'
              } w-full h-32 flex flex-col items-center justify-center`}
            >
              <input {...getInputProps()} />
              {!image && (
                <>
                  <FontAwesomeIcon icon={faImage} className="h-8 w-8 text-primary/50 mb-2" />
                  <p className="text-muted-foreground text-sm">
                    {isDragActive
                      ? 'Drop the image here...'
                      : 'Povucite i ispustite sliku ovdje ili kliknite za odabir iz preglednika datoteka'}
                  </p>
                </>
              )}
            </div>
            {!image && (
              <div className="mt-2 text-center">
                <Link href="/database" className="text-white hover:text-white/80 text-sm">
                  Deklaracija nečitka ili se svi brojevi nisu skenirali? Upišite ručno OVDJE.
                </Link>
              </div>
            )}
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

            {isLoading && <div className="mt-4 text-primary">Processing image...</div>}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;