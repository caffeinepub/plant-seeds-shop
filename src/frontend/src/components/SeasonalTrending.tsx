import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import type { SeedProduct } from "../backend.d";
import { getProductImageUrl } from "../utils/productImages";

type Season = "Spring" | "Summer" | "Autumn" | "Winter";

function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "Spring";
  if (month >= 6 && month <= 8) return "Summer";
  if (month >= 9 && month <= 11) return "Autumn";
  return "Winter";
}

const CATEGORY_ICONS: Record<string, string> = {
  Vegetables: "🥦",
  Fruits: "🍓",
  Flowers: "🌸",
  Herbs: "🌿",
  Trees: "🌳",
  Succulents: "🪴",
};

const CATEGORY_ORDER = [
  "Vegetables",
  "Fruits",
  "Flowers",
  "Herbs",
  "Trees",
  "Succulents",
];

const SEASONS: {
  id: Season;
  icon: string;
  label: string;
  description: string;
  color: string;
  bg: string;
  headerBg: string;
  seeds: string[];
}[] = [
  {
    id: "Spring",
    icon: "🌸",
    label: "Spring",
    description: "Best seeds to sow as the earth warms and days grow longer",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    headerBg: "bg-emerald-100/60",
    seeds: [
      "Tomato Seeds",
      "Carrot Seeds",
      "Spinach Seeds",
      "Strawberry Seeds",
      "Rose Seeds",
      "Lavender Seeds",
      "Marigold Seeds",
      "Basil Seeds",
      "Mint Seeds",
      "Maple Tree Seeds",
      "Aloe Vera Seeds",
    ],
  },
  {
    id: "Summer",
    icon: "🌞",
    label: "Summer",
    description: "Heat-loving varieties that thrive under the blazing sun",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
    headerBg: "bg-orange-100/60",
    seeds: [
      "Cucumber Seeds",
      "Bell Pepper Seeds",
      "Zucchini Seeds",
      "Watermelon Seeds",
      "Peach Seeds",
      "Sunflower Seeds",
      "Zinnia Seeds",
      "Cosmos Seeds",
      "Mint Seeds",
      "Basil Seeds",
      "Jade Plant Seeds",
    ],
  },
  {
    id: "Autumn",
    icon: "🍂",
    label: "Autumn",
    description:
      "Cool-season crops and late bloomers perfect for autumn planting",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    headerBg: "bg-amber-100/60",
    seeds: [
      "Kale Seeds",
      "Spinach Seeds",
      "Broccoli Seeds",
      "Apple Seeds",
      "Cherry Seeds",
      "Pansy Seeds",
      "Daisy Seeds",
      "Marigold Seeds",
      "Sage Seeds",
      "Thyme Seeds",
      "Oak Tree Seeds",
      "Echeveria Seeds",
    ],
  },
  {
    id: "Winter",
    icon: "❄️",
    label: "Winter",
    description: "Hardy varieties and indoor growers perfect for cold months",
    color: "text-sky-700",
    bg: "bg-sky-50 border-sky-200",
    headerBg: "bg-sky-100/60",
    seeds: [
      "Radish Seeds",
      "Lettuce Seeds",
      "Lemon Tree Seeds",
      "Tulip Seeds",
      "Pansy Seeds",
      "Rosemary Seeds",
      "Thyme Seeds",
      "Pine Tree Seeds",
      "Oak Tree Seeds",
      "Aloe Vera Seeds",
      "Jade Plant Seeds",
    ],
  },
];

const SEASON_TAB_COLORS: Record<Season, string> = {
  Spring:
    "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500",
  Summer:
    "data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:border-b-2 data-[state=active]:border-orange-500",
  Autumn:
    "data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 data-[state=active]:border-b-2 data-[state=active]:border-amber-500",
  Winter:
    "data-[state=active]:bg-sky-100 data-[state=active]:text-sky-800 data-[state=active]:border-b-2 data-[state=active]:border-sky-500",
};

interface SeasonalTrendingProps {
  products: SeedProduct[];
  onAddToCart: (productId: bigint, quantity: number) => void;
  onViewDetails: (product: SeedProduct) => void;
  isLoggedIn: boolean;
}

