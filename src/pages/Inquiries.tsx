import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { MessageSquare, Mail, Phone } from 'lucide-react';

export const Inquiries = () => {
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

        {/* Placeholder Message */}
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-medium text-foreground mb-4">Inquiries Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              The inquiry management system is currently being set up. Contact the admin to view inquiries for your properties.
            </p>
            
            <div className="bg-muted p-4 rounded-lg max-w-md mx-auto">
              <h4 className="font-medium text-foreground mb-2">For Inquiry Access:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email: admin@propconnect.com</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone: +91-1234567890</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};