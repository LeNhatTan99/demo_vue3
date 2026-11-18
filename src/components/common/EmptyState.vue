<script setup lang="ts">
import { ClipboardList } from '@lucide/vue'

withDefaults(defineProps<{ title?: string; description?: string; showAction?: boolean }>(), {
  title: 'Không tìm thấy công việc',
  description: 'Hãy thay đổi bộ lọc hoặc tạo một công việc mới để bắt đầu.',
  showAction: true,
})
defineEmits<{ action: [] }>()
</script>

<template>
  <div class="card flex flex-col items-center px-6 py-14 text-center">
    <div class="grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
      <ClipboardList :size="30" />
    </div>
    <h3 class="mt-5 text-lg font-bold text-slate-900">{{ title }}</h3>
    <p class="mt-2 max-w-md text-sm leading-6 text-slate-500">{{ description }}</p>
    <button v-if="showAction" class="btn-primary mt-6" @click="$emit('action')">Tạo công việc</button>
  </div>
</template>
