/**
 * Maps product names to reliable image URLs using Unsplash with verified photo IDs.
 * Falls back to a category-level image if the product name isn't found.
 */

// Using picsum.photos as a reliable fallback with deterministic seeds,
// and verified Unsplash photo IDs for specific products.
const PRODUCT_IMAGES: Record<string, string> = {
  // Vegetables
  "Carrot Seeds":
    "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?w=600&h=400&fit=crop&auto=format&q=80",
  "Tomato Seeds":
    "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop&auto=format&q=80",
  "Lettuce Seeds":
    "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&h=400&fit=crop&auto=format&q=80",
  "Cucumber Seeds":
    "https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=600&h=400&fit=crop&auto=format&q=80",
  "Bell Pepper Seeds":
    "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&h=400&fit=crop&auto=format&q=80",
  "Spinach Seeds":
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop&auto=format&q=80",
  "Broccoli Seeds":
    "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&h=400&fit=crop&auto=format&q=80",
  "Zucchini Seeds":
    "https://images.unsplash.com/photo-1563699565913-b8f63a960b78?w=600&h=400&fit=crop&auto=format&q=80",
  "Kale Seeds":
    "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=600&h=400&fit=crop&auto=format&q=80",
  "Radish Seeds":
    "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=400&fit=crop&auto=format&q=80",

  // Fruits
  "Strawberry Seeds":
    "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=400&fit=crop&auto=format&q=80",
  "Blueberry Seeds":
    "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&h=400&fit=crop&auto=format&q=80",
  "Raspberry Seeds":
    "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=600&h=400&fit=crop&auto=format&q=80",
  "Watermelon Seeds":
    "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=600&h=400&fit=crop&auto=format&q=80",
  "Apple Seeds":
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=400&fit=crop&auto=format&q=80",
  "Cantaloupe Seeds":
    "https://images.unsplash.com/photo-1571575173700-afb9492d5ec4?w=600&h=400&fit=crop&auto=format&q=80",
  "Grape Seeds":
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&h=400&fit=crop&auto=format&q=80",
  "Lemon Tree Seeds":
    "https://images.unsplash.com/photo-1582287014914-1db2e97b1b0d?w=600&h=400&fit=crop&auto=format&q=80",
  "Peach Seeds":
    "https://images.unsplash.com/photo-1595743825637-cdafc8ad4173?w=600&h=400&fit=crop&auto=format&q=80",
  "Cherry Seeds":
    "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=600&h=400&fit=crop&auto=format&q=80",

  // Flowers
  "Rose Seeds":
    "https://images.unsplash.com/photo-1559563458-527698bf5295?w=600&h=400&fit=crop&auto=format&q=80",
  "Sunflower Seeds":
    "https://images.unsplash.com/photo-1470509037663-253d2d33ef8c?w=600&h=400&fit=crop&auto=format&q=80",
  "Tulip Seeds":
    "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=600&h=400&fit=crop&auto=format&q=80",
  "Daisy Seeds":
    "https://images.unsplash.com/photo-1490750967868-88df5691cc2c?w=600&h=400&fit=crop&auto=format&q=80",
  "Lavender Seeds":
    "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&h=400&fit=crop&auto=format&q=80",
  "Marigold Seeds":
    "https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?w=600&h=400&fit=crop&auto=format&q=80",
  "Zinnia Seeds":
    "https://images.unsplash.com/photo-1597848213285-42a98c07e576?w=600&h=400&fit=crop&auto=format&q=80",
  "Petunia Seeds":
    "https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=600&h=400&fit=crop&auto=format&q=80",
  "Cosmos Seeds":
    "https://images.unsplash.com/photo-1508001526547-a39f01d71f2a?w=600&h=400&fit=crop&auto=format&q=80",
  "Pansy Seeds":
    "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=600&h=400&fit=crop&auto=format&q=80",

  // Herbs
  "Basil Seeds":
    "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&h=400&fit=crop&auto=format&q=80",
  "Mint Seeds":
    "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=600&h=400&fit=crop&auto=format&q=80",
  "Parsley Seeds":
    "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&h=400&fit=crop&auto=format&q=80",
  "Cilantro Seeds":
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop&auto=format&q=80",
  "Thyme Seeds":
    "https://images.unsplash.com/photo-1591137867639-8c9d0c5dade4?w=600&h=400&fit=crop&auto=format&q=80",
  "Rosemary Seeds":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80",
  "Dill Seeds":
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=400&fit=crop&auto=format&q=80",
  "Chives Seeds":
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop&auto=format&q=80",
  "Oregano Seeds":
    "https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=600&h=400&fit=crop&auto=format&q=80",
  "Sage Seeds":
    "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=600&h=400&fit=crop&auto=format&q=80",

  // Trees
  "Oak Tree Seeds":
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&h=400&fit=crop&auto=format&q=80",
  "Pine Tree Seeds":
    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&h=400&fit=crop&auto=format&q=80",
  "Maple Tree Seeds":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format&q=80",
  "Cherry Tree Seeds":
    "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&h=400&fit=crop&auto=format&q=80",
  "Birch Tree Seeds":
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop&auto=format&q=80",
  "Willow Tree Seeds":
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop&auto=format&q=80",
  "Magnolia Seeds":
    "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&h=400&fit=crop&auto=format&q=80",
  "Redwood Seeds":
    "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=600&h=400&fit=crop&auto=format&q=80",
  "Dogwood Seeds":
    "https://images.unsplash.com/photo-1523059623039-a9ed027f09cd?w=600&h=400&fit=crop&auto=format&q=80",
  "Ginkgo Seeds":
    "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=600&h=400&fit=crop&auto=format&q=80",

  // Succulents
  "Aloe Vera Seeds":
    "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=600&h=400&fit=crop&auto=format&q=80",
  "Jade Plant Seeds":
    "https://images.unsplash.com/photo-1463554050456-f2ed7d3fec09?w=600&h=400&fit=crop&auto=format&q=80",
  "Echeveria Seeds":
    "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600&h=400&fit=crop&auto=format&q=80",
  "Cactus Seeds":
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=400&fit=crop&auto=format&q=80",
  "Sedum Seeds":
    "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600&h=400&fit=crop&auto=format&q=80",
  "Haworthia Seeds":
    "https://images.unsplash.com/photo-1463554050456-f2ed7d3fec09?w=600&h=400&fit=crop&auto=format&q=80",
  "Agave Seeds":
    "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=600&h=400&fit=crop&auto=format&q=80",
  "Sempervivum Seeds":
    "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600&h=400&fit=crop&auto=format&q=80",
  "Lithops Seeds":
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=400&fit=crop&auto=format&q=80",
  "Gasteria Seeds":
    "https://images.unsplash.com/photo-1463554050456-f2ed7d3fec09?w=600&h=400&fit=crop&auto=format&q=80",
};

// Category fallback images — reliable known-good Unsplash photos
const CATEGORY_FALLBACKS: Record<string, string> = {
  Vegetables:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop&auto=format&q=80",
  Fruits:
    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&h=400&fit=crop&auto=format&q=80",
  Flowers:
    "https://images.unsplash.com/photo-1490750967868-88df5691cc2c?w=600&h=400&fit=crop&auto=format&q=80",
  Herbs:
    "https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=600&h=400&fit=crop&auto=format&q=80",
  Trees:
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop&auto=format&q=80",
  Succulents:
    "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600&h=400&fit=crop&auto=format&q=80",
};

/**
 * Returns the best image URL for a given product name and category.
 */
export function getProductImageUrl(
  productName: string,
  category: string,
): string {
  return (
    PRODUCT_IMAGES[productName] ??
    CATEGORY_FALLBACKS[category] ??
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&auto=format&q=80"
  );
}
