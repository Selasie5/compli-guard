import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Edit, Plus, Clock, CheckCircle2 } from "lucide-react";

const Policies = () => {
  const policies = [
    {
      title: "Information Security Policy",
      description: "Comprehensive security controls and procedures for SOC 2 compliance",
      status: "approved",
      lastUpdated: "2024-01-15",
      version: "v2.1",
      controls: ["CC6.1", "CC6.2", "CC6.3"]
    },
    {
      title: "Access Control Policy", 
      description: "User access management and privilege escalation procedures",
      status: "draft",
      lastUpdated: "2024-01-20",
      version: "v1.0",
      controls: ["CC6.1", "CC6.2"]
    },
    {
      title: "Incident Response Policy",
      description: "Security incident detection, response, and recovery procedures", 
      status: "review",
      lastUpdated: "2024-01-18",
      version: "v1.5",
      controls: ["CC7.4", "CC7.5"]
    },
    {
      title: "Vendor Management Policy",
      description: "Third-party vendor assessment and monitoring procedures",
      status: "approved", 
      lastUpdated: "2024-01-10",
      version: "v1.2",
      controls: ["CC9.1", "CC9.2"]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-compliance-excellent text-white"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case "review":
        return <Badge className="bg-compliance-needs-attention text-white"><Clock className="h-3 w-3 mr-1" />In Review</Badge>;
      case "draft":
        return <Badge variant="outline" className="text-muted-foreground"><Edit className="h-3 w-3 mr-1" />Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Compliance Policies</h1>
            <p className="text-muted-foreground">Manage and maintain your SOC 2 compliance documentation</p>
          </div>
          <Button variant="hero" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Generate New Policy</span>
          </Button>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {policies.map((policy) => (
            <Card key={policy.title} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{policy.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{policy.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(policy.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Version:</span>
                    <span className="font-medium">{policy.version}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{policy.lastUpdated}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">SOC 2 Controls:</span>
                    <div className="flex flex-wrap gap-1">
                      {policy.controls.map((control) => (
                        <Badge key={control} variant="outline" className="text-xs">
                          {control}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Policies;