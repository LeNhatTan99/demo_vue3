<script setup lang="ts">
import { AlertTriangle, X } from '@lucide/vue'

withDefaults(defineProps<{ open: boolean; title?: string; message?: string }>(), {
  title: 'Xóa công việc này?',
  message: 'Thao tác này không thể hoàn tác. Công việc sẽ bị xóa vĩnh viễn.',
})

defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog" aria-modal="true" :aria-label="title" @click.self="$emit('cancel')">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div class="flex items-start justify-between gap-4">
          <div class="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle :size="22" />
          </div>
          <button class="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Đóng" @click="$emit('cancel')">
            <X :size="20" />
          </button>
        </div>
        <h2 class="mt-5 text-xl font-bold text-slate-900">{{ title }}</h2>
        <p class="mt-2 text-sm leading-6 text-slate-500">{{ message }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button class="btn-secondary" @click="$emit('cancel')">Hủy</button>
          <button class="btn-danger" @click="$emit('confirm')">Xóa công việc</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
