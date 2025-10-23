import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Home } from "lucide-react";
import { Features } from "./Features";

interface LoginPageProps {
  onBack: () => void;
  onSignUp: () => void;
}

export function LoginPage({ onBack, onSignUp }: LoginPageProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    alert("Login functionality would be implemented here");
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
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Log In
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
