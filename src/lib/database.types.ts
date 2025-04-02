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
      profiles: {
        Row: {
          id: string
          role: 'student' | 'instructor'
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'student' | 'instructor'
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'student' | 'instructor'
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          instructor_id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          price: number
          level: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          instructor_id: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          price?: number
          level: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          instructor_id?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          price?: number
          level?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          content_type: string
          content: string
          order_index: number
          duration: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          content_type: string
          content: string
          order_index: number
          duration?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          description?: string | null
          content_type?: string
          content?: string
          order_index?: number
          duration?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          enrolled_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          enrolled_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          enrolled_at?: string
          completed_at?: string | null
        }
      }
      progress: {
        Row: {
          id: string
          enrollment_id: string
          lesson_id: string
          completed_at: string
        }
        Insert: {
          id?: string
          enrollment_id: string
          lesson_id: string
          completed_at?: string
        }
        Update: {
          id?: string
          enrollment_id?: string
          lesson_id?: string
          completed_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          due_date: string | null
          total_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          due_date?: string | null
          total_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          total_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          assignment_id: string
          student_id: string
          content: string
          score: number | null
          submitted_at: string
          graded_at: string | null
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          content: string
          score?: number | null
          submitted_at?: string
          graded_at?: string | null
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          content?: string
          score?: number | null
          submitted_at?: string
          graded_at?: string | null
        }
      }
    }
  }
}