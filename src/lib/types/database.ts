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
      projects: {
        Row: {
          id: string
          name: string
          status: 'planned' | 'active' | 'paused' | 'done'
          created_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          status?: 'planned' | 'active' | 'paused' | 'done'
          created_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          name?: string
          status?: 'planned' | 'active' | 'paused' | 'done'
          created_at?: string
          owner_id?: string
        }
      }
      daily_logs: {
        Row: {
          id: string
          project_id: string
          title: string
          log_date: string
          weather: string | null
          temperature: string | null
          work_status: 'normal' | 'delayed' | 'issue'
          zones: string[]
          follow_up_needed: boolean
          follow_up_summary: string | null
          content: string | null
          created_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          log_date?: string
          weather?: string | null
          temperature?: string | null
          work_status?: 'normal' | 'delayed' | 'issue'
          zones?: string[]
          follow_up_needed?: boolean
          follow_up_summary?: string | null
          content?: string | null
          created_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          log_date?: string
          weather?: string | null
          temperature?: string | null
          work_status?: 'normal' | 'delayed' | 'issue'
          zones?: string[]
          follow_up_needed?: boolean
          follow_up_summary?: string | null
          content?: string | null
          created_at?: string
          owner_id?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          contract_type: 'contract' | 'extra'
          status: 'todo' | 'doing' | 'done'
          team: string | null
          due_date: string | null
          spaces: string[]
          description: string | null
          related_log_id: string | null
          created_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          contract_type?: 'contract' | 'extra'
          status?: 'todo' | 'doing' | 'done'
          team?: string | null
          due_date?: string | null
          spaces?: string[]
          description?: string | null
          related_log_id?: string | null
          created_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          contract_type?: 'contract' | 'extra'
          status?: 'todo' | 'doing' | 'done'
          team?: string | null
          due_date?: string | null
          spaces?: string[]
          description?: string | null
          related_log_id?: string | null
          created_at?: string
          owner_id?: string
        }
      }
      todos: {
        Row: {
          id: string
          project_id: string
          title: string
          category: 'work' | 'admin' | 'todo'
          created_at: string
          due_date: string | null
          priority: 'high' | 'mid' | 'low'
          status: 'todo' | 'doing' | 'done'
          requester: string | null
          assignee: string | null
          spaces: string[]
          memo: string | null
          related_task_id: string | null
          related_log_id: string | null
          owner_id: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          category?: 'work' | 'admin' | 'todo'
          created_at?: string
          due_date?: string | null
          priority?: 'high' | 'mid' | 'low'
          status?: 'todo' | 'doing' | 'done'
          requester?: string | null
          assignee?: string | null
          spaces?: string[]
          memo?: string | null
          related_task_id?: string | null
          related_log_id?: string | null
          owner_id: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          category?: 'work' | 'admin' | 'todo'
          created_at?: string
          due_date?: string | null
          priority?: 'high' | 'mid' | 'low'
          status?: 'todo' | 'doing' | 'done'
          requester?: string | null
          assignee?: string | null
          spaces?: string[]
          memo?: string | null
          related_task_id?: string | null
          related_log_id?: string | null
          owner_id?: string
        }
      }
      room_progress: {
        Row: {
          id: string
          project_id: string
          room_code: string
          room_type: string | null
          demolition: number
          electrical: number
          plumbing: number
          carpentry: number
          waterproof: number
          masonry: number
          plaster: number
          metal: number
          tile: number
          film: number
          paint: number
          wallpaper: number
          floor: number
          note: string | null
          created_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          project_id: string
          room_code: string
          room_type?: string | null
          demolition?: number
          electrical?: number
          plumbing?: number
          carpentry?: number
          waterproof?: number
          masonry?: number
          plaster?: number
          metal?: number
          tile?: number
          film?: number
          paint?: number
          wallpaper?: number
          floor?: number
          note?: string | null
          created_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          project_id?: string
          room_code?: string
          room_type?: string | null
          demolition?: number
          electrical?: number
          plumbing?: number
          carpentry?: number
          waterproof?: number
          masonry?: number
          plaster?: number
          metal?: number
          tile?: number
          film?: number
          paint?: number
          wallpaper?: number
          floor?: number
          note?: string | null
          created_at?: string
          owner_id?: string
        }
      }
      room_photos: {
        Row: {
          id: string
          project_id: string
          progress_id: string
          storage_path: string
          caption: string | null
          created_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          project_id: string
          progress_id: string
          storage_path: string
          caption?: string | null
          created_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          project_id?: string
          progress_id?: string
          storage_path?: string
          caption?: string | null
          created_at?: string
          owner_id?: string
        }
      }
    }
  }
}
