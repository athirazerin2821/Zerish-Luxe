import React, { useState } from 'react';
import { Instagram, Heart, MessageCircle, X, Check, UserPlus } from 'lucide-react';

interface InstagramPost {
  id: string;
  imageUrl: string;
  handle: string;
  caption: string;
  likes: number;
  comments: number;
  location: string;
  jewellery: string;
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'post-1',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    handle: '@anjali.nair_kochi',
    caption: 'Waterproof, sweatproof, and absolutely stunning. Worn my Herringbone Flat Chain through endless beach trips and it still looks liquid gold! ✨🏖️ #ZerishLuxe #AntiTarnish',
    likes: 420,
    comments: 18,
    location: 'Fort Kochi Beach',
    jewellery: 'Herringbone Flat Chain'
  },
  {
    id: 'post-2',
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop',
    handle: '@keerthana_chennai_edit',
    caption: 'My absolute favorite everyday companion. Elegant layers that transition seamlessly from office meetings to evening cafes. ☕💎 #MinimalElegance #FineJewelry',
    likes: 388,
    comments: 24,
    location: 'Khader Nawaz Khan Rd, Chennai',
    jewellery: 'Dainty Pearl Link Bracelet'
  },
  {
    id: 'post-3',
    imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop',
    handle: '@meerapillai_tvm',
    caption: 'Pure organic perfection. The Baroque Pearl Drops are a dream. Weightless, gorgeous, and matching with everything! 🌸🦪 #OrganicModern #WaterproofLuxury',
    likes: 512,
    comments: 15,
    location: 'Trivandrum, Kerala',
    jewellery: 'Baroque Pearl Drops'
  },
  {
    id: 'post-4',
    imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b1a30d5a41?q=80&w=600&auto=format&fit=crop',
    handle: '@divyakrishnan_coimbatore',
    caption: 'Stacked cuffs for that effortless structural vibe. Loving this highly-polished open bar cuff. Zero tarnishing after months of daily wear. ⚡✨ #EverydayLuxury #TarnishFree',
    likes: 295,
    comments: 12,
    location: 'Coimbatore, Tamil Nadu',
    jewellery: 'Minimalist Horizon Cuff'
  },
  {
    id: 'post-5',
    imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop',
    handle: '@aparnamenon.kozhikode',
    caption: 'The way the satin beads catch the evening light... purely magical. Zerish Luxe packaging makes unboxing feel like absolute royalty. 🎁👑 #SelfLoveGift #BespokeJewels',
    likes: 624,
    comments: 42,
    location: 'Kozhikode, Kerala',
    jewellery: 'Satin Bead Bracelet'
  },
  {
    id: 'post-6',
    imageUrl: 'https://images.unsplash.com/photo-1626784215021-2e39ac514150?q=80&w=600&auto=format&fit=crop',
    handle: '@karthik_selvam_cbe',
    caption: 'Gifting solved perfectly. The presentation is so premium, and she is in love with the wave-shaped hair pin! High-polish brass art. 🌊💫 #LuxeGifting #SustainableLuxury',
    likes: 411,
    comments: 9,
    location: 'Coimbatore, Tamil Nadu',
    jewellery: 'Sculptural Brass Wave Pin'
  }
];

