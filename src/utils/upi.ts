import { UpiPaymentSettings } from '../types';

export const DEFAULT_UPI_SETTINGS: UpiPaymentSettings = {
  upiId: 'athira.prakasan21-1@okhdfcbank',
  merchantName: 'Zerish Luxe',
  defaultNote: 'Zerish Luxe Fine Jewellery Order',
  isDirectAppPayEnabled: true,
};

export interface BuildUpiUrlOptions {
  upiId?: string;
  merchantName?: string;
  amount?: number;
  orderId?: string;
  note?: string;
  app?: 'generic' | 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred';
}

/**
 * Validates a UPI ID / VPA format (e.g. username@bank, 9916026262@upi)
 */
export function isValidUpiId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  const cleaned = id.trim();
  // Must have exactly one @ and valid alphanumeric / period / dash chars on both sides
  const regex = /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9]{2,32}$/;
  return regex.test(cleaned);
}

/**
 * Builds the standard NPCI UPI URI with specified parameters
 */
export function buildUpiUrl(options: BuildUpiUrlOptions): string {
  const upiId = (options.upiId || DEFAULT_UPI_SETTINGS.upiId).trim();
  const merchantName = (options.merchantName || DEFAULT_UPI_SETTINGS.merchantName).trim();
  const note = options.note || (options.orderId ? `Order ${options.orderId}` : DEFAULT_UPI_SETTINGS.defaultNote || 'Jewellery Order');

  const params = new URLSearchParams();
  if (upiId) {
    params.set('pa', upiId);
  }
  if (merchantName) {
    params.set('pn', merchantName);
  }
  if (options.amount !== undefined && options.amount > 0) {
    params.set('am', options.amount.toFixed(2));
  }
  params.set('cu', 'INR');
  if (note) {
    params.set('tn', note);
  }

  const queryString = params.toString();

  switch (options.app) {
    case 'gpay':
      // Google Pay Tez intent on Android/iOS
      return `tez://upi/pay?${queryString}`;
    case 'phonepe':
      // PhonePe app deep link
      return `phonepe://pay?${queryString}`;
    case 'paytm':
      // Paytm deep link
      return `paytmmp://pay?${queryString}`;
    case 'bhim':
      // BHIM UPI deep link
      return `bhim://pay?${queryString}`;
    case 'generic':
    default:
      // Standard universal UPI deep link recognized by all UPI apps
      return `upi://pay?${queryString}`;
  }
}

/**
 * Storage key for persisting UPI settings locally
 */
export const UPI_SETTINGS_STORAGE_KEY = 'zerish_store_upi_settings';

export function getCachedUpiSettings(): UpiPaymentSettings {
  try {
    const raw = localStorage.getItem(UPI_SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        upiId: parsed.upiId || DEFAULT_UPI_SETTINGS.upiId,
        merchantName: parsed.merchantName || DEFAULT_UPI_SETTINGS.merchantName,
        defaultNote: parsed.defaultNote || DEFAULT_UPI_SETTINGS.defaultNote,
        isDirectAppPayEnabled: parsed.isDirectAppPayEnabled !== false
      };
    }
  } catch {
    // ignore
  }
  return DEFAULT_UPI_SETTINGS;
}

export function setCachedUpiSettings(settings: UpiPaymentSettings): void {
  try {
    localStorage.setItem(UPI_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('zerish_upi_settings_updated', { detail: settings }));
  } catch {
    // ignore
  }
}
