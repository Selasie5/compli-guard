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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="bg-background text-foreground">
          {/* Document Header */}
          <div className="border-b-2 border-primary pb-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">ORGANIZATION NAME</h1>
                  <p className="text-sm text-muted-foreground">Security & Compliance Department</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Document ID</div>
                <div className="font-mono text-sm">POL-{policy.id.slice(-6).toUpperCase()}</div>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">{policy.title}</h1>
              <p className="text-lg text-muted-foreground">Security Policy Document</p>
            </div>
          </div>

          {/* Document Metadata */}
          <div className="grid grid-cols-3 gap-6 mb-8 p-4 bg-secondary/30 rounded-lg">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Version</div>
              <div className="text-lg font-semibold">{policy.version}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Effective Date</div>
              <div className="text-lg font-semibold">{policy.lastUpdated}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Review Date</div>
              <div className="text-lg font-semibold">{new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Classification</div>
              <div className="text-lg font-semibold">Internal Use</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Owner</div>
              <div className="text-lg font-semibold">CISO Office</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <Badge className={policy.findings.length === 0 ? "bg-compliance-excellent text-white" : "bg-compliance-needs-work text-white"}>
                {policy.findings.length === 0 ? "Compliant" : "Needs Review"}
              </Badge>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground border-b pb-2">Table of Contents</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>1. Purpose</span>
                <span className="text-muted-foreground">Page 1</span>
              </div>
              <div className="flex justify-between">
                <span>2. Scope</span>
                <span className="text-muted-foreground">Page 1</span>
              </div>
              <div className="flex justify-between">
                <span>3. Policy Statement</span>
                <span className="text-muted-foreground">Page 1</span>
              </div>
              <div className="flex justify-between">
                <span>4. Procedures</span>
                <span className="text-muted-foreground">Page 2</span>
              </div>
              <div className="flex justify-between">
                <span>5. Compliance Assessment</span>
                <span className="text-muted-foreground">Page 2</span>
              </div>
              <div className="flex justify-between">
                <span>6. References</span>
                <span className="text-muted-foreground">Page 3</span>
              </div>
            </div>
          </div>

          {/* Document Content */}
          <div className="space-y-8 text-sm leading-relaxed">
            {/* Purpose */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</span>
                Purpose
              </h2>
              <div className="ml-11 space-y-3">
                <p className="text-foreground">
                  This policy document establishes the requirements and procedures for <strong>{policy.title.toLowerCase()}</strong> 
                  within the organization. It is designed to ensure compliance with security standards and regulatory requirements.
                </p>
                <p className="text-muted-foreground">
                  {policy.description}
                </p>
              </div>
            </section>

            {/* Scope */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</span>
                Scope
              </h2>
              <div className="ml-11">
                <p className="text-foreground mb-3">
                  This policy applies to all systems, applications, and personnel within the organization, including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>All full-time and part-time employees</li>
                  <li>Contractors and third-party service providers</li>
                  <li>All organizational information systems and assets</li>
                  <li>Cloud services and external integrations</li>
                </ul>
              </div>
            </section>

            {/* Policy Statement */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">3</span>
                Policy Statement
              </h2>
              <div className="ml-11 space-y-4">
                <p className="text-foreground">
                  The organization is committed to maintaining the highest standards of security and compliance. 
                  All personnel must adhere to the following requirements:
                </p>
                
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-foreground">Applicable Security Controls</h3>
                  <div className="flex flex-wrap gap-2">
                    {policy.controls.map(control => (
                      <Badge key={control} variant="outline" className="flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        {control}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Core Requirements:</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>All personnel must comply with this policy without exception</li>
                    <li>Regular reviews and updates must be conducted as specified</li>
                    <li>Violations must be reported and addressed promptly</li>
                    <li>Appropriate training must be provided to relevant personnel</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Procedures */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">4</span>
                Procedures & Implementation
              </h2>
              <div className="ml-11 space-y-4">
                {policy.findings.length > 0 ? (
                  policy.findings.map((finding, index) => (
                    <div key={index} className="border-l-4 border-primary/30 pl-4 py-2">
                      <h4 className="font-medium text-foreground mb-2">
                        Procedure {index + 1}: {finding.control}
                      </h4>
                      <p className="text-muted-foreground mb-2">{finding.description}</p>
                      <div className="bg-secondary/20 p-3 rounded text-sm">
                        <span className="font-medium text-foreground">Implementation:</span>
                        <p className="text-muted-foreground mt-1">{getRemediationSuggestion(finding)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border-l-4 border-compliance-excellent pl-4 py-2">
                    <h4 className="font-medium text-foreground mb-2">Standard Operating Procedure</h4>
                    <p className="text-muted-foreground mb-2">
                      Maintain compliance with security standards through continuous monitoring and assessment.
                    </p>
                    <div className="bg-compliance-excellent/10 p-3 rounded text-sm">
                      <span className="font-medium text-compliance-excellent">Status:</span>
                      <p className="text-muted-foreground mt-1">All controls are currently implemented and functioning as expected.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Compliance Assessment */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">5</span>
                Compliance Assessment
              </h2>
              <div className="ml-11">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Current Status</div>
                    <div className="text-lg font-semibold text-foreground">
                      {policy.findings.length === 0 ? "Fully Compliant" : `${policy.findings.length} Finding(s)`}
                    </div>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Last Assessment</div>
                    <div className="text-lg font-semibold text-foreground">{policy.lastUpdated}</div>
                  </div>
                </div>

                {policy.findings.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Action Required
                    </h3>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      This policy has {policy.findings.length} outstanding finding(s) that require attention. 
                      Please review the procedures section for detailed remediation steps.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* References */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">6</span>
                References & Related Documents
              </h2>
              <div className="ml-11">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Organizational Security Policy Framework</li>
                  <li>• Incident Response Plan</li>
                  <li>• Risk Management Framework</li>
                  <li>• Employee Security Handbook</li>
                  <li>• Regulatory Compliance Guidelines</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Document Footer */}
          <div className="mt-12 pt-6 border-t border-secondary">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <div>Document ID: POL-{policy.id.slice(-6).toUpperCase()}</div>
              <div>Version {policy.version} | Page 1 of 3</div>
              <div>© 2024 Organization Name. Confidential.</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose}>
              <FileText className="h-4 w-4 mr-2" />
              Close Preview
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