export default function InstagramGallery() {
  const [activePost, setActivePost] = useState<InstagramPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  const toggleLike = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(prev => prev.filter(id => id !== postId));
    } else {
      setLikedPosts(prev => [...prev, postId]);
    }
  };

  const toggleFollow = (handle: string) => {
    if (following.includes(handle)) {
      setFollowing(prev => prev.filter(h => h !== handle));
    } else {
      setFollowing(prev => [...prev, handle]);
    }
  };

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-espresso/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 text-terracotta mb-2">
            <Instagram className="w-4 h-4" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold">@ZerishLuxe.Studio</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-espresso tracking-tight">
            Styled By You
          </h2>
          <div className="w-12 h-[1px] bg-taupe mx-auto mt-4"></div>
          <p className="text-sm text-espresso/70 mt-3">
            Join our luxury circle. Tag <strong className="text-espresso">#ZerishLuxeCollectors</strong> on Instagram to be featured on our everyday styling wall.
          </p>
        </div>

        {/* Instagrid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_POSTS.map((post) => {
            const isLiked = likedPosts.includes(post.id);
            return (
              <div 
                key={post.id}
                onClick={() => setActivePost(post)}
                className="group relative aspect-square bg-linen/25 overflow-hidden cursor-pointer border border-espresso/5 hover:shadow-lg transition-shadow duration-300"
              >
                <img 
                  src={post.imageUrl} 
                  alt={post.handle} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Hover overlay stats */}
                <div className="absolute inset-0 bg-espresso/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white space-y-2">
                  <Instagram className="w-5 h-5 mb-1 text-[#FAF8F6]" />
                  <p className="text-[10px] tracking-wider font-semibold">{post.handle}</p>
                  
                  <div className="flex items-center space-x-4 text-xs pt-1">
                    <span className="flex items-center space-x-1">
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'fill-white text-white'}`} />
                      <span>{post.likes + (isLiked ? 1 : 0)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                      <span>{post.comments}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay mask */}
          <div 
            onClick={() => setActivePost(null)}
            className="fixed inset-0 bg-espresso/80 backdrop-blur-xs"
          ></div>

          {/* Dialog */}
          <div className="bg-[#FAF8F6] w-full max-w-3xl rounded-sm shadow-2xl border border-espresso/15 overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 max-h-[85vh]">
            
            {/* Close */}
            <button 
              onClick={() => setActivePost(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 md:bg-[#FAF8F6]/80 text-espresso hover:bg-espresso hover:text-white transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Post Image */}
            <div className="aspect-square bg-linen relative overflow-hidden flex items-center">
              <img 
                src={activePost.imageUrl} 
                alt={activePost.handle} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-espresso/65 text-white text-[10px] uppercase tracking-wider px-2.5 py-1 backdrop-blur-xs">
                📍 {activePost.location}
              </div>
            </div>

            {/* Right Feed Metadata */}
            <div className="p-6 flex flex-col justify-between h-full overflow-y-auto">
              <div>
                
                {/* User Info Header */}
                <div className="flex items-center justify-between border-b border-espresso/10 pb-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-terracotta text-white font-serif text-xs flex items-center justify-center font-bold">
                      ZL
                    </div>
                    <div>
                      <h4 className="font-serif text-xs font-bold text-espresso">{activePost.handle}</h4>
                      <p className="text-[9px] text-taupe tracking-wider uppercase">Luxe Collector</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleFollow(activePost.handle)}
                    className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all flex items-center space-x-1 ${
                      following.includes(activePost.handle)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-espresso text-white hover:bg-terracotta'
                    }`}
                  >
                    {following.includes(activePost.handle) ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Comment Body */}
                <div className="space-y-4">
                  <p className="text-xs text-espresso/80 leading-relaxed font-sans">
                    {activePost.caption}
                  </p>
                  
                  {/* Tagged Jewellery Piece */}
                  <div className="p-3.5 bg-linen/25 border border-espresso/5 rounded-xs flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-taupe font-bold">Featured Jewellery Piece:</p>
                      <p className="font-serif text-xs font-semibold text-espresso">{activePost.jewellery}</p>
                    </div>
                    <span className="text-[9px] font-bold text-terracotta tracking-wider uppercase">WATER-SAFE 18K</span>
                  </div>
                </div>

              </div>

              {/* Like Buttons and Footer */}
              <div className="pt-4 border-t border-espresso/10 mt-6">
                <div className="flex items-center justify-between mb-3 text-xs text-espresso">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => toggleLike(activePost.id)}
                      className="flex items-center space-x-1 hover:text-terracotta transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          likedPosts.includes(activePost.id)
                            ? 'fill-rose-500 text-rose-500 scale-110'
                            : 'text-espresso'
                        } transition-all duration-300`} 
                      />
                      <span className="font-semibold">
                        {activePost.likes + (likedPosts.includes(activePost.id) ? 1 : 0)} likes
                      </span>
                    </button>
                    <span className="text-espresso/60">{activePost.comments} comments</span>
                  </div>
                  <span className="text-[10px] text-taupe font-mono">JULY 2026</span>
                </div>
                
                <p className="text-[10px] text-center text-taupe/80 leading-relaxed">
                  Every product is vacuum-plated 316L Stainless steel. Waterproof and skin-safe under everyday conditions.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
