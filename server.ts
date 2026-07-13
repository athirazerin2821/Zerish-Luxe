import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { INITIAL_PRODUCTS, TESTIMONIALS } from "./src/data";
import { Product, Order, Coupon, Testimonial } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- DATABASE PATHS & SETUP ---
const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const COUPONS_FILE = path.join(DATA_DIR, "coupons.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const HERO_FILE = path.join(DATA_DIR, "hero.json");

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function initJSONFile<T>(filePath: string, defaultData: T) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf8");
  }
}

// Default orders
const DEFAULT_ORDERS: Order[] = [
  {
    id: "ZL-4291",
    customerName: "Anjali Nair",
    phoneNumber: "9446012345",
    city: "Kochi",
    state: "Kerala",
    postalCode: "682016",
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 }
    ],
    total: 1899,
    discount: 0,
    status: "Delivered",
    date: "Jul 4, 2026",
    trackingNumber: "ZL-TRACK-4291",
    isPaid: true
  },
  {
    id: "ZL-8910",
    customerName: "Keerthana S",
    phoneNumber: "9840123456",
    city: "Chennai",
    state: "Tamil Nadu",
    postalCode: "600001",
    items: [
      { product: INITIAL_PRODUCTS[10], quantity: 1 }
    ],
    total: 2190,
    discount: 0,
    status: "Dispatched",
    date: "Jul 5, 2026",
    trackingNumber: "ZL-TRACK-8910",
    isPaid: false
  }
];

// Default coupons
const DEFAULT_COUPONS: Coupon[] = [];

// Default hero text
const DEFAULT_HERO = {
  title: "Minimal Elegance.",
  subtitle: "Everyday Luxury."
};

initJSONFile(PRODUCTS_FILE, INITIAL_PRODUCTS);
initJSONFile(ORDERS_FILE, DEFAULT_ORDERS);
initJSONFile(COUPONS_FILE, DEFAULT_COUPONS);
initJSONFile(REVIEWS_FILE, TESTIMONIALS);
initJSONFile(HERO_FILE, DEFAULT_HERO);

// Helper functions to read/write database
function readData<T>(filePath: string): T {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [] as unknown as T;
  }
}

function writeData<T>(filePath: string, data: T) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
}

// --- SECURE SELLER AUTHENTICATION CONFIG ---
const SELLER_PASSCODE = process.env.SELLER_PASSCODE || "zerish2026";
const SELLER_TOKEN = "zl-secure-token-2026-special";

