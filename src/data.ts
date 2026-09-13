import { Product, Testimonial, HeroSlide } from './types';

const luxuryVneckAdCuffBannerImg = '/src/assets/images/luxury_vneck_ad_cuff_banner_1783757089887.jpg';
const luxuryJewelryVNeckBannerImg = '/src/assets/images/luxury_jewelry_v_neck_banner_1783756960523.jpg';
const luxuryJewelryModestBannerV2Img = '/src/assets/images/luxury_jewelry_modest_banner_v2_1783756827703.jpg';
const goldJewelrySatinFlowersImg = '/src/assets/images/gold_jewelry_satin_flowers_1783581310352.jpg';
const eleganceJewelryModelImg = '/src/assets/images/elegance_jewelry_model_1783579675029.jpg';

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-slide-1',
    imageUrl: luxuryVneckAdCuffBannerImg,
    badge: '✦ 18K Anti-Tarnish Gold',
    title: 'Minimal. Timeless.',
    subtitle: 'Made to Last.',
    description: 'Handpicked minimal earrings, chains & cuffs that stay with you every moment, every day. 100% waterproof, sweatproof and anti-tarnish designed for modern elegance.',
    ctaText: 'Shop Collection',
    ctaTab: 'best-sellers',
    secondaryCtaText: 'New Arrivals',
    secondaryCtaTab: 'new-arrivals',
    isActive: true
  },
  {
    id: 'hero-slide-2',
    imageUrl: luxuryJewelryVNeckBannerImg,
    badge: '✨ Exclusive Craftsmanship',
    title: 'Everyday Luxury.',
    subtitle: 'Pure Subtle Glow.',
    description: 'Lightweight, feather-soft jewellery crafted for effortless daily styling. Designed to layer seamlessly or captivate as standalone statement pieces.',
    ctaText: 'Explore Chains',
    ctaTab: 'chains',
    secondaryCtaText: 'View Necklaces',
    secondaryCtaTab: 'necklaces',
    isActive: true
  },
  {
    id: 'hero-slide-3',
    imageUrl: luxuryJewelryModestBannerV2Img,
    badge: '💎 Lifetime Lustre',
    title: 'Heirloom Finish.',
    subtitle: 'Forever In Shine.',
    description: 'Advanced waterproof PVD gold layering and skin-safe hypoallergenic alloys. Guaranteed no blackening, no fading, and zero tarnishing.',
    ctaText: 'Shop Best Sellers',
    ctaTab: 'best-sellers',
    secondaryCtaText: 'Shop Bracelets',
    secondaryCtaTab: 'bracelets',
    isActive: true
  }
];

export interface FestivePreset {
  id: string;
  name: string;
  badge: string;
  icon: string;
  slides: HeroSlide[];
}

