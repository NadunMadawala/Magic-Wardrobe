<template>
  <div class="h-full p-20 flex flex-col items-center justify-center">
    <div class="w-72 h-72 relative">
      <img src="/public/empty.jpg" alt="" />
    </div>
    <p class="text-sm text-muted-foreground text-center">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<style scoped></style>
