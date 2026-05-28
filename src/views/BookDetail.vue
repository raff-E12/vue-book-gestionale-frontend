<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookDetail from '../components/BookDetails.vue'
import UseBookStoreApi from '../stores/bookStore';
import ProgressSpinner from 'primevue/progressspinner';
import BookReview from '../components/BookReview.vue';
import rateStore from '../stores/rateStore';
import userStore from '../stores/UserStore';

const route = useRoute();
const router = useRouter();
const store = UseBookStoreApi();
const rating = rateStore();
const bookId = computed(() => parseInt(route.params.id as string));
const book = computed(() => store.find);
const comments = computed(() => rating.comments);
const users = userStore();
const goBack = () => {
  if(users.data.role.includes("ADMIN") || users.data.role.includes("EDITOR")) router.push('/books');
  else { router.push('/') };
}

const userRole = computed(() => {
  if(users.data.role === "USER") return "Utente";
  if(users.data.role === "EDITOR") return "Gestore";
  if(users.data.role === "ADMIN") return "Amministratore";
});

const isLoading = ref(false);

onBeforeMount(() => {
  isLoading.value = true;
  store.IdFindBook(bookId.value);
  rating.fetchCommentsBook(bookId.value);
})

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
})

const getRating = (Rating: { id: number, rating: number, review: string, userid: number }) => {
  try {
    const newRate = {
      BookId: bookId.value,
      Description: Rating.review,
      Rating: Rating.rating,
      UserId: Rating.userid
    }
    rating.createRate(newRate);
  } catch (error) {
    console.error("Errore nel recupero del rating:", error);
  }
}
</script>

<template>
  <div class="book-detail">
    <div class="container">
      <button class="back-button" @click="goBack">
        ← Homepage
      </button>

      <div class="box-content" v-if="isLoading">
        <h4 class="text-loading">Caricamento...</h4>
        <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="8" fill="transparent" animationDuration=".5s" />
      </div>

      <div class="w-auto" v-if="!isLoading">
        <BookDetail :id="bookId" :book="book" />
        <BookReview v-if="userRole?.includes('Utente') || userRole?.includes('Amministratore')" :reviews="comments" :bookId="bookId" @review-submitted="getRating"/>
      </div>

      <!-- <div class="action-footer">
        <button class="return-button" @click="goBack">
          Torna alla Homepage
        </button>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.book-detail {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding: 40px 20px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.box-content {
  background: white;
  border-radius: 12px;
  padding: 48px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  flex-direction: column;
  margin-bottom: 10px;
}

.text-loading{
  font-weight: 900;
  color: #5c5c5d;
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
  margin-bottom: 32px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background: #f5f5f7;
  border-color: #0070C9;
}


.action-footer {
  text-align: center;
}

.return-button {
  padding: 16px 48px;
  background: #0070C9;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(0, 112, 201, 0.25);
}

.return-button:hover {
  background: #0077D4;
  box-shadow: 0 6px 16px rgba(0, 112, 201, 0.35);
  transform: translateY(-2px);
}

.return-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .detail-content {
    grid-template-columns: 1fr;
    padding: 32px 24px;
    gap: 32px;
    justify-items: center;
  }

  .book-cover-large {
    width: 180px;
    height: 252px;
  }

  .book-initials-large {
    font-size: 56px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-title {
    font-size: 26px;
    text-align: center;
  }

  .book-details {
    width: 100%;
  }
}
</style>
