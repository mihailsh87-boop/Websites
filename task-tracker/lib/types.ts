export type UserRole = 'client' | 'developer'

export interface Profile {
  id: string
  email: string
  role: UserRole
  full_name: string | null
  created_at: string
}

export type TaskStatus = 'new' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string | null
  priority: TaskPriority
  status: TaskStatus
  deadline: string | null
  created_by: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
  creator?: Profile | null
  assignee?: Profile | null
}
