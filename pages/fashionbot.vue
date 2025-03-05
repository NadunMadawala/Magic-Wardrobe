<template>
  <div>
    <!-- Heading -->
    <Heading
      title="Fashion Bot"
      description="A fashion bot that helps you find the imfpration about outfits & Fashion."
      icon="lucide:bot-message-square"
      iconColor="text-blue-800"
      bgColor="bg-blue-800/10"
    ></Heading>

    <div class="px-4 lg:px-8">
      <div>
        <form
          action=""
          class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
        >
          <div class="col-span-12 lg:col-span-10">
            <div class="m-0 p-0">
              <input
                type="text"
                v-model="prompt"
                placeholder="Ask me Anything about Fashion & Outfits...!"
                class="border-0 outline-none focus-visible:ring-0 focus-visible-transparent w-full"
              />
            </div>
          </div>
          <Button
            class="col-span-12 lg:col-span-2"
            type="submit"
            :disabled="!prompt || isLoading"
            >Ask Fashion Bot</Button
          >
        </form>
      </div>
    </div>
    <div class="space-y mt-4">
      <div
        v-if="!isLoading"
        class="p-8 rounded-lg w-full flex items-center justify-center bg-muted"
      >
        <Loader />
      </div>
    </div>
    <!-- Loader -->
    <!-- Empty -->
    <!-- BotAvatar -->
    <!-- UserAvatar -->
  </div>
</template>

<script setup lang="ts">
import Heading from "~/components/ui/shared/Heading.vue";

const prompt = ref<string>("");
const isLoading = ref(false);
</script>

<style scoped></style>
