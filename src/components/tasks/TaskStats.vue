<script setup lang="ts">
import { CircleCheckBig, CircleDashed, ListChecks, ShieldAlert } from '@lucide/vue'

defineProps<{ total: number; completed: number; pending: number; highPriority: number; percentage: number }>()

const statItems = [
  { key: 'total', label: 'Tổng công việc', icon: ListChecks, tone: 'bg-indigo-50 text-indigo-600' },
  { key: 'completed', label: 'Đã hoàn thành', icon: CircleCheckBig, tone: 'bg-emerald-50 text-emerald-600' },
  { key: 'pending', label: 'Chưa hoàn thành', icon: CircleDashed, tone: 'bg-amber-50 text-amber-600' },
  { key: 'highPriority', label: 'Ưu tiên cao', icon: ShieldAlert, tone: 'bg-rose-50 text-rose-600' },
] as const
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <article v-for="item in statItems" :key="item.key" class="card p-5">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">{{ item.label }}</p>
          <p class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{{ $props[item.key] }}</p>
        </div>
        <span class="grid h-11 w-11 place-items-center rounded-xl" :class="item.tone">
          <component :is="item.icon" :size="22" />
        </span>
      </div>
    </article>
  </div>
  <article class="card mt-4 p-5">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold text-slate-900">Tiến độ tổng thể</p>
        <p class="mt-1 text-xs text-slate-500">Đã hoàn thành {{ completed }}/{{ total }} công việc</p>
      </div><span class="text-lg font-extrabold text-indigo-600">{{ percentage }}%</span>
    </div>
    <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all"
        :style="{ width: `${percentage}%` }" />
    </div>
  </article>
</template>
