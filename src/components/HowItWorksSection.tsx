import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, GitBranch, Shield, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorksSection = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: "01",
      title: "Connect Your Infrastructure",
      description: "Link your GitHub repositories and AWS accounts in minutes with our secure OAuth integration.",
      icon: GitBranch,
      features: ["GitHub repositories", "AWS accounts", "CI/CD pipelines", "Third-party tools"]
    },
    {
      step: "02", 
      title: "Automated Scanning",
      description: "Our AI continuously monitors your infrastructure for security vulnerabilities and compliance gaps.",
      icon: Shield,
      features: ["Real-time monitoring", "Vulnerability detection", "Policy violations", "Risk assessment"]
    },
    {
      step: "03",
      title: "Automated Remediation",
      description: "Get automated fixes via pull requests and policy updates that maintain your SOC 2 compliance.",
      icon: CheckCircle,
      features: ["Auto-generated PRs", "Policy updates", "Compliance reports", "Audit trails"]
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">How it works</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            SOC 2 compliance in 3 simple steps
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From setup to certification, CompliGuard automates your entire compliance journey 
            so you can focus on building great products.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8">
                  {/* Step Number */}
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-primary mb-1">Step {step.step}</div>
                      <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Arrow connector (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-muted/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Ready to automate your compliance?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join hundreds of companies who trust CompliGuard for their SOC 2 compliance journey.
            </p>
            <Button size="lg" onClick={() => navigate('/auth')} className="px-8">
              Start your free trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;