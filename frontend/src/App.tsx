import React, { useState, useEffect, useRef } from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import SuggestedPrompts from './components/SuggestedPrompts';
import ImageUpload from './components/ImageUpload';
import { sendChatMessage, searchByImage } from './services/api';
import { Message, ChatContext } from './types';
import './index.css';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: `👋 Xin chào! Tôi là trợ lý AI của **AA Corporation** (Phiên bản 4.0).\n\nTôi có thể giúp bạn:\n• 🔍 **Tìm kiếm sản phẩm** (bằng mô tả hoặc hình ảnh)\n• 🧱 **Tìm kiếm nguyên vật liệu** (gỗ, da, đá, vải...)\n• 📋 **Xem định mức vật liệu** của sản phẩm\n• 💰 **Tính chi phí** sản phẩm (NVL + Nhân công + Lợi nhuận)\n• 🔗 **Tra cứu** vật liệu được dùng ở sản phẩm/dự án nào\n• 📈 **Xem lịch sử giá** vật liệu\n\n**🆕 Tính năng mới V4.0:**\n• 🤖 AI tự động phân loại sản phẩm/vật liệu\n• 📊 Lưu lịch sử truy vấn để học\n• ⚡ Import CSV dễ dàng hơn\n\nHãy chọn một trong các gợi ý bên dưới hoặc gõ câu hỏi của bạn!`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ChatContext>({
    last_search_results: [],
    current_products: [],
    current_materials: [],
    search_params: {}
  });
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    '🔍 Tìm sản phẩm',
    '🧱 Tìm nguyên vật liệu',
    '💰 Tính chi phí',
    '📋 Danh sách nhóm vật liệu'
  ]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message?: string) => {
    const userMessage = message || input.trim();
    if (!userMessage) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');

    setIsLoading(true);
    try {
      const response = await sendChatMessage(sessionId, userMessage, context);
      
      // Update context
      if (response.products) {
        setContext(prev => ({
          ...prev,
          current_products: response.products,
          last_search_results: response.products.map((p: any) => p.headcode)
        }));
      }
      if (response.materials) {
        setContext(prev => ({
          ...prev,
          current_materials: response.materials
        }));
      }

      // Add bot message
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.response || 'Không có phản hồi',
        timestamp: new Date(),
        data: response
      };
      setMessages(prev => [...prev, newBotMessage]);

      // Update suggested prompts
      if (response.suggested_prompts) {
        setSuggestedPrompts(response.suggested_prompts);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: '⚠️ Đã xảy ra lỗi. Vui lòng thử lại.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: '📷 [Đã upload ảnh]',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await searchByImage(file);
      
      // Update context
      if (response.products) {
        setContext(prev => ({
          ...prev,
          current_products: response.products,
          last_search_results: response.products.map((p: any) => p.headcode)
        }));
      }

      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.response,
        timestamp: new Date(),
        data: response
      };
      setMessages(prev => [...prev, botMessage]);

      // Update suggested prompts
      if (response.products?.[0]) {
        setSuggestedPrompts([
          `💰 Xem chi phí ${response.products[0].headcode}`,
          `📋 Phân tích vật liệu ${response.products[0].headcode}`,
          '🔍 Tìm sản phẩm khác'
        ]);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: '⚠️ Lỗi xử lý ảnh. Vui lòng thử lại.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: '1',
        role: 'bot',
        content: `👋 Xin chào! Tôi là trợ lý AI của **AA Corporation** (Phiên bản 4.0).\n\nTôi có thể giúp bạn:\n• 🔍 **Tìm kiếm sản phẩm** (bằng mô tả hoặc hình ảnh)\n• 🧱 **Tìm kiếm nguyên vật liệu** (gỗ, da, đá, vải...)\n• 📋 **Xem định mức vật liệu** của sản phẩm\n• 💰 **Tính chi phí** sản phẩm (NVL + Nhân công + Lợi nhuận)\n• 🔗 **Tra cứu** vật liệu được dùng ở sản phẩm/dự án nào\n• 📈 **Xem lịch sử giá** vật liệu\n\n**🆕 Tính năng mới V4.0:**\n• 🤖 AI tự động phân loại sản phẩm/vật liệu\n• 📊 Lưu lịch sử truy vấn để học\n• ⚡ Import CSV dễ dàng hơn\n\nHãy chọn một trong các gợi ý bên dưới hoặc gõ câu hỏi của bạn!`,
        timestamp: new Date(),
      }
    ]);
    setContext({
      last_search_results: [],
      current_products: [],
      current_materials: [],
      search_params: {}
    });
    setSuggestedPrompts([
      '🔍 Tìm sản phẩm',
      '🧱 Tìm nguyên vật liệu',
      '💰 Tính chi phí',
      '📋 Danh sách nhóm vật liệu'
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* <Sidebar 
          onResetChat={handleResetChat}
          onImportSuccess={() => console.log('Import successful')}
        /> */}
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  🏢 AA Corporation AI Assistant
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    V4.0
                  </span>
                </h1>
                <p className="text-gray-600 mt-1">
                  Trợ Lý AI Nội Thất Thông Minh - Hỗ trợ Sản phẩm & Vật liệu
                </p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Chat Interface */}
              <div className="flex-1 overflow-y-auto">
                <ChatInterface 
                  messages={messages} 
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts */}
              {messages.length > 0 && (
                <div className="border-t border-gray-200 bg-white px-6 py-4">
                  <SuggestedPrompts 
                    prompts={suggestedPrompts} 
                    onSelect={handleSendMessage} 
                  />
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-gray-200 bg-white px-6 py-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Nhập câu hỏi của bạn... (VD: Tìm bàn tròn gỗ sồi, hoặc Tìm gỗ làm bàn...)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {isLoading ? 'Đang xử lý...' : '📤 Gửi'}
                  </button>
                </div>

                {/* Image Upload */}
                <div className="mt-4">
                  <ImageUpload onUpload={handleImageUpload} disabled={isLoading} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;