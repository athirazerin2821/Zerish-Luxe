import React from 'react';
import { 
  Shield, 
  Sparkles, 
  Droplets, 
  CheckCircle, 
  Heart, 
  Coins, 
  Feather, 
  Star, 
  Gift, 
  Calendar 
} from 'lucide-react';

interface ValueCardProps {
  key?: React.Key;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="bg-white border border-espresso/10 p-6 rounded-sm shadow-xs hover:shadow-md hover:border-terracotta/40 transition-all duration-300 flex flex-col items-center text-center">
      <div className="p-3 bg-linen/30 rounded-full text-terracotta mb-4">
        {icon}
      </div>
      <h4 className="font-serif text-base font-semibold text-espresso tracking-tight mb-2">
        {title}
      </h4>
      <p className="text-xs text-espresso/70 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function WhyChooseUs() {
  const pillars = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "316 Stainless Steel",
      description: "Crafted using premium surgical-grade steel, highly resilient and completely hypoallergenic."
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Anti-Tarnish Tech",
      description: "Advanced vacuum-plated PVD barrier ensures your jewelry maintains its stunning luster."
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      title: "Waterproof Jewelry",
      description: "Wear it in the shower, pool, or sea. Completely water-safe without turning skin green."
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Premium Quality",
      description: "Exquisite polishing and hand-finished details that replicate heavy solid gold pieces."
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Handpicked with Love",
      description: "Each design is meticulously selected to complement your unique personality and grace."
    },
    {
      icon: <Coins className="w-5 h-5" />,
      title: "Affordable Luxury",
      description: "Enjoy high-end Parisian aesthetics without the heavy premium markups."
    },
    {
      icon: <Feather className="w-5 h-5" />,
      title: "Minimal Designs",
      description: "Sleek, fluid, and whisper-light silhouettes styled for the elegant modern woman."
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Long Lasting Shine",
      description: "Specially coated to resist sweat, cosmetics, and daily wear-and-tear friction."
    },
    {
      icon: <Gift className="w-5 h-5" />,
      title: "Perfect Gift Choice",
      description: "Packaged inside sustainable linen boxes that make every unboxing feel incredibly premium."
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Made for Daily Wear",
      description: "Featherlight composition designed to feel like a seamless extension of yourself, all day."
    }
  ];

  return (
    <section className="bg-linen/15 border-t border-b border-espresso/10 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">Our Guarantee</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-espresso mt-2 tracking-tight">
            The Zerish Luxe Standard
          </h2>
          <div className="w-12 h-[1px] bg-taupe mx-auto mt-4"></div>
          <p className="text-sm text-espresso/70 mt-3">
            Discover why our anti-tarnish fine collections are trusted by modern collectors across India.
          </p>
        </div>

        {/* Value Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {pillars.map((pillar, idx) => (
            <ValueCard 
              key={idx}
              icon={pillar.icon}
              title={pillar.title}
              description={pillar.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
