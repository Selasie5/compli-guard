import { create } from 'zustand';

interface Integration {
  id: string;
  type: 'github' | 'aws' | 'jira';
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  config?: any;
  lastSync?: Date;
  error?: string;
}

interface IntegrationsStore {
  integrations: Integration[];
  isScanning: boolean;
  scanProgress: number;
  scanStatus: string;
  findings: any[];
  connectIntegration: (type: Integration['type'], config: any) => Promise<void>;
  disconnectIntegration: (id: string) => void;
  startScan: () => Promise<void>;
}

export const useIntegrations = create<IntegrationsStore>((set, get) => ({
  integrations: [
    { id: '1', type: 'github', status: 'disconnected' },
    { id: '2', type: 'aws', status: 'disconnected' },
    { id: '3', type: 'jira', status: 'disconnected' },
  ],
  isScanning: false,
  scanProgress: 0,
  scanStatus: 'Ready to scan',
  findings: [],

  connectIntegration: async (type, config) => {
    const integrations = get().integrations;
    const integration = integrations.find(i => i.type === type);
    
    if (!integration) return;

    // Update to connecting status
    set({
      integrations: integrations.map(i => 
        i.type === type 
          ? { ...i, status: 'connecting', config }
          : i
      )
    });

    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success/failure
    const success = Math.random() > 0.1; // 90% success rate

    set({
      integrations: integrations.map(i => 
        i.type === type 
          ? { 
              ...i, 
              status: success ? 'connected' : 'error',
              config: success ? config : undefined,
              lastSync: success ? new Date() : undefined,
              error: success ? undefined : 'Connection failed. Please check your credentials.'
            }
          : i
      )
    });
  },

  disconnectIntegration: (id) => {
    set({
      integrations: get().integrations.map(i => 
        i.id === id 
          ? { ...i, status: 'disconnected', config: undefined, lastSync: undefined, error: undefined }
          : i
      )
    });
  },

  startScan: async () => {
    const connectedIntegrations = get().integrations.filter(i => i.status === 'connected');
    if (connectedIntegrations.length === 0) return;

    set({ isScanning: true, scanProgress: 0, scanStatus: 'Initializing scan...' });

    // Simulate scan progress
    const steps = [
      { progress: 10, status: 'Connecting to integrations...' },
      { progress: 25, status: 'Scanning GitHub repositories...' },
      { progress: 45, status: 'Analyzing AWS configuration...' },
      { progress: 65, status: 'Checking security policies...' },
      { progress: 80, status: 'Generating compliance report...' },
      { progress: 95, status: 'Finalizing results...' },
      { progress: 100, status: 'Scan completed!' },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      set({ scanProgress: step.progress, scanStatus: step.status });
    }

    // Generate sample findings
    const sampleFindings = [
      {
        id: '1',
        severity: 'high',
        control: 'CC6.1 - Access Management',
        resource: 'GitHub Repository: main-app',
        description: 'Branch protection rules not enforced on main branch',
        status: 'open',
        evidence: 'No required reviews or status checks configured'
      },
      {
        id: '2',
        severity: 'medium',
        control: 'CC6.7 - Encryption',
        resource: 'AWS S3: user-uploads-bucket',
        description: 'S3 bucket encryption not enabled',
        status: 'open',
        evidence: 'Default encryption disabled for sensitive data bucket'
      },
      {
        id: '3',
        severity: 'low',
        control: 'CC7.1 - System Monitoring',
        resource: 'AWS CloudTrail',
        description: 'CloudTrail logging gaps detected',
        status: 'open',
        evidence: 'Missing logs for 2-hour period on 2024-01-15'
      }
    ];

    set({ 
      findings: sampleFindings, 
      isScanning: false, 
      scanStatus: 'Ready to scan' 
    });
  },
}));