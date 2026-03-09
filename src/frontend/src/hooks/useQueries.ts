import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CartItem,
  Invoice,
  Order,
  PaymentOption,
  PaymentTransaction,
  SalesStats,
  SeedProduct,
} from "../backend.d";
import { useActor } from "./useActor";

export function useAllProducts(initDone = true) {
  const { actor } = useActor();
  return useQuery<SeedProduct[]>({
    queryKey: ["products", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && initDone,
    staleTime: 0,
  });
}

export function useProductsByCategory(category: string, initDone = true) {
  const { actor } = useActor();
  return useQuery<SeedProduct[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getAllProducts();
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && initDone,
    staleTime: 0,
  });
}

export function useSearchProducts(searchTerm: string) {
  const { actor } = useActor();
  return useQuery<SeedProduct[]>({
    queryKey: ["products", "search", searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchProducts(searchTerm);
    },
    enabled: !!actor && searchTerm.trim().length > 0,
    staleTime: 0,
  });
}

export function useCart() {
  const { actor } = useActor();
  return useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor,
  });
}

export function useCartTotal() {
  const { actor } = useActor();
  return useQuery<bigint>({
    queryKey: ["cart", "total"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getCartTotal();
    },
    enabled: !!actor,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: bigint;
      quantity: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.addToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartQuantity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: bigint;
      quantity: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.updateCartQuantity(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("No actor");
      await actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// ─── Admin Queries ────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor } = useActor();
  return useQuery<boolean>({
    queryKey: ["admin", "isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor,
    staleTime: 30_000,
  });
}

export function useSalesStats() {
  const { actor } = useActor();
  return useQuery<SalesStats>({
    queryKey: ["admin", "salesStats"],
    queryFn: async () => {
      if (!actor)
        return { totalRevenue: 0n, totalOrders: 0n, totalItemsSold: 0n };
      return actor.getSalesStats();
    },
    enabled: !!actor,
  });
}

export function useAllOrders() {
  const { actor } = useActor();
  return useQuery<Order[]>({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor,
  });
}

export function useAllPaymentTransactions() {
  const { actor } = useActor();
  return useQuery<PaymentTransaction[]>({
    queryKey: ["admin", "paymentTransactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPaymentTransactions();
    },
    enabled: !!actor,
  });
}

export function useAllInvoices() {
  const { actor } = useActor();
  return useQuery<Invoice[]>({
    queryKey: ["admin", "invoices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInvoices();
    },
    enabled: !!actor,
  });
}

export function usePaymentOptions() {
  const { actor } = useActor();
  return useQuery<PaymentOption[]>({
    queryKey: ["admin", "paymentOptions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPaymentOptions();
    },
    enabled: !!actor,
  });
}

export function useTogglePaymentOption() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (method: string) => {
      if (!actor) throw new Error("No actor");
      await actor.togglePaymentOption(method);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "paymentOptions"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: { orderId: bigint; status: string }) => {
      if (!actor) throw new Error("No actor");
      await actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}
