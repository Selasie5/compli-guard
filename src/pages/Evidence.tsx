import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Archive, Calendar, Clock, CheckCircle2, FileText, Shield } from "lucide-react";

const Evidence = () => {
  const evidencePacks = [
    {
      id: "EP-2024-001",
      name: "Q1 2024 SOC 2 Evidence Pack",
      date: "2024-01-31",
      status: "completed",
      size: "124 MB",
      controls: 15,
      findings: 8,
      lastGenerated: "2024-01-31 09:30 AM"
    },
    {
      id: "EP-2024-002", 
      name: "Q2 2024 SOC 2 Evidence Pack",
      date: "2024-04-30",
      status: "generating",
      size: "—",
      controls: 15,
      findings: 12,
      lastGenerated: "In progress..."
    },
    {
      id: "EP-2023-004",
      name: "Q4 2023 SOC 2 Evidence Pack", 
      date: "2023-12-31",
      status: "completed",
      size: "98 MB",
      controls: 14,
      findings: 6,
      lastGenerated: "2023-12-31 02:15 PM"
    }
  ];

  const evidenceTypes = [
    {
      name: "CloudTrail Logs",
      description: "AWS audit trail and API activity logs",
      lastUpdated: "2 hours ago",
      size: "45 MB"
    },
    {
      name: "GitHub Security Settings",
      description: "Repository settings and branch protection rules",
      lastUpdated: "1 day ago", 
      size: "2.1 MB"
    },
    {
      name: "IAM Configurations",
      description: "User access policies and role assignments",
      lastUpdated: "6 hours ago",
      size: "8.3 MB"
    },
    {
      name: "Backup Verification",
      description: "Database and system backup completion logs",
      lastUpdated: "12 hours ago",
      size: "15 MB"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-compliance-excellent text-white"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case "generating":
        return <Badge className="bg-compliance-needs-attention text-white"><Clock className="h-3 w-3 mr-1" />Generating</Badge>;
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Evidence Management</h1>
            <p className="text-muted-foreground">Generate and export compliance evidence for auditors</p>
          </div>
          <Button variant="hero" className="flex items-center space-x-2">
            <Archive className="h-4 w-4" />
            <span>Generate Evidence Pack</span>
          </Button>
        </div>

        {/* Evidence Packs */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <Archive className="h-5 w-5 mr-2 text-primary" />
            Evidence Packs
          </h2>
          <div className="space-y-4">
            {evidencePacks.map((pack) => (
              <Card key={pack.id} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground">{pack.name}</h3>
                        {getStatusBadge(pack.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{pack.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="h-4 w-4" />
                          <span>{pack.controls} controls</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{pack.findings} findings</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{pack.lastGenerated}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {pack.status === "completed" && (
                        <>
                          <span className="text-sm font-medium text-muted-foreground">{pack.size}</span>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Evidence Types */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Evidence Sources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {evidenceTypes.map((evidence) => (
              <Card key={evidence.name} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {evidence.name}
                    <Badge variant="outline" className="text-xs">
                      {evidence.size}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{evidence.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Last updated: {evidence.lastUpdated}
                    </span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evidence;