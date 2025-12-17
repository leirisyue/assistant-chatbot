import React, { useState } from 'react';
import { getDebugProducts, getDebugMaterials, getChatHistory } from '../services/api';

interface DebugPanelProps {
  debugInfo: any;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ debugInfo }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'materials' | 'history'>('products');

  const refreshDebugInfo = async () => {
    setLoading(true);
    try {
      // Thực tế nên có callback để refresh từ parent
      // Ở đây chúng ta sẽ reload page để đơn giản
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing debug info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">🔍 Debug Info</h3>
        <button
          onClick={refreshDebugInfo}
          disabled={loading}
          className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
        >
          {loading ? 'Đang tải...' : 'Refresh'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['products', 'materials', 'history'] as const).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'products' ? '📦 Products' : tab === 'materials' ? '🧱 Materials' : '💬 History'}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && debugInfo?.products && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600">Tổng số</p>
              <p className="text-xl font-bold text-gray-900">{debugInfo.products.total_products}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-600">Có embeddings</p>
              <p className="text-xl font-bold text-gray-900">
                {debugInfo.products.with_embeddings} ({debugInfo.products.coverage_percent}%)
              </p>
            </div>
          </div>
          
          {debugInfo.products.by_category && debugInfo.products.by_category.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Phân bổ theo danh mục:</h4>
              <div className="space-y-2">
                {debugInfo.products.by_category.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{item.category || 'Unknown'}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && debugInfo?.materials && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600">Tổng số</p>
              <p className="text-xl font-bold text-gray-900">{debugInfo.materials.total_materials}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-600">Có embeddings</p>
              <p className="text-xl font-bold text-gray-900">
                {debugInfo.materials.with_embeddings} ({debugInfo.materials.coverage_percent}%)
              </p>
            </div>
          </div>
          
          {debugInfo.materials.by_group && debugInfo.materials.by_group.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Phân bổ theo nhóm:</h4>
              <div className="space-y-2">
                {debugInfo.materials.by_group.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{item.material_group || 'Unknown'}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && debugInfo?.history?.recent_chats && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Lịch sử chat gần đây:</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {debugInfo.history.recent_chats.map((chat: any, index: number) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {chat.user_message || 'No message'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                        {chat.intent || 'unknown'}
                      </span>
                      {chat.result_count > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                          {chat.result_count} kết quả
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(chat.created_at).toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Session: {chat.session_id?.substring(0, 8)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!debugInfo && (
        <div className="text-center py-8 text-gray-500">
          <p>Không có thông tin debug. Hãy nhấn Refresh để tải.</p>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;