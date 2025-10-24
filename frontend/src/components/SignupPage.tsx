import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Home } from "lucide-react";
import { Features } from "./Features";
import { authApi } from "../services/api";
import { useState } from "react";

interface SignupPageProps {
  onBack: () => void;
  onLogin: () => void;
  onSignupSuccess: () => void;
}

export function SignupPage({ onBack, onLogin, onSignupSuccess }: SignupPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await authApi.register(email, password, rememberMe);
      onSignupSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
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
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>Join Brook Rent to get started</CardDescription>
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
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex items-start gap-2 text-sm">
                <input 
                  type="checkbox" 
                  className="mt-1 rounded" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span className="text-muted-foreground">
                  Remember me on this device
                </span>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <button
                  type="button"
                  onClick={onLogin}
                  className="text-primary hover:underline"
                >
                  Log in
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
