import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Cloud, Settings, CheckCircle2, AlertCircle } from "lucide-react";

const IntegrationsCard = () => {
  const integrations = [
    {
      name: "GitHub",
      icon: Github,
      status: "connected",
      description: "Repository scanning and branch protection",
      lastSync: "2 minutes ago",
      repos: 12
    },
    {
      name: "AWS",
      icon: Cloud,
      status: "connected", 
      description: "Cloud infrastructure compliance scanning",
      lastSync: "5 minutes ago",
      accounts: 2
    },
    {
      name: "Jira",
      icon: Settings,
      status: "disconnected",
      description: "Automated issue creation and tracking",
      lastSync: null,
      tickets: 0
    }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-primary" />
          <span>Integrations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <integration.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{integration.name}</h3>
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
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                  {integration.lastSync && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last sync: {integration.lastSync}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                {integration.status === "connected" ? (
                  <div className="space-y-1">
                    {integration.repos && (
                      <div className="text-sm font-medium">{integration.repos} repos</div>
                    )}
                    {integration.accounts && (
                      <div className="text-sm font-medium">{integration.accounts} accounts</div>
                    )}
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                ) : (
                  <Button variant="hero" size="sm">
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsCard;