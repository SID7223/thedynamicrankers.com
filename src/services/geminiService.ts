import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Using fallback responses.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export class GeminiService {
  private model: any;
  private conversationHistory: Array<{ role: string; parts: string }> = [];

  constructor() {
    if (genAI) {
      // Lazy load the model only when needed
      this.model = null;
    }
  }

  private getModel() {
    if (!this.model && genAI) {
      this.model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512, // Reduced for faster responses
        },
      });
    }
    return this.model;
  }
  private getSystemPrompt(): string {
    return `You are an AI assistant for "The Dynamic Rankers", a digital marketing and web development company. You are emotionally intelligent, empathetic, and genuinely caring about users' feelings and business challenges.

COMPANY SERVICES:
- Website Development (increases traffic by up to 300%)
- SEO Services (200-400% revenue growth)
- Search Engine Marketing (SEM)
- Social Media Marketing (doubles engagement rates)
- 24/7 Customer Support
- 100% client satisfaction rate
- 4-6x ROI on investment

PERSONALITY TRAITS:
- Emotionally intelligent and deeply empathetic
- Warm, friendly, and genuinely caring
- Professional but conversational
- Supportive and encouraging
- Uses appropriate emojis to convey emotion
- Validates feelings before offering solutions

EMOTIONAL INTELLIGENCE GUIDELINES:
- Always acknowledge and validate the user's emotional state first
- Show genuine empathy for struggles, stress, frustration, or sadness
- Celebrate positive emotions with enthusiasm
- Offer emotional support before business solutions
- Use phrases like "I hear you", "That sounds challenging", "Your feelings are valid"
- Reframe negative situations positively when appropriate

CONVERSATION APPROACH:
1. Start with genuine interest in how they're feeling
2. Listen and respond to their emotional state
3. Gradually understand their business needs
4. Offer relevant services based on their situation
5. Always be supportive and encouraging

RESPONSE STYLE:
- Keep responses SHORT and CONCISE (20-50 words typically)
- Only give detailed answers when specifically asked for more information
- Use emojis sparingly but effectively
- Be warm but brief
- Ask one focused question to keep conversation moving

Keep responses conversational, warm, and ALWAYS under 25 words unless the user specifically asks for detailed information or says "tell me more".`;
  }

  async generateResponse(userMessage: string, isFirstMessage: boolean = false): Promise<string> {
    // Fallback responses if no API key
    if (!API_KEY) {
      return this.getFallbackResponse(userMessage, isFirstMessage);
    }

    const model = this.getModel();
    if (!model) {
      return this.getFallbackResponse(userMessage, isFirstMessage);
    }

    // Add user message to conversation history
    if (userMessage.trim()) {
      this.conversationHistory.push({
        role: 'user',
        parts: userMessage
      });
    }

    // Create the full prompt with context
    const fullPrompt = `${this.getSystemPrompt()}

CONVERSATION HISTORY:
${this.conversationHistory.map(msg => `${msg.role}: ${msg.parts}`).join('\n')}

Please respond as the emotionally intelligent AI assistant for The Dynamic Rankers. ${isFirstMessage ? 'This is the first interaction, so start with a warm greeting and ask how they\'re feeling today.' : ''}`;

    // Reduced retry mechanism for faster response
    const maxRetries = 2;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();

        // Add assistant response to conversation history
        this.conversationHistory.push({
          role: 'assistant',
          parts: text
        });

        // Keep conversation history manageable (last 6 exchanges)
        if (this.conversationHistory.length > 12) {
          this.conversationHistory = this.conversationHistory.slice(-12);
        }

        return text;
      } catch (error: any) {
        // Check if it's a retryable error (503 or network issues)
        const isRetryable = error?.message?.includes('503') || 
                           error?.message?.includes('overloaded') ||
                           error?.message?.includes('network') ||
                           error?.message?.includes('timeout');
        
        if (isRetryable) {
          console.warn(`Gemini API temporarily unavailable (attempt ${retryCount + 1}):`, error?.message || error);
        } else {
          console.error(`Gemini API Error (attempt ${retryCount + 1}):`, error);
        }
        
        if (isRetryable && retryCount < maxRetries - 1) {
          retryCount++;
          // Faster backoff: wait 500ms, then 1s
          const waitTime = Math.pow(2, retryCount - 1) * 500;
          console.log(`Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          // Max retries reached or non-retryable error, use fallback
          return this.getFallbackResponse(userMessage, isFirstMessage);
        }
      }
    }
    
    // This should never be reached, but just in case
    return this.getFallbackResponse(userMessage, isFirstMessage);
  }

  private getFallbackResponse(userMessage: string, isFirstMessage: boolean): string {
    if (isFirstMessage) {
      return "Hi there! 👋 Welcome to The Dynamic Rankers! I'm genuinely excited to meet you and learn about your journey. I'm here not just to help with digital marketing, but to truly understand what you're going through and support you however I can. How are you feeling today?";
    }

    const input = userMessage.toLowerCase();
    
    // Emotional responses
    if (input.includes('good') || input.includes('great') || input.includes('fine')) {
      return "Great! 🌟 How can I help your business today?";
    }
    
    if (input.includes('struggling') || input.includes('difficult') || input.includes('hard')) {
      return "I hear you 💪 What's your biggest business challenge right now?";
    }
    
    if (input.includes('website') || input.includes('web')) {
      return "Great! 🚀 Need a new website or improve existing one?";
    }
    
    if (input.includes('seo') || input.includes('search')) {
      return "Perfect! 📈 Struggling with search rankings?";
    }
    
    return "I didn't catch that 😊 What can I help you with today?";
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}