<template>
  <div>
    <!-- Heading -->
    <Heading
      title="Fashion Bot"
      description="A fashion bot that helps you find the information about outfits & fashion."
      icon="lucide:bot-message-square"
      iconColor="text-blue-800"
      bgColor="bg-blue-800/10"
    />

    <div class="px-4 lg:px-8">
      <form
        @submit.prevent="submitForm"
        class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
      >
        <div class="col-span-12 lg:col-span-10 flex flex-col justify-center">
          <input
            type="text"
            v-model="prompt"
            placeholder="Ask me anything about fashion & outfits..."
            class="border-0 outline-none focus-visible:ring-0 focus-visible-transparent w-full"
          />
        </div>
        <Button
          class="col-span-12 lg:col-span-2"
          type="submit"
          :disabled="!prompt || isLoading"
        >
          Ask Fashion Bot
        </Button>
      </form>

      <div class="space-y mt-4">
        <!-- Loader -->
        <div
          v-if="isLoading"
          class="p-8 rounded-lg w-full flex items-center justify-center bg-muted"
        >
          <Loader />
        </div>

        <!-- Empty State -->
        <Empty
          v-if="!messages.length && !isLoading"
          label="No Conversation Found"
        />

        <!-- Message List -->
        <div class="flex flex-col-reverse gap-y-4">
          <div
            v-for="(message, i) in messages"
            :key="i"
            :class="`
              p-8 w-full rounded-lg ${
                message.role === 'user'
                  ? 'bg-white border border-black/10'
                  : 'bg-slate-20'
              }`"
          >
            <UserAvatar v-if="message.role === 'user'" />
            <BotAvatar v-else />
            <p class="text-sm" v-if="message.content">{{ message.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Heading from "~/components/ui/shared/Heading.vue";
import Loader from "~/components/ui/shared/Loader.vue";
import Empty from "~/components/ui/shared/Empty.vue";
import BotAvatar from "~/components/ui/shared/BotAvatar.vue";
import UserAvatar from "~/components/ui/shared/UserAvatar.vue";
import type { ChatCompletionRequestMessage } from "~/types";

const user = useSupabaseUser();
const prompt = ref("");
const isLoading = ref(false);
const messages = ref<ChatCompletionRequestMessage[]>([]);

const submitForm = async () => {
  isLoading.value = true;

  const userMessage: ChatCompletionRequestMessage = {
    role: "user",
    content: prompt.value,
  };

  const newMessages = [...messages.value, userMessage];

  // const { data, error } = await useFetch("/api/fashionbot", {
  //   method: "POST",
  //   body: {
  //     messages: newMessages,
  //   },
  // });

  // if (data.value) {
  //   messages.value = [
  //     ...messages.value,
  //     userMessage,
  //     { role: "assistant", content: data.value.content as string },
  //   ];
  // }
  // if (error.value) {
  //   console.log("[FashionBot_Error]", error.value.statusMessage);
  // }

  try {
    const data = await $fetch("/api/fashionbot", {
      method: "POST",
      body: {
        messages: newMessages,
      },
    });

    console.log("Bot Response:", data);

    messages.value = [
      ...messages.value,
      userMessage,
      {
        role: "assistant",
        content: data.content,
      },
    ];
  } catch (error: any) {
    console.error("[FashionBot_Error]", error.message);
  }

  isLoading.value = false;
  prompt.value = "";
};
</script>

<style scoped></style>
