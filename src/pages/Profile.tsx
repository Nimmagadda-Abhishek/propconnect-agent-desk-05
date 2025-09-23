import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';

export const Profile = () => {
  const { agent } = useAuth();

  if (!agent) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Profile not found</h2>
          <p className="text-muted-foreground mt-2">Please log in to view your profile.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your agent profile information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic agent profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{agent.fullName}</h2>
                    <p className="text-muted-foreground">Property Agent</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={agent.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {agent.status}
                      </Badge>
                      <div className="flex items-center space-x-1 text-success">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Verified Agent</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Username</label>
                      <p className="text-foreground font-medium">{agent.username}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-foreground font-medium">{agent.fullName}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Agent ID</label>
                      <p className="text-foreground font-medium">#{agent.id}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                        <p className="text-foreground font-medium">{agent.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                        <p className="text-foreground font-medium">{agent.phoneNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                        <p className="text-foreground font-medium">
                          {new Date(agent.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
                <CardDescription>Recent activity and account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Last Login</p>
                      <p className="text-sm text-muted-foreground">Today at 10:30 AM</p>
                    </div>
                    <Badge variant="outline">Recent</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Profile Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(agent.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge variant="outline">System</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Account Status</p>
                      <p className="text-sm text-muted-foreground">Active and verified agent account</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Your performance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-2xl font-bold text-primary">2</p>
                  <p className="text-sm text-muted-foreground">Properties Listed</p>
                </div>
                
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <p className="text-2xl font-bold text-success">234</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
                
                <div className="text-center p-4 bg-warning/10 rounded-lg">
                  <p className="text-2xl font-bold text-warning">2</p>
                  <p className="text-sm text-muted-foreground">Active Inquiries</p>
                </div>
                
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <p className="text-2xl font-bold text-secondary">100%</p>
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Notifications</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">SMS Alerts</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Public Profile</span>
                    <Badge variant="outline">Visible</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Marketing Emails</span>
                    <Badge variant="secondary">Disabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Get support and assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Support Email:</strong><br />
                    <a href="mailto:support@propconnect.com" className="text-primary hover:underline">
                      support@propconnect.com
                    </a>
                  </p>
                  
                  <p>
                    <strong>Support Phone:</strong><br />
                    <a href="tel:+911234567890" className="text-primary hover:underline">
                      +91-123-456-7890
                    </a>
                  </p>
                  
                  <p>
                    <strong>Business Hours:</strong><br />
                    Monday - Friday: 9:00 AM - 6:00 PM IST
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};