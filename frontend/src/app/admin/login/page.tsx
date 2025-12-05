"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, Shield, Sparkles, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(password);

    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Login failed");
    }

    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          {/* Animated Logo */}
          <div className="relative inline-flex items-center justify-center mb-6 group">
            {/* Outer ring */}
            <div className="absolute w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-500/30 to-orange-500/30 blur-lg group-hover:blur-xl transition-all duration-300" />
            {/* Main icon container */}
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 shadow-2xl shadow-rose-500/30">
              <Shield className="w-10 h-10 text-white" />
              {/* Sparkle */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              Printvault
            </span>
            <span className="text-gray-400 font-normal ml-2">Admin</span>
          </h1>
          <p className="text-gray-500">Secure access to your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="relative group">
          {/* Card glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
          
          {/* Main card */}
          <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 shadow-2xl">
            {/* Card header decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3 animate-shake">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span>{error}</span>
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-3">
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300"
                >
                  <KeyRound className="w-4 h-4 text-rose-400" />
                  Admin Password
                </label>
                <div className="relative group/input">
                  {/* Input glow on focus */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur transition-opacity duration-300" />
                  
                  <div className="relative flex items-center">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800 transition-colors pr-12"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-gray-500 hover:text-rose-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !password}
                className="relative w-full py-4 px-6 rounded-xl font-semibold text-white overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {/* Button background */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 transition-transform duration-300 group-hover/btn:scale-105" />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                
                {/* Button content */}
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Access Dashboard
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Security note */}
            <div className="mt-6 pt-6 border-t border-gray-800/50">
              <div className="flex items-center gap-3 text-gray-500 text-xs">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Protected by secure authentication</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Printvault Admin Panel
          </p>
          <p className="text-gray-700 text-xs mt-1">
            by <span className="text-rose-400/60">Jalaram Cards</span>
          </p>
        </div>
      </div>
    </div>
  );
}
