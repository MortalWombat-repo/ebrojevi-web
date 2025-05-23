'use client';

import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero: full viewport */}
      <section className="h-screen flex-none">
        <HeroSection />
      </section>

      {/* Features + Footer: full viewport */}
      <section className="min-h-screen flex-none bg-gradient-to-b from-[#1a2332] to-[#141c28]">
        <FeatureSection />
        <Footer />
      </section>
    </div>
  );
}
