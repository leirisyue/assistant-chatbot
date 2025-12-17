import React, { useState, useEffect } from 'react';
import { MaterialDetail as MaterialDetailType } from '../types';

interface MaterialDetailProps {
  detail: MaterialDetailType;
  stats?: {
    product_count?: number;
    project_count?: number;
    total_quantity?: number;
  };
  priceHistory?: Array<{ date: string; price: number }>;
  usedInProducts?: Array<{
    headcode: string;
    product_name: string;
    category?: string;
    sub_category?: string;
    project?: string;
    quantity: number;
    unit?: string;
  }>;
  latestPrice?: number;
  onViewProductCost: (headcode: string) => void;
}

const MaterialDetail: React.FC<MaterialDetailProps> = ({
  detail,
  stats,
  priceHistory,
  usedInProducts,
  latestPrice,
  onViewProductCost
}) => {
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'products'>('details');

  // Try to load image
  useEffect(() => {
    if (detail.image_url) {
      setImageError(false);
      const img = new Image();
      img.src = detail.image_url;
      img.onerror = () => setImageError(true);
    }
  }, [detail.image_url]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const sortedPriceHistory = priceHistory
    ? [...priceHistory].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : [];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              🧱 {detail.material_name}
            </h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Mã SAP: {detail.id_sap}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {detail.material_group}
                {detail.material_subgroup && ` - ${detail.material_subgroup}`}
              </span>
            </div>
          </div>
          
          {latestPrice !== undefined && latestPrice > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Giá mới nhất</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(latestPrice)}/{detail.unit || ''}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {['details', 'history', 'products'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === 'details' ? '📊 Chi tiết' : 
               tab === 'history' ? '📈 Lịch sử giá' : '🔗 Sản phẩm sử dụng'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Image */}
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                {detail.image_url && !imageError ? (
                  <img
                    src={detail.image_url}
                    alt={detail.material_name}
                    className="w-full h-64 object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                    <span className="text-white text-6xl">🧱</span>
                  </div>
                )}
              </div>
              
              {detail.image_url && !imageError && (
                <a
                  href={detail.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium"
                >
                  🔗 Mở ảnh trong tab mới
                </a>
              )}
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin cơ bản</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Tên vật liệu</p>
                    <p className="font-medium">{detail.material_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nhóm vật liệu</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{detail.material_group}</span>
                      {detail.material_subgroup && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span>{detail.material_subgroup}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Đơn vị tính</p>
                    <p className="font-medium">{detail.unit || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              {stats && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Thống kê sử dụng</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-700">
                        {stats.product_count || 0}
                      </p>
                      <p className="text-sm text-gray-600">Sản phẩm</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-700">
                        {stats.project_count || 0}
                      </p>
                      <p className="text-sm text-gray-600">Dự án</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-700">
                        {stats.total_quantity || 0}
                      </p>
                      <p className="text-sm text-gray-600">Tổng lượng</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Lịch sử giá</h3>
              
              {sortedPriceHistory.length > 0 ? (
                <div className="space-y-3">
                  {sortedPriceHistory.slice(0, 10).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{item.date}</p>
                          <p className="text-sm text-gray-600">Cập nhật giá</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          {formatPrice(item.price)}
                        </p>
                        <p className="text-sm text-gray-600">/ {detail.unit || ''}</p>
                      </div>
                    </div>
                  ))}
                  
                  {sortedPriceHistory.length > 10 && (
                    <p className="text-center text-gray-500 text-sm">
                      ...và {sortedPriceHistory.length - 10} bản ghi khác
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <p className="text-gray-600">Chưa có lịch sử giá cho vật liệu này</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔗 Sản phẩm sử dụng vật liệu này
              </h3>
              
              {usedInProducts && usedInProducts.length > 0 ? (
                <div className="space-y-4">
                  {usedInProducts.slice(0, 10).map((product, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {product.product_name}
                            </h4>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                              {product.headcode}
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            {product.category && (
                              <p>📂 Danh mục: {product.category} {product.sub_category && `- ${product.sub_category}`}</p>
                            )}
                            {product.project && (
                              <p>🏗️ Dự án: {product.project}</p>
                            )}
                            <p className="font-medium">
                              📦 Sử dụng: {product.quantity} {product.unit || ''}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => onViewProductCost(product.headcode)}
                          className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm font-medium whitespace-nowrap"
                        >
                          💰 Xem chi phí
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {usedInProducts.length > 10 && (
                    <p className="text-center text-gray-500 text-sm">
                      ...và {usedInProducts.length - 10} sản phẩm khác
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <p className="text-gray-600">Vật liệu này chưa được gắn vào sản phẩm nào</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Có thể import file BOM để liên kết vật liệu với sản phẩm
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Notes */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600 text-center">
          💡 <strong>Lưu ý:</strong> Giá và thông tin được cập nhật từ lịch sử mua hàng gần nhất.
          Giá thực tế có thể thay đổi theo thị trường và số lượng đặt hàng.
        </p>
      </div>
    </div>
  );
};

export default MaterialDetail;