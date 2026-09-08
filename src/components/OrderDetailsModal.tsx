import React from 'react';
import { X, CheckCircle2, Truck, Package, Printer, Share2, MapPin, Calendar, CreditCard, ShieldCheck, QrCode, Phone, ExternalLink } from 'lucide-react';
import { Order } from '../types';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onTrackOrder?: (trackingCode: string) => void;
  onOpenScanAndPay?: (order: Order) => void;
}

export default function OrderDetailsModal({ 
  isOpen, 
  onClose, 
  order, 
  onTrackOrder,
  onOpenScanAndPay 
}: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    let msg = `✨ *ZERISH LUXE FINE JEWELLERY - ORDER RECEIPT* ✨\n\n`;
    msg += `📄 *Order ID:* ${order.id}\n`;
    msg += `🚚 *Tracking Reference:* ${order.trackingNumber}\n`;
    msg += `📅 *Date:* ${order.date}\n`;
    msg += `👤 *Customer:* ${order.customerName} (${order.phoneNumber})\n`;
    msg += `📍 *Delivery Address:* ${order.address ? `${order.address}, ` : ''}${order.city}, ${order.state} - ${order.postalCode}\n\n`;
    msg += `🛍️ *ORDERED ITEMS:*\n`;
    order.items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.product.name}* (Qty: ${item.quantity}) - ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}\n`;
    });
    msg += `\n💰 *Total Amount:* ₹${order.total.toLocaleString('en-IN')}\n`;
    if (order.discount > 0) {
      msg += `🏷️ *Discount Applied:* ₹${order.discount.toLocaleString('en-IN')} (Code: ${order.couponApplied || 'OFFER'})\n`;
    }
    msg += `💳 *Payment Method:* ${order.paymentMethod === 'UPI_QR' ? 'UPI QR Code Scan & Pay' : 'UPI Payment'}\n`;
    msg += `✅ *Payment Status:* ${order.isPaid ? 'Verified Paid ✓' : 'Payment Verification Pending'}\n`;
    if (order.upiTransactionRef) {
      msg += `🔢 *UPI Ref / UTR:* ${order.upiTransactionRef}\n`;
    }
    msg += `\nThank you for choosing Zerish Luxe! Crafted for everyday elegance.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/919916026262?text=${encoded}`, '_blank');
  };

  const statusStep = order.status === 'Delivered' ? 3 : order.status === 'Dispatched' ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 print:p-0">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-espresso/70 backdrop-blur-xs transition-opacity print:hidden" 
      />

      {/* Modal Container */}
      <div 
        id="order-invoice-container"
        className="bg-[#FAF8F6] w-full max-w-2xl p-5 sm:p-8 rounded-sm border border-espresso/15 shadow-2xl relative z-10 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:bg-white print:p-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-espresso/70 hover:bg-espresso hover:text-white transition-colors cursor-pointer print:hidden"
          aria-label="Close Order Details modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Invoice Header */}
        <div className="border-b border-espresso/15 pb-5 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-espresso">ZERISH LUXE</span>
              <span className="text-[10px] tracking-widest text-terracotta uppercase font-bold px-2 py-0.5 bg-terracotta/10 rounded-full">
                Fine Jewellery
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-taupe font-medium mt-0.5">
              Order Confirmation & Invoice
            </p>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="flex items-center sm:justify-end space-x-1.5">
              <span className="text-[9px] uppercase tracking-wider text-taupe font-bold">Order ID:</span>
              <span className="font-mono text-xs font-bold text-espresso bg-espresso/5 px-2 py-0.5 rounded-xs select-all">
                {order.id}
              </span>
            </div>
            <div className="flex items-center sm:justify-end space-x-1.5">
              <span className="text-[9px] uppercase tracking-wider text-taupe font-bold">Tracking Code:</span>
              <span className="font-mono text-xs font-bold text-terracotta select-all">
                {order.trackingNumber}
              </span>
            </div>
            <p className="text-[10px] text-taupe flex items-center sm:justify-end space-x-1">
              <Calendar className="w-3 h-3 text-taupe" />
              <span>{order.date}</span>
            </p>
          </div>
        </div>

        {/* Status Tracker Stepper */}
        <div className="mb-6 p-4 bg-white border border-espresso/10 rounded-xs print:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-espresso">
              Fulfillment Status
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold ${
              order.status === 'Delivered' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : order.status === 'Dispatched'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {order.status === 'Delivered' ? 'Delivered' : order.status === 'Dispatched' ? 'In Transit / Dispatched' : 'Confirmed & Packing'}
            </span>
          </div>

          {/* Steps visualization */}
          <div className="relative pt-2 pb-1">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-espresso/10"></div>
            <div 
              className="absolute top-4 left-4 h-0.5 bg-terracotta transition-all duration-500"
              style={{ width: statusStep === 3 ? '100%' : statusStep === 2 ? '50%' : '10%' }}
            ></div>

            <div className="relative flex justify-between">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-terracotta text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-bold text-espresso mt-1">Confirmed</span>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                  statusStep >= 2 ? 'bg-terracotta text-white' : 'bg-white border-2 border-espresso/20 text-espresso/40'
                }`}>
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[9px] font-bold mt-1 ${statusStep >= 2 ? 'text-espresso' : 'text-espresso/40'}`}>
                  Dispatched
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                  statusStep === 3 ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-espresso/20 text-espresso/40'
                }`}>
                  <Package className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[9px] font-bold mt-1 ${statusStep === 3 ? 'text-emerald-700' : 'text-espresso/40'}`}>
                  Delivered
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Payment Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Recipient & Delivery Address */}
          <div className="p-3.5 bg-white border border-espresso/10 rounded-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-wider font-extrabold text-taupe">
              <MapPin className="w-3.5 h-3.5 text-terracotta" />
              <span>Shipping & Delivery Destination</span>
            </div>
            <p className="text-xs font-bold text-espresso">{order.customerName}</p>
            <p className="text-[11px] text-espresso/80">Phone: <span className="font-mono font-semibold">{order.phoneNumber}</span></p>
            {order.email && <p className="text-[11px] text-espresso/80">Email: {order.email}</p>}
            <p className="text-[11px] text-espresso/80 leading-relaxed">
              {order.address && <span>{order.address}, </span>}
              {order.city}, {order.state} - <span className="font-mono font-semibold">{order.postalCode}</span>
            </p>
          </div>

          {/* Payment Method & Status */}
          <div className="p-3.5 bg-white border border-espresso/10 rounded-xs space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-wider font-extrabold text-taupe">
                <CreditCard className="w-3.5 h-3.5 text-terracotta" />
                <span>Payment Information</span>
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-xs font-bold text-espresso">
                  {order.paymentMethod === 'UPI_QR' 
                    ? 'UPI QR Code Scan & Pay' 
                    : 'Instant UPI Payment'}
                </span>
              </div>
              {order.upiTransactionRef && (
                <p className="text-[10px] text-taupe font-mono mt-0.5">
                  UTR / Ref: <span className="font-bold text-espresso">{order.upiTransactionRef}</span>
                </p>
              )}
            </div>

            <div className={`p-2 rounded-xs text-[10px] font-bold uppercase tracking-wider text-center ${
              order.isPaid 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {order.isPaid ? 'Payment Confirmed & Verified ✓' : 'Payment Verification Pending'}
            </div>
          </div>
        </div>

        {/* Itemized Order Details Table */}
        <div className="mb-5 bg-white border border-espresso/10 rounded-xs overflow-hidden">
          <div className="p-3 border-b border-espresso/10 bg-linen/20 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-espresso">
              Order Items Details ({order.items.reduce((sum, it) => sum + it.quantity, 0)} Items)
            </span>
            <span className="text-[9px] text-taupe font-semibold">100% Anti-Tarnish Guaranteed</span>
          </div>

          <div className="divide-y divide-espresso/5">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center space-x-3 hover:bg-[#FAF8F6]/50 transition-colors">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  className="w-12 h-12 object-cover rounded-xs border border-espresso/10 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-serif text-xs font-bold text-espresso truncate">
                    {item.product.name}
                  </h5>
                  <p className="text-[10px] text-taupe">
                    {item.product.material || '18K Yellow Gold Polish'} • Qty: <strong className="text-espresso">{item.quantity}</strong>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-espresso">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-[9px] text-taupe">
                      (₹{item.product.price.toLocaleString('en-IN')} each)
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculation Summary */}
          <div className="p-3.5 bg-linen/20 border-t border-espresso/10 space-y-1.5 text-xs">
            <div className="flex justify-between text-espresso/70">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-espresso">
                ₹{(order.total + order.discount).toLocaleString('en-IN')}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-terracotta">
                <span>Promotional Discount ({order.couponApplied || 'Coupon'}):</span>
                <span className="font-bold">-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-espresso/70">
              <span>Express Insured Shipping:</span>
              <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span>
            </div>

            <div className="flex justify-between text-espresso/70">
              <span>Luxury Velvet Packaging & GST:</span>
              <span className="text-emerald-700 font-bold uppercase text-[10px]">Complimentary</span>
            </div>

            <div className="pt-2 border-t border-espresso/15 flex justify-between items-baseline">
              <span className="font-serif font-bold text-espresso text-sm">Total Paid / Payable:</span>
              <span className="font-serif text-lg font-bold text-espresso">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-espresso/15 print:hidden">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-white border border-espresso/20 text-espresso hover:bg-espresso hover:text-white rounded-xs text-[9px] uppercase tracking-widest font-extrabold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-xs text-[9px] uppercase tracking-widest font-extrabold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Receipt</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {!order.isPaid && onOpenScanAndPay && (
              <button
                onClick={() => onOpenScanAndPay(order)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xs text-[9px] uppercase tracking-widest font-extrabold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Pay via UPI QR</span>
              </button>
            )}

            {onTrackOrder && (
              <button
                onClick={() => {
                  onClose();
                  onTrackOrder(order.trackingNumber || order.id);
                }}
                className="px-3.5 py-2 bg-espresso hover:bg-terracotta text-white rounded-xs text-[9px] uppercase tracking-widest font-extrabold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-linen" />
                <span>Track Transit</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-espresso/10 hover:bg-espresso/20 text-espresso rounded-xs text-[9px] uppercase tracking-widest font-extrabold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

        {/* Brand Authenticity Stamp */}
        <div className="mt-4 text-center text-[9px] text-taupe font-medium flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Official Zerish Luxe Certificate • Kochi / Chennai Express Distribution</span>
        </div>
      </div>
    </div>
  );
}
