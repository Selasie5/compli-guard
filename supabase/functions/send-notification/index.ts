import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  user_id: string;
  type: 'scan_complete' | 'security_alert';
  data: {
    findings_count?: number;
    critical_findings?: number;
    high_findings?: number;
    scan_id?: string;
    finding_details?: any;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { user_id, type, data }: NotificationRequest = await req.json();

    // Get user profile and notification preferences
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const notifications = (profile.notification_preferences as any) || {};
    
    // Check if user wants email notifications for this type
    const shouldSendEmail = notifications.email !== false && 
      (type === 'scan_complete' ? notifications.scan_complete !== false : notifications.security_alerts !== false);

    if (!shouldSendEmail) {
      return new Response(
        JSON.stringify({ message: 'Email notifications disabled for this type' }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    let subject = '';
    let htmlContent = '';

    if (type === 'scan_complete') {
      subject = 'Security Scan Completed - CompliGuard';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin: 0;">🛡️ CompliGuard</h1>
            <p style="color: #6b7280; margin: 5px 0;">Security Compliance Platform</p>
          </div>
          
          <div style="background: #f9fafb; padding: 25px; border-radius: 8px; border-left: 4px solid #10b981;">
            <h2 style="color: #065f46; margin: 0 0 15px 0;">Security Scan Completed</h2>
            <p style="color: #374151; margin: 0 0 20px 0;">Hello ${profile.display_name || profile.email},</p>
            <p style="color: #374151; margin: 0 0 20px 0;">Your security compliance scan has been completed successfully.</p>
            
            <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0;">Scan Results</h3>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="color: #6b7280;">Total Findings:</span>
                <strong style="color: #1f2937;">${data.findings_count || 0}</strong>
              </div>
              ${data.critical_findings ? `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="color: #dc2626;">Critical:</span>
                <strong style="color: #dc2626;">${data.critical_findings}</strong>
              </div>
              ` : ''}
              ${data.high_findings ? `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="color: #ea580c;">High:</span>
                <strong style="color: #ea580c;">${data.high_findings}</strong>
              </div>
              ` : ''}
            </div>

            <p style="color: #374151; margin: 20px 0;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com') || 'https://compligaurd.app'}/findings" 
                 style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Detailed Results
              </a>
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              This email was sent because you have scan completion notifications enabled.
              <br>
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com') || 'https://compligaurd.app'}/profile" style="color: #3b82f6;">Manage notification preferences</a>
            </p>
          </div>
        </div>
      `;
    } else if (type === 'security_alert') {
      subject = '🚨 Critical Security Alert - CompliGuard';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin: 0;">🛡️ CompliGuard</h1>
            <p style="color: #6b7280; margin: 5px 0;">Security Compliance Platform</p>
          </div>
          
          <div style="background: #fef2f2; padding: 25px; border-radius: 8px; border-left: 4px solid #dc2626;">
            <h2 style="color: #991b1b; margin: 0 0 15px 0;">🚨 Critical Security Alert</h2>
            <p style="color: #374151; margin: 0 0 20px 0;">Hello ${profile.display_name || profile.email},</p>
            <p style="color: #374151; margin: 0 0 20px 0;">
              A critical security issue has been detected in your environment that requires immediate attention.
            </p>
            
            ${data.finding_details ? `
            <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #fecaca;">
              <h3 style="color: #dc2626; margin: 0 0 15px 0;">Finding Details</h3>
              <div style="margin-bottom: 10px;">
                <strong style="color: #1f2937;">Control:</strong> ${data.finding_details.control || 'Unknown'}
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="color: #1f2937;">Resource:</strong> ${data.finding_details.resource || 'Unknown'}
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="color: #1f2937;">Description:</strong> ${data.finding_details.description || 'No description available'}
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="color: #1f2937;">Severity:</strong> 
                <span style="color: #dc2626; font-weight: bold;">${data.finding_details.severity || 'Unknown'}</span>
              </div>
            </div>
            ` : ''}

            <p style="color: #374151; margin: 20px 0;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com') || 'https://compligaurd.app'}/findings" 
                 style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View & Resolve Issue
              </a>
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              This email was sent because you have security alert notifications enabled.
              <br>
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com') || 'https://compligaurd.app'}/profile" style="color: #3b82f6;">Manage notification preferences</a>
            </p>
          </div>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "CompliGuard <notifications@resend.dev>",
      to: [profile.email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      email_id: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);