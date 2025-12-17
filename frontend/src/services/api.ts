import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Main chat endpoint
export const sendChatMessage = async (sessionId: string, message: string, context: any) => {
  try {
    const response = await api.post('/chat', {
      session_id: sessionId,
      message,
      context,
    });
    return response.data;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
};

// Image search endpoint
export const searchByImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/search-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Image search error:', error);
    throw error;
  }
};

// Import endpoints
export const importProducts = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/import/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const importMaterials = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/import/materials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const importProductMaterials = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/import/product-materials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Classification endpoints
export const classifyProducts = async () => {
  const response = await api.post('/classify-products');
  return response.data;
};

export const classifyMaterials = async () => {
  const response = await api.post('/classify-materials');
  return response.data;
};

// Embeddings endpoints
export const generateProductEmbeddings = async () => {
  const response = await api.post('/generate-embeddings');
  return response.data;
};

export const generateMaterialEmbeddings = async () => {
  const response = await api.post('/generate-material-embeddings');
  return response.data;
};

// Debug endpoints
export const getDebugProducts = async () => {
  const response = await api.get('/debug/products');
  return response.data;
};

export const getDebugMaterials = async () => {
  const response = await api.get('/debug/materials');
  return response.data;
};

export const getChatHistory = async () => {
  const response = await api.get('/debug/chat-history');
  return response.data;
};