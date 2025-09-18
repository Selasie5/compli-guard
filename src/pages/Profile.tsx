import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Settings, Bell, Shield, Camera, Save, Key, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";

const profileSchema = z.object({
  display_name: z.string().min(1, "Display name is required"),
  first_name: z.string().optional().or(z.literal('')),
  last_name: z.string().optional().or(z.literal('')),
  bio: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  role: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  timezone: z.string().min(1, "Timezone is required"),
});

const notificationSchema = z.object({
  email: z.boolean(),
  browser: z.boolean(),
  scan_complete: z.boolean(),
  security_alerts: z.boolean(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type NotificationFormData = z.infer<typeof notificationSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile = () => {
  const { user } = useAuth();
  const { requestPermission, sendBrowserNotification, permission, isSupported } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: '',
      first_name: '',
      last_name: '',
      bio: '',
      company: '',
      role: '',
      phone: '',
      timezone: 'UTC',
    },
  });

  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      email: true,
      browser: true,
      scan_complete: true,
      security_alerts: true,
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        toast.error(`Failed to load profile: ${error.message}`);
        return;
      }

      if (data) {
        setProfile(data);
        profileForm.reset({
          display_name: data.display_name || user.email || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          bio: data.bio || '',
          company: data.company || '',
          role: data.role || '',
          phone: data.phone || '',
          timezone: data.timezone || 'UTC',
        });

        const notifications = (data.notification_preferences as any) || {};
        notificationForm.reset({
          email: notifications.email !== false,
          browser: notifications.browser !== false,
          scan_complete: notifications.scan_complete !== false,
          security_alerts: notifications.security_alerts !== false,
        });
      } else {
        // No profile exists, create one
        await createProfile();
      }
    } catch (error: any) {
      console.error('Unexpected error loading profile:', error);
      toast.error(`Unexpected error: ${error.message || 'Unknown error'}`);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const profileData = {
        user_id: user.id,
        email: user.email,
        display_name: user.email || 'User',
        timezone: 'UTC',
        notification_preferences: {
          email: true,
          browser: true,
          scan_complete: true,
          security_alerts: true
        }
      };

      const { error } = await supabase
        .from('profiles')
        .insert(profileData);

      if (error) {
        console.error('Error creating profile:', error);
        toast.error(`Failed to create profile: ${error.message}`);
        return;
      }
      
      toast.success('Profile created successfully!');
      await loadProfile();
    } catch (error: any) {
      console.error('Unexpected error creating profile:', error);
      toast.error(`Failed to create profile: ${error.message || 'Unknown error'}`);
    }
  };

  const handleProfileSubmit = async (values: ProfileFormData) => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    setLoading(true);
    try {
      // Clean the data - convert empty strings to null for optional fields
      const cleanedData = {
        user_id: user.id,
        display_name: values.display_name.trim(),
        first_name: values.first_name?.trim() || null,
        last_name: values.last_name?.trim() || null,
        bio: values.bio?.trim() || null,
        company: values.company?.trim() || null,
        role: values.role?.trim() || null,
        phone: values.phone?.trim() || null,
        timezone: values.timezone || 'UTC',
        email: user.email,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(cleanedData, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Profile update error:', error);
        
        // Provide specific error messages based on error type
        if (error.code === '23505') {
          toast.error('A profile with this information already exists');
        } else if (error.code === '23502') {
          toast.error('Required field is missing. Please check all required fields are filled.');
        } else if (error.message.includes('row-level security')) {
          toast.error('Permission denied. Please ensure you are logged in properly.');
        } else {
          toast.error(`Failed to update profile: ${error.message}`);
        }
        return;
      }

      toast.success('Profile updated successfully!');
      await loadProfile();
    } catch (error: any) {
      console.error('Unexpected error updating profile:', error);
      toast.error(`Unexpected error: ${error.message || 'Please check your input and try again'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (values: NotificationFormData) => {
    if (!user) {
      toast.error('You must be logged in to update notification preferences');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_preferences: values,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Notification update error:', error);
        if (error.message.includes('row-level security')) {
          toast.error('Permission denied. Please ensure you are logged in properly.');
        } else {
          toast.error(`Failed to update notification preferences: ${error.message}`);
        }
        return;
      }

      toast.success('Notification preferences updated!');
      await loadProfile();

      // Request browser notification permission if enabled
      if (values.browser && isSupported && permission !== 'granted') {
        const granted = await requestPermission();
        if (granted) {
          sendBrowserNotification('Browser notifications enabled!', {
            body: 'You will now receive browser notifications for scans and security alerts.',
          });
        } else {
          toast.warning('Browser notification permission was denied. You can enable it later in your browser settings.');
        }
      }
    } catch (error: any) {
      console.error('Unexpected error updating notifications:', error);
      toast.error(`Unexpected error: ${error.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (values: PasswordFormData) => {
    if (!user) {
      toast.error('You must be logged in to change your password');
      return;
    }

    setLoading(true);
    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: values.current_password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          toast.error('Current password is incorrect');
        } else {
          toast.error(`Authentication error: ${signInError.message}`);
        }
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: values.new_password,
      });

      if (error) {
        if (error.message.includes('Password should be at least')) {
          toast.error('New password does not meet security requirements. Please use at least 6 characters.');
        } else {
          toast.error(`Failed to update password: ${error.message}`);
        }
        return;
      }

      toast.success('Password updated successfully!');
      passwordForm.reset();
      setPasswordDialogOpen(false);
    } catch (error: any) {
      console.error('Unexpected error updating password:', error);
      toast.error(`Unexpected error: ${error.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  const testNotifications = async () => {
    if (isSupported && permission === 'granted') {
      sendBrowserNotification('Test Notification', {
        body: 'This is a test notification from CompliGuard!',
        icon: '/favicon.ico',
      });
      toast.success('Test notification sent!');
    } else if (isSupported && permission !== 'granted') {
      const granted = await requestPermission();
      if (granted) {
        sendBrowserNotification('Notifications Enabled!', {
          body: 'Browser notifications are now enabled for CompliGuard.',
        });
      }
    } else {
      toast.error('Browser notifications are not supported');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const timezones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo',
    'Asia/Shanghai', 'Asia/Kolkata', 'Australia/Sydney'
  ];

  if (!user) {
    return <Layout><div>Please log in to view your profile.</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences. Fields marked with * are required.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {profile?.display_name ? getInitials(profile.display_name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">{profile?.display_name || user.email}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Button variant="outline" size="sm" disabled>
                    <Camera className="h-4 w-4 mr-2" />
                    Change Avatar (Coming Soon)
                  </Button>
                </div>
              </div>

              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="display_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your display name *" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            This is how your name will appear throughout the application
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone *" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timezones.map((tz) => (
                                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="Security Engineer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save Profile'}</span>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications about your security scans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(handleNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="browser"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Browser Notifications</FormLabel>
                            <FormDescription>
                              Show notifications in your browser
                              {isSupported && permission !== 'granted' && (
                                <span className="text-amber-600"> (Permission required)</span>
                              )}
                              {!isSupported && (
                                <span className="text-muted-foreground"> (Not supported)</span>
                              )}
                            </FormDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={testNotifications}
                              disabled={!isSupported}
                            >
                              Test
                            </Button>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!isSupported}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="scan_complete"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Scan Completion</FormLabel>
                            <FormDescription>
                              Notify when security scans are completed
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="security_alerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Security Alerts</FormLabel>
                            <FormDescription>
                              Notify about critical security findings
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Account Security</span>
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your account password
                  </p>
                </div>
                <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="current_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  >
                                    {showCurrentPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="new_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                  >
                                    {showNewPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="confirm_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPasswordDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Badge variant="outline">Not Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Login Sessions</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage your active login sessions
                  </p>
                </div>
                <Button variant="outline" disabled>
                  View Sessions (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;