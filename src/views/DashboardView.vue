<script setup lang="ts">
import { storeToRefs } from 'pinia'
import TaskStats from '@/components/tasks/TaskStats.vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useTaskStore } from '@/stores/task.store'

const taskStore = useTaskStore()
const { totalTasks, completedTasks, pendingTasks, highPriorityTasks, completionPercentage, recentTasks, isLoading } = storeToRefs(taskStore)
</script>

<template>
  <section>
    <div class="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div class="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">Tổng quan không gian làm việc</div><h2 class="text-3xl font-extrabold tracking-tight text-slate-950">Tổng quan</h2><p class="mt-2 text-sm text-slate-500">Theo dõi rõ ràng tiến độ công việc của bạn.</p></div>
      <RouterLink to="/tasks" class="btn-primary">Quản lý công việc</RouterLink>
    </div>
    <div v-if="isLoading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><div v-for="index in 4" :key="index" class="h-32 animate-pulse rounded-2xl bg-slate-200" /></div>
    <template v-else>
      <TaskStats :total="totalTasks" :completed="completedTasks" :pending="pendingTasks" :high-priority="highPriorityTasks" :percentage="completionPercentage" />
      <div class="mt-9 mb-4 flex items-center justify-between"><div><h3 class="text-xl font-bold text-slate-900">Công việc gần đây</h3><p class="mt-1 text-sm text-slate-500">Năm công việc được tạo gần nhất.</p></div><RouterLink to="/tasks" class="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Xem tất cả</RouterLink></div>
      <div v-if="recentTasks.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><TaskCard v-for="task in recentTasks" :key="task.id" :task="task" @toggle="taskStore.toggleTask($event.id)" @edit="$router.push(`/tasks/${$event.id}`)" @delete="$router.push(`/tasks/${$event.id}`)" /></div>
      <EmptyState v-else @action="$router.push('/tasks')" />
    </template>
  </section>
</template>
