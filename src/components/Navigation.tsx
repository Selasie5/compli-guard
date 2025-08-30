import { Shield, Home, FileText, Settings, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import shieldIcon from "@/assets/shield-icon.png";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: AlertTriangle, label: "Findings", href: "/findings" },
    { icon: FileText, label: "Policies", href: "/policies" },
    { icon: Download, label: "Evidence", href: "/evidence" },
    { icon: Settings, label: "Integrations", href: "/integrations" },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={shieldIcon} alt="CompliGuard" className="h-8 w-8" />
            <span className="text-xl font-bold text-primary">CompliGuard</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.label} to={item.href}>
                <Button
                  variant={location.pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              Settings
            </Button>
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">JS</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;