<template>
  <Navbar />
  <div class="orders-page">
    <div class="container">
      <OrdersHeader v-model="searchQuery" />

      <OrdersStats
        :filtered="filteredOrders.length"
        :completed="completedOrders"
        :pending="pendingOrders"
        :revenue="totalRevenue"
      />

      <OrdersTable
        :orders="filteredOrders"
        @select="selectedOrder = $event"
      />

    </div>

    <OrderDetailModal
      :order="selectedOrder"
      @close="selectedOrder = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import OrdersHeader     from '../assets/elements/OrdersHeader.vue'
import OrdersStats      from '../assets/elements/OrdersStats.vue'
import OrdersTable      from '../assets/elements/OrdersTable.vue'
import OrderDetailModal from '../assets/elements/OrderDetailModal.vue'
import type { OrdersList } from '../stores/OrdersStore'
import OrderStore from '../stores/OrdersStore'
import Navbar from '../assets/Navbar.vue'
import userStore from '../stores/UserStore'

// ── State ──────────────────────────────────────────────────────────────────────
const searchQuery   = ref('')
const selectedOrder = ref<OrdersList | null>(null)
const orderStore = OrderStore();
const AllOrders = computed(() => { return orderStore.list as OrdersList[] });

// ── Computed ───────────────────────────────────────────────────────────────────
const filteredOrders = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return AllOrders.value
  return AllOrders.value.filter(o =>
    o.User.Name.toLowerCase().includes(q)  ||
    o.User.Email.toLowerCase().includes(q) ||
    o.BookList.some(b => b.BookTitle.toLowerCase().includes(q))
  )
})

const completedOrders = computed(() => AllOrders.value.filter(o =>  o.Order).length)
const pendingOrders   = computed(() => AllOrders.value.filter(o => !o.Order).length)
const totalRevenue    = computed(() => AllOrders.value.reduce((s, o) => s + o.TotalPrice, 0))
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding: 40px 20px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
}
</style>
