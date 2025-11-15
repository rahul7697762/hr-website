-- ============================================
-- Migration: Add PDF Storage Fields to Resumes Table
-- Description: Adds columns for storing PDF metadata and file paths
-- Date: 2025-11-15
-- ============================================

-- Add PDF storage metadata fields to resumes table
-- Note: resume_file_path column will be added to store the Supabase Storage path
ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS resume_file_path VARCHAR(500),
ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS pdf_file_size INTEGER;

-- Add index for faster PDF lookups
CREATE INDEX IF NOT EXISTS idx_resumes_file_path 
ON resumes(resume_file_path) 
WHERE resume_file_path IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN resumes.resume_file_path IS 'Storage path in Supabase Storage bucket for PDF file (format: {user_id}/{resume_id}/{timestamp}.pdf)';
COMMENT ON COLUMN resumes.pdf_generated_at IS 'Timestamp when PDF was last generated and uploaded to storage';
COMMENT ON COLUMN resumes.pdf_file_size IS 'PDF file size in bytes (max 10MB = 10485760 bytes)';

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify the migration was successful:
-- SELECT column_name, data_type, character_maximum_length, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'resumes' 
-- AND column_name IN ('resume_file_path', 'pdf_generated_at', 'pdf_file_size');