export default function SeasonalTrending({
  products,
  onAddToCart,
  onViewDetails,
  isLoggedIn,
}: SeasonalTrendingProps) {
  const currentSeason = getCurrentSeason();

  return (
    <section className="py-14 bg-gradient-to-b from-muted/40 to-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🔥</span>
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Trending This Season
            </h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Discover what gardeners are planting right now — by season &amp;
              category
            </p>
          </div>
          <Badge
            variant="outline"
            className="ml-auto text-xs px-3 py-1 border-primary/30 text-primary font-semibold"
          >
            {currentSeason === "Spring" && "🌸"}
            {currentSeason === "Summer" && "🌞"}
            {currentSeason === "Autumn" && "🍂"}
            {currentSeason === "Winter" && "❄️"} Now: {currentSeason}
          </Badge>
        </div>

        <Tabs defaultValue={currentSeason}>
          <TabsList className="h-auto p-1 mb-8 bg-muted/60 gap-1 flex-wrap">
            {SEASONS.map((season) => (
              <TabsTrigger
                key={season.id}
                value={season.id}
                className={`px-5 py-2.5 text-sm font-semibold rounded-md transition-all ${
                  SEASON_TAB_COLORS[season.id]
                }`}
                data-ocid={`seasonal.${season.id.toLowerCase()}.tab`}
              >
                <span className="mr-1.5">{season.icon}</span>
                {season.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {SEASONS.map((season) => {
            // Match products to this season's seed list
            const seasonProducts = season.seeds
              .map((name) =>
                products.find(
                  (p) => p.name.toLowerCase() === name.toLowerCase(),
                ),
              )
              .filter(Boolean) as SeedProduct[];

            // Group by category
            const grouped: Record<string, SeedProduct[]> = {};
            for (const product of seasonProducts) {
              const cat = product.category;
              if (!grouped[cat]) grouped[cat] = [];
              grouped[cat].push(product);
            }

            const orderedCategories = CATEGORY_ORDER.filter(
              (cat) => grouped[cat]?.length,
            );

            // running card index for data-ocid
            let cardIndex = 0;

            return (
              <TabsContent key={season.id} value={season.id}>
                <p className={`text-sm font-medium mb-6 ${season.color}`}>
                  {season.icon} {season.description}
                </p>

                {seasonProducts.length === 0 ? (
                  <div
                    className="text-center py-10 text-muted-foreground"
                    data-ocid="seasonal.empty_state"
                  >
                    Products loading… Check back shortly!
                  </div>
                ) : (
                  <div className="space-y-10">
                    {orderedCategories.map((category) => {
                      const catProducts = grouped[category];
                      const icon = CATEGORY_ICONS[category] ?? "🌱";

                      return (
                        <div key={category}>
                          {/* Category heading */}
                          <div
                            className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border ${
                              season.bg
                            } ${season.headerBg}`}
                          >
                            <span className="text-xl">{icon}</span>
                            <h3
                              className={`font-bold text-base tracking-wide uppercase ${
                                season.color
                              }`}
                            >
                              {category}
                            </h3>
                            <span
                              className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                                season.bg
                              } ${season.color}`}
                            >
                              {catProducts.length} varieties
                            </span>
                          </div>

                          {/* Products grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {catProducts.map((product) => {
                              cardIndex += 1;
                              const idx = cardIndex;
                              return (
                                <SeasonProductCard
                                  key={String(product.id)}
                                  product={product}
                                  season={season.id}
                                  seasonBg={season.bg}
                                  seasonColor={season.color}
                                  index={idx}
                                  onAddToCart={onAddToCart}
                                  onViewDetails={onViewDetails}
                                  isLoggedIn={isLoggedIn}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}

interface SeasonProductCardProps {
  product: SeedProduct;
  season: Season;
  seasonBg: string;
  seasonColor: string;
  index: number;
  onAddToCart: (productId: bigint, quantity: number) => void;
  onViewDetails: (product: SeedProduct) => void;
  isLoggedIn: boolean;
}

function SeasonProductCard({
  product,
  seasonBg,
  seasonColor,
  index,
  onAddToCart,
  onViewDetails,
  isLoggedIn,
}: SeasonProductCardProps) {
  const imgSrc = getProductImageUrl(product.name, product.category);
  const price = Number(product.priceInCents) / 100;
  const inStock = Number(product.stock) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index - 1) * 0.06, duration: 0.35 }}
      className="group relative bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      data-ocid={`seasonal.product.card.${index}`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23e8f5e9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' font-family='serif'%3E%F0%9F%8C%B1%3C/text%3E%3C/svg%3E";
            e.currentTarget.onerror = null;
          }}
        />
        {/* Trending badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white shadow">
            🔥 Trending
          </span>
        </div>
        {/* Category badge */}
        <div className="absolute bottom-2 left-2">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
              seasonBg
            } ${seasonColor}`}
          >
            {CATEGORY_ICONS[product.category] ?? "🌱"} {product.category}
          </span>
        </div>
        {/* Stock badge */}
        {!inStock && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="font-bold text-primary text-base">
            ${price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(product)}
              className="text-xs h-8 gap-1"
              data-ocid={`seasonal.product.details.${index}`}
            >
              <Eye className="h-3 w-3" />
              View Details
            </Button>
            <Button
              size="sm"
              variant={inStock ? "default" : "outline"}
              disabled={!inStock}
              onClick={() => onAddToCart(product.id, 1)}
              className="text-xs h-8 gap-1"
              data-ocid={`seasonal.product.button.${index}`}
            >
              <ShoppingCart className="h-3 w-3" />
              {isLoggedIn ? "Add" : "Login"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
