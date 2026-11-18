<script setup lang="ts">
import { Bell, Menu } from '@lucide/vue'

defineEmits<{ toggleSidebar: [] }>()
</script>

<template>
  <header class="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-8">
    <div class="flex items-center gap-3">
      <button class="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Mở thanh điều hướng" @click="$emit('toggleSidebar')">
        <Menu :size="22" />
      </button>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Không gian làm việc</p>
        <h1 class="text-lg font-bold text-slate-900">Tiến bộ mỗi ngày, từng công việc một.</h1>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button class="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50" aria-label="Thông báo">
        <Bell :size="19" />
        <span class="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-indigo-500" />
      </button>
      <div class="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white">NT</div>
    </div>
  </header>
</template>
