import { Button } from "./ui/button";
import { Home, Search, PlusCircle } from "lucide-react";

interface HeaderProps {
  onLogin: () => void;
  onSignup: () => void;
  onBrowse?: () => void;
  onAddProperty?: () => void;
  onHome?: () => void;
}

export function Header({ onLogin, onSignup, onBrowse, onAddProperty, onHome }: HeaderProps) {
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
          <Button variant="ghost" className="text-foreground hover:text-primary" onClick={onLogin}>
            Log In
          </Button>
          <Button variant="default" className="bg-primary hover:bg-primary/90" onClick={onSignup}>
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
