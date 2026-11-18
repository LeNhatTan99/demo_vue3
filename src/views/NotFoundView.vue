<script setup lang="ts">
import { Compass } from '@lucide/vue'
</script>

<template>
  <section class="grid min-h-[65vh] place-items-center text-center">
    <div>
      <div class="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-indigo-50 text-indigo-600">
        <Compass :size="36" />
      </div>
      <p class="mt-7 text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">Lỗi 404</p>
      <h2 class="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">Không tìm thấy trang</h2>
      <p class="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">Trang bạn đang tìm không tồn tại hoặc đã được
        chuyển sang địa chỉ khác.</p>
      <RouterLink to="/" class="btn-primary mt-7">Về trang tổng quan</RouterLink>
    </div>
  </section>
</template>
