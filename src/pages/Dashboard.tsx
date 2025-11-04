import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { statsAPI } from '@/lib/api';
import { PropertyStats, DashboardStats, PropertiesChartData, PropertiesSummary, PerformanceData } from '@/types/agent';
import {
  Building2,
  Eye,
  MessageSquare,
  Plus,
  List,
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  PieChart,
  BarChart3
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const Dashboard = () => {
  const { agent } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<PropertyStats>({
    totalProperties: 0,
    activeProperties: 0,
    premiumProperties: 0,
    featuredProperties: 0
  });
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeProperties: 0,
    inactiveProperties: 0,
    featuredProperties: 0,
    rentedProperties: 0,
    totalProperties: 0,
    underReviewProperties: 0,
    premiumProperties: 0,
    newInquiries: 0,
    totalInquiries: 0,
    soldProperties: 0
  });
  const [propertiesSummary, setPropertiesSummary] = useState<PropertiesSummary>({
    totalProperties: 0,
    statusBreakdown: {}
  });
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    totalProperties: 0,
    totalInquiries: 0,
    averageDaysToSell: '0',
    conversionRate: '0%',
    soldProperties: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<PropertiesChartData[]>([]);
  const [chartPeriod, setChartPeriod] = useState('daily');
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!agent) return;

      try {
        setIsLoading(true);
        const [propertyStats, dashStats, summary, performance] = await Promise.all([
          statsAPI.getPropertyStats(agent.id),
          statsAPI.getDashboardStats(agent.id),
          statsAPI.getPropertiesSummary(agent.id),
          statsAPI.getPerformanceData(agent.id)
        ]);
        setStats(propertyStats);
        setDashboardStats(dashStats);
        setPropertiesSummary(summary);
        setPerformanceData(performance);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [agent]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!agent) return;

      try {
        setChartLoading(true);
        const response = await statsAPI.getPropertiesChart(agent.id, chartPeriod);
        // Transform the API response to match PropertiesChartData format
        const transformedData: PropertiesChartData[] = response.labels.map((label, index) => ({
          label,
          value: response.data[index] || 0
        }));
        setChartData(transformedData);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [agent, chartPeriod]);

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

  // Prepare data for pie chart
  const pieChartData = [
    { name: 'Active Properties', value: dashboardStats.activeProperties, color: '#10b981' },
    { name: 'Inactive Properties', value: dashboardStats.inactiveProperties, color: '#6b7280' },
    { name: 'Featured Properties', value: dashboardStats.featuredProperties, color: '#f59e0b' },
    { name: 'Rented Properties', value: dashboardStats.rentedProperties, color: '#3b82f6' },
    { name: 'Under Review', value: dashboardStats.underReviewProperties, color: '#ef4444' },
    { name: 'Sold Properties', value: dashboardStats.soldProperties, color: '#8b5cf6' }
  ].filter(item => item.value > 0); // Only show categories with values > 0

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

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '-' : performanceData.conversionRate}
              </div>
              <p className="text-xs text-muted-foreground">
                Inquiries to sales conversion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Days to Sell
              </CardTitle>
              <Eye className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '-' : performanceData.averageDaysToSell}
              </div>
              <p className="text-xs text-muted-foreground">
                Average time to close deals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inquiries
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '-' : performanceData.totalInquiries.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total inquiries received
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Status Pie Chart */}
          {pieChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Property Status Distribution</span>
                </CardTitle>
                <CardDescription>
                  Breakdown of your properties by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Properties']} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}



          {/* Properties Time-Based Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Properties Over Time</span>
              </CardTitle>
              <CardDescription>
                Track your property listings across different time periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={chartPeriod} onValueChange={setChartPeriod} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
                <TabsContent value={chartPeriod} className="mt-4">
                  <div className="h-80">
                    {chartLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Loading chart data...</p>
                      </div>
                    ) : chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis />
                          <Tooltip formatter={(value) => [value, 'Properties']} />
                          <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No data available for this period</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

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
