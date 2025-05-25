'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
import { faImage, faXmark, faCrop, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ArrowRight } from 'lucide-react';
import { useDropzone, FileRejection } from 'react-dropzone';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [ocrText, setOcrText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

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

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

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
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        1
      );
    });
  };

  const processImage = async (file: File) => {
    setIsLoading(true);
    setError('');
    setOcrText('');

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
      if (data.error) {
        throw new Error(data.details || data.error);
      }

      setOcrText(data.text || 'No text detected');
    } catch (err) {
      setError(err.message);
      console.error('Client-side error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
        setCrop(undefined);
        setIsCropping(true);
      }
    },
    []
  );

  const handleCropComplete = async () => {
    if (!imgRef.current || !crop) return;

    try {
      const croppedBlob = await getCroppedImg(imgRef.current, crop);
      const croppedFile = new File([croppedBlob], 'cropped-image.jpg', {
        type: 'image/jpeg',
      });
      setImage(URL.createObjectURL(croppedBlob));
      setIsCropping(false);
      processImage(croppedFile);
    } catch (err) {
      console.error('Error cropping image:', err);
      setError('Error cropping image');
    }
  };

  const clearImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }
    setImage(null);
    setOcrText('');
    setError('');
    setIsCropping(false);
    setCrop(undefined);
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
      className="relative h-full flex items-center justify-center px-6 md:px-8 overflow-hidden"
    >
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full max-w-md mx-auto pt-4"
          >
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed border-primary/20 rounded-lg p-6 text-center cursor-pointer transition-colors ${
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
              <div className="mt-4 relative">
                {!isCropping && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -right-2 -top-2 bg-background/80 hover:bg-background rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearImage();
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-8 -top-2 bg-background/80 hover:bg-background rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCropping(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faCrop} className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {isCropping ? (
                  <div className="relative">
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      aspect={undefined}
                    >
                      <img
                        ref={imgRef}
                        src={image}
                        alt="Upload preview"
                        className="max-w-full h-auto rounded-lg shadow-md"
                      />
                    </ReactCrop>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCropping(false);
                          setCrop(undefined);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCropComplete}>
                        <FontAwesomeIcon icon={faCheck} className="mr-2 h-4 w-4" />
                        Apply Crop
                      </Button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={image}
                    alt="Upload preview"
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                )}
              </div>
            )}
            {isLoading && (
              <div className="mt-4 text-primary">Processing image...</div>
            )}
            {ocrText && !isLoading && (
              <div className="mt-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Extracted Text:
                </h3>
                <p className="text-sm text-white whitespace-pre-wrap">
                  {ocrText}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;