<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useTaskStore } from '@/stores/task.store'

const sidebarOpen = ref(false)
const taskStore = useTaskStore()
const { storageError } = storeToRefs(taskStore)

onMounted(() => {
  taskStore.loadTasks()
})
</script>

<template>
  <div class="min-h-screen">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="lg:pl-64">
      <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <div v-if="storageError"
        class="mx-4 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 md:mx-8">{{
        storageError }}</div>
      <main class="mx-auto max-w-[1500px] p-4 md:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
