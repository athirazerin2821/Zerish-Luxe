import { Order } from '../types';

export const STORE_WHATSAPP_NUMBER = '919916026262';

export interface WhatsAppEnquiryOptions {
  order: Order;
  appUsed?: string;
  utr?: string;
}

/**
 * Formats a clean, professional WhatsApp Order Enquiry message
 * for Zerish Luxe Anti Tarnish Jewellery.
 */
export function generateWhatsAppEnquiryMessage({ order }: WhatsAppEnquiryOptions): string {
  const itemsText = order.items && order.items.length > 0
    ? order.items.map(item => `• ${item.product.name} × ${item.quantity} (₹${item.product.price.toLocaleString('en-IN')})`).join('\n')
    : '• Custom Anti Tarnish Jewellery Enquiry';

  const dateStr = order.date 
    ? order.date
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

  const addressLine = [
    order.address,
    order.city,
    order.state ? `${order.state} - ${order.postalCode || ''}` : order.postalCode
  ].filter(Boolean).join(', ');

  return (
    `👑 *ZERISH LUXE ANTI TARNISH JEWELLERY*\n` +
    `✨ *ORDER ENQUIRY* ✨\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Order ID:* ${order.id}\n` +
    `*Enquire Number:* ${order.trackingNumber}\n` +
    `*Date:* ${dateStr}\n\n` +
    `*CUSTOMER DETAILS:*\n` +
    `*Name:* ${order.customerName}\n` +
    `*Phone:* ${order.phoneNumber}\n` +
    `*Delivery Address:* ${addressLine || 'Standard Delivery'}\n` +
    (order.email ? `*Email:* ${order.email}\n` : '') +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*ENQUIRED PIECES:*\n` +
    `${itemsText}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*ESTIMATED TOTAL:* ₹${order.total.toLocaleString('en-IN')}\n` +
    (order.discount > 0 ? `*DISCOUNT APPLIED:* ₹${order.discount.toLocaleString('en-IN')}${order.couponApplied ? ` (${order.couponApplied})` : ''}\n` : '') +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Hello Zerish Luxe Team,\n` +
    `I would like to enquire about ordering the pieces listed above. Please assist me with availability, order confirmation, and delivery details. Thank you!`
  );
}

/**
 * Builds the wa.me URL for the WhatsApp enquiry
 */
export function buildWhatsAppEnquiryUrl(options: WhatsAppEnquiryOptions): string {
  const message = generateWhatsAppEnquiryMessage(options);
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Safely opens WhatsApp enquiry in a new window or redirects
 */
export function openWhatsAppEnquiry(options: WhatsAppEnquiryOptions): void {
  const url = buildWhatsAppEnquiryUrl(options);
  const win = window.open(url, '_blank');
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = url;
  }
}

// Backwards-compatible aliases
export type WhatsAppSlipOptions = WhatsAppEnquiryOptions;
export const generateWhatsAppSlipMessage = generateWhatsAppEnquiryMessage;
export const buildWhatsAppSlipUrl = buildWhatsAppEnquiryUrl;
export const openWhatsAppSlip = openWhatsAppEnquiry;
