<script setup lang="ts">
import { CheckSquare2, LayoutDashboard, ListTodo, X } from '@lucide/vue'

defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const navigation = [
  { label: 'Tổng quan', to: '/', icon: LayoutDashboard },
  { label: 'Công việc', to: '/tasks', icon: ListTodo },
]
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden" @click="$emit('close')" />
  <aside class="fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col bg-slate-950 px-4 py-6 text-white transition-transform duration-200 lg:translate-x-0" :class="{ 'translate-x-0': open }">
    <div class="mb-10 flex items-center justify-between px-2">
      <RouterLink to="/" class="flex items-center gap-3" @click="$emit('close')">
        <span class="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/25"><CheckSquare2 :size="22" /></span>
        <div><p class="font-extrabold tracking-tight">Taskflow</p><p class="text-xs text-slate-400">Không gian cá nhân</p></div>
      </RouterLink>
      <button class="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 lg:hidden" aria-label="Đóng thanh điều hướng" @click="$emit('close')"><X :size="20" /></button>
    </div>
    <nav class="space-y-1.5">
      <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white" active-class="!bg-indigo-500/15 !text-indigo-300" @click="$emit('close')">
        <component :is="item.icon" :size="19" />{{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
