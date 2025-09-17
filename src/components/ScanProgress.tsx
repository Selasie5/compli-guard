import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2, Play, X } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";

const ScanProgress = () => {
  const { isScanning, scanProgress, scanStatus, startScan } = useIntegrations();

  const getStatusIcon = () => {
    if (isScanning) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (scanStatus.includes('failed') || scanStatus.includes('error')) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
    if (scanProgress === 100 || scanStatus === 'Ready to scan') {
      return <CheckCircle2 className="h-4 w-4 text-compliance-excellent" />;
    }
    return <Play className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusColor = () => {
    if (isScanning) return "bg-blue-500/10 text-blue-700";
    if (scanStatus.includes('failed') || scanStatus.includes('error')) return "bg-destructive/10 text-destructive";
    if (scanProgress === 100) return "bg-compliance-excellent/10 text-compliance-excellent";
    return "bg-muted text-muted-foreground";
  };

  const getScanSteps = () => {
    const steps = [
      { id: 1, name: "Initializing scan", completed: scanProgress > 0 },
      { id: 2, name: "Connecting to integrations", completed: scanProgress > 20 },
      { id: 3, name: "Scanning repositories", completed: scanProgress > 40 },
      { id: 4, name: "Analyzing security controls", completed: scanProgress > 60 },
      { id: 5, name: "Generating findings", completed: scanProgress > 80 },
      { id: 6, name: "Finalizing report", completed: scanProgress >= 100 },
    ];
    return steps;
  };

  if (!isScanning && scanStatus === 'Ready to scan' && scanProgress === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span>Security Scan Progress</span>
          </div>
          <Badge className={getStatusColor()}>
            {isScanning ? 'Running' : scanStatus.includes('failed') ? 'Failed' : 'Completed'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {isScanning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="w-full" />
          </div>
        )}

        {/* Current Status */}
        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
          <div>
            <div className="font-medium text-sm">Status</div>
            <div className="text-xs text-muted-foreground">{scanStatus}</div>
          </div>
          {isScanning && (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          )}
        </div>

        {/* Scan Steps */}
        {isScanning && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Scan Steps</div>
            <div className="space-y-1">
              {getScanSteps().map((step) => (
                <div key={step.id} className="flex items-center space-x-2 text-sm">
                  {step.completed ? (
                    <CheckCircle2 className="h-3 w-3 text-compliance-excellent" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-muted" />
                  )}
                  <span className={step.completed ? "text-foreground" : "text-muted-foreground"}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          {!isScanning && scanStatus.includes('failed') && (
            <Button variant="outline" size="sm" onClick={startScan}>
              <Play className="h-3 w-3 mr-1" />
              Retry Scan
            </Button>
          )}
          {scanProgress === 100 && !isScanning && (
            <Button variant="outline" size="sm" onClick={startScan}>
              <Play className="h-3 w-3 mr-1" />
              Run New Scan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanProgress;