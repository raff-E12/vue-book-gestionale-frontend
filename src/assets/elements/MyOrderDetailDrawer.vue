<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="order" class="drawer-backdrop" @click.self="$emit('close')">
        <div class="drawer">

          <!-- Handle bar (mobile) -->
          <div class="drawer-handle" />

          <!-- Header -->
          <div class="drawer-header">
            <div class="drawer-header-left">
              <span class="drawer-eyebrow">Riepilogo ordine</span>
              <h3 class="drawer-title">#{{ order.Id }}</h3>
            </div>
            <button class="close-btn" @click="$emit('close')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Status banner -->
          <div class="status-banner" :class="order.Order ? 'completed' : 'pending'">
            <span class="banner-icon">{{ order.Order ? '✅' : '⏳' }}</span>
            <div>
              <p class="banner-title">{{ order.Order ? 'Ordine completato' : 'In attesa di conferma' }}</p>
              <p class="banner-sub">{{ order.Order ? 'Tutti i libri sono stati consegnati.' : 'Il tuo ordine è in elaborazione.' }}</p>
            </div>
          </div>

          <!-- Books -->
          <div class="drawer-section">
            <p class="section-label">Libri ({{ order.BookList.length }})</p>
            <div class="books-list">
              <div v-for="book in order.BookList" :key="book.Id" class="book-item">
                <div class="book-cover" :style="{ background: bookColor(book.BookTitle) }">
                  {{ bookInitial(book.BookTitle) }}
                </div>
                <div class="book-info">
                  <p class="book-title">{{ book.BookTitle }}</p>
                  <p class="book-meta">Qtà {{ book.Quanity }} · €{{ book.Price.toFixed(2) }} cad.</p>
                </div>
                <p class="book-sub">€{{ book.SubTotal.toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="drawer-total">
            <div class="total-row minor">
              <span>Subtotale libri</span>
              <span>€{{ subTotal.toFixed(2) }}</span>
            </div>
            <div class="total-row minor">
              <span>Spedizione</span>
              <span class="free">Gratuita</span>
            </div>
            <div class="divider" />
            <div class="total-row major">
              <span>Totale</span>
              <span class="total-value">€{{ order.TotalPrice.toFixed(2) }}</span>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrdersList } from '../types/my-orders.types'

const props = defineProps<{
  order: OrdersList | null
}>()

defineEmits<{ close: [] }>()

const PALETTE = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6']

function hash(s: string) {
  let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h)
}

const bookColor   = (t: string) => PALETTE[hash(t) % PALETTE.length]
const bookInitial = (t: string) => t[0]?.toUpperCase() ?? '?'

const subTotal = computed(() =>
  props.order?.BookList.reduce((s, b) => s + b.SubTotal, 0) ?? 0
)
</script>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1100;
  display: flex;
  justify-content: flex-end;
}

.drawer {
  background: #fff;
  width: 100%;
  max-width: 420px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  box-shadow: -20px 0 60px rgba(15,23,42,0.14);
}

/* Handle */
.drawer-handle {
  display: none;
  width: 36px; height: 4px;
  background: #d1d1d6;
  border-radius: 2px;
  margin: 12px auto 0;
}

/* Header */
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 28px 24px 20px;
  border-bottom: 1px solid #f0f0f3;
}

.drawer-eyebrow {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: #a0a0a8; display: block; margin-bottom: 4px;
}

.drawer-title {
  margin: 0; font-size: 22px; font-weight: 800; color: #1d1d1f;
}

.close-btn {
  width: 34px; height: 34px;
  background: #f5f5f7; border: none; border-radius: 10px;
  display: grid; place-items: center;
  cursor: pointer; color: #6e6e73;
  transition: background 0.2s;
  flex-shrink: 0;
}

.close-btn:hover { background: #e2e2e7; color: #1d1d1f; }

/* Status banner */
.status-banner {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin: 20px 24px;
  padding: 16px;
  border-radius: 16px;
}

.status-banner.completed { background: #f0fdf4; border: 1px solid #bbf7d0; }
.status-banner.pending   { background: #fefce8; border: 1px solid #fef08a; }

.banner-icon { font-size: 22px; flex-shrink: 0; }

.banner-title {
  margin: 0 0 3px;
  font-size: 14px; font-weight: 700;
  color: #1d1d1f;
}

.banner-sub {
  margin: 0;
  font-size: 13px; color: #6e6e73;
}

/* Section */
.drawer-section { padding: 0 24px 24px; }

.section-label {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: #a0a0a8; margin: 0 0 14px;
}

/* Books */
.books-list { display: flex; flex-direction: column; gap: 10px; }

.book-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  background: #f9f9fb;
  border: 1px solid #e8e8ed;
  border-radius: 14px;
  transition: background 0.15s;
}

.book-item:hover { background: #f0f0fa; }

.book-cover {
  width: 40px; height: 40px; border-radius: 11px;
  display: grid; place-items: center;
  color: white; font-weight: 700; font-size: 14px;
  flex-shrink: 0;
}

.book-info { flex: 1; min-width: 0; }

.book-title {
  margin: 0 0 3px;
  font-size: 14px; font-weight: 600; color: #1d1d1f;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.book-meta { margin: 0; font-size: 12px; color: #86868b; }

.book-sub { font-size: 14px; font-weight: 700; color: #1d1d1f; white-space: nowrap; }

/* Total */
.drawer-total {
  margin: auto 24px 32px;
  background: #f9f9fb;
  border: 1px solid #e8e8ed;
  border-radius: 18px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-row.minor { font-size: 14px; color: #6e6e73; }

.total-row.major { font-size: 16px; font-weight: 700; color: #1d1d1f; }

.free { color: #16a34a; font-weight: 600; }

.divider { height: 1px; background: #e8e8ed; }

.total-value { font-size: 20px; font-weight: 800; color: #4338ca; }

/* Transitions */
.drawer-enter-active { transition: opacity 0.25s ease; }
.drawer-leave-active { transition: opacity 0.22s ease; }
.drawer-enter-from,
.drawer-leave-to     { opacity: 0; }

.drawer-enter-active .drawer { transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1); }
.drawer-leave-active .drawer { transition: transform 0.22s ease; }
.drawer-enter-from   .drawer { transform: translateX(100%); }
.drawer-leave-to     .drawer { transform: translateX(100%); }

/* Mobile bottom sheet */
@media (max-width: 600px) {
  .drawer-backdrop { align-items: flex-end; justify-content: stretch; }

  .drawer {
    max-width: 100%;
    height: 88vh;
    border-radius: 24px 24px 0 0;
    box-shadow: 0 -12px 40px rgba(15,23,42,0.14);
  }

  .drawer-handle { display: block; }

  .drawer-enter-from .drawer,
  .drawer-leave-to   .drawer { transform: translateY(100%); }

  .drawer-enter-active .drawer,
  .drawer-leave-active .drawer { transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1); }
}
</style>
