import { Button } from "./ui/button";
import { Home, Search, PlusCircle, User, LogOut, LayoutDashboard } from "lucide-react";
import { authApi, User as UserType } from "../services/api";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function Header() {
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(authApi.getUser());
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      setUser(authApi.getUser());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location]);

  const handleLogout = async () => {
    await authApi.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Home className="w-6 h-6 text-primary" />
          <span className="text-2xl font-bold text-primary">Brook Rent</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="text-foreground hover:text-primary hidden sm:flex" 
            onClick={() => navigate('/browse')}
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Properties
          </Button>
          
          {user && user.user_type === 'lister' && (
            <Button 
              variant="ghost" 
              className="text-foreground hover:text-primary hidden sm:flex" 
              onClick={() => navigate('/add-property')}
            >
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
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary" 
                onClick={() => navigate('/dashboard')}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary" 
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button 
                variant="default" 
                className="bg-primary hover:bg-primary/90" 
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
