import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  adminLoggedIn: boolean;
  userLoggedIn: boolean;
  userName: string | null;
}

interface RegisteredUser {
  username: string;
  password: string;
}

interface AdminCredentials {
  username: string;
  password: string;
}

interface AuthContextValue extends AuthState {
  loginAdmin: (username: string, password: string) => boolean;
  loginUser: (username: string, password: string) => boolean;
  registerUser: (
    username: string,
    password: string,
  ) => { success: boolean; error?: string };
  setupAdmin: (
    username: string,
    password: string,
  ) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  logoutUser: () => void;
  adminConfigured: boolean;
}

const STORAGE_KEY = "greensprout_auth";
const USERS_KEY = "greensprout_users";
const ADMIN_KEY = "greensprout_admin";

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AuthState>;
      return {
        adminLoggedIn: parsed.adminLoggedIn ?? false,
        userLoggedIn: parsed.userLoggedIn ?? false,
        userName: parsed.userName ?? null,
      };
    }
  } catch {
    // ignore parse errors
  }
  return { adminLoggedIn: false, userLoggedIn: false, userName: null };
}

function loadRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw) as RegisteredUser[];
  } catch {
    // ignore
  }
  return [];
}

function loadAdminCredentials(): AdminCredentials | null {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (raw) return JSON.parse(raw) as AdminCredentials;
  } catch {
    // ignore
  }
  return null;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(loadStoredState);
  const [registeredUsers, setRegisteredUsers] =
    useState<RegisteredUser[]>(loadRegisteredUsers);
  const [adminCreds, setAdminCreds] = useState<AdminCredentials | null>(
    loadAdminCredentials,
  );

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (adminCreds) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(adminCreds));
    }
  }, [adminCreds]);

  const setupAdmin = useCallback(
    (
      username: string,
      password: string,
    ): { success: boolean; error?: string } => {
      if (!username.trim())
        return { success: false, error: "Username cannot be empty." };
      if (password.length < 6)
        return {
          success: false,
          error: "Password must be at least 6 characters.",
        };
      setAdminCreds({ username: username.trim(), password });
      return { success: true };
    },
    [],
  );

  const loginAdmin = useCallback((username: string, password: string) => {
    const creds = loadAdminCredentials();
    if (!creds) return false;
    if (username === creds.username && password === creds.password) {
      setState((prev) => ({ ...prev, adminLoggedIn: true }));
      return true;
    }
    return false;
  }, []);

  const registerUser = useCallback(
    (
      username: string,
      password: string,
    ): { success: boolean; error?: string } => {
      if (!username.trim())
        return { success: false, error: "Username cannot be empty." };
      if (password.length < 6)
        return {
          success: false,
          error: "Password must be at least 6 characters.",
        };
      const existing = loadRegisteredUsers();
      const taken = existing.some(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase(),
      );
      if (taken)
        return {
          success: false,
          error: "Username already taken. Please choose another.",
        };
      const updated = [...existing, { username: username.trim(), password }];
      setRegisteredUsers(updated);
      localStorage.setItem(USERS_KEY, JSON.stringify(updated));
      return { success: true };
    },
    [],
  );

  const loginUser = useCallback((username: string, password: string) => {
    const users = loadRegisteredUsers();
    const match = users.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password,
    );
    if (match) {
      setState((prev) => ({
        ...prev,
        userLoggedIn: true,
        userName: match.username,
      }));
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setState((prev) => ({ ...prev, adminLoggedIn: false }));
  }, []);

  const logoutUser = useCallback(() => {
    setState((prev) => ({ ...prev, userLoggedIn: false, userName: null }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginAdmin,
        loginUser,
        registerUser,
        setupAdmin,
        logoutAdmin,
        logoutUser,
        adminConfigured: !!adminCreds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
