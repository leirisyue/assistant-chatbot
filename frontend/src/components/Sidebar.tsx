import React, { useState } from 'react';
import ImportSection from './ImportSection';
import DebugPanel from './DebugPanel';
import { 
  generateProductEmbeddings, 
  generateMaterialEmbeddings,
  getDebugProducts,
  getDebugMaterials,
  getChatHistory
} from '../services/api';

interface SidebarProps {
  onResetChat: () => void;
  onImportSuccess: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onResetChat, onImportSuccess }) => {
  const [activeTab, setActiveTab] = useState<'import' | 'embeddings' | 'debug'>('import');
  const [isGeneratingEmbeddings, setIsGeneratingEmbeddings] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleGenerateProductEmbeddings = async () => {
    setIsGeneratingEmbeddings(true);
    try {
      const result = await generateProductEmbeddings();
      alert(result.message || 'Đã tạo embeddings cho sản phẩm!');
    } catch (error) {
      alert('Lỗi khi tạo embeddings sản phẩm');
    } finally {
      setIsGeneratingEmbeddings(false);
    }
  };

  const handleGenerateMaterialEmbeddings = async () => {
    setIsGeneratingEmbeddings(true);
    try {
      const result = await generateMaterialEmbeddings();
      alert(result.message || 'Đã tạo embeddings cho vật liệu!');
    } catch (error) {
      alert('Lỗi khi tạo embeddings vật liệu');
    } finally {
      setIsGeneratingEmbeddings(false);
    }
  };

  const handleLoadDebugInfo = async () => {
    try {
      const [products, materials, history] = await Promise.all([
        getDebugProducts(),
        getDebugMaterials(),
        getChatHistory()
      ]);
      setDebugInfo({ products, materials, history });
    } catch (error) {
      alert('Không thể tải thông tin debug');
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto scrollbar-thin">
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            ⚙️ Quản Trị Hệ Thống
          </h2>
          <span className="version-badge mt-1">V4.5</span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'import'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('import')}
          >
            📤 Import
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'embeddings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('embeddings')}
          >
            🧠 Embeddings
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === 'debug'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => {
              setActiveTab('debug');
              handleLoadDebugInfo();
            }}
          >
            🔍 Debug
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'import' && (
          <ImportSection onImportSuccess={onImportSuccess} />
        )}

        {activeTab === 'embeddings' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🧠 Vector Embeddings</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Sản phẩm</p>
                  <button
                    onClick={handleGenerateProductEmbeddings}
                    disabled={isGeneratingEmbeddings}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition text-sm font-medium"
                  >
                    {isGeneratingEmbeddings ? 'Đang xử lý...' : '⚡ Generate Product Embeddings'}
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Vật liệu</p>
                  <button
                    onClick={handleGenerateMaterialEmbeddings}
                    disabled={isGeneratingEmbeddings}
                    className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition text-sm font-medium"
                  >
                    {isGeneratingEmbeddings ? 'Đang xử lý...' : '⚡ Generate Material Embeddings'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'debug' && debugInfo && (
          <DebugPanel debugInfo={debugInfo} />
        )}

        {/* Reset Chat Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onResetChat}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition font-medium"
          >
            🔄 Reset Chat Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;