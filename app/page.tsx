// app/page.tsx
'use client';

import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import CtaSection from '@/components/home/CtaSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="snap-y snap-mandatory overflow-y-auto">
      <main>
        {/* Hero: full viewport */}
        <section className="min-h-screen snap-start">
          <HeroSection />
        </section>

        {/* Features + Footer: auto height */}
        <section className="snap-start px-6 md:px-8 py-12 bg-gradient-to-b from-[#1a2332] to-[#141c28]">
          <FeatureSection />
          <Footer />
        </section>

        {/* CTA: full viewport */}
        <section className="min-h-screen snap-start">
          <CtaSection />
        </section>
      </main>
    </div>
  );
}
