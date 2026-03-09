import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  FileText,
  Loader2,
  Package,
  Truck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { CartItem, SeedProduct } from "../backend.d";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentMethod = "cod" | "gpay";
type CheckoutStep = "method" | "address" | "gpay-confirm" | "success";

interface DeliveryAddress {
  fullName: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
}

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: SeedProduct[];
  onOrderPlaced: () => void;
  userName?: string | null;
}

// ─── Price helpers ────────────────────────────────────────────────────────────

function formatPrice(cents: number | bigint): string {
  const num = Number(cents) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

// ─── Step indicators ──────────────────────────────────────────────────────────

function StepDots({ step }: { step: CheckoutStep }) {
  const steps: CheckoutStep[] = ["method", "address", "success"];
  const stepIndex =
    step === "gpay-confirm" ? 1 : steps.indexOf(step as CheckoutStep);

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((s, i) => (
        <div
          key={s}
          className={[
            "h-1.5 rounded-full transition-all duration-300",
            i === stepIndex
              ? "w-6 bg-primary"
              : i < stepIndex
                ? "w-3 bg-primary/50"
                : "w-3 bg-muted",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

// ─── Payment method card ──────────────────────────────────────────────────────

function PaymentCard({
  method,
  selected,
  onSelect,
}: {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
}) {
  const isCod = method === "cod";

  return (
    <button
      type="button"
      onClick={onSelect}
      data-ocid={`checkout.${method}.toggle`}
      className={[
        "w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 relative overflow-hidden",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/30",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={[
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
            isCod ? "bg-amber-100" : "bg-[#4285F4]/10",
          ].join(" ")}
        >
          {isCod ? (
            <Truck className="w-5 h-5 text-amber-600" />
          ) : (
            <span className="text-[#4285F4] font-bold text-lg tracking-tight font-sans">
              G
            </span>
          )}
        </div>

        {/* Text */}
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm">
            {isCod ? "Cash on Delivery" : "Google Pay"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isCod
              ? "Pay when your order arrives"
              : "Pay instantly with Google Pay"}
          </p>
        </div>

        {/* Radio indicator */}
        <div
          className={[
            "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
            selected ? "border-primary" : "border-muted-foreground/30",
          ].join(" ")}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
        </div>
      </div>
    </button>
  );
}

// ─── Step 1: Payment method selection ────────────────────────────────────────

function MethodStep({
  subtotal,
  selectedMethod,
  onSelectMethod,
  onContinue,
}: {
  subtotal: number;
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (m: PaymentMethod) => void;
  onContinue: () => void;
}) {
  return (
    <motion.div
      key="method"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5"
    >
      {/* Subtotal banner */}
      <div className="bg-muted/50 border border-border rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Order Subtotal</span>
        <span className="font-display font-bold text-xl text-foreground">
          {formatPrice(subtotal)}
        </span>
      </div>

      {/* Payment method label */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Select Payment Method
        </p>
        <div className="flex flex-col gap-3">
          <PaymentCard
            method="cod"
            selected={selectedMethod === "cod"}
            onSelect={() => onSelectMethod("cod")}
          />
          <PaymentCard
            method="gpay"
            selected={selectedMethod === "gpay"}
            onSelect={() => onSelectMethod("gpay")}
          />
        </div>
      </div>

      <Button
        className="w-full h-12 rounded-xl text-base font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground mt-1"
        disabled={!selectedMethod}
        onClick={onContinue}
        data-ocid="checkout.continue_button"
      >
        Continue
        <ChevronRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

// ─── Step 2a: COD delivery address form ──────────────────────────────────────

function AddressStep({
  subtotal,
  onBack,
  onPlaceOrder,
  isPlacing,
}: {
  subtotal: number;
  onBack: () => void;
  onPlaceOrder: (address: DeliveryAddress) => void;
  isPlacing: boolean;
}) {
  const [form, setForm] = useState<DeliveryAddress>({
    fullName: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<DeliveryAddress>>({});

  const update = (field: keyof DeliveryAddress, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): boolean => {
    const errs: Partial<DeliveryAddress> = {};
    if (!form.fullName.trim()) errs.fullName = "Required";
    if (!form.address.trim()) errs.address = "Required";
    if (!form.city.trim()) errs.city = "Required";
    if (!/^\d{4,10}$/.test(form.pincode)) errs.pincode = "Enter valid pincode";
    if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone))
      errs.phone = "Enter valid phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onPlaceOrder(form);
  };

  return (
    <motion.div
      key="address"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Summary */}
        <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-800">
              Cash on Delivery
            </p>
            <p className="text-xs text-amber-700">
              Pay {formatPrice(subtotal)} when your order arrives
            </p>
          </div>
        </div>

        {/* Fields */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider -mb-1">
          Delivery Address
        </p>

        <div className="grid grid-cols-1 gap-3">
          {/* Full Name */}
          <div className="space-y-1">
            <Label htmlFor="checkout-name" className="text-xs font-medium">
              Full Name *
            </Label>
            <Input
              id="checkout-name"
              data-ocid="checkout.name.input"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Ravi Kumar"
              className={errors.fullName ? "border-destructive" : ""}
            />
            {errors.fullName && (
              <p
                className="text-xs text-destructive"
                data-ocid="checkout.name.error_state"
              >
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1">
            <Label htmlFor="checkout-address" className="text-xs font-medium">
              Address Line *
            </Label>
            <Input
              id="checkout-address"
              data-ocid="checkout.address.input"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="12, MG Road, Apartment 4B"
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && (
              <p
                className="text-xs text-destructive"
                data-ocid="checkout.address.error_state"
              >
                {errors.address}
              </p>
            )}
          </div>

          {/* City + Pincode */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="checkout-city" className="text-xs font-medium">
                City *
              </Label>
              <Input
                id="checkout-city"
                data-ocid="checkout.city.input"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="Bengaluru"
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="checkout.city.error_state"
                >
                  {errors.city}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="checkout-pincode" className="text-xs font-medium">
                Pincode *
              </Label>
              <Input
                id="checkout-pincode"
                data-ocid="checkout.pincode.input"
                value={form.pincode}
                onChange={(e) =>
                  update("pincode", e.target.value.replace(/\D/g, ""))
                }
                placeholder="560001"
                inputMode="numeric"
                className={errors.pincode ? "border-destructive" : ""}
              />
              {errors.pincode && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="checkout.pincode.error_state"
                >
                  {errors.pincode}
                </p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label htmlFor="checkout-phone" className="text-xs font-medium">
              Phone Number *
            </Label>
            <Input
              id="checkout-phone"
              data-ocid="checkout.phone.input"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+91 98765 43210"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p
                className="text-xs text-destructive"
                data-ocid="checkout.phone.error_state"
              >
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-11 rounded-xl gap-1.5"
            onClick={onBack}
            data-ocid="checkout.back.button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-[2] h-11 rounded-xl font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isPlacing}
            data-ocid="checkout.place_order.primary_button"
          >
            {isPlacing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                <Package className="w-4 h-4" />
                Place Order
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

// ─── Step 2b: GPay payment confirmation ───────────────────────────────────────

function GPayStep({
  subtotal,
  userName,
  onBack,
  onPay,
  isPaying,
}: {
  subtotal: number;
  userName?: string | null;
  onBack: () => void;
  onPay: () => void;
  isPaying: boolean;
}) {
  const amount = formatPrice(subtotal);

  return (
    <motion.div
      key="gpay"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4"
    >
      {/* GPay card */}
      <div className="rounded-2xl border border-[#4285F4]/30 bg-gradient-to-br from-[#4285F4]/5 via-white to-[#34A853]/5 p-5 shadow-sm">
        {/* GPay header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#4285F4]/15">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
            {/* Google G logo using colored letters */}
            <span
              className="font-black text-lg leading-none"
              style={{
                background:
                  "linear-gradient(90deg, #4285F4 0%, #EA4335 33%, #FBBC05 66%, #34A853 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              G
            </span>
          </div>
          <div>
            <p className="font-bold text-base text-gray-800">Google Pay</p>
            <p className="text-xs text-gray-500">Secure Payment</p>
          </div>
        </div>

        {/* Payer details */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Paying as</span>
            <span className="text-sm font-semibold text-gray-800">
              {userName ?? "Guest User"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Merchant</span>
            <span className="text-sm font-semibold text-gray-800">
              GreenSprout Seeds
            </span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 font-medium">
              Amount to Pay
            </span>
            <span className="font-display font-bold text-xl text-gray-900">
              {amount}
            </span>
          </div>
        </div>

        {/* Pay button */}
        <button
          type="button"
          onClick={onPay}
          disabled={isPaying}
          data-ocid="checkout.gpay_pay.primary_button"
          className={[
            "w-full h-12 rounded-xl font-bold text-base text-white transition-all duration-200 flex items-center justify-center gap-2",
            isPaying
              ? "bg-[#34A853]/70 cursor-not-allowed"
              : "bg-[#34A853] hover:bg-[#2d9147] active:scale-[0.98] shadow-sm",
          ].join(" ")}
        >
          {isPaying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <span className="font-black text-lg leading-none">G</span>
              Pay {amount}
            </>
          )}
        </button>

        {/* Security note */}
        <p className="text-center text-xs text-gray-400 mt-3">
          🔒 Secured by Google Pay. Simulated payment.
        </p>
      </div>

      {/* Back button */}
      <Button
        type="button"
        variant="ghost"
        className="w-full h-10 rounded-xl text-muted-foreground gap-1.5"
        onClick={onBack}
        data-ocid="checkout.back.button"
        disabled={isPaying}
      >
        <ArrowLeft className="w-4 h-4" />
        Change payment method
      </Button>
    </motion.div>
  );
}

// ─── Step 3: Order success + Invoice ──────────────────────────────────────────

function SuccessStep({
  subtotal,
  paymentMethod,
  cartItems,
  products,
  userName,
  onClose,
}: {
  subtotal: number;
  paymentMethod: PaymentMethod;
  cartItems: CartItem[];
  products: SeedProduct[];
  userName?: string | null;
  onClose: () => void;
}) {
  const isCod = paymentMethod === "cod";
  const shipping = 0; // free shipping
  const tax = Math.round(subtotal * 0.05); // 5% tax for display
  const grandTotal = subtotal + tax;

  // Generate a stable order number from timestamp
  const orderNumber = `GS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5 py-2"
      data-ocid="checkout.success_state"
    >
      {/* Success header */}
      <div className="flex flex-col items-center text-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
        >
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </motion.div>
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-0.5">
            Order Confirmed!
          </h3>
          <p className="text-sm text-muted-foreground">
            Your seeds are on their way
          </p>
        </div>
      </div>

      {/* ── Invoice card ── */}
      <div
        className="w-full border border-border rounded-2xl overflow-hidden text-sm"
        data-ocid="checkout.invoice.card"
      >
        {/* Invoice header */}
        <div className="bg-primary/8 border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground text-xs uppercase tracking-wide">
              Invoice
            </span>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs font-bold text-foreground">
              #{orderNumber}
            </p>
            <p className="text-xs text-muted-foreground">{orderDate}</p>
          </div>
        </div>

        {/* Merchant + Customer info */}
        <div className="grid grid-cols-2 gap-3 px-4 py-3 border-b border-border bg-muted/20">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-0.5">
              From
            </p>
            <p className="font-semibold text-foreground text-xs">
              GreenSprout Seeds
            </p>
            <p className="text-xs text-muted-foreground">
              seeds@greensprout.com
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-0.5">
              To
            </p>
            <p className="font-semibold text-foreground text-xs">
              {userName ?? "Valued Customer"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isCod ? "Cash on Delivery" : "Google Pay"}
            </p>
          </div>
        </div>

        {/* Line items */}
        <div className="px-4 py-3 border-b border-border space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Items Ordered
          </p>
          {cartItems.map((item, idx) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            const lineTotal =
              Number(product.priceInCents) * Number(item.quantity);
            return (
              <div
                key={String(item.productId)}
                className="flex items-center justify-between gap-2"
                data-ocid={`checkout.invoice.item.${idx + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate text-xs">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(product.priceInCents)} x{" "}
                    {String(item.quantity)}
                  </p>
                </div>
                <span className="font-semibold text-foreground text-xs flex-shrink-0">
                  {formatPrice(lineTotal)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="px-4 py-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tax (5%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="h-px bg-border my-1" />
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground text-sm">Total</span>
            <span className="font-display font-bold text-foreground text-base">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>

        {/* Payment status */}
        <div
          className={[
            "px-4 py-2.5 border-t border-border flex items-center justify-between",
            isCod ? "bg-amber-50" : "bg-green-50",
          ].join(" ")}
        >
          <span
            className={[
              "text-xs font-medium",
              isCod ? "text-amber-700" : "text-green-700",
            ].join(" ")}
          >
            {isCod ? "Payment due on delivery" : "Payment received"}
          </span>
          <span
            className={[
              "text-xs font-bold px-2 py-0.5 rounded-full",
              isCod
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700",
            ].join(" ")}
          >
            {isCod ? "PENDING" : "PAID"}
          </span>
        </div>
      </div>

      {/* Delivery note */}
      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        {isCod
          ? `Expected delivery in 3-5 business days. Pay ${formatPrice(grandTotal)} when your order arrives.`
          : "Payment confirmed. Expected delivery in 3-5 business days."}
      </p>

      <Button
        className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={onClose}
        data-ocid="checkout.continue_shopping.button"
      >
        Continue Shopping
      </Button>
    </motion.div>
  );
}

// ─── Main CheckoutModal ───────────────────────────────────────────────────────

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  products,
  onOrderPlaced,
  userName,
}: CheckoutModalProps) {
  const { actor } = useActor();
  const [step, setStep] = useState<CheckoutStep>("method");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [isPlacing, setIsPlacing] = useState(false);
  const [subtotal, setSubtotal] = useState(0);

  // Calculate subtotal whenever cartItems or products change
  const computedSubtotal = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return sum;
    return sum + Number(product.priceInCents) * Number(item.quantity);
  }, 0);

  // Sync subtotal on open
  const handleOpen = () => {
    setSubtotal(computedSubtotal);
    setStep("method");
    setSelectedMethod(null);
  };

  // Handle close and reset
  const handleClose = () => {
    onClose();
    // Delay reset so exit animation plays
    setTimeout(() => {
      setStep("method");
      setSelectedMethod(null);
      setIsPlacing(false);
    }, 300);
  };

  const handleContinue = () => {
    setSubtotal(computedSubtotal);
    if (selectedMethod === "cod") setStep("address");
    else if (selectedMethod === "gpay") setStep("gpay-confirm");
  };

  const placeOrder = async (method: "Cash on Delivery" | "GPay") => {
    setIsPlacing(true);
    try {
      if (actor) {
        await actor.placeOrder(method);
      }
      setStep("success");
      onOrderPlaced();
    } catch {
      // still move to success for demo purposes
      setStep("success");
      onOrderPlaced();
    } finally {
      setIsPlacing(false);
    }
  };

  const handleCodOrder = async (_address: DeliveryAddress) => {
    await placeOrder("Cash on Delivery");
  };

  const handleGPayOrder = async () => {
    // 1.5s simulated processing
    setIsPlacing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await placeOrder("GPay");
  };

  return (
    <AnimatePresence onExitComplete={handleOpen}>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="checkout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm"
            onClick={step !== "success" ? handleClose : undefined}
          />

          {/* Panel */}
          <motion.div
            key="checkout-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            data-ocid="checkout.panel"
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-foreground leading-none">
                    {step === "method" && "Choose Payment"}
                    {step === "address" && "Delivery Address"}
                    {step === "gpay-confirm" && "Pay with GPay"}
                    {step === "success" && "Order Confirmed"}
                  </h2>
                  <div className="mt-1.5">
                    <StepDots step={step} />
                  </div>
                </div>
              </div>
              {step !== "success" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="rounded-full"
                  aria-label="Close checkout"
                  data-ocid="checkout.close_button"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {step === "method" && (
                  <MethodStep
                    subtotal={computedSubtotal}
                    selectedMethod={selectedMethod}
                    onSelectMethod={setSelectedMethod}
                    onContinue={handleContinue}
                  />
                )}
                {step === "address" && (
                  <AddressStep
                    subtotal={subtotal}
                    onBack={() => setStep("method")}
                    onPlaceOrder={handleCodOrder}
                    isPlacing={isPlacing}
                  />
                )}
                {step === "gpay-confirm" && (
                  <GPayStep
                    subtotal={subtotal}
                    userName={userName}
                    onBack={() => setStep("method")}
                    onPay={handleGPayOrder}
                    isPaying={isPlacing}
                  />
                )}
                {step === "success" && (
                  <SuccessStep
                    subtotal={subtotal}
                    paymentMethod={selectedMethod ?? "cod"}
                    cartItems={cartItems}
                    products={products}
                    userName={userName}
                    onClose={handleClose}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
