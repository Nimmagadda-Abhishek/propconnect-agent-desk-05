import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { propertiesAPI } from '@/lib/api';
import { Property } from '@/types/agent';
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Calendar, 
  IndianRupee,
  Eye,
  Phone,
  Mail,
  Youtube,
  Instagram,
  Building,
  Maximize,
  Home
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        console.log('PropertyDetails: Fetching property with ID:', id);
        const data = await propertiesAPI.getProperty(Number(id));
        console.log('PropertyDetails: Property data received:', data);
        setProperty(data);
      } catch (error) {
        console.error('PropertyDetails: Error fetching property:', error);
        toast({
          title: 'Error',
          description: 'Failed to load property details',
          variant: 'destructive',
        });
        navigate('/properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate, toast]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'swimming_pool': return '🏊';
      case 'gym': return '💪';
      case 'garden': return '🌿';
      case 'security': return '🔒';
      case 'lift': return '🛗';
      case 'parking': return '🚗';
      case 'power_backup': return '⚡';
      case 'water_supply': return '💧';
      case 'wifi': return '📶';
      case 'clubhouse': return '🏢';
      case 'playground': return '🎪';
      case 'jogging_track': return '🏃';
      case 'tennis_court': return '🎾';
      case 'basketball_court': return '🏀';
      case 'meditation_center': return '🧘';
      default: return '✓';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading property details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Property not found</h2>
          <p className="text-muted-foreground mt-2">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/properties')} className="mt-4">
            Back to Properties
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/properties')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{property.propertyTitle}</h1>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.fullAddress}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => navigate(`/properties/${property.id}/edit`)}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Property</span>
            </Button>
          </div>
        </div>

        {/* Price and Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center text-3xl font-bold text-primary mb-2">
                  <IndianRupee className="h-8 w-8 mr-2" />
                  <span>{formatPrice(property.price)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{property.listingType}</Badge>
                  <Badge variant={property.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {property.status}
                  </Badge>
                  <Badge variant={
                    property.listingStatus === 'PREMIUM' ? 'destructive' : 
                    property.listingStatus === 'FEATURED' ? 'default' : 'secondary'
                  }>
                    {property.listingStatus}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center text-muted-foreground mb-1">
                  <Eye className="h-4 w-4 mr-2" />
                  <span>{property.viewCount} views</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Listed on {new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Images */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
              </CardHeader>
              <CardContent>
                {property.propertyImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.propertyImages.map((image, index) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.imageUrl}
                          alt={image.altText}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {image.isPrimary && (
                          <Badge className="absolute top-2 left-2">Primary</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No images uploaded for this property
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Description */}
            <Card>
              <CardHeader>
                <CardTitle>Property Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {property.propertyDescription || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                {property.amenities ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.split(',').map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                        <span className="text-lg">{getAmenityIcon(amenity.trim())}</span>
                        <span className="text-sm capitalize">{amenity.trim().replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No amenities listed</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Property Details Sidebar */}
          <div className="space-y-6">
            {/* Property Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Property Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Property Type</p>
                      <p className="font-medium">{property.propertyType}</p>
                    </div>
                  </div>
                  
                  {property.bedrooms > 0 && (
                    <div className="flex items-center space-x-2">
                      <Bed className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                        <p className="font-medium">{property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="font-medium">{property.bathrooms}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Maximize className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p className="font-medium">{property.area}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Floor</p>
                      <p className="font-medium">{property.floors} of {property.totalFloors}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Property Age</p>
                      <p className="font-medium">{property.propertyAge} years</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Furnishing</p>
                  <p className="font-medium capitalize">{property.furnishing.replace('_', ' ')}</p>
                </div>
                
                {property.carpetArea && (
                  <div>
                    <p className="text-sm text-muted-foreground">Carpet Area</p>
                    <p className="font-medium">{property.carpetArea}</p>
                  </div>
                )}
                
                {property.builtUpArea && (
                  <div>
                    <p className="text-sm text-muted-foreground">Built-up Area</p>
                    <p className="font-medium">{property.builtUpArea}</p>
                  </div>
                )}
                
                {property.parkingAvailable && (
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Parking</p>
                      <p className="font-medium">{property.parkingSpots} spots available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{property.contactName}</p>
                  <p className="text-sm text-muted-foreground">Property Agent</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{property.contactPhone}</span>
                  </div>
                  
                  {property.contactEmail && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{property.contactEmail}</span>
                    </div>
                  )}
                </div>
                
                {(property.youtubeVideoUrl || property.instagramProfile) && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-2">Social Media</p>
                    <div className="space-y-2">
                      {property.youtubeVideoUrl && (
                        <a 
                          href={property.youtubeVideoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-sm text-primary hover:underline"
                        >
                          <Youtube className="h-4 w-4" />
                          <span>Video Tour</span>
                        </a>
                      )}
                      
                      {property.instagramProfile && (
                        <a 
                          href={property.instagramProfile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-sm text-primary hover:underline"
                        >
                          <Instagram className="h-4 w-4" />
                          <span>Instagram</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Locality</p>
                  <p className="font-medium">{property.locality}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{property.city}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">State</p>
                  <p className="font-medium">{property.state}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pincode</p>
                  <p className="font-medium">{property.pincode}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};