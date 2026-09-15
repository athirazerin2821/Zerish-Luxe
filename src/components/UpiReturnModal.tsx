import React, { useState } from 'react';
import { ShieldCheck, Check, AlertCircle, Smartphone, ArrowLeft, ExternalLink, HelpCircle, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface UpiReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  amount: number;
  selectedApp: string;
  onConfirmPayment: (utr: string, appUsed: string, viaWhatsApp?: boolean) => void;
  onReopenApp?: () => void;
}

export default function UpiReturnModal({
  isOpen,
  onClose,
  orderId,
  amount,
  selectedApp,
  onConfirmPayment,
  onReopenApp
}: UpiReturnModalProps) {
  const [utr, setUtr] = useState('');
  const [appUsed, setAppUsed] = useState(selectedApp || 'Google Pay');
  const [showManualUtr, setShowManualUtr] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleWhatsAppSlipClick = () => {
    // 1-Click WhatsApp confirmation - no 12-digit UTR required!
    onConfirmPayment('', appUsed, true);
  };

  const handleManualUtrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = utr.trim().replace(/\s+/g, '');
    if (!cleaned) {
      setError('Please enter the 12-digit UPI Transaction ID or UTR Reference number from your payment app receipt.');
      return;
    }
    if (cleaned.length < 8) {
      setError('UPI UTR numbers are typically 12 digits (at least 8 characters required).');
      return;
    }
    if (!/^[A-Za-z0-9-]+$/.test(cleaned)) {
      setError('Please enter a valid alphanumeric UPI Reference / UTR number.');
      return;
    }

    setError(null);
    onConfirmPayment(cleaned, appUsed, false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-espresso/80 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="bg-[#FAF8F6] w-full max-w-md p-6 rounded-xs border border-espresso/20 shadow-2xl relative z-10 animate-fade-in text-espresso">
        <div className="text-center pb-3 border-b border-espresso/10">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-xs">
            <Smartphone className="w-6 h-6" />
          </div>
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Welcome Back to Zerish Luxe
          </span>
          <h3 className="font-serif text-xl font-bold text-espresso mt-1">
            Confirm UPI Payment
          </h3>
          <p className="text-xs text-taupe mt-1">
            Did you complete your transfer of <strong className="text-espresso">₹{amount.toLocaleString('en-IN')}</strong> in {selectedApp || 'your UPI app'}?
          </p>
        </div>

        {/* Order amount highlight */}
        <div className="mt-3 p-2.5 bg-white border border-espresso/10 rounded-xs flex items-center justify-between text-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-taupe block">Order Number</span>
            <span className="font-mono font-bold text-espresso">#{orderId || 'PENDING'}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-taupe block">Amount Transferred</span>
            <span className="font-serif font-bold text-terracotta text-sm">₹{amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="mt-4 space-y-3.5">
          {/* App Used Selector */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-extrabold text-espresso mb-1">
              UPI App Used to Pay
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Cred', 'Other'].map((app) => (
                <button
                  key={app}
                  type="button"
                  onClick={() => {
                    setAppUsed(app);
                    if (error) setError(null);
                  }}
                  className={`py-1.5 px-1 text-[10px] font-bold rounded-xs border text-center transition-all cursor-pointer ${
                    appUsed === app 
                      ? 'bg-espresso text-white border-espresso shadow-2xs' 
                      : 'bg-white text-espresso/80 border-espresso/15 hover:border-espresso/40'
                  }`}
                >
                  {app}
                </button>
              ))}
            </div>
          </div>

          {/* PRIMARY 1-CLICK OPTION: WhatsApp Confirmation Slip */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-300/80 rounded-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>One-Click WhatsApp Confirmation</span>
              </span>
              <span className="text-[8px] uppercase tracking-wider font-extrabold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-full">
                No UTR Needed
              </span>
            </div>
            <p className="text-[11px] text-emerald-900 leading-snug">
              Creates your order instantly and opens WhatsApp with your pre-filled payment slip. You can attach your payment screenshot in the chat.
            </p>
            <button
              type="button"
              onClick={handleWhatsAppSlipClick}
              className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-widest font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send WhatsApp Confirmation Slip (1-Click)</span>
            </button>
          </div>

          {/* SECONDARY / OPTIONAL: Manual 12-digit UTR verification */}
          <div className="border-t border-espresso/10 pt-2">
            <button
              type="button"
              onClick={() => setShowManualUtr(!showManualUtr)}
              className="w-full text-left py-1 text-[11px] text-espresso/75 hover:text-espresso font-semibold flex items-center justify-between cursor-pointer"
            >
              <span>Or verify by entering 12-digit UTR instead</span>
              {showManualUtr ? <ChevronUp className="w-3.5 h-3.5 text-taupe" /> : <ChevronDown className="w-3.5 h-3.5 text-taupe" />}
            </button>

            {showManualUtr && (
              <form onSubmit={handleManualUtrSubmit} className="mt-2.5 space-y-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-espresso">
                      UPI Reference ID / UTR Number
                    </label>
                    <span className="text-[9px] text-taupe font-semibold">12 digits</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 428910293847"
                    value={utr}
                    onChange={(e) => {
                      setUtr(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full border border-espresso/25 p-2 text-xs bg-white font-mono tracking-wider focus:outline-hidden focus:border-espresso rounded-xs"
                    autoFocus
                  />
                  <p className="text-[10px] text-espresso/60 mt-1 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-taupe shrink-0" />
                    <span>Found in your {appUsed} receipt under "UPI Ref No." or "UTR".</span>
                  </p>
                </div>

                {error && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-xs flex items-center space-x-1.5 text-red-700 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-espresso hover:bg-terracotta text-white text-xs uppercase tracking-widest font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify with UTR Number</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Secondary options: Reopen app or Cancel */}
        <div className="mt-4 pt-3 border-t border-espresso/10 flex items-center justify-between text-[11px]">
          {onReopenApp && (
            <button
              type="button"
              onClick={onReopenApp}
              className="text-terracotta hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Reopen UPI App</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-taupe hover:text-espresso underline cursor-pointer ml-auto"
          >
            I haven't paid yet (Go Back)
          </button>
        </div>
      </div>
    </div>
  );
}
