import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Search, Shield, MessageSquare, TrendingUp, Clock, Star } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find properties that match your exact needs with advanced filtering and search capabilities."
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description: "All properties and users are verified to ensure safety and authenticity for both parties."
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description: "Connect directly with property owners or potential renters through our messaging system."
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Access real-time market data and trends to make informed rental decisions."
  },
  {
    icon: Clock,
    title: "Quick Approvals",
    description: "Streamlined application process that gets you approved and moved in faster."
  },
  {
    icon: Star,
    title: "Rating System",
    description: "Build trust with transparent reviews and ratings from previous tenants and landlords."
  }
];

export function Features() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4 text-foreground">Why Choose Brook Rent?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The complete platform for modern rental experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
