import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Github, 
  Cloud, 
  Zap, 
  Shield, 
  Key, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

const Documentation = () => {
  const [showGitHubToken, setShowGitHubToken] = useState(false);
  const [showAWSSecret, setShowAWSSecret] = useState(false);
  const [showJiraToken, setShowJiraToken] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const CredentialSection = ({ 
    title, 
    icon: Icon, 
    children, 
    color 
  }: { 
    title: string; 
    icon: any; 
    children: React.ReactNode;
    color: string;
  }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            CompliGuard Documentation
          </h1>
          <p className="text-muted-foreground">
            Complete guide to setting up and using CompliGuard for SOC 2 compliance automation
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>What is CompliGuard?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  CompliGuard is an enterprise-grade compliance automation platform that helps organizations 
                  achieve and maintain SOC 2 compliance through continuous monitoring, automated scanning, 
                  and intelligent remediation suggestions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Key Benefits
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                      <li>• Reduce SOC 2 readiness time from months to weeks</li>
                      <li>• Continuous compliance monitoring</li>
                      <li>• Automated security scanning</li>
                      <li>• AI-powered policy generation</li>
                      <li>• Evidence collection and export</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      SOC 2 Controls Covered
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">CC6.1 - Access Management</Badge>
                      <Badge variant="outline">CC6.7 - Encryption</Badge>
                      <Badge variant="outline">CC7.1 - Monitoring</Badge>
                      <Badge variant="outline">CC8.1 - Change Management</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="getting-started">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start Guide</CardTitle>
                  <CardDescription>Get up and running with CompliGuard in 5 minutes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-medium">Sign In</h4>
                        <p className="text-sm text-muted-foreground">Use any email and password to access the demo</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-medium">Connect Integrations</h4>
                        <p className="text-sm text-muted-foreground">Set up GitHub, AWS, and Jira connections (see Integrations tab for details)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-medium">Run Your First Scan</h4>
                        <p className="text-sm text-muted-foreground">Navigate to Integrations and click "Start Scan" to begin compliance monitoring</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h4 className="font-medium">Review Findings</h4>
                        <p className="text-sm text-muted-foreground">Check the Dashboard and Findings pages for security issues and recommendations</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Navigation Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <h4 className="font-medium">📊 Dashboard</h4>
                      <p className="text-muted-foreground">Compliance score, recent findings, and integration status</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">🔍 Findings</h4>
                      <p className="text-muted-foreground">Detailed security issues with auto-fix suggestions</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">📋 Policies</h4>
                      <p className="text-muted-foreground">AI-generated compliance policies and documentation</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">📥 Evidence</h4>
                      <p className="text-muted-foreground">Export compliance evidence for auditors</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">⚙️ Integrations</h4>
                      <p className="text-muted-foreground">Connect GitHub, AWS, Jira and run scans</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">📖 Documentation</h4>
                      <p className="text-muted-foreground">This comprehensive guide and setup instructions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Setup Guide</CardTitle>
                  <CardDescription>Detailed instructions for connecting your services to CompliGuard</CardDescription>
                </CardHeader>
              </Card>

              <CredentialSection
                title="GitHub Integration"
                icon={Github}
                color="bg-slate-900"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">What you'll need:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Personal Access Token with appropriate permissions</li>
                      <li>• Organization name or username</li>
                      <li>• Admin access to repositories you want to scan</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Step 1: Create a Personal Access Token</h4>
                    <div className="space-y-3 text-sm">
                      <div className="bg-muted p-3 rounded-md">
                        <p className="font-medium mb-2">1. Go to GitHub Settings</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('https://github.com/settings/tokens', '_blank')}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open GitHub Token Settings
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <p>2. Click "Generate new token" → "Generate new token (classic)"</p>
                        <p>3. Give it a descriptive name like "CompliGuard Integration"</p>
                        <p>4. Select the following scopes:</p>
                        <div className="ml-4 space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">repo</Badge>
                            <span className="text-muted-foreground">- Full repository access</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">admin:org</Badge>
                            <span className="text-muted-foreground">- Organization permissions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">user</Badge>
                            <span className="text-muted-foreground">- User profile access</span>
                          </div>
                        </div>
                        <p>5. Click "Generate token" and copy the token immediately</p>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div className="text-yellow-800 dark:text-yellow-200">
                            <p className="font-medium">Important:</p>
                            <p className="text-sm">Save your token immediately! GitHub will only show it once for security reasons.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Step 2: Example Token Format</h4>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm flex items-center justify-between">
                      <span className={showGitHubToken ? "" : "blur-sm select-none"}>
                        ghp_1234567890abcdefghijklmnopqrstuvwxyz
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowGitHubToken(!showGitHubToken)}
                        >
                          {showGitHubToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("ghp_1234567890abcdefghijklmnopqrstuvwxyz", "Example token")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CredentialSection>

              <CredentialSection
                title="AWS Integration"
                icon={Cloud}
                color="bg-orange-500"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">What you'll need:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• AWS Access Key ID</li>
                      <li>• AWS Secret Access Key</li>
                      <li>• Appropriate IAM permissions for compliance scanning</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Step 1: Create IAM User</h4>
                    <div className="space-y-3 text-sm">
                      <div className="bg-muted p-3 rounded-md">
                        <p className="font-medium mb-2">1. Open AWS IAM Console</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('https://console.aws.amazon.com/iam/', '_blank')}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open AWS IAM Console
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <p>2. Navigate to Users → Add User</p>
                        <p>3. Create user named "compliguard-scanner"</p>
                        <p>4. Attach the following managed policies:</p>
                        <div className="ml-4 space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">SecurityAudit</Badge>
                            <span className="text-muted-foreground">- Read-only security scanning</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">ViewOnlyAccess</Badge>
                            <span className="text-muted-foreground">- General read permissions</span>
                          </div>
                        </div>
                        <p>5. Generate Access Keys in Security Credentials tab</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Step 2: Example Credentials</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Access Key ID:</Label>
                        <div className="bg-muted p-3 rounded-md font-mono text-sm flex items-center justify-between mt-1">
                          <span>AKIAIOSFODNN7EXAMPLE</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard("AKIAIOSFODNN7EXAMPLE", "Access Key ID")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Secret Access Key:</Label>
                        <div className="bg-muted p-3 rounded-md font-mono text-sm flex items-center justify-between mt-1">
                          <span className={showAWSSecret ? "" : "blur-sm select-none"}>
                            wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowAWSSecret(!showAWSSecret)}
                            >
                              {showAWSSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard("wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY", "Secret Key")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CredentialSection>

              <CredentialSection
                title="Jira Integration"
                icon={Zap}
                color="bg-blue-600"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">What you'll need:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Jira instance URL (Cloud or Server)</li>
                      <li>• Email address associated with Jira account</li>
                      <li>• API Token for authentication</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Step 1: Generate API Token</h4>
                    <div className="space-y-3 text-sm">
                      <div className="bg-muted p-3 rounded-md">
                        <p className="font-medium mb-2">1. Go to Atlassian Account Settings</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('https://id.atlassian.com/manage-profile/security/api-tokens', '_blank')}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open Atlassian API Tokens
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <p>2. Click "Create API token"</p>
                        <p>3. Give it a label like "CompliGuard Integration"</p>
                        <p>4. Copy the generated token immediately</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Step 2: Connection Details</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Jira URL:</Label>
                        <div className="bg-muted p-3 rounded-md font-mono text-sm flex items-center justify-between mt-1">
                          <span>https://yourcompany.atlassian.net</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard("https://yourcompany.atlassian.net", "Jira URL")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">API Token:</Label>
                        <div className="bg-muted p-3 rounded-md font-mono text-sm flex items-center justify-between mt-1">
                          <span className={showJiraToken ? "" : "blur-sm select-none"}>
                            ATBBxxxxxxxxxxxxxxxxxx
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowJiraToken(!showJiraToken)}
                            >
                              {showJiraToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard("ATBBxxxxxxxxxxxxxxxxxx", "API Token")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CredentialSection>
            </div>
          </TabsContent>

          <TabsContent value="features">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Features</CardTitle>
                  <CardDescription>Comprehensive overview of CompliGuard's capabilities</CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔍 Continuous Scanning</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>• Real-time repository monitoring</p>
                    <p>• AWS infrastructure compliance checks</p>
                    <p>• Automated security policy validation</p>
                    <p>• Secret detection and remediation</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📊 Compliance Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>• Real-time compliance score</p>
                    <p>• Trend analysis and reporting</p>
                    <p>• Control gap identification</p>
                    <p>• Executive summary views</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🤖 AI-Powered Automation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>• Intelligent policy generation</p>
                    <p>• Automated remediation suggestions</p>
                    <p>• Risk assessment algorithms</p>
                    <p>• Smart evidence collection</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📋 Evidence Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>• Automated evidence collection</p>
                    <p>• Audit-ready report generation</p>
                    <p>• Historical compliance tracking</p>
                    <p>• Secure evidence storage</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="troubleshooting">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Common Issues & Solutions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">❌ Integration Connection Failures</h4>
                    <div className="space-y-2 text-sm text-muted-foreground ml-4">
                      <p><strong>GitHub:</strong> Verify token has correct permissions (repo, admin:org, user)</p>
                      <p><strong>AWS:</strong> Check IAM user has SecurityAudit and ViewOnlyAccess policies</p>
                      <p><strong>Jira:</strong> Ensure API token is valid and email matches Jira account</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">⚠️ Scanning Issues</h4>
                    <div className="space-y-2 text-sm text-muted-foreground ml-4">
                      <p>• Ensure at least one integration is connected before scanning</p>
                      <p>• Check that connected accounts have appropriate permissions</p>
                      <p>• Wait for previous scans to complete before starting new ones</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">🔐 Authentication Problems</h4>
                    <div className="space-y-2 text-sm text-muted-foreground ml-4">
                      <p>• Clear browser cache and cookies</p>
                      <p>• Ensure JavaScript is enabled</p>
                      <p>• Try incognito/private browsing mode</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">📞 Getting Help</h4>
                    <div className="space-y-2 text-sm text-muted-foreground ml-4">
                      <p>• Check the browser console for error messages</p>
                      <p>• Verify all required fields are filled correctly</p>
                      <p>• Contact support with specific error messages and steps to reproduce</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Supported Browsers</h4>
                      <ul className="space-y-1 text-muted-foreground ml-4">
                        <li>• Chrome 90+</li>
                        <li>• Firefox 88+</li>
                        <li>• Safari 14+</li>
                        <li>• Edge 90+</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Network Requirements</h4>
                      <ul className="space-y-1 text-muted-foreground ml-4">
                        <li>• HTTPS connection required</li>
                        <li>• Access to GitHub API (api.github.com)</li>
                        <li>• Access to AWS APIs</li>
                        <li>• Access to Atlassian APIs</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Documentation;