import Layout from "@/components/Layout";
import ComplianceScore from "@/components/ComplianceScore";
import FindingsTable from "@/components/FindingsTable";
import IntegrationsCard from "@/components/IntegrationsCard";

const Dashboard = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Monitor your SOC 2 compliance status and security posture</p>
        </div>
        
        <ComplianceScore />
        <FindingsTable />
        <IntegrationsCard />
      </div>
    </Layout>
  );
};

export default Dashboard;