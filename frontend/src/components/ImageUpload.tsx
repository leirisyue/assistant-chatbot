import React, { useRef } from 'react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  disabled: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && /\.(jpg|jpeg|png)$/i.test(file.name)) {
      onUpload(file);
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-2">📷 Hoặc upload ảnh sản phẩm để tìm kiếm</p>
      <input
        type="file"
        ref={fileInputRef}
        accept=".png,.jpg,.jpeg"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        📁 Click để chọn ảnh (PNG, JPG, JPEG)
      </button>
    </div>
  );
};

export default ImageUpload;