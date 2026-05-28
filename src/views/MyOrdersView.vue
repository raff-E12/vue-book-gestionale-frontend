<template>
  <NavBar />
  <div class="my-orders-page">
    <div class="container">

      <!-- Hero card utente -->
      <UserProfileCard :user="user" :orders="myOrders" />

      <!-- Filtri -->
      <OrdersFilterBar v-model="activeFilter" :orders="myOrders" />

      <!-- Griglia ordini -->
      <OrdersGrid
        :orders="filteredOrders"
        :active-filter="activeFilter"
        @open="openDrawer"
      />

    </div>

    <!-- Drawer dettaglio -->
    <MyOrderDetailDrawer :order="selectedOrder" @close="selectedOrder = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import UserProfileCard      from '../assets/elements/UserProfileCard.vue'
import OrdersFilterBar      from '../assets/elements/OrdersFilterBar.vue'
import OrdersGrid           from '../assets/elements/OrdersGrid.vue'
import MyOrderDetailDrawer  from '../assets/elements/MyOrderDetailDrawer.vue'
import type { UserStore, OrdersList } from '../stores/OrdersStore'
import type { FilterKey } from '../assets/elements/OrdersFilterBar.vue'
import userStore from '../stores/UserStore'
import OrderStore from '../stores/OrdersStore'
import NavBar from "../assets/layouts/Navbar.vue"

const userStores = userStore();
const orderStores = OrderStore();
const myOrders = computed(() => {
  const id = userStores.id;
  return orderStores.list.filter(o => o.User.UserID === id);
});
const user = computed(() => { return userStores.data });

// ── State ──────────────────────────────────────────────────────────────────────
const activeFilter  = ref<FilterKey>('all')
const selectedOrder = ref<OrdersList | null>(null)

// ── Computed ───────────────────────────────────────────────────────────────────
const filteredOrders = computed(() => {
  switch (activeFilter.value) {
    case 'completed': return myOrders.value.filter(o =>  o.Order)
    case 'pending':   return myOrders.value.filter(o => !o.Order)
    default:          return myOrders.value
  }
})

// ── Actions ────────────────────────────────────────────────────────────────────
function openDrawer(order: OrdersList) {
  selectedOrder.value = order
}

onBeforeMount(() => {
  if((userStores.feedback.login || userStores.feedback.created) && userStores.data.role.includes('USER')){
     orderStores.getOrdersInfo();
  }
})
</script>

<style scoped>
.my-orders-page {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding: 40px 20px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.container {
  max-width: 960px;
  margin: 0 auto;
}

@media (max-width: 720px) {
  .my-orders-page { padding: 24px 16px; }
}
</style>
