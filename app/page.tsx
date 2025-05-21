'use client';

import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import CtaSection from '@/components/home/CtaSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen snap-y snap-mandatory overflow-y-auto">
      <main>
        <HeroSection />
        <div className="snap-start min-h-screen">
          <FeatureSection />
        </div>
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
