# Quiz Assignment System Setup

## ✅ What's Been Implemented

### 1. Admin Features
- **Share Quiz to Students**: Admins can now share quizzes with selected students
- **Student Selection Modal**: Search and select multiple students
- **Bulk Assignment**: Select all or individual students
- **Assignment Tracking**: Track which quizzes are assigned to which students

### 2. Student Features
- **My Quizzes Page**: Students see only their assigned quizzes
- **Progress Tracking**: View completion status and scores
- **Retake Option**: Students can retake quizzes to improve scores
- **Best Score Display**: Shows the best attempt for each quiz

## 🗄️ Database Setup Required

### Step 1: Create the Table

Run this SQL in your **Supabase SQL Editor**:

```sql
-- Create quiz_assignments table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quiz_assignments_quiz_id ON public.quiz_assignments(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_assignments_user_id ON public.quiz_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_assignments_status ON public.quiz_assignments(status);

-- Enable RLS
ALTER TABLE public.quiz_assignments ENABLE ROW LEVEL SECURITY;

-- Policies
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

CREATE POLICY "Service role can manage assignments"
  ON public.quiz_assignments FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');
```

### Step 2: Verify Table Creation

Run this to verify:

```sql
SELECT * FROM public.quiz_assignments LIMIT 10;
```

### Step 3: Test with Sample Data (Optional)

```sql
-- Get a quiz_id and user_id first
SELECT quiz_id, title FROM public.quizzes LIMIT 5;
SELECT user_id, name, email FROM public.users WHERE role = 'student' LIMIT 5;

-- Then insert test assignment (replace IDs with actual values)
INSERT INTO public.quiz_assignments (quiz_id, user_id, status)
VALUES (1, 1, 'assigned');
```

## 🚀 How to Use

### For Admins

1. **Login as Admin**:
   - Email: `amit.kumar@example.com`
   - Password: `admin@123`

2. **Navigate to Quiz Admin**:
   - Go to `/quiz/admin`

3. **Share a Quiz**:
   - Click the **"📤 Share"** button on any quiz
   - Search for students by name or email
   - Select students (or click "Select All")
   - Click **"Share with X Student(s)"**

4. **Confirmation**:
   - You'll see a success message
   - Students will now see the quiz in their dashboard

### For Students

1. **Login as Student**:
   - Example: `rahul.saini@example.com` / `rahul123`

2. **View Assigned Quizzes**:
   - Go to `/quiz` or click "Quizzes" in navigation
   - See all quizzes assigned to you

3. **Take a Quiz**:
   - Click **"▶️ Start Quiz"** on any quiz
   - Answer all questions
   - Submit to see results

4. **Retake Quiz**:
   - Click **"🔄 Retake Quiz"** to improve your score
   - Your best score is always displayed

## 📊 Features

### Admin Dashboard (`/quiz/admin`)
- ✨ AI-powered quiz generation (OpenAI + Gemini)
- 📤 Share quizzes with students
- 👥 Student selection with search
- 🗑️ Delete quizzes
- 📊 View attempts and leaderboards

### Student Dashboard (`/quiz`)
- 📚 View assigned quizzes only
- ✅ Track completion status
- 🏆 See best scores
- 🔄 Retake quizzes
- 📈 Progress tracking

### Quiz Taking (`/quiz/[quizId]`)
- ❓ Multiple choice questions
- ⏭️ Next/Previous navigation
- 📊 Progress bar
- ✅ Results with detailed review
- 💾 Automatic attempt saving

## 🔒 Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Student Isolation**: Students only see their assigned quizzes
- **Admin Access**: Admins can manage all quizzes and assignments
- **Unique Constraints**: Prevents duplicate assignments

## 📝 Database Schema

### quiz_assignments Table

| Column | Type | Description |
|--------|------|-------------|
| assignment_id | SERIAL | Primary key |
| quiz_id | INTEGER | Foreign key to quizzes |
| user_id | INTEGER | Foreign key to users |
| assigned_at | TIMESTAMP | When quiz was assigned |
| status | VARCHAR(20) | assigned, completed, expired |
| completed_at | TIMESTAMP | When quiz was completed |
| created_at | TIMESTAMP | Record creation time |

### Relationships

```
quiz_assignments
├── quiz_id → quizzes.quiz_id (CASCADE DELETE)
└── user_id → users.user_id (CASCADE DELETE)
```

## 🐛 Troubleshooting

### "Failed to load students"
**Solution**: Make sure you have users with role='student' in your database

```sql
SELECT * FROM public.users WHERE role = 'student';
```

### "Failed to share quiz"
**Solution**: 
1. Verify the quiz_assignments table exists
2. Check RLS policies are created
3. Ensure you're logged in as admin

### Students don't see assigned quizzes
**Solution**:
1. Check assignments exist:
```sql
SELECT * FROM public.quiz_assignments WHERE user_id = YOUR_USER_ID;
```
2. Verify RLS policies allow student access
3. Check student is logged in correctly

### "No quizzes assigned yet"
**Solution**: Admin needs to share quizzes with the student first

## 🎯 Next Steps

1. ✅ Run the SQL script to create the table
2. ✅ Login as admin and create/generate a quiz
3. ✅ Share the quiz with students
4. ✅ Login as student and take the quiz
5. ✅ View results and track progress

## 📚 Related Files

- `/app/quiz/admin/page.tsx` - Admin quiz management
- `/app/quiz/page.tsx` - Student quiz listing
- `/app/quiz/[quizId]/page.tsx` - Quiz taking interface
- `/app/api/quiz/generate/route.ts` - AI quiz generation
- `create-quiz-assignments-table.sql` - Database setup script

## 🔄 Workflow

```
Admin Flow:
1. Create/Generate Quiz (AI-powered)
2. Share with Students (Select from list)
3. Track Attempts & Leaderboard

Student Flow:
1. View Assigned Quizzes
2. Start Quiz
3. Answer Questions
4. Submit & View Results
5. Retake if needed
```

## ✨ Features Summary

- 🤖 AI-powered quiz generation (OpenAI + Gemini)
- 📤 Share quizzes with specific students
- 👥 Multi-select student assignment
- 🔍 Search students by name/email
- 📊 Progress tracking
- 🏆 Best score tracking
- 🔄 Retake functionality
- 📈 Leaderboards
- 🔒 Secure with RLS
- 📱 Responsive design
- 🌙 Dark mode support
