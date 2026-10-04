import { Order } from '../types';

/**
 * Generates an Enquire Number starting with ZL-001 (e.g., ZL-001, ZL-002, ...)
 * and an Order ID starting with ZL_currentdate_0008 (7 orders already completed, so sequence starts at 0008).
 */
export function generateOrderAndEnquiryIds(existingOrders: Order[] = []): {
  enquiryNumber: string;
  orderId: string;
} {
  // 1. Determine next Enquire Number (starts with ZL-001)
  let maxEnquiryNum = 0;
  if (Array.isArray(existingOrders)) {
    for (const o of existingOrders) {
      if (o && o.trackingNumber) {
        const match = o.trackingNumber.match(/^ZL-(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxEnquiryNum) {
            maxEnquiryNum = num;
          }
        }
      }
    }
  }

  let storedEnquirySeq = 0;
  try {
    storedEnquirySeq = parseInt(localStorage.getItem('zl_enquiry_sequence') || '0', 10);
  } catch (e) {
    storedEnquirySeq = 0;
  }

  // Base start sequence is 1 -> 'ZL-001'
  const nextEnquiryNum = Math.max(1, maxEnquiryNum + 1, storedEnquirySeq);
  const enquiryNumber = `ZL-${String(nextEnquiryNum).padStart(3, '0')}`;

  try {
    localStorage.setItem('zl_enquiry_sequence', String(nextEnquiryNum + 1));
  } catch (e) {}

  // 2. Determine next Order ID (starts with ZL_{currentdate}_0008)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const currentDateStr = `${year}${month}${day}`;

  let maxOrderNum = 7; // 7 orders already completed, so default start is 8
  if (Array.isArray(existingOrders)) {
    for (const o of existingOrders) {
      if (o && o.id) {
        const match = o.id.match(/_(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxOrderNum) {
            maxOrderNum = num;
          }
        }
      }
    }
  }

  let storedOrderSeq = 0;
  try {
    storedOrderSeq = parseInt(localStorage.getItem('zl_order_sequence') || '0', 10);
  } catch (e) {
    storedOrderSeq = 0;
  }

  // Base start sequence is 8 -> 'ZL_{currentdate}_0008'
  const nextOrderNum = Math.max(8, maxOrderNum + 1, storedOrderSeq);
  const orderId = `ZL_${currentDateStr}_${String(nextOrderNum).padStart(4, '0')}`;

  try {
    localStorage.setItem('zl_order_sequence', String(nextOrderNum + 1));
  } catch (e) {}

  return {
    enquiryNumber,
    orderId,
  };
}
