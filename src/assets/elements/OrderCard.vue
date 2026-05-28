<template>
  <div class="order-card" @click="$emit('open', order)">
    <!-- Top row -->
    <div class="card-top">
      <div class="order-id-block">
        <span class="order-label">Ordine</span>
        <span class="order-id">#{{ order.Id }}</span>
      </div>
      <span class="status-chip" :class="order.Order ? 'completed' : 'pending'">
        <span class="chip-dot" />
        {{ order.Order ? 'Completato' : 'In attesa' }}
      </span>
    </div>

    <!-- Books preview strip -->
    <div class="books-strip">
      <div
        v-for="(book, i) in order.BookList.slice(0, 3)"
        :key="book.Id"
        class="book-chip"
        :style="{ background: bookColor(book.BookTitle), zIndex: 10 - i }"
        :title="book.BookTitle"
      >
        {{ bookInitial(book.BookTitle) }}
      </div>
      <div v-if="order.BookList.length > 3" class="book-chip more">
        +{{ order.BookList.length - 3 }}
      </div>
      <div class="books-names">
        <span v-for="book in order.BookList.slice(0, 2)" :key="book.Id" class="book-name-pill">
          {{ book.BookTitle }}
        </span>
        <span v-if="order.BookList.length > 2" class="book-name-pill muted">
          +{{ order.BookList.length - 2 }} altri
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <div class="footer-left">
        <span class="footer-label">{{ order.BookList.length }} {{ order.BookList.length === 1 ? 'libro' : 'libri' }}</span>
      </div>
      <div class="price-tag">
        <span class="price-amount">€{{ order.TotalPrice.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Hover arrow -->
    <div class="card-arrow">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrdersList } from '../types/my-orders.types'

defineProps<{
  order: OrdersList
}>()

defineEmits<{
  open: [order: OrdersList]
}>()

const PALETTE = [
  '#6366f1','#0ea5e9','#10b981','#f59e0b',
  '#ef4444','#8b5cf6','#ec4899','#14b8a6',
]

function hash(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0
  return Math.abs(h)
}

const bookColor   = (t: string) => PALETTE[hash(t) % PALETTE.length]
const bookInitial = (t: string) => t[0]?.toUpperCase() ?? '?'
</script>

<style scoped>
.order-card {
  position: relative;
  background: #fff;
  border: 1.5px solid #e8e8ed;
  border-radius: 22px;
  padding: 22px;
  cursor: pointer;
  transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.order-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99,102,241,0.04) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.25s;
  pointer-events: none;
}

.order-card:hover {
  box-shadow: 0 16px 48px rgba(99, 102, 241, 0.14);
  transform: translateY(-3px);
  border-color: #c4c0fb;
}

.order-card:hover::before { opacity: 1; }

/* Top */
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.order-id-block {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.order-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a0a0a8;
}

.order-id {
  font-size: 18px;
  font-weight: 800;
  color: #1d1d1f;
  letter-spacing: -0.3px;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-chip.completed { background: #dcfce7; color: #16a34a; }
.status-chip.pending   { background: #fef9c3; color: #a16207; }

.chip-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Books strip */
.books-strip {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  min-height: 38px;
}

.book-chip {
  width: 38px; height: 38px;
  border-radius: 12px;
  display: grid; place-items: center;
  color: white; font-weight: 700; font-size: 13px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.book-chip.more {
  background: #f0f0f5;
  color: #6e6e73;
  font-size: 11px;
  box-shadow: none;
  border: 1.5px dashed #d0d0d8;
}

.books-names {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
}

.book-name-pill {
  font-size: 12px;
  font-weight: 500;
  color: #3a3a3c;
  background: #f5f5f7;
  padding: 3px 9px;
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.book-name-pill.muted { color: #86868b; }

/* Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid #f0f0f3;
}

.footer-label {
  font-size: 13px;
  color: #86868b;
  font-weight: 500;
}

.price-tag {
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  border-radius: 10px;
  padding: 5px 12px;
}

.price-amount {
  font-size: 16px;
  font-weight: 800;
  color: #4338ca;
  letter-spacing: -0.3px;
}

/* Arrow */
.card-arrow {
  position: absolute;
  bottom: 20px; right: 20px;
  width: 32px; height: 32px;
  border-radius: 10px;
  background: #f0f0f5;
  display: grid; place-items: center;
  color: #a0a0a8;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s, transform 0.2s, background 0.2s;
}

.order-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
  background: #4f46e5;
  color: white;
}
</style>
