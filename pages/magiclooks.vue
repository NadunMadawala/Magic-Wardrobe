<template>
  <div>
    <!-- Heading -->
    <Heading
      title="Magic Looks"
      description="Magic Look can generate your desirable outfit."
      icon="lucide:wand"
      iconColor="text-orange-800"
      bgColor="bg-orange-800/10"
    />

    <div class="p-8">
      <h1 class="text-pxl md:text-2xl font-bold text-center">
        Generate a Magic Outfit
      </h1>

      <!-- Prompt Form -->
      <form
        @submit.prevent="submitForm"
        class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
      >
        <div class="col-span-12 lg:col-span-10 flex flex-col justify-center">
          <input
            type="text"
            v-model="prompt"
            placeholder="Tell me what kind of fashion & outfit you need..."
            class="border-0 outline-none focus-visible:ring-0 focus-visible-transparent w-full"
          />
        </div>

        <Button
          class="col-span-12 lg:col-span-2"
          type="submit"
          :disabled="!prompt || isLoading"
        >
          {{ isLoading ? "Generating..." : "Generate Magic Outfit" }}
        </Button>
      </form>

      <!-- Generated Image -->
      <div v-if="imageUrl" class="mt-6 flex justify-center">
        <img
          :src="imageUrl"
          alt="Generated Outfit"
          class="max-w-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Heading from "~/components/ui/shared/Heading.vue";
import { ref } from "vue";

const prompt = ref("");
const imageUrl = ref("");
const isLoading = ref(false);

const submitForm = async () => {
  if (!prompt.value) return;

  isLoading.value = true;
  imageUrl.value = "";

  try {
    const response = await fetch("http://127.0.0.1:5000/generate-outfit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Something went wrong.");
      return;
    }

    const blob = await response.blob();
    imageUrl.value = URL.createObjectURL(blob);
  } catch (error) {
    alert("Failed to generate outfit. Please try again later.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped></style>
