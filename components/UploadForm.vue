<template>
  <div class="max-w-lg mx-auto">
    <!-- Upload Form -->
    <form @submit.prevent="uploadImages">
      <input
        v-model="title"
        type="text"
        placeholder="Title"
        class="input-field"
        required
      />
      <textarea
        v-model="description"
        placeholder="Description"
        class="input-field"
        required
      ></textarea>

      <!-- Multiple File Upload Input -->
      <input
        type="file"
        multiple
        @change="handleFileUpload"
        accept="image/*"
        class="file-input"
        required
      />

      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? "Uploading..." : "Upload" }}
      </button>
    </form>

    <!-- Uploaded Data Table -->
    <div v-if="uploads.length > 0" class="uploads-container">
      <h2 class="text-center mt-6">Uploaded Files</h2>
      <table class="uploads-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="upload in uploads" :key="upload.id">
            <td>
              <img
                :src="upload.image_url"
                alt="Uploaded Image"
                class="uploaded-image"
              />
            </td>
            <td>{{ upload.title }}</td>
            <td>{{ upload.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSupabaseClient } from "#imports";

const supabase = useSupabaseClient();
const title = ref("");
const description = ref("");
const files = ref<FileList | null>(null);
const loading = ref(false);
const uploads = ref<
  { id: string; title: string; description: string; image_url: string }[]
>([]);

// Handle multiple file selection
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    files.value = target.files;
  }
};

// Upload multiple images to Supabase Storage
const uploadImages = async () => {
  if (!files.value || files.value.length === 0) {
    alert("Please select at least one file!");
    return;
  }

  loading.value = true;
  const imageUrls: string[] = [];

  for (const file of files.value) {
    const filePath = `uploads/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (error) {
      console.error("Upload Error:", error.message);
      loading.value = false;
      return;
    }

    // Get the public URL of the uploaded image
    const { data: imageUrl } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    imageUrls.push(imageUrl.publicUrl);
  }

  // Save image URLs + text fields in Supabase Database
  const { error: dbError } = await supabase.from("uploads").insert(
    imageUrls.map((url) => ({
      title: title.value,
      description: description.value,
      image_url: url,
    }))
  );

  if (dbError) {
    console.error("Database Error:", dbError.message);
  } else {
    alert("Upload successful!");
    title.value = "";
    description.value = "";
    files.value = null;
    fetchUploads(); // Fetch latest uploaded data
  }

  loading.value = false;
};

// Fetch all uploaded files from Supabase
const fetchUploads = async () => {
  const { data, error } = await supabase
    .from("uploads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch Error:", error.message);
  } else {
    uploads.value = data || [];
  }
};

// Fetch uploads when the component is mounted
onMounted(fetchUploads);
</script>

<style scoped>
.input-field {
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
}

.file-input {
  display: block;
  margin-bottom: 10px;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

.uploads-container {
  margin-top: 20px;
}

.uploads-table {
  width: 100%;
  border-collapse: collapse;
}

.uploads-table th,
.uploads-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.uploaded-image {
  width: 100px;
  height: auto;
  border-radius: 8px;
}
</style>
