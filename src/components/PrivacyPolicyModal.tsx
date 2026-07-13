import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay with subtle blur and fade */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-espresso/70 backdrop-blur-xs transition-opacity duration-300"
      ></div>

      {/* Modal Box */}
      <div className="bg-[#FAF8F6] w-full max-w-2xl p-6 sm:p-8 rounded-sm border border-espresso/15 shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-espresso/60 hover:text-espresso hover:bg-espresso/5 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center border-b border-espresso/10 pb-5 mb-6">
          <ShieldCheck className="w-8 h-8 text-terracotta mx-auto mb-2" />
          <h3 className="font-serif text-2xl font-normal text-espresso">Privacy Policy</h3>
          <p className="text-[10px] text-taupe uppercase tracking-widest font-semibold mt-1">
            Effective Date: July 15, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-espresso max-w-none text-xs sm:text-sm text-espresso/90 leading-relaxed font-sans space-y-6">
          <p className="italic text-center text-espresso/70">
            Welcome to Zerish Luxe. Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website or purchase our products.
          </p>

          <div className="space-y-4">
            {/* Section 1 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">1. Information We Collect</h4>
              <p>When you use our website, we may collect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Mobile Number</li>
                <li>Shipping & Billing Address</li>
                <li>Payment Information (processed securely through third-party payment providers; we do not store your card details)</li>
                <li>Order History</li>
                <li>Device information, browser type, IP address, and cookies</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">2. How We Use Your Information</h4>
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Process and deliver your orders</li>
                <li>Provide customer support</li>
                <li>Send order updates</li>
                <li>Improve our website and services</li>
                <li>Inform you about new arrivals, offers, and promotions (only if you have opted in)</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">3. Payment Security</h4>
              <p>
                Payments are processed through secure payment gateways, UPI payments. Zerish Luxe does not store your debit or credit card details.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">4. Sharing Your Information</h4>
              <p>We do not sell or rent your personal information.</p>
              <p>Your information may be shared only with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Courier and logistics partners for order delivery</li>
                <li>Payment gateway providers</li>
                <li>Government authorities where legally required</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">5. Cookies</h4>
              <p>
                Our website may use cookies to improve your browsing experience, remember preferences, and analyze website performance.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">6. Data Protection</h4>
              <p>
                We implement reasonable security measures to protect your personal information from unauthorized access, misuse, or disclosure.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">7. Your Rights</h4>
              <p>You may request to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access your personal information</li>
                <li>Update or correct your information</li>
                <li>Delete your account or personal data (subject to legal obligations)</li>
              </ul>
              <p>Please contact us for any such requests.</p>
            </div>

            {/* Section 8 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">8. Changes to This Policy</h4>
              <p>
                We may update this Privacy Policy from time to time. The latest version will always be available on our website.
              </p>
            </div>
          </div>

          <div className="border-t border-espresso/10 pt-5 text-center text-xs font-serif text-espresso/70">
            Thank you for trusting Zerish Luxe.
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-espresso text-[#FAF8F6] text-xs uppercase tracking-widest font-extrabold hover:bg-terracotta transition-colors rounded-xs shadow-md cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
