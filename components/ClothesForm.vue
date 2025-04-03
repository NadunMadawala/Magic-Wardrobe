<template>
  <div class="max-w-xl mx-auto">
    <!-- Add / Edit Form -->
    <form @submit.prevent="saveClothingItem" class="clothes-form">
      <input v-model="name" type="text" placeholder="Clothing Name" required />
      <input
        v-model="category"
        type="text"
        placeholder="Category (Shirt, Pants, etc.)"
        required
      />
      <input v-model="color" type="text" placeholder="Color" required />
      <input
        v-model="occasion"
        type="text"
        placeholder="Occasion (Casual, Formal, etc.)"
        required
      />
      <input
        v-model="weather"
        type="text"
        placeholder="Weather (Hot, Cold, Rainy)"
        required
      />
      <input type="file" @change="handleFileUpload" accept="image/*" />

      <button type="submit" class="submit-btn">
        {{ editingId ? "Update Item" : "Add Item" }}
      </button>
    </form>

    <!-- Clothes List -->
    <div v-if="clothes.length" class="clothes-list">
      <h2>Clothing Items</h2>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Color</th>
            <th>Occasion</th>
            <th>Weather</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in clothes" :key="item.id">
            <td>
              <img
                :src="item.image_url"
                alt="Clothing Image"
                class="clothes-img"
              />
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.color }}</td>
            <td>{{ item.occasion }}</td>
            <td>{{ item.weather }}</td>
            <td>
              <button @click="editItem(item)">Edit</button>
              <button @click="deleteItem(item.id)">Delete</button>
            </td>
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

// Form fields
const name = ref("");
const category = ref("");
const color = ref("");
const occasion = ref("");
const weather = ref("");
const file = ref<File | null>(null);
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

// File select handler
const handleFileUpload = (event: Event) => {
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

  // Reset
  name.value = "";
  category.value = "";
  color.value = "";
  occasion.value = "";
  weather.value = "";
  file.value = null;
  editingId.value = null;

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
.clothes-form input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
}

.clothes-list {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.clothes-img {
  width: 50px;
  height: auto;
  border-radius: 5px;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
</style>
