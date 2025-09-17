import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout";
import { LoadingButton } from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Github, Cloud, Zap, CheckCircle, XCircle, Clock, AlertCircle, Play } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import { toast } from "sonner";

const githubSchema = z.object({
  token: z.string().min(1, "Personal Access Token is required").regex(/^ghp_/, "Token must start with 'ghp_'"),
  org: z.string().min(1, "Organization name is required"),
});

const awsSchema = z.object({
  accessKey: z.string().min(1, "Access Key ID is required").min(16, "Access Key ID must be at least 16 characters"),
  secretKey: z.string().min(1, "Secret Access Key is required").min(40, "Secret Access Key must be at least 40 characters"),
  region: z.string().min(1, "Region is required"),
});

const jiraSchema = z.object({
  url: z.string().min(1, "Jira URL is required").url("Please enter a valid URL"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  token: z.string().min(1, "API Token is required"),
});

const IntegrationsDetailed = () => {
  const { 
    integrations, 
    isScanning, 
    scanProgress, 
    scanStatus, 
    connectIntegration, 
    disconnectIntegration,
    startScan,
    loadIntegrations 
  } = useIntegrations();

  const [connecting, setConnecting] = useState<string | null>(null);
  const [openGithub, setOpenGithub] = useState(false);
  const [openAws, setOpenAws] = useState(false);
  const [openJira, setOpenJira] = useState(false);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const githubForm = useForm<z.infer<typeof githubSchema>>({
    resolver: zodResolver(githubSchema),
    defaultValues: { token: '', org: '' },
  });

  const awsForm = useForm<z.infer<typeof awsSchema>>({
    resolver: zodResolver(awsSchema),
    defaultValues: { accessKey: '', secretKey: '', region: 'us-east-1' },
  });

  const jiraForm = useForm<z.infer<typeof jiraSchema>>({
    resolver: zodResolver(jiraSchema),
    defaultValues: { url: '', email: '', token: '' },
  });

  const handleGithubConnect = async (values: z.infer<typeof githubSchema>) => {
    console.log('🔄 Starting GitHub connection process...', values);
    setConnecting('github');
    
    try {
      // First validate the GitHub token
      console.log('🔍 Validating GitHub token...');
      const testResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${values.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CompliGuard-Scanner'
        }
      });

      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.error('❌ GitHub token validation failed:', testResponse.status, errorText);
        throw new Error(`Invalid GitHub token: ${testResponse.status === 401 ? 'Token is invalid or expired' : `HTTP ${testResponse.status}`}`);
      }

      const githubUser = await testResponse.json();
      console.log('✅ GitHub token validated for user:', githubUser.login);

      console.log('🔗 Calling connectIntegration...');
      await connectIntegration('github', values);
      console.log('✅ GitHub connection successful!');
      toast.success(`Successfully connected to GitHub as ${githubUser.login}!`);
      githubForm.reset();
      setOpenGithub(false);
    } catch (error) {
      console.error('❌ GitHub connection failed:', error);
      toast.error(`Failed to connect to GitHub: ${error.message || 'Unknown error'}`);
    } finally {
      console.log('🏁 GitHub connection process completed');
      setConnecting(null);
    }
  };

  const handleAwsConnect = async (values: z.infer<typeof awsSchema>) => {
    setConnecting('aws');
    try {
      await connectIntegration('aws', values);
      toast.success('Successfully connected to AWS!');
      awsForm.reset();
      setOpenAws(false);
    } catch (error) {
      toast.error('Failed to connect to AWS');
    } finally {
      setConnecting(null);
    }
  };

  const handleJiraConnect = async (values: z.infer<typeof jiraSchema>) => {
    setConnecting('jira');
    try {
      await connectIntegration('jira', values);
      toast.success('Successfully connected to Jira!');
      jiraForm.reset();
      setOpenJira(false);
    } catch (error) {
      toast.error('Failed to connect to Jira');
    } finally {
      setConnecting(null);
    }
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
    <Dialog open={openGithub} onOpenChange={setOpenGithub}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Connect GitHub</DialogTitle>
          <DialogDescription>
            Connect your GitHub organization to scan repositories for security compliance
          </DialogDescription>
        </DialogHeader>
        <Form {...githubForm}>
          <form onSubmit={githubForm.handleSubmit(handleGithubConnect)} className="space-y-4">
            <FormField
              control={githubForm.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Access Token</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Token requires: repo, admin:org, user permissions
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={githubForm.control}
              name="org"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your-organization"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton 
              type="submit"
              className="w-full"
              loading={connecting === 'github'}
              loadingText="Connecting..."
              disabled={connecting === 'github'}
            >
              Connect GitHub
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  const AWSConnectionDialog = () => (
    <Dialog open={openAws} onOpenChange={setOpenAws}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Connect AWS</DialogTitle>
          <DialogDescription>
            Connect your AWS account to scan infrastructure for compliance issues
          </DialogDescription>
        </DialogHeader>
        <Form {...awsForm}>
          <form onSubmit={awsForm.handleSubmit(handleAwsConnect)} className="space-y-4">
            <FormField
              control={awsForm.control}
              name="accessKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Key ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="AKIAIOSFODNN7EXAMPLE"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={awsForm.control}
              name="secretKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Access Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={awsForm.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Region</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="us-east-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton 
              type="submit"
              className="w-full"
              loading={connecting === 'aws'}
              loadingText="Connecting..."
            >
              Connect AWS
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  const JiraConnectionDialog = () => (
    <Dialog open={openJira} onOpenChange={setOpenJira}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Connect Jira</DialogTitle>
          <DialogDescription>
            Connect Jira to automatically create tickets for security findings
          </DialogDescription>
        </DialogHeader>
        <Form {...jiraForm}>
          <form onSubmit={jiraForm.handleSubmit(handleJiraConnect)} className="space-y-4">
            <FormField
              control={jiraForm.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jira Instance URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://yourcompany.atlassian.net"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={jiraForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@yourcompany.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={jiraForm.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Token</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your Jira API token"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton 
              type="submit"
              className="w-full"
              loading={connecting === 'jira'}
              loadingText="Connecting..."
            >
              Connect Jira
            </LoadingButton>
          </form>
        </Form>
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
                <LoadingButton 
                  onClick={startScan} 
                  disabled={!canScan}
                  className="flex items-center gap-2"
                  loading={isScanning}
                  loadingText="Scanning..."
                >
                  <Play className="h-4 w-4" />
                  Start Scan
                </LoadingButton>
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