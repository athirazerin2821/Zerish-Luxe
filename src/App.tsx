import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  X, 
  Sparkles, 
  Check, 
  Star, 
  Sliders, 
  Eye, 
  Search, 
  Heart, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  Percent, 
  Truck, 
  ShieldCheck, 
  HelpCircle,
  MessageCircle,
  Instagram,
  ArrowRight,
  Droplet,
  Award,
  ChevronDown,
  Home,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data and Types
import { Product, CartItem, Order, Coupon, OrderDetails, Testimonial, UserAccount, CategorySetting } from './types';
import { INITIAL_PRODUCTS, TESTIMONIALS } from './data';

// Firebase Services
import { auth } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  seedDatabaseIfEmpty, 
  getProducts, 
  getReviews, 
  getHeroText, 
  getOrders, 
  getCoupons, 
  addProduct, 
  deleteProduct, 
  updateProduct, 
  createOrder, 
  deleteReview, 
  addReview, 
  updateHeroText as updateHeroTextInDb, 
  updateOrderStatus, 
  toggleOrderPaymentStatus, 
  addCoupon, 
  deleteCoupon,
  saveCustomer,
  getCustomers,
  getCategories,
  updateCategories,
  DEFAULT_CATEGORIES
} from './services/firebaseDb';

// Custom Modular Components
import WhyChooseUs from './components/WhyChooseUs';
import InstagramGallery from './components/InstagramGallery';
import TrackOrderModal from './components/TrackOrderModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsConditionsModal from './components/TermsConditionsModal';
import { SearchDrawer, WishlistDrawer, AccountDrawer } from './components/Drawers';
import ProductModal from './components/ProductModal';
import SellerPortal from './components/SellerPortal';
// @ts-ignore
import heroImage from './assets/images/zerish_luxe_hero_1783332542018.jpg';
// @ts-ignore
import antiTarnishJewelryImg from './assets/images/anti_tarnish_jewelry_1783515904907.jpg';
// @ts-ignore
import modelWearingJewelryImg from './assets/images/elegance_jewelry_model_1783579675029.jpg';
// @ts-ignore
import outstandingJewelryModelImg from './assets/images/outstanding_jewelry_model_1783580377732.jpg';
// @ts-ignore
import beautifulMinimalJewelryImg from './assets/images/beautiful_minimal_jewelry_1783580876040.jpg';
// @ts-ignore
import jewelryWithFlowersImg from './assets/images/jewelry_with_flowers_1783581030429.jpg';
// @ts-ignore
import goldJewelrySatinFlowersImg from './assets/images/gold_jewelry_satin_flowers_1783581310352.jpg';
// @ts-ignore
import editorialEmeraldJewelryModelImg from './assets/images/editorial_emerald_jewelry_model_1783753450701.jpg';
// @ts-ignore
import jewelryCuffsModelImg from './assets/images/jewelry_cuffs_model_1783753646780.jpg';
// @ts-ignore
import modestModelRightGoldJewelryImg from './assets/images/modest_model_right_gold_jewelry_1783755207971.jpg';
// @ts-ignore
import highQualityModestJewelryModelImg from './assets/images/high_quality_modest_jewelry_model_1783755409802.jpg';
// @ts-ignore
import modestOpenHairModelJewelryImg from './assets/images/modest_open_hair_model_jewelry_1783755798891.jpg';
// @ts-ignore
import luxuryJewelryModestBannerImg from './assets/images/luxury_jewelry_modest_banner_1783756629266.jpg';
// @ts-ignore
import luxuryJewelryModestBannerV2Img from './assets/images/luxury_jewelry_modest_banner_v2_1783756827703.jpg';
// @ts-ignore
import luxuryJewelryVNeckBannerImg from './assets/images/luxury_jewelry_v_neck_banner_1783756960523.jpg';
// @ts-ignore
import luxuryVneckAdCuffBannerImg from './assets/images/luxury_vneck_ad_cuff_banner_1783757089887.jpg';

const HERO_VIDEO_URL = 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-girl-wearing-jewelry-40545-large.mp4';

const HERO_FRAMES = [
  luxuryVneckAdCuffBannerImg,
  luxuryJewelryVNeckBannerImg,
  luxuryJewelryModestBannerV2Img,
];

