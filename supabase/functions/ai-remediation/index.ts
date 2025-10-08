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

    const systemPrompt = `You are a cybersecurity compliance expert. Analyze security findings and provide remediation guidance.

CRITICAL: Respond with ONLY valid JSON. No markdown, no code blocks, no extra text.

Return this exact JSON structure:
{
  "summary": "Brief 2-3 sentence overview of the issue and fix",
  "risk_analysis": "Detailed explanation of security risks and potential impact",
  "remediation_steps": [
    {
      "step": 1,
      "title": "Clear, actionable step title",
      "description": "Detailed step-by-step instructions",
      "code_example": "Actual code/command/config or null"
    }
  ],
  "prevention_tips": ["Specific actionable tip 1", "Specific tip 2"],
  "estimated_time": "Realistic estimate like 10-15 minutes",
  "difficulty": "easy|medium|hard",
  "compliance_references": ["Specific framework reference like CIS 1.2.3 or NIST 800-53 AC-2"]
}

Include 3-7 clear remediation steps with code examples where applicable.`;

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
    let aiResponse = data.choices[0].message.content;
    
    console.log('Raw AI response:', aiResponse);
    
    // Strip markdown code blocks if present (common AI behavior)
    aiResponse = aiResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Try to parse as JSON with better error handling
    let remediation;
    try {
      const parsed = JSON.parse(aiResponse);
      
      // Normalize the structure to ensure consistency
      remediation = {
        summary: parsed.summary || "AI-generated remediation guidance",
        risk_analysis: parsed.risk_analysis || parsed.risk || null,
        remediation_steps: Array.isArray(parsed.remediation_steps) 
          ? parsed.remediation_steps.map((step: any, idx: number) => ({
              step: step.step || idx + 1,
              title: step.title || `Step ${idx + 1}`,
              description: step.description || "",
              code_example: step.code_example || null
            }))
          : [],
        prevention_tips: Array.isArray(parsed.prevention_tips) ? parsed.prevention_tips : [],
        estimated_time: parsed.estimated_time || null,
        difficulty: parsed.difficulty || "medium",
        compliance_references: Array.isArray(parsed.compliance_references) ? parsed.compliance_references : []
      };
      
      console.log('Parsed and normalized remediation:', JSON.stringify(remediation, null, 2));
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      console.log('Attempted to parse:', aiResponse);
      
      // Fallback: wrap the text response in a basic structure
      remediation = {
        summary: "AI-generated remediation guidance",
        risk_analysis: aiResponse,
        remediation_steps: [{
          step: 1,
          title: "Review AI Guidance",
          description: aiResponse,
          code_example: null
        }],
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
