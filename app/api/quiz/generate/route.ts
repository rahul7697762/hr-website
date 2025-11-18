import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

// Initialize AI clients
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
});

type AIProvider = 'openai' | 'gemini' | 'auto';

/**
 * Generate quiz content using AI (tries OpenAI first, falls back to Gemini)
 */
async function generateQuizWithAI(
  topic: string,
  numQuestions: number,
  difficulty: string,
  provider: AIProvider = 'auto'
): Promise<any> {
  const prompt = `Generate a quiz about "${topic}" with the following specifications:
- Difficulty: ${difficulty}
- Number of questions: ${numQuestions}
- Each question should have 4 multiple choice options
- Mark the correct answer

Please respond in the following JSON format:
{
  "title": "Quiz title (concise and descriptive)",
  "description": "Brief description (1-2 sentences)",
  "questions": [
    {
      "question": "Question text",
      "choices": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "The exact correct option text",
      "difficulty": "${difficulty}"
    }
  ]
}

Make sure the response is valid JSON only, no additional text.`;

  let text = '';
  let usedProvider = '';

  // Try OpenAI first (if auto or explicitly requested)
  if ((provider === 'auto' || provider === 'openai') && openai.apiKey) {
    try {
      console.log('Attempting quiz generation with OpenAI...');
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a quiz generator. Always respond with valid JSON only, no additional text or markdown.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      text = completion.choices[0]?.message?.content || '';
      usedProvider = 'OpenAI';
      console.log('✅ OpenAI generation successful');
    } catch (openaiError: any) {
      console.error('OpenAI generation failed:', openaiError.message);
      if (provider === 'openai') {
        throw new Error(`OpenAI generation failed: ${openaiError.message}`);
      }
      // Continue to Gemini fallback if auto mode
    }
  }

  // Try Gemini if OpenAI failed or if explicitly requested
  if (!text && (provider === 'auto' || provider === 'gemini')) {
    try {
      console.log('Attempting quiz generation with Gemini...');
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
      usedProvider = 'Gemini';
      console.log('✅ Gemini generation successful');
    } catch (geminiError: any) {
      console.error('Gemini generation failed:', geminiError.message);
      throw new Error(`AI generation failed: ${geminiError.message}`);
    }
  }

  if (!text) {
    throw new Error('No AI provider available or all providers failed');
  }

  // Parse AI response
  try {
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const quizData = JSON.parse(cleanText);
    return { ...quizData, usedProvider };
  } catch (parseError) {
    console.error('Failed to parse AI response:', text);
    throw new Error('Failed to parse AI response. The AI returned invalid JSON.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, numQuestions = 5, difficulty = 'medium', provider = 'auto' } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Generate quiz content using AI
    const quizData = await generateQuizWithAI(topic, numQuestions, difficulty, provider);

    // Create quiz in database
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert([
        {
          title: quizData.title,
          description: quizData.description,
        }
      ])
      .select()
      .single();

    if (quizError || !quiz) {
      throw new Error('Failed to create quiz: ' + quizError?.message);
    }

    // Create questions and attach them to the quiz
    const questionsToInsert = quizData.questions.map((q: any) => ({
      question: q.question,
      choices: q.choices,
      correct_answer: q.correct_answer,
      difficulty: q.difficulty || difficulty,
    }));

    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();

    if (questionsError || !questions) {
      throw new Error('Failed to create questions: ' + questionsError?.message);
    }

    // Attach questions to quiz
    const mappings = questions.map((q: any) => ({
      quiz_id: quiz.quiz_id,
      question_id: q.question_id,
    }));

    const { error: mappingError } = await supabase
      .from('quiz_questions')
      .insert(mappings);

    if (mappingError) {
      throw new Error('Failed to attach questions: ' + mappingError.message);
    }

    return NextResponse.json({
      success: true,
      message: `Quiz "${quiz.title}" created with ${questions.length} questions using ${quizData.usedProvider}`,
      quiz: {
        quiz_id: quiz.quiz_id,
        title: quiz.title,
        description: quiz.description,
        questionsCount: questions.length,
      },
      aiProvider: quizData.usedProvider,
    });

  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
