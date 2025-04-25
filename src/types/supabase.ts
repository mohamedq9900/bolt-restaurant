export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      menu_categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image: string
          category_id: string
          featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image: string
          category_id: string
          featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image?: string
          category_id?: string
          featured?: boolean
          created_at?: string
        }
      }
    }
  }
}