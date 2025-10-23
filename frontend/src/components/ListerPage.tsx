import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Features } from "./Features";
import { Home, DollarSign, Users, BarChart, Shield, Clock } from "lucide-react";

interface ListerPageProps {
  onBack: () => void;
  onAddProperty: () => void;
}

export function ListerPage({ onBack, onAddProperty }: ListerPageProps) {
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
          <h1 className="text-5xl md:text-6xl mb-6 text-white">List Your Property</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Reach thousands of qualified renters and fill your vacancies faster
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" onClick={onAddProperty}>
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl text-center mb-12 text-foreground">Why List with Brook Rent?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Maximize Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Set competitive pricing with our market insights and fill vacancies faster to maximize your rental income.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Quality Tenants</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connect with verified renters who have been pre-screened and meet your requirements.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track views, inquiries, and performance metrics to optimize your listings.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Verified Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Your property is verified and protected, giving renters confidence in your listing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Save Time</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Streamlined application process and automated tools help you manage properties efficiently.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Easy Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Manage all your properties from one central dashboard with powerful tools.
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
                <h3 className="mb-2 text-foreground">Create Your Account</h3>
                <p className="text-muted-foreground">Sign up and verify your identity to get started as a trusted lister.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="mb-2 text-foreground">List Your Property</h3>
                <p className="text-muted-foreground">Add photos, details, and pricing for your rental property in minutes.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                3
              </div>
              <div>
                <h3 className="mb-2 text-foreground">Connect with Renters</h3>
                <p className="text-muted-foreground">Receive applications from qualified renters and communicate directly.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                4
              </div>
              <div>
                <h3 className="mb-2 text-foreground">Close the Deal</h3>
                <p className="text-muted-foreground">Review applications, select your tenant, and finalize the rental agreement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl mb-6 text-white">Ready to List Your Property?</h2>
          <p className="text-xl mb-8 text-white/90">Join thousands of successful property owners on Brook Rent</p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" onClick={onAddProperty}>
            Create Your Listing
          </Button>
        </div>
      </section>

      <Features />
    </div>
  );
}
