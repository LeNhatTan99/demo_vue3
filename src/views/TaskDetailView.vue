<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Pencil, Trash2 } from '@lucide/vue'
import AppToast from '@/components/common/AppToast.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import { useTaskStore } from '@/stores/task.store'
import type { TaskFormData } from '@/types/task'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const formOpen = ref(false)
const confirmOpen = ref(false)
const toastMessage = ref('')

const task = computed(() => {
  const taskId = String(route.params.id)
  return taskStore.getTaskById(taskId)
})
const priorityLabel = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
} as const

function formatDate(date: string): string {
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'long',
    timeStyle: 'short',
  })

  return formatter.format(new Date(date))
}

function closeTaskForm(): void {
  formOpen.value = false
}

function saveTask(data: TaskFormData): void {
  if (!task.value) {
    return
  }

  taskStore.updateTask(task.value.id, data)
  closeTaskForm()
  toastMessage.value = 'Cập nhật công việc thành công.'
}

function deleteTask(): void {
  if (!task.value) {
    return
  }

  taskStore.deleteTask(task.value.id)
  router.push({ name: 'tasks' })
}

function toggleTaskStatus(): void {
  if (!task.value) {
    return
  }

  taskStore.toggleTask(task.value.id)
}

const deleteDialogTitle = computed(() => {
  if (!task.value) {
    return undefined
  }

  return `Xóa “${task.value.title}”?`
})

const taskStatusLabel = computed(() => {
  if (task.value?.status === 'completed') {
    return 'Đã hoàn thành'
  }

  return 'Chưa hoàn thành'
})

const taskStatusClass = computed(() => {
  if (task.value?.status === 'completed') {
    return 'bg-emerald-100 text-emerald-700'
  }

  return 'bg-white text-slate-600 ring-1 ring-slate-200'
})

const toggleStatusLabel = computed(() => {
  if (task.value?.status === 'completed') {
    return 'Đánh dấu chưa hoàn thành'
  }

  return 'Đánh dấu đã hoàn thành'
})

const toggleStatusClass = computed(() => {
  if (task.value?.status === 'completed') {
    return 'text-slate-500'
  }

  return 'text-emerald-600'
})
</script>

<template>
  <section>
    <RouterLink to="/tasks" class="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600"><ArrowLeft :size="17" /> Quay lại danh sách</RouterLink>
    <div v-if="task" class="mx-auto max-w-4xl">
      <article class="card overflow-hidden">
        <div class="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-6 md:p-9">
          <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div><div class="flex flex-wrap gap-2"><span class="rounded-full px-3 py-1 text-xs font-bold" :class="taskStatusClass">{{ taskStatusLabel }}</span><span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-100">Ưu tiên {{ priorityLabel[task.priority].toLocaleLowerCase('vi-VN') }}</span></div><h2 class="mt-5 text-3xl font-extrabold tracking-tight text-slate-950">{{ task.title }}</h2></div>
            <div class="flex gap-2"><button class="btn-secondary" @click="formOpen = true"><Pencil :size="17" /> Chỉnh sửa</button><button class="rounded-xl border border-rose-200 bg-white p-2.5 text-rose-600 hover:bg-rose-50" aria-label="Xóa công việc" @click="confirmOpen = true"><Trash2 :size="18" /></button></div>
          </div>
        </div>
        <div class="p-6 md:p-9">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400">Mô tả</h3><p class="mt-3 whitespace-pre-wrap text-base leading-8 text-slate-600">{{ task.description || 'Công việc này chưa có mô tả.' }}</p>
          <div class="mt-9 grid gap-4 border-t border-slate-100 pt-7 sm:grid-cols-2">
            <div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><CalendarDays :size="19" /></span><div><p class="text-xs text-slate-400">Ngày tạo</p><p class="mt-0.5 text-sm font-semibold text-slate-700">{{ formatDate(task.createdAt) }}</p></div></div>
            <div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><Clock3 :size="19" /></span><div><p class="text-xs text-slate-400">Cập nhật gần nhất</p><p class="mt-0.5 text-sm font-semibold text-slate-700">{{ formatDate(task.updatedAt) }}</p></div></div>
          </div>
          <button class="mt-8 inline-flex items-center gap-2 text-sm font-semibold" :class="toggleStatusClass" @click="toggleTaskStatus"><CheckCircle2 :size="19" />{{ toggleStatusLabel }}</button>
        </div>
      </article>
    </div>
    <div v-else class="card mx-auto max-w-xl px-6 py-14 text-center"><div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-600"><Trash2 :size="28" /></div><h2 class="mt-5 text-2xl font-bold text-slate-900">Không tìm thấy công việc</h2><p class="mt-2 text-sm leading-6 text-slate-500">Công việc có thể đã bị xóa hoặc đường dẫn không chính xác.</p><RouterLink to="/tasks" class="btn-primary mt-6">Quay lại danh sách</RouterLink></div>
    <TaskForm :open="formOpen" :task="task" @close="closeTaskForm" @submit="saveTask" />
    <ConfirmDialog :open="confirmOpen" :title="deleteDialogTitle" @cancel="confirmOpen = false" @confirm="deleteTask" />
    <AppToast :message="toastMessage" @close="toastMessage = ''" />
  </section>
</template>
