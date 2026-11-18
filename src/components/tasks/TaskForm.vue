<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { X } from '@lucide/vue'
import type { Task, TaskFormData } from '@/types/task'

const props = defineProps<{ open: boolean; task?: Task | null }>()
const emit = defineEmits<{ submit: [data: TaskFormData]; close: [] }>()

function createEmptyForm(): TaskFormData {
  return {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
  }
}

const form = reactive<TaskFormData>(createEmptyForm())
const errors = reactive({ title: '' })
const dialogLabel = computed(() => {
  if (props.task) {
    return 'Sửa công việc'
  }

  return 'Tạo công việc'
})

const formModeLabel = computed(() => {
  if (props.task) {
    return 'Cập nhật công việc'
  }

  return 'Công việc mới'
})

const formHeading = computed(() => {
  if (props.task) {
    return 'Chỉnh sửa thông tin'
  }

  return 'Bạn cần hoàn thành việc gì?'
})

const submitButtonLabel = computed(() => {
  if (props.task) {
    return 'Lưu thay đổi'
  }

  return 'Tạo công việc'
})

watch(() => [props.open, props.task] as const, ([open, task]) => {
  if (!open) {
    return
  }

  if (task) {
    form.title = task.title
    form.description = task.description
    form.priority = task.priority
    form.status = task.status
  } else {
    Object.assign(form, createEmptyForm())
  }

  errors.title = ''
}, { immediate: true })

function submitForm(): void {
  const title = form.title.trim()

  if (!title) {
    errors.title = 'Vui lòng nhập tên công việc.'
  } else if (title.length > 100) {
    errors.title = 'Tên công việc không được vượt quá 100 ký tự.'
  } else {
    errors.title = ''
  }

  if (errors.title) {
    return
  }

  const submittedData: TaskFormData = {
    title,
    description: form.description.trim(),
    priority: form.priority,
    status: form.status,
  }

  emit('submit', submittedData)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open"
      class="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog" aria-modal="true" :aria-label="dialogLabel" @click.self="$emit('close')">
      <form class="my-6 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl" @submit.prevent="submitForm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">{{ formModeLabel }}</p>
            <h2 class="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{{ formHeading }}</h2>
          </div><button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Đóng biểu mẫu" @click="$emit('close')">
            <X :size="20" />
          </button>
        </div>
        <div class="mt-6 space-y-5">
          <label><span class="label">Tên công việc <span class="text-rose-500">*</span></span><input
              v-model="form.title" class="field" maxlength="100" placeholder="Ví dụ: Chuẩn bị họp sprint"
              autofocus /><span class="mt-1.5 flex justify-between text-xs"><span class="text-rose-600">{{ errors.title
                }}</span><span class="ml-auto text-slate-400">{{ form.title.length }}/100</span></span></label>
          <label><span class="label">Mô tả</span><textarea v-model="form.description" class="field min-h-28 resize-y"
              rows="4" placeholder="Thêm thông tin hoặc các bước tiếp theo..." /></label>
          <div class="grid gap-4 sm:grid-cols-2">
            <label><span class="label">Độ ưu tiên</span><select v-model="form.priority" class="field">
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select></label>
            <label><span class="label">Trạng thái</span><select v-model="form.status" class="field">
                <option value="pending">Chưa hoàn thành</option>
                <option value="completed">Đã hoàn thành</option>
              </select></label>
          </div>
        </div>
        <div class="mt-7 flex justify-end gap-3"><button type="button" class="btn-secondary"
            @click="$emit('close')">Hủy</button><button class="btn-primary" type="submit">{{ submitButtonLabel
            }}</button></div>
      </form>
    </div>
  </Teleport>
</template>
