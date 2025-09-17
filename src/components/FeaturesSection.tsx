import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Cloud, 
  FileText, 
  Zap, 
  Shield, 
  Eye, 
  Users, 
  CheckCircle2,
  Clock,
  BarChart3
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: GitBranch,
      title: "GitHub Integration",
      description: "Continuous scanning of repositories with automated branch protection and security monitoring",
      badge: "Popular"
    },
    {
      icon: Cloud,
      title: "AWS Compliance",
      description: "Real-time infrastructure security monitoring and SOC 2 Type II readiness assessment",
      badge: "Enterprise"
    },
    {
      icon: FileText,
      title: "Policy Generation",
      description: "AI-powered compliance policy creation and management with regulatory updates",
      badge: "AI-Powered"
    },
    {
      icon: Zap,
      title: "Auto-Remediation",
      description: "Automated PR creation for security and compliance fixes with approval workflows",
      badge: "Automated"
    },
    {
      icon: Shield,
      title: "Security Controls",
      description: "100+ built-in security controls with customizable compliance frameworks",
      badge: "Complete"
    },
    {
      icon: Eye,
      title: "Real-time Monitoring",
      description: "24/7 continuous monitoring with instant alerts and compliance scoring",
      badge: "Live"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Multi-user workspaces with role-based access and audit trails",
      badge: "Team"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Comprehensive compliance dashboards with executive-ready reports",
      badge: "Insights"
    }
  ];

  const stats = [
    { value: "50%", label: "Faster SOC 2 Readiness", sublabel: "vs traditional methods" },
    { value: "95%", label: "Automated Remediation", sublabel: "of security issues" },
    { value: "24/7", label: "Continuous Monitoring", sublabel: "never miss an issue" },
    { value: "100+", label: "Security Controls", sublabel: "built-in frameworks" }
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything you need for SOC 2 compliance
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From automated scanning to policy generation, CompliGuard provides a complete 
            compliance automation platform that scales with your business.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>All features included in every plan</span>
            <Clock className="h-4 w-4 text-primary ml-4" />
            <span>Setup in under 5 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;