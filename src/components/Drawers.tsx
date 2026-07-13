import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Clock, 
  Trash2, 
  Check, 
  ChevronRight, 
  LogOut
} from 'lucide-react';
import { Product, CartItem, Order, UserAccount } from '../types';

/* ======================================================== */
/* --- 1. SEARCH DRAWER --- */
/* ======================================================== */
interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function SearchDrawer({ isOpen, onClose, products, onSelectProduct, onAddToCart }: SearchDrawerProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity" onClick={onClose}></div>
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F6] border-l border-espresso/10">
          <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll no-scrollbar">
            
            {/* Header */}
            <div className="px-6 flex items-center justify-between border-b border-espresso/10 pb-4">
              <h2 className="font-serif text-lg font-semibold text-espresso">Search Catalog</h2>
              <button onClick={onClose} className="p-1 rounded-full text-espresso hover:bg-espresso hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input */}
            <div className="px-6 py-4">
              <div className="relative">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Type to search chains, studs, hair claw..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full border border-espresso/20 py-2.5 pl-3 pr-10 text-xs text-espresso bg-white focus:border-terracotta focus:outline-hidden"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" />
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 px-6 space-y-4">
              {query.trim().length === 0 ? (
                <div className="text-center py-12 text-taupe space-y-2">
                  <p className="text-xs">Looking for something specific?</p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {['Chains', 'Baroque', 'Cuffs', 'Pearl', 'Studs', 'Hair Claw'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3 py-1 bg-linen/25 border border-espresso/10 rounded-full text-[10px] uppercase font-semibold text-espresso hover:bg-terracotta hover:text-white transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-taupe text-xs">
                  No products matched "{query}"
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] text-taupe uppercase tracking-widest font-semibold mb-2">
                    Matches ({filtered.length})
                  </p>
                  {filtered.map(p => (
                    <div 
                      key={p.id}
                      className="flex items-center justify-between p-2 border border-espresso/5 bg-[#FAF8F6] hover:border-terracotta/40 transition-colors"
                    >
                      <div 
                        className="flex items-center space-x-3 cursor-pointer min-w-0"
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                      >
                        <div className="w-12 h-12 bg-linen border border-espresso/5 overflow-hidden flex-shrink-0">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-xs font-bold text-espresso truncate">{p.name}</h4>
                          <p className="text-[9px] uppercase text-taupe">{p.category === 'cuff-bracelets' ? 'Cuff Bangles' : p.category.replace('-', ' ')}</p>
                          <p className="text-xs font-semibold text-espresso mt-0.5">₹{p.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => onAddToCart(p)}
                        className="p-1.5 bg-espresso text-white hover:bg-terracotta transition-all rounded-xs"
                        title="Add to Enquiry List"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


/* ======================================================== */
/* --- 2. WISHLIST DRAWER --- */
/* ======================================================== */
interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: string[];
  products: Product[];
  onRemoveFromWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export function WishlistDrawer({ isOpen, onClose, wishlist, products, onRemoveFromWishlist, onAddToCart, onSelectProduct }: WishlistDrawerProps) {
  if (!isOpen) return null;

  const favorited = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity" onClick={onClose}></div>
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F6] border-l border-espresso/10">
          <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll no-scrollbar">
            
            {/* Header */}
            <div className="px-6 flex items-center justify-between border-b border-espresso/10 pb-4">
              <h2 className="font-serif text-lg font-semibold text-espresso flex items-center space-x-2">
                <Heart className="w-5 h-5 text-terracotta fill-terracotta" />
                <span>My Saved Pieces ({favorited.length})</span>
              </h2>
              <button onClick={onClose} className="p-1 rounded-full text-espresso hover:bg-espresso hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 px-6 py-4 space-y-4">
              {favorited.length === 0 ? (
                <div className="text-center py-16 text-taupe space-y-3">
                  <Heart className="w-10 h-10 stroke-[1.2] text-taupe/50 mx-auto" />
                  <p className="text-xs">Your wishlist is currently empty.</p>
                  <p className="text-[11px] text-taupe leading-relaxed">
                    Explore our minimal collections and tap the heart icon to save your favorite anti-tarnish items here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorited.map(p => (
                    <div 
                      key={p.id}
                      className="flex items-center justify-between p-2.5 border border-espresso/5 bg-[#FAF8F6] rounded-sm hover:border-terracotta/20 transition-all"
                    >
                      <div 
                        className="flex items-center space-x-3 cursor-pointer min-w-0"
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                      >
                        <div className="w-12 h-12 bg-linen border border-espresso/5 overflow-hidden flex-shrink-0">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-xs font-bold text-espresso truncate max-w-[150px]">{p.name}</h4>
                          <p className="text-xs font-bold text-espresso mt-0.5">₹{p.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            onAddToCart(p);
                            onRemoveFromWishlist(p.id);
                          }}
                          className="px-2.5 py-1.5 bg-espresso text-[#FAF8F6] hover:bg-terracotta transition-colors text-[9px] uppercase tracking-widest font-extrabold"
                        >
                          Add to Enquiry List
                        </button>
                        <button 
                          onClick={() => onRemoveFromWishlist(p.id)}
                          className="p-1.5 text-espresso/45 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


/* ======================================================== */
/* --- 3. ACCOUNT DRAWER & ORDER LOGS --- */
/* ======================================================== */
interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onOpenTrackModal: () => void;
  currentUser: UserAccount | null;
  onSignUp: (user: UserAccount) => void;
  onLogOut: () => void;
}

export function AccountDrawer({ 
  isOpen, 
  onClose, 
  orders, 
  onOpenTrackModal, 
  currentUser, 
  onSignUp, 
  onLogOut 
}: AccountDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phoneNumber.trim() || !formData.city.trim() || !formData.state.trim() || !formData.postalCode.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (/[^\d]/.test(formData.phoneNumber)) {
      setErrorMsg('Phone number must contain numbers only.');
      return;
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address (e.g., mail@gmail.com).');
      return;
    }
    if (/[^\d]/.test(formData.postalCode)) {
      setErrorMsg('Pincode must contain numbers only.');
      return;
    }
    setErrorMsg('');
    const newAccount: UserAccount = {
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phoneNumber: formData.phoneNumber.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      postalCode: formData.postalCode.trim(),
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    onSignUp(newAccount);
  };

  // Filter orders matching logged-in customer's phone number
  const userOrders = currentUser 
    ? orders.filter(o => o.phoneNumber.trim() === currentUser.phoneNumber.trim())
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity" onClick={onClose}></div>
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F6] border-l border-espresso/10">
          <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll no-scrollbar">
                     {/* Header */}
            <div className="px-6 flex items-center justify-between border-b border-espresso/10 pb-4">
              <h2 className="font-serif text-lg font-semibold text-espresso flex items-center space-x-2">
                <User className="w-5 h-5 text-terracotta" />
                <span>My Account</span>
              </h2>
              <button onClick={onClose} className="p-1 rounded-full text-espresso hover:bg-espresso hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 px-6 py-4 space-y-6">
              
              {!currentUser ? (
                /* GUEST USER: SIGN UP FORM */
                <div className="space-y-4">

                  <form onSubmit={handleRegister} className="space-y-3.5">
                    {errorMsg && (
                      <p className="text-[10px] text-rose-600 font-semibold">{errorMsg}</p>
                    )}

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-espresso mb-1">Your Full Name *</label>
                      <input 
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border border-espresso/20 p-2 text-xs bg-white focus:outline-hidden focus:border-terracotta"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-espresso mb-1">WhatsApp / Phone Number *</label>
                      <input 
                        type="tel"
                        required
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="w-full border border-espresso/20 p-2 text-xs bg-white focus:outline-hidden focus:border-terracotta"
                      />
                      {/[^\d]/.test(formData.phoneNumber) && formData.phoneNumber !== '' && (
                        <p className="text-[10px] text-rose-600 mt-1 font-semibold">
                          Warning: Phone number must contain only numbers. Letters or special characters are not allowed.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-espresso mb-1">Email Address (Optional)</label>
                      <input 
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full border border-espresso/20 p-2 text-xs bg-white focus:outline-hidden focus:border-terracotta"
                      />
                      {formData.email !== '' && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email) && (
                        <p className="text-[10px] text-rose-600 mt-1 font-semibold">
                          Warning: Please enter a valid email address with a proper extension (e.g., @gmail.com).
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider font-bold text-espresso mb-1">State *</label>
                        <input 
                          type="text"
                          required
                          placeholder="Enter state"
                          value={formData.state}
                          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full border border-espresso/20 p-2 text-xs bg-white focus:outline-hidden focus:border-terracotta"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider font-bold text-espresso mb-1">City *</label>
                        <input 
                          type="text"
                          required
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full border border-[#59433F]/20 p-2 text-xs bg-white focus:outline-hidden focus:border-terracotta"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-espresso mb-1">Postal Pincode *</label>
                      <input 
                        type="text"
                        required
                        placeholder="Enter pincode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                        className="w-full border border-espresso/20 p-2 text-xs bg-white focus:outline-hidden focus:border-terracotta"
                      />
                      {/[^\d]/.test(formData.postalCode) && formData.postalCode !== '' && (
                        <p className="text-[10px] text-rose-600 mt-1 font-semibold">
                          Warning: Pincode must contain only numbers. Letters or special characters are not allowed.
                        </p>
                      )}
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-espresso text-[#FAF8F6] hover:bg-terracotta text-xs uppercase tracking-widest font-extrabold shadow-md transition-all mt-3"
                    >
                      Sign Up / Login
                    </button>
                  </form>
                </div>
              ) : (
                /* AUTHENTICATED USER PROFILE */
                <>
                  {/* Profile Card */}
                  <div className="p-4 bg-linen/25 border border-espresso/10 rounded-xs flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-espresso text-linen font-serif font-bold text-base flex items-center justify-center rounded-full">
                        {currentUser.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-bold text-espresso">{currentUser.name}</h4>
                        <p className="text-[10px] text-taupe">Member since {currentUser.joinDate}</p>
                      </div>
                    </div>

                    <button 
                      onClick={onLogOut}
                      className="p-1.5 text-espresso/45 hover:text-terracotta rounded-full hover:bg-linen/20 transition-all"
                      title="Log Out of Circle"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>

                  {/* User demographic overview */}
                  <div className="bg-[#FAF8F6] p-3 border border-espresso/5 rounded-xs text-[10px] text-espresso/80 space-y-1">
                    <p><span className="text-taupe font-semibold">Contact:</span> {currentUser.phoneNumber}</p>
                    <p><span className="text-taupe font-semibold">Curation Hub:</span> {currentUser.city}, {currentUser.state} ({currentUser.postalCode})</p>
                  </div>

                  {/* Enquiry History */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-xs font-bold text-espresso flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-taupe" />
                        <span>My Enquiry Logs ({userOrders.length})</span>
                      </h4>
                      
                      <button 
                        onClick={() => {
                          onOpenTrackModal();
                          onClose();
                        }}
                        className="text-[9px] text-terracotta font-extrabold uppercase tracking-wider hover:text-espresso transition-colors"
                      >
                        Track Enquiry
                      </button>
                    </div>

                    {userOrders.length === 0 ? (
                      <div className="text-center py-8 text-taupe text-xs leading-normal">
                        You have not submitted any enquiries yet. Submit your curated items via checkout.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                        {userOrders.map(o => (
                          <div 
                            key={o.id} 
                            className="bg-[#FAF8F6] border border-espresso/5 p-3 rounded-xs space-y-2 hover:border-espresso/15 transition-all"
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-semibold text-espresso uppercase tracking-wider">ID: {o.id}</span>
                              <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[8px] tracking-wider ${
                                o.status === 'Delivered' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : o.status === 'Dispatched'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                  : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {o.status === 'Delivered' ? 'Replied' : o.status === 'Dispatched' ? 'In Progress' : 'Received'}
                              </span>
                            </div>

                            {/* Items list summary */}
                            <div className="text-[11px] text-espresso/80 border-t border-b border-espresso/5 py-1.5 space-y-1">
                              {o.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span className="truncate max-w-[190px]">{it.product.name} (x{it.quantity})</span>
                                  <span>₹{(it.product.price * it.quantity).toLocaleString('en-IN')}</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-taupe">{o.date}</span>
                              <span className="font-bold text-espresso">Value: ₹{o.total.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="flex items-center justify-between bg-white px-2 py-1 border border-espresso/5 rounded-xs text-[9px]">
                              <span className="text-taupe uppercase tracking-wider">Enquiry Code:</span>
                              <span className="font-mono font-bold text-espresso uppercase">{o.trackingNumber}</span>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
