# 🎓 Complete HR Website Setup Guide

## 📋 Table of Contents
1. [Authentication System](#authentication-system)
2. [Quiz Assignment System](#quiz-assignment-system)
3. [AI-Powered Features](#ai-powered-features)
4. [Database Setup](#database-setup)
5. [User Roles & Access](#user-roles--access)

---

## 🔐 Authentication System

### User Roles
- **Admin**: Full access to admin dashboard and quiz management
- **Student**: Access to assigned quizzes and personal dashboard
- **Recruiter**: Access to regular dashboard
- **Mentor**: Access to regular dashboard

### Login Credentials

#### Admin
- Email: `amit.kumar@example.com`
- Password: `admin@123`
- Redirects to: `/admin_dashboard`

#### Students
- `rahul.saini@example.com` / `rahul123`
- `suresh.yadav@example.com` / `suresh456`
- `anita.sharma@example.com` / `anita321`
- Redirects to: `/dashboard`

#### Recruiter
- Email: `riya.patel@example.com`
- Password: `riya789`
- Redirects to: `/dashboard`

### Key Features
✅ Supabase Auth integration
✅ Role-based redirects
✅ Protected routes
✅ Session management
✅ Secure password hashing

---

## 📚 Quiz Assignment System

### Admin Workflow

1. **Access Quiz Admin**
   ```
   Login as admin → Navigate to /quiz/admin
   ```

2. **Create Quiz (Two Methods)**

   **Method A: AI Generation** ✨
   - Enter topic (e.g., "JavaScript Basics")
   - Set number of questions (1-20)
   - Choose difficulty (Easy/Medium/Hard)
   - Select AI provider (Auto/OpenAI/Gemini)
   - Click "Generate Quiz with AI"

   **Method B: Manual Creation**
   - Enter quiz title and description
   - Add questions manually
   - Attach questions to quiz

3. **Share Quiz with Students**
   - Click "📤 Share" button on any quiz
   - Search students by name or email
   - Select students (individual or "Select All")
   - Click "Share with X Student(s)"
   - Students receive instant access

### Student Workflow

1. **View Assigned Quizzes**
   ```
   Login as student → Navigate to /quiz
   ```

2. **Take Quiz**
   - Click "▶️ Start Quiz"
   - Answer multiple choice questions
   - Use Next/Previous navigation
   - Submit when complete

3. **View Results**
   - See score and percentage
   - Review correct/incorrect answers
   - Option to retake quiz

4. **Track Progress**
   - View completion status
   - See best scores
   - Monitor assigned vs completed

---

## 🤖 AI-Powered Features

### Dual AI Provider Support

**OpenAI GPT-3.5 Turbo**
- Fast and reliable
- ~$0.001 per quiz
- Free tier: $5 credit

**Google Gemini Pro**
- Currently free
- Rate limited
- Good fallback option

### AI Provider Modes

1. **Auto (Recommended)** 🤖
   - Tries OpenAI first
   - Falls back to Gemini if OpenAI fails
   - Best reliability

2. **OpenAI Only** 🟢
   - Uses only GPT-3.5
   - Faster responses
   - Requires API key

3. **Gemini Only** 🔵
   - Uses only Gemini Pro
   - Free to use
   - Already configured

### Setup AI Keys

**OpenAI (Optional)**
1. Get key: https://platform.openai.com/api-keys
2. Add to `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart dev server

**Gemini (Already Configured)**
```bash
NEXT_PUBLIC_GOOGLE_AI_API_KEY=AIzaSyCq0PKLdwdR7E-2BWDmBjCV_Svfb2yZKhI
```

---

## 🗄️ Database Setup

### Required Tables

Run these SQL scripts in **Supabase SQL Editor**:

#### 1. Quiz Assignments Table

```sql
CREATE TABLE IF NOT EXISTS public.quiz_assignments (
  assignment_id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES public.quizzes(quiz_id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'assigned',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(quiz_id, user_id)
);

CREATE INDEX idx_quiz_assignments_quiz_id ON public.quiz_assignments(quiz_id);
CREATE INDEX idx_quiz_assignments_user_id ON public.quiz_assignments(user_id);
CREATE INDEX idx_quiz_assignments_status ON public.quiz_assignments(status);

ALTER TABLE public.quiz_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own assignments"
  ON public.quiz_assignments FOR SELECT
  USING (auth.jwt()->>'email' IN (
    SELECT email FROM public.users WHERE user_id = quiz_assignments.user_id
  ));

CREATE POLICY "Admins can manage all assignments"
  ON public.quiz_assignments FOR ALL
  USING (auth.jwt()->>'email' IN (
    SELECT email FROM public.users WHERE role = 'admin'
  ));
```

#### 2. Verify Setup

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'quizzes', 'questions', 'quiz_questions', 'attempts', 'quiz_assignments');

-- Check users
SELECT user_id, name, email, role FROM public.users;

-- Check quizzes
SELECT quiz_id, title, description FROM public.quizzes;
```

---

## 👥 User Roles & Access

### Admin (`/admin_dashboard`)
✅ AI quiz generation
✅ Manual quiz creation
✅ Share quizzes with students
✅ View all attempts
✅ Access leaderboards
✅ Delete quizzes
✅ User management (coming soon)
❌ Cannot access regular dashboard

### Student (`/dashboard` & `/quiz`)
✅ View assigned quizzes only
✅ Take quizzes
✅ View results
✅ Retake quizzes
✅ Track progress
❌ Cannot create quizzes
❌ Cannot access admin features

### Recruiter/Mentor (`/dashboard`)
✅ Access regular dashboard
✅ Resume tools
✅ ATS analyzer
❌ Cannot access admin features
❌ Cannot access quiz system (yet)

---

## 🚀 Quick Start Guide

### 1. Database Setup (5 minutes)
```sql
-- Run in Supabase SQL Editor
-- Copy from create-quiz-assignments-table.sql
```

### 2. Environment Variables
```bash
# Already configured in .env.local
NEXT_PUBLIC_SUPABASE_URL=https://hrlncrvcwhvymwsfmyxi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_GOOGLE_AI_API_KEY=AIzaSyCq...

# Optional: Add OpenAI
OPENAI_API_KEY=sk-your-key-here
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the System

**As Admin:**
1. Login: `amit.kumar@example.com` / `admin@123`
2. Go to `/quiz/admin`
3. Generate a quiz with AI
4. Share with students

**As Student:**
1. Login: `rahul.saini@example.com` / `rahul123`
2. Go to `/quiz`
3. Take the assigned quiz
4. View results

---

## 📁 Project Structure

```
hr-website/
├── app/
│   ├── admin_dashboard/          # Admin dashboard
│   │   └── page.tsx
│   ├── dashboard/                 # Regular user dashboard
│   │   └── page.tsx
│   ├── quiz/
│   │   ├── page.tsx              # Student quiz list
│   │   ├── [quizId]/             # Quiz taking page
│   │   │   └── page.tsx
│   │   └── admin/                # Admin quiz management
│   │       └── page.tsx
│   ├── api/
│   │   └── quiz/
│   │       └── generate/         # AI quiz generation
│   │           └── route.ts
│   ├── auth/                     # Authentication
│   │   └── page.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx       # Auth state management
│   └── utils/
│       └── redirectHelpers.ts    # Role-based redirects
├── .env.local                    # Environment variables
└── create-quiz-assignments-table.sql  # Database setup
```

---

## 🔧 Troubleshooting

### Login Issues
**Problem**: "Invalid email or password"
**Solution**: 
1. Check user exists in Supabase Auth
2. Verify email confirmation is disabled
3. Try with correct credentials

### Quiz Not Showing for Students
**Problem**: Student sees "No quizzes assigned"
**Solution**:
1. Admin must share quiz first
2. Check quiz_assignments table
3. Verify student user_id is correct

### AI Generation Fails
**Problem**: "AI generation failed"
**Solution**:
1. Use "Auto" mode for fallback
2. Check API keys in .env.local
3. Restart dev server
4. Verify API key has credits

### Share Button Not Working
**Problem**: "Failed to load students"
**Solution**:
1. Ensure quiz_assignments table exists
2. Check users with role='student' exist
3. Verify RLS policies are created

---

## ✨ Features Summary

### Implemented ✅
- Role-based authentication
- Admin dashboard
- Student dashboard
- AI quiz generation (OpenAI + Gemini)
- Manual quiz creation
- Share quizzes with students
- Student quiz assignment
- Quiz taking interface
- Results and scoring
- Retake functionality
- Progress tracking
- Leaderboards
- Attempt history

### Coming Soon 🚧
- User management UI
- Quiz analytics
- Bulk quiz operations
- Quiz templates
- Time limits
- Question randomization
- Certificate generation

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review error messages in browser console
3. Verify database setup
4. Check environment variables
5. Restart development server

---

## 🎉 Success Checklist

- [ ] Database tables created
- [ ] Users can login
- [ ] Admin can access `/admin_dashboard`
- [ ] Admin can generate quiz with AI
- [ ] Admin can share quiz with students
- [ ] Students can see assigned quizzes
- [ ] Students can take quizzes
- [ ] Results are displayed correctly
- [ ] Scores are saved to database
- [ ] Retake functionality works

---

**Last Updated**: November 18, 2025
**Version**: 1.0.0
