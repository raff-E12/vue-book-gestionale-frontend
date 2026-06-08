<script setup lang="ts">
import { useCartStore } from '../stores/cartList'
import ShopCartItem from '../assets/layouts/ShopCartItem.vue'
import { Button, Toast, useToast } from 'primevue'
import { useRouter } from 'vue-router';
import OrderStore from '../stores/OrdersStore';
import { watch, watchEffect } from 'vue';
import userStore from '../stores/UserStore';

const store = OrderStore();
const toast = useToast();
const router = useRouter();
const users = userStore();

function onIncrementa(id: number, sub: number) {
  store.AddQuantity(id, sub);
}

function onDecrementa(id: number, sub: number) {
  store.DecourtQuantity(id, sub);
}

function onRimuovi(id: number) {
  store.DeleteProdOrder(id);
  toast.add({
    severity: 'warn',
    summary: 'Articolo rimosso',
    detail: 'Il prodotto è stato rimosso dal carrello.',
    life: 2500,
  })
}

function onOrdina() {
  const id = users.id;
  store.CreateOrder(id);
}

const goBack = () => {
  router.push('/')
}

watch(
  () => store.created.status,
  (status) => {
    if (status) {
      toast.add({ severity: 'success', summary: 'Ordine Creato', detail: 'Ordine è stato creato', life: 3500 });
      store.CheckOrders();
    }
  }
);

watch(
  () => store.created.error,
  (errors) => {
    if (errors) {
      toast.add({ severity: 'error', summary: 'Ordine non Creato', detail: 'Ordine non è stato creato!', life: 3500 });
      setTimeout(() => store.created.error = false, 1500);
    }
  }
);

watch(
  () => store.created.checks,
  (checks) => {
    if (checks && store.created.status) {
      toast.add({
        severity: 'success',
        summary: 'Ordine confermato',
        detail: `Ordine di ${store.length} articoli per € ${store.total.toFixed(2)} inviato!`,
        life: 3500,
      });
      setTimeout(() => store.DeleteAllProd(store.created.id), 1500);
    }
});

</script>

<template>
  <Toast />

  <div class="shop-page">
    <div class="shop-container">

      <!-- Header -->
      <div class="shop-header">
        <button class="back-button" @click="goBack">
          ← Homepage
        </button>
        <h1 class="shop-title">Il tuo Carrello</h1>
        <span v-if="store.orders.length" class="badge">
          {{ store.length }} {{ store.length === 1 ? 'articolo' : 'articoli' }}
        </span>
      </div>

      <!-- Lista articoli -->
      <div v-if="store.orders.length" class="items-list">
        <ShopCartItem
          v-for="item in store.orders"
          :key="item.id"
          :item="item"
          @incrementa="onIncrementa"
          @decrementa="onDecrementa"
          @rimuovi="onRimuovi"
        />
      </div>

      <!-- Carrello vuoto -->
      <div v-else class="empty-state">
        <i class="pi pi-shopping-cart empty-icon" />
        <h2>Carrello vuoto</h2>
        <p>Non hai ancora aggiunto nessun articolo al carrello.</p>
      </div>

      <!-- Footer riepilogo -->
      <div v-if="store.orders.length" class="shop-footer">
        <div class="totale-block">
          <span class="totale-label">Totale ordine</span>
          <span class="totale-value">€ {{ store.total.toFixed(2) }}</span>
        </div>
        <div class="footer-actions">
          <Button
            label="Svuota carrello"
            variant="outlined"
            severity="danger"
            rounded
            icon="pi pi-trash"
            @click="() => store.$reset()"
          />
          <Button
            label="Procedi all'ordine"
            severity="success"
            rounded
            icon="pi pi-check"
            icon-pos="right"
            @click="onOrdina"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.shop-page {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding: 40px 20px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.shop-container {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Header */
.shop-header {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 14px;
  margin-bottom: 8px;
}

.shop-title {
  font-size: 32px;
  font-weight: 300;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.5px;
}

.badge {
  background: #0070C9;
  color: white;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 24px;
}

/* Lista */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Empty */
.empty-state {
  background: white;
  border-radius: 12px;
  padding: 72px 48px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  border: 1px solid #e8e8ed;
}

.empty-icon {
  font-size: 56px;
  color: #d1d1d6;
  display: block;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 300;
  color: #1d1d1f;
  margin: 0 0 10px;
}

.empty-state p {
  font-size: 15px;
  color: #86868b;
  margin: 0;
}

/* Footer */
.shop-footer {
  background: white;
  border-radius: 12px;
  padding: 24px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  border: 1px solid #e8e8ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 8px;
}

.totale-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.totale-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #86868b;
}

.totale-value {
  font-size: 28px;
  font-weight: 500;
  color: #1d1d1f;
  letter-spacing: -0.5px;
}

.footer-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.back-button {
  background: white;
  border: 1px solid #d1d1d6;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 15px;
  color: #0070C9;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 400;
  margin-right: 182px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background: #f5f5f7;
  border-color: #0070C9;
}


@media (max-width: 640px) {
  .shop-footer {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .footer-actions {
    flex-direction: column;
  }

  .shop-title {
    font-size: 26px;
  }

  .back-button {
    margin-right: 0;
    width: fit-content;
  } 
}
</style>
