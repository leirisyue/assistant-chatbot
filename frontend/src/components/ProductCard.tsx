import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewMaterials: () => void;
  onViewCost: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewMaterials, onViewCost }) => {
  return (
    <div className="product-card">
      <h4 className="font-semibold text-gray-900 truncate mb-2">
        {product.product_name.length > 50 
          ? `${product.product_name.substring(0, 50)}...` 
          : product.product_name}
      </h4>
      
      <div className="space-y-1 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <span className="mr-2">🏷️</span>
          <span className="font-mono font-semibold">{product.headcode}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">📦</span>
          <span>{product.category || 'N/A'} - {product.sub_category || 'N/A'}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">🪵</span>
          <span>{product.material_primary || 'N/A'}</span>
        </div>
        {product.project && (
          <div className="flex items-center">
            <span className="mr-2">🗝️</span>
            <span>Dự án: {product.project}</span>
          </div>
        )}
        {product.similarity !== undefined && (
          <div className="flex items-center text-blue-600">
            <span className="mr-2">📊</span>
            <span>Độ tương đồng: {(product.similarity * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2 pt-2 border-t border-gray-100">
        <button
          onClick={onViewMaterials}
          className="flex-1 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition text-sm"
        >
          📋 Vật liệu
        </button>
        <button
          onClick={onViewCost}
          className="flex-1 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition text-sm"
        >
          💰 Chi phí
        </button>
      </div>
    </div>
  );
};

export default ProductCard;