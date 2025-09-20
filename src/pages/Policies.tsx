import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Edit, Plus, Clock, CheckCircle2, Shield, AlertTriangle } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useEffect, useMemo, useState } from "react";
import PolicyModal from "@/components/PolicyModal";

const Policies = () => {
  const { findings, loadIntegrations } = useIntegrations();
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const getPolicyTitle = (control: string) => {
    const titles = {
      'CC6.1': 'Access Control Policy',
      'CC6.7': 'Data Encryption Policy', 
      'CC7.1': 'System Monitoring Policy',
      'CC7.4': 'Incident Response Policy',
      'CC8.1': 'Change Management Policy',
      'CC9.1': 'Risk Assessment Policy'
    };
    return titles[control] || `${control} Compliance Policy`;
  };

  const getPolicyDescription = (control: string) => {
    const descriptions = {
      'CC6.1': 'Defines access management procedures and user privilege controls',
      'CC6.7': 'Establishes encryption standards for data protection',
      'CC7.1': 'Outlines system monitoring and logging requirements',
      'CC7.4': 'Details incident detection and response procedures',
      'CC8.1': 'Governs change management and approval processes',
      'CC9.1': 'Framework for risk identification and assessment'
    };
    return descriptions[control] || `Policy governing ${control} compliance requirements`;
  };

  const getStatusBadge = (status: string, findingsCount: number) => {
    if (findingsCount === 0) {
      return <Badge className="bg-compliance-excellent text-white"><CheckCircle2 className="h-3 w-3 mr-1" />Compliant</Badge>;
    }
    
    switch (status) {
      case 'compliant':
        return <Badge className="bg-compliance-excellent text-white"><CheckCircle2 className="h-3 w-3 mr-1" />Compliant</Badge>;
      case 'needs_attention':
        return <Badge className="bg-compliance-needs-work text-white"><AlertTriangle className="h-3 w-3 mr-1" />Needs Attention</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-compliance-critical';
      case 'high': return 'text-destructive';
      case 'medium': return 'text-compliance-needs-work';
      case 'low': return 'text-compliance-good';
      default: return 'text-muted-foreground';
    }
  };

  // Generate policies based on scan findings
  const generatedPolicies = useMemo(() => {
    const policyMap = new Map();

    findings.forEach(finding => {
      const controlCategory = finding.control?.split(' - ')[0] || 'Unknown';
      
      if (!policyMap.has(controlCategory)) {
        policyMap.set(controlCategory, {
          id: controlCategory,
          title: getPolicyTitle(controlCategory),
          description: getPolicyDescription(controlCategory),
          status: finding.severity === 'critical' || finding.severity === 'high' ? 'needs_attention' : 'compliant',
          controls: [controlCategory],
          findings: [],
          lastUpdated: new Date().toISOString().split('T')[0],
          version: 'v1.0'
        });
      }
      
      policyMap.get(controlCategory).findings.push(finding);
    });

    return Array.from(policyMap.values());
  }, [findings]);

  const handlePreviewPolicy = (policy: any) => {
    setSelectedPolicy(policy);
    setIsModalOpen(true);
  };

  const handleDownloadPolicy = (policy: any) => {
    const policyDocument = {
      title: policy.title,
      version: policy.version,
      lastUpdated: policy.lastUpdated,
      status: policy.status,
      description: policy.description,
      controls: policy.controls,
      overview: `This policy document outlines the requirements and procedures for ${policy.title.toLowerCase()}. It is designed to ensure compliance with security standards and regulatory requirements.`,
      scope: "This policy applies to all systems, applications, and personnel within the organization.",
      requirements: [
        "All personnel must comply with this policy",
        "Regular reviews and updates must be conducted", 
        "Violations must be reported and addressed promptly",
        "Training must be provided to relevant personnel"
      ],
      procedures: policy.findings.length > 0 
        ? policy.findings.map((finding: any) => ({
            control: finding.control,
            requirement: finding.description,
            severity: finding.severity,
            resource: finding.resource,
            remediation: getRemediationSuggestion(finding)
          }))
        : [{
            control: policy.controls[0],
            requirement: "Maintain compliance with security standards",
            severity: "informational", 
            resource: "All systems",
            remediation: "Continue current practices and monitor for changes"
          }],
      compliance: {
        status: policy.status,
        findingsCount: policy.findings.length,
        lastAssessment: policy.lastUpdated,
        nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    };

    const blob = new Blob([JSON.stringify(policyDocument, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${policy.title.replace(/\s+/g, '_').toLowerCase()}_policy.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    const allPolicies = generatedPolicies.map(policy => ({
      title: policy.title,
      version: policy.version,
      lastUpdated: policy.lastUpdated,
      status: policy.status,
      description: policy.description,
      controls: policy.controls,
      findingsCount: policy.findings.length,
      findings: policy.findings.map((finding: any) => ({
        control: finding.control,
        description: finding.description,
        severity: finding.severity,
        resource: finding.resource
      }))
    }));

    const exportData = {
      exportDate: new Date().toISOString(),
      totalPolicies: generatedPolicies.length,
      compliantPolicies: generatedPolicies.filter(p => p.findings.length === 0).length,
      policiesNeedingAttention: generatedPolicies.filter(p => p.findings.length > 0).length,
      policies: allPolicies
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_policies_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRemediationSuggestion = (finding: any) => {
    const control = finding.control?.toLowerCase() || '';
    const description = finding.description?.toLowerCase() || '';
    
    if (control.includes('access') || description.includes('access')) {
      return "Review and update access controls, implement principle of least privilege";
    } else if (control.includes('encryption') || description.includes('encrypt')) {
      return "Implement proper encryption standards and key management";
    } else if (control.includes('monitoring') || description.includes('log')) {
      return "Enable comprehensive logging and monitoring systems";
    } else if (control.includes('incident') || description.includes('response')) {
      return "Establish incident response procedures and communication plans";
    } else if (control.includes('change') || description.includes('change')) {
      return "Implement formal change management and approval processes";
    }
    return "Address the identified security gap according to best practices";
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Compliance Policies</h1>
          <p className="text-muted-foreground">
            Review generated policies based on your security scan findings
          </p>
        </div>
        
        {generatedPolicies.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Policies Generated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Run a security scan to generate compliance policies based on your findings
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Policy Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Policy Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{generatedPolicies.length}</div>
                    <div className="text-sm text-muted-foreground">Total Policies</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-compliance-excellent">
                      {generatedPolicies.filter(p => p.findings.length === 0).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Compliant</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-compliance-needs-work">
                      {generatedPolicies.filter(p => p.findings.length > 0).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Need Attention</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policies List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Policy Details</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleExportAll}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Policy</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Findings</TableHead>
                      <TableHead>Controls</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedPolicies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{policy.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {policy.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(policy.status, policy.findings.length)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {policy.findings.length === 0 ? (
                              <div className="text-sm text-muted-foreground">No issues</div>
                            ) : (
                              <div className="text-sm font-medium">
                                {policy.findings.length} finding{policy.findings.length > 1 ? 's' : ''}
                              </div>
                            )}
                            {policy.findings.slice(0, 2).map((finding, idx) => (
                              <div key={idx} className={`text-xs ${getSeverityColor(finding.severity)}`}>
                                • {finding.description?.substring(0, 50)}...
                              </div>
                            ))}
                            {policy.findings.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{policy.findings.length - 2} more
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {policy.controls.map(control => (
                              <Badge key={control} variant="outline" className="text-xs">
                                {control}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {policy.lastUpdated}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handlePreviewPolicy(policy)}
                              title="Preview Policy"
                            >
                              <FileText className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDownloadPolicy(policy)}
                              title="Download Policy"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        <PolicyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          policy={selectedPolicy}
        />
      </div>
    </Layout>
  );
};

export default Policies;