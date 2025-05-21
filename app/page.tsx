'use client';

   import HeroSection from '@/components/home/HeroSection';
   import FeatureSection from '@/components/home/FeatureSection';
   import CtaSection from '@/components/home/CtaSection';

   export default function Home() {
     return (
       <main>
         <HeroSection />
         <FeatureSection />
         <CtaSection />
       </main>
     );
   }
