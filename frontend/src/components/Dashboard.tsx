import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Home, User, Building2, Heart, LogOut, PlusCircle, Search } from "lucide-react";
import { authApi } from "../services/api";
import { useEffect, useState } from "react";

interface DashboardProps {
  onLogout: () => void;
  onBrowse: () => void;
  onAddProperty: () => void;
}

export function Dashboard({ onLogout, onBrowse, onAddProperty }: DashboardProps) {
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);

  useEffect(() => {
    setUser(authApi.getUser());
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Brook Rent</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span className="font-medium">{user?.email}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Welcome{user ? `, ${user.email}` : ''}!</h2>
          <p className="text-muted-foreground">Manage your account and listings from here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <CardDescription>Properties you've listed</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favorites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <CardDescription>Saved properties</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <CardDescription>Your account is in good standing</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={onBrowse} className="w-full flex items-center justify-center gap-2">
            <Search /> Browse Properties
          </Button>
          <Button onClick={onAddProperty} className="w-full flex items-center justify-center gap-2">
            <PlusCircle /> List a Property
          </Button>
          <Button onClick={() => alert('Favorites not implemented yet')} className="w-full flex items-center justify-center gap-2">
            <Heart /> View Favorites
          </Button>
        </div>
      </main>
    </div>
  );
}
