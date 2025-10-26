import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Home, User, Building2, Heart, LogOut, PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import { authApi, houseApi, House } from "../services/api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);

  useEffect(() => {
    setUser(authApi.getUser());
    fetchUserListings();
  }, []);

  const fetchUserListings = async () => {
    try {
      const data = await houseApi.getUserListings();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedListingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedListingId) return;
    
    try {
      await houseApi.delete(selectedListingId);
      setListings(listings.filter(listing => listing.id !== selectedListingId));
      toast.success('Listing deleted successfully');
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedListingId(null);
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Brook Rent</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span className="font-medium">{user?.email}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Welcome back!</h2>
          <p className="text-muted-foreground">
            {user?.user_type === 'lister' 
              ? 'Manage your property listings and track inquiries.' 
              : 'Browse available properties and manage your favorites.'}
          </p>
        </div>

        {user?.user_type === 'lister' ? (
          // Lister Dashboard
          <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{listings.length}</div>
                <CardDescription>Properties you've listed</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Lister</div>
                <CardDescription>Property Lister</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Active</div>
                <CardDescription>Your account is in good standing</CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* User's Listings Section for Listers */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Your Listings</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">You haven't listed any properties yet</p>
                  <Button onClick={() => navigate('/add-property')}>
                    <PlusCircle className="w-4 h-4 mr-2" /> List Your First Property
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Card 
                    key={listing.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/property/${listing.id}`)}
                  >
                    {/* Property Image */}
                    {listing.images && listing.images.length > 0 && (
                      <div className="relative h-48">
                        <img
                          src={listing.images[0]}
                          alt={listing.property_title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="text-lg">{listing.property_title}</CardTitle>
                      <CardDescription>{listing.address}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-primary">${listing.monthly_rent}/mo</p>
                        <p className="text-sm text-muted-foreground">
                          {listing.rooms} bed • {listing.bathrooms} bath • {listing.square_feet} sqft
                        </p>
                        <p className="text-sm">{listing.description.slice(0, 100)}...</p>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              navigate(`/edit-property/${listing.id}`);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="flex-1"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              handleDeleteClick(listing.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions for Listers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={() => navigate('/add-property')} className="w-full flex items-center justify-center gap-2">
              <PlusCircle /> List a New Property
            </Button>
            <Button onClick={() => navigate('/browse')} variant="outline" className="w-full flex items-center justify-center gap-2">
              <Search /> Browse All Properties
            </Button>
          </div>
        </>
        ) : (
          // Renter Dashboard
          <>
            <Card className="mb-8">
              <CardContent className="py-8 text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Find Your Perfect Home</h3>
                <p className="text-muted-foreground mb-6">
                  Browse available properties and save your favorites
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate('/browse')} size="lg">
                    <Search className="w-4 h-4 mr-2" /> Browse Properties
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Renter Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Account Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">Renter</div>
                  <CardDescription>Property Seeker</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <CardDescription>Your account is in good standing</CardDescription>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your property listing
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
