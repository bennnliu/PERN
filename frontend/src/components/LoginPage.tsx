import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Home } from "lucide-react";
import { Features } from "./Features";
import { authApi } from "../services/api";
import { useState } from "react";

interface LoginPageProps {
  onBack: () => void;
  onSignUp: () => void;
  onLoginSuccess: () => void;
}

export function LoginPage({ onBack, onSignUp, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.login(email, password, rememberMe);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex items-center justify-center bg-secondary/30 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <button 
              onClick={onBack}
              className="flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity mx-auto"
            >
              <Home className="w-8 h-8 text-primary" />
              <span className="text-3xl text-primary">Brook Rent</span>
            </button>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Log in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <button
                  type="button"
                  onClick={onSignUp}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onBack}
              >
                Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Features />
    </div>
  );
}
