import React, { useState } from 'react';
import { X, QrCode, Sparkles, CheckCircle2, Phone, ShieldCheck, HeartHandshake, AlertCircle, Check, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [modalUtr, setModalUtr] = useState<string>('');
  const [modalApp, setModalApp] = useState<string>('Google Pay');
  const [modalConfirmed, setModalConfirmed] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [showManualUtrInModal, setShowManualUtrInModal] = useState<boolean>(false);

  const handleWhatsAppSlipInModal = () => {
    const app = modalApp || 'Google Pay';
    const amountStr = activeAmount ? `₹${activeAmount.toLocaleString('en-IN')}` : 'Custom Amount';
    const msg = `Hi Zerish Luxe! I have initiated a payment of *${amountStr}* using ${app}.\n\n` +
      (orderId ? `*Order ID:* ${orderId}\n` : '') +
      `*App Used:* ${app}\n` +
      `*Status:* Payment Completed\n\n` +
      `I have attached my payment screenshot for your quick confirmation. Please verify!`;
    const url = `https://wa.me/919916026262?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    if (onPaymentComplete) {
      onPaymentComplete(`WA-SLIP-${app.toUpperCase().replace(/\s+/g, '')}-${Date.now().toString().slice(-6)}`);
    }
  };

  // Sync if initialAmount changes when opening
  React.useEffect(() => {
    if (initialAmount) {
      setActiveAmount(initialAmount);
      setCustomAmount(String(initialAmount));
    }
    if (isOpen) {
      setModalUtr('');
      setModalConfirmed(false);
      setModalError(null);
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

  const handleModalConfirmPayment = () => {
    const cleaned = modalUtr.trim().replace(/\s+/g, '');
    if (!cleaned) {
      setModalError('Please enter the 12-digit UPI Transaction ID or UTR Reference number from your payment app.');
      return;
    }
    if (cleaned.length < 8) {
      setModalError('UPI UTR numbers are typically 12 digits (at least 8 characters required).');
      return;
    }
    if (!/^[A-Za-z0-9-]+$/.test(cleaned)) {
      setModalError('Please enter a valid alphanumeric UPI Reference / UTR number.');
      return;
    }
    if (!modalConfirmed) {
      setModalError('Please confirm that you have completed the payment by checking the box.');
      return;
    }

    setModalError(null);
    const ref = `${modalApp.toUpperCase().replace(/\s+/g, '')}-${cleaned.toUpperCase()}`;
    if (onPaymentComplete) {
      onPaymentComplete(ref);
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
            <span>UPI Payment</span>
          </div>
          <h3 className="font-serif text-2xl font-normal text-espresso">UPI Payment</h3>
          <p className="text-xs text-taupe mt-1 max-w-xs mx-auto">
            Choose to pay directly via your UPI app or scan the QR code.
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
            Update Amount
          </button>
        </form>

        {/* Dynamic Payment QR Code Box */}
        <PaymentQRCode
          amount={activeAmount}
          orderId={orderId || "DIRECT-PAY"}
          merchantName="Zerish Luxe Fine Jewellery"
          note={orderId ? `Zerish Luxe Order ${orderId}` : "Zerish Luxe Fine Jewellery Payment"}
          customQrImageUrl={customQrImageUrl}
          onInitiateAppPayment={(appName, url) => {
            setModalApp(appName);
            window.location.href = url;
          }}
          onPaymentConfirmed={(ref) => {
            if (onPaymentComplete) {
              onPaymentComplete(ref);
            }
          }}
        />

        {/* Verification and Confirm Payment if callback provided */}
        {onPaymentComplete && (
          <div className="mt-4 bg-white border border-espresso/15 rounded-xs p-4 text-left space-y-3 shadow-2xs">
            <div className="border-b border-espresso/10 pb-2">
              <div className="flex items-center space-x-1.5 text-espresso font-serif text-sm font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verify & Confirm Payment</span>
              </div>
              <p className="text-[11px] text-espresso/70 mt-0.5">
                After completing your payment, confirm below with 1-click WhatsApp slip or enter your 12-digit UTR.
              </p>
            </div>

            {/* App selection */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-espresso mb-1">
                UPI App Used
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Cred', 'Other'].map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => {
                      setModalApp(app);
                      if (modalError) setModalError(null);
                    }}
                    className={`py-1.5 px-1 text-[10px] font-bold rounded-xs border transition-all cursor-pointer text-center ${
                      modalApp === app 
                        ? 'bg-espresso text-white border-espresso' 
                        : 'bg-[#FAF8F6] text-espresso/80 border-espresso/15 hover:border-espresso/40'
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
                Opens WhatsApp with your pre-filled payment slip. Attach your payment screenshot for immediate verification.
              </p>
              <button
                type="button"
                onClick={handleWhatsAppSlipInModal}
                className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-widest font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Confirmation Slip (1-Click)</span>
              </button>
            </div>

            {/* SECONDARY / OPTIONAL: Manual 12-digit UTR */}
            <div className="border-t border-espresso/10 pt-2">
              <button
                type="button"
                onClick={() => setShowManualUtrInModal(!showManualUtrInModal)}
                className="w-full text-left py-1 text-[11px] text-espresso/70 hover:text-espresso font-semibold flex items-center justify-between cursor-pointer"
              >
                <span>Or verify with 12-digit UPI UTR instead (Optional)</span>
                {showManualUtrInModal ? <ChevronUp className="w-3.5 h-3.5 text-taupe" /> : <ChevronDown className="w-3.5 h-3.5 text-taupe" />}
              </button>

              {showManualUtrInModal && (
                <div className="mt-2.5 space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold text-espresso">
                        UPI Transaction ID / UTR Number
                      </label>
                      <span className="text-[9px] text-taupe font-semibold">12 digits</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 428910293847"
                      value={modalUtr}
                      onChange={(e) => {
                        setModalUtr(e.target.value);
                        if (modalError) setModalError(null);
                      }}
                      className="w-full border border-espresso/25 p-2 text-xs bg-[#FAF8F6] font-mono tracking-wider focus:outline-hidden focus:bg-white rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="flex items-start space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={modalConfirmed}
                        onChange={(e) => {
                          setModalConfirmed(e.target.checked);
                          if (modalError) setModalError(null);
                        }}
                        className="mt-0.5 h-3.5 w-3.5 rounded-xs border-espresso/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-[11px] text-espresso/85 leading-snug">
                        I confirm that I transferred {activeAmount ? `₹${activeAmount.toLocaleString('en-IN')}` : 'the payment'} to Zerish Luxe UPI.
                      </span>
                    </label>
                  </div>

                  {modalError && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-xs flex items-center space-x-1.5 text-red-700 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{modalError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleModalConfirmPayment}
                    className="w-full py-2.5 bg-espresso hover:bg-terracotta text-white text-xs uppercase tracking-widest font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Verify with UTR {activeAmount ? `(₹${activeAmount.toLocaleString('en-IN')})` : ''}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

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
