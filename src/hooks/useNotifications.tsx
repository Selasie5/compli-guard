import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationHook {
  requestPermission: () => Promise<boolean>;
  sendBrowserNotification: (title: string, options?: NotificationOptions) => void;
  sendEmailNotification: (type: 'scan_complete' | 'security_alert', data: any) => Promise<void>;
  isSupported: boolean;
  permission: NotificationPermission | null;
}

export const useNotifications = (): NotificationHook => {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendBrowserNotification = (title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== 'granted') return;

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Error sending browser notification:', error);
    }
  };

  const sendEmailNotification = async (
    type: 'scan_complete' | 'security_alert', 
    data: any
  ): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          user_id: user.id,
          type,
          data,
        },
      });

      if (error) {
        console.error('Error sending email notification:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to send email notification:', error);
      throw error;
    }
  };

  return {
    requestPermission,
    sendBrowserNotification,
    sendEmailNotification,
    isSupported,
    permission,
  };
};