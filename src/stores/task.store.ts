import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@/composables/useLocalStorage'
import type { Task, TaskInput, TaskPriority, TaskStatus } from '@/types/task'

const STORAGE_KEY = 'taskflow.tasks'

const sampleTasks: Task[] = [
  {
    id: 'sample-1',
    title: 'Lập kế hoạch chu kỳ phát triển sản phẩm',
    description: 'Xác định mục tiêu và chuẩn bị danh sách công việc cho buổi lập kế hoạch.',
    status: 'pending',
    priority: 'high',
    createdAt: '2026-11-15T08:30:00.000Z',
    updatedAt: '2026-11-15T08:30:00.000Z',
  },
  {
    id: 'sample-2',
    title: 'Đánh giá bản phác thảo trang tổng quan',
    description: 'Kiểm tra khả năng thích ứng trên các màn hình và đưa ra phản hồi thiết kế cụ thể.',
    status: 'completed',
    priority: 'medium',
    createdAt: '2026-11-14T03:15:00.000Z',
    updatedAt: '2026-11-15T02:00:00.000Z',
  },
  {
    id: 'sample-3',
    title: 'Cập nhật nội dung hướng dẫn',
    description: 'Đơn giản hóa luồng chào mừng và cập nhật thông báo khi chưa có dữ liệu.',
    status: 'pending',
    priority: 'low',
    createdAt: '2026-11-13T09:45:00.000Z',
    updatedAt: '2026-11-13T09:45:00.000Z',
  },
  {
    id: 'sample-4',
    title: 'Chuẩn bị báo cáo tuần',
    description: 'Tóm tắt tiến độ, các vướng mắc và bước tiếp theo.',
    status: 'completed',
    priority: 'high',
    createdAt: '2026-11-12T06:20:00.000Z',
    updatedAt: '2026-11-14T10:10:00.000Z',
  },
  {
    id: 'sample-5',
    title: 'Hoàn thiện tài liệu thành phần giao diện',
    description: 'Bổ sung ví dụ cho các trường biểu mẫu và nhãn trạng thái.',
    status: 'pending',
    priority: 'medium',
    createdAt: '2026-11-11T01:00:00.000Z',
    updatedAt: '2026-11-11T01:00:00.000Z',
  },
  {
    id: 'sample-6',
    title: 'Kiểm thử điều hướng trên di động',
    description: 'Kiểm tra thao tác bàn phím và cảm ứng trên màn hình nhỏ.',
    status: 'pending',
    priority: 'high',
    createdAt: '2026-11-10T07:40:00.000Z',
    updatedAt: '2026-11-10T07:40:00.000Z',
  },
]

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') {
    return false
  }

  const item = value as Record<string, unknown>
  const priorities: TaskPriority[] = ['low', 'medium', 'high']
  const statuses: TaskStatus[] = ['pending', 'completed']

  const hasValidId = typeof item.id === 'string'
  const hasValidTitle = typeof item.title === 'string'
  const hasValidDescription = typeof item.description === 'string'
  const hasValidStatus = statuses.includes(item.status as TaskStatus)
  const hasValidPriority = priorities.includes(item.priority as TaskPriority)
  const hasValidCreatedAt = typeof item.createdAt === 'string' && !Number.isNaN(Date.parse(item.createdAt))
  const hasValidUpdatedAt = typeof item.updatedAt === 'string' && !Number.isNaN(Date.parse(item.updatedAt))

  return hasValidId &&
    hasValidTitle &&
    hasValidDescription &&
    hasValidStatus &&
    hasValidPriority &&
    hasValidCreatedAt &&
    hasValidUpdatedAt
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const isLoading = ref(true)
  const storageError = ref('')
  const storage = useLocalStorage<unknown>(STORAGE_KEY)

  const totalTasks = computed(() => {
    return tasks.value.length
  })

  const completedTasks = computed(() => {
    return tasks.value.filter((task) => task.status === 'completed').length
  })

  const pendingTasks = computed(() => {
    return totalTasks.value - completedTasks.value
  })

  const highPriorityTasks = computed(() => {
    return tasks.value.filter((task) => task.priority === 'high').length
  })

  const completionPercentage = computed(() => {
    if (totalTasks.value === 0) {
      return 0
    }

    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })

  const recentTasks = computed(() => {
    const sortedTasks = [...tasks.value]

    sortedTasks.sort((firstTask, secondTask) => {
      return Date.parse(secondTask.createdAt) - Date.parse(firstTask.createdAt)
    })

    return sortedTasks.slice(0, 5)
  })

  function persist(): void {
    const savedSuccessfully = storage.write(tasks.value)

    if (savedSuccessfully) {
      storageError.value = ''
      return
    }

    storageError.value = 'Không thể lưu thay đổi trên trình duyệt.'
  }

  function loadTasks(): void {
    isLoading.value = true
    const saved = storage.read()

    if (Array.isArray(saved) && saved.every(isTask)) {
      tasks.value = saved
    } else {
      tasks.value = sampleTasks.map((task) => {
        return { ...task }
      })
      persist()
    }

    isLoading.value = false
  }

  function addTask(input: TaskInput): Task {
    const now = new Date().toISOString()
    const status = input.status ?? 'pending'
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      status,
      priority: input.priority,
      createdAt: now,
      updatedAt: now,
    }

    tasks.value.unshift(task)
    persist()

    return task
  }

  function updateTask(id: string, input: TaskInput & { status: TaskStatus }): boolean {
    const index = tasks.value.findIndex((task) => task.id === id)

    if (index < 0) {
      return false
    }

    const task = tasks.value[index]
    task.title = input.title
    task.description = input.description
    task.status = input.status
    task.priority = input.priority
    task.updatedAt = new Date().toISOString()

    persist()
    return true
  }

  function deleteTask(id: string): boolean {
    const initialLength = tasks.value.length
    tasks.value = tasks.value.filter((task) => task.id !== id)

    if (tasks.value.length === initialLength) {
      return false
    }

    persist()
    return true
  }

  function toggleTask(id: string): boolean {
    const task = tasks.value.find((currentTask) => currentTask.id === id)

    if (!task) {
      return false
    }

    if (task.status === 'completed') {
      task.status = 'pending'
    } else {
      task.status = 'completed'
    }

    task.updatedAt = new Date().toISOString()
    persist()
    return true
  }

  function getTaskById(id: string): Task | undefined {
    return tasks.value.find((task) => task.id === id)
  }

  return {
    tasks,
    isLoading,
    storageError,
    totalTasks,
    completedTasks,
    pendingTasks,
    highPriorityTasks,
    completionPercentage,
    recentTasks,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTaskById,
  }
})
