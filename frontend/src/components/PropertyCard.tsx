import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Bed, Bath, Square, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
  images?: string[]; // Optional array of all images
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
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Use images array if available, otherwise fallback to single image
  const images = property.images && property.images.length > 0 
    ? property.images 
    : [property.image];
  const hasMultipleImages = images.length > 1;

  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <ImageWithFallback
          src={images[currentImageIndex]}
          alt={property.title}
          className="w-full h-48 object-cover transition-opacity duration-300"
        />
        {onFavoriteToggle && (
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 bg-white/90 hover:bg-white ${
              isFavorited ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onFavoriteToggle(property.id);
            }}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        )}
        
        {/* Image Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            {/* Image Counter */}
            <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-xs font-medium">
              {currentImageIndex + 1}/{images.length}
            </div>
            
            {/* Image Dots Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-4'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
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
      </CardContent>
    </Card>
  );
}
