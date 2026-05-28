<script setup lang="ts">
import { toRef, toRefs, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import SwitchCover from '../assets/SwitchCover.vue';
import NotFound from "../../public/img/Not_found_img.png"

  const props = defineProps(["booksList"]);
  const { booksList: isBooks } = toRefs(props);
  const router = useRouter();
  const isTooggleCover = ref(false);

  const getInitials = (title: string): string => {
    const words = title.split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  function SetToogleCover(value:boolean) {
      isTooggleCover.value = value;
  }


  const goToBook = (id: number) => {
    router.push(`/book/${id}`);
  }
</script>

<template>
      <div
          v-for="book in isBooks"
          :key="book.id"
          class="book-card"
          @click="goToBook(book.id)"
        >
          <div class="price-box">
            <p>€{{ Number(book.prezzo).toFixed(2) }}</p>
          </div>

          <div class="book-cover" :style="{ backgroundColor: book.coverColor }"  v-if="!isTooggleCover">
            <span class="book-initials">{{ getInitials(book.titolo) }}</span>
          </div>

          <div class="book-cover-large" v-if="isTooggleCover">
            <div :style="{ backgroundImage: `url(${book.coverImg})` }" class="book-cover-img"></div>
            <div :style="{ backgroundImage: `url(${NotFound})` }" class="book-cover-img not-found" v-if="book.coverImg === 'Not Found'"></div>
          </div>

          <div class="book-info">
            <h3 class="book-title">{{ book.titolo }}</h3>
            <p class="book-author">{{ book.autore }}</p>
            <span
              :class="['availability-badge', book.disponibile > 0 ? 'available' : 'unavailable']"
            >
              {{ book.disponibile > 0 ? `Disponibile ${book.disponibile}/${book.numCopie}` : 'Esaurito' }}
            </span>
          </div>
        </div>
        <SwitchCover @toogleCover="SetToogleCover" />
</template>

<style scoped>
.book-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.book-cover {
  width: 100%;
  aspect-ratio: 3/4;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-cover-large {
  width: 100%;
  aspect-ratio: 3/4;
  border-radius: 8px;
  margin-bottom: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.book-cover-img {
  position: absolute;
  top: 0;
  width: 100%;
  border-radius: 8px;
  border: 2px solid #e1e1e1;
  aspect-ratio: 3/4;
  background-size: 12px 12px !important;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% !important;
}

.book-cover-img.not-found {
  background-size: cover !important;
  background-position: center;
  background-repeat: no-repeat;
}

.book-initials {
  font-size: 48px;
  font-weight: 300;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.book-title {
  font-size: 18px;
  font-weight: 500;
  color: #1d1d1f;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.2px;
}

.book-author {
  font-size: 14px;
  color: #86868b;
  margin: 0;
  font-weight: 400;
}

.availability-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  align-self: flex-start;
  margin-top: 4px;
}

.availability-badge.available {
  background: #e8f5e9;
  color: #2e7d32;
}

.availability-badge.unavailable {
  background: #ffebee;
  color: #c62828;
}

.price-box{
  width: 70px;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
  background-color: #F2505D;
  display: flex;
  align-items: center;
  font-size: .9em;
  justify-content: center;
  border-radius: 20px;
  margin: 8px;
  padding: 4px;
  font-weight: 800;
  color: #ffff;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
