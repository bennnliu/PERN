import React, { useState, useEffect } from "react";
import { PropertyCard } from "./PropertyCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { houseApi, House, favoritesApi } from "../services/api";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Features } from "./Features";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Home, ArrowLeft, Search, SlidersHorizontal, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useNavigate, Link } from "react-router-dom";
import { Property } from "./PropertyCard";

export function BrowsePage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([] as House[]);
  const [favorites, setFavorites] = useState([] as number[]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const handleFavoriteToggle = async (id: string) => {
    const houseId = parseInt(id);
    try {
      if (favorites.includes(houseId)) {
        await favoritesApi.remove(houseId);
        setFavorites(favorites.filter((fav: number) => fav !== houseId));
        toast.success('Removed from favorites');
      } else {
        await favoritesApi.add(houseId);
        setFavorites([...favorites, houseId]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchFavorites();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await houseApi.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const favoriteHouses = await favoritesApi.getAll();
      // Extract house IDs from the favorite houses
      const favoriteIds = favoriteHouses.map((house: House) => house.id);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // User might not be logged in, that's okay
    }
  };
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Convert House to Property interface
  const convertToPropertyCard = (house: House): Property => {
    // Convert the property_type to the correct enum type
    const propertyType = house.property_type as "Apartment" | "House" | "Studio" | "Condo";
    
    return {
      id: house.id.toString(),
      title: house.property_title,
      location: house.address,
      type: propertyType,
      price: house.monthly_rent,
      image: house.images && house.images.length > 0 ? house.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      images: house.images, // Pass all images for the slider
      bedrooms: house.rooms,
      bathrooms: house.bathrooms,
      squareFeet: house.square_feet,
      description: house.description,
      available: true
    };
  };

  // Filter properties
  const filteredProperties = properties.filter((property: { property_title: string; address: string; property_type: any; rooms: { toString: () => any; }; monthly_rent: number; id: any; }) => {
    const matchesSearch = property.property_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || property.property_type === typeFilter;
    const matchesBedrooms = bedroomFilter === "all" || property.rooms.toString() === bedroomFilter;
    const matchesPrice = property.monthly_rent >= priceRange[0] && property.monthly_rent <= priceRange[1];
    const matchesFavorites = !showFavoritesOnly || favorites.includes(property.id);

    return matchesSearch && matchesType && matchesBedrooms && matchesPrice && matchesFavorites;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link 
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Home className="w-6 h-6 text-primary" />
              <span className="text-2xl text-primary">Brook Rent</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location or property name..."
                value={searchTerm}
                onChange={(e: { target: { value: any; }; }) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Heart className={`h-4 w-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`} />
              Favorites ({favorites.length})
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <Collapsible open={showFilters} onOpenChange={setShowFilters} className="lg:hidden">
            <CollapsibleContent>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Property Type Filter */}
                  <div className="space-y-2">
                    <Label>Property Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Studio">Studio</SelectItem>
                        <SelectItem value="Condo">Condo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bedrooms Filter */}
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4">4+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-2">
                    <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}/mo</Label>
                    <Slider
                      min={0}
                      max={5000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mt-2"
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setTypeFilter("all");
                      setBedroomFilter("all");
                      setPriceRange([0, 5000]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Desktop Filters */}
          <div className="hidden lg:block lg:w-80">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Type Filter */}
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bedrooms Filter */}
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any</SelectItem>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}/mo</Label>
                  <Slider
                    min={0}
                    max={5000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setTypeFilter("all");
                    setBedroomFilter("all");
                    setPriceRange([0, 5000]);
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="mb-4">
              <p className="text-muted-foreground">
                {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} found
              </p>
            </div>
            
            {filteredProperties.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No properties found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("all");
                    setBedroomFilter("all");
                    setPriceRange([0, 5000]);
                    setShowFavoritesOnly(false);
                  }}
                >
                  Clear All Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property: House) => (
                  <PropertyCard
                    key={property.id}
                    property={convertToPropertyCard(property)}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorited={favorites.includes(property.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Features />
    </div>
  );
}
