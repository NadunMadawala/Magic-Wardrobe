<template>
  <div class="max-w-5xl mx-auto px-4">
    <!-- Form -->
    <form @submit.prevent="submitLook" class="space-y-4 max-w-lg mx-auto mt-6">
      <input
        v-model="lookName"
        type="text"
        placeholder="Look name"
        required
        class="input"
      />
      <input v-model="dateToWear" type="date" required class="input" />
      <textarea
        v-model="description"
        placeholder="Description (optional)"
        class="input"
      ></textarea>
      <input type="file" @change="handleFile" class="input" />
      <button type="submit" :disabled="loading" class="submit-btn">
        {{ editingId ? "Update Look" : loading ? "Saving..." : "Save Look" }}
      </button>
    </form>

    <!-- Grid of Looks -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      <div
        v-for="look in looks"
        :key="look.id"
        class="rounded overflow-hidden shadow-lg bg-white"
      >
        <img
          v-if="look.image_url"
          :src="look.image_url"
          class="w-full h-48 object-cover"
          alt="Look image"
        />
        <div class="p-4">
          <h3 class="text-lg font-bold mb-1">📝 {{ look.look_name }}</h3>
          <p class="text-sm text-gray-600 mb-1">📅 {{ look.date_to_wear }}</p>
          <p class="text-sm text-gray-800">📜 {{ look.description }}</p>

          <div class="mt-3 flex gap-2">
            <button
              @click="editLook(look)"
              class="px-3 py-1 text-sm bg-yellow-400 text-black rounded"
            >
              ✏️ Edit
            </button>
            <button
              @click="deleteLook(look.id)"
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
const lookName = ref("");
const dateToWear = ref("");
const description = ref("");
const file = ref<File | null>(null);
const loading = ref(false);
const editingId = ref<number | null>(null);

// Looks list
const looks = ref<any[]>([]);

// Fetch existing looks
const fetchLooks = async () => {
  const { data, error } = await supabase
    .from("looks")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Fetch error:", error.message);
  } else {
    looks.value = data || [];
  }
};

// Handle file input
const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0];
  }
};

// Submit new or updated look
const submitLook = async () => {
  loading.value = true;

  const payload: any = {
    look_name: lookName.value,
    date_to_wear: dateToWear.value,
    description: description.value,
  };

  if (file.value) {
    const filePath = `${Date.now()}-${file.value.name}`;
    const { error: uploadError } = await supabase.storage
      .from("looks")
      .upload(filePath, file.value, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.value.type,
      });

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      loading.value = false;
      return;
    }

    const { data: imageUrl } = supabase.storage
      .from("looks")
      .getPublicUrl(filePath);
    payload.image_url = imageUrl.publicUrl;
  }

  if (editingId.value) {
    // Update
    const { error } = await supabase
      .from("looks")
      .update(payload)
      .eq("id", editingId.value);

    if (error) {
      console.error("Update failed:", error.message);
    } else {
      alert("Look updated!");
    }
  } else {
    // Insert
    const { error } = await supabase.from("looks").insert(payload);
    if (error) {
      console.error("Insert failed:", error.message);
    } else {
      alert("Look saved!");
    }
  }

  // Reset
  lookName.value = "";
  dateToWear.value = "";
  description.value = "";
  file.value = null;
  editingId.value = null;
  loading.value = false;

  fetchLooks();
};

// Edit handler
const editLook = (look: any) => {
  lookName.value = look.look_name;
  dateToWear.value = look.date_to_wear;
  description.value = look.description;
  editingId.value = look.id;
  file.value = null;
};

// Delete handler
const deleteLook = async (id: number) => {
  const { error } = await supabase.from("looks").delete().eq("id", id);
  if (error) {
    console.error("Delete failed:", error.message);
  } else {
    fetchLooks();
  }
};

onMounted(fetchLooks);
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 5px;
}
.submit-btn {
  background: #007bff;
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
