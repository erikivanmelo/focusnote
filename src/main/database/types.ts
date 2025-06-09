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
  title: string;
  content: string;
  color_id: number;
  created_at: string;
  updated_at: string;
  color_details?: Color;
  tags_details?: Tag[];
}

export interface NoteCreate {
  title: string;
  content: string;
  color_id: number;
  tags?: string[];
}

export interface NoteUpdate {
  id: number;
  title?: string;
  content?: string;
  color_id?: number;
  tags?: string[];
}

export interface NoteDelete {
  id: number;
}
