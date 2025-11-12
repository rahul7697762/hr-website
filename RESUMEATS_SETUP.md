# ResumeATS Model Integration Setup

This application now uses the specialized **ResumeATS model** (`girishwangikar/ResumeATS`) integrated with **Supabase** for advanced ATS resume analysis.

## 🚀 Features

### ResumeATS Model Integration
- **Specialized Model**: Uses `girishwangikar/ResumeATS` - a model specifically trained for ATS resume analysis
- **Supabase Storage**: All analysis results are stored in Supabase for history tracking
- **Multi-tier Fallback**: ResumeATS → Hugging Face → Rule-based analysis
- **Real-time Analysis**: Instant feedback with AI-powered insights

### Enhanced Analysis Capabilities
- **Keyword Optimization**: Semantic keyword matching with job descriptions
- **Content Quality**: Professional tone analysis and readability scoring
- **Structure Analysis**: Resume format and section completeness evaluation
- **Industry Alignment**: Skills matching with industry trends
- **Prioritized Suggestions**: High, medium, and low priority recommendations

## 🛠️ Setup Instructions

### 1. Environment Configuration

Add these variables to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hrlncrvcwhvymwsfmyxi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Hugging Face API Key
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your-huggingface-api-key

# ResumeATS Model URL
HF_API_URL=https://api-inference.huggingface.co/models/girishwangikar/ResumeATS
```

### 2. Supabase Database Setup

Run the SQL script to create the analysis history table:

```sql
-- Run this in your Supabase SQL editor
-- File: supabase-ats-analysis-table.sql

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
```

### 3. Get Your API Keys

#### Hugging Face API Key:
1. Visit [Hugging Face](https://huggingface.co/) and create an account
2. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Create a new token with "Read" permissions
4. Copy the token to your `.env.local` file

#### Supabase Configuration:
1. Your Supabase URL is already configured: `https://hrlncrvcwhvymwsfmyxi.supabase.co`
2. Get your anon key from the Supabase dashboard
3. Add it to your environment variables

## 🔄 How It Works

### Analysis Flow
1. **User Input**: Resume text + Job description
2. **ResumeATS Model**: Calls the specialized model via Hugging Face API
3. **Enhanced Processing**: Combines model output with detailed analysis
4. **Supabase Storage**: Saves results for history tracking
5. **User Display**: Shows comprehensive analysis with suggestions

### Fallback System
```
ResumeATS Model (Primary)
    ↓ (if fails)
Hugging Face General Models
    ↓ (if fails)
Rule-based Analysis (Always works)
```

## 📊 Analysis Components

### 1. Keyword Analysis
- **Matching Keywords**: Found in both resume and job description
- **Missing Keywords**: Important terms from job description not in resume
- **Keyword Density**: Percentage of job keywords found in resume
- **Relevance Score**: Semantic similarity between resume and job

### 2. Content Analysis
- **Readability Score**: How easy the resume is to read
- **Professional Tone**: Quality of language and tone
- **Action Verbs**: Count of impactful action verbs
- **Quantified Achievements**: Number of measurable accomplishments

### 3. Structure Analysis
- **Format Score**: Overall formatting quality
- **Section Completeness**: Presence of essential resume sections
- **Length Appropriateness**: Optimal word count analysis
- **Bullet Point Usage**: Effective use of bullet points

### 4. Industry Alignment
- **Industry Match Score**: How well skills align with industry
- **Relevant Skills**: Skills that match the job requirements
- **Trending Keywords**: Current industry-relevant terms

## 🎯 Model-Specific Features

### ResumeATS Model Benefits
- **ATS-Trained**: Specifically trained on ATS systems and requirements
- **Industry-Aware**: Understands different industry requirements
- **Context-Sensitive**: Considers job description context for analysis
- **Scoring Accuracy**: More accurate ATS compatibility scoring

### Model Input Format
```json
{
  "inputs": {
    "resume": "Resume text (up to 2000 chars)",
    "job_description": "Job description (up to 1500 chars)"
  },
  "parameters": {
    "return_full_text": false,
    "max_length": 512,
    "temperature": 0.7
  }
}
```

## 📈 Analysis History

### Supabase Storage
- **Automatic Saving**: All analyses are automatically saved
- **User-Specific**: Each user sees only their own history
- **Detailed Records**: Complete analysis data stored as JSONB
- **Performance Tracking**: Track improvement over time

### History Features
- **Score Tracking**: See how your scores improve over time
- **Suggestion History**: Review past recommendations
- **Model Versioning**: Track which model version was used
- **Export Capability**: Data can be exported for external analysis

## 🔧 Troubleshooting

### Common Issues

1. **"ResumeATS model failed"**
   - Check your Hugging Face API key
   - Verify the model URL is correct
   - System will automatically fallback to other methods

2. **"Analysis not saving to history"**
   - Check Supabase connection
   - Verify user authentication
   - Check database table exists

3. **"Slow analysis"**
   - Hugging Face inference API may have delays
   - Model cold start can take 10-20 seconds
   - Subsequent requests are faster

### Debug Mode
Enable detailed logging by checking browser console:
- Model API calls and responses
- Fallback system activation
- Supabase storage operations
- Analysis processing steps

## 🚀 Performance Optimization

### Model Performance
- **Cold Start**: First request may take 15-30 seconds
- **Warm Model**: Subsequent requests complete in 2-5 seconds
- **Caching**: Results are cached in Supabase for instant retrieval
- **Fallback Speed**: Rule-based analysis completes instantly

### Best Practices
- **Resume Length**: Keep resumes under 2000 characters for optimal model performance
- **Job Description**: Provide complete job descriptions for better analysis
- **Regular Analysis**: Analyze resumes regularly to track improvements
- **History Review**: Use analysis history to identify patterns and improvements

## 📚 API Reference

### SupabaseATSService Methods

```typescript
// Analyze resume with ResumeATS model
SupabaseATSService.analyzeResumeWithSupabaseATS(
  resumeText: string,
  jobDescription: string,
  userId?: number
): Promise<SupabaseATSAnalysis>

// Get analysis history
SupabaseATSService.getAnalysisHistory(
  userId: number,
  limit?: number
): Promise<AnalysisHistoryItem[]>
```

### Response Format
```typescript
interface SupabaseATSAnalysis {
  overall_score: number;
  keyword_analysis: {
    matching_keywords: string[];
    missing_keywords: string[];
    keyword_density: number;
    relevance_score: number;
  };
  content_analysis: {
    readability_score: number;
    professional_tone_score: number;
    action_verbs_count: number;
    quantified_achievements: number;
  };
  // ... additional analysis data
}
```

## 🔮 Future Enhancements

### Planned Features
- **Custom Model Training**: Train models on specific industries
- **Batch Analysis**: Analyze multiple resumes simultaneously
- **A/B Testing**: Compare different resume versions
- **Integration APIs**: Connect with job boards and ATS systems
- **Mobile App**: Native mobile application for on-the-go analysis

### Model Improvements
- **Multi-language Support**: Support for non-English resumes
- **Industry Specialization**: Models trained for specific industries
- **Real-time Suggestions**: Live suggestions as users type
- **Visual Analysis**: Analysis of resume visual elements

---

## 🆘 Support

For issues or questions:
1. Check the browser console for detailed error logs
2. Verify all environment variables are set correctly
3. Ensure Supabase database table is created
4. Test with a simple resume first
5. Check Hugging Face API status and quotas

**Model Information**: [girishwangikar/ResumeATS on Hugging Face](https://huggingface.co/girishwangikar/ResumeATS)