<!-- App.vue -->
<template>
  <div class="w-full min-h-screen flex items-center bg-gray-100">
    <div class="max-w-[800px] w-full mx-auto">
      <Card>
        <CardTitle>
          <div class="text-center py-4">Welcome To Magic Wardrobe..!</div>
        </CardTitle>
        <CardContent>
          <Auth
            :supabaseClient="supabaseClient"
            :appearance="{
              theme: ThemeSupa,
            }"
            :providers="['google']"
            redirectTo="/"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import predefined theme
import { ThemeSupa } from "@supabase/auth-ui-shared";
// import { Auth } from "@supa-kit/auth-ui-vue";
import { Auth } from "@nuxtbase/auth-ui-vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import { Card } from "~/components/ui/card";

const supabaseClient = useSupabaseClient();
definePageMeta({ layout: "home" });
</script>
