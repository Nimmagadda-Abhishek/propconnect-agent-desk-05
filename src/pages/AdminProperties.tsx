import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Layout } from '@/components/layout/Layout';
import { adminAPI } from '@/lib/api';
import { Property } from '@/types/agent';
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Loader2,
  MapPin,
  IndianRupee,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PropertyEditForm } from '@/components/PropertyEditForm';

export const AdminProperties = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase())
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

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const data = await adminAPI.getAllProperties();
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

  const handleEditClick = async (propertyId: number) => {
    try {
      console.log('Edit button clicked for property ID:', propertyId);
      setIsLoadingProperty(true);
      setIsEditDialogOpen(true);
      
      console.log('About to call adminAPI.getProperty...');
      const property = await adminAPI.getProperty(propertyId);
      console.log('Property loaded successfully:', property);
      setSelectedProperty(property);
    } catch (error) {
      console.error('Error loading property:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load property details',
        variant: 'destructive',
      });
      setIsEditDialogOpen(false);
    } finally {
      setIsLoadingProperty(false);
    }
  };

  const handleDeleteClick = async (propertyId: number) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await adminAPI.deleteProperty(propertyId);
      toast({
        title: 'Success',
        description: 'Property deleted successfully',
      });
      fetchProperties();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive',
      });
    }
  };

  const handlePropertyUpdate = () => {
    setIsEditDialogOpen(false);
    setSelectedProperty(null);
    fetchProperties();
    toast({
      title: 'Success',
      description: 'Property updated successfully',
    });
  };

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
            <h1 className="text-3xl font-bold text-foreground">Admin - Properties Management</h1>
            <p className="text-muted-foreground">
              Manage all property listings across the platform
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Total Properties: {properties.length}
          </div>
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
                    placeholder="Search by title, locality, or city..."
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

        {/* Properties Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Listed</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-foreground mb-2">No properties found</h3>
                          <p className="text-muted-foreground">
                            {properties.length === 0 
                              ? "No properties available in the system" 
                              : "Try adjusting your search filters"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProperties.map((property) => (
                      <TableRow key={property.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={property.propertyImages[0]?.imageUrl || '/placeholder.svg'}
                              alt={property.propertyTitle}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium line-clamp-1">{property.propertyTitle}</p>
                              <p className="text-sm text-muted-foreground">
                                {property.bedrooms}BR • {property.bathrooms}BA • {property.area}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="line-clamp-1">{property.locality}, {property.city}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center font-medium">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            {formatPrice(property.price)}
                          </div>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {property.listingType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-xs">
                              {property.propertyType}
                            </Badge>
                            <Badge 
                              variant={getListingStatusBadgeVariant(property.listingStatus)}
                              className="text-xs block w-fit"
                            >
                              {property.listingStatus}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{property.agent.fullName}</p>
                            <p className="text-xs text-muted-foreground">{property.agent.phoneNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(property.status)}>
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(property.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                            {property.viewCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/properties/${property.id}`, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleEditClick(property.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteClick(property.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Property Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
            </DialogHeader>
            {isLoadingProperty ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="ml-2">Loading property details...</p>
              </div>
            ) : selectedProperty ? (
              <PropertyEditForm 
                property={selectedProperty} 
                onSuccess={handlePropertyUpdate}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};