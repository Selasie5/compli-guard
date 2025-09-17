import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Shield, GitPullRequest, ExternalLink, Eye } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import ResolutionModal from "@/components/ResolutionModal";
import ScanProgress from "@/components/ScanProgress";

const FindingsTable = () => {
  const { findings, loadIntegrations, startScan, isScanning, scanProgress, scanStatus } = useIntegrations();
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const mockFindings = [
    {
      id: "F001",
      severity: "High",
      control: "CC6.1 - Access Control",
      resource: "AWS IAM Root Account",
      description: "Root account lacks MFA enforcement",
      status: "Open",
      evidence: "iam-root-mfa-check.json",
      created: "2024-01-15",
      canAutofix: true
    },
    {
      id: "F002", 
      severity: "Medium",
      control: "CC7.2 - Encryption",
      resource: "S3 Bucket: app-data-prod",
      description: "Default encryption not enabled",
      status: "In Progress",
      evidence: "s3-encryption-audit.json",
      created: "2024-01-14",
      canAutofix: true
    },
    {
      id: "F003",
      severity: "High",
      control: "CC7.1 - Logging",
      resource: "CloudTrail Configuration",
      description: "CloudTrail not enabled in all regions",
      status: "Open",
      evidence: "cloudtrail-config.json", 
      created: "2024-01-14",
      canAutofix: false
    },
    {
      id: "F004",
      severity: "Low",
      control: "CC8.1 - Change Management",
      resource: "GitHub: main branch",
      description: "Branch protection rules incomplete",
      status: "Open",
      evidence: "github-branch-protection.json",
      created: "2024-01-13",
      canAutofix: true
    },
    {
      id: "F005",
      severity: "Critical",
      control: "CC6.2 - Secret Management",
      resource: "Repository: backend-api",
      description: "Hardcoded API keys detected in code",
      status: "Open",
      evidence: "secret-scan-results.json",
      created: "2024-01-12",
      canAutofix: false
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "bg-compliance-critical text-white";
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-compliance-needs-work text-white";
      case "low": return "bg-compliance-good text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open": return "bg-destructive/10 text-destructive";
      case "in progress": return "bg-compliance-needs-work/10 text-warning";
      case "fixed": return "bg-compliance-excellent/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Use real findings if available, otherwise show mock data for demo
  const displayFindings = findings.length > 0 ? findings : mockFindings;
  const hasRealFindings = findings.length > 0;

  return (
    <div className="space-y-6">
      <ScanProgress />
      <Card className="shadow-lg">
        <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span>Security Findings</span>
            {hasRealFindings && (
              <Badge variant="destructive" className="ml-2">
                {findings.filter(f => f.status === "open").length} Open
              </Badge>
            )}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Export All
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={startScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                  <span>{scanStatus || 'Scanning...'}</span>
                </div>
              ) : 'Run New Scan'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {displayFindings.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Findings Available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect integrations and run a security scan to view findings
            </p>
            <Button onClick={startScan} disabled={isScanning}>
              {isScanning ? 'Scanning...' : 'Start Your First Scan'}
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Control</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayFindings.map((finding) => (
                <TableRow key={finding.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Badge className={`${getSeverityColor(finding.severity)} text-xs`}>
                      {finding.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {finding.control}
                  </TableCell>
                  <TableCell className="max-w-48 truncate">
                    {finding.resource}
                  </TableCell>
                  <TableCell className="max-w-64 truncate">
                    {finding.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(finding.status)}>
                      {finding.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        title="View Details"
                        onClick={() => {
                          setSelectedFinding(finding);
                          setIsResolutionModalOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {(finding.can_autofix || finding.canAutofix) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          title="Auto-fix (Coming Soon)"
                          disabled
                        >
                          <GitPullRequest className="h-3 w-3" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        title="View Resolution"
                        onClick={() => {
                          setSelectedFinding(finding);
                          setIsResolutionModalOpen(true);
                        }}
                      >
                        <Shield className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        <ResolutionModal
          isOpen={isResolutionModalOpen}
          onClose={() => setIsResolutionModalOpen(false)}
          finding={selectedFinding}
        />
      </CardContent>
    </Card>
    </div>
  );
};

export default FindingsTable;