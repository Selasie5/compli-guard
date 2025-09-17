import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Archive, Calendar, Clock, CheckCircle2, FileText, Shield } from "lucide-react";

const Evidence = () => {
  const evidencePacks = [
    {
      id: "EP-2024-001",
      name: "Q1 2024 SOC 2 Evidence Pack",
      date: "2024-01-31",
      status: "completed",
      size: "124 MB",
      controls: 15,
      findings: 8,
      lastGenerated: "2024-01-31 09:30 AM"
    },
    {
      id: "EP-2024-002", 
      name: "Q2 2024 SOC 2 Evidence Pack",
      date: "2024-04-30",
      status: "generating",
      size: "—",
      controls: 15,
      findings: 12,
      lastGenerated: "In progress..."
    },
    {
      id: "EP-2023-004",
      name: "Q4 2023 SOC 2 Evidence Pack", 
      date: "2023-12-31",
      status: "completed",
      size: "98 MB",
      controls: 14,
      findings: 6,
      lastGenerated: "2023-12-31 02:15 PM"
    }
  ];

  const evidenceTypes = [
    {
      name: "CloudTrail Logs",
      description: "AWS audit trail and API activity logs",
      lastUpdated: "2 hours ago",
      size: "45 MB"
    },
    {
      name: "GitHub Security Settings",
      description: "Repository settings and branch protection rules",
      lastUpdated: "1 day ago", 
      size: "2.1 MB"
    },
    {
      name: "IAM Configurations",
      description: "User access policies and role assignments",
      lastUpdated: "6 hours ago",
      size: "8.3 MB"
    },
    {
      name: "Backup Verification",
      description: "Database and system backup completion logs",
      lastUpdated: "12 hours ago",
      size: "15 MB"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-compliance-excellent text-white"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case "generating":
        return <Badge className="bg-compliance-needs-attention text-white"><Clock className="h-3 w-3 mr-1" />Generating</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Evidence Management</h1>
          <p className="text-muted-foreground">Generate and export compliance evidence for auditors</p>
        </div>
        
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-muted-foreground mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            This page will provide evidence export and audit trail functionality.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Evidence;