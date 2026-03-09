/**
 * Maps product names to locally generated image paths.
 * All images are bundled with the app — no external network requests needed.
 */

const PRODUCT_IMAGES: Record<string, string> = {
  // Vegetables
  "Carrot Seeds": "/assets/generated/product-carrot.dim_600x400.jpg",
  "Tomato Seeds": "/assets/generated/product-tomato.dim_600x400.jpg",
  "Lettuce Seeds": "/assets/generated/product-lettuce.dim_600x400.jpg",
  "Cucumber Seeds": "/assets/generated/product-cucumber.dim_600x400.jpg",
  "Bell Pepper Seeds": "/assets/generated/product-bellpepper.dim_600x400.jpg",
  "Spinach Seeds": "/assets/generated/product-spinach.dim_600x400.jpg",
  "Broccoli Seeds": "/assets/generated/product-broccoli.dim_600x400.jpg",
  "Zucchini Seeds": "/assets/generated/product-zucchini.dim_600x400.jpg",
  "Kale Seeds": "/assets/generated/product-kale.dim_600x400.jpg",
  "Radish Seeds": "/assets/generated/product-radish.dim_600x400.jpg",

  // Fruits
  "Strawberry Seeds": "/assets/generated/product-strawberry.dim_600x400.jpg",
  "Blueberry Seeds": "/assets/generated/product-blueberry.dim_600x400.jpg",
  "Raspberry Seeds": "/assets/generated/product-raspberry.dim_600x400.jpg",
  "Watermelon Seeds": "/assets/generated/product-watermelon.dim_600x400.jpg",
  "Apple Seeds": "/assets/generated/product-apple.dim_600x400.jpg",
  "Cantaloupe Seeds": "/assets/generated/product-cantaloupe.dim_600x400.jpg",
  "Grape Seeds": "/assets/generated/product-grape.dim_600x400.jpg",
  "Lemon Tree Seeds": "/assets/generated/product-lemon.dim_600x400.jpg",
  "Peach Seeds": "/assets/generated/product-peach.dim_600x400.jpg",
  "Cherry Seeds": "/assets/generated/product-cherry.dim_600x400.jpg",

  // Flowers
  "Rose Seeds": "/assets/generated/product-rose.dim_600x400.jpg",
  "Sunflower Seeds": "/assets/generated/product-sunflower.dim_600x400.jpg",
  "Tulip Seeds": "/assets/generated/product-tulip.dim_600x400.jpg",
  "Daisy Seeds": "/assets/generated/product-daisy.dim_600x400.jpg",
  "Lavender Seeds": "/assets/generated/product-lavender.dim_600x400.jpg",
  "Marigold Seeds": "/assets/generated/product-marigold.dim_600x400.jpg",
  "Zinnia Seeds": "/assets/generated/product-zinnia.dim_600x400.jpg",
  "Petunia Seeds": "/assets/generated/product-petunia.dim_600x400.jpg",
  "Cosmos Seeds": "/assets/generated/product-cosmos.dim_600x400.jpg",
  "Pansy Seeds": "/assets/generated/product-pansy.dim_600x400.jpg",

  // Herbs
  "Basil Seeds": "/assets/generated/product-basil.dim_600x400.jpg",
  "Mint Seeds": "/assets/generated/product-mint.dim_600x400.jpg",
  "Parsley Seeds": "/assets/generated/product-parsley.dim_600x400.jpg",
  "Cilantro Seeds": "/assets/generated/product-cilantro.dim_600x400.jpg",
  "Thyme Seeds": "/assets/generated/product-thyme.dim_600x400.jpg",
  "Rosemary Seeds": "/assets/generated/product-rosemary.dim_600x400.jpg",
  "Dill Seeds": "/assets/generated/product-dill.dim_600x400.jpg",
  "Chives Seeds": "/assets/generated/product-chives.dim_600x400.jpg",
  "Oregano Seeds": "/assets/generated/product-oregano.dim_600x400.jpg",
  "Sage Seeds": "/assets/generated/product-sage.dim_600x400.jpg",

  // Trees
  "Oak Tree Seeds": "/assets/generated/product-oak.dim_600x400.jpg",
  "Pine Tree Seeds": "/assets/generated/product-pine.dim_600x400.jpg",
  "Maple Tree Seeds": "/assets/generated/product-maple.dim_600x400.jpg",
  "Cherry Tree Seeds": "/assets/generated/product-cherrytree.dim_600x400.jpg",
  "Birch Tree Seeds": "/assets/generated/product-birch.dim_600x400.jpg",
  "Willow Tree Seeds": "/assets/generated/product-willow.dim_600x400.jpg",
  "Magnolia Seeds": "/assets/generated/product-magnolia.dim_600x400.jpg",
  "Redwood Seeds": "/assets/generated/product-redwood.dim_600x400.jpg",
  "Dogwood Seeds": "/assets/generated/product-dogwood.dim_600x400.jpg",
  "Ginkgo Seeds": "/assets/generated/product-ginkgo.dim_600x400.jpg",

  // Succulents
  "Aloe Vera Seeds": "/assets/generated/product-aloe.dim_600x400.jpg",
  "Jade Plant Seeds": "/assets/generated/product-jade.dim_600x400.jpg",
  "Echeveria Seeds": "/assets/generated/product-echeveria.dim_600x400.jpg",
  "Cactus Seeds": "/assets/generated/product-cactus.dim_600x400.jpg",
  "Sedum Seeds": "/assets/generated/product-sedum.dim_600x400.jpg",
  "Haworthia Seeds": "/assets/generated/product-haworthia.dim_600x400.jpg",
  "Agave Seeds": "/assets/generated/product-agave.dim_600x400.jpg",
  "Sempervivum Seeds": "/assets/generated/product-sempervivum.dim_600x400.jpg",
  "Lithops Seeds": "/assets/generated/product-lithops.dim_600x400.jpg",
  "Gasteria Seeds": "/assets/generated/product-gasteria.dim_600x400.jpg",
};

// Category fallback images — used when a product name doesn't match
const CATEGORY_FALLBACKS: Record<string, string> = {
  Vegetables: "/assets/generated/product-lettuce.dim_600x400.jpg",
  Fruits: "/assets/generated/product-strawberry.dim_600x400.jpg",
  Flowers: "/assets/generated/product-rose.dim_600x400.jpg",
  Herbs: "/assets/generated/product-basil.dim_600x400.jpg",
  Trees: "/assets/generated/product-oak.dim_600x400.jpg",
  Succulents: "/assets/generated/product-echeveria.dim_600x400.jpg",
};

/**
 * Returns the best image path for a given product name and category.
 * All paths are local — no external network requests.
 */
export function getProductImageUrl(
  productName: string,
  category: string,
): string {
  return (
    PRODUCT_IMAGES[productName] ??
    CATEGORY_FALLBACKS[category] ??
    "/assets/generated/product-basil.dim_600x400.jpg"
  );
}
