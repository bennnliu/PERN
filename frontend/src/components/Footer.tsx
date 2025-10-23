import { Home, Mail, Phone, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-6 h-6 text-primary" />
              <span className="text-2xl">Brook Rent</span>
            </div>
            <p className="text-white/70">
              Connecting renters with their dream homes and helping property owners find reliable tenants.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* For Listers */}
          <div>
            <h4 className="mb-4 text-white">For Listers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-primary transition-colors">List Your Property</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary transition-colors">Pricing Plans</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-white/70 hover:text-primary transition-colors">Resources</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/70">
                <Mail className="w-4 h-4" />
                <span>support@brookrent.com</span>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Phone className="w-4 h-4" />
                <span>1-800-BROOK-RENT</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; 2025 Brook Rent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
