import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Leaf,
  LogIn,
  Settings,
  Sprout,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AdminLogin({
  onAdminVerified,
  onBack,
}: {
  onAdminVerified: () => void;
  onBack: () => void;
}) {
  const { loginAdmin, setupAdmin, adminConfigured } = useAuth();

  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup state (first-time)
  const [setupUsername, setSetupUsername] = useState("");
  const [setupPassword, setSetupPassword] = useState("");
  const [setupConfirm, setSetupConfirm] = useState("");
  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [setupError, setSetupError] = useState("");
  const [setupSuccess, setSetupSuccess] = useState(false);
  const [isSetupSubmitting, setIsSetupSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const success = loginAdmin(username.trim(), password);
    if (success) {
      onAdminVerified();
    } else {
      setError("Invalid credentials. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError("");
    if (!setupUsername.trim() || !setupPassword) {
      setSetupError("Please fill in all fields.");
      return;
    }
    if (setupPassword.length < 6) {
      setSetupError("Password must be at least 6 characters.");
      return;
    }
    if (setupPassword !== setupConfirm) {
      setSetupError("Passwords do not match.");
      return;
    }
    setIsSetupSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const result = setupAdmin(setupUsername.trim(), setupPassword);
    if (result.success) {
      setSetupSuccess(true);
      setTimeout(() => {
        setSetupSuccess(false);
        setSetupUsername("");
        setSetupPassword("");
        setSetupConfirm("");
      }, 1500);
    } else {
      setSetupError(result.error ?? "Setup failed.");
    }
    setIsSetupSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        <Card className="border-border shadow-botanical-lg">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sprout className="w-7 h-7 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground text-center">
                GreenSprout
              </h1>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                <p className="text-sm text-muted-foreground font-medium tracking-wide">
                  {adminConfigured ? "Admin Portal" : "Admin Setup"}
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              </div>
            </div>

            {!adminConfigured ? (
              /* ── First-time setup ── */
              <>
                <div className="space-y-2 text-xs text-muted-foreground bg-muted/40 rounded-xl p-3.5 border border-border mb-6">
                  <div className="flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="font-medium text-foreground">
                      First-time setup
                    </span>
                  </div>
                  <p>
                    Create your admin credentials to access the dashboard. These
                    will be saved securely in your browser.
                  </p>
                </div>

                <form onSubmit={handleSetup} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="setup-username"
                      className="text-sm font-medium text-foreground"
                    >
                      Admin Username
                    </Label>
                    <Input
                      id="setup-username"
                      type="text"
                      autoComplete="username"
                      placeholder="Choose an admin username"
                      value={setupUsername}
                      onChange={(e) => {
                        setSetupUsername(e.target.value);
                        setSetupError("");
                      }}
                      data-ocid="admin.setup.username_input"
                      className="h-10 rounded-xl border-border focus:ring-2 focus:ring-primary/40"
                      disabled={isSetupSubmitting || setupSuccess}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="setup-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="setup-password"
                        type={showSetupPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        value={setupPassword}
                        onChange={(e) => {
                          setSetupPassword(e.target.value);
                          setSetupError("");
                        }}
                        data-ocid="admin.setup.password_input"
                        className="h-10 rounded-xl border-border focus:ring-2 focus:ring-primary/40 pr-10"
                        disabled={isSetupSubmitting || setupSuccess}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowSetupPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showSetupPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showSetupPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="setup-confirm"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="setup-confirm"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      value={setupConfirm}
                      onChange={(e) => {
                        setSetupConfirm(e.target.value);
                        setSetupError("");
                      }}
                      data-ocid="admin.setup.confirm_input"
                      className="h-10 rounded-xl border-border focus:ring-2 focus:ring-primary/40"
                      disabled={isSetupSubmitting || setupSuccess}
                    />
                  </div>

                  {setupError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-destructive/8 border border-destructive/20 rounded-xl px-3 py-2.5"
                      data-ocid="admin.setup.error_state"
                    >
                      <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                      <p className="text-xs text-destructive">{setupError}</p>
                    </motion.div>
                  )}

                  {setupSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-xl px-3 py-2.5"
                      data-ocid="admin.setup.success_state"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="text-xs text-primary font-medium">
                        Admin account created! You can now sign in.
                      </p>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    data-ocid="admin.setup_button"
                    className="w-full rounded-xl h-11 gap-2 bg-primary text-primary-foreground font-semibold mt-2"
                    disabled={isSetupSubmitting || setupSuccess}
                  >
                    {isSetupSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Settings className="w-4 h-4" />
                        Set Up Admin Account
                      </>
                    )}
                  </Button>
                </form>
              </>
            ) : (
              /* ── Normal login ── */
              <>
                <div className="space-y-2 text-xs text-muted-foreground bg-muted/40 rounded-xl p-3.5 border border-border mb-6">
                  {[
                    "Manage sales & order analytics",
                    "Configure payment options",
                    "View invoices & transactions",
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2">
                      <Leaf className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="admin-username"
                      className="text-sm font-medium text-foreground"
                    >
                      Username
                    </Label>
                    <Input
                      id="admin-username"
                      type="text"
                      autoComplete="username"
                      placeholder="Enter admin username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                      }}
                      data-ocid="admin.username_input"
                      className="h-10 rounded-xl border-border focus:ring-2 focus:ring-primary/40"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="admin-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        data-ocid="admin.password_input"
                        className="h-10 rounded-xl border-border focus:ring-2 focus:ring-primary/40 pr-10"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-destructive/8 border border-destructive/20 rounded-xl px-3 py-2.5"
                      data-ocid="admin.login.error_state"
                    >
                      <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                      <p className="text-xs text-destructive">{error}</p>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    data-ocid="admin.login_button"
                    className="w-full rounded-xl h-11 gap-2 bg-primary text-primary-foreground font-semibold mt-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}

            <button
              type="button"
              onClick={onBack}
              data-ocid="admin.back_button"
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-3 mt-2"
            >
              ← Back to Shop
            </button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} GreenSprout Seeds. Admin access only.
        </p>
      </motion.div>
    </div>
  );
}
