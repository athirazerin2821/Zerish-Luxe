import React from 'react';
import { X, FileText } from 'lucide-react';

interface TermsConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsConditionsModal({ isOpen, onClose }: TermsConditionsModalProps) {
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
          <FileText className="w-8 h-8 text-terracotta mx-auto mb-2" />
          <h3 className="font-serif text-2xl font-normal text-espresso">Terms & Conditions</h3>
          <p className="text-[10px] text-taupe uppercase tracking-widest font-semibold mt-1">
            Effective Date: July 15, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-espresso max-w-none text-xs sm:text-sm text-espresso/90 leading-relaxed font-sans space-y-6">
          <p className="italic text-center text-espresso/70">
            Welcome to Zerish Luxe. By accessing or purchasing from our website, you agree to the following Terms & Conditions.
          </p>

          <div className="space-y-4">
            {/* Section 1 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">1. About Zerish Luxe</h4>
              <p>
                Zerish Luxe is an online retailer offering anti-tarnish fashion jewellery sourced from trusted suppliers.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">2. Product Information</h4>
              <p>
                We strive to display products accurately. However, slight variations in color, size, or finish may occur due to photography, lighting, or screen settings.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">3. Pricing</h4>
              <p>
                All prices are listed in Indian Rupees (INR) and include applicable taxes unless otherwise stated. Prices may change without prior notice.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">4. Orders</h4>
              <p>
                Orders are confirmed only after successful payment. Zerish Luxe reserves the right to cancel any order due to pricing errors, stock availability, suspected fraud, or other unforeseen circumstances.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">5. Shipping</h4>
              <p>
                Delivery timelines may vary depending on your location. Customers will receive tracking details once the order has been dispatched. We are not responsible for delays caused by courier partners, weather conditions, or unforeseen events.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-1.5 p-4 bg-espresso/[0.02] border-l-2 border-terracotta rounded-r-xs">
              <h4 className="font-serif text-sm sm:text-base font-bold text-espresso text-terracotta">6. Returns & Exchanges</h4>
              <p>
                At Zerish Luxe, we are committed to delivering quality products. As our jewellery is carefully inspected before dispatch, <strong>all sales are final.</strong>
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>We do not accept returns or exchanges for products once they have been delivered.</li>
                <li>Please review the product description, specifications, and images carefully before placing your order.</li>
                <li>If you receive a product that is damaged, defective, or incorrect due to an error on our part, please contact us within 48 hours of delivery with your order number, clear photos, and an unboxing video. We will review the issue and, if found to be genuine, provide an appropriate resolution at our sole discretion.</li>
                <li>Zerish Luxe reserves the right to decline claims that do not meet the above requirements or where the product has been used, damaged after delivery, or altered.</li>
              </ul>
              <p className="mt-2 font-semibold">
                By placing an order, you acknowledge and agree to this No Return & No Exchange Policy.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">7. Jewellery Care</h4>
              <p>To maximize the life of your jewellery:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Keep away from perfumes and chemicals.</li>
                <li>Store in a dry place.</li>
                <li>Avoid rough handling.</li>
              </ul>
              <p>Improper care may reduce the lifespan of the jewellery.</p>
            </div>

            {/* Section 8 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">8. Intellectual Property</h4>
              <p>
                All website content, including logos, product images, text, graphics, and designs, belongs to Zerish Luxe and may not be copied or used without written permission.
              </p>
            </div>

            {/* Section 9 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">9. Limitation of Liability</h4>
              <p>
                Zerish Luxe shall not be liable for indirect, incidental, or consequential damages arising from the use of our products or website.
              </p>
            </div>

            {/* Section 10 */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">10. Governing Law</h4>
              <p>
                These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts in the city where Zerish Luxe is registered.
              </p>
            </div>

            {/* Section 11 */}
            <div className="space-y-1.5 border-t border-espresso/10 pt-4 mt-2">
              <h4 className="font-serif text-sm sm:text-base font-semibold text-espresso">11. Contact Us</h4>
              <p>For any questions regarding these Terms & Conditions, please contact us:</p>
              <p className="font-serif text-xs font-bold text-espresso mt-1">Zerish Luxe</p>
              <p>Email: <a href="mailto:zerishluxe@gmail.com" className="text-terracotta hover:underline font-semibold">zerishluxe@gmail.com</a></p>
              <p>Customer Support: <span className="font-semibold text-espresso">+91 9916026262</span></p>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-espresso text-[#FAF8F6] text-xs uppercase tracking-widest font-extrabold hover:bg-terracotta transition-colors rounded-xs shadow-md cursor-pointer"
          >
            Acknowledge & Accept
          </button>
        </div>

      </div>
    </div>
  );
}
