import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Edit, Plus, Clock, CheckCircle2 } from "lucide-react";

const Policies = () => {
  const policies = [
    {
      title: "Information Security Policy",
      description: "Comprehensive security controls and procedures for SOC 2 compliance",
      status: "approved",
      lastUpdated: "2024-01-15",
      version: "v2.1",
      controls: ["CC6.1", "CC6.2", "CC6.3"]
    },
    {
      title: "Access Control Policy", 
      description: "User access management and privilege escalation procedures",
      status: "draft",
      lastUpdated: "2024-01-20",
      version: "v1.0",
      controls: ["CC6.1", "CC6.2"]
    },
    {
      title: "Incident Response Policy",
      description: "Security incident detection, response, and recovery procedures", 
      status: "review",
      lastUpdated: "2024-01-18",
      version: "v1.5",
      controls: ["CC7.4", "CC7.5"]
    },
    {
      title: "Vendor Management Policy",
      description: "Third-party vendor assessment and monitoring procedures",
      status: "approved", 
      lastUpdated: "2024-01-10",
      version: "v1.2",
      controls: ["CC9.1", "CC9.2"]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-compliance-excellent text-white"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case "review":
        return <Badge className="bg-compliance-needs-attention text-white"><Clock className="h-3 w-3 mr-1" />In Review</Badge>;
      case "draft":
        return <Badge variant="outline" className="text-muted-foreground"><Edit className="h-3 w-3 mr-1" />Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Compliance Policies</h1>
          <p className="text-muted-foreground">Manage your SOC 2 compliance policies and documentation</p>
        </div>
        
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-muted-foreground mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            This page will display AI-generated policies and documentation.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policies;