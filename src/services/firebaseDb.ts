import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  getDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { Product, Order, Coupon, Testimonial, UserAccount } from '../types';
import { INITIAL_PRODUCTS, TESTIMONIALS } from '../data';

// Database Seeding Helper
export async function seedDatabaseIfEmpty() {
  // 1. Seed Products (Allowed for anyone)
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    if (productsSnapshot.empty) {
      console.log('Seeding initial products into Firestore...');
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), p);
      }
    }
  } catch (error) {
    console.warn('Non-blocking: Could not seed products:', error);
  }

  // 2. Seed Reviews (Allowed for anyone)
  try {
    const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
    if (reviewsSnapshot.empty) {
      console.log('Seeding initial reviews into Firestore...');
      for (const r of TESTIMONIALS) {
        await setDoc(doc(db, 'reviews', r.id), r);
      }
    }
  } catch (error) {
    console.warn('Non-blocking: Could not seed reviews:', error);
  }

  // 3. Seed Hero Settings (Allowed for anyone)
  try {
    const heroDoc = await getDoc(doc(db, 'settings', 'hero'));
    if (!heroDoc.exists()) {
      console.log('Seeding default hero text into Firestore...');
      await setDoc(doc(db, 'settings', 'hero'), {
        title: 'Minimal Elegance.',
        subtitle: 'Everyday Luxury.'
      });
    }
  } catch (error) {
    console.warn('Non-blocking: Could not seed hero settings:', error);
  }

  // 4. Seed Coupons (Allowed for anyone)
  try {
    const couponsSnapshot = await getDocs(collection(db, 'coupons'));
    if (couponsSnapshot.empty) {
      console.log('Seeding default coupons into Firestore...');
      const defaultCoupons: Coupon[] = [
        { code: 'ZERISH10', type: 'percent', value: 10 },
        { code: 'FESTIVE150', type: 'flat', value: 150 }
      ];
      for (const c of defaultCoupons) {
        await setDoc(doc(db, 'coupons', c.code), c);
      }
    }
  } catch (error) {
    console.warn('Non-blocking: Could not seed coupons:', error);
  }

  // 5. Seed Orders (Only if authenticated, as unauthenticated users are restricted from listing orders)
  if (auth.currentUser) {
    try {
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      if (ordersSnapshot.empty) {
        console.log('Seeding initial orders into Firestore...');
        const defaultOrders = [
          {
            id: 'ZL-4291',
            customerName: 'Anjali Nair',
            phoneNumber: '9446012345',
            city: 'Kochi',
            state: 'Kerala',
            postalCode: '682016',
            items: [
              { product: INITIAL_PRODUCTS[0], quantity: 1 }
            ],
            total: 1899,
            discount: 0,
            status: 'Delivered',
            date: 'Jul 4, 2026',
            trackingNumber: 'ZL-TRACK-4291',
            isPaid: true
          },
          {
            id: 'ZL-8910',
            customerName: 'Keerthana S',
            phoneNumber: '9840123456',
            city: 'Chennai',
            state: 'Tamil Nadu',
            postalCode: '600001',
            items: [
              { product: INITIAL_PRODUCTS[10], quantity: 1 }
            ],
            total: 2190,
            discount: 0,
            status: 'Dispatched',
            date: 'Jul 5, 2026',
            trackingNumber: 'ZL-TRACK-8910',
            isPaid: false
          }
        ];
        for (const o of defaultOrders) {
          await setDoc(doc(db, 'orders', o.id), o);
        }
      }
    } catch (error) {
      console.warn('Non-blocking: Could not seed orders:', error);
    }
  }
}

// Products API
export async function getProducts(): Promise<Product[]> {
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products: Product[] = [];
  querySnapshot.forEach((docSnap) => {
    products.push(docSnap.data() as Product);
  });
  return products;
}

export async function addProduct(product: Product): Promise<void> {
  await setDoc(doc(db, 'products', product.id), product);
}

export async function updateProduct(product: Product): Promise<void> {
  await setDoc(doc(db, 'products', product.id), product);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

// Orders API
export async function getOrders(): Promise<Order[]> {
  const querySnapshot = await getDocs(collection(db, 'orders'));
  const orders: Order[] = [];
  querySnapshot.forEach((docSnap) => {
    orders.push(docSnap.data() as Order);
  });
  // Sort by date or id descending
  return orders;
}

export async function createOrder(order: Order): Promise<void> {
  await setDoc(doc(db, 'orders', order.id), order);
}

export async function updateOrderStatus(orderId: string, status: 'Pending' | 'Dispatched' | 'Delivered'): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { status });
}

export async function toggleOrderPaymentStatus(orderId: string): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  const docSnap = await getDoc(orderRef);
  if (docSnap.exists()) {
    const current = docSnap.data().isPaid || false;
    await updateDoc(orderRef, { isPaid: !current });
  }
}

// Coupons API
export async function getCoupons(): Promise<Coupon[]> {
  const querySnapshot = await getDocs(collection(db, 'coupons'));
  const coupons: Coupon[] = [];
  querySnapshot.forEach((docSnap) => {
    coupons.push(docSnap.data() as Coupon);
  });
  return coupons;
}

export async function addCoupon(coupon: Coupon): Promise<void> {
  await setDoc(doc(db, 'coupons', coupon.code), coupon);
}

export async function deleteCoupon(code: string): Promise<void> {
  await deleteDoc(doc(db, 'coupons', code));
}

// Reviews API
export async function getReviews(): Promise<Testimonial[]> {
  const querySnapshot = await getDocs(collection(db, 'reviews'));
  const reviews: Testimonial[] = [];
  querySnapshot.forEach((docSnap) => {
    reviews.push(docSnap.data() as Testimonial);
  });
  return reviews;
}

export async function addReview(review: Testimonial): Promise<void> {
  await setDoc(doc(db, 'reviews', review.id), review);
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, 'reviews', id));
}

// Settings / Hero API
export async function getHeroText(): Promise<{ title: string; subtitle: string }> {
  const docSnap = await getDoc(doc(db, 'settings', 'hero'));
  if (docSnap.exists()) {
    return docSnap.data() as { title: string; subtitle: string };
  }
  return { title: 'Minimal Elegance.', subtitle: 'Everyday Luxury.' };
}

export async function updateHeroText(title: string, subtitle: string): Promise<void> {
  await setDoc(doc(db, 'settings', 'hero'), { title, subtitle });
}

// Storage Image Upload
export async function uploadProductImage(file: File): Promise<string> {
  const fileName = `products/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// Customers API (saves user/guest details on sign up or guest checkout)
export async function saveCustomer(user: UserAccount): Promise<void> {
  const cleanPhone = user.phoneNumber.trim();
  await setDoc(doc(db, 'customers', cleanPhone), {
    ...user,
    updatedAt: new Date().toISOString()
  });
}

export async function getCustomers(): Promise<UserAccount[]> {
  const querySnapshot = await getDocs(collection(db, 'customers'));
  const customers: UserAccount[] = [];
  querySnapshot.forEach((docSnap) => {
    customers.push(docSnap.data() as UserAccount);
  });
  return customers;
}

