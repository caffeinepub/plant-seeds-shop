import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  CheckCircle2,
  Droplets,
  Minus,
  Plus,
  Sun,
  Thermometer,
  Timer,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { SeedProduct } from "../backend.d";
import { getProductImageUrl } from "../utils/productImages";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORY_EMOJIS: Record<string, string> = {
  Vegetables: "🥬",
  Fruits: "🍓",
  Flowers: "🌸",
  Herbs: "🌿",
  Trees: "🌳",
  Succulents: "🪴",
};

const CATEGORY_COLORS: Record<string, string> = {
  Vegetables: "bg-emerald-50 border-emerald-200 text-emerald-800",
  Fruits: "bg-rose-50 border-rose-200 text-rose-800",
  Flowers: "bg-pink-50 border-pink-200 text-pink-800",
  Herbs: "bg-teal-50 border-teal-200 text-teal-800",
  Trees: "bg-green-50 border-green-200 text-green-800",
  Succulents: "bg-lime-50 border-lime-200 text-lime-800",
};

interface PlantingInfo {
  season: string;
  sun: string;
  water: string;
  germination: string;
}

const PLANTING_INFO: Record<string, PlantingInfo> = {
  Vegetables: {
    season: "Spring / Fall",
    sun: "Full Sun",
    water: "Regular",
    germination: "7–14 days",
  },
  Fruits: {
    season: "Spring",
    sun: "Full Sun",
    water: "Moderate",
    germination: "14–21 days",
  },
  Flowers: {
    season: "Spring / Summer",
    sun: "Full / Part Sun",
    water: "Moderate",
    germination: "10–14 days",
  },
  Herbs: {
    season: "Spring / Summer",
    sun: "Full Sun",
    water: "Low–Moderate",
    germination: "7–14 days",
  },
  Trees: {
    season: "Fall / Spring",
    sun: "Full Sun",
    water: "Low",
    germination: "14–30 days",
  },
  Succulents: {
    season: "Any",
    sun: "Full Sun / Bright Indirect",
    water: "Very Low",
    germination: "14–21 days",
  },
};

const CARE_TIPS: Record<string, string[]> = {
  Vegetables: [
    "Sow seeds ¼ inch deep in well-draining soil",
    "Water consistently to keep soil moist",
    "Harvest regularly to encourage more growth",
  ],
  Fruits: [
    "Plant in full sun with good air circulation",
    "Provide consistent moisture during fruiting",
    "Thin seedlings to 12 inches apart",
  ],
  Flowers: [
    "Deadhead spent blooms to prolong flowering",
    "Start indoors 6–8 weeks before last frost",
    "Space plants for good airflow",
  ],
  Herbs: [
    "Pinch off flowers to keep leaves productive",
    "Harvest in the morning for best flavor",
    "Avoid overwatering — most herbs prefer dry conditions",
  ],
  Trees: [
    "Plant in a large container or prepare deep bed",
    "Water deeply but infrequently once established",
    "Mulch around the base to retain moisture",
  ],
  Succulents: [
    "Use well-draining cactus mix",
    "Water thoroughly then allow to dry completely",
    "Provide 6+ hours of bright light daily",
  ],
};

