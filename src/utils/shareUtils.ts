import { Product } from '../types';

/**
 * Generates an elegant WhatsApp share message for a product
 */
export function formatWhatsAppProductMessage(product: Product): string {
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/#product-${product.id}` : '';
  const priceFormatted = `₹${product.price.toLocaleString('en-IN')}`;
  const originalPriceFormatted = product.originalPrice ? `₹${product.originalPrice.toLocaleString('en-IN')}` : '';
  
  let msg = `✨ *ZERISH LUXE FINE JEWELLERY* ✨\n\n`;
  msg += `💍 *${product.name}*\n`;
  msg += `🏷️ *Price:* ${priceFormatted}`;
  if (product.originalPrice && product.originalPrice > product.price) {
    msg += ` ~${originalPriceFormatted}~ (${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)`;
  }
  msg += `\n`;
  
  if (product.material) {
    msg += `✨ *Craft:* ${product.material}\n`;
  }
  
  msg += `🛡️ *Highlights:* 100% Anti-Tarnish, Waterproof & Sweatproof, Skin-Friendly\n`;
  
  if (product.imageUrl) {
    msg += `🖼️ *Product Image:* ${product.imageUrl}\n`;
  }
  
  if (currentUrl) {
    msg += `🔗 *View Piece Online:* ${currentUrl}\n`;
  }
  
  msg += `\n_Crafted for everyday luxury and timeless grace._`;
  
  return msg;
}

/**
 * Triggers WhatsApp share for a product
 */
export function shareProductToWhatsApp(product: Product): void {
  const text = formatWhatsAppProductMessage(product);
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  
  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Native Web Share API with fallback to WhatsApp & Clipboard
 */
export async function shareProductNativeOrWhatsApp(product: Product): Promise<'native' | 'whatsapp' | 'copied'> {
  const text = formatWhatsAppProductMessage(product);
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/#product-${product.id}` : '';

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `${product.name} - Zerish Luxe`,
        text: text,
        url: currentUrl || undefined,
      });
      return 'native';
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        shareProductToWhatsApp(product);
        return 'whatsapp';
      }
      return 'native';
    }
  } else {
    shareProductToWhatsApp(product);
    return 'whatsapp';
  }
}
