import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { propertiesAPI } from '@/lib/api';
import { PropertyDto, PropertyImage } from '@/types/agent';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PropertyForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { agent } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<PropertyDto>({
    propertyTitle: '',
    price: 0,
    propertyType: 'RESIDENTIAL',
    listingType: 'SALE',
    propertyDescription: '',
    fullAddress: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    bedrooms: 0,
    bathrooms: 0,
    area: '',
    carpetArea: '',
    builtUpArea: '',
    floors: 0,
    totalFloors: 0,
    propertyAge: 0,
    furnishing: 'UNFURNISHED',
    amenities: '',
    parkingAvailable: false,
    parkingSpots: 0,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    youtubeVideoUrl: '',
    instagramProfile: '',
    listingStatus: 'RECENT',
    agentId: 0,
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(isEdit);

  const amenitiesList = [
    'swimming_pool', 'gym', 'garden', 'security', 'lift', 'parking',
    'power_backup', 'water_supply', 'wifi', 'clubhouse', 'playground',
    'jogging_track', 'tennis_court', 'basketball_court', 'meditation_center'
  ];

  useEffect(() => {
    if (agent) {
      console.log('PropertyForm: Setting agent data:', agent);
      setFormData(prev => ({
        ...prev,
        agentId: agent.id,
        contactName: agent.fullName,
        contactPhone: agent.phoneNumber,
        contactEmail: agent.email,
      }));
    } else {
      console.log('PropertyForm: Agent is undefined');
    }
  }, [agent]);

  useEffect(() => {
    if (isEdit && id) {
      const fetchProperty = async () => {
        try {
          console.log('PropertyForm: Fetching property for edit, ID:', id);
          const property = await propertiesAPI.getProperty(Number(id));
          console.log('PropertyForm: Property loaded successfully:', property);
          setFormData({
            propertyTitle: property.propertyTitle || '',
            price: property.price || 0,
            propertyType: property.propertyType || 'RESIDENTIAL',
            listingType: property.listingType || 'SALE',
            propertyDescription: property.propertyDescription || '',
            fullAddress: property.fullAddress || '',
            locality: property.locality || '',
            city: property.city || '',
            state: property.state || '',
            pincode: property.pincode || '',
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 0,
            area: property.area || '',
            carpetArea: property.carpetArea || '',
            builtUpArea: property.builtUpArea || '',
            floors: property.floors || 0,
            totalFloors: property.totalFloors || 0,
            propertyAge: property.propertyAge || 0,
            furnishing: property.furnishing || 'UNFURNISHED',
            amenities: property.amenities || '',
            parkingAvailable: property.parkingAvailable || false,
            parkingSpots: property.parkingSpots || 0,
            contactName: property.contactName || '',
            contactPhone: property.contactPhone || '',
            contactEmail: property.contactEmail || '',
            youtubeVideoUrl: property.youtubeVideoUrl || '',
            instagramProfile: property.instagramProfile || '',
            listingStatus: property.listingStatus || 'RECENT',
            agentId: property.agent?.id || 0,
          });
          setExistingImages(property.propertyImages || []);
        } catch (error) {
          console.error('PropertyForm: Error loading property for edit:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to load property details',
            variant: 'destructive',
          });
          navigate('/properties');
        } finally {
          setIsInitialLoading(false);
        }
      };

      fetchProperty();
    }
  }, [isEdit, id, navigate, toast]);

  const handleInputChange = (field: keyof PropertyDto, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: number) => {
    setImagesToRemove(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = formData.amenities ? formData.amenities.split(',') : [];
    let updatedAmenities;
    
    if (checked) {
      updatedAmenities = [...currentAmenities, amenity];
    } else {
      updatedAmenities = currentAmenities.filter(a => a !== amenity);
    }
    
    handleInputChange('amenities', updatedAmenities.join(','));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEdit && id) {
        await propertiesAPI.updateProperty(Number(id), formData, images, imagesToRemove);
        toast({
          title: 'Success',
          description: 'Property updated successfully',
        });
      } else {
        await propertiesAPI.createProperty(formData, images);
        toast({
          title: 'Success',
          description: 'Property created successfully',
        });
      }
      navigate('/properties');
    } catch (error) {
      toast({
        title: 'Error',
        description: isEdit ? 'Failed to update property' : 'Failed to create property',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/properties')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEdit ? 'Edit Property' : 'Add New Property'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Update your property details' : 'Create a new property listing'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Property details and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyTitle">Property Title *</Label>
                  <Input
                    id="propertyTitle"
                    value={formData.propertyTitle}
                    onChange={(e) => handleInputChange('propertyTitle', e.target.value)}
                    placeholder="e.g., Luxury 3BHK Apartment"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    placeholder="e.g., 5500000"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select 
                    value={formData.propertyType} 
                    onValueChange={(value) => handleInputChange('propertyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                      <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                      <SelectItem value="NEW_DEVELOPMENT">New Development</SelectItem>
                      <SelectItem value="AGRICULTURE">Agriculture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="listingType">Listing Type *</Label>
                  <Select 
                    value={formData.listingType} 
                    onValueChange={(value) => handleInputChange('listingType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SALE">Sale</SelectItem>
                      <SelectItem value="RESALE">Resale</SelectItem>
                      <SelectItem value="RENT">Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="propertyDescription">Property Description</Label>
                <Textarea
                  id="propertyDescription"
                  value={formData.propertyDescription}
                  onChange={(e) => handleInputChange('propertyDescription', e.target.value)}
                  placeholder="Describe your property features, location benefits, etc."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>Property address and location information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullAddress">Full Address *</Label>
                <Textarea
                  id="fullAddress"
                  value={formData.fullAddress}
                  onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                  placeholder="Complete address with building name, street, area"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="locality">Locality *</Label>
                  <Input
                    id="locality"
                    value={formData.locality}
                    onChange={(e) => handleInputChange('locality', e.target.value)}
                    placeholder="e.g., Banjara Hills"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="e.g., Hyderabad"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="e.g., Telangana"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="e.g., 500034"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Property Specifications</CardTitle>
              <CardDescription>Detailed property specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="floors">Floor</Label>
                  <Input
                    id="floors"
                    type="number"
                    min="0"
                    value={formData.floors}
                    onChange={(e) => handleInputChange('floors', Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="totalFloors">Total Floors</Label>
                  <Input
                    id="totalFloors"
                    type="number"
                    min="0"
                    value={formData.totalFloors}
                    onChange={(e) => handleInputChange('totalFloors', Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    placeholder="e.g., 1450 sq.ft"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carpetArea">Carpet Area</Label>
                  <Input
                    id="carpetArea"
                    value={formData.carpetArea}
                    onChange={(e) => handleInputChange('carpetArea', e.target.value)}
                    placeholder="e.g., 1200 sq.ft"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="builtUpArea">Built-up Area</Label>
                  <Input
                    id="builtUpArea"
                    value={formData.builtUpArea}
                    onChange={(e) => handleInputChange('builtUpArea', e.target.value)}
                    placeholder="e.g., 1350 sq.ft"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyAge">Property Age (Years)</Label>
                  <Input
                    id="propertyAge"
                    type="number"
                    min="0"
                    value={formData.propertyAge}
                    onChange={(e) => handleInputChange('propertyAge', Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="furnishing">Furnishing</Label>
                  <Select 
                    value={formData.furnishing} 
                    onValueChange={(value) => handleInputChange('furnishing', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULLY_FURNISHED">Fully Furnished</SelectItem>
                      <SelectItem value="SEMI_FURNISHED">Semi Furnished</SelectItem>
                      <SelectItem value="UNFURNISHED">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities & Parking */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities & Parking</CardTitle>
              <CardDescription>Select available amenities and parking details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.split(',').includes(amenity)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                      />
                      <Label htmlFor={amenity} className="text-sm capitalize">
                        {amenity.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parkingAvailable"
                    checked={formData.parkingAvailable}
                    onCheckedChange={(checked) => handleInputChange('parkingAvailable', checked)}
                  />
                  <Label htmlFor="parkingAvailable">Parking Available</Label>
                </div>
                
                {formData.parkingAvailable && (
                  <div className="space-y-2">
                    <Label htmlFor="parkingSpots">Number of Parking Spots</Label>
                    <Input
                      id="parkingSpots"
                      type="number"
                      min="0"
                      value={formData.parkingSpots}
                      onChange={(e) => handleInputChange('parkingSpots', Number(e.target.value))}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Contact details for inquiries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone *</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="listingStatus">Listing Status</Label>
                  <Select 
                    value={formData.listingStatus} 
                    onValueChange={(value) => handleInputChange('listingStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                      <SelectItem value="FEATURED">Featured</SelectItem>
                      <SelectItem value="RECENT">Recent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="youtubeVideoUrl">YouTube Video URL</Label>
                  <Input
                    id="youtubeVideoUrl"
                    value={formData.youtubeVideoUrl}
                    onChange={(e) => handleInputChange('youtubeVideoUrl', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagramProfile">Instagram Profile</Label>
                  <Input
                    id="instagramProfile"
                    value={formData.instagramProfile}
                    onChange={(e) => handleInputChange('instagramProfile', e.target.value)}
                    placeholder="https://instagram.com/profile"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
              <CardDescription>Upload high-quality images of your property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="images" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload images or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, JPEG up to 10MB each
                    </p>
                  </div>
                </Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Existing Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.imageUrl}
                          alt={`Property ${image.id}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeExistingImage(image.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {images.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">New Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/properties')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isEdit ? 'Update Property' : 'Create Property'}</span>
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};