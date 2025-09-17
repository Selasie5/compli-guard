import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

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
  loadIntegrations: () => Promise<void>;
  connectIntegration: (type: Integration['type'], config: any) => Promise<void>;
  disconnectIntegration: (id: string) => void;
  startScan: () => Promise<void>;
  pollScanProgress: (scanId: string) => Promise<void>;
}

export const useIntegrations = create<IntegrationsStore>((set, get) => ({
  integrations: [],
  isScanning: false,
  scanProgress: 0,
  scanStatus: 'Ready to scan',
  findings: [],

  loadIntegrations: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get integrations from database
    const { data: dbIntegrations } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id);

    // Create default integrations if none exist
    const integrationTypes = ['github', 'aws', 'jira'] as const;
    const existingTypes = dbIntegrations?.map(i => i.type) || [];
    
    for (const type of integrationTypes) {
      if (!existingTypes.includes(type)) {
        await supabase
          .from('integrations')
          .insert({
            user_id: user.id,
            type,
            status: 'disconnected'
          });
      }
    }

    // Reload integrations
    const { data: allIntegrations } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id);

    const formattedIntegrations = allIntegrations?.map(integration => ({
      id: integration.id,
      type: integration.type as Integration['type'],
      status: integration.status as Integration['status'],
      config: integration.config,
      lastSync: integration.last_sync ? new Date(integration.last_sync) : undefined,
      error: integration.error_message
    })) || [];

    set({ integrations: formattedIntegrations });

    // Load findings
    const { data: scanResults } = await supabase
      .from('scan_results')
      .select('*')
      .eq('user_id', user.id);

    set({ findings: scanResults || [] });
  },

  connectIntegration: async (type, config) => {
    console.log('🔧 connectIntegration called with:', { type, config });
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('👤 Current user:', user?.id, userError);
    
    if (!user) {
      console.error('❌ No authenticated user found');
      throw new Error('You must be logged in to connect integrations');
    }

    const integrations = get().integrations;
    const integration = integrations.find(i => i.type === type);
    console.log('🔍 Found integration:', integration);
    
    if (!integration) {
      console.error('❌ Integration not found for type:', type);
      throw new Error(`Integration type ${type} not found`);
    }

    console.log('📡 Updating integration status to connecting...');
    // Update to connecting status
    set({
      integrations: integrations.map(i => 
        i.type === type 
          ? { ...i, status: 'connecting', config }
          : i
      )
    });

    try {
      console.log('💾 Updating integration in database...');
      // Update integration in database
      const { error } = await supabase
        .from('integrations')
        .update({
          status: 'connected',
          config,
          credentials: { token: config.token },
          last_sync: new Date().toISOString(),
          error_message: null
        })
        .eq('id', integration.id);

      if (error) {
        console.error('❌ Database update error:', error);
        throw error;
      }

      console.log('✅ Database updated successfully, updating local state...');
      set({
        integrations: integrations.map(i => 
          i.type === type 
            ? { 
                ...i, 
                status: 'connected',
                config,
                lastSync: new Date(),
                error: undefined
              }
            : i
        )
      });
      
      console.log('✅ Integration connected successfully!');
    } catch (error) {
      console.error('❌ Failed to connect integration:', error);
      
      // Update database with error status
      await supabase
        .from('integrations')
        .update({
          status: 'error',
          error_message: error.message || 'Connection failed. Please check your credentials.'
        })
        .eq('id', integration.id);

      // Update local state with error
      set({
        integrations: integrations.map(i => 
          i.type === type 
            ? { 
                ...i, 
                status: 'error',
                error: error.message || 'Connection failed. Please check your credentials.'
              }
            : i
        )
      });
      
      // Re-throw the error so the UI can handle it
      throw error;
    }
  },

  disconnectIntegration: async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('integrations')
      .update({
        status: 'disconnected',
        config: null,
        credentials: null,
        last_sync: null,
        error_message: null
      })
      .eq('id', id);

    set({
      integrations: get().integrations.map(i => 
        i.id === id 
          ? { ...i, status: 'disconnected', config: undefined, lastSync: undefined, error: undefined }
          : i
      )
    });
  },

  startScan: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const connectedIntegrations = get().integrations.filter(i => i.status === 'connected');
    if (connectedIntegrations.length === 0) return;

    set({ isScanning: true, scanProgress: 0, scanStatus: 'Initializing scan...' });

    try {
      // Start scan for GitHub integration
      const githubIntegration = connectedIntegrations.find(i => i.type === 'github');
      if (githubIntegration && githubIntegration.config?.token) {
        const scanId = crypto.randomUUID();
        
        // Start the scan via edge function
        const { error } = await supabase.functions.invoke('github-scan', {
          body: {
            integrationId: githubIntegration.id,
            scanId,
            githubToken: githubIntegration.config.token,
            userId: user.id
          }
        });

        if (error) {
          console.error('Scan failed:', error);
          set({ 
            isScanning: false, 
            scanStatus: 'Scan failed: ' + error.message 
          });
          return;
        }

        // Poll for progress updates
        get().pollScanProgress(scanId);
      }
    } catch (error) {
      console.error('Failed to start scan:', error);
      set({ 
        isScanning: false, 
        scanStatus: 'Failed to start scan' 
      });
    }
  },

  pollScanProgress: async (scanId: string) => {
    const pollInterval = setInterval(async () => {
      const { data: scanSession } = await supabase
        .from('scan_sessions')
        .select('*')
        .eq('id', scanId)
        .single();

      if (scanSession) {
        set({
          scanProgress: scanSession.progress || 0,
          scanStatus: scanSession.current_step || 'Scanning...'
        });

        if (scanSession.status === 'completed') {
          clearInterval(pollInterval);
          
          // Reload findings
          get().loadIntegrations();
          
          set({ 
            isScanning: false, 
            scanStatus: 'Ready to scan' 
          });
        } else if (scanSession.status === 'error') {
          clearInterval(pollInterval);
          set({ 
            isScanning: false, 
            scanStatus: 'Scan failed: ' + scanSession.error_message 
          });
        }
      }
    }, 2000);

    // Stop polling after 5 minutes as a safety measure
    setTimeout(() => clearInterval(pollInterval), 300000);
  },
}));