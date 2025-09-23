import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { statsAPI } from '@/lib/api';
import { PropertyStats } from '@/types/agent';
import { 
  Building2, 
  Eye, 
  MessageSquare, 
  Plus, 
  List,
  TrendingUp,
  Users,
  Star,
  CheckCircle
} from 'lucide-react';

export const Dashboard = () => {
  const { agent } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<PropertyStats>({
    totalProperties: 0,
    activeProperties: 0,
    premiumProperties: 0,
    featuredProperties: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!agent) return;
      
      try {
        setIsLoading(true);
        const propertyStats = await statsAPI.getPropertyStats(agent.id);
        setStats(propertyStats);
      } catch (error) {
        console.error('Failed to fetch property statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [agent]);

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: Building2,
      description: 'Properties in your portfolio',
      color: 'text-primary'
    },
    {
      title: 'Active Properties',
      value: stats.activeProperties,
      icon: TrendingUp,
      description: 'Currently active listings',
      color: 'text-success'
    },
    {
      title: 'Premium Properties',
      value: stats.premiumProperties,
      icon: Star,
      description: 'Premium listed properties',
      color: 'text-warning'
    },
    {
      title: 'Featured Properties',
      value: stats.featuredProperties,
      icon: CheckCircle,
      description: 'Featured property listings',
      color: 'text-secondary'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {agent?.fullName}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your property portfolio
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '-' : stat.value.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Manage your properties and inquiries efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate('/properties/new')}
                className="h-20 flex flex-col space-y-2"
              >
                <Plus className="h-6 w-6" />
                <span>Add New Property</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/properties')}
                className="h-20 flex flex-col space-y-2"
              >
                <List className="h-6 w-6" />
                <span>View My Properties</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/inquiries')}
                className="h-20 flex flex-col space-y-2"
              >
                <MessageSquare className="h-6 w-6" />
                <span>View Inquiries</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest property management activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Property Listed</p>
                  <p className="text-xs text-muted-foreground">
                    Luxury 3BHK Apartment was successfully listed
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <MessageSquare className="h-5 w-5 text-secondary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New Inquiry</p>
                  <p className="text-xs text-muted-foreground">
                    Viewing request for Commercial Office Space
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">5 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Eye className="h-5 w-5 text-warning" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Property Views</p>
                  <p className="text-xs text-muted-foreground">
                    Your properties received 23 new views today
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};