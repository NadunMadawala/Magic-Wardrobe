<template>
  <div>
    <div class="mb-8" space-y-4>
      <h2 class="text-pxl md:text-4xl font-bold text-center">
        Explore Your New Modern Wardrobe
      </h2>
      <p
        class="text-muted-foreground font-light text-sm md:text-lg text-center"
      >
        Explore the power of AI & chat with Fashion Bot...
      </p>
    </div>
    <div class="px-4 md:px-20 lg:px-32 space-y-4">
      <div
        v-for="tool in tools"
        :key="tool.link"
        @click="$router.push(`${tool.link}`)"
        class="p-4 border-muted border flex items-center justify-between hover:shadow-sm transition cursor-pointer"
      >
        <div class="flex items center gap-x-4">
          <div :class="`p-2 w-fit rounded-md ${tool.bgColor}`">
            <Icon :name="tool.icon" :class="`h-8 w-8 ${tool.color}`" />
          </div>
          <div class="font-semibold">
            {{ tool.label }}
          </div>
        </div>
        <Icon name="lucide:square-chevron-right" class="h-5 w-5" />
      </div>
    </div>
    <br />
    <h1 class="text-pxl md:text-2xl font-bold text-center">
      Add Your Clothes to the Magic Wardrobe
    </h1>
    <br />
    <ClothesForm />
  </div>
</template>

<script setup lang="ts">
import ClothesForm from "~/components/ClothesForm.vue";
</script>

<style scoped></style>
