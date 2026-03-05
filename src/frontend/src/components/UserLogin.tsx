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
  Sprout,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

type Tab = "login" | "register";

export default function UserLogin({
  onLoginSuccess,
  onBack,
}: {
  onLoginSuccess: () => void;
  onBack: () => void;
}) {
  const { loginUser, registerUser } = useAuth();
  const [tab, setTab] = useState<Tab>("login");

  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  // Register state
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginUsername.trim() || !loginPassword) {
      setLoginError("Please enter both username and password.");
      return;
    }
    setIsLoginSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    const success = loginUser(loginUsername.trim(), loginPassword);
    if (success) {
      onLoginSuccess();
    } else {
      setLoginError(
        "Invalid credentials. Please check your username and password.",
      );
      setIsLoginSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess(false);
    if (!regUsername.trim() || !regPassword) {
      setRegError("Please fill in all fields.");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }
    if (regPassword !== regConfirm) {
      setRegError("Passwords do not match.");
      return;
    }
    setIsRegSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    const result = registerUser(regUsername.trim(), regPassword);
    if (result.success) {
      setRegSuccess(true);
      setRegUsername("");
      setRegPassword("");
      setRegConfirm("");
      setTimeout(() => {
        setTab("login");
        setRegSuccess(false);
      }, 1800);
    } else {
      setRegError(result.error ?? "Registration failed. Please try again.");
    }
    setIsRegSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
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
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sprout className="w-7 h-7 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground text-center">
                GreenSprout
              </h1>
            </div>

            {/* Tab switcher */}
            <div className="flex rounded-xl border border-border bg-muted/40 p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setLoginError("");
                }}
                data-ocid="user.login.tab"
                className={`flex-1 text-sm font-medium rounded-lg py-2 transition-all ${
                  tab === "login"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setRegError("");
                  setRegSuccess(false);
                }}
                data-ocid="user.register.tab"
                className={`flex-1 text-sm font-medium rounded-lg py-2 transition-all ${
                  tab === "register"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Create Account
              </button>
            </div>

            <AnimatePresence mode="wait">
              {tab === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Benefits */}
                  <div className="space-y-2 text-xs text-muted-foreground bg-muted/40 rounded-xl p-3.5 border border-border mb-5">
                    {[
                      "Browse & purchase premium seeds",
                      "Track your orders",
                      "Secure checkout experience",
                    ].map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2">
                        <Leaf className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="user-username"
                        className="text-sm font-medium text-foreground"
                      >
                        Username
                      </Label>
                      <Input
                        id="user-username"
                        type="text"
                        autoComplete="username"
                        placeholder="Enter your username"
                        value={loginUsername}
                        onChange={(e) => {
                          setLoginUsername(e.target.value);
                          setLoginError("");
                        }}
                        data-ocid="user.username_input"
                        className="h-10 rounded-xl border-border focus:ring-2 focus:ring-primary/40"
                        disabled={isLoginSubmitting}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="user-password"
                        className="text-sm font-medium text-foreground"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="user-password"
                          type={showLoginPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => {
                            setLoginPassword(e.target.value);
                            setLoginError("");
                          }}
                          data-ocid="user.password_input"
                          className="h-10 rounded-xl border-border focus:ring-2 focus:ring-primary/40 pr-10"
                          disabled={isLoginSubmitting}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowLoginPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={
                            showLoginPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showLoginPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-destructive/8 border border-destructive/20 rounded-xl px-3 py-2.5"
                        data-ocid="user.login.error_state"
                      >
                        <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                        <p className="text-xs text-destructive">{loginError}</p>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      data-ocid="user.login_button"
                      className="w-full rounded-xl h-11 gap-2 bg-primary text-primary-foreground font-semibold mt-2"
                      disabled={isLoginSubmitting}
                    >
                      {isLoginSubmitting ? (
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
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="reg-username"
                        className="text-sm font-medium text-foreground"
                      >
                        Username
                      </Label>
                      <Input
                        id="reg-username"
                        type="text"
                        autoComplete="username"
                        placeholder="Choose a username"
                        value={regUsername}
                        onChange={(e) => {
                          setRegUsername(e.target.value);
                          setRegError("");
                        }}
                        data-ocid="user.register.username_input"
                        className="h-10 rounded-xl border-border focus:ring-2 focus:ring-primary/40"
                        disabled={isRegSubmitting}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="reg-password"
                        className="text-sm font-medium text-foreground"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="reg-password"
                          type={showRegPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="At least 6 characters"
                          value={regPassword}
                          onChange={(e) => {
                            setRegPassword(e.target.value);
                            setRegError("");
                          }}
                          data-ocid="user.register.password_input"
                          className="h-10 rounded-xl border-border focus:ring-2 focus:ring-primary/40 pr-10"
                          disabled={isRegSubmitting}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowRegPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={
                            showRegPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showRegPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="reg-confirm"
                        className="text-sm font-medium text-foreground"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="reg-confirm"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        value={regConfirm}
                        onChange={(e) => {
                          setRegConfirm(e.target.value);
                          setRegError("");
                        }}
                        data-ocid="user.register.confirm_input"
                        className="h-10 rounded-xl border-border focus:ring-2 focus:ring-primary/40"
                        disabled={isRegSubmitting}
                      />
                    </div>

                    {regError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-destructive/8 border border-destructive/20 rounded-xl px-3 py-2.5"
                        data-ocid="user.register.error_state"
                      >
                        <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                        <p className="text-xs text-destructive">{regError}</p>
                      </motion.div>
                    )}

                    {regSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-xl px-3 py-2.5"
                        data-ocid="user.register.success_state"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <p className="text-xs text-primary font-medium">
                          Account created! Redirecting to sign in...
                        </p>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      data-ocid="user.register_button"
                      className="w-full rounded-xl h-11 gap-2 bg-primary text-primary-foreground font-semibold mt-2"
                      disabled={isRegSubmitting || regSuccess}
                    >
                      {isRegSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={onBack}
              data-ocid="user.back_button"
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-3 mt-4"
            >
              ← Back to Shop
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
