export interface RawColor {
  id: number;
  name: string;
  is_default: boolean;
}

export interface RawNote {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  color_id: number;
}

export interface RawTag {
  id: number;
  name: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}
