import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, CheckCircle2, Shield, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface EvidencePack {
  id: string;
  name: string;
  date: string;
  status: string;
  size: string;
  controls: number;
  findings: number;
  lastGenerated: string;
}

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidencePack: EvidencePack | null;
  findings: any[];
}

const EvidenceModal = ({ isOpen, onClose, evidencePack, findings }: EvidenceModalProps) => {
  if (!evidencePack) return null;

  const handleDownload = () => {
    // Create a comprehensive evidence document
    const evidenceData = {
      metadata: {
        packageId: evidencePack.id,
        packageName: evidencePack.name,
        generatedDate: evidencePack.date,
        totalControls: evidencePack.controls,
        totalFindings: evidencePack.findings,
        complianceFramework: "SOC 2 Type II"
      },
      summary: {
        controlsCovered: new Set(findings.map(f => f.control?.split(' - ')[0])).size,
        criticalFindings: findings.filter(f => f.severity === 'critical').length,
        highFindings: findings.filter(f => f.severity === 'high').length,
        mediumFindings: findings.filter(f => f.severity === 'medium').length,
        lowFindings: findings.filter(f => f.severity === 'low').length
      },
      findings: findings.map(finding => ({
        id: finding.id,
        control: finding.control,
        severity: finding.severity,
        resource: finding.resource,
        description: finding.description,
        status: finding.status,
        evidence: finding.evidence,
        remediation: getRemediationSuggestion(finding)
      })),
      controls: generateControlsSummary(findings)
    };

    const blob = new Blob([JSON.stringify(evidenceData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${evidencePack.id}_evidence_pack.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRemediationSuggestion = (finding: any) => {
    const remediations = {
      'access': 'Implement proper access controls and regular access reviews',
      'encryption': 'Enable encryption at rest and in transit for all sensitive data',
      'logging': 'Configure comprehensive logging and monitoring systems',
      'backup': 'Establish regular backup procedures and test recovery processes',
      'change': 'Implement change management processes with proper approvals',
      'incident': 'Develop and test incident response procedures'
    };

    const key = Object.keys(remediations).find(k => 
      finding.control?.toLowerCase().includes(k) || 
      finding.description?.toLowerCase().includes(k)
    );
    
    return remediations[key] || 'Review and address this finding according to compliance requirements';
  };

  const generateControlsSummary = (findings: any[]) => {
    const controlMap = new Map();
    
    findings.forEach(finding => {
      const control = finding.control?.split(' - ')[0] || 'Unknown';
      if (!controlMap.has(control)) {
        controlMap.set(control, { control, findings: [] });
      }
      controlMap.get(control).findings.push(finding);
    });

    return Array.from(controlMap.values());
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
            <span>Evidence Pack Preview</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Package Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{evidencePack.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Package ID:</span>
                  <div className="font-medium">{evidencePack.id}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Generated:</span>
                  <div className="font-medium">{evidencePack.lastGenerated}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Controls:</span>
                  <div className="font-medium">{evidencePack.controls}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <div className="font-medium">{evidencePack.size}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Findings Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Findings Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-compliance-critical/10 rounded-lg">
                  <div className="text-xl font-bold text-compliance-critical">
                    {findings.filter(f => f.severity === 'critical').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Critical</div>
                </div>
                <div className="text-center p-3 bg-destructive/10 rounded-lg">
                  <div className="text-xl font-bold text-destructive">
                    {findings.filter(f => f.severity === 'high').length}
                  </div>
                  <div className="text-sm text-muted-foreground">High</div>
                </div>
                <div className="text-center p-3 bg-compliance-needs-work/10 rounded-lg">
                  <div className="text-xl font-bold text-compliance-needs-work">
                    {findings.filter(f => f.severity === 'medium').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                </div>
                <div className="text-center p-3 bg-compliance-good/10 rounded-lg">
                  <div className="text-xl font-bold text-compliance-good">
                    {findings.filter(f => f.severity === 'low').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Low</div>
                </div>
              </div>
              
              {/* Sample Findings */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {findings.slice(0, 10).map((finding, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{finding.control}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {finding.description}
                      </div>
                    </div>
                    <Badge className={`ml-2 ${getSeverityColor(finding.severity)} text-xs`}>
                      {finding.severity}
                    </Badge>
                  </div>
                ))}
                {findings.length > 10 && (
                  <div className="text-center text-sm text-muted-foreground py-2">
                    +{findings.length - 10} more findings included in full report
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleDownload} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download Evidence Pack</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceModal;