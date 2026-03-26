import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Apple,
  CheckCircle2,
  ChevronRight,
  Flower2,
  Gem,
  Leaf,
  LogIn,
  LogOut,
  Minus,
  Plus,
  Salad,
  Search,
  Settings,
  ShoppingCart,
  Sprout,
  TreePine,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { CartItem, SeedProduct } from "./backend.d";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import CheckoutModal from "./components/CheckoutModal";
import ProductDetailModal from "./components/ProductDetailModal";
import SeasonalTrending from "./components/SeasonalTrending";
import UserLogin from "./components/UserLogin";
import { useActor } from "./hooks/useActor";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import {
  useAddToCart,
  useAllProducts,
  useCart,
  useClearCart,
  useProductsByCategory,
  useRemoveFromCart,
  useSearchProducts,
  useUpdateCartQuantity,
} from "./hooks/useQueries";
import { getProductImageUrl } from "./utils/productImages";

type AppView = "shop" | "admin-login" | "admin-dashboard" | "user-login";

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "All", label: "All Seeds", icon: Sprout, emoji: "🌱" },
  { id: "Vegetables", label: "Vegetables", icon: Salad, emoji: "🥬" },
  { id: "Fruits", label: "Fruits", icon: Apple, emoji: "🍓" },
  { id: "Flowers", label: "Flowers", icon: Flower2, emoji: "🌸" },
  { id: "Herbs", label: "Herbs", icon: Leaf, emoji: "🌿" },
  { id: "Trees", label: "Trees", icon: TreePine, emoji: "🌳" },
  { id: "Succulents", label: "Succulents", icon: Gem, emoji: "🪴" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Vegetables: "bg-emerald-50 border-emerald-200 text-emerald-800",
  Fruits: "bg-rose-50 border-rose-200 text-rose-800",
  Flowers: "bg-pink-50 border-pink-200 text-pink-800",
  Herbs: "bg-teal-50 border-teal-200 text-teal-800",
  Trees: "bg-green-50 border-green-200 text-green-800",
  Succulents: "bg-lime-50 border-lime-200 text-lime-800",
  All: "bg-amber-50 border-amber-200 text-amber-800",
};

