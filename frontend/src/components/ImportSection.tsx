import React, { useState } from 'react';
import {
  importProducts,
  importMaterials,
  importProductMaterials,
  classifyProducts,
  classifyMaterials
} from '../services/api';

interface ImportSectionProps {
  onImportSuccess: () => void;
}

const ImportSection: React.FC<ImportSectionProps> = ({ onImportSuccess }) => {
  const [productsFile, setProductsFile] = useState<File | null>(null);
  const [materialsFile, setMaterialsFile] = useState<File | null>(null);
  const [bomFile, setBomFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [productsResult, setProductsResult] = useState<any>(null);
  const [materialsResult, setMaterialsResult] = useState<any>(null);
  const [bomResult, setBomResult] = useState<any>(null);

  const handleFileChange = (type: 'products' | 'materials' | 'bom', file: File | null) => {
    switch (type) {
      case 'products':
        setProductsFile(file);
        break;
      case 'materials':
        setMaterialsFile(file);
        break;
      case 'bom':
        setBomFile(file);
        break;
    }
  };

  const handleImport = async (type: 'products' | 'materials' | 'bom') => {
    let file: File | null = null;
    let importFunc: (file: File) => Promise<any>;

    switch (type) {
      case 'products':
        file = productsFile;
        importFunc = importProducts;
        break;
      case 'materials':
        file = materialsFile;
        importFunc = importMaterials;
        break;
      case 'bom':
        file = bomFile;
        importFunc = importProductMaterials;
        break;
      default:
        return;
    }

    if (!file) {
      alert(`Vui lòng chọn file CSV cho ${type === 'bom' ? 'BOM' : type}`);
      return;
    }

    setLoading(`import_${type}`);
    try {
      const result = await importFunc(file);
      
      switch (type) {
        case 'products':
          setProductsResult(result);
          setProductsFile(null);
          break;
        case 'materials':
          setMaterialsResult(result);
          setMaterialsFile(null);
          break;
        case 'bom':
          setBomResult(result);
          setBomFile(null);
          break;
      }

      onImportSuccess();
      
      // Hiển thị thông báo thành công
      alert(result.message || `Import ${type} thành công!`);
      
    } catch (error: any) {
      alert(`Import thất bại: ${error.message || error}`);
    } finally {
      setLoading(null);
    }
  };

  const handleClassify = async (type: 'products' | 'materials') => {
    setLoading(`classify_${type}`);
    try {
      const result = type === 'products' ? await classifyProducts() : await classifyMaterials();
      alert(result.message || `Phân loại ${type} thành công!`);
      onImportSuccess(); // Refresh lại để hiển thị thông tin mới
    } catch (error: any) {
      alert(`Phân loại thất bại: ${error.message || error}`);
    } finally {
      setLoading(null);
    }
  };

  const renderResult = (result: any, type: string) => {
    if (!result) return null;
    
    return (
      <div className={`mt-3 p-3 rounded-lg ${
        type === 'products' ? 'bg-blue-50' : 
        type === 'materials' ? 'bg-green-50' : 'bg-yellow-50'
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              {type === 'products' ? '📦 Kết quả import Sản Phẩm' :
               type === 'materials' ? '🧱 Kết quả import Vật Liệu' : '📊 Kết quả import BOM'}
            </h4>
            <p className="text-sm text-gray-600">{result.message}</p>
          </div>
          <span className="text-xs px-2 py-1 bg-white rounded-full">
            Imported: {result.imported}/{result.total}
          </span>
        </div>
        
        {result.pending_classification && result.pending_classification > 0 && (
          <div className="mt-2 p-2 bg-white rounded border">
            <p className="text-sm text-gray-700">
              ⏳ Có <span className="font-semibold">{result.pending_classification}</span> {type} chưa phân loại.
            </p>
            <button
              onClick={() => handleClassify(type as 'products' | 'materials')}
              className="mt-2 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
            >
              🤖 Auto Classify {type === 'products' ? 'Products' : 'Materials'}
            </button>
          </div>
        )}
        
        {result.auto_created_materials && result.auto_created_materials > 0 && (
          <div className="mt-2 p-2 bg-white rounded border">
            <p className="text-sm text-gray-700">
              🆕 Đã tự động tạo <span className="font-semibold">{result.auto_created_materials}</span> vật liệu mới.
            </p>
          </div>
        )}
        
        {result.errors && result.errors.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-red-600 mb-1">Lỗi:</p>
            <div className="max-h-20 overflow-y-auto">
              {result.errors.slice(0, 3).map((error: string, idx: number) => (
                <p key={idx} className="text-xs text-red-500">{error}</p>
              ))}
              {result.errors.length > 3 && (
                <p className="text-xs text-gray-500">...và {result.errors.length - 3} lỗi khác</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Products Import Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">📦 Sản Phẩm</h3>
          {productsResult && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              Đã import
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Required:</strong> headcode, id_sap, product_name
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileChange('products', e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleImport('products')}
              disabled={loading === 'import_products' || !productsFile}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
            >
              {loading === 'import_products' ? 'Đang import...' : 'Import Sản Phẩm'}
            </button>
            
            <button
              onClick={() => handleClassify('products')}
              disabled={loading === 'classify_products'}
              className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
            >
              {loading === 'classify_products' ? 'Đang phân loại...' : '🤖 Auto Classify'}
            </button>
          </div>
          
          {renderResult(productsResult, 'products')}
        </div>
      </div>

      {/* Materials Import Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">🧱 Vật Liệu</h3>
          {materialsResult && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              Đã import
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Required:</strong> id_sap, material_name, material_group
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileChange('materials', e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleImport('materials')}
              disabled={loading === 'import_materials' || !materialsFile}
              className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
            >
              {loading === 'import_materials' ? 'Đang import...' : 'Import Vật Liệu'}
            </button>
            
            <button
              onClick={() => handleClassify('materials')}
              disabled={loading === 'classify_materials'}
              className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
            >
              {loading === 'classify_materials' ? 'Đang phân loại...' : '🤖 Auto Classify'}
            </button>
          </div>
          
          {renderResult(materialsResult, 'materials')}
        </div>
      </div>

      {/* BOM Import Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">📊 Định Mức (BOM)</h3>
          {bomResult && (
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              V4.5
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Required:</strong> product_headcode
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Optional:</strong> material_id_sap, quantity
            </p>
            <p className="text-xs text-gray-500 mb-2">
              ℹ️ Tự động tạo vật liệu thiếu & Fix lỗi ID đuôi .0
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileChange('bom', e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
            />
          </div>
          
          <button
            onClick={() => handleImport('bom')}
            disabled={loading === 'import_bom' || !bomFile}
            className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
          >
            {loading === 'import_bom' ? 'Đang xử lý BOM...' : 'Import BOM (V4.5)'}
          </button>
          
          {renderResult(bomResult, 'bom')}
          
          {bomResult && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-xl font-bold text-gray-900">{bomResult.imported || 0}</p>
                <p className="text-xs text-gray-600">Imported</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-xl font-bold text-gray-900">{bomResult.auto_created_materials || 0}</p>
                <p className="text-xs text-gray-600">Auto-Created</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportSection;