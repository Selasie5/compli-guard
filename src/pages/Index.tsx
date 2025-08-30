import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ComplianceScore from "@/components/ComplianceScore";
import FindingsTable from "@/components/FindingsTable";
import IntegrationsCard from "@/components/IntegrationsCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      
      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8" id="dashboard">
        <ComplianceScore />
        <FindingsTable />
        <IntegrationsCard />
      </div>
    </div>
  );
};

export default Index;
