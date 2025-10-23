import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Home } from "lucide-react";
import { Features } from "./Features";

interface SignupPageProps {
  onBack: () => void;
  onLogin: () => void;
}

export function SignupPage({ onBack, onLogin }: SignupPageProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    alert("Sign up functionality would be implemented here");
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
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1 rounded" required />
                <span className="text-muted-foreground">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Sign Up
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
