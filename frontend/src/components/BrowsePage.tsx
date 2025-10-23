import { useState, useEffect } from "react";
import { PropertyCard } from "./PropertyCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { houseApi, House } from "../services/api";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Features } from "./Features";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Home, ArrowLeft, Search, SlidersHorizontal, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface BrowsePageProps {
  onBack: () => void;
  favorites: string[];
  onFavoriteToggle: (id: string) => void;
}

import { Property } from "./PropertyCard";

export function BrowsePage({ onBack, favorites, onFavoriteToggle }: BrowsePageProps) {
  const [properties, setProperties] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchProperties();
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
      image: house.image,
      bedrooms: house.rooms,
      bathrooms: house.bathrooms,
      squareFeet: house.square_feet,
      description: house.description,
      available: true
    };
  };

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.property_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "all" || property.address.includes(locationFilter);
    const matchesType = typeFilter === "all" || property.property_type === typeFilter;
    const matchesBedrooms = bedroomFilter === "all" || property.rooms.toString() === bedroomFilter;
    const matchesPrice = property.monthly_rent >= priceRange[0] && property.monthly_rent <= priceRange[1];
    const matchesFavorites = !showFavoritesOnly || favorites.includes(property.id.toString());

    return matchesSearch && matchesLocation && matchesType && matchesBedrooms && matchesPrice && matchesFavorites;
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
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Home className="w-6 h-6 text-primary" />
              <span className="text-2xl text-primary">Brook Rent</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location or property name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  {/* Location Filter */}
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Downtown">Downtown</SelectItem>
                        <SelectItem value="Brooklyn">Brooklyn</SelectItem>
                        <SelectItem value="Queens">Queens</SelectItem>
                        <SelectItem value="Manhattan">Manhattan</SelectItem>
                        <SelectItem value="Suburbs">Suburbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                      setLocationFilter("all");
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
                {/* Location Filter */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Downtown">Downtown</SelectItem>
                      <SelectItem value="Brooklyn">Brooklyn</SelectItem>
                      <SelectItem value="Queens">Queens</SelectItem>
                      <SelectItem value="Manhattan">Manhattan</SelectItem>
                      <SelectItem value="Suburbs">Suburbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                    setLocationFilter("all");
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
                    setLocationFilter("all");
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
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={convertToPropertyCard(property)}
                    onFavoriteToggle={onFavoriteToggle}
                    isFavorited={favorites.includes(property.id.toString())}
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
