import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

const ComplianceScore = () => {
  const overallScore = 82;
  const controls = [
    { name: "Access Control", score: 95, status: "excellent" },
    { name: "Logging & Monitoring", score: 78, status: "good" },
    { name: "Encryption", score: 85, status: "excellent" },
    { name: "Backup & Recovery", score: 70, status: "needs-work" },
    { name: "Change Management", score: 90, status: "excellent" },
    { name: "Incident Response", score: 65, status: "needs-work" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-compliance-excellent text-white";
      case "good": return "bg-compliance-good text-white";
      case "needs-work": return "bg-compliance-needs-work text-white";
      case "critical": return "bg-compliance-critical text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return CheckCircle2;
      case "good": return TrendingUp;
      case "needs-work": return AlertTriangle;
      case "critical": return AlertTriangle;
      default: return Shield;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overall Score */}
      <Card className="lg:col-span-1 bg-gradient-card shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Overall Compliance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${overallScore}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">{overallScore}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">SOC 2 Readiness</p>
          <Badge className="mt-2 bg-compliance-good text-white">
            Good Standing
          </Badge>
        </CardContent>
      </Card>

      {/* Control Breakdown */}
      <Card className="lg:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle>Control Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {controls.map((control) => {
              const StatusIcon = getStatusIcon(control.status);
              return (
                <div key={control.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center space-x-3 flex-1">
                    <StatusIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{control.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 flex-1">
                    <Progress value={control.score} className="flex-1" />
                    <span className="text-sm font-medium w-10 text-right">{control.score}%</span>
                  </div>
                  <Badge className={`ml-3 text-xs ${getStatusColor(control.status)}`}>
                    {control.status.replace("-", " ")}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceScore;