import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { inquiriesAPI, propertiesAPI } from '@/lib/api';
import { Inquiry, Property } from '@/types/agent';
import { MessageSquare, User, Phone, Mail, Calendar, ArrowLeft, Loader2, Home } from 'lucide-react';

export const InquiryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { agent } = useAuth();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !agent) return;

      try {
        setLoading(true);
        const inquiriesData = await inquiriesAPI.getInquiries(agent.id);
        const inquiryData = inquiriesData.find(inq => inq.id === parseInt(id));

        if (!inquiryData) {
          setError('Inquiry not found');
          return;
        }

        setInquiry(inquiryData);

        // Fetch full property details
        const propertyData = await propertiesAPI.getProperty(inquiryData.propertyId);
        setProperty(propertyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inquiry details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, agent]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/inquiries')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inquiries
            </Button>
          </div>
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading inquiry details...</span>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error || !inquiry) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/inquiries')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inquiries
            </Button>
          </div>
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-destructive mx-auto mb-6" />
              <h3 className="text-xl font-medium text-foreground mb-4">Error Loading Inquiry</h3>
              <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/inquiries')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inquiries
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inquiry Details</h1>
            <p className="text-muted-foreground">
              Detailed information about this property inquiry
            </p>
          </div>
        </div>

        {/* Inquiry Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Inquiry #{inquiry.id}</span>
              <Badge variant={inquiry.status === 'NEW' ? 'default' : 'secondary'}>
                {inquiry.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              Received on {formatDate(inquiry.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Message */}
            <div>
              <h3 className="text-lg font-medium mb-2">Message</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-foreground whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            </div>

            <Separator />

            {/* User Details */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground">{inquiry.fullName}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </label>
                  <p className="text-foreground">{inquiry.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone
                  </label>
                  <p className="text-foreground">{inquiry.phoneNumber}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Property Details */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Property Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Property Title</label>
                  <p className="text-foreground font-medium">{inquiry.propertyTitle}</p>
                </div>
                {property && (
                  <>
                    {property.propertyImages && property.propertyImages.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Property Images</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {property.propertyImages.map((image) => (
                            <img
                              key={image.id}
                              src={image.imageUrl}
                              alt={image.altText}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Type</label>
                        <p className="text-foreground">{property.propertyType}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Price</label>
                        <p className="text-foreground">₹{property.price.toLocaleString()}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Location</label>
                        <p className="text-foreground">{property.locality}, {property.city}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Area</label>
                        <p className="text-foreground">{property.area} sq ft</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Contact Phone</label>
                        <p className="text-foreground">{property.contactPhone}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                        <p className="text-foreground">{property.contactEmail || 'N/A'}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
