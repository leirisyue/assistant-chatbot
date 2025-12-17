import React, { useState, useEffect } from 'react';
import { Material } from '../types';

interface MaterialCardProps {
  material: Material;
  onViewDetail: () => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onViewDetail }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    if (material.image_url) {
      setHasImage(true);
      const img = new Image();
      img.src = material.image_url;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setHasImage(false);
    }
  }, [material.image_url]);

  return (
    <div className="material-card">
      {/* Image Section */}
      <div className="mb-3">
        {hasImage && imageLoaded ? (
          <img
            src={material.image_url}
            alt={material.material_name}
            className="w-full h-40 object-cover rounded-lg"
            onError={() => setHasImage(false)}
          />
        ) : (
          <div className="w-full h-40 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-4xl">🧱</span>
          </div>
        )}
      </div>

      <h4 className="font-semibold text-gray-900 truncate mb-2">
        {material.material_name.length > 40
          ? `${material.material_name.substring(0, 40)}...`
          : material.material_name}
      </h4>

      <div className="space-y-1 text-sm text-gray-600 mb-3">
        <div className="flex items-center">
          <span className="mr-2">🏷️</span>
          <span className="font-mono font-semibold">SAP: {material.id_sap}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">📂</span>
          <span>Nhóm: {material.material_group || 'N/A'}</span>
        </div>
        {material.price !== undefined && material.price > 0 && (
          <div className="price-badge">
            💰 {material.price.toLocaleString()} VNĐ/{material.unit || ''}
          </div>
        )}
      </div>

      <div className="flex space-x-2 pt-2 border-t border-gray-200">
        <button
          onClick={onViewDetail}
          className="flex-1 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition text-sm"
        >
          🔍 Chi tiết
        </button>
        {material.image_url && (
          <a
            href={material.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition text-sm text-center"
          >
            🔗 Drive
          </a>
        )}
      </div>
    </div>
  );
};

export default MaterialCard;