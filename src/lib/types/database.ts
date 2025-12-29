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
      workers: {
        Row: {
          id: string
          name: string
          role: string
          phone: string | null
          team: string | null
          status: 'active' | 'inactive'
          hourly_rate: number | null
          daily_rate: number | null
          notes: string | null
          created_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          phone?: string | null
          team?: string | null
          status?: 'active' | 'inactive'
          hourly_rate?: number | null
          daily_rate?: number | null
          notes?: string | null
          created_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          phone?: string | null
          team?: string | null
          status?: 'active' | 'inactive'
          hourly_rate?: number | null
          daily_rate?: number | null
          notes?: string | null
          created_at?: string
          owner_id?: string
        }
      }
      attendance: {
        Row: {
          id: string
          project_id: string
          worker_id: string
          work_date: string
          check_in: string | null
          check_out: string | null
          work_hours: number | null
          overtime_hours: number | null
          status: 'present' | 'absent' | 'half_day' | 'leave'
          notes: string | null
          created_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          project_id: string
          worker_id: string
          work_date?: string
          check_in?: string | null
          check_out?: string | null
          work_hours?: number | null
          overtime_hours?: number | null
          status?: 'present' | 'absent' | 'half_day' | 'leave'
          notes?: string | null
          created_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          project_id?: string
          worker_id?: string
          work_date?: string
          check_in?: string | null
          check_out?: string | null
          work_hours?: number | null
          overtime_hours?: number | null
          status?: 'present' | 'absent' | 'half_day' | 'leave'
          notes?: string | null
          created_at?: string
          owner_id?: string
        }
      }
      task_workers: {
        Row: {
          id: string
          task_id: string
          worker_id: string
          assigned_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          task_id: string
          worker_id: string
          assigned_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          task_id?: string
          worker_id?: string
          assigned_at?: string
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
          worker_count: number | null
          weather_detail: string | null
          work_hours: number | null
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
          worker_count?: number | null
          weather_detail?: string | null
          work_hours?: number | null
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
          worker_count?: number | null
          weather_detail?: string | null
          work_hours?: number | null
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
          estimated_hours: number | null
          actual_hours: number | null
          assigned_workers: string[]
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
          estimated_hours?: number | null
          actual_hours?: number | null
          assigned_workers?: string[]
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
          estimated_hours?: number | null
          actual_hours?: number | null
          assigned_workers?: string[]
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
          actual_assignee: string | null
          completed_at: string | null
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
          actual_assignee?: string | null
          completed_at?: string | null
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
          actual_assignee?: string | null
          completed_at?: string | null
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
