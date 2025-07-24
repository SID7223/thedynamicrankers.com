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
      this.model = genAI.getGenerativeModel({ 
        model: 'gemini-1.0-pro',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
    }
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

Keep responses conversational, warm, and under 150 words. Use emojis appropriately to convey emotion and warmth.`;
  }

  async generateResponse(userMessage: string, isFirstMessage: boolean = false): Promise<string> {
    // Fallback responses if no API key
    if (!this.model || !API_KEY) {
      return this.getFallbackResponse(userMessage, isFirstMessage);
    }

    try {
      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        parts: userMessage
      });

      // Create the full prompt with context
      const fullPrompt = `${this.getSystemPrompt()}

CONVERSATION HISTORY:
${this.conversationHistory.map(msg => `${msg.role}: ${msg.parts}`).join('\n')}

Please respond as the emotionally intelligent AI assistant for The Dynamic Rankers. ${isFirstMessage ? 'This is the first interaction, so start with a warm greeting and ask how they\'re feeling today.' : ''}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();

      // Add assistant response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        parts: text
      });

      // Keep conversation history manageable (last 10 exchanges)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      return this.getFallbackResponse(userMessage, isFirstMessage);
    }
  }

  private getFallbackResponse(userMessage: string, isFirstMessage: boolean): string {
    if (isFirstMessage) {
      return "Hi there! 👋 Welcome to The Dynamic Rankers! I'm genuinely excited to meet you and learn about your journey. I'm here not just to help with digital marketing, but to truly understand what you're going through and support you however I can. How are you feeling today?";
    }

    const input = userMessage.toLowerCase();
    
    // Emotional responses
    if (input.includes('good') || input.includes('great') || input.includes('fine')) {
      return "That's wonderful to hear! 🌟 I'm excited to help you today. What brings you to The Dynamic Rankers? Are you looking to grow your business online?";
    }
    
    if (input.includes('struggling') || input.includes('difficult') || input.includes('hard')) {
      return "I hear you, and I want you to know that struggling doesn't mean you're failing - it means you're fighting for something that matters to you. 💪 Many of our most successful clients came to us during their toughest moments. What's been the most challenging part of your journey lately?";
    }
    
    if (input.includes('website') || input.includes('web')) {
      return "Excellent! Website development is one of our core strengths! 🚀 We've helped businesses increase their website traffic by up to 300%. Are you looking to build a new website or improve your existing one?";
    }
    
    if (input.includes('seo') || input.includes('search')) {
      return "Perfect! SEO is our specialty! 📈 We've helped clients achieve 200-400% revenue growth through our proven SEO strategies. Are you currently struggling with search rankings?";
    }
    
    return "Thanks for sharing that with me! 😊 I want to make sure I give you the most helpful information. Could you tell me a bit more about what you're looking for? Are you interested in website development, SEO, social media marketing, or something else?";
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}