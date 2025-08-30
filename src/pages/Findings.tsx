import Navigation from "@/components/Navigation";
import FindingsTable from "@/components/FindingsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Shield, CheckCircle2 } from "lucide-react";

const Findings = () => {
  const findingsStats = [
    {
      icon: AlertTriangle,
      title: "Critical Findings",
      value: "3",
      trend: "+1 this week",
      color: "text-compliance-critical"
    },
    {
      icon: Shield,
      title: "High Priority",
      value: "8", 
      trend: "-2 from last week",
      color: "text-compliance-needs-attention"
    },
    {
      icon: TrendingUp,
      title: "Medium Issues",
      value: "15",
      trend: "+3 this week", 
      color: "text-compliance-good"
    },
    {
      icon: CheckCircle2,
      title: "Resolved",
      value: "42",
      trend: "+12 this week",
      color: "text-compliance-excellent"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Security Findings</h1>
          <p className="text-muted-foreground">Review and manage compliance findings across your infrastructure</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {findingsStats.map((stat) => (
            <Card key={stat.title} className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Findings Table */}
        <FindingsTable />
      </div>
    </div>
  );
};

export default Findings;