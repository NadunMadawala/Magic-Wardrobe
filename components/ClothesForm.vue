<template>
  <div class="max-w-5xl mx-auto px-4">
    <!-- Add / Edit Form -->
    <form
      @submit.prevent="saveClothingItem"
      class="clothes-form max-w-lg mx-auto mt-6 space-y-4"
    >
      <input
        v-model="name"
        type="text"
        placeholder="Clothing Name"
        required
        class="input"
      />
      <input
        v-model="category"
        type="text"
        placeholder="Category (Shirt, Pants, etc.)"
        required
        class="input"
      />
      <input
        v-model="color"
        type="text"
        placeholder="Color"
        required
        class="input"
      />
      <input
        v-model="occasion"
        type="text"
        placeholder="Occasion (Casual, Formal, etc.)"
        required
        class="input"
      />
      <input
        v-model="weather"
        type="text"
        placeholder="Weather (Hot, Cold, Rainy)"
        required
        class="input"
      />
      <input
        type="file"
        @change="handleFile"
        ref="fileInput"
        accept="image/*"
        class="input"
      />
      <button type="submit" class="submit-btn">
        {{ editingId ? "Update Item" : "Add Item" }}
      </button>
    </form>

    <!-- Clothes Cards Grid -->
    <div
      v-if="clothes.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
    >
      <div
        v-for="item in clothes"
        :key="item.id"
        class="rounded overflow-hidden shadow-lg bg-white"
      >
        <img
          v-if="item.image_url"
          :src="item.image_url"
          alt="Clothing Image"
          class="w-38 h-28 object-cover"
        />
        <div class="p-4">
          <h3 class="text-lg font-bold mb-1">📝 {{ item.name }}</h3>
          <p class="text-sm text-gray-600">👔 Category: {{ item.category }}</p>
          <p class="text-sm text-gray-600">🎨 Color: {{ item.color }}</p>
          <p class="text-sm text-gray-600">📢 Occasion: {{ item.occasion }}</p>
          <p class="text-sm text-gray-600">🌦️ Weather: {{ item.weather }}</p>

          <div class="mt-3 flex gap-2">
            <button
              @click="editItem(item)"
              class="px-3 py-1 text-sm bg-yellow-400 text-black rounded"
            >
              ✏️ Edit
            </button>
            <button
              @click="deleteItem(item.id)"
              class="px-3 py-1 text-sm bg-red-500 text-white rounded"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";

// Supabase Client
const supabase = createClient(
  "https://jgilxwwltwkokehfyzzn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnaWx4d3dsdHdrb2tlaGZ5enpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4ODkxOTgsImV4cCI6MjA1MzQ2NTE5OH0.To58wxgIpQvVfzdE8sFtEwzrhqrbPn7A1F1bOa1IPI8"
);

// Form fields
const name = ref("");
const category = ref("");
const color = ref("");
const occasion = ref("");
const weather = ref("");
const file = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const editingId = ref<string | null>(null);

// Clothing list
const clothes = ref<
  Array<{
    id: string;
    name: string;
    category: string;
    color: string;
    occasion: string;
    weather: string;
    image_url: string;
  }>
>([]);

// File handler like look form
const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0];
  }
};

// Load clothes from DB
const fetchClothes = async () => {
  const { data, error } = await supabase
    .from("clothes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch Error:", error.message);
  } else {
    clothes.value = data || [];
  }
};

// Save or update clothing item
const saveClothingItem = async () => {
  let imageUrl = "";

  if (file.value) {
    const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 10000)}-${
      file.value.name
    }`;
    const filePath = `clothes/${uniqueName}`;

    const { error: uploadError } = await supabase.storage
      .from("clothes")
      .upload(filePath, file.value);

    if (uploadError) {
      console.error("Upload Error:", uploadError.message);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("clothes")
      .getPublicUrl(filePath);

    if (!publicUrl?.publicUrl) {
      console.error("Error getting image URL");
      return;
    }

    imageUrl = publicUrl.publicUrl;
  }

  const payload = {
    name: name.value,
    category: category.value,
    color: color.value,
    occasion: occasion.value,
    weather: weather.value,
    ...(imageUrl && { image_url: imageUrl }),
  };

  if (editingId.value) {
    const { error } = await supabase
      .from("clothes")
      .update(payload)
      .eq("id", editingId.value);

    if (error) {
      console.error("Update Error:", error.message);
      return;
    }
  } else {
    const { error } = await supabase.from("clothes").insert([payload]);

    if (error) {
      console.error("Insert Error:", error.message);
      return;
    }
  }

  name.value = "";
  category.value = "";
  color.value = "";
  occasion.value = "";
  weather.value = "";
  file.value = null;
  editingId.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }

  fetchClothes();
};

// Edit
const editItem = (item: any) => {
  name.value = item.name;
  category.value = item.category;
  color.value = item.color;
  occasion.value = item.occasion;
  weather.value = item.weather;
  editingId.value = item.id;
  file.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Delete
const deleteItem = async (id: string) => {
  const { error } = await supabase.from("clothes").delete().eq("id", id);
  if (error) console.error("Delete Error:", error.message);
  fetchClothes();
};

onMounted(fetchClothes);
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
button:hover {
  opacity: 0.9;
}
</style>
