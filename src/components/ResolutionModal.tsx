import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, GitPullRequest, ExternalLink, Code, FileText, AlertTriangle } from "lucide-react";

interface Finding {
  id: string;
  severity: string;
  control: string;
  resource: string;
  description: string;
  status: string;
  can_autofix?: boolean;
}

interface ResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  finding: Finding | null;
}

const ResolutionModal = ({ isOpen, onClose, finding }: ResolutionModalProps) => {
  if (!finding) return null;

  const getResolutionSteps = (finding: Finding) => {
    const control = finding.control?.toLowerCase() || '';
    const resource = finding.resource?.toLowerCase() || '';
    const description = finding.description?.toLowerCase() || '';

    if (control.includes('access') || description.includes('mfa') || description.includes('iam')) {
      return {
        manual: [
          "Navigate to AWS IAM Console",
          "Select the root account or affected user",
          "Go to Security Credentials tab",
          "Click 'Assign MFA device'",
          "Choose Virtual MFA device",
          "Follow the setup wizard to configure MFA",
          "Test the MFA setup before saving"
        ],
        automated: finding.can_autofix ? [
          "Review the proposed changes",
          "Click 'Apply Fix' to automatically enable MFA",
          "Verify the configuration in AWS console",
          "Update your access procedures"
        ] : null,
        code: `# AWS CLI command to enable MFA
aws iam create-virtual-mfa-device \\
  --virtual-mfa-device-name root-account-mfa \\
  --outfile QRCodePNG \\
  --bootstrap-method QRCodePNG

# Enable MFA for root account
aws iam enable-mfa-device \\
  --user-name root \\
  --serial-number arn:aws:iam::account:mfa/root-account-mfa \\
  --authentication-code-1 123456 \\
  --authentication-code-2 654321`
      };
    }

    if (control.includes('encrypt') || description.includes('encrypt')) {
      return {
        manual: [
          "Open AWS S3 Console",
          "Navigate to the affected bucket",
          "Click on Properties tab",
          "Scroll to Default Encryption section",
          "Click Edit",
          "Select AES-256 or AWS KMS encryption",
          "Save changes and verify encryption is enabled"
        ],
        automated: finding.can_autofix ? [
          "Review encryption settings to be applied",
          "Click 'Enable Encryption' to auto-configure",
          "Verify encryption status in S3 console"
        ] : null,
        code: `# AWS CLI command to enable S3 encryption
aws s3api put-bucket-encryption \\
  --bucket your-bucket-name \\
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'`
      };
    }

    if (control.includes('log') || description.includes('cloudtrail')) {
      return {
        manual: [
          "Open AWS CloudTrail Console",
          "Click 'Create trail'",
          "Enter trail name and S3 bucket location",
          "Enable logging for all regions",
          "Configure event selectors",
          "Enable log file integrity validation",
          "Review and create the trail"
        ],
        automated: null,
        code: `# AWS CLI command to create CloudTrail
aws cloudtrail create-trail \\
  --name ComplianceAuditTrail \\
  --s3-bucket-name your-cloudtrail-bucket \\
  --include-global-service-events \\
  --is-multi-region-trail`
      };
    }

    if (control.includes('github') || resource.includes('github')) {
      return {
        manual: [
          "Navigate to GitHub repository settings",
          "Click on 'Branches' in the left sidebar",
          "Click 'Add rule' for branch protection",
          "Select 'Require pull request reviews before merging'",
          "Enable 'Dismiss stale PR approvals when new commits are pushed'",
          "Enable 'Require status checks to pass before merging'",
          "Save the branch protection rule"
        ],
        automated: finding.can_autofix ? [
          "Review the branch protection settings to be applied",
          "Click 'Apply GitHub Fix' to enable protections",
          "Verify the rules in GitHub repository settings"
        ] : null,
        code: `# GitHub CLI command to enable branch protection
gh api repos/:owner/:repo/branches/main/protection \\
  --method PUT \\
  --field required_status_checks='{"strict":true,"contexts":[]}' \\
  --field enforce_admins=true \\
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \\
  --field restrictions=null`
      };
    }

    return {
      manual: [
        "Review the finding details carefully",
        "Consult your organization's security policies",
        "Identify the root cause of the issue",
        "Implement appropriate remediation steps",
        "Test the changes in a staging environment",
        "Apply the fix to production",
        "Document the resolution for audit purposes"
      ],
      automated: null,
      code: `# Generic remediation approach
# 1. Assess the security finding
# 2. Plan remediation steps
# 3. Test in non-production environment
# 4. Apply fix with proper change management
# 5. Verify resolution and document`
    };
  };

  const resolution = getResolutionSteps(finding);

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-compliance-critical text-white';
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-compliance-needs-work text-white';
      case 'low': return 'bg-compliance-good text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Resolution Guide</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Finding Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Finding Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Severity:</span>
                  <Badge className={getSeverityColor(finding.severity)}>
                    {finding.severity}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-medium">Control:</span>
                  <div className="text-sm text-muted-foreground">{finding.control}</div>
                </div>
                <div>
                  <span className="text-sm font-medium">Resource:</span>
                  <div className="text-sm text-muted-foreground">{finding.resource}</div>
                </div>
                <div>
                  <span className="text-sm font-medium">Description:</span>
                  <div className="text-sm text-muted-foreground">{finding.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resolution Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resolution Options</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="manual">Manual Steps</TabsTrigger>
                  <TabsTrigger value="automated" disabled={!resolution.automated}>
                    Automated Fix
                  </TabsTrigger>
                  <TabsTrigger value="code">Code/CLI</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    {resolution.manual.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-secondary/30 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="text-sm">{step}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="automated" className="space-y-4 mt-4">
                  {resolution.automated ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {resolution.automated.map((step, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-secondary/30 rounded-lg">
                            <CheckCircle2 className="h-4 w-4 text-compliance-excellent mt-0.5" />
                            <div className="text-sm">{step}</div>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full" disabled>
                        <GitPullRequest className="h-4 w-4 mr-2" />
                        Apply Automated Fix (Coming Soon)
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <GitPullRequest className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Automated fix not available for this finding</p>
                      <p className="text-sm text-muted-foreground">Please use manual resolution steps</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="code" className="space-y-4 mt-4">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      <code>{resolution.code}</code>
                    </pre>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    * Always test commands in a non-production environment first
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onClose}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Reviewed
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResolutionModal;