import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Archive, Calendar, Clock, CheckCircle2, FileText, Shield, Database, Github, Cloud } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useEffect, useMemo } from "react";
import { format } from "date-fns";

const Evidence = () => {
  const { findings, integrations, loadIntegrations } = useIntegrations();

  useEffect(() => {
    loadIntegrations();
  }, []);

  // Generate evidence packs based on scan results
  const evidencePacks = useMemo(() => {
    if (findings.length === 0) return [];

    const latestScan = {
      id: "EP-" + new Date().getFullYear() + "-001",
      name: `${format(new Date(), 'MMMM yyyy')} SOC 2 Evidence Pack`,
      date: format(new Date(), 'yyyy-MM-dd'),
      status: "completed",
      size: `${Math.round(findings.length * 2.5)} MB`, // Estimate based on findings
      controls: new Set(findings.map(f => f.control?.split(' - ')[0])).size,
      findings: findings.length,
      lastGenerated: format(new Date(), 'yyyy-MM-dd hh:mm a')
    };

    return [latestScan];
  }, [findings]);

  // Generate evidence types based on connected integrations
  const evidenceTypes = useMemo(() => {
    const types = [];

    integrations.forEach(integration => {
      if (integration.status === 'connected') {
        switch (integration.type) {
          case 'github':
            types.push({
              name: "GitHub Security Settings",
              description: "Repository settings and branch protection rules",
              lastUpdated: integration.lastSync ? format(integration.lastSync, 'h:mm a') : 'Never',
              size: "2.1 MB",
              icon: Github
            });
            types.push({
              name: "Code Repository Audit",
              description: "Commit logs and access control evidence", 
              lastUpdated: integration.lastSync ? format(integration.lastSync, 'h:mm a') : 'Never',
              size: "8.7 MB",
              icon: Github
            });
            break;
          case 'aws':
            types.push({
              name: "CloudTrail Logs",
              description: "AWS audit trail and API activity logs",
              lastUpdated: integration.lastSync ? format(integration.lastSync, 'h:mm a') : 'Never',
              size: "45 MB",
              icon: Cloud
            });
            types.push({
              name: "IAM Configurations", 
              description: "User access policies and role assignments",
              lastUpdated: integration.lastSync ? format(integration.lastSync, 'h:mm a') : 'Never',
              size: "8.3 MB",
              icon: Cloud
            });
            break;
          default:
            break;
        }
      }
    });

    return types;
  }, [integrations]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-compliance-excellent text-white"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case "generating":
        return <Badge className="bg-compliance-needs-work text-white"><Clock className="h-3 w-3 mr-1" />Generating</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Evidence Management</h1>
          <p className="text-muted-foreground">
            Generate and export compliance evidence from your security scans
          </p>
        </div>
        
        {evidencePacks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Archive className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Evidence Available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Run security scans to generate evidence packages for audit purposes
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Evidence Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{evidencePacks.length}</div>
                  <div className="text-sm text-muted-foreground">Evidence Packs</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-compliance-excellent">
                    {evidencePacks.reduce((sum, pack) => sum + pack.controls, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Controls Covered</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-compliance-needs-work">
                    {evidencePacks.reduce((sum, pack) => sum + pack.findings, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Findings Documented</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-muted-foreground">{evidenceTypes.length}</div>
                  <div className="text-sm text-muted-foreground">Evidence Types</div>
                </CardContent>
              </Card>
            </div>

            {/* Evidence Packs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Archive className="h-5 w-5" />
                    <span>Evidence Packs</span>
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Generate New Pack
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evidence Pack</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Controls</TableHead>
                      <TableHead>Findings</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evidencePacks.map((pack) => (
                      <TableRow key={pack.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{pack.name}</div>
                            <div className="text-sm text-muted-foreground">{pack.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(pack.status)}
                        </TableCell>
                        <TableCell className="font-medium">{pack.controls}</TableCell>
                        <TableCell className="font-medium">{pack.findings}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{pack.size}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {pack.lastGenerated}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileText className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Evidence Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Evidence Collection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {evidenceTypes.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No evidence sources connected</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect integrations to collect compliance evidence automatically
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evidenceTypes.map((evidence, index) => {
                      const Icon = evidence.icon;
                      return (
                        <div key={index} className="p-4 border border-border rounded-lg bg-secondary/30">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{evidence.name}</h3>
                              <p className="text-sm text-muted-foreground">{evidence.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-muted-foreground">
                              Last updated: {evidence.lastUpdated}
                            </div>
                            <div className="font-medium">
                              {evidence.size}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Evidence;