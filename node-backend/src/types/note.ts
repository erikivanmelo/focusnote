export interface Color {
  id: number;
  name: string;
  is_default: boolean;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string | null;
  content: string;
  color_id: number | null;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface CreateNote {
  title: string | null;
  content: string;
  color_id: number | null;
  tags: string[];
}

export interface UpdateNote {
  id: number;
  title?: string | null;
  content?: string;
  color_id?: number | null;
  tags?: string[];
}
