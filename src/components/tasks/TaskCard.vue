<script setup lang="ts">
import { computed } from 'vue'
import { CalendarDays, Check, Circle, MoreHorizontal, Pencil, Trash2 } from '@lucide/vue'
import type { Task } from '@/types/task'

const props = defineProps<{ task: Task }>()
defineEmits<{ edit: [task: Task]; delete: [task: Task]; toggle: [task: Task] }>()

const formattedCreatedAt = computed(() => {
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return formatter.format(new Date(props.task.createdAt))
})

const priorityClass: Record<Task['priority'], string> = {
  low: 'bg-sky-50 text-sky-700 ring-sky-600/10',
  medium: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  high: 'bg-rose-50 text-rose-700 ring-rose-600/10',
}
const priorityLabel: Record<Task['priority'], string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
}

const isCompleted = computed(() => {
  return props.task.status === 'completed'
})

const toggleButtonLabel = computed(() => {
  if (isCompleted.value) {
    return 'Đánh dấu chưa hoàn thành'
  }

  return 'Đánh dấu đã hoàn thành'
})

const statusLabel = computed(() => {
  if (isCompleted.value) {
    return 'Đã hoàn thành'
  }

  return 'Chưa hoàn thành'
})

const statusClass = computed(() => {
  if (isCompleted.value) {
    return 'bg-emerald-50 text-emerald-700'
  }

  return 'bg-slate-100 text-slate-600'
})
const toggleButtonClass = computed(() => {
  if (isCompleted.value) {
    return 'border-emerald-500 bg-emerald-500 text-white'
  }

  return 'border-slate-300 text-transparent hover:border-indigo-500'
})
</script>

<template>
  <article class="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
    <div class="flex items-start gap-3">
      <button class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition" :class="toggleButtonClass" :aria-label="toggleButtonLabel" @click="$emit('toggle', task)">
        <Check v-if="isCompleted" :size="15" :stroke-width="3" /><Circle v-else :size="12" />
      </button>
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <RouterLink :to="`/tasks/${task.id}`" class="font-bold leading-6 text-slate-900 hover:text-indigo-600" :class="{ 'text-slate-400 line-through': isCompleted }">{{ task.title }}</RouterLink>
          <MoreHorizontal :size="19" class="shrink-0 text-slate-300" />
        </div>
        <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{{ task.description || 'Chưa có mô tả.' }}</p>
      </div>
    </div>
    <div class="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
      <span class="rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset" :class="priorityClass[task.priority]">{{ priorityLabel[task.priority] }}</span>
      <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="statusClass">{{ statusLabel }}</span>
      <span class="ml-0 flex items-center gap-1.5 text-xs text-slate-400 sm:ml-auto"><CalendarDays :size="14" />{{ formattedCreatedAt }}</span>
    </div>
    <div class="mt-3 flex justify-end gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
      <button class="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600" aria-label="Sửa công việc" @click="$emit('edit', task)"><Pencil :size="17" /></button>
      <button class="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Xóa công việc" @click="$emit('delete', task)"><Trash2 :size="17" /></button>
    </div>
  </article>
</template>
