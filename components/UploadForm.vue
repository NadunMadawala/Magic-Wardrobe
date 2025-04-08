<template>
  <div class="max-w-5xl mx-auto px-4">
    <!-- Upload Form -->
    <form @submit.prevent="submitUpload" class="space-y-4 max-w-lg mx-auto mt-6">
      <input
        v-model="title"
        type="text"
        placeholder="Title"
        required
        class="input"
      />
      <textarea
        v-model="description"
        placeholder="Description"
        class="input"
      ></textarea>
      <!-- ✅ File input with ref -->
      <input type="file" @change="handleFile" ref="fileInput" class="input" />
      <button type="submit" :disabled="loading" class="submit-btn">
        {{ editingId ? "Update Upload" : loading ? "Uploading..." : "Upload" }}
      </button>
    </form>

    <!-- Grid of Uploaded Images -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      <div
        v-for="upload in uploads"
        :key="upload.id"
        class="rounded overflow-hidden shadow-lg bg-white"
      >
        <img
          v-if="upload.image_url"
          :src="upload.image_url"
          class="w-full h-58 object-cover"
          alt="Uploaded image"
        />
        <div class="p-4">
          <h3 class="text-lg font-bold mb-1">📌 {{ upload.title }}</h3>
          <p class="text-sm text-gray-800">📝 {{ upload.description }}</p>

          <div class="mt-3 flex gap-2">
            <button
              @click="editUpload(upload)"
              class="px-3 py-1 text-sm bg-yellow-400 text-black rounded"
            >
              ✏️ Edit
            </button>
            <button
              @click="deleteUpload(upload.id)"
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
const title = ref("");
const description = ref("");
const file = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null); // ✅ file input ref
const loading = ref(false);
const editingId = ref<number | null>(null);

// Upload list
const uploads = ref<any[]>([]);

// Fetch existing uploads
const fetchUploads = async () => {
  const { data, error } = await supabase
    .from("uploads")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Fetch error:", error.message);
  } else {
    uploads.value = data || [];
  }
};

// Handle file input
const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0];
  }
};

// Submit new or updated upload
const submitUpload = async () => {
  loading.value = true;

  const payload: any = {
    title: title.value,
    description: description.value,
  };

  if (file.value) {
    const filePath = `${Date.now()}-${file.value.name}`;
    const { error: uploadError } = await supabase.storage
      .from("clothes")
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
      .from("clothes")
      .getPublicUrl(filePath);
    payload.image_url = imageUrl.publicUrl;
  }

  if (editingId.value) {
    // Update
    const { error } = await supabase
      .from("uploads")
      .update(payload)
      .eq("id", editingId.value);

    if (error) {
      console.error("Update failed:", error.message);
    } else {
      alert("Upload updated!");
    }
  } else {
    // Insert
    const { error } = await supabase.from("uploads").insert(payload);
    if (error) {
      console.error("Insert failed:", error.message);
    } else {
      alert("Upload saved!");
    }
  }

  // Reset
  title.value = "";
  description.value = "";
  file.value = null;
  editingId.value = null;
  if (fileInput.value) {
    fileInput.value.value = ""; // ✅ clears the input UI
  }
  loading.value = false;

  fetchUploads();
};

// Edit handler
const editUpload = (upload: any) => {
  title.value = upload.title;
  description.value = upload.description;
  editingId.value = upload.id;
  file.value = null;
  if (fileInput.value) {
    fileInput.value.value = ""; // clear file input on edit too
  }
};

// Delete handler
const deleteUpload = async (id: number) => {
  const { error } = await supabase.from("uploads").delete().eq("id", id);
  if (error) {
    console.error("Delete failed:", error.message);
  } else {
    fetchUploads();
  }
};

onMounted(fetchUploads);
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
