import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  BarChart3,
  ClipboardList,
  CreditCard,
  FileText,
  LogOut,
  Package,
  Printer,
  ShoppingBag,
  Sprout,
  TrendingUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type { Invoice, Order } from "../backend.d";
import {
  useAllInvoices,
  useAllOrders,
  useAllPaymentTransactions,
  usePaymentOptions,
  useSalesStats,
  useTogglePaymentOption,
  useUpdateOrderStatus,
} from "../hooks/useQueries";

// ─── Utils ────────────────────────────────────────────────────────────────────

function formatUSD(cents: bigint): string {
  return (Number(cents) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatDate(nsTimestamp: bigint): string {
  return new Date(Number(nsTimestamp) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function shortPrincipal(p: { toString(): string }): string {
  const s = p.toString();
  return `${s.slice(0, 8)}...${s.slice(-5)}`;
}

// ─── Status Badges ────────────────────────────────────────────────────────────

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-gray-100 text-gray-800 border-gray-200",
};

function StatusBadge({
  status,
  colorMap,
}: {
  status: string;
  colorMap: Record<string, string>;
}) {
  const color =
    colorMap[status.toLowerCase()] ??
    "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${color}`}
    >
      {status}
    </span>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

type AdminView =
  | "sales"
  | "orders"
  | "payment-options"
  | "payment-details"
  | "invoices";

const NAV_ITEMS: {
  id: AdminView;
  label: string;
  icon: React.FC<{ className?: string }>;
  ocid: string;
}[] = [
  {
    id: "sales",
    label: "Sales",
    icon: TrendingUp,
    ocid: "admin.sidebar.sales.link",
  },
  {
    id: "orders",
    label: "Order Details",
    icon: Package,
    ocid: "admin.sidebar.orders.link",
  },
  {
    id: "payment-options",
    label: "Payment Options",
    icon: CreditCard,
    ocid: "admin.sidebar.payment_options.link",
  },
  {
    id: "payment-details",
    label: "Payment Details",
    icon: ClipboardList,
    ocid: "admin.sidebar.payment_details.link",
  },
  {
    id: "invoices",
    label: "Invoices",
    icon: FileText,
    ocid: "admin.sidebar.invoices.link",
  },
];

function Sidebar({
  activeView,
  onViewChange,
  onLogout,
  isMobileOpen,
  onMobileClose,
}: {
  activeView: AdminView;
  onViewChange: (v: AdminView) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={[
          "fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col admin-sidebar transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-base leading-none">
              GreenSprout
            </p>
            <p className="text-white/50 text-xs mt-0.5">Admin Portal</p>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            className="ml-auto lg:hidden text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
            Management
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-ocid={item.ocid}
                onClick={() => {
                  onViewChange(item.id);
                  onMobileClose();
                }}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/10",
                ].join(" ")}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6 border-t border-white/10 pt-4">
          <button
            type="button"
            data-ocid="admin.sidebar.logout_button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-red-500/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Sales Page ───────────────────────────────────────────────────────────────

function SalesPage() {
  const { data: stats, isLoading: statsLoading } = useSalesStats();
  const { data: allOrders, isLoading: ordersLoading } = useAllOrders();
  const isLoading = statsLoading || ordersLoading;

  // Build real monthly revenue from actual orders for the current year
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentYear = new Date().getFullYear();
  const monthlyData = MONTHS.map((month, idx) => {
    const revenue = (allOrders ?? []).reduce((sum, order) => {
      const date = new Date(Number(order.createdAt) / 1_000_000);
      if (date.getFullYear() === currentYear && date.getMonth() === idx) {
        return sum + Math.round(Number(order.totalInCents) / 100);
      }
      return sum;
    }, 0);
    return { month, revenue };
  });

  const statCards = [
    {
      title: "Total Revenue",
      value: stats ? formatUSD(stats.totalRevenue) : "--",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Orders",
      value: stats ? Number(stats.totalOrders).toLocaleString() : "--",
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Items Sold",
      value: stats ? Number(stats.totalItemsSold).toLocaleString() : "--",
      icon: BarChart3,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <section data-ocid="admin.sales.section" className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Sales Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your revenue and order metrics
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="border-border shadow-card">
                <CardContent className="p-5">
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {card.title}
                        </p>
                        <p className="font-display text-3xl font-bold text-foreground mt-1">
                          {card.value}
                        </p>
                      </div>
                      <div
                        className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bar Chart */}
      <Card className="border-border shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg font-semibold text-foreground">
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          {isLoading ? (
            <div data-ocid="admin.sales.loading_state" className="space-y-2">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={monthlyData}
                margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.87 0.03 100)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "oklch(0.48 0.06 140)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `$${v}`}
                  tick={{ fontSize: 11, fill: "oklch(0.48 0.06 140)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(v) => [`$${v}`, "Revenue"]}
                  contentStyle={{
                    background: "oklch(0.99 0.006 90)",
                    border: "1px solid oklch(0.87 0.03 100)",
                    borderRadius: "0.75rem",
                    fontSize: "13px",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="oklch(0.42 0.13 148)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

// ─── Order Details Page ───────────────────────────────────────────────────────

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function OrderDetailsPage() {
  const { data: orders = [], isLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusUpdate = async (orderId: bigint, status: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Order Details
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage all customer orders
        </p>
      </div>

      <Card className="border-border shadow-card overflow-hidden">
        {isLoading ? (
          <div data-ocid="admin.orders.loading_state" className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div
            data-ocid="admin.orders.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center px-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">
              No orders yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Orders will appear here once customers start purchasing.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.orders.table">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Order ID
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Items
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Total
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Payment
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Pay Status
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Order Status
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, idx) => (
                  <TableRow
                    key={order.id.toString()}
                    data-ocid={`admin.orders.row.${idx + 1}`}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{order.id.toString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground max-w-[120px] truncate">
                      {shortPrincipal(order.customerPrincipal)}
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {order.items.length}
                    </TableCell>
                    <TableCell className="font-medium text-sm text-foreground">
                      {formatUSD(order.totalInCents)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground capitalize">
                      {order.paymentMethod}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={order.paymentStatus}
                        colorMap={PAYMENT_STATUS_COLORS}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <StatusBadge
                          status={order.status}
                          colorMap={ORDER_STATUS_COLORS}
                        />
                        <Select
                          value={order.status}
                          onValueChange={(v) => handleStatusUpdate(order.id, v)}
                        >
                          <SelectTrigger
                            data-ocid={`admin.orders.status.select.${idx + 1}`}
                            className="h-7 text-xs w-[120px] border-border"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="text-xs capitalize"
                              >
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </section>
  );
}

// ─── Payment Options Page ─────────────────────────────────────────────────────

const PAYMENT_METHOD_ICONS: Record<string, string> = {
  "Credit Card": "💳",
  "Debit Card": "🏦",
  "ICP Token": "🌐",
  PayPal: "💰",
};

function PaymentOptionsPage() {
  const { data: options = [], isLoading } = usePaymentOptions();
  const toggle = useTogglePaymentOption();

  const handleToggle = async (method: string) => {
    try {
      await toggle.mutateAsync(method);
      toast.success(`${method} updated`);
    } catch {
      toast.error(`Failed to update ${method}`);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Payment Options
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Enable or disable payment methods for checkout
        </p>
      </div>

      {isLoading ? (
        <div
          data-ocid="admin.payment_options.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : options.length === 0 ? (
        <Card>
          <CardContent
            data-ocid="admin.payment_options.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <CreditCard className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">
              No payment options configured.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option, idx) => (
            <motion.div
              key={option.method}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
            >
              <Card className="border-border shadow-card hover:shadow-botanical transition-shadow duration-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">
                        {PAYMENT_METHOD_ICONS[option.method] ?? "💳"}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {option.method}
                        </p>
                        <Badge
                          variant="outline"
                          className={
                            option.enabled
                              ? "text-emerald-700 border-emerald-200 bg-emerald-50 text-xs mt-0.5"
                              : "text-gray-500 border-gray-200 bg-gray-50 text-xs mt-0.5"
                          }
                        >
                          {option.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      data-ocid={`admin.payment_options.toggle.${idx + 1}`}
                      checked={option.enabled}
                      onCheckedChange={() => handleToggle(option.method)}
                      disabled={toggle.isPending}
                      aria-label={`Toggle ${option.method}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Payment Details Page ─────────────────────────────────────────────────────

function PaymentDetailsPage() {
  const { data: transactions = [], isLoading } = useAllPaymentTransactions();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Payment Details
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          All payment transactions across your store
        </p>
      </div>

      <Card className="border-border shadow-card overflow-hidden">
        {isLoading ? (
          <div
            data-ocid="admin.payment_details.loading_state"
            className="p-6 space-y-3"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div
            data-ocid="admin.payment_details.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center px-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">
              No transactions yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Payment transactions will appear here after orders are placed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.payment_details.table">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Transaction ID
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Order ID
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Amount
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Method
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, idx) => (
                  <TableRow
                    key={tx.id.toString()}
                    data-ocid={`admin.payment_details.row.${idx + 1}`}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{tx.id.toString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{tx.orderId.toString()}
                    </TableCell>
                    <TableCell className="font-medium text-sm text-foreground">
                      {formatUSD(tx.amount)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground capitalize">
                      {tx.method}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={tx.status}
                        colorMap={PAYMENT_STATUS_COLORS}
                      />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(tx.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </section>
  );
}

// ─── Invoices Page ────────────────────────────────────────────────────────────

function InvoiceModal({
  invoice,
  orders,
  onClose,
}: {
  invoice: Invoice | null;
  orders: Order[];
  onClose: () => void;
}) {
  if (!invoice) return null;

  const order = orders.find((o) => o.id === invoice.orderId);

  const handlePrint = () => window.print();

  return (
    <Dialog open={!!invoice} onOpenChange={() => onClose()}>
      <DialogContent
        data-ocid="admin.invoice.modal"
        className="max-w-lg"
        aria-describedby="invoice-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            Invoice #{invoice.invoiceNumber}
          </DialogTitle>
        </DialogHeader>

        <div id="invoice-modal-description" className="space-y-5 py-2">
          {/* Invoice meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted/40 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">
                Invoice Number
              </p>
              <p className="font-mono font-semibold text-foreground">
                {invoice.invoiceNumber}
              </p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Order ID</p>
              <p className="font-mono font-semibold text-foreground">
                #{invoice.orderId.toString()}
              </p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3 col-span-2">
              <p className="text-xs text-muted-foreground mb-0.5">Issued At</p>
              <p className="font-semibold text-foreground">
                {formatDate(invoice.issuedAt)}
              </p>
            </div>
          </div>

          {/* Order items */}
          {order ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Order Items
              </p>
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-foreground">
                        Product ID
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-foreground">
                        Qty
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-foreground">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {order.items.map((item) => (
                      <tr
                        key={item.productId.toString()}
                        className="hover:bg-muted/10"
                      >
                        <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                          #{item.productId.toString()}
                        </td>
                        <td className="px-3 py-2 text-right text-foreground">
                          {item.quantity.toString()}
                        </td>
                        <td className="px-3 py-2 text-right text-foreground font-medium">
                          {formatUSD(item.priceInCents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/30 border-t-2 border-border">
                    <tr>
                      <td
                        colSpan={2}
                        className="px-3 py-2.5 text-right font-bold text-foreground text-sm"
                      >
                        Total
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-foreground text-sm">
                        {formatUSD(order.totalInCents)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Order details not available.
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            data-ocid="admin.invoice.close_button"
            onClick={onClose}
            className="flex-1 rounded-xl"
          >
            Close
          </Button>
          <Button
            data-ocid="admin.invoice.print_button"
            onClick={handlePrint}
            className="flex-1 rounded-xl gap-2 bg-primary text-primary-foreground"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InvoicesPage() {
  const { data: invoices = [], isLoading } = useAllInvoices();
  const { data: orders = [] } = useAllOrders();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Invoices
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and print all generated invoices
        </p>
      </div>

      <Card className="border-border shadow-card overflow-hidden">
        {isLoading ? (
          <div
            data-ocid="admin.invoices.loading_state"
            className="p-6 space-y-3"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div
            data-ocid="admin.invoices.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center px-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">
              No invoices yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Invoices are generated automatically when orders are placed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.invoices.table">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Invoice #
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Order ID
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Issued Date
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice, idx) => (
                  <TableRow
                    key={invoice.id.toString()}
                    data-ocid={`admin.invoices.row.${idx + 1}`}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="font-mono text-sm font-semibold text-foreground">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{invoice.orderId.toString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(invoice.issuedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        data-ocid={`admin.invoice.view_button.${idx + 1}`}
                        onClick={() => setSelectedInvoice(invoice)}
                        className="gap-1.5 h-7 text-xs rounded-lg"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <InvoiceModal
        invoice={selectedInvoice}
        orders={orders}
        onClose={() => setSelectedInvoice(null)}
      />
    </section>
  );
}

// ─── Admin Dashboard (root) ───────────────────────────────────────────────────

export default function AdminDashboard({
  onLogout,
  onBack,
}: {
  onLogout: () => void;
  onBack?: () => void;
}) {
  const [activeView, setActiveView] = useState<AdminView>("sales");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={onLogout}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border px-6 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
            aria-label="Open navigation"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {onBack && (
            <button
              type="button"
              data-ocid="admin.header.back_button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
              aria-label="Back to shop"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Shop</span>
            </button>
          )}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Admin Portal</p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">
              Admin Access
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === "sales" && <SalesPage />}
              {activeView === "orders" && <OrderDetailsPage />}
              {activeView === "payment-options" && <PaymentOptionsPage />}
              {activeView === "payment-details" && <PaymentDetailsPage />}
              {activeView === "invoices" && <InvoicesPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
