<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, toRef } from 'vue';
import UseBookStoreApi from '../stores/bookStore';
import { Button, Toast, ConfirmPopup, useToast, useConfirm } from 'primevue';
import { useRoute, useRouter } from 'vue-router';
import { Book } from '../stores/bookStore';
import SelectModifiedBook from '../assets/SelectModifiedBook.vue';
import BookCheckOut from './BookCheckOut.vue';
import OrderStore from '../stores/OrdersStore';
import SwitchCover from '../assets/SwitchCover.vue';
import userStore from '../stores/UserStore';

const props = defineProps(["id", "book"]);
const id = toRef(props, 'id');
const book = toRef(props, 'book');
const store = UseBookStoreApi();
const toast = useToast();
const confirmPopup = useConfirm();
const route = useRouter();
const users = userStore();

const modalOpen = ref(false);
const checkoutOpen = ref(false);
const orderStore = OrderStore();
const isTooggleCover = ref(false);
const isImgCover = computed(() => book.value.coverImg);
const userRole = computed(() => {
  if(users.data.role === "USER") return "Utente";
  if(users.data.role === "EDITOR") return "Gestore";
  if(users.data.role === "ADMIN") return "Amministratore";
});

const getInitials = (title: string): string => {
  const words = title.split(' ');
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

// ─── Gestione Modifica Libro ────────────────────────────────────────────────
const handleDelete = () => {
  confirmPopup.require({
    message: 'Sei sicuro di voler cancellare questo libro?',
    header: 'Conferma Cancellazione',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sì, cancella',
    rejectLabel: 'No, annulla',
    accept: () => {
      store.editDelete(id.value);
      if(userRole.value?.includes('Utente')) route.push('/');
      if(userRole.value?.includes('Amministratore') || userRole.value?.includes('Gestore')) route.push('/books');
      toast.add({ severity: 'success', summary: 'Libro Cancellato', detail: 'Il libro è stato cancellato con successo.', life: 3000 });
    },
    reject: () => {
      toast.add({ severity: "error", summary: 'Cancellazione Annullata', detail: 'Il libro non è stato cancellato.', life: 3000 });
    }
  });
}

// Funzione per gestire la modifica del libro, riceve il libro aggiornato da SelectModifiedBook
const HandleEdit = (book: Book) => {
   console.log("Modifica libro:", book);
   store.EditBook(id.value, book);
   //window.location.reload();
};

function SetToogleCover(value:boolean) {
    isTooggleCover.value = value;
}

function handleCloseModal() {
  modalOpen.value = false
}

function handleOpenModal() {
   modalOpen.value = true
}

const handleOrder = ({ book, quantity, total, length }: { book: Book; quantity: number, total: string, length: number }) => {
    orderStore.addBook(book, quantity, total, length);
};

const handleDeleteForever = () => {
  const id = book.value.id;
  store.DeleteBook(id);
}

</script>

<template>
    <Toast />
    <ConfirmPopup />
    <SelectModifiedBook
      :book="book"
      :visible="modalOpen"
      @close="handleCloseModal"
      @save="HandleEdit"
    />

    <BookCheckOut
      :book="book"
      :visible="checkoutOpen"
      @close="checkoutOpen = false"
      @order="handleOrder"
    />

    <div v-if="book" class="detail-content">
        <div class="book-cover-large" :style="{ backgroundColor: book.coverColor }" v-if="!isTooggleCover">
          <div class="price-box">
            <p>€{{ Number(book.prezzo).toFixed(2) }}</p>
          </div>
          <span class="book-initials-large">{{ getInitials(book.titolo) }}</span>
        </div>

        <div class="book-cover-large" v-if="isTooggleCover">
          <div class="price-box">
            <p>€{{ Number(book.prezzo).toFixed(2) }}</p>
          </div>
          <div :style="{ backgroundImage: `url(${isImgCover})` }" class="book-cover-img"></div>
        </div>

        <div class="book-details">
          <h1 class="detail-title">{{ book.titolo }}</h1>

          <div class="detail-grid">
            <div class="detail-item">
              <label class="detail-label">Autore</label>
              <p class="detail-value">{{ book.autore }}</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">ISBN</label>
              <p class="detail-value">{{ book.isbn }}</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">Anno di Pubblicazione</label>
              <p class="detail-value">{{ book.annoPubblicazione }}</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">Editore</label>
              <p class="detail-value">{{ book.editore }}</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">Categoria</label>
              <p class="detail-value">{{ book.categoria }}</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">Copie Totali</label>
              <p class="detail-value">{{ book.numCopie }}</p>
            </div>

            <div class="detail-item">
              <label class="detail-label">Copie Disponibili</label>
              <p class="detail-value status" :class="book.disponibile > 0 ? 'available' : 'unavailable'">
                {{ book.disponibile }}
              </p>
            </div>

            <div class="detail-item full-width">
              <label class="detail-label">Note</label>
              <p class="detail-value">{{ book.note }}</p>
            </div>
          </div>
        </div>

        <div class="container">
           <div class="btn-container">
             <Button @click="handleDeleteForever" v-if="userRole?.includes('Amministratore')" label="Elimina Definitivamente" variant="outlined" severity="warn" rounded></Button>
             <Button @click="handleDelete" v-if="userRole?.includes('Gestore') || userRole?.includes('Amministratore')" label="Cancella Libro" variant="outlined" severity="danger" rounded></Button>
             <Button @click="handleOpenModal" v-if="userRole?.includes('Gestore') || userRole?.includes('Amministratore')" label="Modifica Libro" variant="outlined" severity="success" rounded></Button>
             <Button @click="checkoutOpen = true" v-if="userRole?.includes('Utente')" label="Compra Libro" variant="outlined" severity="info" rounded></Button>
           </div>
        </div>
      </div>

      <div v-else class="not-found">
        <h2>Libro non trovato</h2>
        <p>Il libro richiesto non esiste nel catalogo.</p>
      </div>

      <SwitchCover @toogle-cover="SetToogleCover" v-if="book.coverImg !== null && book.coverImg !== 'Not Found'" />
</template>

<style scoped>
.detail-content {
  background: white;
  border-radius: 12px;
  padding: 48px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 48px;
  margin-bottom: 32px;
}

.btn-margin{

}

.book-cover-large {
  width: 200px;
  height: 280px;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.book-cover-img {
  position: absolute;
  top: 0;
  width: 200px;
  border-radius: 8px;
  height: 280px;
  background-size: 12px 12px !important;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% !important;
}

.book-initials-large {
  font-size: 64px;
  font-weight: 300;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 3px;
}

.book-details {
  flex: 1;
}

.detail-title {
  font-size: 32px;
  font-weight: 300;
  color: #1d1d1f;
  margin: 0 0 32px 0;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 11px;
  font-weight: 500;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.detail-value {
  font-size: 16px;
  color: #1d1d1f;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

.detail-value.status {
  font-weight: 600;
  font-size: 18px;
}

.detail-value.status.available {
  color: #2e7d32;
}

.detail-value.status.unavailable {
  color: #c62828;
}

.not-found {
  background: white;
  border-radius: 12px;
  padding: 60px 48px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}

.not-found h2 {
  font-size: 28px;
  font-weight: 300;
  color: #1d1d1f;
  margin: 0 0 16px 0;
}

.not-found p {
  font-size: 16px;
  color: #86868b;
  margin: 0;
}

.container {
  max-width: auto;
  width: 120%;
  margin: 0 auto;
  padding: 0 20px;
}

.btn-container {
  display: flex;
  justify-content: center;
  justify-content: start;
  margin-top: 24px;
  gap: 16px;
  width: 190%;
}

.price-box{
  background-color: #c62828;
  position: absolute;
  z-index: 20;
  top: -10px;
  left: -10px;
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #ffff;
  font-size:.90em;
  font-weight: 900;
  font-family: Arial, Helvetica, sans-serif;
}

</style>