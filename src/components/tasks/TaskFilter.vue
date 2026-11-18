<script setup lang="ts">
import { Search, SlidersHorizontal, X } from '@lucide/vue'
import type { TaskFilters } from '@/types/task'

const model = defineModel<TaskFilters>({ required: true })
defineEmits<{ clear: [] }>()
</script>

<template>
  <div class="card p-4">
    <div class="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_180px_180px_180px_auto]">
      <label class="relative block"><span class="sr-only">Tìm kiếm công việc</span><Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" /><input v-model="model.search" class="field pl-10" placeholder="Tìm theo tiêu đề..." /></label>
      <label><span class="sr-only">Trạng thái</span><select v-model="model.status" class="field"><option value="all">Tất cả trạng thái</option><option value="pending">Chưa hoàn thành</option><option value="completed">Đã hoàn thành</option></select></label>
      <label><span class="sr-only">Độ ưu tiên</span><select v-model="model.priority" class="field"><option value="all">Tất cả độ ưu tiên</option><option value="low">Ưu tiên thấp</option><option value="medium">Ưu tiên trung bình</option><option value="high">Ưu tiên cao</option></select></label>
      <label><span class="sr-only">Thứ tự sắp xếp</span><select v-model="model.sort" class="field"><option value="newest">Mới nhất trước</option><option value="oldest">Cũ nhất trước</option></select></label>
      <button class="btn-secondary px-3" title="Xóa bộ lọc" @click="$emit('clear')"><X :size="18" /><span class="lg:hidden">Xóa bộ lọc</span></button>
    </div>
    <div class="mt-3 flex items-center gap-2 text-xs text-slate-400"><SlidersHorizontal :size="14" /> Bộ lọc được lưu trên URL để bạn có thể đánh dấu trang này.</div>
  </div>
</template>
