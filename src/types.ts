export interface Product {
  id: string;
  name: string;
  category: 'chains' | 'necklaces' | 'bracelets' | 'cuff-bracelets' | 'drop-earrings' | 'stud-earrings' | 'hair-accessories' | 'rings';
  price: number;
  originalPrice?: number;
  description: string;
  imageUrl: string;
  thumbnails?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isGift?: boolean;
  isAddedBySeller?: boolean;
  material?: string;
  dimensions?: string;
  rating?: number;
  reviewsCount?: number;
  stock?: number;
  variants?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  state: string;
  rating: number;
  quote: string;
  avatarInitials: string;
  avatarUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderDetails {
  customerName: string;
  phoneNumber: string;
  city: string;
  postalCode: string;
  state: string;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  city: string;
  postalCode: string;
  state: string;
  items: CartItem[];
  total: number;
  discount: number;
  couponApplied?: string;
  status: 'Pending' | 'Dispatched' | 'Delivered';
  date: string;
  trackingNumber: string;
  isPaid?: boolean;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
}

export interface SalesAnalytics {
  totalMockSales: number;
  totalOrders: number;
  revenue: number;
}

export interface UserAccount {
  name: string;
  email?: string;
  phoneNumber: string;
  city: string;
  state: string;
  postalCode: string;
  joinDate: string;
}

export interface CategorySetting {
  tabId: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  handle: string;
  caption: string;
  likes: number;
  comments: number;
  location: string;
  jewellery: string;
}


