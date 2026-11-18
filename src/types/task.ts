export type TaskStatus = 'pending' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
}

export type TaskInput = Omit<TaskFormData, 'status'> & { status?: TaskStatus }

export interface TaskFilters {
  search: string
  status: 'all' | TaskStatus
  priority: 'all' | TaskPriority
  sort: 'newest' | 'oldest'
}
