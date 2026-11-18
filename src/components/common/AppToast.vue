<script setup lang="ts">
import { CheckCircle2, X } from '@lucide/vue'

defineProps<{ message: string }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <Transition enter-active-class="transition duration-200" enter-from-class="translate-y-3 opacity-0" leave-active-class="transition duration-150" leave-to-class="translate-y-3 opacity-0">
    <div v-if="message" class="fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl">
      <CheckCircle2 :size="19" class="text-emerald-400" />
      <span>{{ message }}</span>
      <button class="ml-2 text-slate-400 hover:text-white" aria-label="Đóng thông báo" @click="$emit('close')"><X :size="17" /></button>
    </div>
  </Transition>
</template>
