import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { propertiesAPI } from '@/lib/api';
import { Property } from '@/types/agent';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  MapPin, 
  Bed, 
  Bath,
  Car,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Properties = () => {
  const { agent } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    const fetchProperties = async () => {
      if (!agent) return;
      
      try {
        const data = await propertiesAPI.getMyProperties(agent.id);
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch properties',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [agent, toast]);

  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(property => property.propertyType === typeFilter);
    }

    setFilteredProperties(filtered);
  }, [searchTerm, statusFilter, typeFilter, properties]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'INACTIVE': return 'secondary';
      default: return 'outline';
    }
  };

  const getListingStatusBadgeVariant = (listingStatus: string) => {
    switch (listingStatus) {
      case 'PREMIUM': return 'destructive';
      case 'FEATURED': return 'default';
      case 'RECENT': return 'secondary';
      default: return 'outline';
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading properties...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Properties</h1>
            <p className="text-muted-foreground">
              Manage your property listings
            </p>
          </div>
          <Button onClick={() => navigate('/properties/new')} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add New Property</span>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by property title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                    <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                    <SelectItem value="NEW_DEVELOPMENT">New Development</SelectItem>
                    <SelectItem value="AGRICULTURE">Agriculture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-foreground mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-4">
                  {properties.length === 0 
                    ? "Start by adding your first property listing" 
                    : "Try adjusting your search filters"}
                </p>
                <Button onClick={() => navigate('/properties/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Property
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={property.propertyImages[0]?.imageUrl || '/placeholder.svg'}
                    alt={property.propertyImages[0]?.altText || property.propertyTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    <Badge variant={getStatusBadgeVariant(property.status)}>
                      {property.status}
                    </Badge>
                    <Badge variant={getListingStatusBadgeVariant(property.listingStatus)}>
                      {property.listingStatus}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {property.propertyTitle}
                      </h3>
                      <div className="flex items-center text-muted-foreground text-sm mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="line-clamp-1">{property.locality}, {property.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-lg font-bold text-primary">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      <span>{formatPrice(property.price)}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {property.listingType}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        {property.bedrooms > 0 && (
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.bedrooms}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                        {property.parkingAvailable && (
                          <div className="flex items-center">
                            <Car className="h-4 w-4 mr-1" />
                            <span>{property.parkingSpots}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{property.viewCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Listed on {new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/properties/${property.id}/edit`)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};