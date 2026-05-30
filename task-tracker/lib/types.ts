export type UserRole = 'client' | 'developer'

export interface SanityUser {
  _id: string
  email: string
  role: UserRole
  fullName: string | null
}

export type TaskStatus = 'new' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  _id: string
  title: string
  description: string | null
  priority: TaskPriority
  status: TaskStatus
  deadline: string | null
  createdBy: SanityUser | null
  assignedTo: SanityUser | null
  _createdAt: string
  _updatedAt: string
}
