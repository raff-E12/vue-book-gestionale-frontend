<template>
  <!-- ─── Dialog Checkout ─────────────────────────────────────────────────── -->
  <Dialog
    :visible="visible"
    :header="`Acquista: ${book?.titolo}`"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="checkout-dialog"
    :style="{ width: '480px', maxWidth: '95vw' }"
    @update:visible="onDialogClose"
  >
    <div v-if="book" class="checkout-body">

      <!-- Copertina + info rapida -->
      <div class="book-summary">
        <div class="cover-mini" :style="{ backgroundColor: book.coverColor }">
          <span class="cover-initials">{{ getInitials(book.titolo) }}</span>
          <div class="price-badge">€{{ Number(book.prezzo).toFixed(2) }}</div>
        </div>
        <div class="book-meta">
          <p class="meta-author">{{ book.autore }}</p>
          <p class="meta-publisher">{{ book.editore }} · {{ book.annoPubblicazione }}</p>
          <span
            class="stock-pill"
            :class="book.disponibile > 0 ? 'in-stock' : 'out-stock'"
          >
            <i :class="book.disponibile > 0 ? 'pi pi-check-circle' : 'pi pi-times-circle'" />
            {{ book.disponibile > 0 ? `${book.disponibile} disponibili` : 'Non disponibile' }}
          </span>
        </div>
      </div>

      <!-- Separatore -->
      <Divider />

      <!-- Quantità -->
      <div class="qty-section">
        <label class="qty-label">Quantità da ordinare</label>
        <div class="qty-controls">
          <Button
            icon="pi pi-minus"
            text
            rounded
            :disabled="quantity <= 1"
            @click="quantity--"
            class="qty-btn"
          />
          <span class="qty-value">{{ quantity }}</span>
          <Button
            icon="pi pi-plus"
            text
            rounded
            :disabled="quantity >= book.disponibile"
            @click="quantity++"
            class="qty-btn"
          />
        </div>
      </div>

      <!-- Totale -->
      <div class="total-row">
        <span class="total-label">Totale</span>
        <span class="total-amount">€{{ (Number(book.prezzo) * quantity).toFixed(2) }}</span>
      </div>

    </div>

    <template #footer>
      <div class="checkout-footer">
        <Button
          label="Annulla"
          icon="pi pi-times"
          text
          @click="onCancel"
          class="cancel-btn"
        />
        <Button
          label="Procedi all'ordine"
          icon="pi pi-shopping-cart"
          :disabled="!book || book.disponibile <= 0"
          @click="onOrder"
          class="order-btn"
        />
      </div>
    </template>
  </Dialog>

  <!-- ─── Popup di Conferma / Errore ──────────────────────────────────────── -->
  <Dialog
    v-model:visible="showConfirm"
    :modal="true"
    :closable="false"
    :draggable="false"
    class="confirm-dialog"
    :style="{ width: '340px' }"
  >
    <div class="confirm-body">

      <!-- Icona animata -->
      <div class="icon-ring" :class="orderSuccess ? 'success-ring' : 'error-ring'">
        <div class="icon-inner" :class="orderSuccess ? 'success-inner' : 'error-inner'">
          <i
            :class="orderSuccess ? 'pi pi-check' : 'pi pi-times'"
            class="confirm-icon"
          />
        </div>
      </div>

      <h3 class="confirm-title">
        {{ orderSuccess ? 'Ordine Confermato!' : 'Ordine Fallito' }}
      </h3>
      <p class="confirm-message">
        <template v-if="orderSuccess">
          Hai ordinato <strong>{{ confirmedQty }}</strong>
          {{ confirmedQty === 1 ? 'copia' : 'copie' }} di
          <em>{{ book?.titolo }}</em> per un totale di
          <strong>€{{ confirmedTotal }}</strong>.
        </template>
        <template v-else>
          {{ errorMessage }}
        </template>
      </p>

      <Button
        label="Chiudi"
        icon="pi pi-times"
        text
        @click="closeConfirm"
        class="close-confirm-btn"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import type { Book } from '../stores/bookStore'
import OrderStore from '../stores/OrdersStore'

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps<{
  book: Book | null
  visible: boolean
}>()

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'order', payload: { book: Book; quantity: number, total: string, length: number }): void
}>()

