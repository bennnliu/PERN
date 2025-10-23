import { Button } from "./ui/button";
import { Building2, UserCircle } from "lucide-react";

interface HeroProps {
  onListerClick: () => void;
  onRenterClick: () => void;
}

export function Hero({ onListerClick, onRenterClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc1OTk4MDE2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 text-white font-bold">
          Find Your Perfect Home
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-white/90">
          Connect renters with their dream homes and help property owners find reliable tenants
        </p>

        {/* Two CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch max-w-3xl mx-auto">
          <div className="flex-1 w-full sm:w-auto">
            <Button 
              size="lg"
              onClick={onListerClick}
              className="w-full h-full bg-primary hover:bg-primary/90 text-white py-6 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center gap-3"
            >
              <Building2 className="h-16 w-16" />
              <div className="text-center">
                <div className="text-xl">I'm a Lister</div>
                <div className="text-sm opacity-90">List your property</div>
              </div>
            </Button>
          </div>
          
          <div className="flex-1 w-full sm:w-auto">
            <Button 
              size="lg"
              variant="secondary"
              onClick={onRenterClick}
              className="w-full h-full bg-white hover:bg-white/90 text-primary py-6 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center gap-3"
            >
              <UserCircle className="h-16 w-16" />
              <div className="text-center">
                <div className="text-xl">I'm a Renter</div>
                <div className="text-sm opacity-90">Find your home</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
