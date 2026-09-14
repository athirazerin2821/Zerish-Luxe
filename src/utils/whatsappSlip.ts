import { Order } from '../types';

export const STORE_WHATSAPP_NUMBER = '919916026262';

export interface WhatsAppSlipOptions {
  order: Order;
  appUsed?: string;
  utr?: string;
}

/**
 * Formats a clean, professional WhatsApp payment confirmation slip
 * for Zerish Luxe Fine Jewellery.
 */
export function generateWhatsAppSlipMessage({ order, appUsed, utr }: WhatsAppSlipOptions): string {
  const itemsText = order.items && order.items.length > 0
    ? order.items.map(item => `• ${item.product.name} × ${item.quantity} (₹${item.product.price.toLocaleString('en-IN')})`).join('\n')
    : '• Custom Fine Jewellery Order';

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

  const appDisplay = appUsed || 'UPI App';
  const utrDisplay = utr ? `\n*UPI Ref / UTR:* \`${utr}\`` : '';

  return (
    `👑 *ZERISH LUXE FINE JEWELLERY*\n` +
    `✨ *PAYMENT CONFIRMATION SLIP* ✨\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Order ID:* #${order.id}\n` +
    `*Tracking No:* ${order.trackingNumber}\n` +
    `*Date:* ${dateStr}\n\n` +
    `*CUSTOMER DETAILS:*\n` +
    `*Name:* ${order.customerName}\n` +
    `*Phone:* ${order.phoneNumber}\n` +
    `*Delivery Address:* ${addressLine || 'Standard Delivery'}\n` +
    (order.email ? `*Email:* ${order.email}\n` : '') +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*ORDERED ITEMS:*\n` +
    `${itemsText}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*TOTAL AMOUNT:* ₹${order.total.toLocaleString('en-IN')}\n` +
    `*PAYMENT MODE:* ${appDisplay} (Direct UPI)\n` +
    `*PAYMENT STATUS:* ✅ Transfer Completed (Slip Shared)${utrDisplay}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Hello Zerish Luxe Team,\n` +
    `I have completed the UPI payment for my order. My payment confirmation slip is above.\n\n` +
    `📸 *I am attaching my payment screenshot right below this message for instant verification & dispatch.* Thank you!`
  );
}

/**
 * Builds the wa.me URL for the WhatsApp payment slip
 */
export function buildWhatsAppSlipUrl(options: WhatsAppSlipOptions): string {
  const message = generateWhatsAppSlipMessage(options);
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Safely opens the WhatsApp payment slip in a new window or redirects
 */
export function openWhatsAppSlip(options: WhatsAppSlipOptions): void {
  const url = buildWhatsAppSlipUrl(options);
  const win = window.open(url, '_blank');
  if (!win || win.closed || typeof win.closed === 'undefined') {
    // Popup was blocked or mobile webview - fallback to location
    window.location.href = url;
  }
}
