<template>
  <div class="filter-bar">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="filter-tab"
      :class="{ active: modelValue === tab.key }"
      @click="$emit('update:modelValue', tab.key)"
    >
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
      <span class="tab-count" :class="{ active: modelValue === tab.key }">
        {{ tab.count }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrdersList } from '../../stores/OrdersStore'

export type FilterKey = 'all' | 'completed' | 'pending'

const props = defineProps<{
  modelValue: FilterKey
  orders: OrdersList[]
}>()

defineEmits<{
  'update:modelValue': [value: FilterKey]
}>()

const tabs = computed(() => [
  { key: 'all'       as FilterKey, icon: '📦', label: 'Tutti',      count: props.orders.length },
  { key: 'completed' as FilterKey, icon: '✅', label: 'Completati', count: props.orders.filter(o => o.Order).length },
  { key: 'pending'   as FilterKey, icon: '⏳', label: 'In attesa',  count: props.orders.filter(o => !o.Order).length },
])
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 14px;
  border: 1.5px solid #e2e2e7;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  color: #6e6e73;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  white-space: nowrap;
}

.filter-tab:hover {
  border-color: #c4c0fb;
  color: #4f46e5;
  background: #f5f3ff;
}

.filter-tab.active {
  background: #4f46e5;
  border-color: #4f46e5;
  color: #fff;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
}

.tab-icon { font-size: 15px; }

.tab-count {
  font-size: 12px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  background: #f0f0f5;
  color: #5f5f6e;
  transition: all 0.2s;
}

.tab-count.active {
  background: rgba(255,255,255,0.22);
  color: #fff;
}
</style>
