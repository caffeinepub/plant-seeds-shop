import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Order {
    id: bigint;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    customerPrincipal: Principal;
    createdAt: bigint;
    totalInCents: bigint;
    items: Array<OrderItem>;
}
export interface SeedProduct {
    id: bigint;
    name: string;
    description: string;
    stock: bigint;
    category: string;
    priceInCents: bigint;
}
export interface OrderItem {
    productId: bigint;
    quantity: bigint;
    priceInCents: bigint;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface Invoice {
    id: bigint;
    orderId: bigint;
    invoiceNumber: string;
    issuedAt: bigint;
}
export interface PaymentTransaction {
    id: bigint;
    status: string;
    method: string;
    orderId: bigint;
    timestamp: bigint;
    amount: bigint;
}
export interface PaymentOption {
    method: string;
    enabled: boolean;
}
export interface UserProfile {
    name: string;
}
export interface SalesStats {
    totalOrders: bigint;
    totalItemsSold: bigint;
    totalRevenue: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    getAllInvoices(): Promise<Array<Invoice>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllPaymentTransactions(): Promise<Array<PaymentTransaction>>;
    getAllProducts(): Promise<Array<SeedProduct>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getCartTotal(): Promise<bigint>;
    getMyOrders(): Promise<Array<Order>>;
    getPaymentOptions(): Promise<Array<PaymentOption>>;
    getProductsByCategory(category: string): Promise<Array<SeedProduct>>;
    getSalesStats(): Promise<SalesStats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(paymentMethod: string): Promise<void>;
    removeFromCart(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchTerm: string): Promise<Array<SeedProduct>>;
    togglePaymentOption(method: string): Promise<void>;
    updateCartQuantity(productId: bigint, quantity: bigint): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
}
