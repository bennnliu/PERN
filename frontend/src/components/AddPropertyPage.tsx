import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { houseApi } from "../services/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ArrowLeft, Home, Upload } from "lucide-react";
import { Property } from "./PropertyCard";
import { Features } from "./Features";

interface AddPropertyPageProps {
  onBack: () => void;
  onAddProperty: (property: Omit<Property, "id">) => void;
}

export function AddPropertyPage({ onBack, onAddProperty }: AddPropertyPageProps) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    type: "" as Property["type"] | "",
    description: "",
    image: "",
  });

  const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type) return;

    try {
      const houseData = {
        property_title: formData.title,
        address: formData.location,
        monthly_rent: Number(formData.price),
        rooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        square_feet: Number(formData.squareFeet),
        property_type: formData.type,
        description: formData.description,
        image: formData.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc1OTk4MDE2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      };

      const newHouse = await houseApi.create(houseData);
      
      // Convert the API response to the Property type for the UI
      const newProperty: Omit<Property, "id"> = {
        title: newHouse.property_title,
        location: newHouse.address,
        price: newHouse.monthly_rent,
        bedrooms: newHouse.rooms,
        bathrooms: newHouse.bathrooms,
        squareFeet: newHouse.square_feet,
        type: formData.type,
        description: newHouse.description,
        image: newHouse.image,
        available: true,
      };

      onAddProperty(newProperty);
      setSubmitted(true);
      toast.success("Property listed successfully!");

      // Reset form after delay
      setTimeout(() => {
        setFormData({
          title: "",
          location: "",
          price: "",
          bedrooms: "",
          bathrooms: "",
          squareFeet: "",
          type: "",
          description: "",
          image: "",
        });
        setSubmitted(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Failed to create property listing. Please try again.");
    }
  };

  const isFormValid = 
    formData.title &&
    formData.location &&
    formData.price &&
    formData.bedrooms &&
    formData.bathrooms &&
    formData.squareFeet &&
    formData.type &&
    formData.description;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
            <div>
              <h1>List Your Property</h1>
              <p className="text-muted-foreground text-sm">Fill out the details below to list your property</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {submitted ? (
          <Card className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Home className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="mb-2">Property Listed Successfully!</h2>
            <p className="text-muted-foreground mb-6">Your property has been added to the marketplace.</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={onBack}>Back to Dashboard</Button>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                List Another Property
              </Button>
            </div>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Provide accurate information about your property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Modern 2BR Apartment in Downtown"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Downtown Brooklyn, NY"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                {/* Property Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: "Apartment" | "House" | "Studio" | "Condo") => 
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Monthly Rent ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="2500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                {/* Bedrooms, Bathrooms, Square Feet */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="2"
                      min="0"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      placeholder="2"
                      min="0"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="squareFeet">Square Feet *</Label>
                    <Input
                      id="squareFeet"
                      type="number"
                      placeholder="1200"
                      min="0"
                      value={formData.squareFeet}
                      onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, amenities, neighborhood, and what makes it special..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                    <Button type="button" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add a URL to your property image or upload a photo
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex gap-4">
                    <Button type="submit" disabled={!isFormValid} className="flex-1">
                      List Property
                    </Button>
                    <Button type="button" variant="outline" onClick={onBack}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
}
