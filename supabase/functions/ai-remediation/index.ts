import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { finding } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a cybersecurity compliance expert specializing in cloud security, infrastructure-as-code, and DevOps security. 
Your role is to provide actionable, step-by-step remediation guidance for security findings.

For each finding, provide:
1. Clear explanation of the security risk
2. Specific step-by-step remediation instructions
3. Code snippets or configuration examples where applicable
4. Best practices to prevent recurrence
5. Compliance framework references (e.g., CIS, NIST, SOC2)

Format your response as structured JSON with these fields:
{
  "summary": "Brief overview of the issue",
  "risk_analysis": "Detailed explanation of security risks",
  "remediation_steps": [
    {
      "step": 1,
      "title": "Step title",
      "description": "What to do",
      "code_example": "Optional code snippet"
    }
  ],
  "prevention_tips": ["Tip 1", "Tip 2"],
  "compliance_references": ["Framework 1", "Framework 2"],
  "estimated_time": "Time to fix",
  "difficulty": "easy|medium|hard"
}`;

    const userPrompt = `Provide detailed remediation guidance for this security finding:

Severity: ${finding.severity}
Control: ${finding.control}
Resource: ${finding.resource}
Description: ${finding.description}

${finding.evidence ? `Evidence: ${JSON.stringify(finding.evidence)}` : ''}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Try to parse as JSON, fallback to structured text
    let remediation;
    try {
      remediation = JSON.parse(aiResponse);
    } catch (e) {
      // If not valid JSON, structure it ourselves
      remediation = {
        summary: "AI-generated remediation guidance",
        risk_analysis: aiResponse,
        remediation_steps: [],
        prevention_tips: [],
        compliance_references: [],
        estimated_time: "Varies",
        difficulty: "medium"
      };
    }

    return new Response(
      JSON.stringify({ success: true, remediation }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in ai-remediation function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false 
      }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
