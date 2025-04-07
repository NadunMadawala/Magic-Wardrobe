<template>
  <div>
    <!-- Heading -->
    <Heading
      title="Magic Looks"
      description="Magic Look can generate your desirable outfit."
      icon="lucide:wand"
      iconColor="text-orange-800"
      bgColor="bg-orange-800/10"
    ></Heading>
    <div class="p-8">
      <h1 class="text-pxl md:text-2xl font-bold text-center">
        Generate a Magic Outfit
      </h1>
      <form
        @submit.prevent="submitForm"
        class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
      >
        <div class="col-span-12 lg:col-span-10 flex flex-col justify-center">
          <input
            type="text"
            v-model="prompt"
            placeholder="Tell me what kind of fashion & outfit You Need..."
            class="border-0 outline-none focus-visible:ring-0 focus-visible-transparent w-full"
          />
        </div>
        <Button
          class="col-span-12 lg:col-span-2"
          type="submit"
          :disabled="!prompt || isLoading"
        >
          Generate Magic Outfit
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import Heading from "~/components/ui/shared/Heading.vue";
const prompt = ref("");
</script>

<style scoped></style>
