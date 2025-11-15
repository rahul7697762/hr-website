-- ============================================
-- Migration: Create Supabase Storage Bucket for Resume PDFs
-- Description: Creates storage bucket and RLS policies for secure PDF storage
-- Date: 2025-11-15
-- ============================================

-- NOTE: This script should be run in the Supabase Dashboard SQL Editor
-- Navigate to: Project Dashboard > SQL Editor > New Query

-- ============================================
-- Step 1: Create Storage Bucket
-- ============================================

-- Create storage bucket for resume PDFs (private bucket)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resume-pdfs', 
  'resume-pdfs', 
  false,  -- Private bucket (requires authentication)
  10485760,  -- 10MB file size limit
  ARRAY['application/pdf']  -- Only allow PDF files
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Step 2: Enable Row Level Security (RLS)
-- ============================================

-- Enable RLS on storage.objects table (should already be enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 3: Create RLS Policies for Storage Bucket
-- ============================================

-- Policy 1: Users can view their own resume PDFs
CREATE POLICY "Users can view own resume PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resume-pdfs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Users can upload their own resume PDFs
CREATE POLICY "Users can upload own resume PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resume-pdfs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Users can update their own resume PDFs
CREATE POLICY "Users can update own resume PDFs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resume-pdfs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Users can delete their own resume PDFs
CREATE POLICY "Users can delete own resume PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resume-pdfs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- Verification Queries
-- ============================================

-- Verify bucket was created:
-- SELECT id, name, public, file_size_limit, allowed_mime_types 
-- FROM storage.buckets 
-- WHERE id = 'resume-pdfs';

-- Verify RLS policies were created:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'objects' 
-- AND policyname LIKE '%resume PDFs%';

-- ============================================
-- Notes
-- ============================================
-- 
-- Storage Path Format: {user_id}/{resume_id}/{timestamp}.pdf
-- Example: 550e8400-e29b-41d4-a716-446655440000/123/1700000000000.pdf
--
-- The RLS policies ensure that:
-- 1. Users can only access files in folders matching their user_id
-- 2. The first folder in the path must match auth.uid()
-- 3. All operations (SELECT, INSERT, UPDATE, DELETE) are restricted to own files
--
-- File Size Limit: 10MB (10485760 bytes)
-- Allowed MIME Types: application/pdf only
--