// Middleware to authorize seller requests
function requireSellerAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${SELLER_TOKEN}`) {
    res.status(401).json({ error: "Unauthorized. Invalid or missing seller token." });
    return;
  }
  next();
}

// ==========================================================
// --- CUSTOMER API ROUTER (/api/customer/*) ---
// ==========================================================

// 1. Get public products catalog
app.get("/api/customer/products", (req, res) => {
  const products = readData<Product[]>(PRODUCTS_FILE);
  res.json(products);
});

// 2. Track order securely (Only returns order info matching tracking number - No other orders visible)
app.get("/api/customer/orders/:trackingNumber", (req, res) => {
  const { trackingNumber } = req.params;
  const orders = readData<Order[]>(ORDERS_FILE);
  const found = orders.find(
    o => o.trackingNumber.toLowerCase() === trackingNumber.toLowerCase() ||
         o.id.toLowerCase() === trackingNumber.toLowerCase()
  );
  if (!found) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(found);
});

// 3. Create a new customer order
app.post("/api/customer/orders", (req, res) => {
  const newOrder: Order = req.body;
  if (!newOrder || !newOrder.id || !newOrder.items) {
    res.status(400).json({ error: "Invalid order data" });
    return;
  }
  const orders = readData<Order[]>(ORDERS_FILE);
  orders.unshift(newOrder);
  writeData(ORDERS_FILE, orders);
  res.status(201).json({ message: "Order placed successfully", order: newOrder });
});

// 4. Get approved reviews/testimonials
app.get("/api/customer/reviews", (req, res) => {
  const reviews = readData<Testimonial[]>(REVIEWS_FILE);
  res.json(reviews);
});

// 5. Submit a customer review
app.post("/api/customer/reviews", (req, res) => {
  const newReview: Testimonial = req.body;
  if (!newReview || !newReview.id || !newReview.name || !newReview.quote) {
    res.status(400).json({ error: "Invalid review data" });
    return;
  }
  const reviews = readData<Testimonial[]>(REVIEWS_FILE);
  reviews.unshift(newReview);
  writeData(REVIEWS_FILE, reviews);
  res.status(201).json({ message: "Review submitted successfully", review: newReview });
});

// 6. Customer contact message submission
app.post("/api/customer/contact", (req, res) => {
  const { name, phone, city, state, category, message } = req.body;
  // Just log it or save to a file
  console.log(`Enquiry from ${name} (${phone}) in ${city}, ${state} for ${category}: ${message}`);
  res.json({ success: true, message: "Thank you for contacting us!" });
});

// 7. Customer newsletter subscription
app.post("/api/customer/newsletter", (req, res) => {
  const { email } = req.body;
  console.log(`Newsletter subscription request: ${email}`);
  res.json({ success: true, message: "Subscribed successfully!" });
});

// 8. Get active public hero text
app.get("/api/customer/hero", (req, res) => {
  const hero = readData<typeof DEFAULT_HERO>(HERO_FILE);
  res.json(hero);
});


// ==========================================================
// --- SELLER API ROUTER (/api/seller/*) ---
// ==========================================================

// 1. Seller portal login
app.post("/api/seller/login", (req, res) => {
  const { passcode } = req.body;
  if (passcode === SELLER_PASSCODE) {
    res.json({ success: true, token: SELLER_TOKEN });
  } else {
    res.status(401).json({ success: false, error: "Incorrect passcode." });
  }
});

// 2. Fetch all orders (Requires Seller authentication)
app.get("/api/seller/orders", requireSellerAuth, (req, res) => {
  const orders = readData<Order[]>(ORDERS_FILE);
  res.json(orders);
});

// 3. Update order shipping status
app.put("/api/seller/orders/:id/status", requireSellerAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ error: "Status is required" });
    return;
  }
  const orders = readData<Order[]>(ORDERS_FILE);
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  orders[index].status = status;
  writeData(ORDERS_FILE, orders);
  res.json({ success: true, order: orders[index] });
});

// 4. Toggle payment verification status
app.put("/api/seller/orders/:id/payment", requireSellerAuth, (req, res) => {
  const { id } = req.params;
  const orders = readData<Order[]>(ORDERS_FILE);
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  orders[index].isPaid = !orders[index].isPaid;
  writeData(ORDERS_FILE, orders);
  res.json({ success: true, order: orders[index] });
});

// 5. Add a product to catalog
app.post("/api/seller/products", requireSellerAuth, (req, res) => {
  const newProduct: Product = req.body;
  if (!newProduct || !newProduct.id || !newProduct.name) {
    res.status(400).json({ error: "Invalid product data" });
    return;
  }
  const products = readData<Product[]>(PRODUCTS_FILE);
  products.unshift(newProduct);
  writeData(PRODUCTS_FILE, products);
  res.status(201).json({ success: true, product: newProduct });
});

// 6. Update an existing product
app.put("/api/seller/products/:id", requireSellerAuth, (req, res) => {
  const { id } = req.params;
  const updatedProduct: Product = req.body;
  const products = readData<Product[]>(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  products[index] = { ...products[index], ...updatedProduct };
  writeData(PRODUCTS_FILE, products);
  res.json({ success: true, product: products[index] });
});

// 7. Delete a product from catalog
app.delete("/api/seller/products/:id", requireSellerAuth, (req, res) => {
  const { id } = req.params;
  const products = readData<Product[]>(PRODUCTS_FILE);
  const filtered = products.filter(p => p.id !== id);
  if (products.length === filtered.length) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  writeData(PRODUCTS_FILE, filtered);
  res.json({ success: true, message: "Product deleted successfully" });
});

// 8. Fetch coupons list
app.get("/api/seller/coupons", requireSellerAuth, (req, res) => {
  const coupons = readData<Coupon[]>(COUPONS_FILE);
  res.json(coupons);
});

// 9. Add a new coupon
app.post("/api/seller/coupons", requireSellerAuth, (req, res) => {
  const newCoupon: Coupon = req.body;
  if (!newCoupon || !newCoupon.code) {
    res.status(400).json({ error: "Invalid coupon data" });
    return;
  }
  const coupons = readData<Coupon[]>(COUPONS_FILE);
  coupons.unshift(newCoupon);
  writeData(COUPONS_FILE, coupons);
  res.status(201).json({ success: true, coupon: newCoupon });
});

// 10. Delete a coupon
app.delete("/api/seller/coupons/:code", requireSellerAuth, (req, res) => {
  const { code } = req.params;
  const coupons = readData<Coupon[]>(COUPONS_FILE);
  const filtered = coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
  if (coupons.length === filtered.length) {
    res.status(404).json({ error: "Coupon not found" });
    return;
  }
  writeData(COUPONS_FILE, filtered);
  res.json({ success: true, message: "Coupon deleted successfully" });
});

// 11. Update Hero landing text
app.post("/api/seller/hero", requireSellerAuth, (req, res) => {
  const { title, subtitle } = req.body;
  const hero = { title, subtitle };
  writeData(HERO_FILE, hero);
  res.json({ success: true, hero });
});

// 12. Reset catalog to defaults
app.post("/api/seller/reset-catalog", requireSellerAuth, (req, res) => {
  writeData(PRODUCTS_FILE, INITIAL_PRODUCTS);
  writeData(COUPONS_FILE, DEFAULT_COUPONS);
  writeData(HERO_FILE, DEFAULT_HERO);
  res.json({ success: true, message: "Catalog reset to defaults successfully" });
});

// 13. Delete a customer review/testimonial
app.delete("/api/seller/reviews/:id", requireSellerAuth, (req, res) => {
  const { id } = req.params;
  const reviews = readData<Testimonial[]>(REVIEWS_FILE);
  const filtered = reviews.filter(r => r.id !== id);
  if (reviews.length === filtered.length) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  writeData(REVIEWS_FILE, filtered);
  res.json({ success: true, message: "Review deleted successfully" });
});


// ==========================================================
// --- VITE DEV SERVER & PRODUCTION ROUTING ---
// ==========================================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
