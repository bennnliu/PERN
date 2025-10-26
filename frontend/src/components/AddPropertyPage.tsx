import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { houseApi, authApi } from "../services/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ArrowLeft, Home, Upload } from "lucide-react";
import imageCompression from "browser-image-compression";
import { Property } from "./PropertyCard";
import { Features } from "./Features";
import { useNavigate, Link } from "react-router-dom";

export function AddPropertyPage() {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    type: "" as Property["type"] | "",
    description: "",
    images: [] as string[],
  });
  const [imageInput, setImageInput] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const handleAddImage = () => {
    if (imageInput.trim() && formData.images.length < 5) {
      setFormData({ ...formData, images: [...formData.images, imageInput.trim()] });
      setImageInput("");
      toast.success('Image added');
    } else if (formData.images.length >= 5) {
      toast.error('Maximum 5 images allowed');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 5 - formData.images.length;
    if (remainingSlots === 0) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    
    // Compression options
    const options = {
      maxSizeMB: 0.5,          // Compress to max 500KB
      maxWidthOrHeight: 1920,  // Max dimension
      useWebWorker: true,       // Use web worker for better performance
      fileType: 'image/jpeg'    // Convert to JPEG for better compression
    };

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      try {
        // Show compression progress
        toast.loading(`Compressing ${file.name}...`);
        
        // Compress the image
        const compressedFile = await imageCompression(file, options);
        
        const originalSizeKB = (file.size / 1024).toFixed(0);
        const compressedSizeKB = (compressedFile.size / 1024).toFixed(0);
        
        // Convert compressed file to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, base64String]
          }));
          toast.dismiss();
          toast.success(`${file.name} added (${originalSizeKB}KB → ${compressedSizeKB}KB)`);
        };
        reader.onerror = () => {
          toast.dismiss();
          toast.error(`Failed to read ${file.name}`);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        toast.dismiss();
        console.error('Compression error:', error);
        toast.error(`Failed to compress ${file.name}`);
      }
    }

    // Reset input
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
    toast.success('Image removed');
  };

    const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!formData.type) return;

    if (formData.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    try {
      const houseData = {
        property_title: formData.title,
        address: formData.location,
        monthly_rent: parseFloat(formData.price),
        rooms: parseInt(formData.bedrooms, 10),
        bathrooms: parseInt(formData.bathrooms, 10),
        square_feet: parseInt(formData.squareFeet, 10),
        property_type: formData.type,
        description: formData.description,
        images: formData.images,
        contact_name: user?.email || '',
        contact_email: user?.email || '',
        contact_phone: user?.phone_number || '',
      };

      await houseApi.create(houseData);
      setSubmitted(true);
      toast.success("Property listed successfully!");
      
      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
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
    formData.description &&
    formData.images.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
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
              <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
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
                    step="0.01"
                    min="0"
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
                      step="1"
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
                      step="1"
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

                {/* Image URLs */}
                <div className="space-y-2">
                  <Label htmlFor="image">Property Images *</Label>
                  <p className="text-sm text-muted-foreground">Add up to 5 images (URL or upload from device)</p>
                  
                  {/* URL Input */}
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddImage}
                      disabled={!imageInput.trim() || formData.images.length >= 5}
                      variant="outline"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Add URL
                    </Button>
                  </div>

                  {/* File Upload */}
                  <div className="flex gap-2">
                    <Input
                      id="fileUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      disabled={formData.images.length >= 5}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      onClick={() => document.getElementById('fileUpload')?.click()}
                      disabled={formData.images.length >= 5}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Upload from Device
                    </Button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <img src={img} alt={`Property ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                          <span className="flex-1 text-sm truncate">{img.substring(0, 50)}...</span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveImage(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex gap-4">
                    <Button type="submit" disabled={!isFormValid} className="flex-1">
                      List Property
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
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
