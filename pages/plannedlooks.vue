<template>
  <div>
    <!-- Heading -->
    <Heading
      title="Planned Looks"
      description="Plan your outfit for the day."
      icon="lucide:calendar-clock"
      iconColor="text-sky-800"
      bgColor="bg-sky-800/10"
    ></Heading>
    <div class="p-8">
      <h1 class="text-pxl md:text-2xl font-bold text-center">Plan a Look</h1>
      <LookForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import Heading from "~/components/ui/shared/Heading.vue";
import LookForm from "~/components/LookForm.vue";
</script>

<style scoped></style>
