<script setup lang="ts">
import { computed } from 'vue'
import { Button, ConfirmPopup, useConfirm } from 'primevue'
import { OrderTemplate } from '../../stores/OrdersStore';

const props = defineProps<{ item: OrderTemplate }>()

const emit = defineEmits<{
  (e: 'incrementa', id: number, sub: number): void
  (e: 'decrementa', id: number, sub: number): void
  (e: 'rimuovi', id: number): void
}>()

const confirm = useConfirm();

const getInitials = (title: string): string => {
  const words = title.split(' ')
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

const subtotale = computed(() =>
  (props.item.Price * props.item.Quantity).toFixed(2)
)

function confermaRimozione(event: MouseEvent) {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Rimuovere questo articolo dal carrello?',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sì, rimuovi',
    rejectLabel: 'Annulla',
    accept: () => emit('rimuovi', props.item.id),
  })
}
</script>

<template>
  <ConfirmPopup />
  <div class="cart-card">
    <!-- Cover libro -->
    <div class="book-cover" :style="{ backgroundColor: item.CoverColor }">
      <span class="book-initials">{{ getInitials(item.BookName) }}</span>
    </div>

    <!-- Info libro -->
    <div class="book-info">
      <h3 class="book-title">{{ item.BookName }}</h3>
      <p class="book-meta">
        <span class="label">Autore</span>
        <span>{{ item.Author }}</span>
      </p>
      <p class="book-meta">
        <span class="label">Editore</span>
        <span>{{ item.Editor }}</span>
      </p>
      <p class="book-price-unit">€ {{ item.Price.toFixed(2) }} / copia</p>
    </div>

    <!-- Controllo quantità -->
    <div class="qty-block">
      <span class="qty-label">Quantità</span>
      <div class="qty-controls">
        <Button
          icon="pi pi-minus"
          rounded
          text
          severity="secondary"
          size="small"
          :disabled="item.Quantity <= 1"
          @click="emit('decrementa', item.id, parseFloat(subtotale.toString()))"
        />
        <span class="qty-value">{{ item.Quantity }}</span>
        <Button
          icon="pi pi-plus"
          rounded
          text
          severity="secondary"
          size="small"
          @click="emit('incrementa', item.id, parseFloat(subtotale.toString()))"
        />
      </div>
      <p class="subtotale">€ {{ subtotale }}</p>
    </div>

    <!-- Rimuovi -->
    <div class="remove-block">
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        size="small"
        v-tooltip.top="'Rimuovi dal carrello'"
        @click="confermaRimozione"
      />
    </div>
  </div>
</template>

<style scoped>
.cart-card {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  display: grid;
  grid-template-columns: 72px 1fr auto auto;
  align-items: center;
  gap: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  border: 1px solid #e8e8ed;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.cart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
  transform: translateY(-1px);
}

/* Cover */
.book-cover {
  width: 72px;
  height: 100px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.book-initials {
  font-size: 22px;
  font-weight: 300;
  color: white;
  letter-spacing: 2px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Info */
.book-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.book-title {
  font-size: 17px;
  font-weight: 500;
  color: #1d1d1f;
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  letter-spacing: -0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-meta {
  display: flex;
  gap: 6px;
  font-size: 13px;
  color: #6e6e73;
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: #86868b;
  align-self: center;
}

.book-price-unit {
  font-size: 13px;
  color: #0070C9;
  margin: 4px 0 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 500;
}

/* Qty */
.qty-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 120px;
}

.qty-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: #86868b;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f5f5f7;
  border-radius: 24px;
  padding: 2px 4px;
}

.qty-value {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  min-width: 28px;
  text-align: center;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.subtotale {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* Remove */
.remove-block {
  display: flex;
  align-items: center;
}

/* Responsive */
@media (max-width: 640px) {
  .cart-card {
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto;
    gap: 16px;
  }

  .qty-block {
    grid-column: 2;
  }

  .remove-block {
    grid-column: 1;
    grid-row: 2;
    justify-content: center;
  }
}
</style>
