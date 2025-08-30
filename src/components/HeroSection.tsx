import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, GitBranch, Cloud, FileText, Zap, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero-compliance.jpg";

const HeroSection = () => {
  const features = [
    {
      icon: GitBranch,
      title: "GitHub Integration",
      description: "Continuous scanning of repositories and branch protection"
    },
    {
      icon: Cloud,
      title: "AWS Compliance",
      description: "Real-time infrastructure security and SOC 2 readiness"
    },
    {
      icon: FileText,
      title: "Policy Generation",
      description: "AI-powered compliance policy creation and management"
    },
    {
      icon: Zap,
      title: "Auto-Remediation",
      description: "Automated PR creation for security and compliance fixes"
    }
  ];

  const stats = [
    { value: "50%", label: "Faster SOC 2 Readiness" },
    { value: "95%", label: "Automated Remediation" },
    { value: "24/7", label: "Continuous Monitoring" },
    { value: "100+", label: "Security Controls" }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary opacity-90" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white animate-fade-in">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Automate Your 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                SOC 2 Compliance
              </span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              CompliGuard continuously scans your GitHub repositories and AWS infrastructure, 
              generating policies and automated fixes to achieve SOC 2 readiness in weeks, not months.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-blue-50">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                View Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slide-up">
            <img 
              src={heroImage} 
              alt="Compliance Dashboard"
              className="rounded-2xl shadow-2xl border border-white/20"
            />
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-compliance-excellent" />
                <span className="font-semibold text-foreground">SOC 2 Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <feature.icon className="h-8 w-8 mx-auto mb-4 text-blue-200" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-blue-100">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;