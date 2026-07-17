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
import { Product, Order, Coupon, Testimonial, UserAccount, CategorySetting } from '../types';
import { INITIAL_PRODUCTS, TESTIMONIALS } from '../data';

export const DEFAULT_CATEGORIES: CategorySetting[] = [
  {
    title: 'CHAINS',
    subtitle: null,
    tabId: 'chains',
    imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b1a30d5a41?q=80&w=500&auto=format&fit=crop'
  },
  {
    title: 'EARRINGS',
    subtitle: 'DROP',
    tabId: 'drop-earrings',
    imageUrl: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=500&auto=format&fit=crop'
  },
  {
    title: 'EARRINGS',
    subtitle: 'STUD',
    tabId: 'stud-earrings',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500&auto=format&fit=crop'
  },
  {
    title: 'RINGS',
    subtitle: null,
    tabId: 'rings',
    imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=500&auto=format&fit=crop'
  },
  {
    title: 'BRACELETS',
    subtitle: null,
    tabId: 'bracelets',
    imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=500&auto=format&fit=crop'
  },
  {
    title: 'CUFF',
    subtitle: 'BANGLES',
    tabId: 'cuff-bracelets',
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=500&auto=format&fit=crop'
  },
  {
    title: 'HAIR',
    subtitle: 'ACCESSORIES',
    tabId: 'hair-accessories',
    imageUrl: 'https://images.unsplash.com/photo-1626784215021-2e39ac514150?q=80&w=500&auto=format&fit=crop'
  }
];

// Database Seeding Helper
export async function seedDatabaseIfEmpty(force = false) {
  if (!force) {
    try {
      const seedStatusDoc = await getDoc(doc(db, 'settings', 'seeded'));
      if (seedStatusDoc.exists() && seedStatusDoc.data()?.seeded) {
        console.log('Database already seeded previously. Skipping automatic seeding.');
        return;
      }
    } catch (error) {
      console.warn('Non-blocking: Could not check if database is seeded:', error);
    }
  }

  // 0. Seed Categories
  try {
    const catDoc = await getDoc(doc(db, 'settings', 'categories'));
    if (!catDoc.exists()) {
      console.log('Seeding default categories into Firestore...');
      await setDoc(doc(db, 'settings', 'categories'), { list: DEFAULT_CATEGORIES });
    }
  } catch (error) {
    console.warn('Non-blocking: Could not seed categories settings:', error);
  }

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

  // Set the seeded flag at the end of successful seeding
  try {
    await setDoc(doc(db, 'settings', 'seeded'), { 
      seeded: true, 
      seededAt: new Date().toISOString() 
    });
  } catch (error) {
    console.warn('Non-blocking: Could not set seeded settings document:', error);
  }

  // 5. Seed Orders (Omitted as requested to keep dashboard free of dummy data)
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

// Settings / Categories API
export async function getCategories(): Promise<CategorySetting[]> {
  const docSnap = await getDoc(doc(db, 'settings', 'categories'));
  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data && Array.isArray(data.list)) {
      return data.list as CategorySetting[];
    }
  }
  return DEFAULT_CATEGORIES;
}

export async function updateCategories(categories: CategorySetting[]): Promise<void> {
  await setDoc(doc(db, 'settings', 'categories'), { list: categories });
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

