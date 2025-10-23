import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Features } from "./Features";
import { Home, Search, MessageSquare, CheckCircle, Bell, MapPin } from "lucide-react";

interface RenterPageProps {
  onBack: () => void;
  onBrowseProperties: () => void;
}

export function RenterPage({ onBack, onBrowseProperties }: RenterPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white py-6 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Home className="w-8 h-8" />
              <span className="text-3xl">Brook Rent</span>
            </button>
            <Button variant="secondary" onClick={onBack}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-6 rounded-full">
              <Home className="w-20 h-20" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl mb-6 text-white">Find Your Dream Home</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Discover thousands of verified rental properties that match your needs
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" onClick={onBrowseProperties}>
            Start Searching
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl text-center mb-12 text-foreground">Why Rent with Brook Rent?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Find properties that match your budget, location preferences, and lifestyle needs with our advanced filters.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Verified Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Every listing is verified for authenticity, so you can trust what you see is what you get.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Direct Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Message property owners directly and schedule viewings without any middleman delays.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Instant Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get notified immediately when new properties matching your criteria become available.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Neighborhood Info</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Explore detailed neighborhood information, schools, transit, and local amenities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Virtual Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Take virtual tours of properties from the comfort of your current home.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/30 py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl text-center mb-12 text-foreground">How It Works</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                1
              </div>
              <div>
                <h3 className="mb-2 text-foreground">Create Your Profile</h3>
                <p className="text-muted-foreground">Sign up and complete your renter profile to get personalized recommendations.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="mb-2 text-foreground">Search & Filter</h3>
                <p className="text-muted-foreground">Use our advanced search to find properties that match your exact requirements.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                3
              </div>
              <div>
                <h3 className="mb-2 text-foreground">Schedule Viewings</h3>
                <p className="text-muted-foreground">Contact property owners and schedule viewings for your favorite listings.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                4
              </div>
              <div>
                <h3 className="mb-2 text-foreground">Apply & Move In</h3>
                <p className="text-muted-foreground">Submit your application, get approved, and move into your new home.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl mb-6 text-white">Ready to Find Your Home?</h2>
          <p className="text-xl mb-8 text-white/90">Start browsing thousands of verified rental properties today</p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" onClick={onBrowseProperties}>
            Browse Properties
          </Button>
        </div>
      </section>

      <Features />
    </div>
  );
}