// ─── State ───────────────────────────────────────────────────────────────────
const quantity      = ref<number>(1)
const showConfirm   = ref<boolean>(false)
const orderSuccess  = ref<boolean>(true)
const confirmedQty   = ref<number>(1)
const confirmedTotal = ref<string>('0.00')
const Orders = OrderStore()
const errorMessage = ref("")

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getInitials(title: string): string {
  const words = title.split(' ')
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

// ─── Handlers ────────────────────────────────────────────────────────────────
function onCancel() {
  reset()
  emit('close')
}

function onDialogClose(val: boolean) {
  if (!val) {
    reset()
    emit('close')
  }
}

function onOrder() {
  const id = props.book?.id;
  const findOrder = Orders.orders.map(element => element.BookId ).includes(id);
  if (!findOrder) {
    if (!props.book) return

    // Salva i dati prima di chiudere il dialog principale
    confirmedQty.value   = quantity.value
    confirmedTotal.value = (Number(props.book.prezzo) * quantity.value).toFixed(2)

    try {
      emit('order', { book: props.book, quantity: quantity.value, total: confirmedTotal.value, length: props.book.numCopie })
      orderSuccess.value = true
    } catch {
      orderSuccess.value = false
      errorMessage.value = " Si è verificato un errore durante l'ordine. Riprova più tardi."
    }

    // Chiude il dialog checkout e apre il popup conferma
    emit('close')
    reset()
    showConfirm.value = true
  } else {
    orderSuccess.value = false
    showConfirm.value = true
    errorMessage.value = "Non è Possibile Ordinare lo stesso Articolo, Seleziona Uno Diverso!!"
    emit('close')
  }
}

function closeConfirm() {
  showConfirm.value = false
}

function reset() {
  quantity.value = 1
}
</script>

<style scoped>
@import 'primeicons/primeicons.css';

/* ── Checkout body ────────────────────────────────────────────────────────── */
.checkout-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0 8px;
}

/* ── Book summary strip ───────────────────────────────────────────────────── */
.book-summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cover-mini {
  position: relative;
  width: 72px;
  height: 100px;
  border-radius: 6px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}

.cover-initials {
  font-size: 22px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 2px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.25);
}

.price-badge {
  position: absolute;
  top: -8px;
  left: -8px;
  background: #c62828;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 900;
  font-family: 'Inter', sans-serif;
  padding: 2px 6px;
  border-radius: 6px;
  z-index: 2;
}

.book-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-author {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  font-family: 'Lora', Georgia, serif;
}

.meta-publisher {
  margin: 0;
  font-size: 0.82rem;
  color: #64748b;
  font-family: 'Inter', sans-serif;
}

.stock-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.76rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  padding: 3px 10px;
  border-radius: 999px;
  width: fit-content;
}

.stock-pill.in-stock {
  background: #dcfce7;
  color: #16a34a;
}

.stock-pill.out-stock {
  background: #fee2e2;
  color: #dc2626;
}

/* ── Quantity controls ────────────────────────────────────────────────────── */
.qty-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.qty-label {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #475569;
  font-family: 'Inter', sans-serif;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 6px 12px;
  width: fit-content;
}

.qty-btn {
  width: 32px !important;
  height: 32px !important;
  color: #2563eb !important;
}

.qty-value {
  min-width: 40px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
}

/* ── Total row ────────────────────────────────────────────────────────────── */
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 12px 16px;
}

.total-label {
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #2563eb;
  font-family: 'Inter', sans-serif;
}

.total-amount {
  font-size: 1.35rem;
  font-weight: 800;
  color: #1d4ed8;
  font-family: 'Inter', sans-serif;
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
.checkout-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  color: #64748b !important;
  font-family: 'Inter', sans-serif;
}

.order-btn {
  background: #2563eb !important;
  border-color: #2563eb !important;
  border-radius: 8px !important;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}

.order-btn:not(:disabled):hover {
  background: #1d4ed8 !important;
}

/* ── Confirm popup ────────────────────────────────────────────────────────── */
.confirm-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 16px 8px;
  text-align: center;
}

/* Cerchio esterno pulsante */
.icon-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ringPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.success-ring {
  background: #dcfce7;
}

.error-ring {
  background: #fee2e2;
}

/* Cerchio interno */
.icon-inner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: innerPop 0.45s 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

.success-inner {
  background: #16a34a;
}

.error-inner {
  background: #dc2626;
}

/* Icona */
.confirm-icon {
  font-size: 1.6rem;
  color: #fff;
  animation: iconFade 0.3s 0.3s ease both;
}

/* Titolo e messaggio */
.confirm-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
}

.confirm-message {
  margin: 0;
  font-size: 0.92rem;
  color: #475569;
  font-family: 'Lora', Georgia, serif;
  line-height: 1.6;
}

.close-confirm-btn {
  color: #64748b !important;
  font-family: 'Inter', sans-serif;
  margin-top: 4px;
}

/* ── Keyframes ────────────────────────────────────────────────────────────── */
@keyframes ringPop {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1); }
}

@keyframes innerPop {
  0%   { transform: scale(0); }
  70%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes iconFade {
  from { opacity: 0; transform: scale(0.5); }
  to   { opacity: 1; transform: scale(1); }
}
</style>