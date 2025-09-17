import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Github, Cloud, Zap, CheckCircle, XCircle, Clock, AlertCircle, Play } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import { toast } from "sonner";

const IntegrationsDetailed = () => {
  const { 
    integrations, 
    isScanning, 
    scanProgress, 
    scanStatus, 
    connectIntegration, 
    disconnectIntegration,
    startScan 
  } = useIntegrations();

  const [githubConfig, setGithubConfig] = useState({ token: '', org: '' });
  const [awsConfig, setAwsConfig] = useState({ accessKey: '', secretKey: '', region: 'us-east-1' });
  const [jiraConfig, setJiraConfig] = useState({ url: '', email: '', token: '' });

  const handleConnect = async (type: 'github' | 'aws' | 'jira') => {
    let config;
    switch (type) {
      case 'github':
        config = githubConfig;
        break;
      case 'aws':
        config = awsConfig;
        break;
      case 'jira':
        config = jiraConfig;
        break;
    }

    if (!config || Object.values(config).some(v => !v)) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.promise(
      connectIntegration(type, config),
      {
        loading: `Connecting to ${type.toUpperCase()}...`,
        success: `Successfully connected to ${type.toUpperCase()}!`,
        error: `Failed to connect to ${type.toUpperCase()}`
      }
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'connecting':
        return <Clock className="h-4 w-4 text-warning animate-spin" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-success">Connected</Badge>;
      case 'connecting':
        return <Badge variant="secondary">Connecting...</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Disconnected</Badge>;
    }
  };

  const GitHubConnectionDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect GitHub</DialogTitle>
          <DialogDescription>
            Connect your GitHub organization to scan repositories for security compliance
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="github-token">Personal Access Token</Label>
            <Input
              id="github-token"
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={githubConfig.token}
              onChange={(e) => setGithubConfig(prev => ({ ...prev, token: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Token requires: repo, admin:org, user permissions
            </p>
          </div>
          <div>
            <Label htmlFor="github-org">Organization Name</Label>
            <Input
              id="github-org"
              placeholder="your-organization"
              value={githubConfig.org}
              onChange={(e) => setGithubConfig(prev => ({ ...prev, org: e.target.value }))}
            />
          </div>
          <Button onClick={() => handleConnect('github')} className="w-full">
            Connect GitHub
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const AWSConnectionDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect AWS</DialogTitle>
          <DialogDescription>
            Connect your AWS account to scan infrastructure for compliance issues
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="aws-key">Access Key ID</Label>
            <Input
              id="aws-key"
              placeholder="AKIAIOSFODNN7EXAMPLE"
              value={awsConfig.accessKey}
              onChange={(e) => setAwsConfig(prev => ({ ...prev, accessKey: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="aws-secret">Secret Access Key</Label>
            <Input
              id="aws-secret"
              type="password"
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              value={awsConfig.secretKey}
              onChange={(e) => setAwsConfig(prev => ({ ...prev, secretKey: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="aws-region">Default Region</Label>
            <Input
              id="aws-region"
              placeholder="us-east-1"
              value={awsConfig.region}
              onChange={(e) => setAwsConfig(prev => ({ ...prev, region: e.target.value }))}
            />
          </div>
          <Button onClick={() => handleConnect('aws')} className="w-full">
            Connect AWS
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const JiraConnectionDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Jira</DialogTitle>
          <DialogDescription>
            Connect Jira to automatically create tickets for security findings
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="jira-url">Jira Instance URL</Label>
            <Input
              id="jira-url"
              placeholder="https://yourcompany.atlassian.net"
              value={jiraConfig.url}
              onChange={(e) => setJiraConfig(prev => ({ ...prev, url: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="jira-email">Email</Label>
            <Input
              id="jira-email"
              type="email"
              placeholder="user@yourcompany.com"
              value={jiraConfig.email}
              onChange={(e) => setJiraConfig(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="jira-token">API Token</Label>
            <Input
              id="jira-token"
              type="password"
              placeholder="Your Jira API token"
              value={jiraConfig.token}
              onChange={(e) => setJiraConfig(prev => ({ ...prev, token: e.target.value }))}
            />
          </div>
          <Button onClick={() => handleConnect('jira')} className="w-full">
            Connect Jira
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const canScan = connectedCount > 0 && !isScanning;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Integrations</h1>
          <p className="text-muted-foreground">
            Connect your tools and services to enable automated compliance monitoring
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* GitHub Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center">
                    <Github className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">GitHub</CardTitle>
                    <CardDescription>Repository scanning</CardDescription>
                  </div>
                </div>
                {getStatusIcon(integrations.find(i => i.type === 'github')?.status || 'disconnected')}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getStatusBadge(integrations.find(i => i.type === 'github')?.status || 'disconnected')}
                
                {integrations.find(i => i.type === 'github')?.status === 'connected' ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Connected to: {integrations.find(i => i.type === 'github')?.config?.org}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => disconnectIntegration(integrations.find(i => i.type === 'github')?.id || '')}
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <GitHubConnectionDialog />
                )}

                {integrations.find(i => i.type === 'github')?.error && (
                  <p className="text-sm text-destructive">
                    {integrations.find(i => i.type === 'github')?.error}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AWS Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                    <Cloud className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AWS</CardTitle>
                    <CardDescription>Infrastructure scanning</CardDescription>
                  </div>
                </div>
                {getStatusIcon(integrations.find(i => i.type === 'aws')?.status || 'disconnected')}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getStatusBadge(integrations.find(i => i.type === 'aws')?.status || 'disconnected')}
                
                {integrations.find(i => i.type === 'aws')?.status === 'connected' ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Region: {integrations.find(i => i.type === 'aws')?.config?.region}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => disconnectIntegration(integrations.find(i => i.type === 'aws')?.id || '')}
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <AWSConnectionDialog />
                )}

                {integrations.find(i => i.type === 'aws')?.error && (
                  <p className="text-sm text-destructive">
                    {integrations.find(i => i.type === 'aws')?.error}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Jira Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Jira</CardTitle>
                    <CardDescription>Issue tracking</CardDescription>
                  </div>
                </div>
                {getStatusIcon(integrations.find(i => i.type === 'jira')?.status || 'disconnected')}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getStatusBadge(integrations.find(i => i.type === 'jira')?.status || 'disconnected')}
                
                {integrations.find(i => i.type === 'jira')?.status === 'connected' ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Connected to Jira instance
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => disconnectIntegration(integrations.find(i => i.type === 'jira')?.id || '')}
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <JiraConnectionDialog />
                )}

                {integrations.find(i => i.type === 'jira')?.error && (
                  <p className="text-sm text-destructive">
                    {integrations.find(i => i.type === 'jira')?.error}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scan Control */}
        <Card>
          <CardHeader>
            <CardTitle>Security Scan</CardTitle>
            <CardDescription>
              Run a comprehensive security scan across all connected integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {connectedCount} of {integrations.length} integrations connected
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {canScan ? 'Ready to scan' : isScanning ? scanStatus : 'Connect at least one integration to start scanning'}
                  </p>
                </div>
                <Button 
                  onClick={startScan} 
                  disabled={!canScan}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {isScanning ? 'Scanning...' : 'Start Scan'}
                </Button>
              </div>

              {isScanning && (
                <div className="space-y-2">
                  <Progress value={scanProgress} />
                  <p className="text-sm text-muted-foreground">{scanStatus}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default IntegrationsDetailed;