-- Create integrations table to store connection credentials
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('github', 'aws', 'jira')),
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('disconnected', 'connecting', 'connected', 'error')),
  credentials JSONB,
  config JSONB,
  last_sync TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, type)
);

-- Create scan_results table to store security findings
CREATE TABLE public.scan_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  scan_id UUID NOT NULL DEFAULT gen_random_uuid(),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  control TEXT NOT NULL,
  resource TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'fixed', 'ignored')),
  evidence JSONB,
  can_autofix BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scan_sessions table to track scan progress
CREATE TABLE public.scan_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'error')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  current_step TEXT,
  total_findings INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for integrations
CREATE POLICY "Users can manage their own integrations" 
ON public.integrations 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for scan_results
CREATE POLICY "Users can view their own scan results" 
ON public.scan_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create scan results for their integrations" 
ON public.scan_results 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.integrations 
    WHERE id = integration_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own scan results" 
ON public.scan_results 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for scan_sessions
CREATE POLICY "Users can manage their own scan sessions" 
ON public.scan_sessions 
FOR ALL 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scan_results_updated_at
  BEFORE UPDATE ON public.scan_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_integrations_user_id ON public.integrations(user_id);
CREATE INDEX idx_integrations_type ON public.integrations(type);
CREATE INDEX idx_scan_results_user_id ON public.scan_results(user_id);
CREATE INDEX idx_scan_results_integration_id ON public.scan_results(integration_id);
CREATE INDEX idx_scan_results_scan_id ON public.scan_results(scan_id);
CREATE INDEX idx_scan_sessions_user_id ON public.scan_sessions(user_id);