import React, { useState, useRef } from 'react';
import { 
  X, 
  ShoppingBag, 
  Star, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  Droplets, 
  ChevronDown, 
  RotateCw, 
  HelpCircle,
  Award,
  Truck,
  Heart
} from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  products: Product[]; // for Related & Bundle lookup
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

export default function ProductModal({ 
  product, 
  onClose, 
  onAddToCart, 
  products,
  wishlist,
  onToggleWishlist
}: ProductModalProps) {
  // Image selection
  const imageList = product.thumbnails && product.thumbnails.length > 0 
    ? product.thumbnails 
    : [product.imageUrl];
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Zoom effect on hover
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${imageList[activeImgIdx]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };
  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  // 360 viewer state
  const [is360Active, setIs360Active] = useState(false);
  const [rotation, setRotation] = useState(0); // degrees 0-359
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleDragStart = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const diff = e.clientX - startX.current;
    // Rotate 1 degree per 2 pixels
    const rotDiff = Math.round(diff / 2);
    setRotation(prev => {
      let next = (prev + rotDiff) % 360;
      if (next < 0) next += 360;
      return next;
    });
    startX.current = e.clientX;
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  // Accordion details
  const [activeSection, setActiveSection] = useState<'details' | 'care' | 'shipping'>('details');

  // Find related products (same category, excluding current)
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Frequently Bought Together Bundle (Find 1 item from another category)
  const bundleItem = products.find(p => p.category !== product.category && p.stock && p.stock > 0);
  const [bundleAdded, setBundleAdded] = useState(false);

  const handleAddBundle = () => {
    if (!bundleItem) return;
    onAddToCart(product);
    onAddToCart(bundleItem);
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2000);
  };

  // Mock Reviews based on South India Names
  const mockReviews = [
    {
      name: 'Anjali Nair',
      city: 'Kochi',
      rating: 5,
      date: 'Jul 4, 2026',
      text: "The finish is exceptional. Truly anti-tarnish as described, I wear it during my humid travels through Kerala and it hasn't faded a bit!"
    },
    {
      name: 'Keerthana S',
      city: 'Chennai',
      rating: 5,
      date: 'Jun 28, 2026',
      text: "Perfect weight, looks incredibly gold and doesn't cause any skin allergies. Ideal for long office hours in Chennai."
    }
  ];

  const averageRating = product.rating || 4.8;
  const reviewsCount = product.reviewsCount || 24;

  const inWishlist = wishlist.includes(product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Overlay mask */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-espresso/70 backdrop-blur-xs transition-opacity"
      ></div>
      
      {/* Dialog container */}
      <div className="relative bg-[#FAF8F6] w-full max-w-4xl p-6 sm:p-10 rounded-sm shadow-2xl border border-espresso/10 z-10 max-h-[92vh] overflow-y-auto no-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-espresso hover:bg-espresso hover:text-white transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- LEFT HAND: GALLERY & VIEWER (5 Columns) --- */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Visual Frame */}
          <div className="relative aspect-square bg-[#FAF8F6] border border-espresso/10 overflow-hidden rounded-sm">
            {is360Active ? (
              // 360 interactive rotation drag board
              <div 
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                className="w-full h-full flex flex-col items-center justify-center cursor-ew-resize relative select-none"
              >
                {/* Simulated Rotated Image via skew/scale transforms & gloss layers */}
                <div 
                  className="w-3/4 h-3/4 transition-transform duration-75 relative"
                  style={{ 
                    transform: `rotateY(${rotation}degrees)`, 
                    perspective: '1000px'
                  }}
                >
                  <img 
                    src={imageList[activeImgIdx]} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-sm pointer-events-none" 
                  />
                  {/* Gloss glare reflection layer */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none"
                    style={{
                      transform: `translateX(${(rotation % 180) - 90}px)`,
                      opacity: Math.max(0.1, Math.min(0.6, Math.abs(180 - (rotation % 360)) / 180))
                    }}
                  />
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center space-x-1 text-[10px] text-taupe font-bold uppercase tracking-wider bg-white/70 py-1.5 px-3 rounded-full max-w-xs mx-auto backdrop-blur-xs">
                  <RotateCw className="w-3 h-3 text-terracotta animate-spin" />
                  <span>Drag left/right to rotate ({rotation}°)</span>
                </div>
              </div>
            ) : (
              // Static Image with magnifier hover zoom effect
              <div 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full h-full cursor-zoom-in"
              >
                <img 
                  src={imageList[activeImgIdx]} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded-sm"
                  referrerPolicy="no-referrer"
                />

                {/* Magnifier glass lens overlay */}
                <div 
                  className="absolute pointer-events-none border border-espresso/15 shadow-xl w-36 h-36 rounded-full"
                  style={{
                    ...zoomStyle,
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    top: '50%',
                    left: '50%'
                  }}
                />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10">
              {product.isNew && (
                <span className="bg-terracotta text-white text-[8px] uppercase tracking-widest font-extrabold px-2.5 py-1 shadow-xs">
                  New Arrival
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-espresso text-[#FAF8F6] text-[8px] uppercase tracking-widest font-extrabold px-2.5 py-1 shadow-xs">
                  Best Seller
                </span>
              )}
            </div>

            {/* Wishlist button */}
            <button 
              onClick={() => onToggleWishlist(product.id)}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-espresso hover:text-white rounded-full text-espresso shadow-xs transition-colors z-10"
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails list carousel */}
          <div className="flex items-center space-x-2">
            {imageList.map((url, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveImgIdx(index);
                  setIs360Active(false);
                }}
                className={`w-14 h-14 border rounded-sm overflow-hidden flex-shrink-0 transition-all ${
                  activeImgIdx === index && !is360Active
                    ? 'border-terracotta ring-1 ring-terracotta'
                    : 'border-espresso/15 hover:opacity-100 opacity-70'
                }`}
              >
                <img src={url} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}

            {/* 360 button */}
            <button
              onClick={() => setIs360Active(prev => !prev)}
              className={`h-14 px-3 border rounded-sm flex flex-col items-center justify-center flex-shrink-0 text-[10px] font-bold tracking-widest uppercase transition-all ${
                is360Active
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'border-espresso/15 text-espresso bg-[#FAF8F6] hover:bg-linen/20'
              }`}
            >
              <RotateCw className="w-4 h-4 mb-0.5" />
              <span>360°</span>
            </button>
          </div>

          {/* Feature icons */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-espresso/10 text-center">
            <div className="bg-linen/20 p-2 border border-espresso/5 rounded-xs flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-terracotta mb-0.5" />
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-espresso">Anti-Tarnish</span>
            </div>
            <div className="bg-linen/20 p-2 border border-espresso/5 rounded-xs flex flex-col items-center">
              <Droplets className="w-4 h-4 text-terracotta mb-0.5" />
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-espresso">Waterproof</span>
            </div>
            <div className="bg-linen/20 p-2 border border-espresso/5 rounded-xs flex flex-col items-center">
              <Sparkles className="w-4 h-4 text-terracotta mb-0.5" />
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-espresso">Hypoallergenic</span>
            </div>
          </div>

        </div>

        {/* --- RIGHT HAND: METADATA & ACTIONS (7 Columns) --- */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {/* Brand & Heading details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-semibold text-taupe">
              <span>{product.category === 'cuff-bracelets' ? 'Cuff Bangles' : product.category.replace('-', ' ')}</span>
              <span className="text-espresso font-bold font-mono">CODE: ZL-{product.id.split('-').pop()}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-espresso tracking-tight">
              {product.name}
            </h2>

            {/* Price tag */}
            <div className="flex items-baseline space-x-3 pt-1">
              <span className="text-2xl font-bold text-espresso">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="text-xs text-taupe tracking-wider uppercase font-semibold">Taxes included. Free South India Shipping.</span>
            </div>

            {/* Description */}
            <p className="text-xs text-espresso/75 leading-relaxed pt-2 border-t border-espresso/5">
              {product.description}
            </p>

            {/* Material Specifications specs */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-3 text-espresso/80">
              <div className="flex justify-between border-b border-espresso/5 pb-1.5">
                <span className="text-taupe">Metal composition:</span>
                <span className="font-semibold">{product.material || '316L Surgical Stainless Steel'}</span>
              </div>
              <div className="flex justify-between border-b border-espresso/5 pb-1.5">
                <span className="text-taupe">Plating detail:</span>
                <span className="font-semibold">18k Gold PVD Coating</span>
              </div>
              <div className="flex justify-between border-b border-espresso/5 pb-1.5">
                <span className="text-taupe">Dimensions:</span>
                <span className="font-semibold">{product.dimensions || 'Adjustable sizing'}</span>
              </div>
              <div className="flex justify-between border-b border-espresso/5 pb-1.5">
                <span className="text-taupe">Stock level:</span>
                <span className={`font-bold uppercase text-[10px] ${
                  (product.stock || 0) === 0
                    ? 'text-rose-600'
                    : (product.stock || 0) < 5
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}>
                  {(product.stock || 0) === 0 ? 'Out of Stock' : (product.stock || 0) < 5 ? `Low Stock (${product.stock})` : 'In Stock'}
                </span>
              </div>
            </div>
          </div>

          {/* Bundle Add - Complete the Look */}
          {bundleItem && (
            <div className="bg-[#FAF8F6] border border-espresso/15 p-3 sm:p-4 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest text-terracotta font-extrabold flex items-center space-x-1.5">
                  <Award className="w-4 h-4" />
                  <span>COMPLETE THE LOOK & SAVE 10%</span>
                </p>
                <span className="text-[9px] text-white bg-terracotta px-2 py-0.5 uppercase tracking-wider font-extrabold">Exclusive Bundle</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 bg-linen border border-espresso/5 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={bundleItem.imageUrl} alt={bundleItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-wider text-taupe">Add matching piece</p>
                    <p className="font-serif text-xs font-bold text-espresso truncate">{bundleItem.name}</p>
                    <p className="text-xs font-semibold text-espresso">₹{bundleItem.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <button
                  onClick={handleAddBundle}
                  className={`px-4 py-2 text-[10px] uppercase tracking-widest font-extrabold transition-all border ${
                    bundleAdded 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                      : 'bg-[#FAF8F6] border-espresso text-espresso hover:bg-espresso hover:text-white'
                  }`}
                >
                  {bundleAdded ? 'Added Bundle!' : 'Add Both to Enquiry'}
                </button>
              </div>
            </div>
          )}

          {/* Standard Buy / Add-to-bag button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              disabled={(product.stock || 0) === 0}
              className={`w-full py-4 uppercase tracking-widest text-xs font-extrabold shadow-md flex items-center justify-center space-x-2.5 transition-all ${
                (product.stock || 0) === 0
                  ? 'bg-espresso/30 text-white cursor-not-allowed'
                  : 'bg-espresso text-[#FAF8F6] hover:bg-terracotta hover:scale-[1.01]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{(product.stock || 0) === 0 ? 'Notify When Restocked' : 'Add to Enquiry Curation'}</span>
            </button>
          </div>

          {/* Secondary Details Collapsible / Accordions */}
          <div className="border-t border-espresso/15 pt-4 space-y-2">
            {/* Tabs Headers */}
            <div className="flex border-b border-espresso/15 text-[10px] uppercase font-bold tracking-widest text-taupe">
              {(['details', 'care', 'shipping'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveSection(tab)}
                  className={`flex-1 py-2 text-center border-b-2 transition-all ${
                    activeSection === tab 
                      ? 'border-terracotta text-espresso font-extrabold' 
                      : 'border-transparent hover:text-espresso'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Accordion panel content */}
            <div className="py-2.5 min-h-[90px] text-xs leading-relaxed text-espresso/75">
              {activeSection === 'details' && (
                <ul className="space-y-1.5 list-disc pl-4 text-espresso/80">
                  <li>Hypoallergenic surgical-grade stainless steel – perfect for sensitive skin.</li>
                  <li>Nickel-free, lead-free and chromium-safe alloy composition.</li>
                  <li>Deep vacuum 18k gold physical vapor deposition (PVD) – waterproof & sweat resistant.</li>
                  <li>Includes Zerish Luxe authentication certificate & microfiber cleaner cloth.</li>
                </ul>
              )}

              {activeSection === 'care' && (
                <div className="space-y-1.5">
                  <p>Our jewelry is engineered for maximum life, but a little care keeps it glowing forever:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Rinse with lukewarm fresh water after swimming in pool chlorine or sea salt.</li>
                    <li>Wipe clean using the provided Zerish microfiber buffer flannel.</li>
                    <li>Store inside the air-tight airtight Zerish pouch when not in wear.</li>
                    <li>Avoid spraying direct concentrated perfumes/colognes directly onto metallic joints.</li>
                  </ul>
                </div>
              )}

              {activeSection === 'shipping' && (
                <div className="space-y-2 flex items-start space-x-3 bg-linen/25 p-3 border border-espresso/5 rounded-xs">
                  <Truck className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-espresso">Express Dispatches & Tracking</p>
                    <p className="text-[11px] text-espresso/85 mt-0.5">
                      All collections are dispatched within 12 hours from our dedicated Kochi and Chennai hubs. Secure Blue Dart tracking numbers are shared instantly via SMS/Email. Free shipping on all pan-India orders above ₹1,500.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
