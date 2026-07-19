import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  TrendingUp, 
  Sliders, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Check, 
  Edit, 
  Percent, 
  Package, 
  Users, 
  IndianRupee,
  ChevronRight,
  Eye,
  Settings,
  Sparkles,
  Star,
  MessageSquare,
  Instagram,
  Camera,
  Video
} from 'lucide-react';
import { Product, Order, Coupon, SalesAnalytics, Testimonial, UserAccount, CategorySetting, InstagramPost } from '../types';
import { PRESET_IMAGE_TEMPLATES } from '../data';

interface SellerPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<void> | void;
  onDeleteProduct: (id: string) => Promise<void> | void;
  onResetCatalog: () => void;
  onUpdateProduct: (product: Product) => Promise<void> | void;
  orders: Order[];
  customers?: UserAccount[];
  onUpdateOrderStatus: (orderId: string, status: 'Pending' | 'Dispatched' | 'Delivered') => void;
  onTogglePaymentStatus?: (orderId: string) => void;
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  heroText: { title: string; subtitle: string };
  onUpdateHeroText: (text: { title: string; subtitle: string }) => void;
  reviews?: Testimonial[];
  onDeleteReview?: (id: string) => void;
  categories?: CategorySetting[];
  onUpdateCategories?: (categories: CategorySetting[]) => Promise<void> | void;
  instagramPosts?: InstagramPost[];
  onAddInstagramPost?: (post: InstagramPost) => Promise<void> | void;
  onDeleteInstagramPost?: (id: string) => Promise<void> | void;
}

