<template>
  <div class="page-header">
    <div class="header-text">
      <p class="eyebrow">Gestione Ordini</p>
      <h1>Ordini & Acquisti</h1>
      <p class="intro-text">
        Visualizza tutti gli ordini effettuati, cerca per utente o titolo libro e consulta
        il dettaglio completo di ogni acquisto.
      </p>
    </div>

    <div class="box-search">
      <div class="search-wrapper">
        <span class="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </span>
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          type="text"
          class="search-input"
          placeholder="Cerca per utente, email o libro…"
        />
        <button v-if="modelValue" class="search-clear" @click="$emit('update:modelValue', '')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 20px;
}

.eyebrow {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6e6e73;
  margin: 0 0 10px;
}

h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 600;
  color: #1d1d1f;
  line-height: 1.1;
}

.intro-text {
  margin: 14px 0 0;
  color: #6e6e73;
  font-size: 15px;
  line-height: 1.8;
  max-width: 740px;
}

.box-search { width: 100%; }

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 480px;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: #86868b;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 11px 40px 11px 42px;
  border-radius: 14px;
  border: 1.5px solid #e2e2e7;
  background: #fff;
  font-size: 15px;
  color: #1d1d1f;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.search-input::placeholder { color: #a0a0a8; }

.search-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
}

.search-clear {
  position: absolute;
  right: 12px;
  background: #e2e2e7;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6e6e73;
  transition: background 0.2s;
}

.search-clear:hover { background: #c8c8d0; }

@media (max-width: 720px) {
  h1 { font-size: 26px; }
}
</style>
