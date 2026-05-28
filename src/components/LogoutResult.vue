<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  message: { type: String, required: true }
})
</script>

<template>
  <div class="logout-result">
    <div class="logout-result__badge">
      <i class="pi pi-check-circle"></i>
    </div>
    <div class="logout-result__content">
      <h2>Logout completato</h2>
      <p>{{ props.message }}</p>
    </div>
  </div>
</template>

<style scoped>
.logout-result {
  width: min(520px, 100%);
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  border: 1px solid #e8e8ed;
  display: flex;
  align-items: center;
  gap: 22px;
}

.logout-result__badge {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: #e6f9f0;
  display: grid;
  place-items: center;
  color: #2f7d52;
  font-size: 2rem;
}

.logout-result__content h2 {
  margin: 0;
  font-size: 26px;
  font-weight: 500;
  color: #1d1d1f;
}

.logout-result__content p {
  margin: 10px 0 0;
  color: #5f5f67;
  line-height: 1.75;
}
</style>