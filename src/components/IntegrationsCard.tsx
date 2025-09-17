import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Cloud, Settings, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IntegrationsCard = () => {
  const { integrations, loadIntegrations } = useIntegrations();
  const navigate = useNavigate();

  useEffect(() => {
    loadIntegrations();
  }, []);

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'github': return Github;
      case 'aws': return Cloud;
      case 'jira': return Zap;
      default: return Settings;
    }
  };

  const getIntegrationDescription = (type: string) => {
    switch (type) {
      case 'github': return 'Repository scanning and branch protection';
      case 'aws': return 'Cloud infrastructure compliance scanning';
      case 'jira': return 'Automated issue creation and tracking';
      default: return 'Integration service';
    }
  };

  const formatLastSync = (lastSync: Date | undefined) => {
    if (!lastSync) return null;
    
    const now = new Date();
    const diff = now.getTime() - lastSync.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Integrations</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/integrations')}
          >
            Manage All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No integrations configured</p>
              <Button onClick={() => navigate('/integrations')}>
                Set up integrations
              </Button>
            </div>
          ) : (
            integrations.map((integration) => {
              const Icon = getIntegrationIcon(integration.type);
              return (
                <div key={integration.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium capitalize">{integration.type}</h3>
                        {integration.status === "connected" ? (
                          <Badge className="bg-compliance-excellent text-white">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Disconnected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getIntegrationDescription(integration.type)}
                      </p>
                      {integration.lastSync && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last sync: {formatLastSync(integration.lastSync)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {integration.status === "connected" ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/integrations')}
                      >
                        Configure
                      </Button>
                    ) : (
                      <Button 
                        variant="hero" 
                        size="sm"
                        onClick={() => navigate('/integrations')}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsCard;