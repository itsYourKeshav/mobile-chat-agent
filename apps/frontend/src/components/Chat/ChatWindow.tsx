import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ChatResponse } from '@repo/shared-types';
import { sendMessage } from '../../api/client';
import { PhoneCard } from '../Product/PhoneCard';
import { ComparisonTable } from '../Product/ComparisonTable';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  data?: ChatResponse;
}

export const ChatWindow = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
        id: 'welcome', 
        role: 'assistant', 
        text: 'Hello! I am your AI Shopping Assistant. I can help you find smartphones, compare models, or explain specs. Try asking "Best phones under 30000" or "Compare Pixel 8 and iPhone 15".' 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessage(userMsg.text!);
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        data: response 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        text: "I'm sorry, I encountered an error connecting to the server. Please try again."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] lg:max-w-[75%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
            }`}>
              {msg.text && <p className="leading-relaxed">{msg.text}</p>}
              
              {msg.data && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                     <Sparkles size={18} className="text-purple-400 mt-1 shrink-0" />
                     <p className="leading-relaxed">{msg.data.summary}</p>
                  </div>

                  {msg.data.explanation && (
                    <div className="bg-slate-900/50 p-3 rounded-lg border-l-2 border-yellow-500 text-sm italic text-slate-400">
                        {msg.data.explanation}
                    </div>
                  )}

                  {Array.isArray(msg.data.recommendations) && msg.data.recommendations.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Found Devices</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {msg.data.recommendations.map(phone => (
                                <PhoneCard key={phone.id} phone={phone} />
                            ))}
                        </div>
                    </div>
                  )}

                  {Array.isArray(msg.data.comparison) && msg.data.comparison.length > 0 && (
                     <div className="space-y-2">
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Side-by-Side Comparison</div>
                        <ComparisonTable phones={msg.data.comparison} />
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
             <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl p-4 rounded-bl-none border border-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50">
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about phones, budgets, or features..."
            className="flex-1 bg-slate-800 border-none text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 transition-all flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
