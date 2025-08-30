import Navigation from "@/components/Navigation";
import IntegrationsCard from "@/components/IntegrationsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Activity, Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react";

const Integrations = () => {
  const integrationStats = [
    {
      title: "Active Integrations",
      value: "2",
      description: "Connected and syncing",
      icon: CheckCircle2,
      color: "text-compliance-excellent"
    },
    {
      title: "Pending Setup",
      value: "1", 
      description: "Awaiting configuration",
      icon: AlertCircle,
      color: "text-compliance-needs-attention"
    },
    {
      title: "Last Sync",
      value: "2m ago",
      description: "GitHub repositories",
      icon: Clock,
      color: "text-primary"
    },
    {
      title: "Total Scans",
      value: "147",
      description: "This month",
      icon: Activity,
      color: "text-primary"
    }
  ];

  const availableIntegrations = [
    {
      name: "Azure DevOps",
      description: "Repository scanning and pipeline security analysis",
      category: "Source Control",
      status: "available"
    },
    {
      name: "Google Cloud Platform",
      description: "GCP resource compliance monitoring",
      category: "Cloud Provider", 
      status: "available"
    },
    {
      name: "Slack",
      description: "Real-time compliance alerts and notifications",
      category: "Communication",
      status: "available"
    },
    {
      name: "Microsoft Teams",
      description: "Compliance notifications and status updates",
      category: "Communication",
      status: "coming-soon"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Integrations</h1>
            <p className="text-muted-foreground">Connect your tools and services for comprehensive compliance monitoring</p>
          </div>
          <Button variant="hero" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Integration</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {integrationStats.map((stat) => (
            <Card key={stat.title} className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Integrations */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-primary" />
            Current Integrations
          </h2>
          <IntegrationsCard />
        </div>

        {/* Available Integrations */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-primary" />
            Available Integrations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableIntegrations.map((integration) => (
              <Card key={integration.name} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {integration.category}
                      </Badge>
                    </div>
                    {integration.status === "coming-soon" && (
                      <Badge variant="outline" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant={integration.status === "available" ? "hero" : "outline"} 
                    size="sm" 
                    className="w-full"
                    disabled={integration.status === "coming-soon"}
                  >
                    {integration.status === "available" ? "Connect" : "Notify Me"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;