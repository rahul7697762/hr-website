-- ============================================
-- HR Website Database Schema
-- ============================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'recruiter', 'mentor', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    profile_picture_url TEXT,
    phone VARCHAR(20),
    bio TEXT,
    linkedin_url TEXT,
    github_url TEXT
);

-- Code IDE Projects Table
CREATE TABLE IF NOT EXISTS code_ide (
    ide_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL,
    code_snippet TEXT,
    project_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_run_error TEXT,
    execution_time_ms INTEGER,
    memory_used_kb INTEGER,
    is_public BOOLEAN DEFAULT FALSE,
    fork_count INTEGER DEFAULT 0,
    original_project_id INTEGER REFERENCES code_ide(ide_id)
);

-- AI Mentor Logs Table
CREATE TABLE IF NOT EXISTS ai_mentor_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    context_type VARCHAR(50),
    query TEXT NOT NULL,
    response TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Results Table
CREATE TABLE IF NOT EXISTS quiz_results (
    result_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    quiz_type VARCHAR(50),
    category VARCHAR(100),
    difficulty VARCHAR(20),
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_taken_seconds INTEGER,
    answers JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resume Data Table
CREATE TABLE IF NOT EXISTS resumes (
    resume_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    resume_name VARCHAR(255),
    template_id VARCHAR(50),
    resume_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- ATS Analysis Results Table
CREATE TABLE IF NOT EXISTS ats_results (
    result_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    resume_id INTEGER REFERENCES resumes(resume_id) ON DELETE SET NULL,
    ats_score DECIMAL(5,2),
    keywords_found JSONB,
    suggestions JSONB,
    analysis_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Code IDE indexes
CREATE INDEX IF NOT EXISTS idx_code_ide_user_id ON code_ide(user_id);
CREATE INDEX IF NOT EXISTS idx_code_ide_language ON code_ide(language);
CREATE INDEX IF NOT EXISTS idx_code_ide_is_public ON code_ide(is_public);
CREATE INDEX IF NOT EXISTS idx_code_ide_created_at ON code_ide(created_at DESC);

-- AI Mentor Logs indexes
CREATE INDEX IF NOT EXISTS idx_ai_mentor_logs_user_id ON ai_mentor_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_mentor_logs_context_type ON ai_mentor_logs(context_type);
CREATE INDEX IF NOT EXISTS idx_ai_mentor_logs_created_at ON ai_mentor_logs(created_at DESC);

-- Quiz Results indexes
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_type ON quiz_results(quiz_type);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at DESC);

-- Resumes indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_active ON resumes(is_active);

-- ATS Results indexes
CREATE INDEX IF NOT EXISTS idx_ats_results_user_id ON ats_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ats_results_resume_id ON ats_results(resume_id);

-- ============================================
-- Views
-- ============================================

-- Public Code Projects View
CREATE OR REPLACE VIEW public_code_projects AS
SELECT 
    ci.ide_id,
    ci.project_name,
    ci.language,
    ci.code_snippet,
    ci.project_data,
    ci.fork_count,
    ci.created_at,
    ci.last_updated,
    u.name as author_name,
    u.user_id as author_id
FROM code_ide ci
JOIN users u ON ci.user_id = u.user_id
WHERE ci.is_public = TRUE
ORDER BY ci.created_at DESC;

-- User Statistics View
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.user_id,
    u.name,
    u.email,
    u.role,
    COUNT(DISTINCT ci.ide_id) as total_projects,
    COUNT(DISTINCT qr.result_id) as total_quizzes,
    COUNT(DISTINCT r.resume_id) as total_resumes,
    AVG(qr.score::DECIMAL / qr.total_questions * 100) as avg_quiz_score,
    u.created_at as member_since
FROM users u
LEFT JOIN code_ide ci ON u.user_id = ci.user_id
LEFT JOIN quiz_results qr ON u.user_id = qr.user_id
LEFT JOIN resumes r ON u.user_id = r.user_id
GROUP BY u.user_id, u.name, u.email, u.role, u.created_at;

-- ============================================
-- Functions
-- ============================================

-- Function to increment fork count
CREATE OR REPLACE FUNCTION increment_fork_count(project_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE code_ide 
    SET fork_count = fork_count + 1 
    WHERE ide_id = project_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get language statistics
CREATE OR REPLACE FUNCTION get_language_stats()
RETURNS TABLE(
    language VARCHAR, 
    project_count BIGINT, 
    total_executions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ci.language,
        COUNT(DISTINCT ci.ide_id) as project_count,
        COUNT(aml.log_id) as total_executions
    FROM code_ide ci
    LEFT JOIN ai_mentor_logs aml 
        ON aml.user_id = ci.user_id 
        AND aml.context_type = 'code_execution'
        AND (aml.metadata->>'language')::text = ci.language
    GROUP BY ci.language
    ORDER BY project_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Triggers
-- ============================================

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for code_ide table
CREATE TRIGGER update_code_ide_updated_at
    BEFORE UPDATE ON code_ide
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for resumes table
CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE code_ide IS 'Stores user code projects with multi-language support';
COMMENT ON TABLE ai_mentor_logs IS 'Logs AI mentor interactions and queries';
COMMENT ON TABLE quiz_results IS 'Stores quiz attempt results and scores';
COMMENT ON TABLE resumes IS 'Stores user resume data and templates';
COMMENT ON TABLE ats_results IS 'Stores ATS analysis results for resumes';

-- Code IDE column comments
COMMENT ON COLUMN code_ide.last_run_error IS 'Error message from last code execution';
COMMENT ON COLUMN code_ide.execution_time_ms IS 'Execution time in milliseconds';
COMMENT ON COLUMN code_ide.memory_used_kb IS 'Memory used in kilobytes';
COMMENT ON COLUMN code_ide.is_public IS 'Whether project is publicly visible';
COMMENT ON COLUMN code_ide.fork_count IS 'Number of times project has been forked';
COMMENT ON COLUMN code_ide.original_project_id IS 'Reference to original project if forked';

-- ============================================
-- Sample Data (for development)
-- ============================================

-- Insert sample users (passwords should be hashed in production)
-- Password: 'password' hashed with bcrypt
INSERT INTO users (name, email, password_hash, role) VALUES
('John Doe', 'john@example.com', '$2b$10$rBV2kHYgLVxLJxYxQqYvXeXqX5JZYqXqXqXqXqXqXqXqXqXqXqXqX', 'student'),
('Jane Smith', 'jane@example.com', '$2b$10$rBV2kHYgLVxLJxYxQqYvXeXqX5JZYqXqXqXqXqXqXqXqXqXqXqXqX', 'recruiter'),
('Bob Wilson', 'bob@example.com', '$2b$10$rBV2kHYgLVxLJxYxQqYvXeXqX5JZYqXqXqXqXqXqXqXqXqXqXqXqX', 'mentor'),
('Admin User', 'admin@example.com', '$2b$10$rBV2kHYgLVxLJxYxQqYvXeXqX5JZYqXqXqXqXqXqXqXqXqXqXqXqX', 'admin')
ON CONFLICT (email) DO NOTHING;
