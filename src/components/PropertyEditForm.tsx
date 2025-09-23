import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { propertiesAPI } from '@/lib/api';
import { Property, PropertyDto } from '@/types/agent';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PropertyEditFormProps {
  property: Property;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PropertyEditForm = ({ property, onSuccess, onCancel }: PropertyEditFormProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<PropertyDto>({
    propertyTitle: property.propertyTitle,
    price: property.price,
    propertyType: property.propertyType,
    listingType: property.listingType,
    propertyDescription: property.propertyDescription,
    fullAddress: property.fullAddress,
    locality: property.locality,
    city: property.city,
    state: property.state,
    pincode: property.pincode,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    carpetArea: property.carpetArea || '',
    builtUpArea: property.builtUpArea || '',
    floors: property.floors,
    totalFloors: property.totalFloors,
    propertyAge: property.propertyAge,
    furnishing: property.furnishing,
    amenities: property.amenities,
    parkingAvailable: property.parkingAvailable,
    parkingSpots: property.parkingSpots,
    contactName: property.contactName,
    contactPhone: property.contactPhone,
    contactEmail: property.contactEmail || '',
    youtubeVideoUrl: property.youtubeVideoUrl || '',
    instagramProfile: property.instagramProfile || '',
    listingStatus: property.listingStatus,
    agentId: property.agent.id,
  });
  
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amenitiesList = [
    'swimming_pool', 'gym', 'garden', 'security', 'lift', 'parking',
    'power_backup', 'water_supply', 'wifi', 'clubhouse', 'playground',
    'jogging_track', 'tennis_court', 'basketball_court', 'meditation_center'
  ];

  const handleInputChange = (field: keyof PropertyDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
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
    
    // Validation
    if (!formData.propertyTitle || !formData.price || !formData.fullAddress || 
        !formData.locality || !formData.city || !formData.state || !formData.pincode ||
        !formData.contactName || !formData.contactPhone) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await propertiesAPI.updateProperty(property.id, formData, newImages.length > 0 ? newImages : undefined);
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update property';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
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
              placeholder="Describe property features, location benefits, etc."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location Details</CardTitle>
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
              rows={2}
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
          <CardTitle className="text-lg">Property Specifications</CardTitle>
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
          <CardTitle className="text-lg">Amenities & Parking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.split(',').includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, !!checked)}
                  />
                  <Label htmlFor={amenity} className="text-sm font-normal capitalize">
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
                onCheckedChange={(checked) => handleInputChange('parkingAvailable', !!checked)}
              />
              <Label htmlFor="parkingAvailable">Parking Available</Label>
            </div>
            
            {formData.parkingAvailable && (
              <div className="space-y-2">
                <Label htmlFor="parkingSpots">Number of Parking Spots</Label>
                <Input
                  id="parkingSpots"
                  type="number"
                  min="1"
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
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="youtubeVideoUrl">YouTube Video URL</Label>
              <Input
                id="youtubeVideoUrl"
                value={formData.youtubeVideoUrl}
                onChange={(e) => handleInputChange('youtubeVideoUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagramProfile">Instagram Profile</Label>
              <Input
                id="instagramProfile"
                value={formData.instagramProfile}
                onChange={(e) => handleInputChange('instagramProfile', e.target.value)}
                placeholder="@username"
              />
            </div>
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
        </CardContent>
      </Card>

      {/* Property Images */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Images</CardTitle>
          <CardDescription>Current images and add new ones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Images */}
          {property.propertyImages.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-3 block">Current Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.propertyImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.imageUrl}
                      alt={image.altText}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Add New Images */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Add New Images</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <Label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> new images
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, JPEG (MAX. 5MB each)</p>
                  </div>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Label>
              </div>
              
              {/* Preview New Images */}
              {newImages.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">New Images to Upload:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeNewImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Property'
          )}
        </Button>
      </div>
    </form>
  );
};
