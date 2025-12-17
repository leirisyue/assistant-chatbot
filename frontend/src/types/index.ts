export interface Product {
  headcode: string;
  product_name: string;
  category?: string;
  sub_category?: string;
  material_primary?: string;
  project?: string;
  project_id?: string;
  similarity?: number;
  keyword_matched?: boolean;
}

export interface Material {
  id_sap: string;
  material_name: string;
  material_group?: string;
  material_subgroup?: string;
  price?: number;
  unit?: string;
  image_url?: string;
}

export interface MaterialDetail {
  id_sap: string;
  material_name: string;
  material_group?: string;
  material_subgroup?: string;
  unit?: string;
  image_url?: string;
  price_history?: Array<{ date: string; price: number }>;
}

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  data?: {
    products?: Product[];
    materials?: Material[];
    material_detail?: MaterialDetail;
    stats?: any;
    price_history?: any[];
    used_in_products?: any[];
    latest_price?: number;
    [key: string]: any;
  };
}

export interface ChatContext {
  last_search_results: string[];
  current_products: Product[];
  current_materials: Material[];
  search_params: Record<string, any>;
}