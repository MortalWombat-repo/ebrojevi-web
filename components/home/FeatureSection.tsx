'use client';

import { motion } from 'framer-motion';
import { Camera, BookOpen, FlaskConical, BadgeEuro } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    icon: <Camera className="h-12 w-12 text-blue-500 mx-auto mt-4" />,
    title: 'Skeniranje deklaracija',
    description:
      'Jednostavno skenirajte deklaracije proizvoda kamerom mobilnog uređaja ili prenesite sliku putem web sučelja.',
  },
  {
    icon: <FlaskConical className="h-12 w-12 text-blue-500 mx-auto mt-4" />,
    title: 'Analiza E-brojeva',
    description:
      'Automatski identificirajte i analizirajte E-brojeve te saznajte njihovu potencijalnu štetnost.',
  },
  {
    icon: <BookOpen className="h-12 w-12 text-blue-500 mx-auto mt-4" />,
    title: 'Baza E-brojeva',
    description:
      'Pristupite opsežnoj bazi podataka E-brojeva s detaljnim informacijama o svakom aditivu, uključujući moguće nuspojave i status u različitim zemljama.',
  },
  {
    icon: <BadgeEuro className="h-12 w-12 text-blue-500 mx-auto mt-4" />,
    title: 'Besplatno korištenje',
    description:
      'Uživajte u svim funkcionalnostima aplikacije bez ikakvih troškova.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeatureSection = () => {
  return (
    <section className="min-h-[50vh] py-8 px-6 md:px-8 relative overflow-hidden flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-blue-900/20 blur-[120px] rounded-full -z-10"></div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center"
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={item} className="w-full max-w-xs">
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden h-full transition-all hover:border-blue-900/50 hover:shadow-md hover:shadow-blue-900/5 group">
      <CardHeader className="pb-2 text-center">
        <div className="transition-transform duration-300 group-hover:scale-110 mb-4 group-hover:text-blue-400 group-hover:drop-shadow-glow">
          {icon}
        </div>
        <CardTitle className="text-xl text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground text-sm text-justify">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureSection;
