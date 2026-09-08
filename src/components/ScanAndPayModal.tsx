import React, { useState } from 'react';
import { X, QrCode, Sparkles, CheckCircle2, Phone, ShieldCheck, HeartHandshake } from 'lucide-react';
import PaymentQRCode from './PaymentQRCode';

interface ScanAndPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  orderId?: string;
  customQrImageUrl?: string;
  onPaymentComplete?: (transactionRef?: string) => void;
}

export default function ScanAndPayModal({ 
  isOpen, 
  onClose,
  initialAmount,
  orderId,
  customQrImageUrl,
  onPaymentComplete
}: ScanAndPayModalProps) {
  const [customAmount, setCustomAmount] = useState<string>(initialAmount ? String(initialAmount) : '');
  const [activeAmount, setActiveAmount] = useState<number | undefined>(initialAmount);

  // Sync if initialAmount changes when opening
  React.useEffect(() => {
    if (initialAmount) {
      setActiveAmount(initialAmount);
      setCustomAmount(String(initialAmount));
    }
  }, [initialAmount, isOpen]);

  if (!isOpen) return null;

  const handleAmountApply = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(customAmount);
    if (!isNaN(val) && val > 0) {
      setActiveAmount(val);
    } else {
      setActiveAmount(undefined);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-espresso/70 backdrop-blur-xs transition-opacity"
      />

      {/* Dialog Container */}
      <div className="bg-[#FAF8F6] w-full max-w-lg p-6 sm:p-7 rounded-xs border border-espresso/15 shadow-2xl relative z-10 max-h-[92vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-espresso/70 hover:bg-espresso hover:text-white transition-colors cursor-pointer"
          aria-label="Close QR Code Payment modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center space-x-1.5 bg-terracotta/10 text-terracotta px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-extrabold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Scan & Pay via UPI</span>
          </div>
          <h3 className="font-serif text-2xl font-normal text-espresso">Scan & Pay via UPI</h3>
          <p className="text-xs text-taupe mt-1 max-w-xs mx-auto">
            Scan with any UPI app on your phone (Google Pay, PhonePe, Paytm, BHIM, Cred) for instant direct payment.
          </p>
        </div>

        {/* Optional Custom Amount Input for Direct Payment */}
        <form onSubmit={handleAmountApply} className="mb-4 bg-white border border-espresso/10 p-3 rounded-xs flex items-center space-x-2">
          <div className="flex-1">
            <label className="block text-[8px] uppercase tracking-wider font-extrabold text-taupe mb-0.5">
              Enter Amount to Pay (₹)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-espresso">₹</span>
              <input
                type="number"
                min="1"
                placeholder="Custom Amount (optional)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full border border-espresso/15 pl-6 pr-2 py-1.5 text-xs text-espresso focus:outline-hidden focus:border-terracotta font-semibold"
              />
            </div>
          </div>
          <button
            type="submit"
            className="self-end px-3 py-1.5 bg-espresso hover:bg-terracotta text-white rounded-xs text-[9px] uppercase tracking-widest font-extrabold transition-colors cursor-pointer"
          >
            Update QR
          </button>
        </form>

        {/* Dynamic Payment QR Code Box */}
        <PaymentQRCode
          amount={activeAmount}
          orderId={orderId || "DIRECT-PAY"}
          merchantName="Zerish Luxe Fine Jewellery"
          note={orderId ? `Zerish Luxe Order ${orderId}` : "Zerish Luxe Fine Jewellery Payment"}
          customQrImageUrl={customQrImageUrl}
          onPaymentConfirmed={(ref) => {
            if (onPaymentComplete) {
              onPaymentComplete(ref);
            }
          }}
        />

        {/* Assistance Information */}
        <div className="mt-4 pt-3 border-t border-espresso/10 flex items-center justify-between text-[10px] text-taupe font-medium">
          <div className="flex items-center space-x-1">
            <HeartHandshake className="w-3.5 h-3.5 text-terracotta" />
            <span>Need billing assistance?</span>
          </div>
          <a
            href="https://wa.me/919916026262?text=Hi%20Zerish%20Luxe!%20I%20am%20making%20a%20payment%20via%20QR%20code%20and%20need%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="text-espresso font-bold hover:text-terracotta underline flex items-center space-x-1"
          >
            <Phone className="w-3 h-3" />
            <span>WhatsApp +91 99160 26262</span>
          </a>
        </div>
      </div>
    </div>
  );
}