function formatPrice(cents: bigint): string {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductDetailModalProps {
  product: SeedProduct | null;
  onClose: () => void;
  onAddToCart: (productId: bigint, quantity: number) => void;
  isAddingToCart: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  isAddingToCart,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  // Reset quantity whenever a new product is selected
  useEffect(() => {
    if (product) setQuantity(1);
  }, [product]);

  // Close on ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (product) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  const isOpen = product !== null;
  const info = product
    ? (PLANTING_INFO[product.category] ?? PLANTING_INFO.Vegetables)
    : null;
  const tips = product
    ? (CARE_TIPS[product.category] ?? CARE_TIPS.Vegetables)
    : [];
  const _emoji = product ? (CATEGORY_EMOJIS[product.category] ?? "🌱") : "🌱";
  const colorClass = product
    ? (CATEGORY_COLORS[product.category] ??
      "bg-amber-50 border-amber-200 text-amber-800")
    : "";

  const stockNum = product ? Number(product.stock) : 0;
  const isLowStock = stockNum > 0 && stockNum < 10;
  const isOutOfStock = stockNum === 0;

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="product-detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="product-detail-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            data-ocid="product_detail.panel"
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-card shadow-botanical-lg flex flex-col overflow-hidden"
          >
            {/* Close button */}
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                data-ocid="product_detail.close_button"
                className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background border border-border/40 shadow-sm"
                aria-label="Close product details"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 overflow-y-auto">
              {/* Hero area with product image */}
              <motion.div
                className="relative h-64 overflow-hidden flex-shrink-0 bg-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={getProductImageUrl(product.name, product.category)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23e8f5e9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' font-family='serif'%3E%F0%9F%8C%B1%3C/text%3E%3C/svg%3E";
                    e.currentTarget.onerror = null;
                  }}
                />
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                {/* Category chip over image */}
                <div
                  className={`absolute bottom-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-sm ${colorClass}`}
                >
                  {product.category}
                </div>
              </motion.div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Category + stock badges */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-2 flex-wrap"
                >
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${colorClass}`}
                  >
                    {product.category}
                  </span>
                  {isOutOfStock ? (
                    <Badge
                      variant="destructive"
                      className="rounded-full text-xs gap-1"
                    >
                      <X className="w-3 h-3" />
                      Out of Stock
                    </Badge>
                  ) : isLowStock ? (
                    <Badge className="rounded-full text-xs gap-1 bg-amber-500 hover:bg-amber-500 text-white">
                      <AlertCircle className="w-3 h-3" />
                      Low Stock ({stockNum} left)
                    </Badge>
                  ) : (
                    <Badge className="rounded-full text-xs gap-1 bg-primary hover:bg-primary text-primary-foreground">
                      <CheckCircle2 className="w-3 h-3" />
                      In Stock
                    </Badge>
                  )}
                </motion.div>

                {/* Name + Price */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="font-display text-3xl font-bold text-foreground leading-tight mb-2">
                    {product.name}
                  </h2>
                  <p className="font-display text-2xl font-bold text-primary">
                    {formatPrice(product.priceInCents)}
                  </p>
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-muted-foreground leading-relaxed text-sm"
                >
                  {product.description}
                </motion.p>

                {/* Planting Info */}
                {info && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <h3 className="font-display font-semibold text-foreground text-base">
                      Planting Info
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Thermometer className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                            Season
                          </p>
                          <p className="text-sm font-semibold text-foreground leading-snug">
                            {info.season}
                          </p>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <Sun className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                            Sunlight
                          </p>
                          <p className="text-sm font-semibold text-foreground leading-snug">
                            {info.sun}
                          </p>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                          <Droplets className="w-4 h-4 text-sky-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                            Water
                          </p>
                          <p className="text-sm font-semibold text-foreground leading-snug">
                            {info.water}
                          </p>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                          <Timer className="w-4 h-4 text-violet-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                            Germination
                          </p>
                          <p className="text-sm font-semibold text-foreground leading-snug">
                            {info.germination}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Care Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-3"
                >
                  <h3 className="font-display font-semibold text-foreground text-base">
                    Care Tips
                  </h3>
                  <ul className="space-y-2.5">
                    {tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2.5">
                        <span className="text-base leading-none mt-0.5 flex-shrink-0">
                          🌱
                        </span>
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Spacer for sticky footer */}
                <div className="h-4" />
              </div>
            </ScrollArea>

            {/* Sticky footer: quantity + add to cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border-t border-border px-6 py-5 bg-card flex-shrink-0 space-y-4"
            >
              {/* Quantity stepper */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Quantity
                </span>
                <div className="flex items-center gap-3 bg-muted/50 rounded-full px-1.5 py-1">
                  <button
                    type="button"
                    data-ocid="product_detail.quantity_minus_button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold w-6 text-center tabular-nums text-foreground">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    data-ocid="product_detail.quantity_plus_button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="w-8 h-8 rounded-full border border-border bg-background hover:bg-muted flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CTA */}
              <Button
                className="w-full rounded-xl h-12 text-base font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isOutOfStock || isAddingToCart}
                onClick={() => onAddToCart(product.id, quantity)}
                data-ocid="product_detail.add_to_cart_button"
              >
                {isAddingToCart ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Adding to Cart...
                  </>
                ) : isOutOfStock ? (
                  "Out of Stock"
                ) : (
                  <>
                    <Plus
                      className="w-4.5 h-4.5"
                      style={{ width: "18px", height: "18px" }}
                    />
                    Add {quantity > 1 ? `${quantity} ` : ""}to Cart ·{" "}
                    {formatPrice(
                      BigInt(Number(product.priceInCents) * quantity),
                    )}
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
