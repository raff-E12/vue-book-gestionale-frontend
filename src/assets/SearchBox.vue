<script setup lang="ts">
import { toRefs, ref, computed, onMounted, watch } from 'vue';
import UseBookStoreApi from '../stores/bookStore';

const searchQuery = ref('');
const searchMode = ref<'text' | 'category'>('text');
const store = UseBookStoreApi();
const emit = defineEmits(["search-input", "toogle-switch"]);
const FilteredBooks = computed(() => store.filtered);

const HandleResetInput = () => {
  searchQuery.value = "";
  searchMode.value = "text";
}

// Gestione Emits
const handleSearchInput = () => {
  emit("toogle-switch");
  emit("search-input", { type: "books", value: FilteredBooks });
  searchQuery.value = "";
}

watch(
  [searchQuery, searchMode],
  () => {
    store.FiltedBook(searchQuery, searchMode, store.books);
  },
  { immediate: true }
);

</script>

<template>
      <section class="search-section">
        <div>
          <h2 class="search-title">Cerca un libro</h2>
        </div>

        <div class="search-controls">
          <div class="segmented-control">
            <button
              :class="['segment', { active: searchMode === 'text' }]"
              @click="searchMode = 'text'"
            >
              Cerca per Testo
            </button>
            <button
              :class="['segment', { active: searchMode === 'category' }]"
              @click="searchMode = 'category'"
            >
              Cerca per Categoria
            </button>
          </div>

          <div class="search-input-wrapper">
            <input v-if="searchMode === 'text'"
              v-model="searchQuery"
              :type="'text'"
              :placeholder="'Cerca il libro...'"
              class="search-input"
              @keyup.enter="(event: any) => {
                handleSearchInput();
              }"
            />
            <select v-if="searchMode === 'category'"  id="category-select" v-model="searchQuery">
              <option value="">— Seleziona —</option>
              <option>Narrativa</option>
              <option>Saggistica</option>
              <option>Fantascienza</option>
              <option>Storico</option>
              <option>Filosofia</option>
              <option>Scienze</option>
              <option>Economia</option>
              <option>Arte</option>
              <option>Altro</option>
            </select>
            <button class="search-button" @click="(event: any) => {
                handleSearchInput();
              }">
              Cerca
            </button>
            <button class="search-button" v-if="searchQuery.length !== 0" @click="HandleResetInput" :style="{ backgroundColor: '#c90000'}">
              <i class="pi pi-eraser"></i>
            </button>
          </div>
        </div>
      </section>
</template>

<style scoped>

  .search-section {
    background: white;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 40px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .search-title {
    font-size: 24px;
    font-weight: 300;
    color: #1d1d1f;
    margin: 0 0 24px 0;
    text-align: center;
    letter-spacing: -0.3px;
  }

  .search-controls {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .segmented-control {
    display: inline-flex;
    background: #f5f5f7;
    border-radius: 8px;
    padding: 2px;
    border: 1px solid #d1d1d6;
  }

  .segment {
    padding: 10px 24px;
    border: none;
    background: transparent;
    color: #1d1d1f;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .segment.active {
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #0070C9;
    font-weight: 500;
  }

  .segment:hover:not(.active) {
    color: #0070C9;
  }

  .search-input-wrapper {
    display: flex;
    gap: 12px;
    width: 100%;
    max-width: 600px;
  }

  .search-input {
    flex: 1;
    padding: 14px 18px;
    border: 1px solid #d1d1d6;
    border-radius: 8px;
    font-size: 16px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    transition: all 0.2s ease;
    background: white;
  }

  .search-input:focus {
    outline: none;
    border-color: #0070C9;
    box-shadow: 0 0 0 3px rgba(0, 112, 201, 0.1);
  }

  .search-button {
    padding: 14px 32px;
    background: #0070C9;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    white-space: nowrap;
  }

  .search-button:hover {
    background: #0077D4;
    box-shadow: 0 4px 12px rgba(0, 112, 201, 0.3);
  }

  .search-button:active {
    transform: scale(0.98);
  }

  #category-select {
      background: #f8f7f4;
      border: 0.5px solid #ddd;
      border-radius: 8px;
      padding: 8px 11px;
      font-size: 13px;
      font-family: Arial, Helvetica, sans-serif;
      color: #0e2431;
      outline: none;
      width: 100%;
      transition: border-color 0.15s, box-shadow 0.15s;
  }

  #category-select:focus {
    border-color: #7F77DD;
    box-shadow: 0 0 0 3px rgba(127,119,221,0.12);
    background: #fff;
  }
</style>