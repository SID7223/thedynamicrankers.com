import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setTimeout(() => {
        addBotMessage("Hi there! 👋 Welcome to The Dynamic Rankers! I'm here to help you with any questions about our digital marketing services. How are you doing today?");
        setHasGreeted(true);
      }, 500);
    }
  }, [isOpen, hasGreeted]);

  const addBotMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay for more natural feel
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const analyzeUserResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Greeting responses
    if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
      return "Hello! Great to meet you! 😊 I'd love to learn more about your business. Are you looking to improve your online presence, or do you have a specific digital marketing challenge you're facing?";
    }
    
    if (input.includes('good') || input.includes('great') || input.includes('fine') || input.includes('well')) {
      return "That's wonderful to hear! 🌟 I'm excited to help you today. What brings you to The Dynamic Rankers? Are you looking to grow your business online?";
    }
    
    if (input.includes('not good') || input.includes('bad') || input.includes('terrible') || input.includes('struggling')) {
      return "I'm sorry to hear that! 😔 But you know what? You've come to the right place! We specialize in turning business challenges into success stories. What's been the biggest obstacle for your business lately?";
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
      const response = analyzeUserResponse(inputValue);
      addBotMessage(response);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = [
    "I need help with SEO",
    "I want a new website",
    "Tell me about your services",
    "I'm interested in social media marketing",
    "What are your prices?"
  ];

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
            {messages.length === 1 && !isTyping && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Quick replies:</p>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addUserMessage(reply);
                      const response = analyzeUserResponse(reply);
                      addBotMessage(response);
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