import { motion } from 'framer-motion';
import { Camera, BookOpen, FlaskConical, BadgeEuro, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
import { ArrowRight } from 'lucide-react';
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
  {
    icon: <Download className="h-12 w-12 text-blue-500 mx-auto mt-4" />,
    title: 'Preuzmite aplikaciju',
    description: (
      <div className="flex gap-4 justify-center">
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
          <ArrowRight className="ml-2 h-4 w-4 text-primary" />
        </Button>
      </div>
    ),
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
    <section className="min-h-[calc(100vh-80px)] py-8 px-6 md:px-8 relative overflow-hidden flex items-center justify-center">
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
  description: string | React.ReactNode;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden h-full transition-all hover:border-blue-900/50 hover:shadow-md hover:shadow-blue-900/5 group">
      <CardHeader className="pb-2 text-center">
        <div className="transition-transform duration-300 group-hover:scale-110 mb-4 group-hover:text-blue-400 group-hover:drop-shadow-glow">
          {icon}
        </div>
        <CardTitle className="text-xl text-white text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground text-sm text-center">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureSection;