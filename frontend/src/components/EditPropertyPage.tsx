import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { houseApi, authApi, House } from "../services/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ArrowLeft, Home, Upload, X } from "lucide-react";
import imageCompression from "browser-image-compression";
import { useNavigate, useParams, Link } from "react-router-dom";

export function EditPropertyPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = authApi.getUser();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    type: "" as "House" | "Apartment" | "Condo" | "",
    description: "",
    images: [] as string[],
  });
  const [imageInput, setImageInput] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        toast.error("Property ID not found");
        navigate("/dashboard");
        return;
      }

      try {
        const property = await houseApi.getOne(parseInt(id));
        
        // Check if user owns this property
        if (property.user_id !== user?.id) {
          toast.error("You don't have permission to edit this property");
          navigate("/dashboard");
          return;
        }

        setFormData({
          title: property.property_title,
          location: property.address,
          price: property.monthly_rent.toString(),
          bedrooms: property.rooms.toString(),
          bathrooms: property.bathrooms.toString(),
          squareFeet: property.square_feet.toString(),
          type: property.property_type as "House" | "Apartment" | "Condo",
          description: property.description,
          images: property.images || [],
        });
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property details');
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    if (formData.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    try {
      const propertyData = {
        property_title: formData.title,
        address: formData.location,
        monthly_rent: parseFloat(formData.price),
        rooms: parseInt(formData.bedrooms, 10),
        bathrooms: parseInt(formData.bathrooms, 10),
        square_feet: parseInt(formData.squareFeet, 10),
        property_type: formData.type,
        description: formData.description,
        images: formData.images,
        contact_name: user?.email || "",
        contact_email: user?.email || "",
        contact_phone: user?.phone_number || "",
      };

      await houseApi.update(parseInt(id), propertyData);
      toast.success('Property updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating property:', error);
      toast.error(error.response?.data?.error || 'Failed to update property');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Brook Rent</h1>
          </Link>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Property Listing</CardTitle>
            <CardDescription>Update your property details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Property Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Modern Downtown Apartment"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Address *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., 123 Main St, Brooklyn, NY"
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Monthly Rent ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 2500"
                  required
                />
              </div>

              {/* Bedrooms, Bathrooms, Square Feet */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    placeholder="2"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    placeholder="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="squareFeet">Sq. Ft. *</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.squareFeet}
                    onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                    placeholder="1000"
                    required
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Property Type *</Label>
                <Select
                                  value={formData.type}
                                  onValueChange={(value: "House" | "Apartment" | "Condo") => setFormData({ ...formData, type: value })}
                                  required
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select property type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="House">House</SelectItem>
                                    <SelectItem value="Apartment">Apartment</SelectItem>
                                    <SelectItem value="Condo">Condo</SelectItem>
                                  </SelectContent>
                                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your property..."
                  rows={4}
                  required
                />
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>Property Images * (Up to 5)</Label>
                <p className="text-sm text-muted-foreground">Add images via URL or upload from device</p>
                
                {/* URL Input */}
                <div className="flex gap-2">
                  <Input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Paste image URL"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImage();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddImage} 
                    variant="outline"
                    disabled={!imageInput.trim() || formData.images.length >= 5}
                  >
                    <Upload className="w-4 h-4 mr-2" /> Add URL
                  </Button>
                </div>

                {/* File Upload */}
                <div className="flex gap-2">
                  <Input
                    id="fileUploadEdit"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={formData.images.length >= 5}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    onClick={() => document.getElementById('fileUploadEdit')?.click()}
                    disabled={formData.images.length >= 5}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Upload from Device
                  </Button>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Property ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.images.length} of 5 images added
                </p>
              </div>

              {/* Contact Information Notice */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Contact Information:</strong> Your email and phone number from your profile will be displayed to interested renters.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Update Property
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
