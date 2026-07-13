import React, { useState } from 'react';
import { X, Search, Truck, MapPin, CheckCircle, Clock } from 'lucide-react';
import { Order } from '../types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export default function TrackOrderModal({ isOpen, onClose, orders }: TrackOrderModalProps) {
  const [trackingId, setTrackingId] = useState('');
  const [searchResult, setSearchResult] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    const cleanId = trackingId.trim();
    try {
      const res = await fetch(`/api/customer/orders/${encodeURIComponent(cleanId)}`);
      if (res.ok) {
        const found = await res.json();
        setSearchResult(found);
      } else {
        setSearchResult(null);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setSearchResult(null);
    }
    setHasSearched(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-espresso/70 backdrop-blur-xs"
      ></div>

      {/* Box */}
      <div className="bg-[#FAF8F6] w-full max-w-lg p-6 sm:p-8 rounded-sm border border-espresso/15 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-espresso hover:bg-espresso hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <Truck className="w-8 h-8 text-terracotta mx-auto mb-2" />
          <h3 className="font-serif text-2xl font-semibold text-espresso">Track Your Curation</h3>
          <p className="text-xs text-taupe uppercase tracking-widest mt-1">Zerish Luxe Transit Tracker</p>
        </div>

        {/* Form */}
        <form onSubmit={handleTrack} className="space-y-3 mb-6">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-espresso mb-1">
              Tracking Number or Order ID
            </label>
            <div className="relative">
              <input 
                type="text" 
                required
                placeholder="e.g., ZL-4921 or Order ID"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full border border-espresso/20 py-2.5 pl-3 pr-10 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden uppercase tracking-wider"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-espresso hover:text-terracotta transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-taupe mt-1">
              Tip: Your tracking number was displayed during checkout (e.g., ZL-1011).
            </p>
          </div>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div className="border-t border-espresso/10 pt-4 space-y-4">
            {searchResult ? (
              <div className="space-y-4">
                
                {/* Meta Summary Header */}
                <div className="bg-linen/20 p-3 rounded-xs flex items-center justify-between border border-espresso/5">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-taupe">Tracking Reference</p>
                    <p className="text-xs font-bold text-espresso">{searchResult.trackingNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-wider text-taupe">Recipient</p>
                    <p className="text-xs font-semibold text-espresso">{searchResult.customerName}</p>
                  </div>
                </div>

                {/* Verified Payment Status Alert */}
                <div className={`p-3 text-[10px] font-extrabold uppercase tracking-widest text-center border rounded-xs transition-all ${
                  searchResult.isPaid 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60' 
                    : 'bg-amber-50 text-amber-800 border-amber-200/60'
                }`}>
                  {searchResult.isPaid 
                    ? '✨ Verified Payment Confirmed by Merchant ✓' 
                    : '⏳ Payment Verification Pending (Scan UPI to Complete)'}
                </div>

                {/* Tracking Progress Stepper */}
                <div className="space-y-6 pl-4 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-espresso/10">
                  
                  {/* Step 4: Delivered */}
                  <div className="relative flex items-start space-x-3.5">
                    <div className={`w-3.5 h-3.5 rounded-full z-10 -ml-1 border-2 flex items-center justify-center ${
                      searchResult.status === 'Delivered' 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'bg-white border-espresso/25'
                    }`}>
                      {searchResult.status === 'Delivered' && <div className="w-1 h-1 rounded-full bg-white" />}
                    </div>
                    <div className="space-y-0.5">
                      <p className={`text-xs font-bold ${searchResult.status === 'Delivered' ? 'text-espresso' : 'text-espresso/45'}`}>
                        Delivered
                      </p>
                      <p className="text-[10px] text-taupe leading-relaxed">
                        Received by customer in {searchResult.city}, {searchResult.state}. Hand-finished collection package intact.
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Out for Delivery */}
                  <div className="relative flex items-start space-x-3.5">
                    <div className={`w-3.5 h-3.5 rounded-full z-10 -ml-1 border-2 flex items-center justify-center ${
                      searchResult.status === 'Delivered' || searchResult.status === 'Dispatched'
                        ? 'bg-terracotta border-terracotta' 
                        : 'bg-white border-espresso/25'
                    }`}>
                      {(searchResult.status === 'Delivered' || searchResult.status === 'Dispatched') && <div className="w-1 h-1 rounded-full bg-white" />}
                    </div>
                    <div className="space-y-0.5">
                      <p className={`text-xs font-bold ${searchResult.status === 'Delivered' || searchResult.status === 'Dispatched' ? 'text-espresso' : 'text-espresso/45'}`}>
                        Dispatched with Blue Dart Courier
                      </p>
                      <p className="text-[10px] text-taupe leading-relaxed">
                        Handed over to high-security express courier partners. Live tracker tracking link activated.
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Shipped from Fulfilment Hub */}
                  <div className="relative flex items-start space-x-3.5">
                    <div className="w-3.5 h-3.5 rounded-full z-10 -ml-1 border-2 bg-terracotta border-terracotta flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-white" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-espresso">
                        Dispatched from Southern Hub
                      </p>
                      <p className="text-[10px] text-taupe leading-relaxed">
                        Dispatched and vacuum-sealed at Kochi/Chennai logistics division. Air-freighted directly.
                      </p>
                    </div>
                  </div>

                  {/* Step 1: Order Registered */}
                  <div className="relative flex items-start space-x-3.5">
                    <div className="w-3.5 h-3.5 rounded-full z-10 -ml-1 border-2 bg-terracotta border-terracotta flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-white" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-espresso">
                        Order Received & Packed
                      </p>
                      <p className="text-[10px] text-taupe leading-relaxed">
                        Order processed on {searchResult.date}. Handpicked with love and packaged in anti-tarnish protective pouches.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Expected Delivery details */}
                <div className="p-4 bg-espresso text-[#FAF8F6] text-[11px] leading-relaxed rounded-xs space-y-1">
                  <p className="font-semibold uppercase tracking-wider text-[10px] flex items-center space-x-1.5 text-linen">
                    <Clock className="w-3.5 h-3.5 text-terracotta" />
                    <span>Luxe Fast Delivery Policy</span>
                  </p>
                  <p className="text-linen/80">
                    We process orders within 12 hours. Express deliveries to Southern destinations like Kochi, Chennai, Bangalore, and Coimbatore typically take 24–48 hours.
                  </p>
                </div>

              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-rose-600 font-bold mb-1">Tracking Code Not Found</p>
                <p className="text-xs text-espresso/70 leading-normal max-w-sm mx-auto">
                  We could not find tracking records for "{trackingId}". Double-check your code, or enter any temporary mockup code starting with <strong className="text-espresso">ZL-1011</strong> for demo purposes.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
