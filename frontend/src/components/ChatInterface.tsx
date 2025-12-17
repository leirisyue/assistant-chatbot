import React from 'react';
import MessageBubble from './MessageBubble';
import ProductCard from './ProductCard';
import MaterialCard from './MaterialCard';
import MaterialDetail from './MaterialDetail';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  return (
    <div className="px-6 py-4 space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="space-y-4">
          <MessageBubble message={message} />
          
          {message.data?.products && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📦 Kết quả tìm kiếm sản phẩm ({message.data.products.length} sản phẩm)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {message.data.products.slice(0, 9).map((product, idx) => (
                  <ProductCard 
                    key={`${message.id}_${idx}`}
                    product={product}
                    onViewMaterials={() => onSendMessage(`Phân tích nguyên vật liệu sản phẩm ${product.headcode}`)}
                    onViewCost={() => onSendMessage(`Tính chi phí sản phẩm ${product.headcode}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {message.data?.materials && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🧱 Kết quả tìm kiếm nguyên vật liệu ({message.data.materials.length} vật liệu)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {message.data.materials.slice(0, 9).map((material, idx) => (
                  <MaterialCard 
                    key={`${message.id}_${idx}`}
                    material={material}
                    onViewDetail={() => onSendMessage(`Chi tiết vật liệu ${material.material_name}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Render material detail if available */}
          {message.data?.material_detail && (
            <div className="mt-4">
              <MaterialDetail 
                detail={message.data.material_detail}
                stats={message.data.stats}
                priceHistory={message.data.price_history}
                usedInProducts={message.data.used_in_products}
                latestPrice={message.data.latest_price}
                onViewProductCost={(headcode) => onSendMessage(`Tính chi phí sản phẩm ${headcode}`)}
              />
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">🤔 Đang suy nghĩ...</span>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;