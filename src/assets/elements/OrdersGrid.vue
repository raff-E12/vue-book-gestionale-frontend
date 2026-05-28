<template>
  <div>
    <!-- Grid -->
    <TransitionGroup v-if="orders.length" name="card-list" tag="div" class="orders-grid">
      <OrderCard
        v-for="order in orders"
        :key="order.Id"
        :order="order"
        @open="$emit('open', $event)"
      />
    </TransitionGroup>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <div class="empty-icon">{{ emptyIcon }}</div>
      <p class="empty-title">{{ emptyTitle }}</p>
      <p class="empty-sub">{{ emptySub }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import OrderCard from './OrderCard.vue'
import type { OrdersList } from '../../stores/OrdersStore'
import type { FilterKey } from './OrdersFilterBar.vue'

const props = defineProps<{
  orders: OrdersList[]
  activeFilter: FilterKey
}>()

defineEmits<{
  open: [order: OrdersList]
}>()

const emptyIcon  = computed(() => props.activeFilter === 'completed' ? '✅' : props.activeFilter === 'pending' ? '⏳' : '📭')
const emptyTitle = computed(() => props.activeFilter === 'all' ? 'Nessun ordine ancora' : `Nessun ordine ${props.activeFilter === 'completed' ? 'completato' : 'in attesa'}`)
const emptySub   = computed(() => props.activeFilter === 'all' ? 'Inizia il tuo primo acquisto!' : 'Prova a cambiare filtro.')
</script>

<style scoped>
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 52px;
  margin-bottom: 16px;
  filter: grayscale(0.3);
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 8px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.empty-sub {
  font-size: 14px;
  color: #86868b;
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* TransitionGroup */
.card-list-enter-active { transition: all 0.3s ease; }
.card-list-leave-active { transition: all 0.2s ease; }
.card-list-enter-from   { opacity: 0; transform: translateY(12px); }
.card-list-leave-to     { opacity: 0; transform: scale(0.97); }
.card-list-move         { transition: transform 0.3s ease; }

@media (max-width: 640px) {
  .orders-grid { grid-template-columns: 1fr; }
}
</style>
