import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// specify the data migration function in with-clause

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
  var isInitialized = false;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  type SeedProduct = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    priceInCents : Nat;
    stock : Nat;
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type OrderItem = {
    productId : Nat;
    quantity : Nat;
    priceInCents : Nat;
  };

  type Order = {
    id : Nat;
    customerPrincipal : Principal;
    items : [OrderItem];
    totalInCents : Nat;
    status : Text;
    paymentMethod : Text;
    paymentStatus : Text;
    createdAt : Int;
  };

  type PaymentTransaction = {
    id : Nat;
    orderId : Nat;
    amount : Nat;
    method : Text;
    status : Text;
    timestamp : Int;
  };

  type Invoice = {
    id : Nat;
    invoiceNumber : Text;
    orderId : Nat;
    issuedAt : Int;
  };

  type PaymentOption = {
    method : Text;
    enabled : Bool;
  };

  type SalesStats = {
    totalRevenue : Nat;
    totalOrders : Nat;
    totalItemsSold : Nat;
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Initialize function - should be called once, ideally by admin
  public shared ({ caller }) func initialize() : async () {
    if (isInitialized) {
      Runtime.trap("Already initialized");
    };
    initializeProducts();
    initializePaymentOptions();
    isInitialized := true;
  };

  func initializeProducts() {
    if (products.isEmpty()) {
      let initialProducts = [
        {
          id = 1;
          name = "Carrot Seeds";
          category = "Vegetables";
          description = "Heirloom carrot seeds for crispy, sweet carrots.";
          priceInCents = 299;
          stock = 100;
        },
        {
          id = 2;
          name = "Tomato Seeds";
          category = "Vegetables";
          description = "Classic red tomato seeds for juicy tomatoes.";
          priceInCents = 349;
          stock = 150;
        },
        {
          id = 3;
          name = "Lettuce Seeds";
          category = "Vegetables";
          description = "Crisp lettuce seeds for fresh salads.";
          priceInCents = 249;
          stock = 200;
        },
        {
          id = 4;
          name = "Cucumber Seeds";
          category = "Vegetables";
          description = "Refreshing cucumber seeds.";
          priceInCents = 279;
          stock = 120;
        },
        {
          id = 5;
          name = "Bell Pepper Seeds";
          category = "Vegetables";
          description = "Colorful bell pepper seeds.";
          priceInCents = 399;
          stock = 80;
        },
        {
          id = 6;
          name = "Strawberry Seeds";
          category = "Fruits";
          description = "Sweet strawberry seeds for delicious berries.";
          priceInCents = 449;
          stock = 90;
        },
        {
          id = 7;
          name = "Blueberry Seeds";
          category = "Fruits";
          description = "Antioxidant-rich blueberry seeds.";
          priceInCents = 499;
          stock = 70;
        },
        {
          id = 8;
          name = "Raspberry Seeds";
          category = "Fruits";
          description = "Tart raspberry seeds.";
          priceInCents = 479;
          stock = 75;
        },
        {
          id = 9;
          name = "Watermelon Seeds";
          category = "Fruits";
          description = "Juicy watermelon seeds for summer.";
          priceInCents = 329;
          stock = 110;
        },
        {
          id = 10;
          name = "Apple Seeds";
          category = "Fruits";
          description = "Classic apple tree seeds.";
          priceInCents = 599;
          stock = 50;
        },
        {
          id = 11;
          name = "Rose Seeds";
          category = "Flowers";
          description = "Beautiful rose seeds in various colors.";
          priceInCents = 549;
          stock = 60;
        },
        {
          id = 12;
          name = "Sunflower Seeds";
          category = "Flowers";
          description = "Bright sunflower seeds.";
          priceInCents = 299;
          stock = 140;
        },
        {
          id = 13;
          name = "Tulip Seeds";
          category = "Flowers";
          description = "Elegant tulip seeds.";
          priceInCents = 429;
          stock = 85;
        },
        {
          id = 14;
          name = "Daisy Seeds";
          category = "Flowers";
          description = "Cheerful daisy seeds.";
          priceInCents = 279;
          stock = 130;
        },
        {
          id = 15;
          name = "Lavender Seeds";
          category = "Flowers";
          description = "Fragrant lavender seeds.";
          priceInCents = 379;
          stock = 95;
        },
        {
          id = 16;
          name = "Basil Seeds";
          category = "Herbs";
          description = "Aromatic basil seeds for cooking.";
          priceInCents = 249;
          stock = 180;
        },
        {
          id = 17;
          name = "Mint Seeds";
          category = "Herbs";
          description = "Refreshing mint seeds.";
          priceInCents = 229;
          stock = 160;
        },
        {
          id = 18;
          name = "Parsley Seeds";
          category = "Herbs";
          description = "Fresh parsley seeds.";
          priceInCents = 219;
          stock = 170;
        },
        {
          id = 19;
          name = "Cilantro Seeds";
          category = "Herbs";
          description = "Flavorful cilantro seeds.";
          priceInCents = 239;
          stock = 155;
        },
        {
          id = 20;
          name = "Thyme Seeds";
          category = "Herbs";
          description = "Savory thyme seeds.";
          priceInCents = 259;
          stock = 145;
        },
        {
          id = 21;
          name = "Oak Tree Seeds";
          category = "Trees";
          description = "Majestic oak tree seeds.";
          priceInCents = 799;
          stock = 40;
        },
        {
          id = 22;
          name = "Pine Tree Seeds";
          category = "Trees";
          description = "Evergreen pine tree seeds.";
          priceInCents = 699;
          stock = 45;
        },
        {
          id = 23;
          name = "Maple Tree Seeds";
          category = "Trees";
          description = "Beautiful maple tree seeds.";
          priceInCents = 749;
          stock = 42;
        },
        {
          id = 24;
          name = "Cherry Tree Seeds";
          category = "Trees";
          description = "Flowering cherry tree seeds.";
          priceInCents = 849;
          stock = 35;
        },
        {
          id = 25;
          name = "Birch Tree Seeds";
          category = "Trees";
          description = "Elegant birch tree seeds.";
          priceInCents = 729;
          stock = 38;
        },
        {
          id = 26;
          name = "Aloe Vera Seeds";
          category = "Succulents";
          description = "Healing aloe vera seeds.";
          priceInCents = 349;
          stock = 100;
        },
        {
          id = 27;
          name = "Jade Plant Seeds";
          category = "Succulents";
          description = "Lucky jade plant seeds.";
          priceInCents = 329;
          stock = 105;
        },
        {
          id = 28;
          name = "Echeveria Seeds";
          category = "Succulents";
          description = "Rosette-forming echeveria seeds.";
          priceInCents = 369;
          stock = 95;
        },
        {
          id = 29;
          name = "Cactus Seeds";
          category = "Succulents";
          description = "Desert cactus seeds.";
          priceInCents = 299;
          stock = 115;
        },
        {
          id = 30;
          name = "Sedum Seeds";
          category = "Succulents";
          description = "Hardy sedum seeds.";
          priceInCents = 319;
          stock = 108;
        },
      ];

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

  // Public shop functions - no auth required
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

  // Cart management - requires user authentication
  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };
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

  // Orders & Payment - requires user authentication
  public shared ({ caller }) func placeOrder(paymentMethod : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

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

  // Admin functions - require admin role
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getSalesStats() : async SalesStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    paymentTransactions.values().toArray();
  };

  public query ({ caller }) func getAllInvoices() : async [Invoice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    invoices.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) { o };
    };
    let updatedOrder = { order with status };
    orders.add(orderId, updatedOrder);
  };

  // Public query - no auth required
  public query ({ caller }) func getPaymentOptions() : async [PaymentOption] {
    paymentOptions.values().toArray();
  };

  public shared ({ caller }) func togglePaymentOption(method : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let option = switch (paymentOptions.get(method)) {
      case (null) { Runtime.trap("Payment option not found") };
      case (?o) { o };
    };
    let updatedOption = { option with enabled = not option.enabled };
    paymentOptions.add(method, updatedOption);
  };
};

