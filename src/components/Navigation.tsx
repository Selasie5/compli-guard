import { useState } from "react";
import { Shield, Home, FileText, Settings, AlertTriangle, Download, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import shieldIcon from "@/assets/shield-icon.png";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
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
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? 'Signing out...' : 'Logout'}</span>
            </Button>
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;