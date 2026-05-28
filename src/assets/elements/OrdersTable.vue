<template>
  <div class="table-card">
    <div class="table-scroll">
      <table class="books-table">
        <thead>
          <tr>
            <th>Utente</th>
            <th>Email</th>
            <th>Ruolo</th>
            <th>Libri</th>
            <th>Totale</th>
            <th>Stato</th>
            <th>Dettaglio</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="orders.length">
            <tr
              v-for="order in orders"
              :key="order.Id"
              class="table-row"
              @click="$emit('select', order)"
            >
              <!-- Utente -->
              <td data-label="Utente">
                <div class="user-cell">
                  <div class="avatar-pill" :style="{ background: avatarColor(order.User.Name) }">
                    {{ initials(order.User.Name) }}
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ order.User.Name }}</span>
                    <span v-if="order.User.Verified" class="badge verified">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Verificato
                    </span>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td data-label="Email">
                <span class="email-text">{{ order.User.Email }}</span>
              </td>

              <!-- Ruolo -->
              <td data-label="Ruolo">
                <span class="role-badge" :class="order.User.Role.toLowerCase()">
                  {{ order.User.Role }}
                </span>
              </td>

              <!-- Libri -->
              <td data-label="Libri">
                <div class="books-preview">
                  <span
                    v-for="(book, i) in order.BookList.slice(0, 2)"
                    :key="book.Id"
                    class="cover-pill"
                    :style="{ background: bookColor(book.BookTitle), zIndex: 10 - i, marginLeft: i > 0 ? '-10px' : '0' }"
                  >
                    {{ bookInitial(book.BookTitle) }}
                  </span>
                  <span v-if="order.BookList.length > 2" class="books-more">
                    +{{ order.BookList.length - 2 }}
                  </span>
                </div>
              </td>

              <!-- Totale -->
              <td data-label="Totale">
                <span class="price-text">€{{ order.TotalPrice.toFixed(2) }}</span>
              </td>

              <!-- Stato -->
              <td data-label="Stato">
                <span class="availability" :class="order.Order ? 'available' : 'unavailable'">
                  <span class="status-dot"></span>
                  {{ order.Order ? 'Completato' : 'In attesa' }}
                </span>
              </td>

              <!-- Dettaglio -->
              <td data-label="Dettaglio">
                <button class="detail-btn" @click.stop="$emit('select', order)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Vedi
                </button>
              </td>
            </tr>
          </template>

          <tr v-else class="empty-row">
            <td colspan="7">
              <div class="empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c0c0c8" stroke-width="1.5">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <p>Nessun ordine trovato</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrdersList } from '../../stores/OrdersStore'
import { useOrderHelpers } from '../helpers/useOrderHelpers'

defineProps<{
  orders: OrdersList[]
}>()

defineEmits<{
  select: [order: OrdersList]
}>()

const { avatarColor, bookColor, initials, bookInitial } = useOrderHelpers()
</script>

<style scoped>
.table-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  border: 1px solid #e8e8ed;
  overflow: hidden;
}

.table-scroll { overflow-x: auto; }

.books-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.books-table thead { background: #f5f5f7; }

.books-table th,
.books-table td {
  padding: 18px;
  text-align: left;
  font-size: 15px;
  color: #3a3a3c;
}

.books-table th {
  font-weight: 700;
  color: #5f5f67;
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.table-row {
  border-top: 1px solid #f0f0f3;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.table-row:hover {
  background: #fafafb;
  transform: translateX(2px);
}

/* User cell */
.user-cell { display: flex; align-items: center; gap: 12px; }

.avatar-pill {
  width: 40px; height: 40px;
  border-radius: 12px;
  display: grid; place-items: center;
  color: white; font-weight: 700; font-size: 13px;
  flex-shrink: 0;
}

.user-info { display: flex; flex-direction: column; gap: 4px; }

.user-name { font-weight: 600; color: #1d1d1f; font-size: 14px; }

.badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600;
  padding: 2px 7px; border-radius: 999px;
}

.badge.verified { background: #e0f2fe; color: #0369a1; }

/* Role */
.role-badge {
  font-size: 12px; font-weight: 600;
  padding: 3px 9px; border-radius: 999px;
  background: #f0f0f5; color: #5f5f6e;
}

.role-badge.admin { background: #fef3c7; color: #92400e; }
.role-badge.user  { background: #ede9fe; color: #5b21b6; }
.role-badge.guest { background: #f0fdf4; color: #166534; }

/* Email */
.email-text { color: #6e6e73; font-size: 14px; }

/* Books preview */
.books-preview { display: flex; align-items: center; }

.cover-pill {
  width: 34px; height: 34px;
  border-radius: 10px;
  display: grid; place-items: center;
  color: white; font-weight: 700; font-size: 12px;
  border: 2px solid white;
  position: relative;
}

.books-more { font-size: 12px; font-weight: 600; color: #6e6e73; margin-left: 6px; }

/* Price */
.price-text { font-weight: 700; color: #1d1d1f; font-size: 15px; }

/* Availability */
.availability {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 999px;
  font-size: 13px; font-weight: 500;
}

.availability.available   { background: #e8f5e9; color: #2e7d32; }
.availability.unavailable { background: #ffebee; color: #c62828; }

.status-dot {
  width: 6px; height: 6px;
  border-radius: 50%; background: currentColor;
}

/* Detail button */
.detail-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  background: #f5f5f7; border: 1px solid #e2e2e7;
  border-radius: 10px; font-size: 13px; font-weight: 600;
  color: #3a3a3c; cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
  font-family: inherit;
}

.detail-btn:hover {
  background: #ede9fe; border-color: #c4c0fb;
  color: #4f46e5; transform: scale(1.04);
}

/* Empty */
.empty-row td { text-align: center; }

.empty-state {
  display: flex; flex-direction: column;
  align-items: center; gap: 10px;
  padding: 48px 0; color: #86868b; font-size: 15px;
}

/* Responsive */
@media (max-width: 960px) {
  .books-table th,
  .books-table td { padding: 14px; }
}

@media (max-width: 720px) {
  .books-table { min-width: unset; }

  .books-table thead { display: none; }

  .books-table,
  .books-table tbody,
  .books-table tr,
  .books-table td { display: block; width: 100%; }

  .books-table tr {
    margin-bottom: 18px; border-radius: 18px;
    background: #fff;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
    border-top: none;
  }

  .books-table td {
    padding: 12px 16px;
    border-top: 1px solid #f5f5f7;
  }

  .books-table td:first-child { border-top: none; }

  .books-table td::before {
    content: attr(data-label);
    display: block; font-size: 11px; color: #86868b;
    margin-bottom: 4px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em;
  }

  .table-row:hover { transform: none; }
}
</style>
