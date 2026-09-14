import React, { useState, useEffect } from 'react';
import { QrCode, ShieldCheck, Image as ImageIcon, ExternalLink, Smartphone, ArrowRight } from 'lucide-react';
import { getCachedUpiSettings, buildUpiUrl } from '../utils/upi';

interface PaymentQRCodeProps {
  amount?: number;
  orderId?: string;
  customerName?: string;
  merchantName?: string;
  upiId?: string;
  note?: string;
  customQrImageUrl?: string;
  defaultMode?: 'direct' | 'qr';
  onPaymentConfirmed?: (transactionRef?: string) => void;
  onInitiateAppPayment?: (appName: string, upiUrl: string) => void;
}

const STORAGE_KEY = 'zerish_custom_qr_code';

export default function PaymentQRCode({
  amount,
  orderId,
  customerName,
  merchantName = 'Zerish Luxe',
  upiId: propUpiId,
  note = 'Order Payment',
  customQrImageUrl,
  defaultMode = 'direct',
  onPaymentConfirmed,
  onInitiateAppPayment
}: PaymentQRCodeProps) {
  const [customQr, setCustomQr] = useState<string>('');
  const [fallbackQrUrl, setFallbackQrUrl] = useState<string>('');
  const [activeMode, setActiveMode] = useState<'direct' | 'qr'>(defaultMode);
  const [activeUpiId, setActiveUpiId] = useState<string>(() => {
    return propUpiId || getCachedUpiSettings().upiId;
  });
  const [activeMerchant, setActiveMerchant] = useState<string>(() => {
    return merchantName || getCachedUpiSettings().merchantName;
  });

  // Sync with global UPI settings updates
  useEffect(() => {
    const handleUpiUpdated = () => {
      const current = getCachedUpiSettings();
      if (!propUpiId) {
        setActiveUpiId(current.upiId);
      }
      if (!merchantName || merchantName === 'Zerish Luxe') {
        setActiveMerchant(current.merchantName);
      }
    };

    window.addEventListener('zerish_upi_settings_updated', handleUpiUpdated);
    window.addEventListener('storage', handleUpiUpdated);
    return () => {
      window.removeEventListener('zerish_upi_settings_updated', handleUpiUpdated);
      window.removeEventListener('storage', handleUpiUpdated);
    };
  }, [propUpiId, merchantName]);

  // If prop changes, sync it
  useEffect(() => {
    if (propUpiId) {
      setActiveUpiId(propUpiId);
    }
  }, [propUpiId]);

  // Load custom QR code from prop or localStorage
  useEffect(() => {
    const loadQr = () => {
      if (customQrImageUrl) {
        setCustomQr(customQrImageUrl);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCustomQr(stored);
        } else {
          setCustomQr('');
        }
      }
    };

    loadQr();

    const handleQrUpdated = () => {
      loadQr();
    };

    window.addEventListener('custom_qr_code_updated', handleQrUpdated);
    window.addEventListener('storage', handleQrUpdated);
    return () => {
      window.removeEventListener('custom_qr_code_updated', handleQrUpdated);
      window.removeEventListener('storage', handleQrUpdated);
    };
  }, [customQrImageUrl]);

  const resolvedUpiUrl = buildUpiUrl({
    upiId: activeUpiId,
    merchantName: activeMerchant,
    amount,
    orderId,
    note
  });

  // Generate a fallback clean QR code if no custom image is uploaded yet
  useEffect(() => {
    if (!customQr) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(resolvedUpiUrl)}&color=2B1E1A&bgcolor=FAF8F6&margin=2`;
      setFallbackQrUrl(qrUrl);
    }
  }, [customQr, resolvedUpiUrl]);

  const displayImage = customQr || fallbackQrUrl;

  const handleAppPayClick = (appName: string, specificApp?: 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'generic') => {
    const directUrl = buildUpiUrl({
      upiId: activeUpiId,
      merchantName: activeMerchant,
      amount,
      orderId,
      note,
      app: specificApp || 'generic'
    });

    if (onInitiateAppPayment) {
      onInitiateAppPayment(appName, directUrl);
    } else {
      window.location.href = directUrl;
    }
  };

  return (
    <div className="bg-[#FAF8F6] border border-espresso/15 rounded-sm p-4 sm:p-5 text-espresso space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-espresso text-linen rounded-full flex items-center justify-center shadow-xs">
            {activeMode === 'direct' ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <QrCode className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-espresso leading-tight">UPI Payment</h4>
            <p className="text-[10px] text-taupe uppercase tracking-wider font-semibold">
              {activeMode === 'direct' ? 'Pay directly via UPI apps' : 'Scan QR code with your phone'}
            </p>
          </div>
        </div>
        {amount !== undefined && amount > 0 && (
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-taupe block">Payable Amount</span>
            <span className="font-serif text-base font-bold text-terracotta">₹{amount.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      {/* Payment Options Selection: Pay Directly via UPI OR QR Code */}
      <div className="space-y-1.5">
        <label className="block text-[9px] uppercase tracking-wider font-extrabold text-taupe text-left">
          Select Payment Option:
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveMode('direct')}
            className={`py-2.5 px-3 rounded-xs border text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeMode === 'direct'
                ? 'bg-espresso text-white border-espresso shadow-xs'
                : 'bg-white text-espresso border-espresso/20 hover:border-espresso/40 hover:bg-espresso/5'
            }`}
          >
            <Smartphone className={`w-4 h-4 ${activeMode === 'direct' ? 'text-white' : 'text-terracotta'}`} />
            <span className="truncate">Pay Directly via UPI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('qr')}
            className={`py-2.5 px-3 rounded-xs border text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeMode === 'qr'
                ? 'bg-espresso text-white border-espresso shadow-xs'
                : 'bg-white text-espresso border-espresso/20 hover:border-espresso/40 hover:bg-espresso/5'
            }`}
          >
            <QrCode className={`w-4 h-4 ${activeMode === 'qr' ? 'text-white' : 'text-espresso'}`} />
            <span className="truncate">QR Code</span>
          </button>
        </div>
      </div>

      {/* Option 1: Pay Directly via UPI */}
      {activeMode === 'direct' && (
        <div className="bg-white border border-espresso/10 p-3.5 rounded-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso">
              Select Your UPI App
            </span>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
              Direct App Launch
            </span>
          </div>
          <p className="text-[11px] text-espresso/70 text-left">
            Tap your preferred UPI app below to open it with prefilled amount (₹{amount ? amount.toLocaleString('en-IN') : ''}):
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleAppPayClick('Google Pay', 'gpay')}
              className="py-2.5 px-2 bg-[#FAF8F6] hover:bg-espresso hover:text-white border border-espresso/15 rounded-xs text-[11px] font-bold text-espresso transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs group"
            >
              <span>Google Pay</span>
              <ArrowRight className="w-3 h-3 text-taupe group-hover:text-white transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => handleAppPayClick('PhonePe', 'phonepe')}
              className="py-2.5 px-2 bg-[#FAF8F6] hover:bg-espresso hover:text-white border border-espresso/15 rounded-xs text-[11px] font-bold text-espresso transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs group"
            >
              <span>PhonePe</span>
              <ArrowRight className="w-3 h-3 text-taupe group-hover:text-white transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => handleAppPayClick('Paytm', 'paytm')}
              className="py-2.5 px-2 bg-[#FAF8F6] hover:bg-espresso hover:text-white border border-espresso/15 rounded-xs text-[11px] font-bold text-espresso transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs group"
            >
              <span>Paytm</span>
              <ArrowRight className="w-3 h-3 text-taupe group-hover:text-white transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => handleAppPayClick('UPI App', 'generic')}
              className="py-2.5 px-2 bg-espresso hover:bg-terracotta text-white rounded-xs text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <span>Any UPI App</span>
              <ExternalLink className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Option 2: QR Code */}
      {activeMode === 'qr' && (
        <div className="flex flex-col items-center justify-center p-4 bg-white border border-espresso/10 rounded-xs shadow-2xs">
          <div className="relative p-2.5 bg-[#FAF8F6] border border-espresso/10 rounded-sm flex items-center justify-center">
            {displayImage ? (
              <img 
                src={displayImage} 
                alt="Payment QR Code" 
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xs"
                onError={(e) => {
                  const target = e.currentTarget;
                  const backupUrl = `https://quickchart.io/qr?text=${encodeURIComponent(resolvedUpiUrl)}&size=300&dark=2b1e1a&light=faf8f6&margin=2`;
                  if (target.src !== backupUrl) {
                    target.src = backupUrl;
                  }
                }}
              />
            ) : (
              <div className="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center text-taupe text-xs p-4 text-center space-y-2">
                <ImageIcon className="w-8 h-8 text-taupe/50" />
                <p>No QR Code uploaded yet.</p>
              </div>
            )}
          </div>

          {/* Accepted Payment Apps Badges */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 mt-3">
            {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Cred', 'Amazon Pay'].map((app) => (
              <span 
                key={app}
                className="px-2 py-0.5 bg-espresso/5 border border-espresso/10 rounded-full text-[9px] font-bold text-espresso/80"
              >
                {app}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Security note */}
      <div className="flex items-center space-x-1.5 text-[9px] text-taupe/90 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
        <span>100% Direct to Bank UPI Transfer. Zero surcharge or extra gateway fees.</span>
      </div>
    </div>
  );
}
