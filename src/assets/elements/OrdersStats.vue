<template>
  <div class="stats-bar">
    <div class="stat-pill">
      <span class="stat-value">{{ filtered }}</span>
      <span class="stat-label">Ordini trovati</span>
    </div>
    <div class="stat-pill">
      <span class="stat-value">{{ completed }}</span>
      <span class="stat-label">Completati</span>
    </div>
    <div class="stat-pill">
      <span class="stat-value">{{ pending }}</span>
      <span class="stat-label">In attesa</span>
    </div>
    <div class="stat-pill accent">
      <span class="stat-value">€{{ revenue.toFixed(2) }}</span>
      <span class="stat-label">Totale ricavi</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  filtered:  number
  completed: number
  pending:   number
  revenue:   number
}>()
</script>

<style scoped>
.stats-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e8e8ed;
  border-radius: 999px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.stat-pill.accent {
  background: #f0effe;
  border-color: #c4c0fb;
}

.stat-value {
  font-size: 15px;
  font-weight: 700;
  color: #1d1d1f;
}

.stat-label {
  font-size: 13px;
  color: #6e6e73;
}
</style>
