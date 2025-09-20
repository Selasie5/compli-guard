import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Calendar, Shield, AlertTriangle } from "lucide-react";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: {
    id: string;
    title: string;
    description: string;
    status: string;
    controls: string[];
    findings: any[];
    lastUpdated: string;
    version: string;
  } | null;
}

export default function PolicyModal({ isOpen, onClose, policy }: PolicyModalProps) {
  if (!policy) return null;

  const handleDownload = () => {
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
        ? policy.findings.map(finding => ({
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
      },
      
      appendix: {
        relatedDocuments: ["Security Policy", "Incident Response Plan", "Risk Management Framework"],
        definitions: {
          "Compliance": "Adherence to regulatory requirements and organizational policies",
          "Control": "A safeguard or countermeasure designed to preserve security",
          "Risk": "The potential for loss or damage when a vulnerability is exploited"
        }
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

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-compliance-critical';
      case 'high': return 'text-destructive';
      case 'medium': return 'text-compliance-needs-work';
      case 'low': return 'text-compliance-good';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>{policy.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Policy Header */}
          <div className="bg-secondary/30 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Version</div>
                <div className="font-medium">{policy.version}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge className={policy.findings.length === 0 ? "bg-compliance-excellent text-white" : "bg-compliance-needs-work text-white"}>
                  {policy.findings.length === 0 ? "Compliant" : "Needs Attention"}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div className="font-medium flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {policy.lastUpdated}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Findings</div>
                <div className="font-medium">{policy.findings.length}</div>
              </div>
            </div>
          </div>

          {/* Policy Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Overview</h3>
            <p className="text-muted-foreground">{policy.description}</p>
          </div>

          {/* Controls */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Applicable Controls</h3>
            <div className="flex flex-wrap gap-2">
              {policy.controls.map(control => (
                <Badge key={control} variant="outline" className="flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  {control}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Findings Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Findings</h3>
            {policy.findings.length === 0 ? (
              <div className="text-center py-8 bg-compliance-excellent/10 rounded-lg">
                <Shield className="h-12 w-12 text-compliance-excellent mx-auto mb-2" />
                <p className="text-compliance-excellent font-medium">No Issues Found</p>
                <p className="text-sm text-muted-foreground">This policy is currently compliant</p>
              </div>
            ) : (
              <div className="space-y-4">
                {policy.findings.map((finding, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`h-4 w-4 ${getSeverityColor(finding.severity)}`} />
                        <Badge variant="outline" className={getSeverityColor(finding.severity)}>
                          {finding.severity?.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge variant="secondary">{finding.control}</Badge>
                    </div>
                    
                    <h4 className="font-medium mb-1">Finding #{index + 1}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{finding.description}</p>
                    
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Resource:</span> {finding.resource}
                    </div>
                    
                    <div className="mt-3 p-3 bg-secondary/20 rounded text-sm">
                      <span className="font-medium text-foreground">Recommended Action:</span>
                      <p className="text-muted-foreground mt-1">{getRemediationSuggestion(finding)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Policy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}