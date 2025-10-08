import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CheckCircle2, GitPullRequest, ExternalLink, Code, FileText, AlertTriangle, Sparkles, Loader2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

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
  const { toast } = useToast();
  const [aiRemediation, setAiRemediation] = useState<any>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isMarkingReviewed, setIsMarkingReviewed] = useState(false);

  useEffect(() => {
    if (isOpen && finding) {
      setAiRemediation(null);
    }
  }, [isOpen, finding]);

  const generateAIFix = async () => {
    if (!finding) return;
    
    setIsLoadingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-remediation', {
        body: { finding }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "AI Error",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      setAiRemediation(data.remediation);
      toast({
        title: "AI Remediation Generated",
        description: "Review the AI-powered fix recommendations below",
      });
    } catch (error: any) {
      console.error('AI remediation error:', error);
      toast({
        title: "Failed to generate AI fix",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleMarkAsReviewed = async () => {
    if (!finding) return;
    
    setIsMarkingReviewed(true);
    try {
      const { error } = await supabase
        .from('scan_results')
        .update({ 
          status: 'reviewed',
          updated_at: new Date().toISOString()
        })
        .eq('id', finding.id);

      if (error) throw error;

      toast({
        title: "Finding Marked as Reviewed",
        description: "This finding has been marked as reviewed and your compliance score will be updated.",
      });
      
      onClose();
      
      // Trigger a page refresh to update the compliance score
      window.location.reload();
    } catch (error: any) {
      console.error('Error marking finding as reviewed:', error);
      toast({
        title: "Failed to mark as reviewed",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsMarkingReviewed(false);
    }
  };

  if (!finding) return null;

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
      <DialogContent 
        className="max-w-4xl max-h-[85vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
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

          {/* AI-Powered Remediation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI-Powered Remediation
              </CardTitle>
            </CardHeader>
            <CardContent>

              <div className="space-y-4">
                {!aiRemediation ? (
                  <div className="text-center py-8 space-y-4">
                    <Sparkles className="w-12 h-12 mx-auto text-primary" />
                    <h3 className="text-lg font-semibold">Context-Aware Remediation</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Get intelligent, context-aware fix recommendations powered by AI. 
                      We'll analyze this specific finding and provide step-by-step guidance tailored to your situation.
                    </p>
                    <Button 
                      onClick={generateAIFix} 
                      disabled={isLoadingAI}
                      className="mt-4"
                    >
                      {isLoadingAI ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate AI Remediation
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 bg-primary/5 rounded-lg border">
                      <h4 className="font-semibold mb-2">Summary</h4>
                      <p className="text-sm">{aiRemediation.summary}</p>
                    </div>

                    {aiRemediation.risk_analysis && (
                      <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          Risk Analysis
                        </h4>
                        <p className="text-sm">{aiRemediation.risk_analysis}</p>
                      </div>
                    )}

                    {aiRemediation.remediation_steps?.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold">Remediation Steps</h4>
                        {aiRemediation.remediation_steps.map((step: any, idx: number) => (
                          <div key={idx} className="p-4 border rounded-lg space-y-2">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                                {step.step || idx + 1}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-sm">{step.title}</h5>
                                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                                {step.code_example && (
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium">Command/Code:</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          navigator.clipboard.writeText(step.code_example);
                                          toast({
                                            title: "Copied!",
                                            description: "Code copied to clipboard",
                                          });
                                        }}
                                      >
                                        <Code className="h-3 w-3 mr-1" />
                                        Copy
                                      </Button>
                                    </div>
                                    <pre className="p-2 bg-muted rounded text-xs overflow-x-auto">
                                      <code>{step.code_example}</code>
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {aiRemediation.prevention_tips?.length > 0 && (
                      <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                        <h4 className="font-semibold mb-2">Prevention Tips</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {aiRemediation.prevention_tips.map((tip: string, idx: number) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      {aiRemediation.estimated_time && (
                        <span className="text-muted-foreground">
                          ⏱️ Estimated time: {aiRemediation.estimated_time}
                        </span>
                      )}
                      {aiRemediation.difficulty && (
                        <Badge variant={
                          aiRemediation.difficulty === 'easy' ? 'default' : 
                          aiRemediation.difficulty === 'medium' ? 'secondary' : 
                          'destructive'
                        }>
                          {aiRemediation.difficulty}
                        </Badge>
                      )}
                    </div>

                    {aiRemediation.compliance_references?.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-semibold">Compliance: </span>
                        {aiRemediation.compliance_references.join(', ')}
                      </div>
                    )}

                    <Button 
                      onClick={generateAIFix} 
                      variant="outline" 
                      size="sm"
                      disabled={isLoadingAI}
                      className="w-full"
                    >
                      {isLoadingAI ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Regenerate AI Remediation
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isMarkingReviewed}>
              Close
            </Button>
            <Button onClick={handleMarkAsReviewed} disabled={isMarkingReviewed}>
              {isMarkingReviewed ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Marking as Reviewed...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Reviewed
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResolutionModal;