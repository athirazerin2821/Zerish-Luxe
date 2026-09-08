import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, ShieldCheck, Image as ImageIcon } from 'lucide-react';

interface PaymentQRCodeProps {
  amount?: number;
  orderId?: string;
  customerName?: string;
  merchantName?: string;
  note?: string;
  customQrImageUrl?: string;
  onPaymentConfirmed?: (transactionRef?: string) => void;
}

const STORAGE_KEY = 'zerish_custom_qr_code';

export default function PaymentQRCode({
  amount,
  orderId,
  customerName,
  merchantName = 'Zerish Luxe',
  note = 'Order Payment',
  customQrImageUrl,
  onPaymentConfirmed
}: PaymentQRCodeProps) {
  const [customQr, setCustomQr] = useState<string>('');
  const [fallbackQrUrl, setFallbackQrUrl] = useState<string>('');

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

  // Generate a fallback clean QR code if no custom image is uploaded yet
  useEffect(() => {
    if (!customQr) {
      const upiUrl = `upi://pay?pn=${encodeURIComponent(merchantName)}&am=${amount || ''}&cu=INR&tn=${encodeURIComponent(orderId ? `Order ${orderId}` : note)}`;
      QRCode.toDataURL(upiUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: '#2B1E1A',
          light: '#FAF8F6'
        },
        errorCorrectionLevel: 'H'
      })
        .then((url: string) => setFallbackQrUrl(url))
        .catch((err: any) => console.error('Failed to render QR Code:', err));
    }
  }, [customQr, amount, orderId, note, merchantName]);

  const displayImage = customQr || fallbackQrUrl;

  return (
    <div className="bg-[#FAF8F6] border border-espresso/15 rounded-sm p-4 sm:p-5 text-espresso space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-espresso text-linen rounded-full flex items-center justify-center shadow-xs">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-espresso leading-tight">Scan QR Code to Pay</h4>
            <p className="text-[10px] text-taupe uppercase tracking-wider font-semibold">
              Open any UPI App on your mobile phone
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

      {/* QR Code Presentation Frame */}
      <div className="flex flex-col items-center justify-center p-4 bg-white border border-espresso/10 rounded-xs shadow-2xs">
        <div className="relative p-2.5 bg-[#FAF8F6] border border-espresso/10 rounded-sm flex items-center justify-center">
          {displayImage ? (
            <img 
              src={displayImage} 
              alt="Payment QR Code" 
              className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-xs"
            />
          ) : (
            <div className="w-52 h-52 sm:w-60 sm:h-60 flex flex-col items-center justify-center text-taupe text-xs p-4 text-center space-y-2">
              <ImageIcon className="w-8 h-8 text-taupe/50" />
              <p>No QR Code uploaded yet.</p>
            </div>
          )}
        </div>

        <p className="text-[10px] text-taupe uppercase tracking-widest font-extrabold mt-3 text-center">
          Scan with Any UPI App (Google Pay, PhonePe, Paytm, BHIM, Cred)
        </p>

        {/* Accepted Payment Apps Badges */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 mt-2">
          {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Cred', 'Amazon Pay'].map((app) => (
            <span 
              key={app}
              className="px-2 py-0.5 bg-espresso/5 border border-espresso/10 rounded-full text-[9px] font-bold text-espresso/80"
            >
              {app}
            </span>
          ))}
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center space-x-1.5 text-[9px] text-taupe/90 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
        <span>100% Secure & Direct UPI Payment. Zero convenience charges.</span>
      </div>
    </div>
  );
}
