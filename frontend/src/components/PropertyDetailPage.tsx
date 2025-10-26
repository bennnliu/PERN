import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { House, houseApi, favoritesApi, authApi } from "../services/api";
import { toast } from "sonner";
import { ArrowLeft, Home, Heart, MapPin, Bed, Bath, Maximize, Mail, Phone, User, ChevronLeft, ChevronRight } from "lucide-react";

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const user = authApi.getUser();

  useEffect(() => {
    if (id) {
      fetchProperty(parseInt(id));
      checkFavorite(parseInt(id));
    }
  }, [id]);

  const fetchProperty = async (propertyId: number) => {
    try {
      const data = await houseApi.getOne(propertyId);
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async (propertyId: number) => {
    if (!user) return;
    try {
      const isFavorite = await favoritesApi.check(propertyId);
      setIsFavorite(isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      navigate('/login');
      return;
    }

    if (!property) return;

    try {
      if (isFavorite) {
        await favoritesApi.remove(property.id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await favoritesApi.add(property.id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">Property not found</p>
            <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const images = property.images || [];
  const currentImage = images[currentImageIndex] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/browse')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Home className="w-6 h-6 text-primary" />
              <span className="text-2xl text-primary">Brook Rent</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content - Takes up 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-4 flex justify-center">
                <div className="relative w-full max-w-md max-h-80 bg-gray-100 rounded-lg">
                  <img
                    src={currentImage}
                    alt={property.property_title}
                    className="w-full h-full max-h-80 object-contain transition-opacity duration-300"
                  />
                  {images.length > 1 && (
                    <>
                      {/* Navigation Arrows - Same style as browse page */}
                      <button
                        onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      
                      {/* Dot Indicators */}
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
                      
                      {/* Image Counter */}
                      <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-xs font-medium">
                        {currentImageIndex + 1}/{images.length}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{property.property_title}</CardTitle>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span>{property.address}</span>
                    </div>
                  </div>
                  <Button
                    variant={isFavorite ? "default" : "outline"}
                    size="icon"
                    onClick={handleFavoriteToggle}
                    className="flex-shrink-0"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    ${property.monthly_rent}<span className="text-xl font-normal">/month</span>
                  </div>
                  <div className="flex flex-wrap gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      <span>{property.rooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize className="w-5 h-5" />
                      <span>{property.square_feet} sqft</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">About This Property</h3>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Property Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Type</span>
                      <p className="font-medium">{property.property_type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Listed</span>
                      <p className="font-medium">{new Date(property.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Card - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24 h-fit">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {property.contact_name && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium text-lg">{property.contact_name}</p>
                    </div>
                  </div>
                )}
                {property.contact_email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${property.contact_email}`}
                        className="font-medium text-lg text-primary hover:underline break-all"
                      >
                        {property.contact_email}
                      </a>
                    </div>
                  </div>
                )}
                {property.contact_phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${property.contact_phone}`}
                        className="font-medium text-lg text-primary hover:underline"
                      >
                        {property.contact_phone}
                      </a>
                    </div>
                  </div>
                )}
                <Button className="w-full mt-6" size="lg">
                  <Mail className="w-4 h-4 mr-2" /> Contact Lister
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