function formatPrice(cents: bigint): string {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({
  cartCount,
  onCartOpen,
  onAdminClick,
  onLoginClick,
  onLogout,
}: {
  cartCount: number;
  onCartOpen: () => void;
  onAdminClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
}) {
  const { userLoggedIn, userName } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sprout
                className="w-4.5 h-4.5 text-primary"
                style={{ width: "18px", height: "18px" }}
              />
            </div>
            <div>
              <span className="font-display font-semibold text-lg text-foreground leading-none block">
                GreenSprout
              </span>
              <span className="text-xs text-muted-foreground font-sans tracking-wide leading-none">
                Seeds & Botanicals
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {["Home", "Shop", "About"].map((item) => (
              <button
                key={item}
                type="button"
                data-ocid={`nav.${item.toLowerCase()}.link`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              data-ocid="nav.admin.link"
              onClick={onAdminClick}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </button>
          </nav>

          {/* Right side: user auth + cart */}
          <div className="flex items-center gap-2">
            {/* Mobile admin */}
            <button
              type="button"
              data-ocid="nav.admin.link"
              onClick={onAdminClick}
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-2"
              aria-label="Admin portal"
            >
              <Settings
                className="w-4.5 h-4.5"
                style={{ width: "18px", height: "18px" }}
              />
            </button>

            {/* User auth area */}
            {userLoggedIn ? (
              <div className="relative">
                <button
                  type="button"
                  data-ocid="header.user_name"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 bg-primary/10 hover:bg-primary/15 transition-colors rounded-full px-3 py-1.5"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate hidden sm:block">
                    Hi, {userName}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      {/* Backdrop for dropdown */}
                      <button
                        type="button"
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setUserMenuOpen(false)}
                        aria-label="Close user menu"
                        tabIndex={-1}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-xl shadow-botanical-lg min-w-[160px] overflow-hidden"
                      >
                        <div className="px-3 py-2.5 border-b border-border">
                          <p className="text-xs text-muted-foreground">
                            Signed in as
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {userName}
                          </p>
                        </div>
                        <button
                          type="button"
                          data-ocid="header.logout_button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/8 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                data-ocid="header.user_login_button"
                onClick={onLoginClick}
                className="rounded-full gap-1.5 h-8 text-xs font-medium border-border hidden sm:flex"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Button>
            )}

            {/* Cart button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartOpen}
              data-ocid="header.cart_button"
              aria-label={`Open cart, ${cartCount} items`}
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] min-h-[18px] px-0.5"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({
  searchQuery,
  onSearch,
}: {
  searchQuery: string;
  onSearch: (q: string) => void;
}) {
  return (
    <section className="relative overflow-hidden min-h-[500px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-seeds-background.dim_1400x800.jpg"
          alt="Plant seeds background"
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-8 right-8 w-40 h-40 rounded-full border border-white/10 opacity-40" />
      <div className="absolute bottom-12 left-12 w-24 h-24 rounded-full border border-white/15 opacity-30" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Leaf className="w-3.5 h-3.5 text-white" />
            <span className="text-white/90 text-xs font-medium tracking-wide uppercase">
              Premium Botanical Seeds
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
            Grow Something
            <br />
            <span className="italic font-light">Beautiful</span>
          </h1>

          <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg font-sans">
            Discover our curated collection of premium seeds — from heirloom
            vegetables to exotic succulents. Every garden starts with a single
            seed.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/50"
              style={{ width: "18px", height: "18px" }}
            />
            <Input
              type="search"
              placeholder="Search for seeds, plants, categories..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              data-ocid="search.search_input"
              className="pl-11 h-12 bg-white/95 backdrop-blur-sm border-white/80 text-foreground placeholder:text-muted-foreground rounded-xl text-sm shadow-botanical focus:ring-2 focus:ring-primary/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Category Tabs ────────────────────────────────────────────────────────────

function CategoryTabs({
  activeCategory,
  onChange,
}: {
  activeCategory: string;
  onChange: (cat: string) => void;
}) {
  return (
    <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 py-3 min-w-max">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onChange(cat.id)}
                  data-ocid={`category.${cat.id.toLowerCase()}.tab`}
                  className={[
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground hover:bg-muted/50",
                  ].join(" ")}
                >
                  <span
                    role="img"
                    aria-label={cat.label}
                    className="text-base leading-none"
                  >
                    {cat.emoji}
                  </span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  index,
  onAddToCart,
  isAddingToCart,
  onViewDetails,
}: {
  product: SeedProduct;
  index: number;
  onAddToCart: (id: bigint) => void;
  isAddingToCart: boolean;
  onViewDetails: (product: SeedProduct) => void;
}) {
  const stockNum = Number(product.stock);
  const isLowStock = stockNum > 0 && stockNum < 10;
  const isOutOfStock = stockNum === 0;
  const colorClass = CATEGORY_COLORS[product.category] ?? CATEGORY_COLORS.All;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.5) }}
      data-ocid={`product.item.${index + 1}`}
      className="card-hover group"
    >
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card flex flex-col h-full">
        {/* Product image — clickable to open details */}
        <button
          type="button"
          className="relative h-44 flex items-center justify-center overflow-hidden cursor-pointer w-full border-0 p-0 bg-muted"
          onClick={() => onViewDetails(product)}
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={getProductImageUrl(product.name, product.category)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="eager"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23e8f5e9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' font-family='serif'%3E%F0%9F%8C%B1%3C/text%3E%3C/svg%3E";
              e.currentTarget.onerror = null;
            }}
          />
          {/* Dark gradient overlay for badges readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
          {/* Category badge */}
          <div
            className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${colorClass}`}
          >
            {product.category}
          </div>
          {/* Stock badge */}
          {isLowStock && (
            <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
              <AlertCircle className="w-3 h-3" />
              Low Stock
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute top-3 right-3 bg-destructive/90 text-destructive-foreground text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
              Out of Stock
            </div>
          )}
          {!isLowStock && !isOutOfStock && (
            <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
              <CheckCircle2 className="w-3 h-3" />
              In Stock
            </div>
          )}
        </button>

        {/* Content */}
        <div className="flex flex-col gap-2 p-4 flex-1">
          <h3 className="font-display font-semibold text-foreground leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
            {product.description}
          </p>
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            data-ocid={`product.detail_button.${index + 1}`}
            className="text-xs text-primary hover:underline font-medium mt-1 self-start"
          >
            View Details →
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex items-center justify-between gap-3">
          <span className="font-display font-bold text-xl text-foreground">
            {formatPrice(product.priceInCents)}
          </span>
          <Button
            size="sm"
            disabled={isOutOfStock || isAddingToCart}
            onClick={() => onAddToCart(product.id)}
            data-ocid={`product.add_button.${index + 1}`}
            className="rounded-full px-4 font-medium text-sm gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
          >
            {isAddingToCart ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Product Grid ─────────────────────────────────────────────────────────────

function ProductGrid({
  products,
  isLoading,
  onAddToCart,
  addingIds,
  onViewDetails,
}: {
  products: SeedProduct[];
  isLoading: boolean;
  onAddToCart: (id: bigint) => void;
  addingIds: Set<string>;
  onViewDetails: (product: SeedProduct) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
            key={i}
            data-ocid="products.loading_state"
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            <Skeleton className="h-36 w-full rounded-none" />
            <div className="p-4 space-y-2.5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
              <div className="flex justify-between items-center pt-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        data-ocid="products.empty_state"
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="text-6xl mb-6">🌾</div>
        <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
          No seeds found
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          Try a different search term or category to discover our full
          collection.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product, index) => (
        <ProductCard
          key={product.id.toString()}
          product={product}
          index={index}
          onAddToCart={onAddToCart}
          isAddingToCart={addingIds.has(product.id.toString())}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  products,
  onLoginRequired,
  onCheckoutOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: SeedProduct[];
  onLoginRequired: () => void;
  onCheckoutOpen: () => void;
}) {
  const updateQty = useUpdateCartQuantity();
  const removeItem = useRemoveFromCart();
  const clearCart = useClearCart();
  const { userLoggedIn } = useAuth();

  const getProduct = (productId: bigint) =>
    products.find((p) => p.id === productId);

  const subtotal = cartItems.reduce((sum, item) => {
    const product = getProduct(item.productId);
    if (!product) return sum;
    return sum + Number(product.priceInCents) * Number(item.quantity);
  }, 0);

  const handleCheckout = () => {
    if (!userLoggedIn) {
      onClose();
      onLoginRequired();
      toast.info("Please login to complete your purchase.", {
        duration: 3000,
      });
      return;
    }
    onCheckoutOpen();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            data-ocid="cart.panel"
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card shadow-botanical-lg flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-foreground leading-none">
                    Your Cart
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
                aria-label="Close cart"
              >
                <X
                  className="w-4.5 h-4.5"
                  style={{ width: "18px", height: "18px" }}
                />
              </Button>
            </div>

            {/* Content */}
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                data-ocid="cart.empty_state"
                className="flex-1 flex flex-col items-center justify-center text-center px-8"
              >
                <div className="text-6xl mb-5">🛒</div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Your cart is empty
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Add some seeds to get started on your garden journey.
                </p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="rounded-full gap-2"
                >
                  <Sprout className="w-4 h-4" />
                  Browse Seeds
                </Button>
              </motion.div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto px-6">
                <div className="py-4 space-y-4">
                  {cartItems.map((item, idx) => {
                    const product = getProduct(item.productId);
                    if (!product) return null;
                    const lineTotal =
                      Number(product.priceInCents) * Number(item.quantity);
                    return (
                      <motion.div
                        key={item.productId.toString()}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        data-ocid={`cart.item.${idx + 1}`}
                        className="bg-background rounded-xl p-3.5 flex gap-3 items-start border border-border/60"
                      >
                        {/* Product thumbnail */}
                        <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={getProductImageUrl(
                              product.name,
                              product.category,
                            )}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23e8f5e9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' font-family='serif'%3E%F0%9F%8C%B1%3C/text%3E%3C/svg%3E";
                              e.currentTarget.onerror = null;
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatPrice(product.priceInCents)} each
                          </p>
                          {/* Qty controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newQty = Number(item.quantity) - 1;
                                if (newQty <= 0) {
                                  removeItem.mutate(item.productId);
                                } else {
                                  updateQty.mutate({
                                    productId: item.productId,
                                    quantity: BigInt(newQty),
                                  });
                                }
                              }}
                              className="w-6 h-6 rounded-full border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-semibold w-5 text-center tabular-nums">
                              {item.quantity.toString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                updateQty.mutate({
                                  productId: item.productId,
                                  quantity: item.quantity + 1n,
                                });
                              }}
                              className="w-6 h-6 rounded-full border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="flex flex-col items-end gap-2">
                          <button
                            type="button"
                            onClick={() => removeItem.mutate(item.productId)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <span className="font-display font-semibold text-sm text-foreground">
                            {formatPrice(BigInt(lineTotal))}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-border px-6 py-5 space-y-4">
                {/* Login prompt if not logged in */}
                {!userLoggedIn && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5"
                    data-ocid="cart.login.error_state"
                  >
                    <User className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      Please login to checkout
                    </p>
                  </motion.div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Subtotal
                  </span>
                  <span className="font-display font-bold text-xl text-foreground">
                    {formatPrice(BigInt(subtotal))}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping & taxes calculated at checkout
                </p>
                <Button
                  className="w-full rounded-xl h-12 text-base font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleCheckout}
                  disabled={clearCart.isPending}
                  data-ocid="cart.checkout_button"
                >
                  {!userLoggedIn ? (
                    <>
                      <LogIn className="w-4.5 h-4.5" />
                      Login to Checkout
                    </>
                  ) : (
                    <>
                      Checkout
                      <ChevronRight
                        className="w-4.5 h-4.5"
                        style={{ width: "18px", height: "18px" }}
                      />
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 text-sm"
                  onClick={() => clearCart.mutate()}
                  data-ocid="cart.clear_cart_button"
                  disabled={clearCart.isPending}
                >
                  {clearCart.isPending ? "Clearing..." : "Clear Cart"}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Features Strip ───────────────────────────────────────────────────────────

function FeaturesStrip() {
  const features = [
    {
      icon: "🌿",
      title: "Heirloom Varieties",
      desc: "Non-GMO, heritage seeds",
    },
    { icon: "📦", title: "Fast Shipping", desc: "Ships within 24–48 hours" },
    { icon: "♻️", title: "Eco Packaging", desc: "100% compostable materials" },
    { icon: "🌍", title: "Global Seeds", desc: "Sourced from 40+ countries" },
  ];

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label={f.title}>
                {f.icon}
              </span>
              <div>
                <p className="font-medium text-sm text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-foreground">
              GreenSprout Seeds
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {year}. Built by bharanjb
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <button
              type="button"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </button>
            <button
              type="button"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </button>
            <button
              type="button"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App (inner) ─────────────────────────────────────────────────────────────

function AppInner() {
  const { actor } = useActor();
  const { userLoggedIn, logoutUser, logoutAdmin, userName } = useAuth();
  const queryClient = useQueryClient();
  const [appView, setAppView] = useState<AppView>("shop");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [addingIds, setAddingIds] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<SeedProduct | null>(
    null,
  );
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery]);

  const isSearchActive = debouncedSearch.trim().length > 0;

  // Product queries — always enabled when actor is ready
  useProductsByCategory(activeCategory); // keep cache warm
  const { data: searchResults = [], isLoading: searchLoading } =
    useSearchProducts(debouncedSearch);
  const { data: cartItems = [] } = useCart();
  const { data: allProducts = [], isLoading: allProductsLoading } =
    useAllProducts();

  // Seed backend if products come back empty
  useEffect(() => {
    // Safety: mark initialized after 5s even if actor never connects
    const timeout = setTimeout(() => setInitialized(true), 3000);
    if (!actor) return () => clearTimeout(timeout);
    actor
      .initialize()
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeout);
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.refetchQueries({ queryKey: ["products"] });
        setInitialized(true);
      });
    return () => clearTimeout(timeout);
  }, [actor, queryClient]);

  const addToCart = useAddToCart();
  const clearCart = useClearCart();

  // Use allProducts as the reliable source; filter by activeCategory when needed
  const filteredByCategory =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);
  const displayedProducts = isSearchActive ? searchResults : filteredByCategory;
  const isLoading = isSearchActive
    ? searchLoading
    : allProductsLoading || (!initialized && allProducts.length === 0);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  const handleViewDetails = useCallback((product: SeedProduct) => {
    setSelectedProduct(product);
  }, []);

  const handleAddToCart = useCallback(
    async (productId: bigint, quantity = 1) => {
      // Gate: require user login to add to cart
      if (!userLoggedIn) {
        toast.info("Please login to add items to your cart.", {
          duration: 3000,
          description: "Create a free account to start shopping 🌱",
        });
        setAppView("user-login");
        return;
      }

      const idStr = productId.toString();
      setAddingIds((prev) => new Set([...prev, idStr]));
      try {
        await addToCart.mutateAsync({ productId, quantity: BigInt(quantity) });
        toast.success("Added to cart!", {
          description: "Item added successfully 🌱",
          duration: 2000,
        });
      } catch {
        toast.error("Failed to add item");
      } finally {
        setAddingIds((prev) => {
          const next = new Set(prev);
          next.delete(idStr);
          return next;
        });
      }
    },
    [addToCart, userLoggedIn],
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSearchQuery("");
    setDebouncedSearch("");
  };

  const handleAdminClick = () => {
    // Always show login page — never auto-skip to dashboard
    setAppView("admin-login");
  };

  // ── View routing ─────────────────────────────────────────────────────────

  if (appView === "admin-login") {
    return (
      <>
        <Toaster position="top-right" richColors />
        <AdminLogin
          onAdminVerified={() => setAppView("admin-dashboard")}
          onBack={() => setAppView("shop")}
        />
      </>
    );
  }

  if (appView === "admin-dashboard") {
    return (
      <>
        <Toaster position="top-right" richColors />
        <AdminDashboard
          onLogout={() => {
            logoutAdmin();
            setAppView("admin-login");
          }}
          onBack={() => setAppView("shop")}
        />
      </>
    );
  }

  if (appView === "user-login") {
    return (
      <>
        <Toaster position="top-right" richColors />
        <UserLogin
          onLoginSuccess={() => setAppView("shop")}
          onBack={() => setAppView("shop")}
        />
      </>
    );
  }

  // ── Shop view ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />

      <Header
        cartCount={cartCount}
        onCartOpen={() => setIsCartOpen(true)}
        onAdminClick={handleAdminClick}
        onLoginClick={() => setAppView("user-login")}
        onLogout={logoutUser}
      />

      <Hero searchQuery={searchQuery} onSearch={setSearchQuery} />

      <FeaturesStrip />

      <SeasonalTrending
        products={allProducts}
        onAddToCart={handleAddToCart}
        isLoggedIn={userLoggedIn}
        onViewDetails={handleViewDetails}
      />

      <CategoryTabs
        activeCategory={activeCategory}
        onChange={handleCategoryChange}
      />

      {/* Main product area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              {isSearchActive
                ? `Results for "${debouncedSearch}"`
                : activeCategory === "All"
                  ? "All Seeds"
                  : `${activeCategory} Seeds`}
            </h2>
            {!isLoading && (
              <p className="text-sm text-muted-foreground mt-1">
                {displayedProducts.length}{" "}
                {displayedProducts.length === 1 ? "variety" : "varieties"}{" "}
                available
              </p>
            )}
          </div>
          {isSearchActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setDebouncedSearch("");
              }}
              className="text-muted-foreground hover:text-foreground gap-1.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
              Clear search
            </Button>
          )}
        </div>

        {/* Category section cards — only on "All" without search */}
        {!isSearchActive && activeCategory === "All" ? (
          <div className="space-y-12">
            {CATEGORIES.filter((c) => c.id !== "All").map((cat) => {
              const catProducts = displayedProducts.filter(
                (p) => p.category === cat.id,
              );
              if (catProducts.length === 0) return null;
              return (
                <section key={cat.id} aria-labelledby={`section-${cat.id}`}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="text-2xl"
                        role="img"
                        aria-label={cat.label}
                      >
                        {cat.emoji}
                      </span>
                      <h3
                        id={`section-${cat.id}`}
                        className="font-display text-xl font-bold text-foreground"
                      >
                        {cat.label}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="rounded-full text-xs"
                      >
                        {catProducts.length}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveCategory(cat.id)}
                      data-ocid={`category.${cat.id.toLowerCase()}.tab`}
                      className="text-primary hover:text-primary/80 gap-1 text-sm rounded-full"
                    >
                      See all
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <ProductGrid
                    products={catProducts.slice(0, 4)}
                    isLoading={false}
                    onAddToCart={handleAddToCart}
                    addingIds={addingIds}
                    onViewDetails={handleViewDetails}
                  />
                </section>
              );
            })}
            {/* Show loading when no products yet */}
            {isLoading && (
              <ProductGrid
                products={[]}
                isLoading={true}
                onAddToCart={handleAddToCart}
                addingIds={addingIds}
                onViewDetails={handleViewDetails}
              />
            )}
          </div>
        ) : (
          <ProductGrid
            products={displayedProducts}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
            addingIds={addingIds}
            onViewDetails={handleViewDetails}
          />
        )}
      </main>

      {/* Newsletter strip */}
      <section className="bg-primary/5 border-y border-primary/15 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <div className="max-w-xl mx-auto">
            <p className="text-3xl mb-2">🌻</p>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Grow with Us
            </h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Get seasonal planting guides, exclusive seed drops, and expert
              gardening tips delivered to your inbox.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                className="rounded-full flex-1 h-10"
              />
              <Button className="rounded-full px-5 bg-primary text-primary-foreground">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        products={allProducts}
        onLoginRequired={() => setAppView("user-login")}
        onCheckoutOpen={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        products={allProducts}
        userName={userName}
        onOrderPlaced={() => {
          clearCart.mutate();
          toast.success("Order placed! Thank you.", {
            description: "Your seeds are on their way 🌱",
            duration: 4000,
          });
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(productId, qty) => {
          handleAddToCart(productId, qty);
          setSelectedProduct(null);
        }}
        isAddingToCart={
          selectedProduct ? addingIds.has(selectedProduct.id.toString()) : false
        }
      />
    </div>
  );
}

// ─── App (root with providers) ────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
