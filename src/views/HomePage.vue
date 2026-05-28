<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import UseBookStoreApi from '../stores/bookStore';
import { Book } from '../stores/bookList';
import BookCard from '../components/BookCard.vue';
import SearchBox from '../assets/layouts/SearchBox.vue';
import Navbar from '../assets/layouts/Navbar.vue';
import OrderStore from '../stores/OrdersStore';
import rateStore from '../stores/rateStore';
import userStore from '../stores/UserStore';
import { Button } from 'primevue';
import { useRoute, useRouter } from 'vue-router';

const store = UseBookStoreApi();
const isSwitch = ref(false);
const isBooks = ref<Book[] | []>([]);
const orders = OrderStore();
const isLoading = ref(false);
const rating = rateStore();
const user = userStore();
const userFind = computed(() => { return user.getVerify });
const route = useRouter();

const handleSearch = (event: any) => {
   if (isSwitch.value && userFind.value) {
      const newList = store.filtered;
      isBooks.value = newList;
      isSwitch.value = false;
   }
}

const HandleSwitchToogle = () => {
   isSwitch.value = true;
}

const HandleRefreshBookStorage = () => {
   if(userFind.value){
    isLoading.value = true;
    store.$reset();
    setTimeout(() => {
      store.setBook();
      isLoading.value = false;
    }, 1300)
   }
}

onMounted(() => {
  if(userFind.value && user.data.role.includes("USER")){
    store.setBook();
    rating.fetchRates();
    rating.ResetComments();
  } else {
    store.$reset();
    rating.$reset();
  }
})

watchEffect(() => {
  if(userFind.value) isBooks.value = store.books;
});

</script>

<template>
  <div class="homepage">
    <Navbar :loading="isLoading" @load="HandleRefreshBookStorage" :load="userFind" />
    
    <div class="container" v-if="userFind">
       <SearchBox
        @toogle-switch="HandleSwitchToogle"
        @search-input="handleSearch"
       />
      <section class="books-grid">
        <BookCard :books-list="isBooks" />
        <div v-if="isBooks.length === 0 && !isLoading" class="no-results">
          <p>Nessun libro trovato</p>
        </div>
        <div v-if="isLoading" class="no-results">
          <p>Caricamento...</p>
        </div>
      </section>
    </div>

    <div class="container">
        <section :class="['box-access', {'animation-open': !userFind}]" v-show="!userFind">
            <div class="icon-circle">
              <i class="pi pi-exclamation-circle"></i>
            </div>
            <div class="title-access">
              <h2>Devi Accedere al Portale per Proseguire</h2>
              <span>Per Accedere al tuo Account ti Devi Registrare</span>
            </div>
            <Button label="Vai al Portale di Accesso" severity="info" :style="{ 'margin-top': '30px' }" @click="() => route.push({ path:'/login' })" />
        </section>
    </div>
  </div>
</template>

<style scoped>
.homepage {
  min-height: 100vh;
  background-color: #f5f5f7;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #86868b;
  font-size: 18px;
}

.box-access{
  background-color: #ffffff;
  border:2px solid #eaeaea;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 12px;
  flex-direction: column;
  font-family: Arial, Helvetica, sans-serif;
  opacity: 0;
  transform: translateY(-120) scale(0);
}

.title-access{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex-direction: column;
}

.icon-circle{
  background-color: #86868b;
  padding: 20px;
  color:#ffffff;
  border-radius: 100px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.animation-open{
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
    transform: translateY(0) scale(1);
    opacity: 1;
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .search-section {
    padding: 24px;
  }

  .search-input-wrapper {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }
}

@media (min-width: 1024px) {
  .books-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
