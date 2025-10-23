import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";

export type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  type: "Apartment" | "House" | "Studio" | "Condo";
  image: string;
  description: string;
  available: boolean;
};

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (id: string) => void;
  isFavorited?: boolean;
  onViewDetails?: (id: string) => void;
}

export function PropertyCard({ 
  property, 
  onFavoriteToggle, 
  isFavorited = false,
  onViewDetails 
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <ImageWithFallback
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        {onFavoriteToggle && (
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 bg-white/90 hover:bg-white ${
              isFavorited ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(property.id);
            }}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        )}
        <Badge className="absolute bottom-2 left-2 bg-white text-foreground">
          {property.type}
        </Badge>
        {!property.available && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            Rented
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3>{property.title}</h3>
          <p className="text-primary">${property.price.toLocaleString()}/mo</p>
        </div>
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground mb-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.squareFeet} sqft</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {property.description}
        </p>
        {onViewDetails && (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => onViewDetails(property.id)}
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