export const FESTIVE_HERO_PRESETS: FestivePreset[] = [
  {
    id: 'diwali',
    name: 'Diwali & Festive Glow',
    badge: '✨ Diwali Festive Offer',
    icon: '🪔',
    slides: [
      {
        id: 'diwali-slide-1',
        imageUrl: goldJewelrySatinFlowersImg,
        badge: '🪔 Diwali Festive Special • 20% OFF',
        title: 'Celebrate In Pure Radiance.',
        subtitle: 'The Luminous Festive Edit.',
        description: 'Illumine your celebrations with auspicious 18K anti-tarnish gold jewellery crafted for lifelong traditions and contemporary grace.',
        ctaText: 'Shop Festive Edit',
        ctaTab: 'best-sellers',
        secondaryCtaText: 'Explore All Necklaces',
        secondaryCtaTab: 'necklaces',
        isActive: true
      },
      {
        id: 'diwali-slide-2',
        imageUrl: luxuryVneckAdCuffBannerImg,
        badge: '✨ Auspicious Gold Curation',
        title: 'Shine Bright This Diwali.',
        subtitle: 'Heirloom Lustre & Blessings.',
        description: 'Gift timeless elegance to loved ones. Complimentary premium festive velvet packaging with every order.',
        ctaText: 'Shop Gift Curation',
        ctaTab: 'chains',
        secondaryCtaText: 'View Best Sellers',
        secondaryCtaTab: 'best-sellers',
        isActive: true
      }
    ]
  },
  {
    id: 'wedding',
    name: 'Wedding & Bridal Luxe',
    badge: '💍 Wedding Season Special',
    icon: '👑',
    slides: [
      {
        id: 'wedding-slide-1',
        imageUrl: eleganceJewelryModelImg,
        badge: '👑 Royal Wedding & Bridal Edition',
        title: 'Eternal Bridal Radiance.',
        subtitle: 'Curated For The Modern Bride.',
        description: 'From grand celebrations to intimate sangeet nights, discover statement chains and cuffs that dazzle through every cherished memory.',
        ctaText: 'Shop Bridal Curations',
        ctaTab: 'necklaces',
        secondaryCtaText: 'Explore Bracelets',
        secondaryCtaTab: 'bracelets',
        isActive: true
      },
      {
        id: 'wedding-slide-2',
        imageUrl: luxuryJewelryVNeckBannerImg,
        badge: '💎 Lifetime Tarnish-Proof Luxury',
        title: 'Unforgettable Grace.',
        subtitle: 'Crafted For Milestone Moments.',
        description: 'Pure anti-tarnish finish that withstands heat, humidity, and perfume without losing an ounce of shine.',
        ctaText: 'Shop Rings & Chains',
        ctaTab: 'chains',
        secondaryCtaText: 'Shop All',
        secondaryCtaTab: 'best-sellers',
        isActive: true
      }
    ]
  },
  {
    id: 'akshaya_tritiya',
    name: 'Akshaya Tritiya Gold Fest',
    badge: '🌸 Akshaya Tritiya Exclusive',
    icon: '🌸',
    slides: [
      {
        id: 'akshaya-slide-1',
        imageUrl: luxuryJewelryModestBannerV2Img,
        badge: '🌸 Akshaya Tritiya Auspicious Gold',
        title: 'Prosperity In Pure Gold.',
        subtitle: 'Begin An Auspicious Journey.',
        description: 'Bring home lasting prosperity with fine handpicked anti-tarnish jewelry. Timeless beauty made to be passed down through generations.',
        ctaText: 'Shop Auspicious Gold',
        ctaTab: 'chains',
        secondaryCtaText: 'Explore Necklaces',
        secondaryCtaTab: 'necklaces',
        isActive: true
      }
    ]
  },
  {
    id: 'eid',
    name: 'Eid Mubarak Collection',
    badge: '🌙 Eid Mubarak Collection',
    icon: '🌙',
    slides: [
      {
        id: 'eid-slide-1',
        imageUrl: luxuryVneckAdCuffBannerImg,
        badge: '🌙 Eid Mubarak Special Edit',
        title: 'Graceful Festive Glow.',
        subtitle: 'Shine In Handcrafted Elegance.',
        description: 'Celebrate festive joy with lightweight luxury pieces designed for radiant gatherings and memorable moments.',
        ctaText: 'Shop Eid Specials',
        ctaTab: 'best-sellers',
        secondaryCtaText: 'Explore Chains',
        secondaryCtaTab: 'chains',
        isActive: true
      }
    ]
  },
  {
    id: 'valentines',
    name: "Valentine's & Love Edit",
    badge: '❤️ The Love & Gifting Edit',
    icon: '❤️',
    slides: [
      {
        id: 'val-slide-1',
        imageUrl: goldJewelrySatinFlowersImg,
        badge: '❤️ The Valentine & Love Collection',
        title: 'Whispers Of Love.',
        subtitle: 'Gifts That Speak Forever.',
        description: 'Express timeless affection with delicate waterproof gold pieces delivered in our iconic luxury gift box.',
        ctaText: 'Shop Gifting Collection',
        ctaTab: 'best-sellers',
        secondaryCtaText: 'Shop Necklaces',
        secondaryCtaTab: 'necklaces',
        isActive: true
      }
    ]
  },
  {
    id: 'classic',
    name: 'Classic Minimal Luxe (Default)',
    badge: '✦ Everyday Luxury',
    icon: '✨',
    slides: DEFAULT_HERO_SLIDES
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- CHAINS ---
  {
    id: 'chain-1',
    name: 'Herringbone Flat Chain',
    category: 'chains',
    price: 1899,
    originalPrice: 2499,
    description: 'A sleek, fluid chain that rests gracefully against the collarbone. Engineered with a flat snake design that reflects light at every angle. Waterproof and sweatproof for continuous daily wear.',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611085583191-a3b1a30d5a41?q=85&w=1600&auto=format&fit=crop'
    ],
    isNew: true,
    isBestSeller: true,
    material: '',
    dimensions: '16 inches with 2-inch extender',
    rating: 4.9,
    reviewsCount: 38,
    stock: 15,
    variants: ['18K Yellow Gold', 'Rose Gold PVD', 'Polished Silver']
  },
  {
    id: 'chain-2',
    name: 'Sleek Snake Chain',
    category: 'chains',
    price: 1650,
    description: 'A timeless, seamless cylindrical snake chain with a glossy high-polish finish. Clean, contemporary, and incredibly soft to the touch. Anti-tarnish technology ensures a lifelong high shine.',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=85&w=1600&auto=format&fit=crop'
    ],
    isBestSeller: true,
    material: '',
    dimensions: '17 inches',
    rating: 4.8,
    reviewsCount: 22,
    stock: 24,
    variants: ['18K Yellow Gold', 'Polished Silver']
  },
  {
    id: 'chain-3',
    name: 'Figaro Bold Link Chain',
    category: 'chains',
    price: 1990,
    description: 'An elegant rendition of the classic Figaro link, customized with rounded profiles for a softer feminine drape. Bold yet light, it commands attention as a standalone piece or layered.',
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=85&w=1600&auto=format&fit=crop'
    ],
    isGift: true,
    material: '',
    dimensions: '18 inches',
    rating: 5.0,
    reviewsCount: 14,
    stock: 8,
    variants: ['18K Yellow Gold']
  },
  {
    id: 'chain-4',
    name: 'Elysian Twist Rope Chain',
    category: 'chains',
    price: 1750,
    description: 'A beautifully intricate, tightly interwoven rope chain featuring a delicate spiral design that catches light dynamically. Built with advanced PVD gold layering to be 100% waterproof, sweatproof, and completely tarnish-resistant for lifelong daily wear.',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=85&w=1600&auto=format&fit=crop'
    ],
    isNew: true,
    material: '',
    dimensions: '18 inches with 2-inch extender',
    rating: 4.9,
    reviewsCount: 18,
    stock: 20,
    variants: ['18K Yellow Gold', 'Polished Silver']
  },

  // --- NECKLACES ---
  {
    id: 'necklace-1',
    name: 'Aurelia Solitaire Pendant',
    category: 'necklaces',
    price: 1499,
    originalPrice: 1999,
    description: 'A dainty, ultra-fine cable chain supporting a single, hand-set flawless cubic zirconia solitaire. Designed to be layered or worn as an everyday whisper of luxury. Waterproof and skin friendly.',
    imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b1a30d5a41?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1611085583191-a3b1a30d5a41?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=85&w=1600&auto=format&fit=crop'
    ],
    isNew: true,
    material: '',
    dimensions: '18 inches',
    rating: 4.7,
    reviewsCount: 42,
    stock: 19,
    variants: ['18K Yellow Gold', 'Rose Gold PVD', 'Polished Silver']
  },
  {
    id: 'necklace-2',
    name: 'Empress Coin Medallion',
    category: 'necklaces',
    price: 2190,
    description: 'A vintage-inspired relief coin showing detailed organic textures, suspended from a strong rounded link chain. Captures the heritage of antique temple jewellery with a sleek, minimalist modern touch.',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=85&w=1600&auto=format&fit=crop'
    ],
    isBestSeller: true,
    material: '',
    dimensions: '18 inches + 2-inch extender',
    rating: 4.9,
    reviewsCount: 29,
    stock: 10,
    variants: ['18K Yellow Gold', 'Rose Gold PVD']
  },
  {
    id: 'necklace-3',
    name: 'Luminary Choker Set',
    category: 'necklaces',
    price: 2790,
    description: 'A pre-styled layered set consisting of our micro-satellite ball choker and a beautiful bar drop pendant chain. Styled together to frame your neck in perfect elegance. Sweatproof & hypoallergenic.',
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=85&w=1600&auto=format&fit=crop'
    ],
    isGift: true,
    isNew: true,
    material: '',
    dimensions: '14-inch Choker & 16-inch Pendant set',
    rating: 4.9,
    reviewsCount: 18,
    stock: 4,
    variants: ['18K Yellow Gold', 'Polished Silver']
  },

  // --- BRACELETS ---
  {
    id: 'bracelet-1',
    name: 'Dainty Pearl Link',
    category: 'bracelets',
    price: 1390,
    description: 'Five tiny luminous seed pearls linked together by an ultra-thin tarnish-free gold chain. Adjustable, wonderfully lightweight, and completely waterproof.',
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=85&w=1600&auto=format&fit=crop'
    ],
    material: '',
    dimensions: '6 inches + 1-inch extender',
    rating: 4.8,
    reviewsCount: 31,
    stock: 11,
    variants: ['18K Yellow Gold', 'Polished Silver']
  },
  {
    id: 'bracelet-2',
    name: 'Satin Bead Bracelet',
    category: 'bracelets',
    price: 1190,
    description: 'Individually strung satin-finished gold beads on a high-tensile flexible chain. Smooth, quiet luxury that slides beautifully around the wrist. Highly skin friendly.',
    imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=85&w=1600&auto=format&fit=crop'
    ],
    material: '',
    dimensions: '6.5 inches',
    rating: 4.6,
    reviewsCount: 16,
    stock: 30,
    variants: ['18K Yellow Gold', 'Rose Gold PVD', 'Polished Silver']
  },

  // --- CUFF BRACELETS ---
  {
    id: 'cuff-1',
    name: 'Aether Textured Cuff',
    category: 'cuff-bracelets',
    price: 2490,
    description: 'A substantial, wide cuff featuring a raw, organic hand-hammered texture. Sleek yet rich, it sits firmly but comfortably as a structural statement. Waterproof & sweat resistant.',
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611085583191-a3b1a30d5a41?q=85&w=1600&auto=format&fit=crop'
    ],
    isNew: true,
    isBestSeller: true,
    material: '',
    dimensions: 'Adjustable open cuff back',
    rating: 5.0,
    reviewsCount: 52,
    stock: 6,
    variants: ['18K Yellow Gold', 'Satin Champagne Gold']
  },
  {
    id: 'cuff-2',
    name: 'Minimalist Horizon Cuff',
    category: 'cuff-bracelets',
    price: 1990,
    description: 'A clean, highly-polished open bar cuff. Defined by its crisp, square edges and subtle tapering. Designed to be stacked or worn solo. Fully tarnish-free.',
    imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b1a30d5a41?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1611085583191-a3b1a30d5a41?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=85&w=1600&auto=format&fit=crop'
    ],
    material: '',
    dimensions: 'Standard fit (Adjustable)',
    rating: 4.7,
    reviewsCount: 25,
    stock: 18,
    variants: ['18K Yellow Gold', 'Polished Silver']
  },

  // --- DROP EARRINGS ---
  {
    id: 'drop-earring-1',
    name: 'Baroque Pearl Drops',
    category: 'drop-earrings',
    price: 2190,
    description: 'Selected freshwater baroque pearls elegantly suspended from minimalist organic gold hinges. No two pearls are identical, embodying a natural, wabi-sabi beauty. 100% waterproof and tarnish-free.',
    imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=85&w=1600&auto=format&fit=crop'
    ],
    isNew: true,
    isBestSeller: true,
    material: '',
    dimensions: '1.2 inches drop',
    rating: 4.9,
    reviewsCount: 45,
    stock: 9,
    variants: ['18K Yellow Gold', 'Polished Silver']
  },
  {
    id: 'drop-earring-2',
    name: 'Linear Gold Threaders',
    category: 'drop-earrings',
    price: 1290,
    description: 'Whisper-thin tarnish-free solid bars connected to a delicate box chain that weaves effortlessly through the earlobe. Modern structural elegance, perfect for double piercings.',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=85&w=1600&auto=format&fit=crop'
    ],
    material: '',
    dimensions: '3.5 inches total length',
    rating: 4.8,
    reviewsCount: 19,
    stock: 25,
    variants: ['18K Yellow Gold', 'Rose Gold PVD', 'Polished Silver']
  },

  // --- STUD EARRINGS ---
  {
    id: 'stud-earring-1',
    name: 'Hammered Disk Studs',
    category: 'stud-earrings',
    price: 950,
    description: 'Crafted with a subtle, irregular textured surface that captures and diffuses the light. Perfect minimalist studs for double or triple piercings. Waterproof, sweatproof and hypoallergenic.',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=85&w=1600&auto=format&fit=crop'
    ],
    material: '',
    dimensions: '6mm diameter',
    rating: 4.7,
    reviewsCount: 33,
    stock: 40,
    variants: ['18K Yellow Gold', 'Polished Silver']
  },
  {
    id: 'stud-earring-2',
    name: 'Solo Crystal Studs',
    category: 'stud-earrings',
    price: 890,
    description: 'Micro studs featuring brilliant bezel-set marquise crystals. Designed to snuggle perfectly against the ear cartilage or lobe. Ideal for everyday minimal sparkle.',
    imageUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=85&w=1600&auto=format&fit=crop'
    ],
    isBestSeller: true,
    material: '',
    dimensions: '4mm',
    rating: 4.9,
    reviewsCount: 50,
    stock: 12,
    variants: ['18K Yellow Gold', 'Polished Silver']
  },
  {
    id: 'stud-earring-3',
    name: 'Classic Bold Gold Huggies',
    category: 'stud-earrings',
    price: 1150,
    description: 'Ultra-polished chunky mini huggie hoops crafted with solid curves and a secure click-hinge. Fully tarnish-free, waterproof, and designed to look stunning as an everyday staple without any stones or diamonds.',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=85&w=1600&auto=format&fit=crop'
    ],
    isNew: true,
    material: '',
    dimensions: '10mm outer diameter, 7mm inner diameter',
    rating: 4.9,
    reviewsCount: 24,
    stock: 15,
    variants: ['18K Yellow Gold', 'Polished Silver']
  },

  // --- HAIR ACCESSORIES ---
  {
    id: 'hair-1',
    name: 'Sculptural Brass Wave Pin',
    category: 'hair-accessories',
    price: 1550,
    description: 'An abstract, sculptural hair pin hand-forged in a minimalist wave shape. Beautifully secures hair buns and chignons with a glossy metallic touch. Lead-free, skin-friendly, and lightweight.',
    imageUrl: 'https://images.unsplash.com/photo-1626784215021-2e39ac514150?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1626784215021-2e39ac514150?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590156221122-c241e7f7416f?q=85&w=1600&auto=format&fit=crop'
    ],
    isNew: true,
    material: '',
    dimensions: '4.5 inches length',
    rating: 4.8,
    reviewsCount: 15,
    stock: 7,
    variants: ['Polished Yellow Gold', 'Rose Gold', 'Brushed Antique Silver']
  },
  {
    id: 'hair-2',
    name: 'Athena Pearl Claw',
    category: 'hair-accessories',
    price: 1250,
    description: 'A mid-size metal claw clip wrapped in soft-sheen cream pearls. Features a powerful tarnish-free spring to hold half-up or full-up hairstyles securely with an elegant pearl glow.',
    imageUrl: 'https://images.unsplash.com/photo-1590156221122-c241e7f7416f?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1590156221122-c241e7f7416f?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626784215021-2e39ac514150?q=85&w=1600&auto=format&fit=crop'
    ],
    isGift: true,
    material: '',
    dimensions: '3 inches length',
    rating: 4.9,
    reviewsCount: 21,
    stock: 14,
    variants: ['Cream Pearls & Gold', 'Soft Rose Pearls & Gold']
  },
  {
    id: 'hair-3',
    name: 'Bespoke Satin Barrette',
    category: 'hair-accessories',
    price: 990,
    description: 'A slim, minimalist metallic clasp layered with high-grade ivory satin. Subtle, elegant, and gentle on delicate hair strands without causing static or pulling.',
    imageUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=85&w=1600&auto=format&fit=crop'
    ],
    material: '',
    dimensions: '4 inches long',
    rating: 4.5,
    reviewsCount: 11,
    stock: 20,
    variants: ['Ivory White', 'Muted Rose Nude', 'Espresso Brown']
  },
  // --- RINGS ---
  {
    id: 'ring-1',
    name: 'Elysian Gold Wave Band',
    category: 'rings',
    price: 1290,
    description: 'An organic, fluid wave band. Its sculptural undulations reflect light dynamically, making it a beautiful standalone statement or perfect for stacking.',
    imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=85&w=1600&auto=format&fit=crop'
    ],
    isNew: true,
    isBestSeller: true,
    material: '',
    dimensions: 'Sizes 6, 7, 8 available',
    rating: 4.9,
    reviewsCount: 28,
    stock: 18,
    variants: ['18K Yellow Gold', 'Rose Gold PVD', 'Polished Silver']
  },
  {
    id: 'ring-2',
    name: 'Classic Hammered Dome Ring',
    category: 'rings',
    price: 1450,
    description: 'A beautifully bold, substantial dome ring finished with subtle hand-hammered facets. Designed to catch light from all angles, it is 100% waterproof and hypoallergenic.',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=85&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=85&w=1600&auto=format&fit=crop'
    ],
    isBestSeller: true,
    material: '',
    dimensions: 'Sizes 6, 7, 8 available',
    rating: 4.8,
    reviewsCount: 19,
    stock: 12,
    variants: ['18K Yellow Gold', 'Polished Silver']
  },
  {
    id: 'ring-3',
    name: 'Luminary Twin Crystal Band',
    category: 'rings',
    price: 1190,
    description: 'A delicate, ultra-fine split-band ring adorned with two micro claw-set flawless cubic zirconia stones. Offers a whisper of tarnish-free everyday sparkle.',
    imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=85&w=1600&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=85&w=1600&auto=format&fit=crop'
    ],
    isGift: true,
    material: '',
    dimensions: 'Sizes 6, 7, 8 available',
    rating: 4.7,
    reviewsCount: 14,
    stock: 22,
    variants: ['18K Yellow Gold', 'Polished Silver']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Anagha S.',
    city: 'Kochi',
    state: 'Kerala',
    rating: 5,
    quote: "I've been wearing Zerish Luxe earrings daily for months and they still look as new as day one! Absolutely love the quality.",
    avatarInitials: 'AS',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'test-2',
    name: 'Nandhini R.',
    city: 'Chennai',
    state: 'Tamil Nadu',
    rating: 5,
    quote: "Minimal designs, premium quality and long lasting. Finally found my go-to jewellery brand!",
    avatarInitials: 'NR',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'test-3',
    name: 'Fathima N.',
    city: 'Calicut',
    state: 'Kerala',
    rating: 5,
    quote: "The bracelet I ordered is so elegant and durable. Perfect for everyday wear!",
    avatarInitials: 'FN',
    avatarUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'test-4',
    name: 'Swetha M.',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    rating: 5,
    quote: "Love the idea of handpicked jewellery. You can feel the care in every piece.",
    avatarInitials: 'SM',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
  }
];

