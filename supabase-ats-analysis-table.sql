-- Create ATS Analysis History table for storing ResumeATS model results
-- This table stores analysis results from the ResumeATS model integrated with Supabase

CREATE TABLE IF NOT EXISTS public.ats_analysis_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    resume_text TEXT NOT NULL,
    job_description TEXT NOT NULL,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    analysis_data JSONB NOT NULL DEFAULT '{}',
    suggestions JSONB NOT NULL DEFAULT '{}',
    detailed_feedback TEXT,
    model_version VARCHAR(100) DEFAULT 'girishwangikar/ResumeATS',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ats_analysis_user_id ON public.ats_analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ats_analysis_created_at ON public.ats_analysis_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ats_analysis_score ON public.ats_analysis_history(overall_score);

-- Create RLS (Row Level Security) policies
ALTER TABLE public.ats_analysis_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own analysis history
CREATE POLICY "Users can view own analysis history" ON public.ats_analysis_history
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Policy: Users can insert their own analysis
CREATE POLICY "Users can insert own analysis" ON public.ats_analysis_history
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Policy: Users can update their own analysis
CREATE POLICY "Users can update own analysis" ON public.ats_analysis_history
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Policy: Users can delete their own analysis
CREATE POLICY "Users can delete own analysis" ON public.ats_analysis_history
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ats_analysis_updated_at 
    BEFORE UPDATE ON public.ats_analysis_history 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.ats_analysis_history IS 'Stores ATS analysis results from ResumeATS model';
COMMENT ON COLUMN public.ats_analysis_history.user_id IS 'Reference to the user who performed the analysis';
COMMENT ON COLUMN public.ats_analysis_history.resume_text IS 'The resume text that was analyzed (truncated for storage)';
COMMENT ON COLUMN public.ats_analysis_history.job_description IS 'The job description used for comparison';
COMMENT ON COLUMN public.ats_analysis_history.overall_score IS 'Overall ATS compatibility score (0-100)';
COMMENT ON COLUMN public.ats_analysis_history.analysis_data IS 'Detailed analysis data including keyword, content, and structure analysis';
COMMENT ON COLUMN public.ats_analysis_history.suggestions IS 'Prioritized suggestions for improvement';
COMMENT ON COLUMN public.ats_analysis_history.detailed_feedback IS 'AI-generated detailed feedback';
COMMENT ON COLUMN public.ats_analysis_history.model_version IS 'Version/name of the AI model used for analysis';

-- Grant necessary permissions (adjust based on your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.ats_analysis_history TO authenticated;
-- GRANT USAGE ON SEQUENCE ats_analysis_history_id_seq TO authenticated;