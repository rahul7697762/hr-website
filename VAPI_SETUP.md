# Vapi AI Voice Interview Setup Guide

This guide will help you set up the Vapi AI voice interview screening feature for your HR website.

## Prerequisites

1. **Vapi AI Account**: Sign up at [vapi.ai](https://vapi.ai)
2. **API Keys**: Get your public API key from the Vapi dashboard

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_api_key_here
```

## Vapi Dashboard Configuration

### 1. Create an Assistant (Optional)

If you want to use a pre-configured assistant instead of dynamic configuration:

1. Go to your Vapi dashboard
2. Create a new assistant with these settings:
   - **Model**: OpenAI GPT-4o
   - **Temperature**: 0.7
   - **Voice**: ElevenLabs (recommended voice ID: `21m00Tcm4TlvDq8ikWAM`)
   - **System Prompt**: See the system prompt in `VapiClient.tsx`

### 2. Phone Number (Optional)

For outbound calls (not needed for web widget):
1. Purchase a phone number in your Vapi dashboard
2. Configure it for your assistant

## Features Implemented

### 🎤 Voice Interview Screening
- **Real-time voice conversations** with AI interviewer
- **Customizable interview parameters**:
  - Job title and industry
  - Experience level (entry, mid, senior, executive)
  - Interview duration (5-30 minutes)
  - Focus areas (technical, communication, leadership, etc.)
  - Difficulty level

### 📊 Comprehensive Analysis
- **Performance scoring** across multiple dimensions
- **Real-time transcript** capture
- **Detailed feedback** with strengths and improvements
- **Question-by-question analysis**
- **Export capabilities** (PDF, email, save to profile)

### 🔧 Technical Features
- **Vapi Web SDK integration** with fallback mock for development
- **React Context** for state management
- **TypeScript** for type safety
- **Responsive design** with dark mode support
- **Error handling** and loading states

## Usage Flow

1. **Setup Phase**: Configure interview parameters
2. **Interview Phase**: Real-time voice conversation with AI
3. **Results Phase**: Detailed analysis and feedback

## Development Notes

### Mock Implementation
The system includes a mock implementation that works without Vapi API keys for development:
- Simulates voice interactions
- Generates sample transcripts
- Provides mock scoring and feedback

### Production Setup
For production use:
1. Add your Vapi API key to environment variables
2. The system will automatically use the real Vapi SDK
3. Configure your assistant settings in the Vapi dashboard

## Customization Options

### Interview Questions
Modify the question generation logic in `VoiceScreeningInterface.tsx`:
- Add industry-specific questions
- Customize difficulty levels
- Add new focus areas

### Scoring Algorithm
Update the scoring logic in the results generation:
- Implement real AI-based scoring
- Add custom evaluation criteria
- Integrate with your existing HR systems

### Voice Configuration
Customize the AI interviewer voice:
- Change voice provider (ElevenLabs, Azure, etc.)
- Select different voice IDs
- Adjust speech parameters

## Integration with Existing HR System

The voice screening system can be integrated with your existing HR workflow:

1. **Candidate Database**: Save results to your candidate profiles
2. **ATS Integration**: Export results to your Applicant Tracking System
3. **Reporting**: Generate analytics on interview performance
4. **Scheduling**: Integrate with calendar systems for follow-up interviews

## Troubleshooting

### Common Issues

1. **Vapi SDK not loading**:
   - Check internet connection
   - Verify the CDN URL is accessible
   - Check browser console for errors

2. **API Key issues**:
   - Verify the API key is correct
   - Check if the key has proper permissions
   - Ensure the key is for the correct environment

3. **Audio issues**:
   - Check microphone permissions
   - Test audio input/output
   - Verify browser compatibility

### Browser Compatibility
- Chrome: Full support
- Firefox: Full support
- Safari: Full support
- Edge: Full support

## Security Considerations

1. **API Keys**: Never expose private API keys in client-side code
2. **Data Privacy**: Ensure compliance with data protection regulations
3. **Audio Storage**: Configure audio retention policies in Vapi dashboard
4. **User Consent**: Implement proper consent mechanisms for voice recording

## Next Steps

1. Set up your Vapi account and get API keys
2. Configure environment variables
3. Test the mock implementation
4. Deploy with real Vapi integration
5. Customize for your specific use cases

For support, refer to the [Vapi documentation](https://docs.vapi.ai) or contact their support team.