export const PRESET_IMAGE_TEMPLATES = [
  {
    label: 'Warm Gold Rings/Chains',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=85&w=1600&auto=format&fit=crop'
  },
  {
    label: 'Pearl & Gold Droplets',
    url: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=85&w=1600&auto=format&fit=crop'
  },
  {
    label: 'Classic Fine Chain',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=85&w=1600&auto=format&fit=crop'
  },
  {
    label: 'Delicate Minimal Band',
    url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=85&w=1600&auto=format&fit=crop'
  },
  {
    label: 'Precious Amber / Brass',
    url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=85&w=1600&auto=format&fit=crop'
  },
  {
    label: 'Luminous Gemstone Stud',
    url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=85&w=1600&auto=format&fit=crop'
  },
  {
    label: 'Dainty Hair Ornament',
    url: 'https://images.unsplash.com/photo-1626784215021-2e39ac514150?q=85&w=1600&auto=format&fit=crop'
  }
];

/**
 * Generates an elegant WhatsApp share message for a product
 */
export function formatWhatsAppProductMessage(product: Product): string {
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/#product-${product.id}` : '';
  const priceFormatted = `₹${product.price.toLocaleString('en-IN')}`;
  const originalPriceFormatted = product.originalPrice ? `₹${product.originalPrice.toLocaleString('en-IN')}` : '';
  
  let msg = `✨ *ZERISH LUXE FINE JEWELLERY* ✨\n\n`;
  msg += `💍 *${product.name}*\n`;
  msg += `🏷️ *Price:* ${priceFormatted}`;
  if (product.originalPrice && product.originalPrice > product.price) {
    msg += ` ~${originalPriceFormatted}~ (${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)`;
  }
  msg += `\n`;
  
  if (product.material) {
    msg += `✨ *Craft:* ${product.material}\n`;
  }
  
  msg += `🛡️ *Highlights:* 100% Anti-Tarnish, Waterproof & Sweatproof, Skin-Friendly\n`;
  
  if (product.imageUrl) {
    msg += `🖼️ *Product Image:* ${product.imageUrl}\n`;
  }
  
  if (currentUrl) {
    msg += `🔗 *View Piece Online:* ${currentUrl}\n`;
  }
  
  msg += `\n_Crafted for everyday luxury and timeless grace._`;
  
  return msg;
}

/**
 * Triggers WhatsApp share for a product
 */
export function shareProductToWhatsApp(product: Product): void {
  const text = formatWhatsAppProductMessage(product);
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  
  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Native Web Share API with fallback to WhatsApp & Clipboard
 */
export async function shareProductNativeOrWhatsApp(product: Product): Promise<'native' | 'whatsapp' | 'copied'> {
  const text = formatWhatsAppProductMessage(product);
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/#product-${product.id}` : '';

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `${product.name} - Zerish Luxe`,
        text: text,
        url: currentUrl || undefined,
      });
      return 'native';
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        shareProductToWhatsApp(product);
        return 'whatsapp';
      }
      return 'native';
    }
  } else {
    shareProductToWhatsApp(product);
    return 'whatsapp';
  }
}

