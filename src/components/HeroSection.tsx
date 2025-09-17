import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-compliance.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen bg-background pt-16">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-foreground">CompliGuard</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#solutions" className="text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="/documentation" className="text-muted-foreground hover:text-foreground transition-colors">Docs</a>
            </div>

            <div className="flex items-center space-x-3">
              {user ? (
                <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/auth')} className="hidden sm:inline-flex">Log in</Button>
                  <Button onClick={() => navigate('/auth')}>Sign up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
          Automate your SOC 2 compliance with continuous monitoring
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          A workspace to gather, structure, and take action on security compliance 
          with enterprise-level precision and automated remediation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          {user ? (
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => navigate('/auth')}
              >
                Try it now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => navigate('/auth')}
              >
                <Play className="mr-2 h-5 w-5" />
                Request a Demo
              </Button>
            </>
          )}
        </div>

        {/* Product Screenshot */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border">
            <img 
              src={heroImage} 
              alt="CompliGuard Dashboard - Automated SOC 2 Compliance Management"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;