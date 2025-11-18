-- ============================================
-- Create Quiz Assignments Table
-- ============================================
-- This table tracks which quizzes are assigned to which students
-- Run this in Supabase SQL Editor
-- ============================================

-- Create quiz_assignments table
CREATE TABLE IF NOT EXISTS public.quiz_assignments (
  assignment_id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES public.quizzes(quiz_id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'assigned', -- assigned, completed, expired
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(quiz_id, user_id) -- Prevent duplicate assignments
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_assignments_quiz_id ON public.quiz_assignments(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_assignments_user_id ON public.quiz_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_assignments_status ON public.quiz_assignments(status);

-- Enable Row Level Security
ALTER TABLE public.quiz_assignments ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view their own assignments
CREATE POLICY "Students can view own assignments"
  ON public.quiz_assignments
  FOR SELECT
  USING (
    auth.jwt()->>'email' IN (
      SELECT email FROM public.users WHERE user_id = quiz_assignments.user_id
    )
  );

-- Policy: Admins can manage all assignments
CREATE POLICY "Admins can manage all assignments"
  ON public.quiz_assignments
  FOR ALL
  USING (
    auth.jwt()->>'email' IN (
      SELECT email FROM public.users WHERE role = 'admin'
    )
  );

-- Policy: Service role can manage all assignments
CREATE POLICY "Service role can manage assignments"
  ON public.quiz_assignments
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify the table was created:
-- SELECT * FROM public.quiz_assignments LIMIT 10;

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================
-- Uncomment to insert sample assignments:
/*
INSERT INTO public.quiz_assignments (quiz_id, user_id, status)
VALUES 
  (1, 1, 'assigned'),
  (1, 2, 'assigned');
*/
