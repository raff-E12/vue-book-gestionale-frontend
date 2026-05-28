<template>
  <Transition name="modal">
    <div v-if="order" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-card">

        <!-- Header -->
        <div class="modal-header">
          <div>
            <p class="eyebrow">Ordine #{{ order.Id }}</p>
            <h2 class="modal-title">Dettaglio Ordine</h2>
          </div>
          <button class="modal-close" @click="$emit('close')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Acquirente -->
        <div class="modal-section">
          <p class="section-label">Acquirente</p>
          <div class="user-detail-card">
            <div class="user-detail-avatar" :style="{ background: avatarColor(order.User.Name) }">
              {{ initials(order.User.Name) }}
            </div>
            <div class="user-detail-info">
              <div class="user-detail-name">
                {{ order.User.Name }}
                <span v-if="order.User.Verified" class="badge verified">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Verificato
                </span>
              </div>
              <div class="user-detail-meta">
                <span>{{ order.User.Email }}</span>
                <span class="meta-sep">·</span>
                <span class="role-badge" :class="order.User.Role.toLowerCase()">{{ order.User.Role }}</span>
                <span class="meta-sep">·</span>
                <span>ID: {{ order.User.UserID }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Libri -->
        <div class="modal-section">
          <p class="section-label">Libri acquistati ({{ order.BookList.length }})</p>
          <div class="books-list">
            <div
              v-for="book in order.BookList"
              :key="book.Id"
              class="book-row"
            >
              <div class="book-cover-lg" :style="{ background: bookColor(book.BookTitle) }">
                {{ bookInitial(book.BookTitle) }}
              </div>
              <div class="book-detail">
                <span class="book-title">{{ book.BookTitle }}</span>
                <span class="book-meta">Qtà: {{ book.Quanity }} × €{{ book.Price.toFixed(2) }}</span>
              </div>
              <div class="book-subtotal">€{{ book.SubTotal.toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- Riepilogo -->
        <div class="modal-summary">
          <div class="summary-row">
            <span>Stato ordine</span>
            <span class="availability" :class="order.Order ? 'available' : 'unavailable'">
              <span class="status-dot"></span>
              {{ order.Order ? 'Completato' : 'In attesa' }}
            </span>
          </div>
          <div class="summary-row total-row">
            <span>Totale ordine</span>
            <span class="total-price">€{{ order.TotalPrice.toFixed(2) }}</span>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { OrdersList } from '../../stores/OrdersStore'
import { useOrderHelpers } from '../helpers/useOrderHelpers'

defineProps<{
  order: OrdersList | null
}>()

defineEmits<{
  close: []
}>()

const { avatarColor, bookColor, initials, bookInitial } = useOrderHelpers()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal-card {
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 40px 100px rgba(15, 23, 42, 0.18);
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.eyebrow {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6e6e73;
  margin: 0 0 6px;
}

.modal-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
}

.modal-close {
  background: #f5f5f7;
  border: none;
  border-radius: 10px;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #6e6e73;
  transition: background 0.2s;
  flex-shrink: 0;
}

.modal-close:hover { background: #e2e2e7; color: #1d1d1f; }

/* Sections */
.modal-section { margin-bottom: 24px; }

.section-label {
  font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: #86868b; margin: 0 0 12px;
}

/* User detail */
.user-detail-card {
  display: flex; align-items: center; gap: 14px;
  background: #f9f9fb; border: 1px solid #e8e8ed;
  border-radius: 18px; padding: 16px;
}

.user-detail-avatar {
  width: 52px; height: 52px;
  border-radius: 16px;
  display: grid; place-items: center;
  color: white; font-weight: 700; font-size: 16px;
  flex-shrink: 0;
}

.user-detail-name {
  font-size: 16px; font-weight: 700; color: #1d1d1f;
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}

.user-detail-meta {
  display: flex; align-items: center; gap: 6px;
  flex-wrap: wrap; margin-top: 5px;
  font-size: 13px; color: #6e6e73;
}

.meta-sep { color: #c0c0c8; }

.badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600;
  padding: 2px 7px; border-radius: 999px;
}

.badge.verified { background: #e0f2fe; color: #0369a1; }

.role-badge {
  font-size: 12px; font-weight: 600;
  padding: 3px 9px; border-radius: 999px;
  background: #f0f0f5; color: #5f5f6e;
}

.role-badge.admin { background: #fef3c7; color: #92400e; }
.role-badge.user  { background: #ede9fe; color: #5b21b6; }
.role-badge.guest { background: #f0fdf4; color: #166534; }

/* Books list */
.books-list { display: flex; flex-direction: column; gap: 10px; }

.book-row {
  display: flex; align-items: center; gap: 14px;
  background: #f9f9fb; border: 1px solid #e8e8ed;
  border-radius: 16px; padding: 14px 16px;
  transition: background 0.2s;
}

.book-row:hover { background: #f0f0f8; }

.book-cover-lg {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: grid; place-items: center;
  color: white; font-weight: 700; font-size: 16px;
  flex-shrink: 0;
}

.book-detail { flex: 1; display: flex; flex-direction: column; gap: 3px; }

.book-title { font-weight: 600; color: #1d1d1f; font-size: 14px; }

.book-meta { font-size: 13px; color: #86868b; }

.book-subtotal { font-size: 15px; font-weight: 700; color: #1d1d1f; white-space: nowrap; }

/* Summary */
.modal-summary {
  border-top: 1px solid #f0f0f3;
  padding-top: 20px;
  display: flex; flex-direction: column; gap: 12px;
}

.summary-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 15px; color: #6e6e73;
}

.total-row { font-weight: 700; color: #1d1d1f; }

.total-price { font-size: 20px; font-weight: 800; color: #4f46e5; }

.availability {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 999px;
  font-size: 13px; font-weight: 500;
}

.availability.available   { background: #e8f5e9; color: #2e7d32; }
.availability.unavailable { background: #ffebee; color: #c62828; }

.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

/* Transition */
.modal-enter-active,
.modal-leave-active { transition: opacity 0.25s ease; }

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.22s ease;
}

.modal-enter-from,
.modal-leave-to { opacity: 0; }

.modal-enter-from .modal-card {
  transform: scale(0.94) translateY(12px);
  opacity: 0;
}

@media (max-width: 720px) {
  .modal-card { padding: 24px 20px; }
}
</style>
