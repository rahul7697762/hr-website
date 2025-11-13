-- Fix foreign key constraints to use CASCADE
-- This allows automatic cleanup of related records when a user is deleted/updated

-- Fix resumes table foreign key
ALTER TABLE resumes 
DROP CONSTRAINT IF EXISTS resumes_user_id_fkey;

ALTER TABLE resumes
ADD CONSTRAINT resumes_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES users(user_id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Fix ats_results table foreign key (if it references resumes)
ALTER TABLE ats_results 
DROP CONSTRAINT IF EXISTS ats_results_resume_id_fkey;

ALTER TABLE ats_results
ADD CONSTRAINT ats_results_resume_id_fkey 
FOREIGN KEY (resume_id) 
REFERENCES resumes(resume_id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Fix ats_analysis_history table foreign key (already has CASCADE in your SQL file, but ensuring it's applied)
ALTER TABLE ats_analysis_history 
DROP CONSTRAINT IF EXISTS ats_analysis_history_user_id_fkey;

ALTER TABLE ats_analysis_history
ADD CONSTRAINT ats_analysis_history_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES users(user_id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;
