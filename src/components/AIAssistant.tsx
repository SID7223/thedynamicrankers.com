import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);
  const [currentFunnelStage, setCurrentFunnelStage] = useState<string>('initial');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      // Initialize service only when chat is opened
      if (!geminiService) {
        setGeminiService(new GeminiService());
      }
      // Generate greeting with slight delay for better UX
      setTimeout(() => {
        generateGeminiResponse('', true);
      }, 100);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, geminiService]);

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Update funnel stage based on user selection
    updateFunnelStage(text);
  };

  const updateFunnelStage = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    // Initial stage transitions
    if (currentFunnelStage === 'initial') {
      if (message.includes('seo')) {
        setCurrentFunnelStage('seo-interest');
      } else if (message.includes('website')) {
        setCurrentFunnelStage('website-interest');
      } else if (message.includes('social media')) {
        setCurrentFunnelStage('social-interest');
      } else if (message.includes('services')) {
        setCurrentFunnelStage('services-overview');
      } else if (message.includes('prices')) {
        setCurrentFunnelStage('pricing-interest');
      }
    }
    // SEO funnel
    else if (currentFunnelStage === 'seo-interest') {
      if (message.includes('local seo') || message.includes('rankings')) {
        setCurrentFunnelStage('seo-local');
      } else if (message.includes('competitor') || message.includes('analysis')) {
        setCurrentFunnelStage('seo-competitive');
      } else if (message.includes('audit') || message.includes('current')) {
        setCurrentFunnelStage('seo-audit');
      }
    }
    // Website funnel
    else if (currentFunnelStage === 'website-interest') {
      if (message.includes('redesign') || message.includes('existing')) {
        setCurrentFunnelStage('website-redesign');
      } else if (message.includes('new') || message.includes('from scratch')) {
        setCurrentFunnelStage('website-new');
      } else if (message.includes('e-commerce') || message.includes('online store')) {
        setCurrentFunnelStage('website-ecommerce');
      }
    }
    // Social media funnel
    else if (currentFunnelStage === 'social-interest') {
      if (message.includes('facebook') || message.includes('instagram')) {
        setCurrentFunnelStage('social-platforms');
      } else if (message.includes('content') || message.includes('posts')) {
        setCurrentFunnelStage('social-content');
      } else if (message.includes('ads') || message.includes('advertising')) {
        setCurrentFunnelStage('social-ads');
      }
    }
    // End stages - reset to allow free chat
    else if (['seo-local', 'seo-competitive', 'seo-audit', 'website-redesign', 'website-new', 'website-ecommerce', 'social-platforms', 'social-content', 'social-ads', 'pricing-consultation'].includes(currentFunnelStage)) {
      setCurrentFunnelStage('free-chat');
    }
  };

  const getQuickRepliesForStage = () => {
    switch (currentFunnelStage) {
      case 'initial':
        return [
          "I need help with SEO",
          "I want a new website", 
          "Tell me about your services",
          "I'm interested in social media marketing",
          "What are your prices?"
        ];
      
      case 'seo-interest':
        return [
          "I need local SEO help",
          "My competitors outrank me",
          "Can you audit my current SEO?",
          "How much does SEO cost?",
          "When will I see results?"
        ];
      
      case 'website-interest':
        return [
          "I need a website redesign",
          "I want a brand new website",
          "I need an e-commerce store",
          "How long does it take?",
          "What's included in the price?"
        ];
      
      case 'social-interest':
        return [
          "Focus on Facebook & Instagram",
          "I need content creation help",
          "I want to run social media ads",
          "How do you measure success?",
          "What's your monthly rate?"
        ];
      
      case 'services-overview':
        return [
          "Tell me about SEO services",
          "What website packages do you offer?",
          "How does social media marketing work?",
          "Do you offer package deals?",
          "Can I get a free consultation?"
        ];
      
      case 'pricing-interest':
        return [
          "SEO pricing options",
          "Website development costs",
          "Social media management rates",
          "Do you offer payment plans?",
          "Can I get a custom quote?"
        ];
      
      case 'seo-local':
      case 'seo-competitive':
      case 'seo-audit':
        return [
          "Schedule a free SEO consultation",
          "Get a custom SEO quote",
          "Start with SEO audit",
          "Ask more questions in chat"
        ];
      
      case 'website-redesign':
      case 'website-new':
      case 'website-ecommerce':
        return [
          "Get a free website consultation",
          "Request a custom quote",
          "See our portfolio",
          "Ask more questions in chat"
        ];
      
      case 'social-platforms':
      case 'social-content':
      case 'social-ads':
        return [
          "Schedule social media consultation",
          "Get a custom social media quote",
          "See our success stories",
          "Ask more questions in chat"
        ];
      
      case 'free-chat':
        return [
          "Schedule a consultation",
          "Get a custom quote",
          "Learn about other services",
          "Speak with a specialist"
        ];
      
      default:
        return [
          "I need help with SEO",
          "I want a new website",
          "Tell me about your services",
          "I'm interested in social media marketing",
          "What are your prices?"
        ];
    }
  };

  const generateGeminiResponse = async (userInput: string, isFirstMessage: boolean = false) => {
    if (!geminiService) return;
    
    setIsTyping(true);
    try {
      const response = await geminiService.generateResponse(userInput, isFirstMessage);
      const newMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error generating response:', error);
      // Fallback to original response system
      const fallbackResponse = analyzeUserResponse(userInput);
      const newMessage: Message = {
        id: Date.now().toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }
  };

  const analyzeUserResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Enhanced Emotional Intelligence & Empathy
    
    // Positive emotions
    if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
      return "Hello! Great to meet you! 😊 I'd love to learn more about your business. Are you looking to improve your online presence, or do you have a specific digital marketing challenge you're facing?";
    }
    
    if (input.includes('amazing') || input.includes('fantastic') || input.includes('excellent') || input.includes('wonderful')) {
      return "That's absolutely fantastic! 🎉 Your positive energy is contagious! I can already tell you're someone who goes after success. Let's channel that energy into growing your business even more! What exciting goals do you have for your company?";
    }
    
    if (input.includes('good') || input.includes('great') || input.includes('fine') || input.includes('well') || input.includes('okay') || input.includes('alright')) {
      return "That's wonderful to hear! 🌟 I'm excited to help you today. What brings you to The Dynamic Rankers? Are you looking to grow your business online?";
    }
    
    if (input.includes('excited') || input.includes('thrilled') || input.includes('pumped') || input.includes('motivated')) {
      return "I love your enthusiasm! 🚀 That kind of positive energy is exactly what drives business success! I'm just as excited to help you achieve your goals. What's got you most excited about growing your business right now?";
    }
    
    // Negative emotions - with deep empathy
    if (input.includes('terrible') || input.includes('awful') || input.includes('horrible') || input.includes('worst')) {
      return "I'm truly sorry you're going through such a tough time right now. 💙 That sounds really challenging, and I want you to know that your feelings are completely valid. Sometimes when everything feels overwhelming, that's actually when we're closest to a breakthrough. I'm here to listen and help however I can. Would you like to share what's been weighing on you most?";
    }
    
    if (input.includes('struggling') || input.includes('difficult') || input.includes('hard') || input.includes('tough')) {
      return "I hear you, and I want you to know that struggling doesn't mean you're failing - it means you're fighting for something that matters to you. 💪 That takes real courage. Many of our most successful clients came to us during their toughest moments. Sometimes the struggle is just before the breakthrough. What's been the most challenging part of your journey lately?";
    }
    
    if (input.includes('frustrated') || input.includes('annoyed') || input.includes('irritated') || input.includes('fed up')) {
      return "I completely understand that frustration - it's one of the most draining emotions, especially when you're working so hard and not seeing the results you deserve. 😤 Your frustration is valid, and honestly, it shows how much you care about your success. Let's turn that frustration into fuel for positive change. What's been the most frustrating part of your business journey?";
    }
    
    if (input.includes('stressed') || input.includes('overwhelmed') || input.includes('anxious') || input.includes('worried')) {
      return "I can really feel the weight you're carrying right now, and I want you to take a deep breath with me. 🌸 Stress and overwhelm are your mind's way of saying you care deeply about your success. That's actually a strength, even though it doesn't feel like it right now. You don't have to carry this burden alone. What's been causing you the most stress lately?";
    }
    
    if (input.includes('sad') || input.includes('down') || input.includes('depressed') || input.includes('low')) {
      return "I'm sending you a virtual hug right now. 🤗 Feeling down is part of the human experience, and it's okay to sit with these feelings for a moment. You're not alone in this. Sometimes our lowest moments teach us the most about our resilience. I'm here to support you, not just as a business assistant, but as someone who genuinely cares. What would help you feel a little lighter today?";
    }
    
    if (input.includes('angry') || input.includes('mad') || input.includes('furious') || input.includes('pissed')) {
      return "I can feel the intensity of your emotions right now, and that's completely okay. 🔥 Anger often comes from a place of caring deeply and feeling like things aren't fair or right. Your feelings are valid. Sometimes anger can be a powerful motivator for positive change. I'm here to listen without judgment. What's really got you fired up?";
    }
    
    if (input.includes('confused') || input.includes('lost') || input.includes('don\'t know') || input.includes('unsure')) {
      return "Feeling confused or uncertain is actually a sign of wisdom - it means you're thoughtful about your decisions and want to make the right choice. 🤔 That's admirable! Confusion often comes right before clarity. I'm here to help you sort through the fog and find a clear path forward. What's been the most confusing part of your business journey?";
    }
    
    if (input.includes('tired') || input.includes('exhausted') || input.includes('drained') || input.includes('burnt out')) {
      return "Oh, I can really hear the exhaustion in your words. 😴 You've been working so hard, and that kind of dedication is admirable, but you also deserve rest and support. Burnout is real, and it's your body and mind asking for care. You don't have to do everything alone. What if we could find ways to make your business work better for you, instead of you working so hard for it?";
    }
    
    // Neutral but seeking emotions
    if (input.includes('curious') || input.includes('interested') || input.includes('wondering')) {
      return "I love your curiosity! 🤓 Curious minds are the ones that discover the best opportunities. That questioning spirit is exactly what leads to business breakthroughs. I'm excited to explore possibilities with you! What's sparked your curiosity about digital marketing?";
    }
    
    if (input.includes('hopeful') || input.includes('optimistic') || input.includes('positive')) {
      return "Your hope and optimism are beautiful qualities! ✨ Hope is the foundation of all great achievements. With that positive mindset, you're already ahead of the game. I believe in your vision, and I'm here to help make it a reality. What are you most hopeful about for your business?";
    }
    
    if (input.includes('nervous') || input.includes('scared') || input.includes('afraid') || input.includes('worried')) {
      return "It's completely natural to feel nervous about new ventures or changes - it shows you're stepping outside your comfort zone, which is where all growth happens! 🌱 Your nervousness is actually courage in disguise. I'm here to support you every step of the way and make this journey as smooth as possible. What's making you feel most nervous right now?";
    }
    
    // Gratitude and appreciation
    if (input.includes('thank') || input.includes('grateful') || input.includes('appreciate')) {
      return "Aww, your gratitude just made my day! 🥰 Thank YOU for being so kind and open. It's an honor to help someone with such a positive spirit. Your appreciation means the world to me, and it motivates me to give you the best support possible!";
    }
    
    // Skeptical but understanding
    if (input.includes('skeptical') || input.includes('doubtful') || input.includes('not convinced')) {
      return "I really respect your skepticism - it shows you're a smart, thoughtful business owner who doesn't make hasty decisions. 🧠 That's exactly the kind of careful thinking that leads to success! Healthy skepticism protects you from bad choices. I'd love to earn your trust by showing you real results and being completely transparent. What would help address your concerns?";
    }
    
    // Business-related responses
    if (input.includes('website') || input.includes('web')) {
      return "Excellent! Website development is one of our core strengths! 🚀 We've helped businesses increase their website traffic by up to 300%. Are you looking to build a new website or improve your existing one?";
    }
    
    if (input.includes('seo') || input.includes('search') || input.includes('google') || input.includes('ranking')) {
      return "Perfect! SEO is our specialty! 📈 We've helped clients achieve 200-400% revenue growth through our proven SEO strategies. Are you currently struggling with search rankings or looking to dominate your competition?";
    }
    
    if (input.includes('social media') || input.includes('facebook') || input.includes('instagram') || input.includes('twitter')) {
      return "Great choice! Our social media marketing has helped clients double their engagement rates! 📱✨ Which platforms are you most interested in, and what are your current social media goals?";
    }
    
    if (input.includes('marketing') || input.includes('advertising') || input.includes('ads')) {
      return "Fantastic! Digital marketing is what we live and breathe! 💪 We offer everything from SEO and SEM to social media marketing. What's your main goal - more traffic, leads, or sales?";
    }
    
    if (input.includes('help') || input.includes('support') || input.includes('customer service')) {
      return "We'd love to help! 🤝 We provide 24/7 customer support and have a 100% client satisfaction rate. What specific area would you like assistance with today?";
    }
    
    // Business size/type questions
    if (input.includes('small business') || input.includes('startup') || input.includes('new business')) {
      return "Perfect! We love working with growing businesses! 🌱 Small businesses often see the most dramatic results from our services. What industry are you in, and what's your biggest challenge right now?";
    }
    
    if (input.includes('budget') || input.includes('cost') || input.includes('price') || input.includes('expensive')) {
      return "I totally understand - budget is important! 💰 The great news is that our clients typically see a 4-6x return on their investment. Would you like to know about our different service packages, or shall we start with a free consultation?";
    }
    
    // Positive interest indicators
    if (input.includes('interested') || input.includes('tell me more') || input.includes('learn more') || input.includes('sounds good')) {
      return "That's awesome! I'm excited to share more! 🎉 We have several ways we can help your business grow. Would you prefer to see some of our success stories, learn about our services, or jump straight to a free consultation?";
    }
    
    // Skeptical responses
    if (input.includes('not sure') || input.includes('maybe') || input.includes('thinking') || input.includes('considering')) {
      return "I completely understand - it's smart to be thoughtful about these decisions! 🤔 How about I share a quick success story? We helped TechStart Solutions increase their website traffic by 300% in just 6 months. Would you like to hear more about how we did it?";
    }
    
    // Emotional support for business challenges
    if (input.includes('failing') || input.includes('failure') || input.includes('not working')) {
      return "First, let me say this: you are NOT a failure. 💙 The fact that you're here, seeking solutions and not giving up, proves you're a fighter. Every successful business owner has faced moments that felt like failure - they're actually stepping stones to success. I've seen businesses turn around completely from exactly where you are now. You're closer to success than you think. What feels like it's not working right now?";
    }
    
    if (input.includes('competitor') || input.includes('competition') || input.includes('behind')) {
      return "I understand how disheartening it can feel to see competitors ahead of you. 😔 But here's what I know: you have something unique that they don't - your specific vision, passion, and story. We've helped many businesses not just catch up to their competition, but completely surpass them. Your time is coming! What do you think your competitors are doing that you'd like to do better?";
    }
    
    // Generic business inquiry
    if (input.includes('business') || input.includes('company') || input.includes('grow') || input.includes('increase')) {
      return "Excellent! Growing your business is exactly what we're here for! 📊 We've helped over 100 clients achieve significant growth. What aspect of your business would you most like to improve - visibility, traffic, leads, or sales?";
    }
    
    // Default response for unclear input
    return "Thanks for sharing that with me! 😊 I want to make sure I give you the most helpful information. Could you tell me a bit more about what you're looking for? Are you interested in website development, SEO, social media marketing, or something else entirely?";
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addUserMessage(inputValue);
      generateGeminiResponse(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = getQuickRepliesForStage();

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white mx-auto" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white mx-auto" />
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200 dark:border-gray-600">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Dynamic Rankers Assistant</h3>
                <p className="text-xs text-blue-100">Online • Ready to help!</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="w-4 h-4 mt-0.5 text-blue-500" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-0.5 text-white" />
                    )}
                    <span>{message.text}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Replies */}
            {isOpen && !isTyping && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Quick replies:</p>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addUserMessage(reply);
                      generateGeminiResponse(reply);
                    }}
                    className="block w-full text-left text-xs bg-blue-50 dark:bg-gray-600 hover:bg-blue-100 dark:hover:bg-gray-500 text-blue-700 dark:text-blue-300 px-2 py-1 rounded transition-colors duration-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors duration-200"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;