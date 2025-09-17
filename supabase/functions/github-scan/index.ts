import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  pushed_at: string;
}

interface BranchProtection {
  required_status_checks: any;
  enforce_admins: boolean;
  required_pull_request_reviews: any;
  restrictions: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { integrationId, scanId, githubToken, userId } = await req.json();
    
    console.log('Starting GitHub scan for integration:', integrationId);

    // Create scan session
    const { data: scanSession, error: scanError } = await supabaseClient
      .from('scan_sessions')
      .insert({
        id: scanId,
        user_id: userId,
        status: 'running',
        current_step: 'Fetching repositories',
        progress: 10,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (scanError) {
      console.error('Error creating scan session:', scanError);
      throw scanError;
    }

    // Fetch user's repositories
    const reposResponse = await fetch('https://api.github.com/user/repos?per_page=100', {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CompliGuard-Scanner'
      }
    });

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const repos: GitHubRepo[] = await reposResponse.json();
    console.log(`Found ${repos.length} repositories`);

    // Update progress
    await supabaseClient
      .from('scan_sessions')
      .update({
        current_step: 'Analyzing repository security',
        progress: 30
      })
      .eq('id', scanId);

    const findings = [];
    let processedRepos = 0;

    for (const repo of repos.slice(0, 10)) { // Limit to first 10 repos for demo
      try {
        console.log(`Scanning repository: ${repo.full_name}`);
        
        // Check branch protection
        const branchProtectionResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/branches/${repo.default_branch}/protection`,
          {
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'CompliGuard-Scanner'
            }
          }
        );

        if (branchProtectionResponse.status === 404) {
          // No branch protection
          findings.push({
            user_id: userId,
            integration_id: integrationId,
            scan_id: scanId,
            severity: 'high',
            control: 'CC6.1 - Access Management',
            resource: `GitHub Repository: ${repo.name}`,
            description: 'Branch protection rules not enforced on main branch',
            evidence: {
              repository: repo.full_name,
              branch: repo.default_branch,
              protection_enabled: false
            },
            can_autofix: true
          });
        } else if (branchProtectionResponse.ok) {
          const protection: BranchProtection = await branchProtectionResponse.json();
          
          // Check if required reviews are enforced
          if (!protection.required_pull_request_reviews) {
            findings.push({
              user_id: userId,
              integration_id: integrationId,
              scan_id: scanId,
              severity: 'medium',
              control: 'CC6.1 - Access Management',
              resource: `GitHub Repository: ${repo.name}`,
              description: 'Required pull request reviews not configured',
              evidence: {
                repository: repo.full_name,
                branch: repo.default_branch,
                required_reviews: false
              },
              can_autofix: true
            });
          }

          // Check admin enforcement
          if (!protection.enforce_admins) {
            findings.push({
              user_id: userId,
              integration_id: integrationId,
              scan_id: scanId,
              severity: 'medium',
              control: 'CC6.1 - Access Management',
              resource: `GitHub Repository: ${repo.name}`,
              description: 'Admin enforcement not enabled for branch protection',
              evidence: {
                repository: repo.full_name,
                branch: repo.default_branch,
                enforce_admins: false
              },
              can_autofix: false
            });
          }
        }

        // Check if repository is public but contains sensitive files
        if (!repo.private) {
          const sensitiveFiles = ['.env', 'config.json', 'secrets.yml', 'credentials.json'];
          
          for (const fileName of sensitiveFiles) {
            const fileResponse = await fetch(
              `https://api.github.com/repos/${repo.full_name}/contents/${fileName}`,
              {
                headers: {
                  'Authorization': `Bearer ${githubToken}`,
                  'Accept': 'application/vnd.github.v3+json',
                  'User-Agent': 'CompliGuard-Scanner'
                }
              }
            );

            if (fileResponse.ok) {
              findings.push({
                user_id: userId,
                integration_id: integrationId,
                scan_id: scanId,
                severity: 'critical',
                control: 'CC6.7 - Encryption',
                resource: `GitHub Repository: ${repo.name}`,
                description: `Sensitive file "${fileName}" exposed in public repository`,
                evidence: {
                  repository: repo.full_name,
                  file: fileName,
                  public_repository: true
                },
                can_autofix: false
              });
            }
          }
        }

        processedRepos++;
        const progress = 30 + (processedRepos / Math.min(repos.length, 10)) * 50;
        
        await supabaseClient
          .from('scan_sessions')
          .update({
            current_step: `Analyzed ${processedRepos} of ${Math.min(repos.length, 10)} repositories`,
            progress: Math.round(progress)
          })
          .eq('id', scanId);

      } catch (repoError) {
        console.error(`Error scanning repo ${repo.full_name}:`, repoError);
      }
    }

    // Insert all findings
    if (findings.length > 0) {
      const { error: findingsError } = await supabaseClient
        .from('scan_results')
        .insert(findings);

      if (findingsError) {
        console.error('Error inserting findings:', findingsError);
      }
    }

    // Complete the scan
    await supabaseClient
      .from('scan_sessions')
      .update({
        status: 'completed',
        current_step: 'Scan completed',
        progress: 100,
        completed_at: new Date().toISOString(),
        total_findings: findings.length
      })
      .eq('id', scanId);

    console.log(`Scan completed with ${findings.length} findings`);

    return new Response(
      JSON.stringify({
        success: true,
        findingsCount: findings.length,
        repositoriesScanned: processedRepos
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in github-scan function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});