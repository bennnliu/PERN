import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { ListerPage } from "./components/ListerPage";
import { RenterPage } from "./components/RenterPage";
import { BrowsePage } from "./components/BrowsePage";
import { AddPropertyPage } from "./components/AddPropertyPage";
import { Dashboard } from "./components/Dashboard";
import { Property } from "./components/PropertyCard";
import { authApi } from "./services/api";

type Page = "home" | "login" | "signup" | "lister" | "renter" | "browse" | "add-property" | "dashboard";

// Mock initial properties
const initialProperties: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    location: "Downtown Manhattan, NY",
    price: 3200,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk4NzQzMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Stunning modern apartment with city views, hardwood floors, and updated kitchen. Walking distance to restaurants and public transit.",
    available: true,
  },
  {
    id: "2",
    title: "Cozy Brooklyn Studio",
    location: "Brooklyn, NY",
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 550,
    type: "Studio",
    image: "https://images.unsplash.com/photo-1702014862053-946a122b920d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU5OTQ5OTU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Charming studio in vibrant Brooklyn neighborhood. Perfect for young professionals. Includes all utilities and WiFi.",
    available: true,
  },
  {
    id: "3",
    title: "Luxury 3-Bedroom House",
    location: "Queens, NY",
    price: 4500,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2100,
    type: "House",
    image: "https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc1OTkwMDcwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Beautiful family home with spacious backyard, modern kitchen, and finished basement. Great school district.",
    available: true,
  },
  {
    id: "4",
    title: "Contemporary Living Space",
    location: "Downtown Brooklyn, NY",
    price: 2900,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 1000,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1720247520862-7e4b14176fa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTk2MTgwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Sleek contemporary apartment featuring open floor plan, stainless appliances, and in-unit washer/dryer.",
    available: true,
  },
  {
    id: "5",
    title: "Charming Bedroom Suite",
    location: "Manhattan Suburbs, NY",
    price: 2200,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 900,
    type: "Condo",
    image: "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGhvbWV8ZW58MXx8fHwxNzU5OTgxMDc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Warm and inviting condo with plenty of natural light, updated bathroom, and private balcony.",
    available: true,
  },
  {
    id: "6",
    title: "Spacious Kitchen Apartment",
    location: "Queens, NY",
    price: 2600,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1150,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1758240689297-d8613ca753f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjaW91cyUyMGtpdGNoZW58ZW58MXx8fHwxNzU5OTgxMDc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Perfect for home chefs! Features gourmet kitchen with granite countertops, large living area, and parking included.",
    available: true,
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Check if user is logged in on mount
    const user = authApi.getUser();
    if (user && currentPage === "home") {
      setCurrentPage("dashboard");
    }
  }, []);

  const navigateToHome = () => setCurrentPage("home");
  const navigateToLogin = () => setCurrentPage("login");
  const navigateToSignup = () => setCurrentPage("signup");
  const navigateToLister = () => setCurrentPage("lister");
  const navigateToRenter = () => setCurrentPage("renter");
  const navigateToBrowse = () => setCurrentPage("browse");
  const navigateToAddProperty = () => setCurrentPage("add-property");
  const navigateToDashboard = () => setCurrentPage("dashboard");

  const handleLoginSuccess = () => {
    setCurrentPage("dashboard");
  };

  const handleSignupSuccess = () => {
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentPage("home");
  };

  const handleAddProperty = (newProperty: Omit<Property, "id">) => {
    const property: Property = {
      ...newProperty,
      id: Date.now().toString(),
    };
    setProperties([property, ...properties]);
  };

  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  if (currentPage === "login") {
    return <LoginPage onBack={navigateToHome} onSignUp={navigateToSignup} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === "signup") {
    return <SignupPage onBack={navigateToHome} onLogin={navigateToLogin} onSignupSuccess={handleSignupSuccess} />;
  }

  if (currentPage === "dashboard") {
    return <Dashboard onLogout={handleLogout} onBrowse={navigateToBrowse} onAddProperty={navigateToAddProperty} />;
  }

  if (currentPage === "lister") {
    return <ListerPage onBack={navigateToHome} onAddProperty={navigateToAddProperty} />;
  }

  if (currentPage === "renter") {
    return <RenterPage onBack={navigateToHome} onBrowseProperties={navigateToBrowse} />;
  }

  if (currentPage === "browse") {
    return (
      <BrowsePage
        onBack={navigateToHome}
        properties={properties}
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
      />
    );
  }

  if (currentPage === "add-property") {
    return <AddPropertyPage onBack={navigateToLister} onAddProperty={handleAddProperty} />;
  }

  return (
    <div className="min-h-screen">
      <Header 
        onLogin={navigateToLogin} 
        onSignup={navigateToSignup}
        onBrowse={navigateToBrowse}
        onAddProperty={navigateToAddProperty}
        onHome={navigateToHome}
        onDashboard={navigateToDashboard}
        onLogout={handleLogout}
      />
      <Hero onListerClick={navigateToLister} onRenterClick={navigateToRenter} />
      <Features />
      <Footer />
    </div>
  );
}