export default function App() {
  const [heroVideoUrl, setHeroVideoUrl] = useState(HERO_VIDEO_URL);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % HERO_FRAMES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  // --- STATE PERSISTENCE ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('zl_products');
    if (!saved) return INITIAL_PRODUCTS;
    try {
      const parsed = JSON.parse(saved) as Product[];
      const parsedIds = new Set(parsed.map(p => p.id));
      const missing = INITIAL_PRODUCTS.filter(p => !parsedIds.has(p.id));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        localStorage.setItem('zl_products', JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zl_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('zl_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('zl_orders');
    if (saved) return JSON.parse(saved);
    // Initialize with 2 default orders to make the Seller Analytics look spectacular from day 1!
    const defaults: Order[] = [
      {
        id: 'ZL-4291',
        customerName: 'Anjali Nair',
        phoneNumber: '9446012345',
        city: 'Kochi',
        state: 'Kerala',
        postalCode: '682016',
        items: [
          { product: INITIAL_PRODUCTS[0], quantity: 1 } // Herringbone
        ],
        total: 1899,
        discount: 0,
        status: 'Delivered',
        date: 'Jul 4, 2026',
        trackingNumber: 'ZL-TRACK-4291'
      },
      {
        id: 'ZL-8910',
        customerName: 'Keerthana S',
        phoneNumber: '9840123456',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600001',
        items: [
          { product: INITIAL_PRODUCTS[10], quantity: 1 } // Baroque Drops
        ],
        total: 2190,
        discount: 0,
        status: 'Dispatched',
        date: 'Jul 5, 2026',
        trackingNumber: 'ZL-TRACK-8910'
      }
    ];
    localStorage.setItem('zl_orders', JSON.stringify(defaults));
    return defaults;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('zl_coupons');
    if (saved) return JSON.parse(saved);
    const defaults: Coupon[] = [];
    localStorage.setItem('zl_coupons', JSON.stringify(defaults));
    return defaults;
  });

  const [heroText, setHeroText] = useState(() => {
    const saved = localStorage.getItem('zl_hero_text');
    return saved ? JSON.parse(saved) : {
      title: 'Minimal Elegance.',
      subtitle: 'Everyday Luxury.'
    };
  });

  const [reviews, setReviews] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('zl_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return TESTIMONIALS;
      }
    }
    return TESTIMONIALS;
  });

  const [categories, setCategories] = useState<CategorySetting[]>(() => {
    const saved = localStorage.getItem('zl_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('zl_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('zl_categories', JSON.stringify(categories));
  }, [categories]);

  // --- UI TRIGGERS ---
  const [activeTab, setActiveTab] = useState<
    'chains' | 'necklaces' | 'bracelets' | 'cuff-bracelets' | 'drop-earrings' | 'stud-earrings' | 'hair-accessories' | 'new-arrivals' | 'best-sellers' | 'gift-collection' | 'rings'
  >('best-sellers');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  // --- SEPARATION OF WEBSITE MODE ---
  const [viewMode, setViewMode] = useState<'customer' | 'seller'>(() => {
    const saved = localStorage.getItem('zl_view_mode');
    return (saved === 'seller' || saved === 'customer') ? saved : 'customer';
  });

  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState(false);
  const [customers, setCustomers] = useState<UserAccount[]>([]);
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPassword, setSellerPassword] = useState('');
  const [sellerRegisterKey, setSellerRegisterKey] = useState('');
  const [sellerAuthTab, setSellerAuthTab] = useState<'login' | 'register'>('login');
  const [sellerLoginError, setSellerLoginError] = useState('');

  useEffect(() => {
    localStorage.setItem('zl_view_mode', viewMode);
  }, [viewMode]);

  // Auth Status listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSellerAuthenticated(true);
      } else {
        setIsSellerAuthenticated(false);
      }
    });
    return unsubscribe;
  }, []);

  // Synchronize customer-facing states with Firestore on mount
  useEffect(() => {
    seedDatabaseIfEmpty().then(() => {
      getProducts().then(setProducts).catch(err => console.error('Firestore getProducts error:', err));
      getReviews().then(setReviews).catch(err => console.error('Firestore getReviews error:', err));
      getHeroText().then(setHeroText).catch(err => console.error('Firestore getHeroText error:', err));
      getCategories().then(setCategories).catch(err => console.error('Firestore getCategories error:', err));
    });
  }, []);

  // Synchronize seller-specific secure states when logged in
  const fetchSellerData = async () => {
    try {
      const ordersData = await getOrders();
      setOrders(ordersData);

      const couponsData = await getCoupons();
      setCoupons(couponsData);

      const customersData = await getCustomers();
      setCustomers(customersData);
    } catch (err) {
      console.error('Error loading seller data from Firestore:', err);
    }
  };

  useEffect(() => {
    if (isSellerAuthenticated && viewMode === 'seller') {
      fetchSellerData();
    }
  }, [isSellerAuthenticated, viewMode]);

  const handleSellerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerEmail.trim() || !sellerPassword.trim()) return;

    try {
      if (sellerAuthTab === 'register') {
        if (sellerRegisterKey.trim() !== 'zerish2026') {
          setSellerLoginError('Invalid Registration Key. Access denied.');
          return;
        }
        await createUserWithEmailAndPassword(auth, sellerEmail, sellerPassword);
        alert('Merchant account successfully registered!');
        setSellerAuthTab('login');
        setSellerLoginError('');
      } else {
        await signInWithEmailAndPassword(auth, sellerEmail, sellerPassword);
        setSellerLoginError('');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setSellerLoginError(err.message || 'Failed to authenticate.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
    setIsSellerAuthenticated(false);
    setViewMode('customer');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('admin') === 'true' || 
      params.get('seller') === 'true' || 
      params.get('mode') === 'seller' ||
      window.location.pathname === '/seller'
    ) {
      setViewMode('seller');
      // Clean up the URL path and query params to keep them clean
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  // --- CART & DISCOUNTS ---
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  // --- CHECKOUT PROCESS ---
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState<OrderDetails>({
    customerName: '',
    phoneNumber: '',
    city: '',
    postalCode: '',
    state: ''
  });
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null); // tracking ID
  const [lastOrderTotal, setLastOrderTotal] = useState<number>(0);
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState<string>('');

  // --- CUSTOMER USER ACCOUNT ---
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('zl_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('zl_current_user', JSON.stringify(currentUser));
      setCheckoutDetails({
        customerName: currentUser.name,
        phoneNumber: currentUser.phoneNumber,
        city: currentUser.city,
        state: currentUser.state,
        postalCode: currentUser.postalCode
      });
    } else {
      localStorage.removeItem('zl_current_user');
      setCheckoutDetails({
        customerName: '',
        phoneNumber: '',
        city: '',
        state: '',
        postalCode: ''
      });
    }
  }, [currentUser]);

  const handleUserSignUp = (newAccount: UserAccount) => {
    setCurrentUser(newAccount);
    setIsAccountOpen(false);
    // Save customer/user data to Firestore
    saveCustomer(newAccount).catch(err => console.error('Error saving customer data:', err));
  };

  const handleUserLogOut = () => {
    setCurrentUser(null);
  };

  // --- SEARCH, FILTERS, & SORTING ---
  const [priceRange, setPriceRange] = useState(3000);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'newest'>('newest');
  const [searchGridQuery, setSearchGridQuery] = useState('');

  // --- CONTACT FORM STATE ---
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCity, setContactCity] = useState('');
  const [contactState, setContactState] = useState('');
  const [contactCategory, setContactCategory] = useState('necklaces');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  // --- INSIDER NEWSLETTER STATE ---
  const [insiderEmail, setInsiderEmail] = useState('');
  const [insiderSuccess, setInsiderSuccess] = useState(false);

  // --- CLIENT REVIEW FORM STATE ---
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewState, setReviewState] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewQuote, setReviewQuote] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewQuote.trim()) return;

    const initials = reviewName
      .trim()
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newReview = {
      id: `rev-${Date.now()}`,
      name: reviewName.trim(),
      city: reviewCity.trim() || 'Kochi',
      state: reviewState.trim() || 'Kerala',
      rating: reviewRating,
      quote: reviewQuote.trim(),
      avatarInitials: initials || 'ZL'
    };

    // Save to Firestore
    addReview(newReview).catch(err => console.error('Error submitting review to Firestore:', err));

    setReviews(prev => [newReview, ...prev]);
    setReviewName('');
    setReviewCity('');
    setReviewState('');
    setReviewRating(5);
    setReviewQuote('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('zl_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('zl_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zl_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('zl_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('zl_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('zl_hero_text', JSON.stringify(heroText));
  }, [heroText]);

  // --- HANDLERS ---
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev => prev.map(item => 
        item.product.id === productId ? { ...item, quantity: qty } : item
      ));
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleToggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    const found = coupons.find(c => c.code === code);

    if (found) {
      setAppliedCoupon(found);
    } else {
      setCouponError('Invalid coupon code.');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutDetails.customerName.trim() || !checkoutDetails.phoneNumber.trim()) return;

    if (/[^\d]/.test(checkoutDetails.phoneNumber) || /[^\d]/.test(checkoutDetails.postalCode)) {
      return;
    }

    if (!currentUser) {
      const guestAccount: UserAccount = {
        name: checkoutDetails.customerName.trim(),
        phoneNumber: checkoutDetails.phoneNumber.trim(),
        city: checkoutDetails.city.trim(),
        state: checkoutDetails.state.trim(),
        postalCode: checkoutDetails.postalCode.trim(),
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
      setCurrentUser(guestAccount);
    }

    const subtotal = cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
    const isFreeShipping = subtotal >= 499 || subtotal === 0;
    const shippingFee = isFreeShipping ? 0 : 49;
    let discount = 0;
    if (appliedCoupon) {
      discount = appliedCoupon.type === 'percent' 
        ? Math.round(subtotal * (appliedCoupon.value / 100))
        : appliedCoupon.value;
    }
    const finalTotal = Math.max(0, subtotal - discount + shippingFee);

    const trackingCode = `ZL-TRACK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderId = `ZL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: newOrderId,
      customerName: checkoutDetails.customerName,
      phoneNumber: checkoutDetails.phoneNumber,
      city: checkoutDetails.city,
      state: checkoutDetails.state,
      postalCode: checkoutDetails.postalCode,
      items: [...cart],
      total: finalTotal,
      discount,
      couponApplied: appliedCoupon?.code,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      trackingNumber: trackingCode
    };

    // Construct detailed WhatsApp message containing products and order info
    const itemsText = cart.map(item => `- ${item.product.name} x ${item.quantity} (₹${item.product.price.toLocaleString('en-IN')})`).join('\n');
    const couponText = appliedCoupon ? `\n*Coupon Code:* ${appliedCoupon.code} (-₹${discount.toLocaleString('en-IN')})` : '';
    const shippingText = isFreeShipping ? 'FREE' : `₹${shippingFee}`;
    
    const whatsappMessage = `Hi Zerish Luxe! I just submitted a jewelry enquiry list on your website.\n\n` +
      `*Enquiry ID:* ${newOrderId}\n` +
      `*Tracking Code:* ${trackingCode}\n` +
      `*Customer Name:* ${checkoutDetails.customerName}\n` +
      `*Phone:* ${checkoutDetails.phoneNumber}\n` +
      `*Location:* ${checkoutDetails.city}, ${checkoutDetails.state}\n` +
      `*Pincode:* ${checkoutDetails.postalCode}\n\n` +
      `*Enquiry Items:*\n${itemsText}\n\n` +
      `*Estimated Value:* ₹${subtotal.toLocaleString('en-IN')}${couponText}\n` +
      `*Shipping:* ${shippingText}\n` +
      `*Total Enquiry Value:* ₹${finalTotal.toLocaleString('en-IN')}\n\n` +
      `Please contact me regarding pricing and customization of my curated pieces!`;

    const whatsappUrl = `https://wa.me/919916026262?text=${encodeURIComponent(whatsappMessage)}`;
    setLastWhatsappUrl(whatsappUrl);

    // Auto-open WhatsApp in a new tab/window, or fall back to current tab if popup is blocked
    try {
      const newWin = window.open(whatsappUrl, '_blank');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch (e) {
      window.location.href = whatsappUrl;
    }

    // Update stocks
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(item => item.product.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, (p.stock || 15) - cartItem.quantity) };
      }
      return p;
    }));

    // Save order to Firestore
    createOrder(newOrder).catch(err => console.error('Error creating order in Firestore:', err));

    // Save customer/guest details to Firestore
    const customerToSave: UserAccount = currentUser || {
      name: checkoutDetails.customerName.trim(),
      phoneNumber: checkoutDetails.phoneNumber.trim(),
      city: checkoutDetails.city.trim(),
      state: checkoutDetails.state.trim(),
      postalCode: checkoutDetails.postalCode.trim(),
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    saveCustomer(customerToSave).catch(err => console.error('Error saving customer data:', err));

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    setCouponInput('');
    setLastOrderTotal(finalTotal);
    setCheckoutSuccess(trackingCode);
  };

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>): Promise<void> => {
    const id = `prod-${Date.now()}`;
    const fullProduct = { ...newProduct, id };
    try {
      await addProduct(fullProduct);
      setProducts(prev => [fullProduct, ...prev]);
    } catch (err: any) {
      console.error('Error saving product to Firestore:', err);
      throw err;
    }
  };

  const handleDeleteProduct = async (id: string): Promise<void> => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error('Error deleting product from Firestore:', err);
      throw err;
    }
  };

  const handleDeleteReview = async (id: string): Promise<void> => {
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      console.error('Error deleting review from Firestore:', err);
      throw err;
    }
  };

  const handleUpdateProduct = async (updated: Product): Promise<void> => {
    try {
      await updateProduct(updated);
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch (err: any) {
      console.error('Error updating product in Firestore:', err);
      throw err;
    }
  };

  const handleResetCatalog = async () => {
    if (confirm('Revert catalog to luxury starting default items? This clears custom edits.')) {
      try {
        const { db } = await import('./firebase');
        const { collection, getDocs, deleteDoc, doc } = await import('firebase/firestore');
        const snapshot = await getDocs(collection(db, 'products'));
        const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'products', d.id)));
        await Promise.all(deletePromises);
        await seedDatabaseIfEmpty();
        const freshProds = await getProducts();
        setProducts(freshProds);
        alert('Catalog successfully reset to defaults!');
      } catch (err) {
        console.error('Error resetting catalog:', err);
      }
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'Pending' | 'Dispatched' | 'Delivered') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    updateOrderStatus(orderId, status).catch(err => console.error('Error updating order status in Firestore:', err));
  };

  const handleTogglePaymentStatus = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isPaid: !o.isPaid } : o));

    toggleOrderPaymentStatus(orderId).catch(err => console.error('Error toggling payment status in Firestore:', err));
  };

  const handleAddCoupon = (newCp: Coupon) => {
    setCoupons(prev => [newCp, ...prev]);

    addCoupon(newCp).catch(err => console.error('Error adding coupon to Firestore:', err));
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));

    deleteCoupon(code).catch(err => console.error('Error deleting coupon from Firestore:', err));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/[^\d]/.test(contactPhone)) {
      setContactError('Phone number must contain numbers only.');
      return;
    }
    setContactError('');
    setContactSuccess(true);
    
    // Save to Firestore
    import('./firebase').then(({ db }) => {
      import('firebase/firestore').then(({ collection, addDoc }) => {
        addDoc(collection(db, 'contacts'), {
          name: contactName, 
          phone: contactPhone, 
          city: contactCity, 
          state: contactState, 
          category: contactCategory, 
          message: contactMsg,
          date: new Date().toLocaleDateString()
        }).catch(err => console.error('Error saving contact query to Firestore:', err));
      });
    });

    // Construct the WhatsApp message
    const formattedCategory = contactCategory
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const whatsappMessage = `Hi Zerish Luxe! I am interested in placing an enquiry.\n\n` +
      `*Name:* ${contactName}\n` +
      `*Phone:* ${contactPhone}\n` +
      `*City:* ${contactCity}\n` +
      `*State:* ${contactState}\n` +
      `*Product Category:* ${formattedCategory}\n` +
      `*Message:* ${contactMsg}`;

    const whatsappUrl = `https://wa.me/919916026262?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Auto-open WhatsApp in a new tab/window, or fall back to current tab if popup is blocked
    try {
      const newWin = window.open(whatsappUrl, '_blank');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch (e) {
      window.location.href = whatsappUrl;
    }

    setContactName('');
    setContactPhone('');
    setContactCity('');
    setContactState('');
    setContactCategory('necklaces');
    setContactMsg('');
    setTimeout(() => setContactSuccess(false), 4000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInsiderSuccess(true);

    fetch('/api/customer/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: insiderEmail })
    }).catch(err => console.error(err));

    setInsiderEmail('');
    setTimeout(() => setInsiderSuccess(false), 4000);
  };

  // --- FILTERED GRID ALGORITHM ---
  const filteredProducts = products.filter(p => {
    // 1. Tab selection
    let matchTab = false;
    if (activeTab === 'new-arrivals') matchTab = !!p.isNew;
    else if (activeTab === 'best-sellers') matchTab = !!p.isBestSeller;
    else if (activeTab === 'gift-collection') matchTab = !!p.isGift;
    else if (activeTab === 'chains') matchTab = p.category === 'chains';
    else if (activeTab === 'necklaces') matchTab = p.category === 'necklaces';
    else if (activeTab === 'bracelets') matchTab = p.category === 'bracelets';
    else if (activeTab === 'cuff-bracelets') matchTab = p.category === 'cuff-bracelets';
    else if (activeTab === 'drop-earrings') matchTab = p.category === 'drop-earrings';
    else if (activeTab === 'stud-earrings') matchTab = p.category === 'stud-earrings';
    else if (activeTab === 'hair-accessories') matchTab = p.category === 'hair-accessories';
    else if (activeTab === 'rings') matchTab = p.category === 'rings';

    // 2. Price slider
    const matchPrice = p.price <= priceRange;

    // 3. Grid search filter
    const matchSearch = p.name.toLowerCase().includes(searchGridQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchGridQuery.toLowerCase());

    return matchTab && matchPrice && matchSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8);
    return 0; // newest / default initial order
  });

  // Subtotal in Cart Drawer
  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const isFreeShipping = cartSubtotal >= 499 || cartSubtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 49;
  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount = appliedCoupon.type === 'percent' 
      ? Math.round(cartSubtotal * (appliedCoupon.value / 100))
      : appliedCoupon.value;
  }
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Separate Seller Portal Website View
  if (viewMode === 'seller') {
    if (!isSellerAuthenticated) {
      return (
        <div className="min-h-screen bg-[#FBF9F6] text-espresso flex items-center justify-center p-4 selection:bg-terracotta selection:text-white">
          <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-sm border border-espresso/15 shadow-2xl relative">
            <button 
              onClick={() => setViewMode('customer')}
              className="absolute top-4 right-4 text-xs font-mono uppercase tracking-widest text-taupe hover:text-espresso transition-colors cursor-pointer"
            >
              Exit to Shop
            </button>
            <div className="text-center mb-6">
              <Sparkles className="w-8 h-8 text-terracotta mx-auto mb-3" />
              <h2 className="font-serif text-2xl font-semibold tracking-wide text-espresso">Merchant Access</h2>
              <p className="text-[10px] text-taupe uppercase tracking-widest mt-1">Zerish Luxe Partner Portal</p>
            </div>

            {/* Login / Register tab selectors */}
            <div className="flex border-b border-espresso/10 mb-5 text-[11px] font-bold uppercase tracking-wider text-center">
              <button
                type="button"
                className={`w-1/2 pb-2 transition-all ${
                  sellerAuthTab === 'login' 
                    ? 'text-terracotta border-b-2 border-terracotta' 
                    : 'text-taupe hover:text-espresso'
                }`}
                onClick={() => {
                  setSellerAuthTab('login');
                  setSellerLoginError('');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`w-1/2 pb-2 transition-all ${
                  sellerAuthTab === 'register' 
                    ? 'text-terracotta border-b-2 border-terracotta' 
                    : 'text-taupe hover:text-espresso'
                }`}
                onClick={() => {
                  setSellerAuthTab('register');
                  setSellerLoginError('');
                }}
              >
                Register Admin
              </button>
            </div>
            
            <form onSubmit={handleSellerLogin} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">
                  Email Address
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="admin@zerishluxe.com"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">
                  Security Password
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={sellerPassword}
                  onChange={(e) => setSellerPassword(e.target.value)}
                  className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden"
                />
              </div>

              {sellerAuthTab === 'register' && (
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1 text-terracotta">
                    Merchant Registration Key
                  </label>
                  <input 
                    type="password" 
                    required
                    placeholder="Enter registration key (zerish2026)"
                    value={sellerRegisterKey}
                    onChange={(e) => setSellerRegisterKey(e.target.value)}
                    className="w-full border border-terracotta/30 p-2 text-xs text-espresso bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden font-mono"
                  />
                  <p className="text-[8px] text-taupe/80 italic mt-1 leading-relaxed">
                    A secure authentication key is required to register a brand administrator.
                  </p>
                </div>
              )}

              {sellerLoginError && (
                <p className="text-[10px] text-red-600 font-semibold leading-relaxed border border-red-200/50 bg-red-50/50 p-2">
                  ⚠️ {sellerLoginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-espresso text-[#FAF8F6] hover:bg-terracotta text-[10px] uppercase tracking-widest font-extrabold shadow-md transition-all cursor-pointer mt-2"
              >
                {sellerAuthTab === 'register' ? 'Create Luxury Credential' : 'Unlock Dashboard'}
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <SellerPortal 
        isOpen={true}
        onClose={handleLogout}
        products={products}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetCatalog={handleResetCatalog}
        onUpdateProduct={handleUpdateProduct}
        orders={orders}
        customers={customers}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onTogglePaymentStatus={handleTogglePaymentStatus}
        coupons={coupons}
        onAddCoupon={handleAddCoupon}
        onDeleteCoupon={handleDeleteCoupon}
        heroText={heroText}
        onUpdateHeroText={(newText) => {
          setHeroText(newText);
          updateHeroTextInDb(newText.title, newText.subtitle).catch(err => console.error('Error updating hero text in Firestore:', err));
        }}
        reviews={reviews}
        onDeleteReview={handleDeleteReview}
        categories={categories}
        onUpdateCategories={async (newCats) => {
          setCategories(newCats);
          try {
            await updateCategories(newCats);
          } catch (err) {
            console.error('Error updating categories in Firestore:', err);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F1F0] text-espresso selection:bg-terracotta selection:text-white font-sans pb-16 lg:pb-0">
      
      {/* ======================================================== */}
      {/* --- PREMIUM HEADER --- */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-espresso/10 transition-all duration-300">
        
        {/* Top announcement bar */}
        <div className="bg-terracotta text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 text-[8px] sm:text-[9.5px] uppercase tracking-widest flex items-center justify-between w-full gap-4">
            <div className="flex items-center space-x-1 font-semibold text-white/95">
              <span className="text-[9px] sm:text-[10px] leading-none">✨</span>
              <span className="hidden sm:inline">Handpicked with love, made to last a lifetime</span>
              <span className="sm:hidden">Handpicked with love</span>
              <span className="text-[9px] sm:text-[10px] leading-none">✨</span>
            </div>
            <div className="flex items-center space-x-1 font-semibold text-white/95 shrink-0">
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>FREE SHIPPING ABOVE ₹499 (India)</span>
            </div>
          </div>
        </div>

        {/* Navigation Core */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3.5 flex flex-row items-center justify-between gap-4 w-full">
          
          {/* Logo element left */}
          <div 
            className="flex flex-col items-center cursor-pointer select-none" 
            onClick={() => {
              setViewMode('customer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveTab('best-sellers');
            }}
          >
            <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-light tracking-[0.25em] pl-[0.25em] text-espresso uppercase leading-none">
              ZERISH
            </span>
            <div className="flex items-center justify-center w-full mt-1.5 gap-1.5">
              <div className="h-[0.5px] w-4 sm:w-5 bg-espresso/30"></div>
              <span className="text-[10px] sm:text-[11.5px] tracking-[0.35em] pl-[0.35em] text-espresso/80 font-bold uppercase leading-none shrink-0">
                LUXE
              </span>
              <div className="h-[0.5px] w-4 sm:w-5 bg-espresso/30"></div>
            </div>
          </div>

          {/* Desktop Links and Icons grouped on the right to bring links near the search icon */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <nav className="hidden lg:flex items-center space-x-8 text-xs font-serif font-light tracking-[0.15em] uppercase text-espresso/80">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveTab('best-sellers');
                }} 
                className="hover:text-terracotta transition-colors cursor-pointer"
              >
                HOME
              </button>

              {/* Curated Collection Dropdown */}
              <div className="relative group">
                <button className="hover:text-terracotta transition-colors flex items-center space-x-1 uppercase tracking-[0.15em] font-light font-serif cursor-pointer py-1">
                  <span>Curated Collection</span>
                  <ChevronDown className="w-3 h-3 stroke-[1.8]" />
                </button>
                {/* Dropdown elements */}
                <div className="absolute left-0 mt-1 w-52 bg-[#FAF8F6] border border-espresso/15 shadow-xl rounded-xs py-2 hidden group-hover:block z-50">
                  {[
                    { id: 'chains', label: 'Chains' },
                    { id: 'necklaces', label: 'Necklaces' },
                    { id: 'rings', label: 'Rings' },
                    { id: 'bracelets', label: 'Bracelets' },
                    { id: 'cuff-bracelets', label: 'Cuff Bangles' },
                    { id: 'drop-earrings', label: 'Drop Earrings' },
                    { id: 'stud-earrings', label: 'Stud Earrings' },
                    { id: 'hair-accessories', label: 'Hair Accessories' }
                  ].map(item => (
                    <button 
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        const el = document.getElementById('shop');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="block w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-widest font-extrabold text-espresso hover:bg-linen/45 hover:text-terracotta transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <a 
                href="#story" 
                className="hover:text-terracotta transition-colors"
              >
                About Us
              </a>
            </nav>

            {/* Vertical separator visible on desktop */}
            <div className="hidden lg:block h-4 w-[1px] bg-espresso/20"></div>

            {/* Right Action drawer triggers */}
            <div className="flex items-center space-x-4 text-espresso">
              
              <button onClick={() => setIsSearchOpen(true)} className="p-1 hover:text-terracotta transition-colors cursor-pointer" title="Search">
                <Search className="w-4.5 h-4.5" />
              </button>
              
              <button onClick={() => setIsWishlistOpen(true)} className="p-1 hover:text-terracotta transition-colors relative cursor-pointer" title="Saved Wishlist">
                <Heart className="w-4.5 h-4.5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-terracotta text-white text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              
              <button onClick={() => setIsAccountOpen(true)} className="p-1 hover:text-terracotta transition-colors cursor-pointer" title="My Account">
                <User className="w-4.5 h-4.5" />
              </button>
              
              <button onClick={() => setIsCartOpen(true)} className="p-1 hover:text-terracotta transition-colors relative cursor-pointer" title="Enquiry Bag">
                <ShoppingBag className="w-4.5 h-4.5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-espresso text-white text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {cart.reduce((sum, it) => sum + it.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Seller Portal is hidden from customers in the header */}

            </div>
          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* --- LUXURY HERO LANDING SECTION WITH DOT NAVIGATION --- */}
      {/* ======================================================== */}
      <section className="relative flex flex-col lg:flex-row lg:items-center min-h-0 lg:h-[calc(100vh-100px)] overflow-hidden bg-[#FAF8F6] border-b border-espresso/5">
        
        {/* Background Frames with premium cross-fade transition */}
        <div className="relative lg:absolute w-full h-64 sm:h-80 md:h-96 lg:h-full lg:inset-0 z-0 shrink-0 overflow-hidden">
          {HERO_FRAMES.map((src, idx) => (
            <img 
              key={idx}
              src={src} 
              alt={`Luxury gold jewelry frame ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-center lg:object-right transition-opacity duration-[1200ms] ease-in-out ${
                currentFrame === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{ transitionProperty: 'opacity, transform' }}
              referrerPolicy="no-referrer"
            />
          ))}
          {/* Soft premium ambient overlay to ensure beautiful contrast */}
          <div className="absolute inset-0 bg-white/10 lg:bg-transparent z-[1]" />

          {/* Slide Indicator Dots - nested inside the image block for perfect alignment on mobile and desktop */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-espresso/10 shadow-sm">
            {HERO_FRAMES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentFrame(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentFrame === idx 
                    ? 'bg-terracotta w-5' 
                    : 'bg-espresso/30 hover:bg-espresso/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                title={`View slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Content Overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-8 sm:py-12 lg:py-24">
          <div className="max-w-xl space-y-6 sm:space-y-8 bg-transparent p-2 sm:p-0 rounded-none border-none shadow-none">
            


            <h1 className="font-serif text-4xl sm:text-6xl font-light text-espresso leading-none tracking-tight">
              Minimal. Timeless.
              <span className="block italic text-terracotta font-normal mt-2">Made to Last.</span>
            </h1>

            <div className="flex items-center space-x-3 text-terracotta">
              <div className="h-[0.5px] w-12 bg-terracotta/40"></div>
              <span className="text-xs">✦</span>
              <div className="h-[0.5px] w-12 bg-terracotta/40"></div>
            </div>

            <p className="text-sm text-espresso/90 leading-relaxed font-sans max-w-sm font-medium">
              Handpicked minimal earrings & chains that stay with you every moment, every day. 100% waterproof, sweatproof and anti-tarnish designed for modern elegance.
            </p>

            {/* CTA Keys */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href="#shop" 
                onClick={() => {
                  setActiveTab('best-sellers');
                  const el = document.getElementById('shop');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-terracotta text-white hover:bg-espresso text-[11px] uppercase tracking-[0.2em] font-bold text-center transition-all cursor-pointer hover:scale-[1.02] active:scale-95 duration-200"
              >
                Shop Collection
              </a>
              <a 
                href="#shop" 
                onClick={() => {
                  setActiveTab('gift-collection');
                  const el = document.getElementById('shop');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 border border-terracotta text-terracotta hover:bg-terracotta hover:text-white text-[11px] uppercase tracking-[0.2em] font-bold text-center transition-all bg-white/40 cursor-pointer hover:scale-[1.02] active:scale-95 duration-200"
              >
                Gift Collection
              </a>
            </div>

            {/* 3 Inline Trust Items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-espresso/15 text-espresso pt-6">
              <div className="flex items-center space-x-2.5">
                <div className="text-terracotta">
                  <Droplet className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest leading-none">Tarnish Resistant</p>
                  <p className="text-[8px] text-taupe uppercase font-bold mt-1">Premium Quality</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="text-terracotta">
                  <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest leading-none">Long Lasting</p>
                  <p className="text-[8px] text-taupe uppercase font-bold mt-1">Made to Stay</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="text-terracotta">
                  <Heart className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest leading-none">Handpicked</p>
                  <p className="text-[8px] text-taupe uppercase font-bold mt-1">With Love</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ======================================================== */}
      {/* --- SHOP BY CATEGORY (VISUAL GRID FROM IMAGE) --- */}
      {/* ======================================================== */}
      <section className="py-16 bg-white border-t border-b border-espresso/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-terracotta font-bold">Discover</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-espresso mt-1 uppercase tracking-[0.1em]">
              Shop By Category
            </h2>
            <div className="flex items-center justify-center space-x-2 mt-2 text-terracotta/60">
              <div className="h-[0.5px] w-6 bg-terracotta/30"></div>
              <span className="text-[10px]">✦</span>
              <div className="h-[0.5px] w-6 bg-terracotta/30"></div>
            </div>
          </div>

          {/* 7 Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 sm:gap-8">
            {categories.map((cat, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setActiveTab(cat.tabId as any);
                  const el = document.getElementById('shop');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex flex-col items-center text-center cursor-pointer select-none"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-[#FAF8F6] overflow-hidden rounded-xs border border-espresso/5 shadow-xs group-hover:shadow-md group-hover:border-terracotta/30 transition-all duration-300">
                  <img 
                    src={cat.imageUrl} 
                    alt={cat.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-espresso/5 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>

                {/* Dynamic Title */}
                <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-espresso mt-3 group-hover:text-terracotta transition-colors">
                  {cat.title}
                </span>
                {cat.subtitle && (
                  <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-taupe mt-0.5 border-t border-espresso/10 pt-0.5 w-12 group-hover:text-terracotta transition-colors">
                    {cat.subtitle}
                  </span>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* --- PRECISE INLINE TRUST BADGES ROW (FROM IMAGE) --- */}
      {/* ======================================================== */}
      <section className="bg-linen/40 border-b border-espresso/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center md:divide-x md:divide-espresso/10">
            
            {/* Badge 1 */}
            <div className="flex flex-col items-center px-4 space-y-2">
              <Truck className="w-6 h-6 text-espresso/85 stroke-[1.2]" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-espresso">Shipping All Over India</p>
                <p className="text-[8px] tracking-wider text-taupe uppercase font-semibold mt-0.5">FREE SHIPPING ABOVE ₹499</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex flex-col items-center px-4 space-y-2">
              <ShieldCheck className="w-6 h-6 text-espresso/85 stroke-[1.2]" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-espresso">Water Resistant & Anti Tarnish</p>
                <p className="text-[8px] tracking-wider text-taupe uppercase font-semibold mt-0.5">Long Lasting Shine</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex flex-col items-center px-4 space-y-2">
              <Award className="w-6 h-6 text-espresso/85 stroke-[1.2]" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-espresso">Premium Quality Materials</p>
                <p className="text-[8px] tracking-wider text-taupe uppercase font-semibold mt-0.5">Hypoallergenic & Skin Friendly</p>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="flex flex-col items-center px-4 space-y-2">
              <ShoppingBag className="w-6 h-6 text-espresso/85 stroke-[1.2]" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-espresso">Beautifully Packed</p>
                <p className="text-[8px] tracking-wider text-taupe uppercase font-semibold mt-0.5">Ready to Gift</p>
              </div>
            </div>

            {/* Badge 5 */}
            <div className="flex flex-col items-center px-4 space-y-2 col-span-2 md:col-span-1">
              <Heart className="w-6 h-6 text-espresso/85 stroke-[1.2]" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-espresso">Handpicked With Love</p>
                <p className="text-[8px] tracking-wider text-taupe uppercase font-semibold mt-0.5">Just For You</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* --- ACTIVE SHOP CATEGORY GRID & FILTERS --- */}
      {/* ======================================================== */}
      <section id="shop" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">Our Curation</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-espresso mt-2 tracking-tight">Shop By Category</h2>
          <div className="w-12 h-[1px] bg-taupe mx-auto mt-4"></div>
        </div>

        {/* Dynamic Category Tabs Navigation */}
        <div className="flex overflow-x-auto no-scrollbar space-x-3 pb-4 mb-8 border-b border-espresso/10">
          {[
            { id: 'best-sellers', label: 'Best Sellers' },
            { id: 'gift-collection', label: 'Gift Collection' },
            { id: 'chains', label: 'Chains' },
            { id: 'necklaces', label: 'Necklaces' },
            { id: 'rings', label: 'Rings' },
            { id: 'bracelets', label: 'Bracelets' },
            { id: 'cuff-bracelets', label: 'Cuff Bangles' },
            { id: 'drop-earrings', label: 'Drop Earrings' },
            { id: 'stud-earrings', label: 'Stud Earrings' },
            { id: 'hair-accessories', label: 'Hair Accessories' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-extrabold transition-all duration-300 flex-shrink-0 cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-espresso text-[#FAF8F6] shadow-sm' 
                  : 'bg-white border border-espresso/10 text-espresso/70 hover:border-terracotta/40 hover:text-espresso'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters/Sort bar dashboard */}
        <div className="bg-white border border-espresso/10 p-4 rounded-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Slider price range */}
          <div className="flex items-center space-x-3">
            <Sliders className="w-4.5 h-4.5 text-terracotta" />
            <div className="text-[11px] font-semibold">
              Max Price: <span className="font-bold text-espresso">₹{priceRange}</span>
            </div>
            <input 
              type="range" 
              min="800" 
              max="3000" 
              step="50"
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="accent-terracotta cursor-pointer w-24 sm:w-36 h-1 bg-[#FAF8F6] rounded-lg"
            />
          </div>

          {/* Local Grid Search */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search active view..."
              value={searchGridQuery}
              onChange={(e) => setSearchGridQuery(e.target.value)}
              className="border border-espresso/15 py-1.5 px-3 pr-8 text-[11px] text-espresso bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden rounded-xs w-full sm:w-48"
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-taupe" />
          </div>

          {/* Sort selection dropdown */}
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-taupe font-semibold">Sort:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-espresso/15 p-1 px-2 text-espresso bg-white focus:outline-hidden focus:border-terracotta rounded-xs font-semibold"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Grid display products */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-espresso/5 rounded-xs space-y-2">
            <p className="text-sm text-taupe font-bold">No pieces found matching active filters.</p>
            <p className="text-[11px] text-taupe/80 max-w-xs mx-auto">
              Try adjusting your price slider range, clearing your search query input, or exploring another collection tab.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {sortedProducts.map((p) => {
                const inFav = wishlist.includes(p.id);
                const isOutOfStock = (p.stock ?? 15) === 0;

                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white border border-espresso/10 rounded-xs overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Upper Product Image Container */}
                    <div className="relative aspect-square bg-linen/20 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(p)}>
                      <img 
                        src={p.imageUrl} 
                        alt={p.name} 
                        className="w-full h-full object-cover transform group-hover:scale-104 transition-transform duration-700" 
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />

                      {/* Overlays and Badges */}
                      <div className="absolute top-2 left-2 flex flex-col space-y-1">
                        {p.isNew && (
                          <span className="bg-terracotta text-white text-[7px] uppercase tracking-widest font-extrabold px-2 py-0.5">
                            New
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="bg-espresso text-[#FAF8F6] text-[7px] uppercase tracking-widest font-extrabold px-2 py-0.5">
                            Best Seller
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="bg-rose-600 text-white text-[7px] uppercase tracking-widest font-extrabold px-2 py-0.5">
                            Sold Out
                          </span>
                        )}
                      </div>

                      {/* Heart Wishlist button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWishlist(p.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/95 text-espresso hover:text-rose-500 hover:scale-105 transition-all shadow-2xs"
                        title="Save to Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${inFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      {/* Quick view panel reveal */}
                      <div className="absolute inset-x-0 bottom-0 bg-espresso/70 backdrop-blur-xs py-2 text-center text-white text-[9px] uppercase tracking-widest font-extrabold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Quick Look View</span>
                      </div>
                    </div>

                    {/* Lower Description Metadata details */}
                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                      <div className="space-y-1 cursor-pointer" onClick={() => setSelectedProduct(p)}>
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-espresso leading-tight group-hover:text-terracotta transition-colors">
                          {p.name}
                        </h4>
                        
                        {/* Material label */}
                        <p className="text-[9px] text-taupe uppercase font-semibold">
                          {p.material || '316L Stainless Steel • 18k PVD'}
                        </p>
                      </div>

                      {/* Rating details & Price row */}
                      <div className="pt-1.5 border-t border-espresso/5 flex items-center justify-between">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-xs sm:text-sm font-extrabold text-espresso">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="text-[10px] sm:text-xs line-through text-espresso/45 font-medium">
                              ₹{p.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span className="text-[10px] text-espresso/80 font-mono font-bold">{p.rating || 4.8}</span>
                        </div>
                      </div>

                      {/* Warning on stock */}
                      {p.stock !== undefined && p.stock > 0 && p.stock < 5 && (
                        <p className="text-[8px] font-bold text-amber-600 text-center uppercase tracking-wider">
                          ⚠️ Only {p.stock} pieces left!
                        </p>
                      )}

                      {/* Button Action */}
                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={isOutOfStock}
                        className={`w-full py-2 uppercase tracking-widest text-[9px] font-extrabold transition-all border ${
                          isOutOfStock
                            ? 'bg-espresso/5 text-espresso/35 border-espresso/5 cursor-not-allowed'
                            : 'bg-[#FAF8F6] border-espresso text-espresso hover:bg-espresso hover:text-white hover:scale-[1.01] cursor-pointer'
                        }`}
                      >
                        {isOutOfStock ? 'Sold Out' : 'Add to Enquiry'}
                      </button>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </section>

      {/* ======================================================== */}
      {/* --- WHY CHOOSE US (10 Pillars) --- */}
      {/* ======================================================== */}
      <WhyChooseUs />

      {/* ======================================================== */}
      {/* --- ABOUT ZERISH LUXE (Brand Story & Founders) --- */}
      {/* ======================================================== */}
      <section id="story" className="bg-[#FAF8F6] py-20 sm:py-28 border-t border-espresso/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Visual Column */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              {/* Primary Image Frame (Gold jewelry with delicate flowers representing style & durability) */}
              <div className="relative group overflow-hidden border border-espresso/10 p-2.5 bg-white shadow-md">
                <img 
                  src={goldJewelrySatinFlowersImg} 
                  alt="Gold jewelry with delicate flowers representing style and durability" 
                  className="w-full h-[320px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 right-4 text-terracotta">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* Header */}
              <div className="space-y-3">
                <h2 className="font-serif text-3xl sm:text-5xl font-light text-espresso leading-tight">
                  About Zerish Luxe
                </h2>
                <div className="h-[0.5px] w-20 bg-terracotta/40"></div>
              </div>

              {/* Narrative Core */}
              <div className="prose prose-espresso max-w-none text-sm text-espresso/90 leading-relaxed font-sans space-y-6">
                <p className="font-serif text-base sm:text-lg text-espresso/95 font-medium leading-relaxed italic">
                  Welcome to Zerish Luxe.
                </p>
                <p>
                  At Zerish Luxe, I believe jewellery is more than an accessory—it's a way to express your personality, celebrate special moments, and add confidence to your everyday style.
                </p>
                <p>
                  Our vision is simple: to bring beautifully curated, premium anti-tarnish jewellery to customers who appreciate elegance, quality, and affordability. Rather than manufacturing our own products, I carefully source each piece from trusted suppliers and handpick designs that meet our standards for style, durability, and finish. Every product in our collection is chosen with care, so you can shop with confidence.
                </p>
                <p>
                  Whether you're looking for everyday essentials, timeless classics, or statement pieces for special occasions, our collections are thoughtfully curated to help you find jewellery you'll love wearing again and again.
                </p>
              </div>

              {/* Mission & Vision Bento Style cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="bg-white border border-[#C3A6A0]/20 p-6 rounded-xs shadow-xs space-y-3 hover:border-terracotta/45 transition-colors duration-300">
                  <div className="w-8 h-8 rounded-full bg-linen/35 flex items-center justify-center text-terracotta">
                    <Award className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="font-serif text-base font-semibold text-espresso">
                    Our Mission
                  </h3>
                  <p className="text-xs text-espresso/80 leading-relaxed font-sans">
                    Our mission is to make premium-quality jewellery accessible to everyone by offering stylish, long-lasting, and affordable collections, while delivering an enjoyable and trustworthy shopping experience.
                  </p>
                </div>

                <div className="bg-white border border-[#C3A6A0]/20 p-6 rounded-xs shadow-xs space-y-3 hover:border-terracotta/45 transition-colors duration-300">
                  <div className="w-8 h-8 rounded-full bg-linen/35 flex items-center justify-center text-terracotta">
                    <Sparkles className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="font-serif text-base font-semibold text-espresso">
                    Our Vision
                  </h3>
                  <p className="text-xs text-espresso/80 leading-relaxed font-sans">
                    I aspire to become a trusted destination for anti-tarnish jewellery by providing carefully selected collections, exceptional customer service, and a shopping experience that customers can rely on.
                  </p>
                </div>
              </div>

              {/* Behind the Brand */}
              <div className="border-t border-espresso/15 pt-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-terracotta tracking-wide">
                    Behind the Brand
                  </h3>
                </div>

                <div className="prose prose-espresso max-w-none text-sm text-espresso/90 leading-relaxed font-sans space-y-5">
                  <p>
                    Zerish Luxe was founded by <strong className="text-espresso font-semibold">Athira Zerin P</strong>, driven by a vision of making premium-looking jewellery more accessible without compromising on quality or style.
                  </p>
                  <p>
                    As a passionate jewellery enthusiast, I wanted to create a brand where customers could discover elegant, affordable, and carefully curated pieces for every occasion. I personally oversee the selection of every collection, ensuring that each design reflects the quality, beauty, and sophistication our customers deserve.
                  </p>
                  <p>
                    For me, Zerish Luxe is more than a business—it's a promise to build lasting relationships through trust, quality, and exceptional customer service. Every order represents an opportunity to make someone feel confident, beautiful, and valued.
                  </p>
                  
                  {/* Closing message */}
                  <div className="bg-white border-l-2 border-terracotta p-5 rounded-r-xs mt-6 space-y-3 shadow-2xs">
                    <p className="italic font-serif text-espresso/95 text-[13px] sm:text-[14px]">
                      "Thank you for choosing Zerish Luxe and for being a part of my journey. Your support inspires me to continue bringing you beautiful jewellery that complements your style and celebrates life's special moments. I look forward to serving you and becoming your trusted destination for premium anti-tarnish jewellery."
                    </p>
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-[0.5px] bg-espresso/10 flex-1 mr-4"></div>
                      <span className="font-serif font-semibold text-espresso tracking-wide text-xs sm:text-sm">
                        – Athira Zerin
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* --- CLIENT LOVE & TESTIMONIALS --- */}
      {/* ======================================================== */}
      <section id="testimonials" className="bg-white py-16 sm:py-24 border-t border-espresso/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">Client Love</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-espresso mt-2 tracking-tight">Verified Testimonials</h2>
            <div className="w-12 h-[1px] bg-taupe mx-auto mt-4"></div>
            <p className="text-xs text-espresso/60 mt-3">
              Read real stories from our valued customers across India about their Zerish Luxe experience.
            </p>
          </div>

          {/* Grid list of reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {reviews.slice(0, 6).map((rev) => (
              <div 
                key={rev.id} 
                className="bg-[#FAF8F6] border border-espresso/5 p-6 sm:p-8 rounded-xs shadow-2xs space-y-4 hover:shadow-xs transition-shadow duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex space-x-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-espresso/10'}`} 
                      />
                    ))}
                  </div>
                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-espresso/90 leading-relaxed font-sans italic">
                    "{rev.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-3 pt-4 border-t border-espresso/5">
                  <div className="w-8 h-8 rounded-full bg-[#C3A6A0]/15 flex items-center justify-center text-[10px] font-bold text-terracotta border border-terracotta/10 shrink-0">
                    {rev.avatarInitials}
                  </div>
                  <div>
                    <h4 className="font-serif text-xs font-semibold text-espresso">{rev.name}</h4>
                    <p className="text-[9px] text-taupe uppercase tracking-wider font-semibold">
                      {rev.city}, {rev.state}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {reviews.length > 6 && (
            <div className="text-center mt-10">
              <p className="text-[10px] uppercase tracking-widest text-taupe font-bold">
                + and {reviews.length - 6} more happy customer stories across India
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* --- CLIENT REVIEW SUBMISSION CORNER --- */}
      {/* ======================================================== */}
      <section id="review-submission" className="bg-[#FAF8F6] py-16 sm:py-20 border-t border-[#C3A6A0]/15">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">Client Feedback</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-espresso uppercase tracking-[0.1em] mt-2">
              Share Your Experience
            </h2>
            <div className="flex items-center justify-center space-x-2 mt-2 text-terracotta/60">
              <div className="h-[0.5px] w-6 bg-terracotta/30"></div>
              <span className="text-[10px]">✦</span>
              <div className="h-[0.5px] w-6 bg-terracotta/30"></div>
            </div>
          </div>

          <div className="bg-white border border-[#C3A6A0]/30 p-6 sm:p-8 rounded-xs shadow-xs space-y-6">
            <div className="border-b border-espresso/5 pb-2">
              <h3 className="font-serif text-lg font-normal text-espresso">Write a Review</h3>
              <p className="text-[10px] text-taupe uppercase tracking-wider font-semibold mt-1">
                Your feedback helps us continue our commitment to premium craftsmanship and water-safe protection.
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Your Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full border border-espresso/20 p-2.5 text-xs text-espresso bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">City *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter city"
                    value={reviewCity}
                    onChange={(e) => setReviewCity(e.target.value)}
                    className="w-full border border-espresso/20 p-2.5 text-xs text-espresso bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">State *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter state"
                    value={reviewState}
                    onChange={(e) => setReviewState(e.target.value)}
                    className="w-full border border-espresso/20 p-2.5 text-xs text-espresso bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Star Rating Select */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-2">Rating *</label>
                <div className="flex space-x-1.5">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setReviewRating(starValue)}
                      className="p-1 text-espresso hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          starValue <= reviewRating 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Your Review *</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="What did you love about the design, tarnish protection, or fast shipping?"
                  value={reviewQuote}
                  onChange={(e) => setReviewQuote(e.target.value)}
                  className="w-full border border-espresso/20 p-2.5 text-xs text-espresso bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-espresso hover:bg-terracotta text-[#FAF8F6] text-[10px] uppercase tracking-widest font-extrabold shadow-xs transition-all cursor-pointer hover:scale-[1.01]"
              >
                Post Customer Review
              </button>

              {reviewSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                  ✨ Thank you! Your verified customer review was successfully submitted and registered.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* --- INTEGRATED INSTAGRAM GALLERY --- */}
      {/* ======================================================== */}
      <InstagramGallery />

      {/* ======================================================== */}
      {/* --- INTEGRATED CONTACT & INSIDER NEWSLETTER FORM --- */}
      {/* ======================================================== */}
      <section id="contact" className="py-16 sm:py-24 bg-white border-b border-espresso/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Brand Details (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-serif text-3xl font-normal text-espresso">Connect with Zerish Luxe</h3>
            <p className="text-xs text-espresso/75 leading-relaxed">
              Have questions regarding materials, wholesale orders, custom sizes, or delivery timelines to Kochi, Chennai, or Trivandrum? Get in touch, our specialized client support responds within 12 hours.
            </p>

            <div className="space-y-4 text-xs text-espresso/80 font-sans">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-espresso">Client Support Email</p>
                  <p className="text-espresso/70">zerishluxe@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-espresso">WhatsApp Direct Line</p>
                  <a 
                    href="https://wa.me/919916026262" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-terracotta font-bold underline hover:text-espresso"
                  >
                    +91 9916026262 (Chat Now)
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Elegant Contact Form (7 Columns) */}
          <form onSubmit={handleContactSubmit} className="lg:col-span-7 bg-[#FAF8F6] border border-espresso/10 p-6 sm:p-8 rounded-xs space-y-4">
            <h4 className="font-serif text-lg font-semibold text-espresso border-b border-espresso/5 pb-2">
              Send an Enquiry
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your full name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full border border-espresso/20 p-2.5 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="Enter your phone number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full border border-espresso/20 p-2.5 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                />
                {/[^\d]/.test(contactPhone) && contactPhone !== '' && (
                  <p className="text-[10px] text-rose-600 mt-1 font-semibold">
                    Warning: Phone number must contain only numbers. Letters or special characters are not allowed.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">City / Town</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter city"
                  value={contactCity}
                  onChange={(e) => setContactCity(e.target.value)}
                  className="w-full border border-espresso/20 p-2.5 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">State</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter state"
                  value={contactState}
                  onChange={(e) => setContactState(e.target.value)}
                  className="w-full border border-espresso/20 p-2.5 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Product Category</label>
                <select 
                  value={contactCategory}
                  onChange={(e) => setContactCategory(e.target.value)}
                  className="w-full border border-espresso/20 p-2.5 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden rounded-none"
                >
                  <option value="necklaces">Necklaces</option>
                  <option value="chains">Chains</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="cuff-bracelets">Cuff Bracelets</option>
                  <option value="drop-earrings">Drop Earrings</option>
                  <option value="stud-earrings">Stud Earrings</option>
                  <option value="rings">Rings</option>
                  <option value="hair-accessories">Hair Accessories</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Enquiry Message</label>
              <textarea 
                required
                rows={4}
                placeholder="Describe your design questions or customization requests..."
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                className="w-full border border-espresso/20 p-2.5 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden resize-none"
              />
            </div>

            <button 
              type="submit"
              className="px-6 py-3 bg-espresso hover:bg-terracotta text-[#FAF8F6] text-[10px] uppercase tracking-widest font-extrabold shadow-md transition-all flex items-center space-x-2"
            >
              <span>Submit & Chat on WhatsApp</span>
              <MessageCircle className="w-4 h-4" />
            </button>

            {contactError && (
              <div className="p-3.5 bg-rose-50 text-rose-800 text-[11px] font-semibold border border-rose-200">
                {contactError}
              </div>
            )}

            {contactSuccess && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                Enquiry dispatched successfully. Opening WhatsApp direct chat...
              </div>
            )}
          </form>

        </div>
      </section>

      {/* ======================================================== */}
      {/* --- PREMIUM FOOTER --- */}
      {/* ======================================================== */}
      <footer className="bg-espresso text-linen py-12 sm:py-16 border-t border-linen/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Intro info */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold tracking-[0.1em] text-[#FAF8F6] uppercase">Zerish Luxe</h4>
            <p className="text-xs text-linen/70 leading-relaxed max-w-xs">
              Handpicking waterproof, sweatproof, tarnish-free surgical jewelry pieces. Everyday minimalist fine curations designed to stay gorgeous forever.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h5 className="text-[10px] uppercase tracking-widest font-extrabold text-[#FAF8F6]">Customer Support</h5>
            <ul className="text-xs text-linen/60 space-y-1.5 font-semibold">
              <li><button onClick={() => setIsTrackOrderOpen(true)} className="hover:text-terracotta transition-colors">Track Enquiry</button></li>
              <li><a href="#contact" className="hover:text-terracotta transition-colors">Submit Enquiry</a></li>
            </ul>
          </div>

          {/* Quick links B */}
          <div className="space-y-3">
            <h5 className="text-[10px] uppercase tracking-widest font-extrabold text-[#FAF8F6]">Our Policies</h5>
            <ul className="text-xs text-linen/60 space-y-1.5 font-semibold">
              <li>
                <button 
                  onClick={() => setIsPrivacyOpen(true)} 
                  className="hover:text-terracotta transition-colors text-left font-semibold cursor-pointer"
                >
                  Privacy Protection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsTermsOpen(true)} 
                  className="hover:text-terracotta transition-colors text-left font-semibold cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Social connections */}
          <div className="space-y-3">
            <h5 className="text-[10px] uppercase tracking-widest font-extrabold text-[#FAF8F6]">Follow Our Journey</h5>
            <div className="flex space-x-3 text-linen/80">
              <a href="https://instagram.com/zerishluxe" target="_blank" rel="noreferrer" className="p-2 bg-linen/10 hover:bg-terracotta hover:text-white rounded-full transition-colors flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider">
                <Instagram className="w-3.5 h-3.5" />
                <span>@zerishluxe</span>
              </a>
              <a href="https://wa.me/919916026262" target="_blank" rel="noreferrer" className="p-2 bg-linen/10 hover:bg-emerald-600 hover:text-white rounded-full transition-colors flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
            <div className="flex items-center justify-center pt-2">
              <p className="text-[10px] text-linen/40 font-mono text-center">© 2026 Zerish Luxe. Crafted with love in Southern India.</p>
            </div>
          </div>

        </div>
      </footer>

      {/* ======================================================== */}
      {/* --- DRAWERS AND MODALS MODULAR CONNECTIONS --- */}
      {/* ======================================================== */}
      
      {/* 1. SHOPPING BAG DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)}></div>
            
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-md bg-[#FAF8F6] border-l border-espresso/15">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll no-scrollbar justify-between">
                  
                  {/* Drawer Header */}
                  <div className="px-6 flex items-center justify-between border-b border-espresso/10 pb-4">
                    <h2 className="font-serif text-lg font-semibold text-espresso flex items-center space-x-2">
                      <ShoppingBag className="w-4.5 h-4.5 text-terracotta" />
                      <span>My Enquiry Bag ({cart.reduce((sum, it) => sum + it.quantity, 0)})</span>
                    </h2>
                    <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-full text-espresso hover:bg-espresso hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body: Cart list OR Checkout Details */}
                  <div className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar space-y-4">
                    
                    {!isCheckingOut ? (
                      /* Cart List View */
                      cart.length === 0 ? (
                        <div className="text-center py-20 text-taupe space-y-3">
                          <ShoppingBag className="w-12 h-12 stroke-[1.1] text-taupe/45 mx-auto" />
                          <p className="text-xs">Your shopping bag is empty.</p>
                          <button 
                            onClick={() => {
                              setIsCartOpen(false);
                              window.scrollTo({ top: 900, behavior: 'smooth' });
                            }}
                            className="px-6 py-2 bg-espresso text-[#FAF8F6] text-[10px] uppercase tracking-widest font-extrabold hover:bg-terracotta transition-all"
                          >
                            Explore Curation Grid
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cart.map(item => (
                            <div key={item.product.id} className="flex items-center justify-between p-2 border border-espresso/5 bg-[#FAF8F6] rounded-xs">
                              <div className="flex items-center space-x-3 min-w-0">
                                <div className="w-12 h-12 bg-linen rounded-xs overflow-hidden border border-espresso/5 flex-shrink-0">
                                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-serif text-xs font-bold text-espresso truncate max-w-[140px]">{item.product.name}</h4>
                                  <p className="text-xs font-semibold text-espresso flex items-center gap-1.5">
                                    <span>₹{item.product.price.toLocaleString('en-IN')}</span>
                                    {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                                      <span className="line-through text-[10px] text-espresso/45 font-normal">₹{item.product.originalPrice.toLocaleString('en-IN')}</span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3">
                                {/* Quantity controls */}
                                <div className="flex border border-espresso/15 rounded-xs overflow-hidden text-xs font-bold bg-white">
                                  <button 
                                    onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity - 1)}
                                    className="px-2 py-1 bg-[#FAF8F6] hover:bg-linen text-espresso"
                                  >
                                    -
                                  </button>
                                  <span className="px-2.5 flex items-center justify-center min-w-[20px]">{item.quantity}</span>
                                  <button 
                                    onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity + 1)}
                                    className="px-2 py-1 bg-[#FAF8F6] hover:bg-linen text-espresso"
                                  >
                                    +
                                  </button>
                                </div>

                                <button 
                                  onClick={() => handleRemoveFromCart(item.product.id)}
                                  className="text-espresso/45 hover:text-rose-600 transition-colors"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Coupon Code Section */}
                          <form onSubmit={handleApplyCoupon} className="pt-3 border-t border-espresso/5 space-y-2">
                            <label className="block text-[9px] uppercase tracking-wider font-bold text-taupe">Apply Coupon Code</label>
                            <div className="flex space-x-2">
                              <input 
                                type="text" 
                                placeholder="Enter coupon code"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value)}
                                className="flex-1 border border-espresso/20 px-3 py-1.5 text-xs bg-white focus:outline-hidden focus:border-terracotta uppercase tracking-wider font-semibold"
                              />
                              <button 
                                type="submit"
                                className="px-4 py-1.5 bg-espresso text-linen hover:bg-terracotta text-[10px] uppercase font-bold tracking-wider"
                              >
                                Apply
                              </button>
                            </div>

                            {appliedCoupon && (
                              <p className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Coupon "{appliedCoupon.code}" applied! Save {appliedCoupon.type === 'percent' ? `${appliedCoupon.value}%` : `₹${appliedCoupon.value}`}</span>
                              </p>
                            )}
                            {couponError && <p className="text-[10px] text-rose-600 font-semibold">{couponError}</p>}
                          </form>
                        </div>
                      )
                    ) : (
                      /* Shipping/Checkout Form Details View */
                      <div className="space-y-4">
                        <button 
                          onClick={() => setIsCheckingOut(false)}
                          className="text-[10px] uppercase text-taupe font-extrabold tracking-wider hover:text-espresso"
                        >
                          ← Back to Enquiry Bag
                        </button>

                        {checkoutSuccess ? (
                          /* Success Screen + Enquiry Details (No QR Code) */
                          <div className="text-center py-6 space-y-5 bg-[#FAF8F6] p-5 border border-espresso/15 rounded-xs">
                            <div className="w-12 h-12 bg-terracotta text-white rounded-full flex items-center justify-center mx-auto text-xl font-serif font-bold shadow-xs">
                              ✦
                            </div>
                            <div>
                              <h3 className="font-serif text-lg font-bold text-espresso">Enquiry Registered!</h3>
                              <p className="text-xs text-espresso/80 leading-relaxed max-w-xs mx-auto mt-1">
                                Thank you for choosing Zerish Luxe. Our anti-tarnish jewelry catalogue is purely for viewing and curation. We have successfully received your enquiry list!
                              </p>
                            </div>
                            
                            <div className="bg-white p-3 border border-espresso/10 rounded-xs space-y-1">
                              <p className="text-[9px] uppercase tracking-wider text-taupe">Enquiry Reference Code:</p>
                              <p className="font-mono text-sm font-bold text-espresso uppercase tracking-widest">{checkoutSuccess}</p>
                            </div>

                            <div className="bg-emerald-50/50 border border-emerald-200/60 p-4 rounded-xs space-y-3.5 shadow-xs text-left">
                              <h4 className="font-serif text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Enquiry Received Successfully
                              </h4>
                              <p className="text-[11px] text-espresso/90 leading-relaxed">
                                Thank you for showing interest in Zerish Luxe products! We have successfully received your curation selections. We will reach out to you via Call or WhatsApp shortly to provide pricing details and assist with direct procurement.
                              </p>

                               <a
                                href={lastWhatsappUrl || `https://wa.me/919916026262`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] uppercase tracking-widest font-extrabold transition-all flex items-center justify-center gap-2"
                              >
                                <span>Chat with Curator on WhatsApp</span>
                              </a>
                            </div>

                            <p className="text-[9px] text-taupe">
                              Note: You can lookup this Enquiry Code in the "Track Enquiry" link in the Footer.
                            </p>

                            <button
                              onClick={() => {
                                setIsCheckingOut(false);
                                setCheckoutSuccess(null);
                                setIsCartOpen(false);
                              }}
                              className="w-full py-2.5 border border-[#C3A6A0] hover:bg-linen/25 text-[#735A55] text-[10px] uppercase tracking-widest font-extrabold"
                            >
                              Awesome! Continue Curation
                            </button>
                          </div>
                        ) : (
                          /* Form details */
                          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                            <h3 className="font-serif text-base font-bold text-espresso border-b border-espresso/15 pb-2">Shipping Information</h3>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Your Name</label>
                                <input 
                                  type="text" 
                                  required
                                  placeholder="Enter your full name"
                                  value={checkoutDetails.customerName}
                                  onChange={(e) => setCheckoutDetails(prev => ({ ...prev, customerName: e.target.value }))}
                                  className="w-full border border-espresso/20 p-2 text-xs bg-white focus:outline-hidden focus:border-terracotta"
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Phone Number</label>
                                <input 
                                  type="tel" 
                                  required
                                  placeholder="Enter your phone number"
                                  value={checkoutDetails.phoneNumber}
                                  onChange={(e) => setCheckoutDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                  className="w-full border border-espresso/20 p-2 text-xs bg-white focus:outline-hidden focus:border-terracotta"
                                />
                                {/[^\d]/.test(checkoutDetails.phoneNumber) && checkoutDetails.phoneNumber !== '' && (
                                  <p className="text-[10px] text-rose-600 mt-1 font-semibold">
                                    Warning: Phone number must contain only numbers. Letters or special characters are not allowed.
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">State</label>
                                  <input 
                                    type="text"
                                    required
                                    placeholder="Enter state"
                                    value={checkoutDetails.state}
                                    onChange={(e) => setCheckoutDetails(prev => ({ ...prev, state: e.target.value }))}
                                    className="w-full border border-espresso/20 p-2 text-xs bg-white focus:outline-hidden focus:border-terracotta"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">City</label>
                                  <input 
                                    type="text"
                                    required
                                    placeholder="Enter city"
                                    value={checkoutDetails.city}
                                    onChange={(e) => setCheckoutDetails(prev => ({ ...prev, city: e.target.value }))}
                                    className="w-full border border-espresso/20 p-2 text-xs bg-white focus:outline-hidden focus:border-terracotta"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Postal Pincode</label>
                                <input 
                                  type="text" 
                                  required
                                  placeholder="Enter pincode"
                                  value={checkoutDetails.postalCode}
                                  onChange={(e) => setCheckoutDetails(prev => ({ ...prev, postalCode: e.target.value }))}
                                  className="w-full border border-espresso/20 p-2 text-xs bg-white focus:outline-hidden focus:border-terracotta"
                                />
                                {/[^\d]/.test(checkoutDetails.postalCode) && checkoutDetails.postalCode !== '' && (
                                  <p className="text-[10px] text-rose-600 mt-1 font-semibold">
                                    Warning: Pincode must contain only numbers. Letters or special characters are not allowed.
                                  </p>
                                )}
                              </div>
                            </div>

                            <button 
                              type="submit"
                              className="w-full py-3 bg-espresso text-[#FAF8F6] hover:bg-terracotta text-xs uppercase tracking-widest font-extrabold shadow-md transition-all mt-3"
                            >
                              Submit Enquiry List
                            </button>
                          </form>
                        )}

                      </div>
                    )}

                  </div>

                  {/* Drawer Footer Accounting - Only show when not checked out success */}
                  {cart.length > 0 && !checkoutSuccess && (
                    <div className="p-6 border-t border-espresso/15 space-y-4 bg-[#FAF8F6]">
                      
                      {/* Free Shipping Progress Indicator */}
                      <div className="bg-white p-3 border border-espresso/10 rounded-xs space-y-2 text-center shadow-2xs">
                        {isFreeShipping ? (
                          <p className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5">
                            <span>✨</span>
                            <span>FREE shipping unlocked!</span>
                            <span>✨</span>
                          </p>
                        ) : (
                          <div className="space-y-1.5">
                            <p className="text-[10px] text-taupe uppercase tracking-wider font-bold">
                              Add <span className="text-terracotta font-extrabold">₹{499 - cartSubtotal}</span> more for <span className="font-black text-espresso">FREE Shipping</span>
                            </p>
                            <div className="w-full bg-espresso/5 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-terracotta h-full transition-all duration-500 rounded-full"
                                style={{ width: `${Math.min(100, (cartSubtotal / 499) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs text-espresso">
                        <div className="flex justify-between">
                          <span className="text-taupe">Items subtotal:</span>
                          <span className="font-semibold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                        </div>
                        {appliedCoupon && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Promo Discount ({appliedCoupon.code}):</span>
                            <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-taupe">Shipping:</span>
                          <span className={isFreeShipping ? "text-emerald-600 font-extrabold text-[10px] uppercase tracking-wider" : "font-semibold"}>
                            {isFreeShipping ? 'FREE' : `₹${shippingFee}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-espresso/10">
                          <span>Estimated Value:</span>
                          <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {!isCheckingOut && (
                        <div className="space-y-2 w-full">
                          {!currentUser ? (
                            <div className="space-y-2.5 p-3.5 bg-linen/20 border border-espresso/10 rounded-xs w-full">
                              <p className="text-[10px] font-bold text-espresso uppercase tracking-wider text-center">
                                Submit Curation List
                              </p>
                              <p className="text-[11px] text-espresso/70 text-center leading-normal">
                                Create an account to track your orders, or proceed instantly as a guest.
                              </p>
                              <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                  onClick={() => {
                                    setIsAccountOpen(true);
                                  }}
                                  className="py-2.5 bg-espresso hover:bg-terracotta text-[#FAF8F6] text-[10px] uppercase tracking-widest font-extrabold transition-all text-center rounded-xs cursor-pointer"
                                >
                                  Sign Up / Login
                                </button>
                                <button
                                  onClick={() => {
                                    setIsCheckingOut(true);
                                  }}
                                  className="py-2.5 border border-espresso/35 hover:bg-linen/20 text-espresso text-[10px] uppercase tracking-widest font-extrabold transition-all text-center rounded-xs cursor-pointer"
                                >
                                  As Guest
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setIsCheckingOut(true);
                              }}
                              className="w-full py-4 bg-espresso text-[#FAF8F6] hover:bg-terracotta text-xs uppercase tracking-widest font-extrabold shadow-md transition-all cursor-pointer"
                            >
                              Proceed to Enquiry Details
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. SEARCH DRAWER */}
      <SearchDrawer 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={setSelectedProduct}
        onAddToCart={handleAddToCart}
      />

      {/* 3. WISHLIST DRAWER */}
      <WishlistDrawer 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        products={products}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={setSelectedProduct}
      />

      {/* 4. ACCOUNT DRAWER WITH HISTORY LOGS */}
      <AccountDrawer 
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orders={orders}
        onOpenTrackModal={() => setIsTrackOrderOpen(true)}
        currentUser={currentUser}
        onSignUp={handleUserSignUp}
        onLogOut={handleUserLogOut}
      />

      {/* 5. PRODUCT DETAILS MODAL (WITH 360 ZOOM BUNDLE REVIEWS) */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          products={products}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* 6. TRANSIT TRACKER MODAL */}
      <TrackOrderModal 
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        orders={orders}
      />

      {/* 7. PRIVACY POLICY MODAL */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* 8. TERMS & CONDITIONS MODAL */}
      <TermsConditionsModal 
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* MOBILE CATEGORIES BOTTOM SHEET */}
      <AnimatePresence>
        {isMobileCategoriesOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity" 
              onClick={() => setIsMobileCategoriesOpen(false)}
            />
            
            {/* Bottom Sheet Panel */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-[#FAF8F6] border-t border-espresso/15 rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto no-scrollbar pb-8"
            >
              {/* Sheet Handle */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 bg-espresso/20 rounded-full"></div>
              </div>

              {/* Sheet Header */}
              <div className="px-6 pb-4 border-b border-espresso/10 flex items-center justify-between">
                <h3 className="font-serif text-lg font-normal tracking-wide text-espresso uppercase">
                  Select Category
                </h3>
                <button 
                  onClick={() => setIsMobileCategoriesOpen(false)}
                  className="p-1 rounded-full text-espresso hover:bg-espresso/10 transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Category Grid List */}
              <div className="p-6 grid grid-cols-2 gap-3.5">
                {[
                  { id: 'best-sellers', label: 'Best Sellers', count: 'Hot' },
                  { id: 'gift-collection', label: 'Gift Collection', count: 'New' },
                  { id: 'chains', label: 'Chains', count: null },
                  { id: 'necklaces', label: 'Necklaces', count: null },
                  { id: 'rings', label: 'Rings', count: null },
                  { id: 'bracelets', label: 'Bracelets', count: null },
                  { id: 'cuff-bracelets', label: 'Cuff Bangles', count: null },
                  { id: 'drop-earrings', label: 'Drop Earrings', count: null },
                  { id: 'stud-earrings', label: 'Stud Earrings', count: null },
                  { id: 'hair-accessories', label: 'Hair Accessories', count: null }
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setViewMode('customer');
                      setActiveTab(item.id as any);
                      setIsMobileCategoriesOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById('shop');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    className={`relative p-4 rounded-xs border text-left transition-all flex flex-col justify-between h-20 ${
                      activeTab === item.id && viewMode === 'customer'
                        ? 'border-terracotta bg-white shadow-sm'
                        : 'border-espresso/10 bg-white hover:border-espresso'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-espresso">
                      {item.label}
                    </span>
                    {item.count && (
                      <span className="absolute top-2 right-2 bg-terracotta text-white text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                        {item.count}
                      </span>
                    )}
                    <span className="text-[9px] text-espresso/40 font-semibold self-end">
                      Explore ✦
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE PERSISTENT BOTTOM NAVIGATION */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-espresso/10 py-2.5 px-6 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        
        {/* Home Button */}
        <button 
          onClick={() => {
            setViewMode('customer');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveTab('best-sellers');
          }}
          className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-md transition-colors cursor-pointer ${
            viewMode === 'customer' && !isMobileCategoriesOpen
              ? 'text-terracotta'
              : 'text-espresso/60 hover:text-espresso'
          }`}
        >
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[9px] uppercase tracking-wider font-extrabold">Home</span>
        </button>

        {/* Categories Button */}
        <button 
          onClick={() => {
            setIsMobileCategoriesOpen(true);
          }}
          className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-md transition-colors cursor-pointer ${
            isMobileCategoriesOpen
              ? 'text-terracotta'
              : 'text-espresso/60 hover:text-espresso'
          }`}
        >
          <LayoutGrid className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[9px] uppercase tracking-wider font-extrabold">Categories</span>
        </button>

        {/* Wishlist Button */}
        <button 
          onClick={() => setIsWishlistOpen(true)}
          className="flex flex-col items-center space-y-1 py-1 px-3 rounded-md text-espresso/60 hover:text-espresso transition-colors relative cursor-pointer"
        >
          <Heart className="w-5 h-5 stroke-[1.8]" />
          {wishlist.length > 0 && (
            <span className="absolute top-0 right-3 bg-terracotta text-white text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span className="text-[9px] uppercase tracking-wider font-extrabold">Wishlist</span>
        </button>

        {/* Cart Button */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center space-y-1 py-1 px-3 rounded-md text-espresso/60 hover:text-espresso transition-colors relative cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
          {cart.length > 0 && (
            <span className="absolute top-0 right-3 bg-espresso text-white text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cart.reduce((sum, it) => sum + it.quantity, 0)}
            </span>
          )}
          <span className="text-[9px] uppercase tracking-wider font-extrabold">Cart</span>
        </button>

      </div>

    </div>
  );
}
