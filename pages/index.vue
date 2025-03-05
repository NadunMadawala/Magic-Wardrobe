<template>
  <div>
    {{ user }}
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
</script>

<style lang="scss" scoped></style>
