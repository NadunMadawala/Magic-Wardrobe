<template>
  <div>
    <!-- Heading -->
    <Heading
      title="Looks"
      description="Make matching looks for future use."
      icon="lucide:shirt"
      iconColor="text-sky-800"
      bgColor="bg-sky-800/10"
    ></Heading>
    <h1 class="text-pxl md:text-2xl font-bold text-center">
      Make the look for future use
    </h1>
    <br />
    <UploadForm />
  </div>
</template>

<script setup lang="ts">
import Heading from "~/components/ui/shared/Heading.vue";
import UploadForm from "~/components/UploadForm.vue";
</script>

<style scoped></style>
