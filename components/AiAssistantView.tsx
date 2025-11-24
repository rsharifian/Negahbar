
import React, { useState, useRef, useEffect } from 'react';
import { Product, MovementLog, ChatMessage } from '../types';
import { getWarehouseAdvice } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles, Paperclip, X } from 'lucide-react';

interface AiAssistantViewProps {
  products: Product[];
  logs: MovementLog[];
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ products, logs }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'سلام! من دستیار هوشمند نگهبار هستم. چطور می‌تونم در مدیریت انبار یا ارسال بسته‌ها بهت کمک کنم؟ می‌تونی عکس کالا یا لیست سفارشات رو هم برام بفرستی.',
      timestamp: new Date()
    }
  ]);
  const [selectedFile, setSelectedFile] = useState<{data: string, mimeType: string, name: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        setSelectedFile({
          data: base64Data,
          mimeType: file.type,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input + (selectedFile ? `\n[پیوست: ${selectedFile.name}]` : ''),
      timestamp: new Date(),
      hasAttachment: !!selectedFile
    };

    setMessages(prev => [...prev, userMsg]);
    const currentFile = selectedFile; // Capture for the API call
    
    // Clear inputs immediately
    setInput('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setLoading(true);

    try {
      const imagePart = currentFile ? {
        inlineData: {
          data: currentFile.data,
          mimeType: currentFile.mimeType
        }
      } : undefined;

      const responseText = await getWarehouseAdvice(input || 'لطفا این فایل را تحلیل کن', products, logs, imagePart);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-bold text-[#353535]">هوش مصنوعی نگهبار</h3>
          <p className="text-xs text-slate-500">مشاور لجستیک و انبارداری شما (با قابلیت تحلیل تصویر)</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-jet-600' : 'bg-emerald-500'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-jet-50 text-[#353535] rounded-tr-none' 
                : 'bg-[#f9f9f9] text-[#353535] border border-slate-100 rounded-tl-none'
            }`}>
              <p className="text-sm leading-6 whitespace-pre-wrap">{msg.text}</p>
              {msg.hasAttachment && (
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 bg-white/50 p-1 rounded w-fit">
                   <Paperclip size={12} /> پیوست دارد
                </div>
              )}
              <span className="text-[10px] text-slate-400 mt-2 block opacity-70">
                {msg.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-[#f9f9f9] p-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              <span className="text-xs text-slate-500">درحال تفکر و تحلیل...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-jet-600">
            <Paperclip size={16} />
            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
          </div>
          <button onClick={() => { setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="p-1 hover:bg-slate-200 rounded-full">
            <X size={16} className="text-slate-500" />
          </button>
        </div>
      )}

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex gap-2 relative">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleFileSelect}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
            title="آپلود عکس یا فایل"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={selectedFile ? "توضیحی برای فایل بنویسید..." : "پیام خود را بنویسید..."}
            className="flex-1 bg-white border border-slate-200 text-[#353535] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-jet-500 transition-all placeholder-slate-400"
          />
          <button 
            onClick={handleSend}
            disabled={loading || (!input.trim() && !selectedFile)}
            className="p-3 bg-jet-600 hover:bg-jet-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-jet-200/50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
