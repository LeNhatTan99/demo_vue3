<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQuery } from 'vue-router'
import { ListFilter, Plus } from '@lucide/vue'
import AppToast from '@/components/common/AppToast.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskFilter from '@/components/tasks/TaskFilter.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import { useTaskStore } from '@/stores/task.store'
import type { Task, TaskFilters, TaskFormData } from '@/types/task'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const { tasks, isLoading } = storeToRefs(taskStore)

function getQueryValue(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  return ''
}

function createFiltersFromQuery(query: LocationQuery): TaskFilters {
  const status = getQueryValue(query.status)
  const priority = getQueryValue(query.priority)
  const sort = getQueryValue(query.sort)
  const filtersFromQuery: TaskFilters = {
    search: getQueryValue(query.search),
    status: 'all',
    priority: 'all',
    sort: 'newest',
  }

  if (status === 'all' || status === 'pending' || status === 'completed') {
    filtersFromQuery.status = status
  }

  if (priority === 'all' || priority === 'low' || priority === 'medium' || priority === 'high') {
    filtersFromQuery.priority = priority
  }

  if (sort === 'newest' || sort === 'oldest') {
    filtersFromQuery.sort = sort
  }

  return filtersFromQuery
}

const filters = reactive<TaskFilters>(createFiltersFromQuery(route.query))

const formOpen = ref(false)
const editingTask = ref<Task | null>(null)
const deletingTask = ref<Task | null>(null)
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined

onUnmounted(() => {
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
})

const filteredTasks = computed(() => {
  const search = filters.search.trim().toLocaleLowerCase()
  let result = [...tasks.value]

  if (search) {
    result = result.filter((task) => {
      return task.title.toLocaleLowerCase().includes(search)
    })
  }

  if (filters.status !== 'all') {
    result = result.filter((task) => task.status === filters.status)
  }

  if (filters.priority !== 'all') {
    result = result.filter((task) => task.priority === filters.priority)
  }

  result.sort((firstTask, secondTask) => {
    const firstCreatedAt = Date.parse(firstTask.createdAt)
    const secondCreatedAt = Date.parse(secondTask.createdAt)

    if (filters.sort === 'newest') {
      return secondCreatedAt - firstCreatedAt
    }

    return firstCreatedAt - secondCreatedAt
  })

  return result
})

watch(filters, (value) => {
  const query: Record<string, string> = {}

  if (value.search) {
    query.search = value.search
  }

  if (value.status !== 'all') {
    query.status = value.status
  }

  if (value.priority !== 'all') {
    query.priority = value.priority
  }

  if (value.sort !== 'newest') {
    query.sort = value.sort
  }

  router.replace({ query })
}, { deep: true })

watch(() => route.query, (query) => {
  const queryFilters = createFiltersFromQuery(query)
  Object.assign(filters, queryFilters)
})

function hideToast(): void {
  toastMessage.value = ''
}

function showToast(message: string): void {
  toastMessage.value = message

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(hideToast, 3000)
}

function openCreateForm(): void {
  editingTask.value = null
  formOpen.value = true
}

function openEditForm(task: Task): void {
  editingTask.value = task
  formOpen.value = true
}

function closeTaskForm(): void {
  formOpen.value = false
}

function clearFilters(): void {
  filters.search = ''
  filters.status = 'all'
  filters.priority = 'all'
  filters.sort = 'newest'
}

function cancelDelete(): void {
  deletingTask.value = null
}

function saveTask(data: TaskFormData): void {
  if (editingTask.value) {
    taskStore.updateTask(editingTask.value.id, data)
    showToast('Cập nhật công việc thành công.')
  } else {
    taskStore.addTask(data)
    showToast('Tạo công việc thành công.')
  }
  closeTaskForm()
}

function confirmDelete(): void {
  if (!deletingTask.value) {
    return
  }

  taskStore.deleteTask(deletingTask.value.id)
  cancelDelete()
  showToast('Xóa công việc thành công.')
}

function toggleTask(task: Task): void {
  const wasCompleted = task.status === 'completed'
  taskStore.toggleTask(task.id)

  if (wasCompleted) {
    showToast('Đã chuyển công việc về chưa hoàn thành.')
    return
  }

  showToast('Đã hoàn thành công việc. Tuyệt vời!')
}

const emptyStateTitle = computed(() => {
  if (tasks.value.length > 0) {
    return 'Không có công việc phù hợp'
  }

  return 'Danh sách công việc đang trống'
})

const emptyStateDescription = computed(() => {
  if (tasks.value.length > 0) {
    return 'Hãy điều chỉnh từ khóa hoặc bộ lọc để tìm nội dung bạn cần.'
  }

  return 'Tạo công việc đầu tiên để bắt đầu hành trình của bạn.'
})

const deleteDialogTitle = computed(() => {
  if (!deletingTask.value) {
    return undefined
  }

  return `Xóa “${deletingTask.value.title}”?`
})
</script>

<template>
  <section>
    <div class="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div class="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
          <ListFilter :size="17" /> Tập trung làm việc
        </div>
        <h2 class="text-3xl font-extrabold tracking-tight text-slate-950">Quản lý công việc</h2>
        <p class="mt-2 text-sm text-slate-500">Tạo, sắp xếp ưu tiên và duy trì tiến độ công việc.</p>
      </div>
      <button class="btn-primary" @click="openCreateForm">
        <Plus :size="18" /> Thêm công việc
      </button>
    </div>
    <TaskFilter v-model="filters" @clear="clearFilters" />
    <div class="mb-4 mt-7 flex items-center justify-between">
      <p class="text-sm font-semibold text-slate-700">{{ filteredTasks.length }} công việc</p>
      <p v-if="filters.search" class="text-xs text-slate-400">Kết quả cho “{{ filters.search }}”</p>
    </div>
    <div v-if="isLoading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="index in 6" :key="index" class="h-56 animate-pulse rounded-2xl bg-slate-200" />
    </div>
    <div v-else-if="filteredTasks.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <TaskCard v-for="task in filteredTasks" :key="task.id" :task="task" @edit="openEditForm"
        @delete="deletingTask = $event" @toggle="toggleTask" />
    </div>
    <EmptyState v-else :show-action="tasks.length === 0" :title="emptyStateTitle" :description="emptyStateDescription"
      @action="openCreateForm" />
    <TaskForm :open="formOpen" :task="editingTask" @close="closeTaskForm" @submit="saveTask" />
    <ConfirmDialog :open="Boolean(deletingTask)" :title="deleteDialogTitle" @cancel="cancelDelete"
      @confirm="confirmDelete" />
    <AppToast :message="toastMessage" @close="hideToast" />
  </section>
</template>
