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
          @submit.prevent="submitForm"
          action=""
          class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
        >
          <div class="col-span-12 lg:col-span-10" flex flex-col justify-center>
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

      <div class="space-y mt-4">
        <div
          v-if="isLoading"
          class="p-8 rounded-lg w-full flex items-center justify-center bg-muted"
        >
          <Loader />
        </div>
        <Empty
          v-if="!messages.length && !isLoading"
          label="No Conversation Found"
        />
        <div class="flex flex-col-reverse gap-y-4">
          <div
            v-for="(message, i) in messages"
            :key="i"
            :class="`p-8 w-full rounded-lg flex items-center gap-x-3 ${
              message.role === 'user'
                ? 'bg-white border border-black/10'
                : 'bg-slate-20'
            }`"
          >
            <UserAvatar v-if="message.role === 'user'" />
            <BotAvatar v-else />

            <p class="text-sm">
              {{ message.content }}
            </p>
          </div>
        </div>
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
import Loader from "~/components/ui/shared/Loader.vue";
import Empty from "~/components/ui/shared/Empty.vue";
import UserAvatar from "~/components/ui/shared/UserAvatar.vue";
import type { ChatCompletionRequestMessage } from "~/types";

const prompt = ref("");
const isLoading = ref(false);
const messages = ref<ChatCompletionRequestMessage[]>([]);

const submitForm = async () => {
  if (!prompt.value.trim()) return; // Prevent empty messages

  isLoading.value = true;
  const userMessage: ChatCompletionRequestMessage = {
    role: "user",
    content: prompt.value,
  };

  const newMessages = [...messages.value, userMessage];

  try {
    const { data, error } = await useFetch("/api/conversation", {
      method: "POST",
      body: JSON.stringify({ messages: newMessages }), // ✅ Fix JSON format
    });

    if (data.value) {
      messages.value.push(userMessage, {
        role: "assistant",
        content: data.value?.content || "I'm not sure how to respond to that.",
      });
    }

    if (error.value) {
      console.error("[Conversation_Error]", error.value.statusMessage);
      messages.value.push({
        role: "assistant",
        content: "Oops! Something went wrong. Please try again.",
      });
    }
  } catch (err) {
    console.error("[API_ERROR]", err);
    messages.value.push({
      role: "assistant",
      content: "Something went wrong with the server.",
    });
  } finally {
    isLoading.value = false;
    prompt.value = ""; // Clear input field
  }
};
</script>

<!-- <script setup lang="ts">
import Heading from "~/components/ui/shared/Heading.vue";
import Loader from "~/components/ui/shared/Loader.vue";
import Empty from "~/components/ui/shared/Empty.vue";

// import { ChatCompletionRequestMessage } from "~/types";
import type { ChatCompletionRequestMessage } from "~/types";

import UserAvatar from "~/components/ui/shared/UserAvatar.vue";

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
  const { data, error } = await useFetch("/api/conversation", {
    method: "POST",
    body: {
      messages: newMessages,
    },
  });
  if (data.value) {
    messages.value = [
      ...messages.value,
      userMessage,
      {
        role: "assistant",
        content: data.value.content as string,
      },
    ];
  }

  if (error.value) {
    console.log("[Conversation_Error]", error.value.statusMessage);
  }
  isLoading.value = false;
};
</script> -->

<style scoped></style>
