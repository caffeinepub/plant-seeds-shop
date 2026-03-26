import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let products = List.empty<SeedProduct>();
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let orders = Map.empty<Nat, Order>();
  let paymentTransactions = Map.empty<Nat, PaymentTransaction>();
  let invoices = Map.empty<Nat, Invoice>();
  let paymentOptions = Map.empty<Text, PaymentOption>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextOrderId = 1;
  var nextTransactionId = 1;
  var nextInvoiceId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UserProfile = {
    name : Text;
  };

  public type SeedProduct = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    priceInCents : Nat;
    stock : Nat;
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  public type OrderItem = {
    productId : Nat;
    quantity : Nat;
    priceInCents : Nat;
  };

  public type Order = {
    id : Nat;
    customerPrincipal : Principal;
    items : [OrderItem];
    totalInCents : Nat;
    status : Text;
    paymentMethod : Text;
    paymentStatus : Text;
    createdAt : Int;
  };

  public type PaymentTransaction = {
    id : Nat;
    orderId : Nat;
    amount : Nat;
    method : Text;
    status : Text;
    timestamp : Int;
  };

  public type Invoice = {
    id : Nat;
    invoiceNumber : Text;
    orderId : Nat;
    issuedAt : Int;
  };

  public type PaymentOption = {
    method : Text;
    enabled : Bool;
  };

  public type SalesStats = {
    totalRevenue : Nat;
    totalOrders : Nat;
    totalItemsSold : Nat;
  };

  // User Profile Functions (public for all)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // Initialization Functions
  public shared ({ caller }) func initialize() : async () {
    initializeProducts();
    initializePaymentOptions();
  };

  func initializeProducts() {
    if (products.isEmpty()) {
      let initialProducts = List.empty<SeedProduct>();

      // Vegetables
      initialProducts.add({
        id = 1;
        name = "Carrot Seeds";
        category = "Vegetables";
        description = "Heirloom carrot seeds for crispy, sweet carrots. Great for raised beds.";
        priceInCents = 299;
        stock = 100;
      });
      initialProducts.add({
        id = 2;
        name = "Tomato Seeds";
        category = "Vegetables";
        description = "Classic red tomato seeds for juicy, vine-ripened tomatoes.";
        priceInCents = 349;
        stock = 150;
      });
      initialProducts.add({
        id = 3;
        name = "Lettuce Seeds";
        category = "Vegetables";
        description = "Crisp butterhead lettuce seeds for fresh garden salads.";
        priceInCents = 249;
        stock = 200;
      });
      initialProducts.add({
        id = 4;
        name = "Cucumber Seeds";
        category = "Vegetables";
        description = "Refreshing slicing cucumber seeds, perfect for summer gardens.";
        priceInCents = 279;
        stock = 120;
      });
      initialProducts.add({
        id = 5;
        name = "Bell Pepper Seeds";
        category = "Vegetables";
        description = "Colorful sweet bell pepper seeds in red, yellow, and green.";
        priceInCents = 399;
        stock = 80;
      });
      initialProducts.add({
        id = 31;
        name = "Spinach Seeds";
        category = "Vegetables";
        description = "Fast-growing spinach seeds rich in iron and vitamins.";
        priceInCents = 229;
        stock = 180;
      });
      initialProducts.add({
        id = 32;
        name = "Broccoli Seeds";
        category = "Vegetables";
        description = "Nutritious broccoli seeds that thrive in cool weather.";
        priceInCents = 319;
        stock = 130;
      });
      initialProducts.add({
        id = 33;
        name = "Zucchini Seeds";
        category = "Vegetables";
        description = "Prolific zucchini seeds, one plant feeds the whole family.";
        priceInCents = 289;
        stock = 110;
      });
      initialProducts.add({
        id = 34;
        name = "Kale Seeds";
        category = "Vegetables";
        description = "Hardy superfood kale seeds, frost tolerant and nutrient dense.";
        priceInCents = 269;
        stock = 160;
      });
      initialProducts.add({
        id = 35;
        name = "Radish Seeds";
        category = "Vegetables";
        description = "Quick-maturing radish seeds ready to harvest in just 25 days.";
        priceInCents = 199;
        stock = 220;
      });

      // Fruits
      initialProducts.add({
        id = 6;
        name = "Strawberry Seeds";
        category = "Fruits";
        description = "Sweet strawberry seeds for delicious, sun-ripened berries.";
        priceInCents = 449;
        stock = 90;
      });
      initialProducts.add({
        id = 7;
        name = "Blueberry Seeds";
        category = "Fruits";
        description = "Antioxidant-rich blueberry seeds for fresh or baked dishes.";
        priceInCents = 499;
        stock = 70;
      });
      initialProducts.add({
        id = 8;
        name = "Raspberry Seeds";
        category = "Fruits";
        description = "Tart raspberry seeds that produce abundant summer fruit.";
        priceInCents = 479;
        stock = 75;
      });
      initialProducts.add({
        id = 9;
        name = "Watermelon Seeds";
        category = "Fruits";
        description = "Juicy heirloom watermelon seeds for warm-season gardens.";
        priceInCents = 329;
        stock = 110;
      });
      initialProducts.add({
        id = 10;
        name = "Apple Seeds";
        category = "Fruits";
        description = "Classic honeycrisp apple tree seeds for home orchards.";
        priceInCents = 599;
        stock = 50;
      });
      initialProducts.add({
        id = 36;
        name = "Cantaloupe Seeds";
        category = "Fruits";
        description = "Fragrant cantaloupe seeds for sweet summer melons.";
        priceInCents = 349;
        stock = 95;
      });
      initialProducts.add({
        id = 37;
        name = "Grape Seeds";
        category = "Fruits";
        description = "Table grape seeds perfect for trellises and arbors.";
        priceInCents = 529;
        stock = 65;
      });
      initialProducts.add({
        id = 38;
        name = "Lemon Tree Seeds";
        category = "Fruits";
        description = "Meyer lemon seeds for zesty, thin-skinned lemons.";
        priceInCents = 649;
        stock = 45;
      });
      initialProducts.add({
        id = 39;
        name = "Peach Seeds";
        category = "Fruits";
        description = "Sweet peach tree seeds for warm, sunny climates.";
        priceInCents = 579;
        stock = 55;
      });
      initialProducts.add({
        id = 40;
        name = "Cherry Seeds";
        category = "Fruits";
        description = "Bing cherry tree seeds for plump, dark sweet cherries.";
        priceInCents = 619;
        stock = 48;
      });

      // Flowers
      initialProducts.add({
        id = 11;
        name = "Rose Seeds";
        category = "Flowers";
        description = "Beautiful heirloom rose seeds in deep red and pink varieties.";
        priceInCents = 549;
        stock = 60;
      });
      initialProducts.add({
        id = 12;
        name = "Sunflower Seeds";
        category = "Flowers";
        description = "Giant sunflower seeds that grow up to 10 feet tall.";
        priceInCents = 299;
        stock = 140;
      });
      initialProducts.add({
        id = 13;
        name = "Tulip Seeds";
        category = "Flowers";
        description = "Elegant Dutch tulip seeds in a rainbow of spring colors.";
        priceInCents = 429;
        stock = 85;
      });
      initialProducts.add({
        id = 14;
        name = "Daisy Seeds";
        category = "Flowers";
        description = "Cheerful Shasta daisy seeds that bloom all summer long.";
        priceInCents = 279;
        stock = 130;
      });
      initialProducts.add({
        id = 15;
        name = "Lavender Seeds";
        category = "Flowers";
        description = "Fragrant English lavender seeds beloved by pollinators.";
        priceInCents = 379;
        stock = 95;
      });
      initialProducts.add({
        id = 41;
        name = "Marigold Seeds";
        category = "Flowers";
        description = "Vibrant marigold seeds that repel pests naturally in gardens.";
        priceInCents = 249;
        stock = 175;
      });
      initialProducts.add({
        id = 42;
        name = "Zinnia Seeds";
        category = "Flowers";
        description = "Bright zinnia seeds in a riot of colors, great for cutting.";
        priceInCents = 269;
        stock = 155;
      });
      initialProducts.add({
        id = 43;
        name = "Petunia Seeds";
        category = "Flowers";
        description = "Cascading petunia seeds perfect for hanging baskets.";
        priceInCents = 319;
        stock = 120;
      });
      initialProducts.add({
        id = 44;
        name = "Cosmos Seeds";
        category = "Flowers";
        description = "Feathery cosmos seeds that attract butterflies and birds.";
        priceInCents = 239;
        stock = 165;
      });
      initialProducts.add({
        id = 45;
        name = "Pansy Seeds";
        category = "Flowers";
        description = "Cold-hardy pansy seeds with cheerful two-tone faces.";
        priceInCents = 299;
        stock = 140;
      });

      // Herbs
      initialProducts.add({
        id = 16;
        name = "Basil Seeds";
        category = "Herbs";
        description = "Aromatic sweet basil seeds, essential for Italian cooking.";
        priceInCents = 249;
        stock = 180;
      });
      initialProducts.add({
        id = 17;
        name = "Mint Seeds";
        category = "Herbs";
        description = "Refreshing spearmint seeds great for teas and cocktails.";
        priceInCents = 229;
        stock = 160;
      });
      initialProducts.add({
        id = 18;
        name = "Parsley Seeds";
        category = "Herbs";
        description = "Fresh curly parsley seeds for garnish and flavoring.";
        priceInCents = 219;
        stock = 170;
      });
      initialProducts.add({
        id = 19;
        name = "Cilantro Seeds";
        category = "Herbs";
        description = "Flavorful cilantro seeds used in Mexican and Asian cuisine.";
        priceInCents = 239;
        stock = 155;
      });
      initialProducts.add({
        id = 20;
        name = "Thyme Seeds";
        category = "Herbs";
        description = "Savory English thyme seeds with strong, earthy fragrance.";
        priceInCents = 259;
        stock = 145;
      });
      initialProducts.add({
        id = 46;
        name = "Rosemary Seeds";
        category = "Herbs";
        description = "Woody rosemary seeds with intense pine-like aroma.";
        priceInCents = 279;
        stock = 135;
      });
      initialProducts.add({
        id = 47;
        name = "Dill Seeds";
        category = "Herbs";
        description = "Feathery dill seeds perfect for pickling and seafood dishes.";
        priceInCents = 219;
        stock = 175;
      });
      initialProducts.add({
        id = 48;
        name = "Chives Seeds";
        category = "Herbs";
        description = "Mild chive seeds that grow in dense, edible clumps.";
        priceInCents = 229;
        stock = 165;
      });
      initialProducts.add({
        id = 49;
        name = "Oregano Seeds";
        category = "Herbs";
        description = "Pungent Greek oregano seeds, a pizza and pasta staple.";
        priceInCents = 249;
        stock = 150;
      });
      initialProducts.add({
        id = 50;
        name = "Sage Seeds";
        category = "Herbs";
        description = "Silvery sage seeds with robust flavor for savory dishes.";
        priceInCents = 259;
        stock = 140;
      });

      // Trees
      initialProducts.add({
        id = 21;
        name = "Oak Tree Seeds";
        category = "Trees";
        description = "Majestic white oak acorns that grow into century-old trees.";
        priceInCents = 799;
        stock = 40;
      });
      initialProducts.add({
        id = 22;
        name = "Pine Tree Seeds";
        category = "Trees";
        description = "Evergreen Eastern white pine seeds for year-round color.";
        priceInCents = 699;
        stock = 45;
      });
      initialProducts.add({
        id = 23;
        name = "Maple Tree Seeds";
        category = "Trees";
        description = "Sugar maple seeds famous for stunning fall foliage.";
        priceInCents = 749;
        stock = 42;
      });
      initialProducts.add({
        id = 24;
        name = "Cherry Tree Seeds";
        category = "Trees";
        description = "Ornamental Japanese cherry blossom seeds for spring beauty.";
        priceInCents = 849;
        stock = 35;
      });
      initialProducts.add({
        id = 25;
        name = "Birch Tree Seeds";
        category = "Trees";
        description = "Elegant paper birch seeds with distinctive white bark.";
        priceInCents = 729;
        stock = 38;
      });
      initialProducts.add({
        id = 51;
        name = "Willow Tree Seeds";
        category = "Trees";
        description = "Graceful weeping willow seeds perfect near water features.";
        priceInCents = 679;
        stock = 48;
      });
      initialProducts.add({
        id = 52;
        name = "Magnolia Seeds";
        category = "Trees";
        description = "Fragrant Southern magnolia seeds for large, showy blooms.";
        priceInCents = 899;
        stock = 30;
      });
      initialProducts.add({
        id = 53;
        name = "Redwood Seeds";
        category = "Trees";
        description = "Majestic coastal redwood seeds, among the tallest trees on earth.";
        priceInCents = 999;
        stock = 25;
      });
      initialProducts.add({
        id = 54;
        name = "Dogwood Seeds";
        category = "Trees";
        description = "Flowering dogwood seeds that produce stunning spring blooms.";
        priceInCents = 769;
        stock = 36;
      });
      initialProducts.add({
        id = 55;
        name = "Ginkgo Seeds";
        category = "Trees";
        description = "Ancient ginkgo tree seeds known for brilliant golden fall color.";
        priceInCents = 829;
        stock = 32;
      });

      // Succulents
      initialProducts.add({
        id = 26;
        name = "Aloe Vera Seeds";
        category = "Succulents";
        description = "Healing aloe vera seeds with gel-filled leaves for skin care.";
        priceInCents = 349;
        stock = 100;
      });
      initialProducts.add({
        id = 27;
        name = "Jade Plant Seeds";
        category = "Succulents";
        description = "Lucky jade plant seeds said to bring prosperity and good fortune.";
        priceInCents = 329;
        stock = 105;
      });
      initialProducts.add({
        id = 28;
        name = "Echeveria Seeds";
        category = "Succulents";
        description = "Rosette-forming echeveria seeds in dusty rose and silver hues.";
        priceInCents = 369;
        stock = 95;
      });
      initialProducts.add({
        id = 29;
        name = "Cactus Seeds";
        category = "Succulents";
        description = "Mixed desert cactus seeds including saguaro and barrel varieties.";
        priceInCents = 299;
        stock = 115;
      });
      initialProducts.add({
        id = 30;
        name = "Sedum Seeds";
        category = "Succulents";
        description = "Hardy stonecrop sedum seeds, excellent for ground cover.";
        priceInCents = 319;
        stock = 108;
      });
      initialProducts.add({
        id = 56;
        name = "Haworthia Seeds";
        category = "Succulents";
        description = "Striped haworthia seeds that thrive in low-light conditions indoors.";
        priceInCents = 359;
        stock = 92;
      });
      initialProducts.add({
        id = 57;
        name = "Agave Seeds";
        category = "Succulents";
        description = "Bold agave seeds for dramatic drought-tolerant landscapes.";
        priceInCents = 389;
        stock = 85;
      });
      initialProducts.add({
        id = 58;
        name = "Sempervivum Seeds";
        category = "Succulents";
        description = "Frost-hardy hen and chicks seeds that spread into charming clusters.";
        priceInCents = 279;
        stock = 125;
      });
      initialProducts.add({
        id = 59;
        name = "Lithops Seeds";
        category = "Succulents";
        description = "Unique living stone seeds that mimic pebbles to avoid predators.";
        priceInCents = 419;
        stock = 78;
      });
      initialProducts.add({
        id = 60;
        name = "Gasteria Seeds";
        category = "Succulents";
        description = "Tongue-shaped gasteria seeds with spotted, glossy leaves.";
        priceInCents = 339;
        stock = 98;
      });

      products.addAll(initialProducts.values());
    };
  };

  func initializePaymentOptions() {
    if (paymentOptions.isEmpty()) {
      let initialOptions = [
        { method = "Credit Card"; enabled = true },
        { method = "Debit Card"; enabled = true },
        { method = "ICP Token"; enabled = true },
        { method = "PayPal"; enabled = false },
      ];

      initialOptions.forEach(
        func(option) {
          paymentOptions.add(option.method, option);
        }
      );
    };
  };

  // Public Shop Functions
  public query ({ caller }) func getAllProducts() : async [SeedProduct] {
    products.toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [SeedProduct] {
    products.filter(func(p) { Text.equal(p.category, category) }).toArray();
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [SeedProduct] {
    products.filter(
      func(p) {
        p.name.toLower().contains(#text(searchTerm.toLower())) or p.description.toLower().contains(#text(searchTerm.toLower()));
      }
    ).toArray();
  };

  // Cart Management Functions (no auth required)
  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (quantity == 0) { Runtime.trap("Quantity must be greater than 0") };

    let product = products.toArray().find(func(p) { p.id == productId });
    switch (product) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) {
        if (p.stock < quantity) { Runtime.trap("Not enough stock available") };
        let cart = switch (carts.get(caller)) {
          case (null) { List.empty<CartItem>() };
          case (?c) { c };
        };

        let existingItemIndex = cart.toArray().findIndex(func(item) { item.productId == productId });

        switch (existingItemIndex) {
          case (null) {
            cart.add({ productId; quantity });
          };
          case (?index) {
            let cartArray = cart.toArray();
            if (index >= cartArray.size()) { Runtime.trap("Internal error: invalid index") };
            cart.clear();
            let newCartArray = cartArray.values().enumerate().map(
              func((i, item)) {
                if (i == index) {
                  { productId; quantity = item.quantity + quantity };
                } else { item };
              }
            );
            cart.addAll(newCartArray);
          };
        };

        carts.add(caller, cart);
      };
    };
  };

  public shared ({ caller }) func updateCartQuantity(productId : Nat, quantity : Nat) : async () {
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart item not found") };
      case (?c) { c };
    };

    let cartArray = cart.toArray();
    let itemIndex = cartArray.findIndex(func(item) { item.productId == productId });

    switch (itemIndex) {
      case (null) { Runtime.trap("Cart item not found") };
      case (?index) {
        if (index >= cartArray.size()) { Runtime.trap("Internal error: invalid index") };
        if (quantity == 0) {
          cart.clear();
          let newCartArray = cartArray.values().enumerate().filter(func((i, _)) { i != index }).map(func((_, item)) { item });
          cart.addAll(newCartArray);
        } else {
          let product = products.toArray().find(func(p) { p.id == productId });
          switch (product) {
            case (null) { Runtime.trap("Product not found") };
            case (?p) {
              if (p.stock < quantity) { Runtime.trap("Not enough stock available") };
              cart.clear();
              let newCartArray = cartArray.values().enumerate().map(
                func((i, item)) {
                  if (i == index) {
                    { productId; quantity };
                  } else { item };
                }
              );
              cart.addAll(newCartArray);
            };
          };
        };
      };
    };

    carts.add(caller, cart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart item not found") };
      case (?c) { c };
    };

    let cartArray = cart.toArray();
    let itemIndex = cartArray.findIndex(func(item) { item.productId == productId });

    switch (itemIndex) {
      case (null) { Runtime.trap("Cart item not found") };
      case (?index) {
        if (index >= cartArray.size()) { Runtime.trap("Internal error: invalid index") };
        cart.clear();
        let newCartArray = cartArray.values().enumerate().filter(func((i, _)) { i != index }).map(func((_, item)) { item });
        cart.addAll(newCartArray);
        carts.add(caller, cart);
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    carts.remove(caller);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  public query ({ caller }) func getCartTotal() : async Nat {
    let cart = switch (carts.get(caller)) {
      case (null) { return 0 };
      case (?c) { c };
    };

    var total = 0;
    cart.values().forEach(
      func(item) {
        let product = products.toArray().find(func(p) { p.id == item.productId });
        switch (product) {
          case (?p) { total += p.priceInCents * item.quantity };
          case (null) {};
        };
      }
    );
    total;
  };

  // Orders & Payment (public for all, no explicit permission required)
  public shared ({ caller }) func placeOrder(paymentMethod : Text) : async () {
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?c) {
        if (c.isEmpty()) { Runtime.trap("Cart is empty") };
        c;
      };
    };

    let items = cart.toArray().map(
      func(cartItem) {
        let product = products.toArray().find(func(p) { p.id == cartItem.productId });
        switch (product) {
          case (null) { Runtime.trap("Product not found") };
          case (?p) {
            {
              productId = cartItem.productId;
              quantity = cartItem.quantity;
              priceInCents = p.priceInCents;
            };
          };
        };
      }
    );

    let totalInCents = items.foldLeft(0, func(acc, item) { acc + (item.priceInCents * item.quantity) });

    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      id = orderId;
      customerPrincipal = caller;
      items;
      totalInCents;
      status = "Pending";
      paymentMethod;
      paymentStatus = "Pending";
      createdAt = Time.now();
    };

    orders.add(orderId, order);

    let transactionId = nextTransactionId;
    nextTransactionId += 1;

    let transaction : PaymentTransaction = {
      id = transactionId;
      orderId;
      amount = totalInCents;
      method = paymentMethod;
      status = "Pending";
      timestamp = Time.now();
    };

    paymentTransactions.add(transactionId, transaction);

    let invoiceId = nextInvoiceId;
    nextInvoiceId += 1;

    let invoice : Invoice = {
      id = invoiceId;
      invoiceNumber = "INV-" # orderId.toText();
      orderId;
      issuedAt = Time.now();
    };

    invoices.add(invoiceId, invoice);

    carts.remove(caller);
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    orders.values().filter(func(order) { order.customerPrincipal == caller }).toArray();
  };

  // Admin Functions
  public query ({ caller }) func getAllOrders() : async [Order] {
    orders.values().toArray();
  };

  public query ({ caller }) func getSalesStats() : async SalesStats {
    var totalRevenue = 0;
    var totalOrders = 0;
    var totalItemsSold = 0;

    orders.values().forEach(
      func(order) {
        totalRevenue += order.totalInCents;
        totalOrders += 1;
        totalItemsSold += order.items.foldLeft(0, func(acc, item) { acc + item.quantity });
      }
    );

    {
      totalRevenue;
      totalOrders;
      totalItemsSold;
    };
  };

  public query ({ caller }) func getAllPaymentTransactions() : async [PaymentTransaction] {
    paymentTransactions.values().toArray();
  };

  public query ({ caller }) func getAllInvoices() : async [Invoice] {
    invoices.values().toArray();
  };

  public shared func updateOrderStatus(orderId : Nat, status : Text) : async () {
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) { o };
    };
    let updatedOrder = { order with status };
    orders.add(orderId, updatedOrder);
  };

  // Public Functions
  public query ({ caller }) func getPaymentOptions() : async [PaymentOption] {
    paymentOptions.values().toArray();
  };

  public shared func togglePaymentOption(method : Text) : async () {
    let option = switch (paymentOptions.get(method)) {
      case (null) { Runtime.trap("Payment option not found") };
      case (?o) { o };
    };
    let updatedOption = { option with enabled = not option.enabled };
    paymentOptions.add(method, updatedOption);
  };


  system func postupgrade() {
    initializeProducts();
    initializePaymentOptions();
  };
};
