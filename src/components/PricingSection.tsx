import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "per month",
      description: "Perfect for small teams getting started with compliance",
      features: [
        "Up to 5 repositories",
        "Basic security scanning",
        "Email support",
        "Compliance dashboard",
        "Monthly reports",
        "Basic integrations"
      ],
      cta: "Start free trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "per month", 
      description: "Advanced features for growing companies seeking SOC 2 certification",
      features: [
        "Unlimited repositories",
        "Advanced security scanning",
        "Priority support",
        "Custom policies",
        "Automated remediation",
        "Real-time monitoring",
        "API access",
        "Team collaboration"
      ],
      cta: "Start free trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Tailored solutions for large organizations with complex needs",
      features: [
        "Everything in Professional",
        "Dedicated success manager",
        "Custom integrations",
        "SLA guarantees",
        "Advanced analytics",
        "Multi-tenant support",
        "Custom training",
        "24/7 phone support"
      ],
      cta: "Contact sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include our core compliance automation features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative h-full ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border/50 hover:border-border hover:shadow-lg'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Zap className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-8">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => navigate('/auth')}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <div className="bg-background rounded-2xl p-8 max-w-4xl mx-auto border border-border/50">
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              Frequently asked questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-medium text-foreground mb-2">How long does SOC 2 certification take?</h4>
                <p className="text-sm text-muted-foreground">With CompliGuard, most companies achieve SOC 2 readiness in 4-8 weeks, compared to 6-12 months traditionally.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Do you support custom compliance frameworks?</h4>
                <p className="text-sm text-muted-foreground">Yes, our Professional and Enterprise plans support custom frameworks and policies tailored to your industry.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">What integrations do you support?</h4>
                <p className="text-sm text-muted-foreground">We integrate with GitHub, AWS, Azure, GCP, and 50+ other tools in your development and infrastructure stack.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Is there a free trial?</h4>
                <p className="text-sm text-muted-foreground">Yes, we offer a 14-day free trial with no credit card required. You can test all features during the trial period.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;