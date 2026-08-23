import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles, 
  Droplets, 
  Truck, 
  Heart, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  Award
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

// Helper to ensure ultra-clear crisp high-resolution images when viewing & zooming
export function getHighResolutionImageUrl(url: string, targetWidth = 2400): string {
  if (!url) return url;
  if (url.includes('images.unsplash.com')) {
    let highRes = url;
    if (/[?&]w=\d+/.test(highRes)) {
      highRes = highRes.replace(/([?&])w=\d+/, `$1w=${targetWidth}`);
    } else {
      highRes += `${highRes.includes('?') ? '&' : '?'}w=${targetWidth}`;
    }
    if (/[?&]q=\d+/.test(highRes)) {
      highRes = highRes.replace(/([?&])q=\d+/, '$1q=95');
    } else {
      highRes += '&q=95';
    }
    if (!highRes.includes('auto=format')) {
      highRes += '&auto=format';
    }
    if (!highRes.includes('fit=crop')) {
      highRes += '&fit=crop';
    }
    return highRes;
  }
  return url;
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

  // Preload high-resolution versions into browser cache for instant crispness
  useEffect(() => {
    imageList.forEach(url => {
      if (url) {
        const img = new Image();
        img.src = getHighResolutionImageUrl(url, 2400);
      }
    });
  }, [imageList]);

  // Fullscreen Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImgIdx, setLightboxImgIdx] = useState(0);
  const [lightboxZoomScale, setLightboxZoomScale] = useState(1);
  const [lightboxPanOffset, setLightboxPanOffset] = useState({ x: 0, y: 0 });
  const isLightboxPanning = useRef(false);
  const lightboxPanStart = useRef({ x: 0, y: 0 });

  const handleLightboxZoomIn = () => {
    setLightboxZoomScale(prev => Math.min(prev + 0.5, 4));
  };

  const handleLightboxZoomOut = () => {
    setLightboxZoomScale(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) {
        setLightboxPanOffset({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleLightboxZoomReset = () => {
    setLightboxZoomScale(1);
    setLightboxPanOffset({ x: 0, y: 0 });
  };

  const handleLightboxPanStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (lightboxZoomScale <= 1) return;
    isLightboxPanning.current = true;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    lightboxPanStart.current = {
      x: clientX - lightboxPanOffset.x,
      y: clientY - lightboxPanOffset.y
    };
  };

  const handleLightboxPanMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isLightboxPanning.current || lightboxZoomScale <= 1) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - lightboxPanStart.current.x;
    const newY = clientY - lightboxPanStart.current.y;
    
    const maxBoundX = (lightboxZoomScale - 1) * 350;
    const maxBoundY = (lightboxZoomScale - 1) * 350;
    
    setLightboxPanOffset({
      x: Math.max(-maxBoundX, Math.min(maxBoundX, newX)),
      y: Math.max(-maxBoundY, Math.min(maxBoundY, newY))
    });
  };

  const handleLightboxPanEnd = () => {
    isLightboxPanning.current = false;
  };

  const handlePrevLightboxImg = () => {
    setLightboxImgIdx(prev => {
      const nextIdx = prev === 0 ? imageList.length - 1 : prev - 1;
      handleLightboxZoomReset();
      return nextIdx;
    });
  };

  const handleNextLightboxImg = () => {
    setLightboxImgIdx(prev => {
      const nextIdx = prev === imageList.length - 1 ? 0 : prev + 1;
      handleLightboxZoomReset();
      return nextIdx;
    });
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    handleLightboxZoomReset();
  };

  // Keyboard listeners for Lightbox Navigation
  useEffect(() => {
    if (!isLightboxOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseLightbox();
      } else if (e.key === 'ArrowLeft') {
        handlePrevLightboxImg();
      } else if (e.key === 'ArrowRight') {
        handleNextLightboxImg();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, lightboxImgIdx]);

  // Main Card Zoom State
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoomScale(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) {
        setPanOffset({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleZoomReset = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handlePanStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (zoomScale <= 1) return;
    isPanning.current = true;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    panStart.current = {
      x: clientX - panOffset.x,
      y: clientY - panOffset.y
    };
  };

  const handlePanMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isPanning.current || zoomScale <= 1) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - panStart.current.x;
    const newY = clientY - panStart.current.y;
    
    // Bounds restriction based on zoom level to prevent dragging too far off-screen
    const maxBoundX = (zoomScale - 1) * 220;
    const maxBoundY = (zoomScale - 1) * 220;
    
    setPanOffset({
      x: Math.max(-maxBoundX, Math.min(maxBoundX, newX)),
      y: Math.max(-maxBoundY, Math.min(maxBoundY, newY))
    });
  };

  const handlePanEnd = () => {
    isPanning.current = false;
  };

  // Mouse wheel zoom over the image container
  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < 0) {
      setZoomScale(prev => Math.min(prev + 0.3, 4));
    } else if (e.deltaY > 0) {
      setZoomScale(prev => {
        const next = Math.max(prev - 0.3, 1);
        if (next === 1) setPanOffset({ x: 0, y: 0 });
        return next;
      });
    }
  };

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

  const inWishlist = wishlist.includes(product.id);

  return (
    <>
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
          <div 
            onWheel={handleWheelZoom}
            className="relative aspect-square bg-[#FAF8F6] border border-espresso/10 overflow-hidden rounded-sm select-none"
          >
            {/* Interactive Zoom and Pan Board */}
            <div 
              onClick={() => {
                if (zoomScale <= 1) {
                  setIsLightboxOpen(true);
                  setLightboxImgIdx(activeImgIdx);
                }
              }}
              onMouseDown={handlePanStart}
              onMouseMove={handlePanMove}
              onMouseUp={handlePanEnd}
              onMouseLeave={handlePanEnd}
              onTouchStart={handlePanStart}
              onTouchMove={handlePanMove}
              onTouchEnd={handlePanEnd}
              onDoubleClick={() => zoomScale > 1 ? handleZoomReset() : setZoomScale(2.5)}
              className="relative w-full h-full overflow-hidden flex items-center justify-center group/img"
              style={{ cursor: zoomScale > 1 ? 'grab' : 'zoom-in' }}
            >
              {/* High-Resolution Primary Image */}
              <img 
                src={getHighResolutionImageUrl(imageList[activeImgIdx], 2400)} 
                alt={product.name} 
                className="w-full h-full object-cover rounded-sm pointer-events-none"
                style={{
                  transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomScale})`,
                  transformOrigin: 'center center',
                  transition: isPanning.current ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  imageRendering: 'auto',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  willChange: zoomScale > 1 ? 'transform' : 'auto'
                }}
                referrerPolicy="no-referrer"
              />

              {zoomScale > 1 && (
                <div className="absolute inset-x-0 bottom-14 text-center pointer-events-none z-10">
                  <span className="bg-espresso/85 text-[#FAF8F6] text-[8px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full backdrop-blur-xs shadow-md animate-pulse">
                    Drag or swipe to explore details
                  </span>
                </div>
              )}

              {/* Hover prompt overlay when not zoomed */}
              {zoomScale === 1 && (
                <div className="absolute inset-0 bg-espresso/5 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-espresso/85 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-2 rounded-xs flex items-center gap-1.5 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Click for Ultra HD Fullscreen
                  </span>
                </div>
              )}
            </div>

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

            {/* Float Zoom Controls */}
            <div className="absolute bottom-3 left-3 flex items-center space-x-1 z-10 bg-white/95 backdrop-blur-xs border border-espresso/15 p-1 rounded-sm shadow-md">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                disabled={zoomScale <= 1}
                className="p-1 text-espresso hover:text-terracotta disabled:opacity-30 disabled:hover:text-espresso transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[9px] font-mono font-bold text-espresso px-1 min-w-[32px] text-center">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                disabled={zoomScale >= 4}
                className="p-1 text-espresso hover:text-terracotta disabled:opacity-30 disabled:hover:text-espresso transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {zoomScale > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomReset();
                  }}
                  className="p-1 text-[8px] uppercase tracking-wider font-extrabold text-terracotta hover:bg-espresso hover:text-white px-1.5 py-0.5 rounded-xs transition-all ml-0.5 cursor-pointer flex items-center gap-0.5"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  Reset
                </button>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
                setLightboxImgIdx(activeImgIdx);
              }}
              className="absolute bottom-3 right-3 z-10 bg-white/95 hover:bg-espresso hover:text-[#FAF8F6] text-espresso border border-espresso/15 px-2.5 py-1.5 rounded-sm shadow-md flex items-center space-x-1.5 transition-all text-[9px] uppercase tracking-wider font-extrabold cursor-pointer"
              title="Open Fullscreen View"
            >
              <Maximize2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Fullscreen</span>
            </button>

            {/* Wishlist button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
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
                  handleZoomReset();
                }}
                className={`w-14 h-14 border rounded-sm overflow-hidden flex-shrink-0 transition-all ${
                  activeImgIdx === index
                    ? 'border-terracotta ring-1 ring-terracotta'
                    : 'border-espresso/15 hover:opacity-100 opacity-70'
                }`}
              >
                <img 
                  src={getHighResolutionImageUrl(url, 400)} 
                  alt={`${product.name} thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          {/* Feature Badges */}
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
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg line-through text-espresso/45 font-medium">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-espresso/75 leading-relaxed pt-2 border-t border-espresso/5">
              {product.description}
            </p>
          </div>

          {/* Bundle Add - Complete the Look */}
          {bundleItem && (
            <div className="bg-[#FAF8F6] border border-espresso/15 p-3 sm:p-4 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest text-terracotta font-extrabold flex items-center space-x-1.5">
                  <Award className="w-4 h-4" />
                  <span>COMPLETE THE LOOK & UNLOCK FREE SHIPPING</span>
                </p>
                <span className="text-[9px] text-white bg-terracotta px-2 py-0.5 uppercase tracking-wider font-extrabold">Exclusive Bundle</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 bg-linen border border-espresso/5 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={getHighResolutionImageUrl(bundleItem.imageUrl, 300)} alt={bundleItem.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-wider text-taupe">Add matching piece</p>
                    <p className="font-serif text-xs font-bold text-espresso truncate">{bundleItem.name}</p>
                    <p className="text-xs font-semibold text-espresso flex items-center gap-1.5">
                      <span>₹{bundleItem.price.toLocaleString('en-IN')}</span>
                      {bundleItem.originalPrice && bundleItem.originalPrice > bundleItem.price && (
                        <span className="line-through text-[10px] text-espresso/45 font-normal">₹{bundleItem.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </p>
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

          {/* Clean Shipping & Delivery Information Banner (Care Tips section completely removed) */}
          <div className="border-t border-espresso/15 pt-3">
            <div className="flex items-start space-x-3 bg-linen/25 p-3 border border-espresso/5 rounded-xs">
              <Truck className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-espresso text-xs">Express Dispatches & Live Courier Tracking</p>
                <p className="text-[11px] text-espresso/80 mt-0.5 leading-relaxed">
                  All orders are packaged in protective velvet pouches and dispatched within 12 hours from our dedicated fulfillment hubs. Real-time tracking numbers are shared immediately. Free shipping on orders above ₹1,500.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    {/* FULLSCREEN LIGHTBOX MODAL WITH ULTRA HD RENDERING */}
    {isLightboxOpen && (
      <div className="fixed inset-0 z-[100] bg-espresso/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200">
        {/* Header Controls */}
        <div className="flex items-center justify-between w-full text-white/90 px-2 pt-2">
          <div>
            <span className="font-serif text-sm font-semibold tracking-wide block">
              {product.name}
            </span>
            <span className="text-[10px] text-[#FAF8F6]/60 block tracking-wider font-mono uppercase">
              Image {lightboxImgIdx + 1} of {imageList.length} • Ultra HD 2400px
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Lightbox Zoom Indicator / Controls */}
            <div className="flex items-center bg-white/10 border border-white/10 p-1 rounded-sm text-xs">
              <button
                type="button"
                onClick={handleLightboxZoomOut}
                disabled={lightboxZoomScale <= 1}
                className="p-1 hover:text-terracotta disabled:opacity-30 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono px-2 font-bold min-w-[36px] text-center">
                {Math.round(lightboxZoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={handleLightboxZoomIn}
                disabled={lightboxZoomScale >= 4}
                className="p-1 hover:text-terracotta disabled:opacity-30 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {lightboxZoomScale > 1 && (
                <button
                  type="button"
                  onClick={handleLightboxZoomReset}
                  className="p-1 text-[9px] uppercase font-bold text-terracotta hover:text-white px-1.5 transition-colors cursor-pointer"
                  title="Reset Zoom"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Close Button */}
            <button 
              onClick={handleCloseLightbox}
              className="p-2 bg-white/10 hover:bg-terracotta hover:text-white rounded-full transition-all text-white cursor-pointer"
              title="Close Fullscreen (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Large Visual Stage */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
          {/* Left Nav Button */}
          {imageList.length > 1 && (
            <button
              onClick={handlePrevLightboxImg}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-terracotta text-white hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
              title="Previous Image (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Middle Zoomable Image Container */}
          <div 
            onMouseDown={handleLightboxPanStart}
            onMouseMove={handleLightboxPanMove}
            onMouseUp={handleLightboxPanEnd}
            onMouseLeave={handleLightboxPanEnd}
            onTouchStart={handleLightboxPanStart}
            onTouchMove={handleLightboxPanMove}
            onTouchEnd={handleLightboxPanEnd}
            onDoubleClick={() => lightboxZoomScale > 1 ? handleLightboxZoomReset() : setLightboxZoomScale(2.5)}
            className="relative w-full h-full max-w-4xl max-h-[75vh] flex items-center justify-center overflow-hidden"
            style={{ cursor: lightboxZoomScale > 1 ? 'grab' : 'zoom-in' }}
          >
            <img 
              src={getHighResolutionImageUrl(imageList[lightboxImgIdx], 2400)} 
              alt={`${product.name} large view`} 
              className="max-w-full max-h-full object-contain pointer-events-none"
              style={{
                transform: `translate3d(${lightboxPanOffset.x}px, ${lightboxPanOffset.y}px, 0) scale(${lightboxZoomScale})`,
                transformOrigin: 'center center',
                transition: isLightboxPanning.current ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                imageRendering: 'auto',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                willChange: 'transform'
              }}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right Nav Button */}
          {imageList.length > 1 && (
            <button
              onClick={handleNextLightboxImg}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-terracotta text-white hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
              title="Next Image (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Footer Thumbnails list */}
        <div className="flex flex-col items-center space-y-3 pb-2">
          {imageList.length > 1 && (
            <div className="flex items-center justify-center space-x-2 overflow-x-auto max-w-full py-2 px-4 scrollbar-thin">
              {imageList.map((url, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setLightboxImgIdx(index);
                    handleLightboxZoomReset();
                  }}
                  className={`w-12 h-12 border rounded-sm overflow-hidden flex-shrink-0 transition-all ${
                    lightboxImgIdx === index
                      ? 'border-terracotta ring-1 ring-terracotta scale-105'
                      : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={getHighResolutionImageUrl(url, 400)} 
                    alt={`Thumb ${index + 1}`} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
          
          <div className="text-[10px] text-[#FAF8F6]/50 uppercase tracking-widest font-semibold flex items-center space-x-2">
            <span>Scroll Wheel or Double-click to Zoom</span>
            <span>•</span>
            <span>Drag or Swipe to Pan</span>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
