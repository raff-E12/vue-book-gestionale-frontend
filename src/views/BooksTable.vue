<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import UseBookStoreApi from '../stores/bookStore'
import { Book } from '../stores/bookStore'
import Navbar from '../assets/layouts/Navbar.vue'
import userStore from '../stores/UserStore'
import OrderStore from '../stores/OrdersStore'
import rateStore from '../stores/rateStore'
import InputText from 'primevue/inputtext';
import SearchBox from '../assets/layouts/SearchBox.vue'

const router = useRouter()
const store = UseBookStoreApi()
const isSwitch = ref(false);
const isBooks = ref<Book[] | []>([]);
const hasBooks = computed(() => store.books.length > 0);
const user = userStore();
const userFind = computed(() => { return user.getVerify });
const route = useRouter();
const orders = OrderStore();
const isLoading = ref(false);
const rating = rateStore();

const goToBookDetail = (bookId: number) => {
  router.push({ name: 'BookDetail', params: { id: bookId } })
}

const HandleSwitchToogle = () => {
   isSwitch.value = true;
}

const HandleRefreshBookStorage = () => {
   if(userFind.value){
    isLoading.value = true;
    store.$reset();
    isBooks.value = [];
      setTimeout(() => {
        store.setBook();      
        isLoading.value = false;
      }, 1300)
   }
}

const handleSearch = (event: any) => {
   if (isSwitch.value && userFind.value) {
      const newList = store.filtered;
      isBooks.value = newList;
      isSwitch.value = false;
   }
}

onMounted(() => {
  if(userFind.value && (user.data.role.includes("ADMIN") || user.data.role.includes("EDITOR"))){
    store.setBook();
    rating.fetchRates();
    rating.ResetComments();
    orders.getOrdersInfo();
  } else {
    store.$reset();
    rating.$reset();
    orders.ResetOrdersInfo();
  }
})

watchEffect(() => {
  if(userFind.value) isBooks.value = store.books;
});
</script>

<template>
  <Navbar :loading="isLoading" @load="HandleRefreshBookStorage" :load="userFind" />
  <div class="books-table-page">
    <div class="container">
      <div class="page-header">
        <div>
          <p class="eyebrow">Elenco libri</p>
          <h1>Catalogo Completo</h1>
          <p class="intro-text">Clicca su una riga per visualizzare i dettagli del libro e accedere alla pagina dedicata.</p>
        </div>
        <div class="box-search">
           <SearchBox @toogle-switch="HandleSwitchToogle" @search-input="handleSearch" />
        </div>
      </div>

      <div class="table-card">
        <table class="books-table">
          <thead>
            <tr>
              <th>Copertina</th>
              <th>Titolo</th>
              <th>Autore</th>
              <th>Editore</th>
              <th>Categoria</th>
              <th>Disponibilità</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="book in isBooks"
              :key="book.id"
              class="table-row"
              @click="goToBookDetail(book.id)"
            >
              <td>
                <div class="cover-pill" :style="{ backgroundColor: book.coverColor }">
                  {{ book.titolo.substring(0, 2).toUpperCase() }}
                </div>
              </td>
              <td>{{ book.titolo }}</td>
              <td>{{ book.autore }}</td>
              <td>{{ book.editore }}</td>
              <td>{{ book.categoria }}</td>
              <td>
                <span :class="['availability', book.disponibile > 0 ? 'available' : 'unavailable']">
                  {{ book.disponibile > 0 ? `${book.disponibile} disponibili` : 'Esaurito' }}
                </span>
              </td>
            </tr>
            <tr v-if="!hasBooks" class="empty-row">
              <td colspan="6">Nessun libro disponibile al momento.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.books-table-page {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding: 40px 20px;
}

.box-search{
  width: 100%;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 28px;
}

.eyebrow {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6e6e73;
  margin: 0 0 10px;
}

h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 600;
  color: #1d1d1f;
  line-height: 1.1;
}

.intro-text {
  margin: 14px 0 0;
  color: #6e6e73;
  font-size: 15px;
  line-height: 1.8;
  max-width: 740px;
}

.table-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  border: 1px solid #e8e8ed;
  overflow: hidden;
}

.books-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

.books-table thead {
  background: #f5f5f7;
}

.books-table th,
.books-table td {
  padding: 20px 18px;
  text-align: left;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 15px;
  color: #3a3a3c;
}

.books-table th {
  font-weight: 700;
  color: #5f5f67;
  letter-spacing: 0.01em;
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

.cover-pill {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
}

.availability {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
}

.availability.available {
  background: #e8f5e9;
  color: #2e7d32;
}

.availability.unavailable {
  background: #ffebee;
  color: #c62828;
}

.empty-row td {
  text-align: center;
  color: #86868b;
  padding: 32px 0;
}

@media (max-width: 960px) {
  .books-table {
    min-width: unset;
  }

  .books-table th,
  .books-table td {
    padding: 16px 14px;
  }
}

@media (max-width: 720px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .books-table thead {
    display: none;
  }

  .books-table,
  .books-table tbody,
  .books-table tr,
  .books-table td {
    display: block;
    width: 100%;
  }

  .books-table tr {
    margin-bottom: 18px;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
    transform: none;
  }

  .books-table td {
    padding: 14px 18px;
  }

  .books-table td::before {
    content: attr(data-label);
    display: block;
    font-size: 12px;
    color: #86868b;
    margin-bottom: 6px;
    font-weight: 600;
  }

  .books-table td:nth-child(1)::before { content: 'Copertina'; }
  .books-table td:nth-child(2)::before { content: 'Titolo'; }
  .books-table td:nth-child(3)::before { content: 'Autore'; }
  .books-table td:nth-child(4)::before { content: 'Editore'; }
  .books-table td:nth-child(5)::before { content: 'Categoria'; }
  .books-table td:nth-child(6)::before { content: 'Disponibilità'; }
}
</style>