import { Button } from "./ui/button";
import { Home, Search, PlusCircle, User, LogOut, LayoutDashboard } from "lucide-react";
import { authApi } from "../services/api";
import { useEffect, useState } from "react";

interface HeaderProps {
  onLogin: () => void;
  onSignup: () => void;
  onBrowse?: () => void;
  onAddProperty?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
  onLogout?: () => void;
}

export function Header({ onLogin, onSignup, onBrowse, onAddProperty, onHome, onDashboard, onLogout }: HeaderProps) {
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);

  useEffect(() => {
    setUser(authApi.getUser());
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    setUser(null);
    if (onLogout) onLogout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button 
          onClick={onHome} 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Home className="w-6 h-6 text-primary" />
          <span className="text-2xl font-bold text-primary">Brook Rent</span>
        </button>
        
        <div className="flex items-center gap-3">
          {onBrowse && (
            <Button variant="ghost" className="text-foreground hover:text-primary hidden sm:flex" onClick={onBrowse}>
              <Search className="w-4 h-4 mr-2" />
              Browse Properties
            </Button>
          )}
          {onAddProperty && (
            <Button variant="ghost" className="text-foreground hover:text-primary hidden sm:flex" onClick={onAddProperty}>
              <PlusCircle className="w-4 h-4 mr-2" />
              List Property
            </Button>
          )}
          
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              {onDashboard && (
                <Button variant="ghost" className="text-foreground hover:text-primary" onClick={onDashboard}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-foreground hover:text-primary" onClick={onLogin}>
                Log In
              </Button>
              <Button variant="default" className="bg-primary hover:bg-primary/90" onClick={onSignup}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
