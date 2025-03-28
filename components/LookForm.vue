<template>
  <div class="max-w-lg mx-auto">
    <form @submit.prevent="submitLook" class="space-y-4">
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
      <input
        type="file"
        @change="handleFile"
        accept="image/*"
        required
        class="input"
      />
      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? "Saving..." : "Save Look" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSupabaseClient } from "#imports";

const supabase = useSupabaseClient();

const lookName = ref("");
const dateToWear = ref("");
const description = ref("");
const file = ref<File | null>(null);
const loading = ref(false);

const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0];
  }
};

const submitLook = async () => {
  if (!file.value) return;

  loading.value = true;
  const filePath = `looks/${Date.now()}-${file.value.name}`;

  // Upload image to storage
  const { error: uploadError } = await supabase.storage
    .from("looks")
    .upload(filePath, file.value);

  if (uploadError) {
    console.error("Upload failed:", uploadError.message);
    loading.value = false;
    return;
  }

  const { data: imageUrl } = supabase.storage
    .from("looks")
    .getPublicUrl(filePath);

  // Save look data to database
  const { error: insertError } = await supabase.from("looks").insert([
    {
      look_name: lookName.value,
      date_to_wear: dateToWear.value,
      description: description.value,
      image_url: imageUrl.publicUrl,
    },
  ]);

  if (insertError) {
    console.error("Insert failed:", insertError.message);
  } else {
    alert("Look saved successfully!");
    lookName.value = "";
    dateToWear.value = "";
    description.value = "";
    file.value = null;
  }

  loading.value = false;
};
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}
.submit-btn {
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
</style>
