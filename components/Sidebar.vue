<template>
  <div class="space-y-4 py-4 flex-col flex h-full bg-whit shadow-sm border-r">
    <div class="px-3 py-2 flex-1">
      <NuxtLink class="flex items-center pl-3 mb-14" to="/">
        <div class="relative h-8 w-8 mr-4">
          <img src="/public/logo.svg" alt="logo" />
        </div>
        <h1 class="text-2xl font-bold">Magic Wardrobe</h1>
      </NuxtLink>
      <div class="space-y-1">
        <NuxtLink
          v-for="route in dashboardLinks"
          :key="route.link"
          :to="route.link"
          class="text-sm group tlex-primary flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition hover:bg-muted"
          :class="{
            'bg-muted': currentRoute.path === route.link,
          }"
        >
          <div class="flex items-center flex-1 capitalize">
            <Icon :name="route.icon" :class="`h-5 w-5 mr-3 ${route.color}`" />
            {{ route.label }}
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
const currentRoute = useRoute();
</script>

<style lang="scss" scoped></style>