export default function SellerPortal({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onDeleteProduct,
  onResetCatalog,
  onUpdateProduct,
  orders,
  customers = [],
  onUpdateOrderStatus,
  onTogglePaymentStatus,
  coupons,
  onAddCoupon,
  onDeleteCoupon,
  heroText,
  onUpdateHeroText,
  reviews = [],
  onDeleteReview,
  categories = [],
  onUpdateCategories,
  instagramPosts = [],
  onAddInstagramPost,
  onDeleteInstagramPost
}: SellerPortalProps) {
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Form states (Add product)
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('chains');
  const [newProdPrice, setNewProdPrice] = useState(1500);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number | ''>('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState(PRESET_IMAGE_TEMPLATES[0].url);
  const [customImg, setCustomImg] = useState('');
  const [newProdStock, setNewProdStock] = useState(15);
  const [newProdMaterial, setNewProdMaterial] = useState('316L Stainless Steel');
  const [newProdDims, setNewProdDims] = useState('');
  const [isNewBadge, setIsNewBadge] = useState(true);
  const [isBestBadge, setIsBestBadge] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Multiple images state
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [addImgUrlInput, setAddImgUrlInput] = useState('');
  const [additionalUploading, setAdditionalUploading] = useState(false);

  // Studio form states
  const [studioHandle, setStudioHandle] = useState('@');
  const [studioImageUrl, setStudioImageUrl] = useState('');
  const [studioVideoUrl, setStudioVideoUrl] = useState('');
  const [studioCaption, setStudioCaption] = useState('');
  const [studioLocation, setStudioLocation] = useState('');
  const [studioJewellery, setStudioJewellery] = useState('');
  const [studioIsSubmitting, setStudioIsSubmitting] = useState(false);

  const compressImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { uploadProductImage } = await import('../services/firebaseDb');
      // Race the Firebase Storage upload with a 3.5-second timeout
      const url = await Promise.race([
        uploadProductImage(file),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('TIMEOUT')), 3500)
        )
      ]);
      setCustomImg(url);
      alert('Product image successfully uploaded to premium storage!');
    } catch (error) {
      console.warn('Firebase Storage upload failed or timed out. Falling back to local high-performance base64 compression.', error);
      try {
        const base64Url = await compressImageToBase64(file);
        setCustomImg(base64Url);
        alert('Product image processed and saved locally to catalog successfully!');
      } catch (compressErr) {
        console.error('Compression failed:', compressErr);
        alert('Error processing file. Please verify the image file format or try another image.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdditionalUploading(true);
    try {
      const { uploadProductImage } = await import('../services/firebaseDb');
      const url = await Promise.race([
        uploadProductImage(file),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('TIMEOUT')), 3.500)
        )
      ]);
      setAdditionalImages(prev => [...prev, url]);
      alert('Additional product image uploaded successfully!');
    } catch (error) {
      console.warn('Firebase Storage upload failed or timed out. Falling back to base64 compression.', error);
      try {
        const base64Url = await compressImageToBase64(file);
        setAdditionalImages(prev => [...prev, base64Url]);
        alert('Additional product image processed and saved locally successfully!');
      } catch (compressErr) {
        console.error('Compression failed:', compressErr);
        alert('Error processing file.');
      }
    } finally {
      setAdditionalUploading(false);
    }
  };

  const handleAddAdditionalUrl = () => {
    if (!addImgUrlInput.trim()) return;
    setAdditionalImages(prev => [...prev, addImgUrlInput.trim()]);
    setAddImgUrlInput('');
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  // Editing state (Inline)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState<number | ''>('');
  const [editStock, setEditStock] = useState(0);
  const [editCategory, setEditCategory] = useState<Product['category']>('chains');
  const [editDesc, setEditDesc] = useState('');
  const [editMaterial, setEditMaterial] = useState('');
  const [editDims, setEditDims] = useState('');
  const [editImg, setEditImg] = useState('');
  const [editIsBestSeller, setEditIsBestSeller] = useState(false);

  // Multi-select and bulk actions states
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Coupon Form state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponType, setNewCouponType] = useState<'percent' | 'flat'>('percent');

  // Homepage Banner form state
  const [bannerTitle, setBannerTitle] = useState(heroText.title);
  const [bannerSub, setBannerSub] = useState(heroText.subtitle);
  const [bannerUpdated, setBannerUpdated] = useState(false);

  // Dynamic Category Images state
  const [localCategories, setLocalCategories] = useState<CategorySetting[]>(categories);
  const [categoriesUpdated, setCategoriesUpdated] = useState(false);
  const [catUploadingIdx, setCatUploadingIdx] = useState<number | null>(null);

  // Add Category form states
  const [newCatName, setNewCatName] = useState('');
  const [newCatSub, setNewCatSub] = useState('');
  const [newCatImg, setNewCatImg] = useState('');
  const [newCatUploading, setNewCatUploading] = useState(false);

  const handleAddNewCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      alert('Please enter a Category Name');
      return;
    }
    const tabId = newCatName.trim().toLowerCase().replace(/\s+/g, '-');
    if (localCategories.some(cat => cat.tabId === tabId)) {
      alert(`A category with this ID "${tabId}" already exists!`);
      return;
    }
    
    const newCat: CategorySetting = {
      tabId,
      title: newCatName.trim().toUpperCase(),
      subtitle: newCatSub.trim() ? newCatSub.trim().toUpperCase() : null,
      imageUrl: newCatImg.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500&auto=format&fit=crop'
    };

    setLocalCategories(prev => [...prev, newCat]);
    setNewCatName('');
    setNewCatSub('');
    setNewCatImg('');
    alert('Category added to local list! Click "Update Category Settings" below to finalize and save to the database.');
  };

  const handleDeleteCategory = (idx: number) => {
    if (!confirm('Are you sure you want to delete this category? (Make sure no active products rely on it)')) return;
    setLocalCategories(prev => prev.filter((_, i) => i !== idx));
  };

  const handleNewCategoryUpload = async (file: File) => {
    setNewCatUploading(true);
    try {
      const { uploadProductImage } = await import('../services/firebaseDb');
      const url = await Promise.race([
        uploadProductImage(file),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('TIMEOUT')), 3500)
        )
      ]);
      setNewCatImg(url);
      alert('Category image uploaded successfully!');
    } catch (error) {
      console.warn('Upload failed. Falling back to base64 compression.', error);
      try {
        const base64Url = await compressImageToBase64(file);
        setNewCatImg(base64Url);
        alert('Category image processed and saved successfully!');
      } catch (compressErr) {
        console.error('Compression failed:', compressErr);
        alert('Error processing file.');
      }
    } finally {
      setNewCatUploading(false);
    }
  };

  React.useEffect(() => {
    if (categories && categories.length > 0) {
      setLocalCategories(categories);
    }
  }, [categories]);

  const handleCategoryFieldChange = (idx: number, field: keyof CategorySetting, val: string) => {
    const updated = [...localCategories];
    updated[idx] = { ...updated[idx], [field]: val };
    setLocalCategories(updated);
  };

  const handleCategoryUpload = async (idx: number, file: File) => {
    setCatUploadingIdx(idx);
    try {
      const { uploadProductImage } = await import('../services/firebaseDb');
      const url = await Promise.race([
        uploadProductImage(file),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('TIMEOUT')), 3500)
        )
      ]);
      const updated = [...localCategories];
      updated[idx] = { ...updated[idx], imageUrl: url };
      setLocalCategories(updated);
      alert('Category image uploaded successfully!');
    } catch (error) {
      console.warn('Upload failed. Falling back to base64 compression.', error);
      try {
        const base64Url = await compressImageToBase64(file);
        const updated = [...localCategories];
        updated[idx] = { ...updated[idx], imageUrl: base64Url };
        setLocalCategories(updated);
        alert('Category image processed and saved successfully!');
      } catch (compressErr) {
        console.error('Compression failed:', compressErr);
        alert('Error processing file.');
      }
    } finally {
      setCatUploadingIdx(null);
    }
  };

  const handleSaveCategories = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateCategories) {
      try {
        await onUpdateCategories(localCategories);
        setCategoriesUpdated(true);
        setTimeout(() => setCategoriesUpdated(false), 2000);
        alert('Category catalog images updated successfully!');
      } catch (err: any) {
        alert('Error updating categories: ' + (err.message || err));
      }
    }
  };

  // Active sub-section in Admin Dashboard
  const [adminTab, setAdminTab] = useState<'analytics' | 'catalog' | 'orders' | 'customers' | 'coupons' | 'settings' | 'reviews' | 'studio'>('analytics');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'zerish123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid luxury credential. Please try again.');
    }
  };

  // Product operation statuses
  const [isAdding, setIsAdding] = useState(false);
  const [savingEditId, setSavingEditId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    setIsAdding(true);
    try {
      const primaryUrl = customImg.trim() || newProdImg;
      const allThumbnails = [primaryUrl, ...additionalImages].filter(Boolean);

      await onAddProduct({
        name: newProdName,
        category: newProdCategory,
        price: Number(newProdPrice),
        originalPrice: newProdOriginalPrice ? Number(newProdOriginalPrice) : undefined,
        description: newProdDesc || `${newProdName} - handpicked luxury fine jewelry. Waterproof, sweatproof, and anti-tarnish designed for everyday elegance.`,
        imageUrl: primaryUrl,
        thumbnails: allThumbnails,
        stock: Number(newProdStock),
        material: newProdMaterial,
        dimensions: newProdDims,
        isNew: isNewBadge,
        isBestSeller: isBestBadge,
        isAddedBySeller: true,
        rating: 5.0,
        reviewsCount: 1,
        variants: ['18K Yellow Gold']
      });

      // Reset fields
      setNewProdName('');
      setNewProdDesc('');
      setNewProdOriginalPrice('');
      setCustomImg('');
      setNewProdDims('');
      setAdditionalImages([]);
      alert('Bespoke Listing Added Successfully!');
    } catch (error: any) {
      console.error(error);
      alert(`Failed to add product: ${error.message || 'Unknown error. Check Firestore rules.'}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSaveEdit = async (p: Product) => {
    setSavingEditId(p.id);
    try {
      await onUpdateProduct({
        ...p,
        name: editName,
        price: Number(editPrice),
        originalPrice: editOriginalPrice ? Number(editOriginalPrice) : undefined,
        stock: Number(editStock),
        category: editCategory,
        description: editDesc,
        material: editMaterial,
        dimensions: editDims,
        imageUrl: editImg,
        isBestSeller: editIsBestSeller
      });
      setEditingId(null);
      alert('Product updated successfully!');
    } catch (error: any) {
      console.error(error);
      alert(`Failed to update product: ${error.message || 'Unknown error. Check Firestore rules.'}`);
    } finally {
      setSavingEditId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this masterpiece listing?')) return;
    setDeletingId(id);
    try {
      await onDeleteProduct(id);
      setSelectedProductIds(prev => prev.filter(x => x !== id));
      alert('Product deleted successfully!');
    } catch (error: any) {
      console.error(error);
      alert(`Failed to delete product: ${error.message || 'Unknown error. Check Firestore rules.'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditPrice(p.price);
    setEditOriginalPrice(p.originalPrice || '');
    setEditStock(p.stock || 0);
    setEditCategory(p.category);
    setEditDesc(p.description || '');
    setEditMaterial(p.material || '');
    setEditDims(p.dimensions || '');
    setEditImg(p.imageUrl || '');
    setEditIsBestSeller(!!p.isBestSeller);
  };

  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllProducts = (allIds: string[]) => {
    if (selectedProductIds.length === allIds.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(allIds);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete the ${selectedProductIds.length} selected listings?`)) return;
    
    setIsBulkDeleting(true);
    let successCount = 0;
    let failCount = 0;
    
    try {
      for (const id of selectedProductIds) {
        try {
          await onDeleteProduct(id);
          successCount++;
        } catch (err) {
          console.error(`Error deleting product ${id}:`, err);
          failCount++;
        }
      }
      setSelectedProductIds([]);
      if (failCount > 0) {
        alert(`Bulk delete finished. Successfully deleted ${successCount} products. Failed to delete ${failCount} products.`);
      } else {
        alert(`Successfully deleted all ${successCount} selected products.`);
      }
    } catch (err: any) {
      alert('Bulk delete failed: ' + (err.message || err));
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHeroText({ title: bannerTitle, subtitle: bannerSub });
    setBannerUpdated(true);
    setTimeout(() => setBannerUpdated(false), 2000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    onAddCoupon({
      code: newCouponCode.trim().toUpperCase(),
      type: newCouponType,
      value: Number(newCouponValue)
    });
    setNewCouponCode('');
  };

  // Calculations for graphs and charts
  const totalSalesVal = orders.reduce((acc, curr) => acc + curr.total, 0);
  const totalOrdersVal = orders.length;
  const outOfStockCount = products.filter(p => (p.stock || 0) === 0).length;

  // Custom visual SVG Line graph data points for Demo polish
  // Maps 6 points representing simulated July Sales Revenue
  const chartData = [24000, 31000, 28000, 39000, 48000, totalSalesVal > 0 ? 48000 + totalSalesVal : 59000];
  const maxChartVal = Math.max(...chartData, 60000);

  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-[#F7F1F0] text-espresso selection:bg-terracotta selection:text-white flex flex-col font-sans">
      {/* Top Professional Portal Header */}
      <header className="bg-white border-b border-espresso/15 py-4 px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-espresso text-linen rounded-xs">
              <Settings className="w-5 h-5 text-terracotta animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-serif text-base sm:text-lg font-bold uppercase tracking-wider text-espresso">
                Zerish Luxe • Business Portal
              </h1>
              <p className="text-[9px] uppercase tracking-widest text-taupe font-bold">
                Storefront Operations & Admin Workspace
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-espresso/25 hover:border-terracotta hover:bg-terracotta hover:text-white rounded-xs text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer flex items-center space-x-2"
          >
            <span>← Back to Customer Boutique</span>
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
        <div className="bg-white border border-espresso/10 rounded-sm shadow-xl flex-1 flex flex-col overflow-hidden min-h-[600px]">
          <div className="flex-1 flex flex-col py-6">
            
            {/* --- AUTHENTICATION REQUIRED --- */}
            {!isAuthenticated ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4">
                <div className="p-4 bg-linen/20 rounded-full text-terracotta">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso">Seller Authorization</h3>
                <p className="text-xs text-taupe leading-relaxed">
                  Access to inventory management, dynamic coupon generators, and financial sales analytics of Zerish Luxe is restricted.
                </p>

                <form onSubmit={handleLogin} className="w-full space-y-3">
                  <div>
                    <input 
                      type="password" 
                      placeholder="Passcode (Default: Press enter or input zerish123)"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full border border-espresso/25 p-2.5 text-xs text-center bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden"
                    />
                  </div>
                  {authError && <p className="text-[10px] text-rose-600 font-semibold">{authError}</p>}
                  
                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-espresso hover:bg-terracotta text-[#FAF8F6] text-[10px] uppercase tracking-widest font-extrabold transition-all"
                  >
                    Authenticate Now
                  </button>
                </form>
              </div>
            ) : (
              /* --- AUTHORIZED CONTROLS --- */
              <div className="flex-1 flex flex-col">
                
                {/* Internal Navigation Tabs */}
                <div className="flex border-b border-espresso/10 text-[10px] font-bold uppercase tracking-wider text-taupe bg-[#FAF8F6]">
                  {(['analytics', 'catalog', 'orders', 'customers', 'coupons', 'reviews', 'settings', 'studio'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setAdminTab(tab)}
                      className={`flex-1 py-3 text-center border-b-2 transition-all ${
                        adminTab === tab 
                          ? 'border-terracotta text-espresso bg-white font-extrabold' 
                          : 'border-transparent hover:text-espresso hover:bg-linen/10'
                      }`}
                    >
                      {tab === 'analytics' ? 'Overview' : tab === 'catalog' ? 'Products' : tab === 'orders' ? 'Enquiries' : tab === 'customers' ? 'Customers' : tab === 'coupons' ? 'Coupons' : tab === 'reviews' ? 'Reviews' : tab === 'settings' ? 'Settings' : 'Studio'}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)] no-scrollbar">
                  
                  {/* ========================================== */}
                  {/* --- TAB A: GRAPHICAL SALES ANALYTICS --- */}
                  {/* ========================================== */}
                  {adminTab === 'analytics' && (() => {
                    // Let's parse dates safely
                    const parseOrderDate = (dStr: string) => {
                      try {
                        return dStr ? new Date(dStr) : new Date();
                      } catch {
                        return new Date();
                      }
                    };

                    const now = new Date();
                    
                    // Monthly / Quarterly computations
                    const thisMonthOrders = orders.filter(o => {
                      const d = parseOrderDate(o.date);
                      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                    });
                    const thisMonthSales = thisMonthOrders.reduce((acc, o) => acc + o.total, 0);
                    const thisMonthOrdersCount = thisMonthOrders.length;

                    const currentQuarter = Math.floor(now.getMonth() / 3);
                    const quarterlyOrders = orders.filter(o => {
                      const d = parseOrderDate(o.date);
                      const q = Math.floor(d.getMonth() / 3);
                      return q === currentQuarter && d.getFullYear() === now.getFullYear();
                    });
                    const quarterlySales = quarterlyOrders.reduce((acc, o) => acc + o.total, 0);
                    const quarterlyOrdersCount = quarterlyOrders.length;

                    // Sales Growth (Daily/Weekly/Monthly)
                    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
                    
                    const todayOrders = orders.filter(o => parseOrderDate(o.date) >= todayStart);
                    const yesterdayOrders = orders.filter(o => {
                      const d = parseOrderDate(o.date);
                      return d >= yesterdayStart && d < todayStart;
                    });
                    const todaySales = todayOrders.reduce((acc, o) => acc + o.total, 0);
                    const yesterdaySales = yesterdayOrders.reduce((acc, o) => acc + o.total, 0);
                    const dailyGrowth = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 : 0;

                    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
                    
                    const thisWeekSales = orders.filter(o => parseOrderDate(o.date) >= oneWeekAgo).reduce((acc, o) => acc + o.total, 0);
                    const lastWeekSales = orders.filter(o => {
                      const d = parseOrderDate(o.date);
                      return d >= twoWeeksAgo && d < oneWeekAgo;
                    }).reduce((acc, o) => acc + o.total, 0);
                    const weeklyGrowth = lastWeekSales > 0 ? ((thisWeekSales - lastWeekSales) / lastWeekSales) * 100 : 0;

                    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
                    const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
                    const lastMonthOrders = orders.filter(o => {
                      const d = parseOrderDate(o.date);
                      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
                    });
                    const lastMonthSales = lastMonthOrders.reduce((acc, o) => acc + o.total, 0);
                    const monthlyGrowth = lastMonthSales > 0 ? ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100 : 0;

                    // Core summaries
                    const totalSalesVal = orders.reduce((acc, curr) => acc + curr.total, 0);
                    const totalOrdersVal = orders.length;
                    const outOfStockProducts = products.filter(p => (p.stock || 0) === 0);
                    const outOfStockCount = outOfStockProducts.length;
                    const inventoryRemaining = products.reduce((acc, p) => acc + (p.stock || 0), 0);
                    const unitsSold = orders.reduce((acc, o) => acc + o.items.reduce((sum, item) => sum + item.quantity, 0), 0);
                    const aovVal = totalOrdersVal > 0 ? totalSalesVal / totalOrdersVal : 0;

                    // Revenue and profit
                    const grossRevenue = orders.reduce((acc, o) => acc + o.total + (o.discount || 0), 0);
                    const discountsGiven = orders.reduce((acc, o) => acc + (o.discount || 0), 0);
                    const shippingChargesCollected = orders.length * 150;
                    const cogsVal = totalSalesVal * 0.45;
                    const grossProfit = totalSalesVal - cogsVal;

                    // Product performance
                    const productSalesMap: Record<string, { product: Product; unitsSold: number; revenue: number }> = {};
                    products.forEach(p => {
                      productSalesMap[p.id] = { product: p, unitsSold: 0, revenue: 0 };
                    });
                    orders.forEach(o => {
                      o.items.forEach(item => {
                        const pId = item.product.id;
                        if (productSalesMap[pId]) {
                          productSalesMap[pId].unitsSold += item.quantity;
                          productSalesMap[pId].revenue += item.product.price * item.quantity;
                        } else {
                          productSalesMap[pId] = {
                            product: item.product,
                            unitsSold: item.quantity,
                            revenue: item.product.price * item.quantity
                          };
                        }
                      });
                    });

                    const productSalesList = Object.values(productSalesMap);
                    const bestSellers = [...productSalesList].filter(x => x.unitsSold > 0).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5);
                    const lowSellers = [...productSalesList].filter(x => x.unitsSold > 0).sort((a, b) => a.unitsSold - b.unitsSold).slice(0, 5);

                    // Categories breakdown
                    const categorySalesMap: Record<string, { categoryTitle: string; unitsSold: number; revenue: number }> = {};
                    localCategories.forEach(cat => {
                      categorySalesMap[cat.tabId] = { categoryTitle: cat.title, unitsSold: 0, revenue: 0 };
                    });
                    // Fallbacks
                    ['chains', 'necklaces', 'bracelets', 'cuff-bracelets', 'drop-earrings', 'stud-earrings', 'hair-accessories', 'rings'].forEach(catId => {
                      if (!categorySalesMap[catId]) {
                        categorySalesMap[catId] = { categoryTitle: catId.toUpperCase().replace('-', ' '), unitsSold: 0, revenue: 0 };
                      }
                    });

                    orders.forEach(o => {
                      o.items.forEach(item => {
                        const catId = item.product.category || 'chains';
                        if (!categorySalesMap[catId]) {
                          categorySalesMap[catId] = { categoryTitle: catId.toUpperCase().replace('-', ' '), unitsSold: 0, revenue: 0 };
                        }
                        categorySalesMap[catId].unitsSold += item.quantity;
                        categorySalesMap[catId].revenue += item.product.price * item.quantity;
                      });
                    });

                    const topCategories = Object.values(categorySalesMap).sort((a, b) => b.revenue - a.revenue);

                    return (
                      <div className="space-y-8 animate-fadeIn">
                        {/* HEADER BANNER FOR ANALYTICS */}
                        <div className="bg-espresso text-linen p-6 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-espresso/10">
                          <div>
                            <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-terracotta">Aesthetic Sales Analytics</h3>
                            <p className="text-xs text-taupe/80 mt-1">Live synchronized financial metrics, product lifecycle tracking, and boutique performance indicators.</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-400">Database Stream Connected</span>
                          </div>
                        </div>

                        {/* SECTION 1: SALES OVERVIEW */}
                        <div className="space-y-4">
                          <h4 className="font-serif text-sm font-extrabold uppercase tracking-wider text-espresso border-b border-espresso/15 pb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-terracotta" />
                            <span>Sales Overview</span>
                          </h4>

                          {/* Stat Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="bg-white border border-espresso/10 p-4 rounded-xs space-y-2">
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-taupe block">Total Revenue</span>
                              <div className="flex items-baseline justify-between">
                                <span className="text-xl font-serif font-bold text-espresso">₹{totalSalesVal.toLocaleString('en-IN')}</span>
                                <span className={`text-[9px] font-bold ${monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {monthlyGrowth >= 0 ? '↑' : '↓'} {Math.abs(monthlyGrowth).toFixed(1)}% MoM
                                </span>
                              </div>
                            </div>

                            <div className="bg-white border border-espresso/10 p-4 rounded-xs space-y-2">
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-taupe block">Total Orders</span>
                              <div className="flex items-baseline justify-between">
                                <span className="text-xl font-serif font-bold text-espresso">{totalOrdersVal}</span>
                                <span className="text-[9px] text-taupe font-bold uppercase">Enquiries</span>
                              </div>
                            </div>

                            <div className="bg-white border border-espresso/10 p-4 rounded-xs space-y-2">
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-taupe block">Average Order Value (AOV)</span>
                              <div className="flex items-baseline justify-between">
                                <span className="text-xl font-serif font-bold text-espresso">₹{Math.round(aovVal).toLocaleString('en-IN')}</span>
                                <span className="text-[9px] text-taupe font-bold uppercase">Per Cart</span>
                              </div>
                            </div>

                            <div className="bg-white border border-espresso/10 p-4 rounded-xs space-y-2">
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-taupe block">Units Sold</span>
                              <div className="flex items-baseline justify-between">
                                <span className="text-xl font-serif font-bold text-espresso">{unitsSold}</span>
                                <span className="text-[9px] text-taupe font-bold uppercase">Items Shipped</span>
                              </div>
                            </div>
                          </div>

                          {/* Time period breakdowns and growth */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-linen/20 border border-espresso/10 p-4 rounded-xs space-y-3">
                              <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-espresso">This Calendar Month</h5>
                              <div className="grid grid-cols-2 gap-2 text-center bg-white p-2.5 border border-espresso/5 rounded-xs">
                                <div>
                                  <span className="text-[8px] uppercase tracking-widest text-taupe font-bold block">Enquiries</span>
                                  <span className="text-sm font-serif font-bold text-espresso">{thisMonthOrdersCount}</span>
                                </div>
                                <div>
                                  <span className="text-[8px] uppercase tracking-widest text-taupe font-bold block">Revenue</span>
                                  <span className="text-sm font-serif font-bold text-espresso">₹{thisMonthSales.toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center text-[9px]">
                                <span className="text-taupe font-semibold">Monthly Growth Trend:</span>
                                <span className={`font-bold ${monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {monthlyGrowth >= 0 ? '↑' : '↓'} {monthlyGrowth.toFixed(1)}% vs Last Month
                                </span>
                              </div>
                            </div>

                            <div className="bg-linen/20 border border-espresso/10 p-4 rounded-xs space-y-3">
                              <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-espresso">This Fiscal Quarter</h5>
                              <div className="grid grid-cols-2 gap-2 text-center bg-white p-2.5 border border-espresso/5 rounded-xs">
                                <div>
                                  <span className="text-[8px] uppercase tracking-widest text-taupe font-bold block">Enquiries</span>
                                  <span className="text-sm font-serif font-bold text-espresso">{quarterlyOrdersCount}</span>
                                </div>
                                <div>
                                  <span className="text-[8px] uppercase tracking-widest text-taupe font-bold block">Revenue</span>
                                  <span className="text-sm font-serif font-bold text-espresso">₹{quarterlySales.toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center text-[9px]">
                                <span className="text-taupe font-semibold">Quarter Status:</span>
                                <span className="text-espresso font-bold uppercase tracking-wider">Q{(currentQuarter + 1)} Active</span>
                              </div>
                            </div>

                            <div className="bg-linen/20 border border-espresso/10 p-4 rounded-xs space-y-3">
                              <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-espresso">Dynamic Growth Velocity</h5>
                              <div className="space-y-1 text-[10px]">
                                <div className="flex justify-between items-center py-0.5 border-b border-espresso/5">
                                  <span className="text-taupe">Daily (Today vs Yesterday)</span>
                                  <span className={`font-bold ${dailyGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {dailyGrowth >= 0 ? '↑' : '↓'} {dailyGrowth.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-espresso/5">
                                  <span className="text-taupe">Weekly (7-day Rolling)</span>
                                  <span className={`font-bold ${weeklyGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {weeklyGrowth >= 0 ? '↑' : '↓'} {weeklyGrowth.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-taupe">Monthly (30-day Rolling)</span>
                                  <span className={`font-bold ${monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {monthlyGrowth >= 0 ? '↑' : '↓'} {monthlyGrowth.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 2: REVENUE & PROFIT ANALYSIS */}
                        <div className="space-y-4">
                          <h4 className="font-serif text-sm font-extrabold uppercase tracking-wider text-espresso border-b border-espresso/15 pb-2 flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-terracotta" />
                            <span>Revenue & Profit Ledger</span>
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {/* Gross Revenue Card */}
                            <div className="bg-[#FAF8F6] border border-espresso/10 p-4 rounded-xs space-y-1 text-center">
                              <span className="text-[8px] uppercase tracking-wider font-extrabold text-taupe block">Gross Sales Value</span>
                              <p className="text-base font-serif font-bold text-espresso">₹{grossRevenue.toLocaleString('en-IN')}</p>
                              <p className="text-[7px] text-taupe">Includes dynamic coupons given</p>
                            </div>

                            {/* Discounts Given Card */}
                            <div className="bg-[#FAF8F6] border border-espresso/10 p-4 rounded-xs space-y-1 text-center">
                              <span className="text-[8px] uppercase tracking-wider font-extrabold text-taupe block">Discounts Given</span>
                              <p className="text-base font-serif font-bold text-rose-600">-₹{discountsGiven.toLocaleString('en-IN')}</p>
                              <p className="text-[7px] text-taupe">Applied coupon deductions</p>
                            </div>

                            {/* Shipping Collected Card */}
                            <div className="bg-[#FAF8F6] border border-espresso/10 p-4 rounded-xs space-y-1 text-center">
                              <span className="text-[8px] uppercase tracking-wider font-extrabold text-taupe block">Shipping Collected</span>
                              <p className="text-base font-serif font-bold text-emerald-600">+₹{shippingChargesCollected.toLocaleString('en-IN')}</p>
                              <p className="text-[7px] text-taupe">₹150 flat premium rate</p>
                            </div>

                            {/* COGS Card */}
                            <div className="bg-[#FAF8F6] border border-espresso/10 p-4 rounded-xs space-y-1 text-center">
                              <span className="text-[8px] uppercase tracking-wider font-extrabold text-taupe block">Cost of Goods Sold (COGS)</span>
                              <p className="text-base font-serif font-bold text-amber-800">₹{Math.round(cogsVal).toLocaleString('en-IN')}</p>
                              <p className="text-[7px] text-taupe">Craftsmanship & fine metals (45%)</p>
                            </div>

                            {/* Gross Profit Card */}
                            <div className="bg-espresso text-linen p-4 rounded-xs space-y-1 text-center border border-espresso/20 shadow-xs">
                              <span className="text-[8px] uppercase tracking-wider font-extrabold text-terracotta block">Net Gross Profit</span>
                              <p className="text-lg font-serif font-bold text-white">₹{Math.round(grossProfit).toLocaleString('en-IN')}</p>
                              <p className="text-[8px] text-emerald-400 font-semibold">Margin: 55.0%</p>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 3: PRODUCT PERFORMANCE & INVENTORY */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          
                          {/* Left Panel: Best & Low Sellers (7 Columns) */}
                          <div className="lg:col-span-7 space-y-6">
                            <div className="space-y-4">
                              <h4 className="font-serif text-sm font-extrabold uppercase tracking-wider text-espresso border-b border-espresso/15 pb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-terracotta" />
                                <span>🛍️ Product Performance Rankings</span>
                              </h4>

                              {/* Best Sellers */}
                              <div className="space-y-2">
                                <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 flex items-center gap-1">
                                  <span>✦ Best-Selling Products</span>
                                  <span className="text-[8px] text-taupe font-normal lowercase">(highest units sold)</span>
                                </h5>
                                {bestSellers.length === 0 ? (
                                  <p className="text-[11px] text-taupe italic p-4 bg-linen/10 border border-espresso/5 rounded-xs text-center">
                                    No sales data accumulated yet.
                                  </p>
                                ) : (
                                  <div className="space-y-1.5">
                                    {bestSellers.map(({ product, unitsSold: qty, revenue: rev }) => (
                                      <div key={product.id} className="p-2.5 bg-white border border-espresso/10 rounded-xs flex items-center justify-between text-xs gap-3">
                                        <div className="flex items-center space-x-2.5 min-w-0">
                                          <img src={product.imageUrl} className="w-8 h-8 object-cover rounded-xs border border-espresso/10 shrink-0" referrerPolicy="no-referrer" />
                                          <div className="min-w-0">
                                            <p className="font-bold text-espresso truncate">{product.name}</p>
                                            <p className="text-[8px] text-taupe uppercase tracking-widest">{product.category.replace('-', ' ')}</p>
                                          </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                          <p className="font-extrabold text-espresso">{qty} sold</p>
                                          <p className="text-[9px] font-mono text-emerald-600">₹{rev.toLocaleString('en-IN')}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Low Sellers */}
                              <div className="space-y-2">
                                <h5 className="text-[10px] uppercase tracking-wider font-extrabold text-rose-700 flex items-center gap-1">
                                  <span>✦ Low-Selling Products</span>
                                  <span className="text-[8px] text-taupe font-normal lowercase">(active but low volumes)</span>
                                </h5>
                                {lowSellers.length === 0 ? (
                                  <p className="text-[11px] text-taupe italic p-4 bg-linen/10 border border-espresso/5 rounded-xs text-center">
                                    No low volume alerts yet.
                                  </p>
                                ) : (
                                  <div className="space-y-1.5">
                                    {lowSellers.map(({ product, unitsSold: qty, revenue: rev }) => (
                                      <div key={product.id} className="p-2.5 bg-white border border-espresso/10 rounded-xs flex items-center justify-between text-xs gap-3">
                                        <div className="flex items-center space-x-2.5 min-w-0">
                                          <img src={product.imageUrl} className="w-8 h-8 object-cover rounded-xs border border-espresso/10 shrink-0" referrerPolicy="no-referrer" />
                                          <div className="min-w-0">
                                            <p className="font-bold text-espresso truncate">{product.name}</p>
                                            <p className="text-[8px] text-taupe uppercase tracking-widest">{product.category.replace('-', ' ')}</p>
                                          </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                          <p className="font-extrabold text-rose-700">{qty} sold</p>
                                          <p className="text-[9px] font-mono text-taupe">₹{rev.toLocaleString('en-IN')}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Panel: Top Categories & Inventory Status (5 Columns) */}
                          <div className="lg:col-span-5 space-y-6">
                            {/* Categories breakdown */}
                            <div className="space-y-4">
                              <h4 className="font-serif text-sm font-extrabold uppercase tracking-wider text-espresso border-b border-espresso/15 pb-2">
                                Category Revenues
                              </h4>
                              <div className="bg-white border border-espresso/10 p-4 rounded-xs space-y-3 shadow-3xs">
                                {topCategories.map(cat => {
                                  const pct = totalSalesVal > 0 ? (cat.revenue / totalSalesVal) * 100 : 0;
                                  return (
                                    <div key={cat.categoryTitle} className="space-y-1 text-xs">
                                      <div className="flex justify-between items-center text-[10px] font-bold text-espresso">
                                        <span className="uppercase tracking-wider">{cat.categoryTitle}</span>
                                        <span className="font-mono text-terracotta">₹{cat.revenue.toLocaleString('en-IN')} ({pct.toFixed(1)}%)</span>
                                      </div>
                                      <div className="w-full bg-[#FAF8F6] border border-espresso/5 h-2 rounded-full overflow-hidden">
                                        <div className="bg-terracotta h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(pct, 2)}%` }} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Inventory status card */}
                            <div className="space-y-4">
                              <h4 className="font-serif text-sm font-extrabold uppercase tracking-wider text-espresso border-b border-espresso/15 pb-2">
                                Inventory Remaining
                              </h4>
                              <div className="bg-[#FAF8F6] border border-espresso/10 p-4 rounded-xs space-y-3.5">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-[10px] uppercase text-taupe font-bold block">Active Catalog Size</span>
                                    <span className="text-lg font-serif font-extrabold text-espresso">{products.length} Designs</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] uppercase text-taupe font-bold block">Total Stock Remaining</span>
                                    <span className="text-lg font-serif font-extrabold text-espresso">{inventoryRemaining} Pcs</span>
                                  </div>
                                </div>

                                <div className="border-t border-espresso/5 pt-2.5">
                                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-rose-700 block mb-1.5 flex items-center gap-1">
                                    <span>⚠️ Out of Stock ({outOfStockCount})</span>
                                  </span>
                                  {outOfStockProducts.length === 0 ? (
                                    <p className="text-[10px] text-emerald-700 font-bold bg-emerald-50 p-2 border border-emerald-100 rounded-xs">
                                      ✓ Perfect! All masterpieces are currently stocked.
                                    </p>
                                  ) : (
                                    <div className="space-y-1 max-h-[140px] overflow-y-auto no-scrollbar">
                                      {outOfStockProducts.map(p => (
                                        <div key={p.id} className="text-[10px] bg-rose-50 text-rose-800 p-1.5 border border-rose-100 rounded-xs flex justify-between items-center">
                                          <span className="font-bold truncate max-w-[150px]">{p.name}</span>
                                          <span className="text-[8px] bg-rose-100 text-rose-900 px-1.5 uppercase font-extrabold rounded-xs shrink-0">Needs Restock</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 4: PRODUCT-WISE REVENUE INDEX */}
                        <div className="space-y-4">
                          <h4 className="font-serif text-sm font-extrabold uppercase tracking-wider text-espresso border-b border-espresso/15 pb-2">
                            Product-Wise Financial Ledger
                          </h4>
                          <div className="bg-white border border-espresso/10 rounded-xs overflow-hidden shadow-3xs">
                            <div className="overflow-x-auto no-scrollbar">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-[#FAF8F6] text-[9px] uppercase tracking-widest font-extrabold text-taupe border-b border-espresso/10">
                                  <tr>
                                    <th className="p-3">Product Name</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3 text-right">Price</th>
                                    <th className="p-3 text-center">Remaining Stock</th>
                                    <th className="p-3 text-center">Units Sold</th>
                                    <th className="p-3 text-right">Accumulated Revenue</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-espresso/5 text-espresso">
                                  {productSalesList.map(({ product, unitsSold: qty, revenue: rev }) => (
                                    <tr key={product.id} className="hover:bg-linen/10 transition-colors">
                                      <td className="p-3 font-serif font-bold text-xs truncate max-w-[180px]" title={product.name}>
                                        {product.name}
                                      </td>
                                      <td className="p-3 text-[10px] uppercase tracking-wider text-taupe">
                                        {product.category.replace('-', ' ')}
                                      </td>
                                      <td className="p-3 text-right font-mono">
                                        ₹{product.price.toLocaleString('en-IN')}
                                      </td>
                                      <td className={`p-3 text-center font-bold font-mono ${product.stock === 0 ? 'text-rose-600' : ''}`}>
                                        {product.stock || 0} pcs
                                      </td>
                                      <td className="p-3 text-center font-mono font-bold">
                                        {qty} pcs
                                      </td>
                                      <td className="p-3 text-right font-bold font-mono text-emerald-600">
                                        ₹{rev.toLocaleString('en-IN')}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ========================================== */}
                  {/* --- TAB B: PRODUCTS CATALOG MANAGER --- */}
                  {/* ========================================== */}
                  {adminTab === 'catalog' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* Left: Add New Product (5 Columns) */}
                      <form onSubmit={handleCreateProduct} className="lg:col-span-5 bg-[#FAF8F6] border border-espresso/10 p-5 rounded-xs space-y-4">
                        <div className="border-b border-espresso/10 pb-2 flex items-center space-x-1.5">
                          <Plus className="w-4 h-4 text-terracotta" />
                          <h4 className="font-serif text-sm font-bold text-espresso">Create New Listing</h4>
                        </div>

                        {/* Fields */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Product Name</label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g., Aurelia Solitaire Pendant"
                              value={newProdName}
                              onChange={(e) => setNewProdName(e.target.value)}
                              className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Category</label>
                              <select 
                                value={newProdCategory}
                                onChange={(e) => setNewProdCategory(e.target.value as Product['category'])}
                                className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                              >
                                {localCategories.map(cat => (
                                  <option key={cat.tabId} value={cat.tabId}>{cat.title}</option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Offer Price (₹)</label>
                                <input 
                                  type="number" 
                                  required
                                  min="1"
                                  value={newProdPrice}
                                  onChange={(e) => setNewProdPrice(Number(e.target.value))}
                                  className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Original Price (₹)</label>
                                <input 
                                  type="number" 
                                  placeholder="Optional"
                                  value={newProdOriginalPrice}
                                  onChange={(e) => setNewProdOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Initial Stock</label>
                              <input 
                                type="number" 
                                required
                                value={newProdStock}
                                onChange={(e) => setNewProdStock(Number(e.target.value))}
                                className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Dimensions</label>
                              <input 
                                type="text" 
                                placeholder="e.g. 18 inches"
                                value={newProdDims}
                                onChange={(e) => setNewProdDims(e.target.value)}
                                className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Product Description</label>
                            <textarea 
                              placeholder="Write a sensory luxury story describing the item..."
                              value={newProdDesc}
                              onChange={(e) => setNewProdDesc(e.target.value)}
                              rows={3}
                              className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden resize-none"
                            />
                          </div>

                          {/* Image template presets picker */}
                          <div className="space-y-1.5">
                            <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso">Product Image URL</label>
                            <div className="grid grid-cols-4 gap-1 bg-white p-2 border border-espresso/15">
                              {PRESET_IMAGE_TEMPLATES.map((tpl, i) => (
                                <button
                                  type="button"
                                  key={i}
                                  onClick={() => {
                                    setNewProdImg(tpl.url);
                                    setCustomImg('');
                                  }}
                                  className={`relative aspect-square border overflow-hidden ${
                                    newProdImg === tpl.url && !customImg 
                                      ? 'border-terracotta ring-1 ring-terracotta' 
                                      : 'border-espresso/10 opacity-60 hover:opacity-100'
                                  }`}
                                  title={tpl.label}
                                >
                                  <img src={tpl.url} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                            
                            <input 
                              type="url" 
                              placeholder="Or paste any custom Unsplash image URL..."
                              value={customImg}
                              onChange={(e) => setCustomImg(e.target.value)}
                              className="w-full border border-espresso/20 p-2 text-[11px] text-espresso bg-white focus:border-terracotta focus:outline-hidden mt-1.5"
                            />

                            <div className="mt-2 bg-white border border-dashed border-espresso/20 p-2.5 text-center">
                              <label className="block text-[8px] uppercase tracking-wider font-extrabold text-espresso mb-1">
                                Or Upload Image File to Firebase Storage
                              </label>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageFileChange}
                                className="hidden"
                                id="product-file-upload"
                              />
                              <label 
                                htmlFor="product-file-upload"
                                className="inline-block px-3 py-1 bg-espresso/5 hover:bg-espresso/10 border border-espresso/15 text-[9px] uppercase tracking-wider font-bold text-espresso cursor-pointer transition-colors"
                              >
                                {uploading ? 'Uploading...' : 'Choose File'}
                              </label>
                              {customImg && customImg.startsWith('http') && (
                                <p className="text-[8px] text-emerald-700 font-mono mt-1 truncate">
                                  ✓ Uploaded: {customImg}
                                </p>
                              )}
                              {uploading && (
                                <div className="mt-1 flex items-center justify-center space-x-1">
                                  <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-bounce"></span>
                                  <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-bounce delay-75"></span>
                                  <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-bounce delay-150"></span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Additional Images / Thumbnails */}
                          <div className="space-y-2 border-t border-espresso/10 pt-3">
                            <div className="flex items-center justify-between">
                              <label className="block text-[9px] uppercase tracking-wider font-extrabold text-espresso">
                                Additional Images ({additionalImages.length})
                              </label>
                              <span className="text-[8px] text-taupe font-semibold uppercase tracking-wider">Supports Zoom view</span>
                            </div>

                            {/* Render already added additional images */}
                            {additionalImages.length > 0 && (
                              <div className="grid grid-cols-5 gap-1.5 p-2 bg-white border border-espresso/10 rounded-xs">
                                {additionalImages.map((img, idx) => (
                                  <div key={idx} className="relative aspect-square group border border-espresso/5 rounded-xs overflow-hidden">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveAdditionalImage(idx)}
                                      className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-extrabold uppercase tracking-widest cursor-pointer"
                                      title="Remove image"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Additional Image input field and button */}
                            <div className="flex space-x-1.5">
                              <input 
                                type="url" 
                                placeholder="Paste additional image Unsplash URL..."
                                value={addImgUrlInput}
                                onChange={(e) => setAddImgUrlInput(e.target.value)}
                                className="flex-1 border border-espresso/20 p-2 text-[11px] text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                              />
                              <button
                                type="button"
                                onClick={handleAddAdditionalUrl}
                                className="px-3 py-2 bg-espresso hover:bg-terracotta text-[#FAF8F6] text-[9px] uppercase tracking-widest font-extrabold transition-colors cursor-pointer whitespace-nowrap"
                              >
                                Add URL
                              </button>
                            </div>

                            {/* File Upload to Firebase for additional images */}
                            <div className="bg-white border border-dashed border-espresso/20 p-2.5 text-center">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleAdditionalImageUpload}
                                className="hidden"
                                id="additional-file-upload"
                              />
                              <label 
                                htmlFor="additional-file-upload"
                                className="inline-block px-3 py-1 bg-espresso/5 hover:bg-espresso/10 border border-espresso/15 text-[9px] uppercase tracking-wider font-bold text-espresso cursor-pointer transition-colors"
                              >
                                {additionalUploading ? 'Uploading...' : 'Upload Image File'}
                              </label>
                              {additionalUploading && (
                                <div className="mt-1 flex items-center justify-center space-x-1">
                                  <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-bounce"></span>
                                  <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-bounce delay-75"></span>
                                  <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-bounce delay-150"></span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Badges toggles */}
                          <div className="flex items-center space-x-4 pt-1 text-[11px] text-espresso">
                            <label className="flex items-center space-x-1.5 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={isNewBadge}
                                onChange={(e) => setIsNewBadge(e.target.checked)}
                                className="rounded-xs border-espresso/30 text-terracotta focus:ring-terracotta"
                              />
                              <span>Mark as New Arrival</span>
                            </label>
                            <label className="flex items-center space-x-1.5 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={isBestBadge}
                                onChange={(e) => setIsBestBadge(e.target.checked)}
                                className="rounded-xs border-espresso/30 text-terracotta focus:ring-terracotta"
                              />
                              <span>Mark as Best Seller</span>
                            </label>
                          </div>

                        </div>

                        <button 
                          type="submit"
                          disabled={isAdding}
                          className="w-full py-3 bg-terracotta text-white text-[10px] uppercase tracking-widest font-extrabold shadow-md hover:bg-espresso transition-colors mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isAdding ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                              Adding Masterpiece...
                            </>
                          ) : (
                            'Generate Custom Listing'
                          )}
                        </button>
                      </form>

                      {/* Right: Manage Store Listings (7 Columns) */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="border-b border-espresso/10 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-3">
                            {products.length > 0 && (
                              <input 
                                type="checkbox"
                                checked={selectedProductIds.length === products.length && products.length > 0}
                                onChange={() => handleSelectAllProducts(products.map(p => p.id))}
                                className="rounded-xs border-espresso/30 text-terracotta focus:ring-terracotta cursor-pointer"
                                title="Select All / Deselect All"
                              />
                            )}
                            <h4 className="font-serif text-sm font-bold text-espresso">Active Fine Catalog ({products.length})</h4>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            {selectedProductIds.length > 0 && (
                              <button
                                onClick={handleBulkDelete}
                                disabled={isBulkDeleting}
                                className="text-[10px] uppercase tracking-wider font-extrabold text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded-sm border border-rose-200/50 flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                {isBulkDeleting ? (
                                  <div className="w-3 h-3 border-2 border-rose-600/30 border-t-rose-600 animate-spin rounded-full" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                                <span>Delete Selected ({selectedProductIds.length})</span>
                              </button>
                            )}

                            <button 
                              onClick={onResetCatalog}
                              className="text-[9px] uppercase tracking-wider font-extrabold text-taupe hover:text-rose-600 flex items-center space-x-1"
                              title="Reset all listings to initial defaults"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Reset Store</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                          {products.map((p) => {
                            const isEditing = editingId === p.id;
                            return (
                              <div 
                                key={p.id}
                                className="p-3 bg-white border border-espresso/10 rounded-xs flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:border-terracotta/30 transition-all"
                              >
                                {isEditing ? (
                                  /* Inline Edit Panel */
                                  <div className="flex-1 space-y-3 pr-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-[8px] uppercase tracking-wider font-semibold text-espresso mb-1">
                                          Product Name
                                        </label>
                                        <input 
                                          type="text" 
                                          value={editName}
                                          onChange={(e) => setEditName(e.target.value)}
                                          className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                          placeholder="Name"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[8px] uppercase tracking-wider font-semibold text-espresso mb-1">
                                          Category
                                        </label>
                                        <select
                                          value={editCategory}
                                          onChange={(e) => setEditCategory(e.target.value as Product['category'])}
                                          className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                        >
                                          {localCategories.map(cat => (
                                            <option key={cat.tabId} value={cat.tabId}>{cat.title}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                      <div>
                                        <label className="block text-[8px] uppercase tracking-wider font-semibold text-espresso mb-1">
                                          Offer Price (₹)
                                        </label>
                                        <input 
                                          type="number" 
                                          value={editPrice}
                                          onChange={(e) => setEditPrice(Number(e.target.value))}
                                          className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                          placeholder="Offer Price"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[8px] uppercase tracking-wider font-semibold text-espresso mb-1">
                                          Original Price (₹, Opt.)
                                        </label>
                                        <input 
                                          type="number" 
                                          value={editOriginalPrice}
                                          onChange={(e) => setEditOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                          className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                          placeholder="Original Price"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[8px] uppercase tracking-wider font-semibold text-espresso mb-1">
                                          Stock Qty
                                        </label>
                                        <input 
                                          type="number" 
                                          value={editStock}
                                          onChange={(e) => setEditStock(Number(e.target.value))}
                                          className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                          placeholder="Stock"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                      <div>
                                        <label className="block text-[8px] uppercase tracking-wider font-semibold text-espresso mb-1">
                                          Material (e.g. 18k Gold Plated)
                                        </label>
                                        <input 
                                          type="text" 
                                          value={editMaterial}
                                          onChange={(e) => setEditMaterial(e.target.value)}
                                          className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                          placeholder="Material"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[8px] uppercase tracking-wider font-semibold text-espresso mb-1">
                                          Dimensions (e.g. 40cm + 5cm)
                                        </label>
                                        <input 
                                          type="text" 
                                          value={editDims}
                                          onChange={(e) => setEditDims(e.target.value)}
                                          className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                          placeholder="Dimensions"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[8px] uppercase tracking-wider font-semibold text-espresso mb-1">
                                          Image URL
                                        </label>
                                        <input 
                                          type="text" 
                                          value={editImg}
                                          onChange={(e) => setEditImg(e.target.value)}
                                          className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                          placeholder="Image URL"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-[8px] uppercase tracking-wider font-semibold text-espresso mb-1">
                                        Product Description
                                      </label>
                                      <textarea 
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        rows={3}
                                        className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden font-sans"
                                        placeholder="Description..."
                                      />
                                    </div>

                                    <div className="flex items-center space-x-2 py-1 text-xs text-espresso">
                                      <label className="flex items-center space-x-1.5 cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={editIsBestSeller}
                                          onChange={(e) => setEditIsBestSeller(e.target.checked)}
                                          className="rounded-xs border-espresso/30 text-terracotta focus:ring-terracotta cursor-pointer"
                                        />
                                        <span className="text-[10px] uppercase font-bold tracking-wider select-none">Best Seller Badge</span>
                                      </label>
                                    </div>

                                    <div className="flex justify-end space-x-2 pt-1 border-t border-espresso/5">
                                      <button 
                                        type="button"
                                        disabled={savingEditId === p.id}
                                        onClick={() => handleSaveEdit(p)}
                                        className="p-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold tracking-wider disabled:opacity-50 flex items-center justify-center gap-1 min-w-[70px] cursor-pointer"
                                      >
                                        {savingEditId === p.id ? (
                                          <>
                                            <div className="w-2.5 h-2.5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                                            Saving
                                          </>
                                        ) : (
                                          'Save changes'
                                        )}
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        className="p-1.5 px-4 bg-espresso/50 hover:bg-espresso text-white text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  /* Standard Listing Row */
                                  <>
                                    <div className="flex items-center space-x-3 min-w-0">
                                      <input 
                                        type="checkbox"
                                        checked={selectedProductIds.includes(p.id)}
                                        onChange={() => handleToggleSelectProduct(p.id)}
                                        className="rounded-xs border-espresso/30 text-terracotta focus:ring-terracotta cursor-pointer shrink-0"
                                      />
                                      <div className="w-12 h-12 bg-linen border border-espresso/5 rounded-sm overflow-hidden flex-shrink-0">
                                        <img src={p.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                      <div className="min-w-0">
                                        <h5 className="font-serif text-xs font-bold text-espresso truncate max-w-[180px]">{p.name}</h5>
                                        <p className="text-[9px] uppercase text-taupe tracking-wider">
                                          {p.category === 'cuff-bracelets' ? 'Cuff Bangles' : p.category.replace('-', ' ')} • <strong className="text-espresso">Stock: {p.stock ?? 15}</strong>
                                        </p>
                                        <p className="text-[9px] text-espresso/60 line-clamp-1 mt-0.5 max-w-[240px]" title={p.description}>
                                          {p.description}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-4 self-center sm:self-auto">
                                      <div className="flex flex-col items-end">
                                        <span className="text-xs font-bold text-espresso">₹{p.price.toLocaleString('en-IN')}</span>
                                        {p.originalPrice && p.originalPrice > p.price && (
                                          <span className="text-[10px] line-through text-espresso/45">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                                        )}
                                      </div>
                                      
                                      <div className="flex items-center space-x-1.5">
                                        {/* Quick Best Seller checkbox */}
                                        <div className="flex items-center space-x-1 mr-1 bg-linen/30 border border-espresso/10 rounded-sm px-1.5 py-1">
                                          <input 
                                            type="checkbox"
                                            checked={!!p.isBestSeller}
                                            onChange={(e) => onUpdateProduct({ ...p, isBestSeller: e.target.checked })}
                                            className="rounded-xs border-espresso/30 text-terracotta focus:ring-terracotta cursor-pointer w-3 h-3"
                                            id={`quick-best-seller-${p.id}`}
                                          />
                                          <label htmlFor={`quick-best-seller-${p.id}`} className="text-[8px] uppercase font-bold tracking-wider text-espresso/70 select-none cursor-pointer whitespace-nowrap">
                                            Best Seller
                                          </label>
                                        </div>

                                        {/* Quick edit button */}
                                        <button 
                                          onClick={() => startEdit(p)}
                                          className="p-1.5 text-espresso/40 hover:text-terracotta rounded-full hover:bg-linen/25 transition-all cursor-pointer"
                                          title="Edit details"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>

                                        {/* Quick stock adjusters buttons */}
                                        <div className="flex border border-espresso/15 rounded-sm overflow-hidden text-[10px] font-bold">
                                          <button 
                                            onClick={() => onUpdateProduct({ ...p, stock: Math.max(0, (p.stock || 0) - 1) })}
                                            className="px-1.5 bg-linen/20 hover:bg-linen text-espresso"
                                          >
                                            -
                                          </button>
                                          <span className="px-2 bg-white text-espresso flex items-center justify-center min-w-[20px]">{p.stock ?? 15}</span>
                                          <button 
                                            onClick={() => onUpdateProduct({ ...p, stock: (p.stock || 0) + 1 })}
                                            className="px-1.5 bg-linen/20 hover:bg-linen text-espresso"
                                          >
                                            +
                                          </button>
                                        </div>

                                        {/* Delete button */}
                                        <button 
                                          onClick={() => handleDelete(p.id)}
                                          disabled={deletingId === p.id}
                                          className="p-1.5 text-espresso/40 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-all disabled:opacity-50 cursor-pointer"
                                          title="Delete listing"
                                        >
                                          {deletingId === p.id ? (
                                            <div className="w-3.5 h-3.5 border-2 border-espresso/25 border-t-espresso animate-spin rounded-full" />
                                          ) : (
                                            <Trash2 className="w-3.5 h-3.5" />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ========================================== */}
                  {/* --- TAB C: REAL-TIME ENQUIRY DISPATCH --- */}
                  {/* ========================================== */}
                  {adminTab === 'orders' && (
                    <div className="space-y-4">
                      <div className="border-b border-espresso/10 pb-2 flex items-center justify-between">
                        <h4 className="font-serif text-sm font-bold text-espresso">Incoming Enquiry Curations ({orders.length})</h4>
                        <p className="text-[10px] text-taupe">Click response status keys to update customer enquiry status instantly</p>
                      </div>

                      {orders.length === 0 ? (
                        <div className="text-center py-12 text-taupe text-xs">
                          No enquiries submitted in this session yet. Submit enquiries via Checkout.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((o) => (
                            <div 
                              key={o.id}
                              className="p-4 bg-white border border-espresso/10 rounded-sm space-y-3 hover:border-espresso/20 transition-all shadow-2xs"
                            >
                              {/* Enquiry metadata Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-espresso/5 pb-2 text-[11px]">
                                <div>
                                  <p className="font-bold text-espresso">Enquiry ID: {o.id}</p>
                                  <p className="text-taupe">{o.date}</p>
                                </div>
                                <div className="text-right mt-1 sm:mt-0">
                                  <p className="font-bold text-espresso">Enquiry Code: <span className="font-mono text-terracotta uppercase">{o.trackingNumber}</span></p>
                                  <p className="text-taupe">Inquirer: <strong className="text-espresso">{o.customerName}</strong> ({o.phoneNumber})</p>
                                </div>
                              </div>

                              {/* Delivery address details */}
                              <div className="text-xs text-espresso/80 space-y-0.5">
                                <p><span className="text-taupe">Assigned Hub State:</span> {o.city}, {o.state} – <span className="font-mono font-bold text-espresso">{o.postalCode}</span></p>
                                <p><span className="text-taupe">Items Curated:</span></p>
                                <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px]">
                                  {o.items.map((it, idx) => (
                                    <li key={idx}>
                                      <strong className="text-espresso">{it.product.name}</strong> – Qty: {it.quantity} (₹{it.product.price.toLocaleString('en-IN')} each)
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Price accounting */}
                              <div className="flex items-center justify-between bg-linen/20 px-3 py-2 border border-espresso/5 text-xs">
                                <span className="text-taupe font-semibold">Coupon applied: <strong className="text-espresso">{o.couponApplied || 'None'}</strong></span>
                                <span className="font-bold text-espresso">Estimated Value: ₹{o.total.toLocaleString('en-IN')}</span>
                              </div>

                              {/* Response Status & Action */}
                              <div className="flex items-center justify-between pt-2 border-t border-espresso/5">
                                <div className="flex items-center space-x-1.5">
                                  <span className="text-[10px] uppercase text-taupe font-bold">Inquiry Response Status:</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold ${
                                    o.isPaid 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}>
                                    {o.isPaid ? 'Replied & Followed Up ✓' : 'Pending Response'}
                                  </span>
                                </div>

                                <button 
                                  onClick={() => onTogglePaymentStatus?.(o.id)}
                                  className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-extrabold border rounded-xs transition-colors ${
                                    o.isPaid 
                                      ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' 
                                      : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                                  }`}
                                >
                                  {o.isPaid ? 'Revoke Replied Status' : 'Mark as Replied / Followed Up'}
                                </button>
                              </div>

                              {/* Stepper dispatch actions */}
                              <div className="flex items-center justify-between pt-2 border-t border-espresso/5">
                                <div className="flex items-center space-x-1.5">
                                  <span className="text-[10px] uppercase text-taupe font-bold">Curator Status:</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold ${
                                    o.status === 'Delivered' 
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : o.status === 'Dispatched'
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'bg-amber-50 text-amber-700'
                                  }`}>
                                    {o.status === 'Delivered' ? 'Replied' : o.status === 'Dispatched' ? 'In Progress' : 'Received'}
                                  </span>
                                </div>

                                {/* Action keys */}
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => onUpdateOrderStatus(o.id, 'Pending')}
                                    className={`px-3 py-1 text-[9px] uppercase tracking-wider font-extrabold border ${
                                      o.status === 'Pending' 
                                        ? 'bg-amber-600 text-white border-amber-600' 
                                        : 'bg-white border-espresso/20 text-espresso hover:bg-linen/20'
                                    }`}
                                  >
                                    Set Received
                                  </button>
                                  <button 
                                    onClick={() => onUpdateOrderStatus(o.id, 'Dispatched')}
                                    className={`px-3 py-1 text-[9px] uppercase tracking-wider font-extrabold border ${
                                      o.status === 'Dispatched' 
                                        ? 'bg-blue-600 text-white border-blue-600' 
                                        : 'bg-white border-espresso/20 text-espresso hover:bg-linen/20'
                                    }`}
                                  >
                                    Set In Progress
                                  </button>
                                  <button 
                                    onClick={() => onUpdateOrderStatus(o.id, 'Delivered')}
                                    className={`px-3 py-1 text-[9px] uppercase tracking-wider font-extrabold border ${
                                      o.status === 'Delivered' 
                                        ? 'bg-emerald-600 text-white border-emerald-600' 
                                        : 'bg-white border-espresso/20 text-espresso hover:bg-linen/20'
                                    }`}
                                  >
                                    Set Replied
                                  </button>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ========================================== */}
                  {/* --- NEW TAB: REGISTERED CUSTOMERS --- */}
                  {/* ========================================== */}
                  {adminTab === 'customers' && (
                    <div className="space-y-4">
                      <div className="border-b border-espresso/10 pb-2">
                        <h4 className="font-serif text-sm font-bold text-espresso">Registered Customers & Guest Directory ({customers.length})</h4>
                        <p className="text-[10px] text-taupe mt-1">Track and manage users and guests who have signed up or made custom curation enquiries</p>
                      </div>

                      {customers.length === 0 ? (
                        <div className="text-center py-12 text-taupe text-xs bg-[#FAF8F6] border border-dashed border-espresso/15 rounded-xs">
                          No customer or guest accounts have been registered yet. Once they sign up or checkout as a guest, they will appear here.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {customers.map((customer, idx) => (
                            <div 
                              key={customer.phoneNumber + idx}
                              className="p-4 bg-[#FAF8F6] border border-espresso/10 rounded-xs space-y-2 hover:shadow-xs transition-all flex flex-col justify-between"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-espresso text-linen font-serif font-bold text-xs flex items-center justify-center rounded-full flex-shrink-0">
                                    {customer.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <h5 className="font-serif text-xs font-bold text-espresso">{customer.name}</h5>
                                    <p className="text-[9px] text-taupe">Registered on {customer.joinDate || 'N/A'}</p>
                                  </div>
                                </div>
                                <div className="text-[11px] space-y-1 pt-2 border-t border-espresso/5 mt-2">
                                  <p className="text-espresso"><strong className="text-taupe font-semibold">WhatsApp: </strong>{customer.phoneNumber}</p>
                                  {customer.email && <p className="text-espresso"><strong className="text-taupe font-semibold">Email: </strong>{customer.email}</p>}
                                  <p className="text-espresso"><strong className="text-taupe font-semibold">Location: </strong>{customer.city}, {customer.state} {customer.postalCode ? `– ${customer.postalCode}` : ''}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ========================================== */}
                  {/* --- TAB D: PROMO COUPON MANAGER --- */}
                  {/* ========================================== */}
                  {adminTab === 'coupons' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* Coupon generator Form */}
                      <form onSubmit={handleCreateCoupon} className="bg-[#FAF8F6] border border-espresso/10 p-5 rounded-xs space-y-4">
                        <div className="border-b border-espresso/10 pb-2 flex items-center space-x-1.5">
                          <Percent className="w-4 h-4 text-terracotta" />
                          <h4 className="font-serif text-sm font-bold text-espresso">Generate Promo Coupon</h4>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Coupon Code</label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. LUXURY20"
                              value={newCouponCode}
                              onChange={(e) => setNewCouponCode(e.target.value)}
                              className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden uppercase tracking-widest font-bold"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Value</label>
                              <input 
                                type="number" 
                                required
                                value={newCouponValue}
                                onChange={(e) => setNewCouponValue(Number(e.target.value))}
                                className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">Discount Style</label>
                              <select 
                                value={newCouponType}
                                onChange={(e) => setNewCouponType(e.target.value as 'percent' | 'flat')}
                                className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                              >
                                <option value="percent">Percentage (%) Off</option>
                                <option value="flat">Flat Cash (₹) Off</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-2.5 bg-espresso hover:bg-terracotta text-[#FAF8F6] text-[10px] uppercase tracking-widest font-extrabold shadow-md transition-colors"
                        >
                          Publish Promo Code
                        </button>
                      </form>

                      {/* Coupon Listings */}
                      <div className="space-y-3">
                        <h4 className="font-serif text-sm font-bold text-espresso border-b border-espresso/10 pb-2">Active Promotional Coupons</h4>
                        
                        <div className="space-y-2">
                          {coupons.map(cp => (
                            <div 
                              key={cp.code}
                              className="bg-white border border-espresso/10 p-3 rounded-xs flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="px-2.5 py-1 bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs uppercase tracking-widest font-extrabold rounded-sm">
                                  {cp.code}
                                </span>
                                <span className="text-xs text-espresso font-semibold">
                                  – {cp.type === 'percent' ? `${cp.value}% Off` : `₹${cp.value} Flat Off`}
                                </span>
                              </div>

                              <button 
                                onClick={() => onDeleteCoupon(cp.code)}
                                className="p-1 text-espresso/40 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                                title="Remove coupon"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ========================================== */}
                  {/* --- TAB E: HOMEPAGE HERO & CATEGORY SETTINGS --- */}
                  {/* ========================================== */}
                  {adminTab === 'settings' && (
                    <div className="space-y-8 max-w-4xl">
                      {/* Homepage Hero Banner Settings */}
                      <form onSubmit={handleSaveBanner} className="bg-white border border-espresso/10 p-5 rounded-xs space-y-4 max-w-lg shadow-3xs">
                        <div className="border-b border-espresso/10 pb-2 flex items-center space-x-1.5">
                          <Settings className="w-4 h-4 text-terracotta" />
                          <h4 className="font-serif text-sm font-bold text-espresso">Live Homepage Customizer</h4>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">
                              Hero Headline (Playfair Display)
                            </label>
                            <input 
                              type="text" 
                              required
                              value={bannerTitle}
                              onChange={(e) => setBannerTitle(e.target.value)}
                              className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase tracking-wider font-semibold text-espresso mb-1">
                              Hero Subtitle / Tagline
                            </label>
                            <input 
                              type="text" 
                              required
                              value={bannerSub}
                              onChange={(e) => setBannerSub(e.target.value)}
                              className="w-full border border-espresso/20 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="py-2.5 px-6 bg-espresso hover:bg-terracotta text-[#FAF8F6] text-[10px] uppercase tracking-widest font-extrabold shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                        >
                          {bannerUpdated ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Saved Banner changes!</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-linen" />
                              <span>Apply Banner Updates</span>
                            </>
                          )}
                        </button>
                      </form>

                      {/* Shop By Category Customizer */}
                      <div className="bg-white border border-espresso/10 p-5 rounded-xs space-y-6 shadow-3xs">
                        <div className="border-b border-espresso/10 pb-2 flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <Sliders className="w-4 h-4 text-terracotta" />
                            <h4 className="font-serif text-sm font-bold text-espresso">Shop By Category & Name Settings</h4>
                          </div>
                          <span className="text-[9px] uppercase tracking-wider text-taupe font-bold">Edit names, subtitles, and images of categories</span>
                        </div>

                        <form onSubmit={handleSaveCategories} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {localCategories.map((cat, idx) => (
                              <div key={cat.tabId} className="p-3 bg-[#FAF8F6] border border-espresso/10 rounded-xs flex gap-4 items-center relative group">
                                {/* Thumbnail Preview */}
                                <div className="w-20 h-20 shrink-0 aspect-square bg-[#FAF8F6] border border-espresso/10 rounded-xs overflow-hidden relative">
                                  <img src={cat.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  {catUploadingIdx === idx && (
                                    <div className="absolute inset-0 bg-espresso/60 flex items-center justify-center">
                                      <span className="w-2 h-2 bg-terracotta rounded-full animate-ping"></span>
                                    </div>
                                  )}
                                </div>

                                {/* Controls */}
                                <div className="flex-1 space-y-2 relative pr-6">
                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCategory(idx)}
                                    className="absolute top-0 right-0 p-1 text-taupe hover:text-terracotta rounded-xs transition-colors cursor-pointer"
                                    title="Delete Category"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-[8px] uppercase tracking-wider font-semibold text-espresso mb-0.5">
                                        Category Name
                                      </label>
                                      <input 
                                        type="text" 
                                        required
                                        placeholder="Category Name"
                                        value={cat.title}
                                        onChange={(e) => handleCategoryFieldChange(idx, 'title', e.target.value)}
                                        className="w-full border border-espresso/15 p-1 text-[10px] text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[8px] uppercase tracking-wider font-semibold text-espresso mb-0.5">
                                        Subtitle
                                      </label>
                                      <input 
                                        type="text" 
                                        placeholder="Subtitle (Optional)"
                                        value={cat.subtitle || ''}
                                        onChange={(e) => handleCategoryFieldChange(idx, 'subtitle', e.target.value)}
                                        className="w-full border border-espresso/15 p-1 text-[10px] text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[8px] uppercase tracking-wider font-semibold text-espresso mb-0.5">
                                      Image URL
                                    </label>
                                    <input 
                                      type="url" 
                                      placeholder="Paste Image URL..."
                                      value={cat.imageUrl}
                                      onChange={(e) => handleCategoryFieldChange(idx, 'imageUrl', e.target.value)}
                                      className="w-full border border-espresso/15 p-1 text-[10px] text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                    />
                                  </div>

                                  {/* File upload for each category */}
                                  <div className="flex items-center space-x-2 pt-1 border-t border-espresso/5">
                                    <input 
                                      type="file" 
                                      accept="image/*"
                                      id={`cat-upload-${idx}`}
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleCategoryUpload(idx, file);
                                      }}
                                    />
                                    <label 
                                      htmlFor={`cat-upload-${idx}`}
                                      className="px-2 py-0.5 bg-white hover:bg-espresso/5 border border-espresso/20 text-[8px] uppercase tracking-wider font-extrabold text-espresso cursor-pointer transition-colors"
                                    >
                                      {catUploadingIdx === idx ? 'Uploading...' : 'Upload File'}
                                    </label>
                                    <span className="text-[8px] text-taupe">Or upload image</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Dynamic Add New Category Form Subsection */}
                          <div className="p-4 bg-linen/25 border border-espresso/10 rounded-xs space-y-4">
                            <h5 className="text-[10px] uppercase tracking-widest font-extrabold text-espresso flex items-center space-x-1.5 border-b border-espresso/5 pb-1">
                              <Plus className="w-3.5 h-3.5 text-terracotta" />
                              <span>Add New Shop Category</span>
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-extrabold text-espresso mb-1">
                                  Category Name *
                                </label>
                                <input 
                                  type="text"
                                  placeholder="e.g. ANKLETS"
                                  value={newCatName}
                                  onChange={(e) => setNewCatName(e.target.value)}
                                  className="w-full border border-espresso/15 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-extrabold text-espresso mb-1">
                                  Subtitle (Optional)
                                </label>
                                <input 
                                  type="text"
                                  placeholder="e.g. SHINE"
                                  value={newCatSub}
                                  onChange={(e) => setNewCatSub(e.target.value)}
                                  className="w-full border border-espresso/15 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-extrabold text-espresso mb-1">
                                  Image URL (or upload below)
                                </label>
                                <input 
                                  type="url"
                                  placeholder="Paste image web address..."
                                  value={newCatImg}
                                  onChange={(e) => setNewCatImg(e.target.value)}
                                  className="w-full border border-espresso/15 p-2 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                                />
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  id="new-cat-upload"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleNewCategoryUpload(file);
                                  }}
                                />
                                <label 
                                  htmlFor="new-cat-upload"
                                  className="px-3 py-1 bg-white hover:bg-espresso/5 border border-espresso/20 text-[9px] uppercase tracking-wider font-extrabold text-espresso cursor-pointer transition-colors"
                                >
                                  {newCatUploading ? 'Uploading...' : 'Upload Image File'}
                                </label>
                                <span className="text-[9px] text-taupe font-semibold">Max 1MB, or use the Image URL input</span>
                              </div>
                              
                              <button
                                type="button"
                                onClick={handleAddNewCategory}
                                className="px-4 py-2 bg-terracotta hover:bg-espresso text-white text-[9px] uppercase tracking-wider font-extrabold transition-colors cursor-pointer"
                              >
                                Add Category to Catalog
                              </button>
                            </div>
                          </div>

                          <div className="pt-2">
                            <button 
                              type="submit"
                              className="py-2.5 px-6 bg-espresso hover:bg-terracotta text-[#FAF8F6] text-[10px] uppercase tracking-widest font-extrabold shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                            >
                              {categoriesUpdated ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Saved Catalog Settings!</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 text-linen" />
                                  <span>Update Category Settings</span>
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* ========================================== */}
                  {/* --- TAB F: CUSTOMER REVIEWS & MODERATION --- */}
                  {/* ========================================== */}
                  {adminTab === 'reviews' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-espresso/10 p-5 rounded-xs shadow-2xs">
                        <div className="space-y-1">
                          <h4 className="font-serif text-base font-bold text-espresso flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-terracotta" />
                            <span>Customer Reviews & Feedback</span>
                          </h4>
                          <p className="text-[10px] text-taupe uppercase tracking-wider font-semibold">
                            Moderate, view, and monitor customer-submitted testimonials across India.
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center px-4 border-r border-espresso/10">
                            <p className="text-[9px] text-taupe font-extrabold uppercase">Total Reviews</p>
                            <p className="text-lg font-serif font-bold text-espresso">{reviews.length}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] text-taupe font-extrabold uppercase">Average Rating</p>
                            <p className="text-lg font-serif font-bold text-terracotta">
                              {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)).toFixed(1)} / 5.0
                            </p>
                          </div>
                        </div>
                      </div>

                      {reviews.length === 0 ? (
                        <div className="text-center py-12 bg-white border border-espresso/10 rounded-xs space-y-3">
                          <p className="text-sm text-taupe">No customer reviews have been submitted yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {reviews.map((rev) => (
                            <div 
                              key={rev.id} 
                              className="bg-white border border-espresso/10 p-5 rounded-xs shadow-3xs flex flex-col justify-between space-y-4 hover:border-terracotta/30 transition-all"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  {/* Star Rating */}
                                  <div className="flex space-x-0.5 text-amber-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-espresso/10'}`} 
                                      />
                                    ))}
                                  </div>
                                  
                                  {/* Delete / Moderate Button */}
                                  {onDeleteReview && (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to remove ${rev.name}'s review?`)) {
                                          onDeleteReview(rev.id);
                                        }
                                      }}
                                      className="p-1.5 text-espresso/40 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
                                      title="Remove review"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                                <p className="text-xs text-espresso/90 font-sans italic leading-relaxed">
                                  "{rev.quote}"
                                </p>
                              </div>

                              <div className="flex items-center space-x-3 pt-3 border-t border-espresso/5">
                                <div className="w-8 h-8 rounded-full bg-[#C3A6A0]/15 flex items-center justify-center text-[10px] font-bold text-terracotta border border-terracotta/10 shrink-0">
                                  {rev.avatarInitials}
                                </div>
                                <div>
                                  <h5 className="font-serif text-xs font-semibold text-espresso">{rev.name}</h5>
                                  <p className="text-[9px] text-taupe uppercase tracking-wider font-semibold">
                                    {rev.city}, {rev.state}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ========================================== */}
                  {/* --- TAB H: ZERISH LUXE STUDIO (INSTAGRAM) --- */}
                  {/* ========================================== */}
                  {adminTab === 'studio' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-espresso/10 p-5 rounded-xs shadow-2xs">
                        <div className="space-y-1">
                          <h4 className="font-serif text-base font-bold text-espresso flex items-center space-x-2">
                            <Instagram className="w-4 h-4 text-terracotta" />
                            <span>Zerish Luxe Studio (#zerishluxestudio)</span>
                          </h4>
                          <p className="text-[10px] text-taupe uppercase tracking-wider font-semibold">
                            Publish Instagram-style photos & videos directly to your website gallery.
                          </p>
                        </div>
                        <div className="text-center px-4">
                          <p className="text-[9px] text-taupe font-extrabold uppercase">Total Posts</p>
                          <p className="text-lg font-serif font-bold text-espresso">{instagramPosts.length}</p>
                        </div>
                      </div>

                      {/* Add New Studio Post Form */}
                      <div className="bg-white border border-espresso/10 p-5 rounded-xs shadow-3xs space-y-4">
                        <h5 className="font-serif text-xs font-bold text-espresso uppercase tracking-wider border-b border-espresso/5 pb-2">
                          Add New Instagram Post or Video
                        </h5>
                        <form 
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (!studioImageUrl) {
                              alert('Please provide a Cover Image URL');
                              return;
                            }
                            setStudioIsSubmitting(true);
                            try {
                              if (onAddInstagramPost) {
                                const finalPost: InstagramPost = {
                                  id: 'post-' + Date.now(),
                                  handle: studioHandle || '@zerishluxe.studio',
                                  imageUrl: studioImageUrl,
                                  videoUrl: studioVideoUrl || undefined,
                                  caption: studioCaption || '#zerishluxestudio',
                                  likes: Math.floor(Math.random() * 400) + 100,
                                  comments: Math.floor(Math.random() * 30) + 5,
                                  location: studioLocation || 'Kochi, Kerala',
                                  jewellery: studioJewellery || 'Zerish Luxe Fine Jewelry'
                                };
                                await onAddInstagramPost(finalPost);
                                // Reset form
                                setStudioHandle('@');
                                setStudioImageUrl('');
                                setStudioVideoUrl('');
                                setStudioCaption('');
                                setStudioLocation('');
                                setStudioJewellery('');
                                alert('Studio post added successfully!');
                              }
                            } catch (err: any) {
                              alert('Error: ' + err.message);
                            } finally {
                              setStudioIsSubmitting(false);
                            }
                          }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-espresso">Instagram Handle</label>
                            <input 
                              type="text" 
                              required
                              placeholder="@handle" 
                              value={studioHandle} 
                              onChange={(e) => setStudioHandle(e.target.value)}
                              className="w-full border border-espresso/10 p-2 text-xs bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-espresso">Location Name</label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. Kochi, Kerala" 
                              value={studioLocation} 
                              onChange={(e) => setStudioLocation(e.target.value)}
                              className="w-full border border-espresso/10 p-2 text-xs bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-espresso">Featured Jewellery/Product</label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. Herringbone Flat Chain" 
                              value={studioJewellery} 
                              onChange={(e) => setStudioJewellery(e.target.value)}
                              className="w-full border border-espresso/10 p-2 text-xs bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-espresso">Cover Image URL</label>
                            <input 
                              type="text" 
                              required
                              placeholder="https://images.unsplash.com/photo-..." 
                              value={studioImageUrl} 
                              onChange={(e) => setStudioImageUrl(e.target.value)}
                              className="w-full border border-espresso/10 p-2 text-xs bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden"
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-espresso">Video URL (Optional - direct .mp4 link)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. https://assets.mixkit.co/videos/preview/...mp4" 
                              value={studioVideoUrl} 
                              onChange={(e) => setStudioVideoUrl(e.target.value)}
                              className="w-full border border-espresso/10 p-2 text-xs bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden"
                            />
                            <p className="text-[9px] text-taupe">Provide a direct MP4 URL to make this post show up as an interactive video player on your website's gallery.</p>
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-espresso">Caption (with hashtags)</label>
                            <textarea 
                              required
                              rows={3}
                              placeholder="e.g. Adored by everyone. Super waterproof... #zerishluxestudio #antitarnish" 
                              value={studioCaption} 
                              onChange={(e) => setStudioCaption(e.target.value)}
                              className="w-full border border-espresso/10 p-2 text-xs bg-[#FAF8F6] focus:border-terracotta focus:outline-hidden resize-none"
                            />
                          </div>

                          <div className="md:col-span-2 pt-2">
                            <button 
                              type="submit"
                              disabled={studioIsSubmitting}
                              className="w-full py-2.5 bg-espresso hover:bg-terracotta text-white text-[10px] uppercase tracking-widest font-extrabold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                            >
                              {studioIsSubmitting ? 'Publishing Post...' : 'Publish Studio Post & Video'}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Existing Posts Grid */}
                      <div className="space-y-3">
                        <h5 className="font-serif text-xs font-bold text-espresso uppercase tracking-wider">
                          Active Studio Posts
                        </h5>
                        {instagramPosts.length === 0 ? (
                          <div className="text-center py-8 bg-white border border-espresso/10 rounded-xs">
                            <p className="text-xs text-taupe">No studio posts found.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {instagramPosts.map((post) => (
                              <div key={post.id} className="bg-white border border-espresso/10 p-3 rounded-xs flex flex-col justify-between space-y-2 relative group hover:border-terracotta/30 transition-all">
                                <div className="aspect-square w-full bg-linen relative overflow-hidden rounded-xs">
                                  {post.videoUrl ? (
                                    <video src={post.videoUrl} className="w-full h-full object-cover" muted />
                                  ) : (
                                    <img src={post.imageUrl} alt={post.handle} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  )}
                                  {post.videoUrl && (
                                    <div className="absolute top-1 right-1 bg-espresso/80 text-white p-1 rounded-full text-[8px] z-10 font-bold uppercase tracking-wider px-1.5 py-0.5">
                                      📹 VIDEO
                                    </div>
                                  )}
                                </div>
                                <div className="pt-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-extrabold text-espresso">{post.handle}</span>
                                    {onDeleteInstagramPost && (
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          if (confirm('Are you sure you want to delete this studio post?')) {
                                            onDeleteInstagramPost(post.id);
                                          }
                                        }}
                                        className="p-1 text-espresso/40 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-[9px] text-taupe truncate mt-1">{post.caption}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Interactive Sign-out footer */}
                <div className="p-4 border-t border-espresso/10 bg-[#F7F1F0] text-center flex items-center justify-between mt-auto">
                  <span className="text-[9px] text-taupe uppercase tracking-widest font-mono font-semibold">Status: Connected (Local Live Sync)</span>
                  <button 
                    onClick={() => {
                      setIsAuthenticated(false);
                      setPasscode('');
                    }}
                    className="px-4 py-1.5 bg-white border border-espresso/20 text-[9px] uppercase tracking-widest text-espresso hover:bg-espresso hover:text-white rounded-full transition-colors font-extrabold"
                  >
                    Lock Session
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
