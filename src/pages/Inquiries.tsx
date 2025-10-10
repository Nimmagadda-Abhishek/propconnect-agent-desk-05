import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { inquiriesAPI } from '@/lib/api';
import { Inquiry } from '@/types/agent';
import { MessageSquare, Loader2 } from 'lucide-react';

export const Inquiries = () => {
  const { agent } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!agent) return;

      try {
        setLoading(true);
        const data = await inquiriesAPI.getInquiries(agent.id);
        setInquiries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inquiries');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [agent]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Property Inquiries</h1>
            <p className="text-muted-foreground">
              View and manage inquiries for your properties
            </p>
          </div>
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading inquiries...</span>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Property Inquiries</h1>
            <p className="text-muted-foreground">
              View and manage inquiries for your properties
            </p>
          </div>
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-destructive mx-auto mb-6" />
              <h3 className="text-xl font-medium text-foreground mb-4">Error Loading Inquiries</h3>
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Property Inquiries</h1>
          <p className="text-muted-foreground">
            View and manage inquiries for your properties
          </p>
        </div>

        {/* Inquiries Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Inquiries ({inquiries.length})</span>
            </CardTitle>
            <CardDescription>
              All inquiries received for your properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inquiries.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-medium text-foreground mb-4">No Inquiries Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  When potential buyers contact you about your properties, their inquiries will appear here.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>User Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/inquiries/${inquiry.id}`)}>
                      <TableCell className="font-medium">
                        {inquiry.propertyTitle}
                      </TableCell>
                      <TableCell>{inquiry.userName}</TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell>{inquiry.phone}</TableCell>
                      <TableCell>{inquiry.message}</TableCell>
                      <TableCell>
                        <Badge variant={inquiry.status === 'NEW' ? 'default' : 'secondary'}>
                          {inquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
