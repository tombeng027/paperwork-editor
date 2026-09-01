export interface Document { id: string; title: string; content: string; owner_id: string; created_at: string; updated_at: string }
export interface Profile { id: string; email: string }
export type SaveState = 'idle' | 'saving' | 'saved' | 'offline'