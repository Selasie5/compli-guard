import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSecurityAlerts = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Listen for new critical findings
    const channel = supabase
      .channel('security-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scan_results',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          const finding = payload.new;
          
          // Check if it's a critical or high severity finding
          if (finding.severity === 'critical' || finding.severity === 'high') {
            try {
              // Get user's notification preferences
              const { data: profile } = await supabase
                .from('profiles')
                .select('notification_preferences')
                .eq('user_id', user.id)
                .single();

              const notifications = (profile?.notification_preferences as any) || {};
              
              // Send email alert for critical findings
              if (finding.severity === 'critical' && 
                  notifications.email !== false && 
                  notifications.security_alerts !== false) {
                await supabase.functions.invoke('send-notification', {
                  body: {
                    user_id: user.id,
                    type: 'security_alert',
                    data: {
                      finding_details: {
                        control: finding.control,
                        resource: finding.resource,
                        description: finding.description,
                        severity: finding.severity,
                      },
                    },
                  },
                });
              }

              // Send browser notification
              if (notifications.browser !== false && 
                  notifications.security_alerts !== false) {
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification(
                    `${finding.severity === 'critical' ? '🚨 Critical' : '⚠️ High'} Security Alert`,
                    {
                      body: finding.description || 'A security issue was detected',
                      icon: '/favicon.ico',
                      badge: '/favicon.ico',
                      tag: 'security-alert',
                    }
                  );
                }
              }
            } catch (error) {
              console.error('Error sending security alert:', error);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
};