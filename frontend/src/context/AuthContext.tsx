"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Check auth status on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function verifyToken(authToken: string) {
    try {
      const res = await fetch(`${API_URL}/api/admin/verify`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("adminToken");
        setToken(null);
        setIsAuthenticated(false);
      }
    } catch {
      localStorage.removeItem("adminToken");
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(password: string) {
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const authToken = data.data.token;
        localStorage.setItem("adminToken", authToken);
        setToken(authToken);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch {
      return { success: false, error: "Network error" };
    }
  }

  async function logout() {
    try {
      await fetch(`${API_URL}/api/admin/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem("adminToken");
      setToken(null);
      setIsAuthenticated(false);
      router.push("/admin/login");
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
}
