<template>
  <div class="book-detail">
    <div class="container">
      <Toast />
      <ConfirmPopup></ConfirmPopup>
        <!-- Reviews List -->
      <div class="reviews-section">
        <h3 class="reviews-title">
          Recensioni
          <span class="reviews-count" v-if="reviews.length">({{ reviews.length }})</span>
        </h3>

        <div v-if="!reviews.length" class="reviews-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              stroke="#c7c7cc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>Nessuna recensione ancora. Sii il primo!</p>
        </div>

        <ul v-else class="reviews-list">
          <li v-for="review in reviews" :key="review.Id" class="review-card">
            <div class="review-header">
              <div class="review-avatar"><i class="pi pi-user"></i></div>
              <div class="review-meta">
                <span class="review-author">{{ `Commento #${review.Id}` }}</span>
                <span class="review-date" v-if="!userRole?.includes('Gestore') && !userRole?.includes('Amministrazione')">{{ review.User.Name }}</span>
              </div>
              <div class="review-stars">
                <svg
                  v-for="star in 5"
                  :key="star"
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    :fill="star <= review.Vote ? '#FFB800' : 'none'"
                    :stroke="star <= review.Vote ? '#FFB800' : '#d1d1d6'"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            <p class="review-text">{{ review.Description }}</p>
            <div class="review-user" v-if="!userRole?.includes('Gestore') && !userRole?.includes('Amministrazione')">
              <Button @click="confirmDelete($event, review.Id)" icon="pi pi-trash" severity="danger" :disabled="review.User.UserID !== user"></Button>
            </div>
            <div class="review-bg" v-if="!userRole?.includes('Utente') && !userRole?.includes('Gestore')">
              <div class="review-options" v-if="!isState">
                  <Button icon="pi pi-user" severity="info" @click="toggle"></Button>
                  <Button @click="confirmDelete($event, review.Id)" icon="pi pi-trash" severity="danger"></Button>
                  <Popover :ref="(el) => setRef(el, index)">
                      <div class="user-card">
                        <div class="user-avatar">
                          {{ review.User.Name?.charAt(0).toUpperCase() }}
                        </div>
                        <div class="user-info">
                          <span class="user-name">{{ review.User.Name }}</span>
                          <span class="user-verified" :class="review.User.Verified ? 'verified' : 'unverified'">
                            <i :class="review.User.Verified ? 'pi pi-verified' : 'pi pi-times-circle'"></i>
                            {{ review.User.Verified ? 'Verificato' : 'Non verificato' }}
                          </span>
                        </div>
                      </div>
                  </Popover>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Review Form Box -->
      <div class="box-content" v-if="isState">
        <h2 class="section-title">Lascia una recensione</h2>
        <p class="section-subtitle">Condividi il tuo parere su questo libro</p>

        <!-- Star Rating -->
        <div class="rating-section">
          <label class="rating-label">Il tuo voto</label>
          <div class="stars-wrapper">
            <button
              v-for="star in 5"
              :key="star"
              class="star-btn"
              :class="{ active: star <= hovered || star <= rating, hovered: star <= hovered }"
              @mouseenter="hovered = star"
              @mouseleave="hovered = 0"
              @click="rating = star"
              type="button"
              :aria-label="`Vota ${star} stelle`"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  :fill="star <= hovered || star <= rating ? '#FFB800' : 'none'"
                  :stroke="star <= hovered || star <= rating ? '#FFB800' : '#c7c7cc'"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
          <span class="rating-text" v-if="rating > 0">
            {{ ratingLabels[rating - 1] }}
          </span>
          <span class="rating-text placeholder" v-else>Seleziona un voto</span>
        </div>

        <div class="divider" />

        <!-- Text Input -->
        <div class="input-section">
          <label class="input-label" for="review-text">La tua recensione</label>
          <textarea
            id="review-text"
            v-model="reviewText"
            class="review-textarea"
            placeholder="Scrivi qui il tuo commento sul libro..."
            rows="5"
            maxlength="1000"
          />
          <span class="char-count">{{ reviewText.length }} / 1000</span>
        </div>

        <!-- Success Message -->
        <transition name="fade">
          <div v-if="submitted" class="success-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#34C759" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Recensione inviata con successo!
          </div>
        </transition>
      </div>

      <!-- Submit Footer -->
      <div class="action-footer"  v-if="isState">
        <button
          class="return-button"
          :class="{ loading: isLoading, disabled: !canSubmit }"
          :disabled="!canSubmit || isLoading"
          @click="handleSubmit"
        >
          <span v-if="isLoading" class="spinner" />
          <span v-else>
            {{ submitted ? "Invia un'altra recensione" : 'Invia recensione' }}
          </span>
        </button>
        <p v-if="!canSubmit && !submitted" class="hint-text">
          Aggiungi un voto e un commento per continuare
        </p>
      </div>

      <div class="action-footer" v-if="!isState">
        <p class="hint-text">Lista delle Recenzioni.</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import rateStore from '../stores/rateStore'
import userStore from '../stores/UserStore'
import { Button, useConfirm, useToast, ConfirmPopup,Popover } from 'primevue'

const props = defineProps({
  bookId: {
    type: [String, Number],
    required: true
  },
  reviews: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['back', 'review-submitted'])

const rating = ref(0)
const hovered = ref(0)
const reviewText = ref('')
const isLoading = ref(false)
const submitted = ref(false)
const store = rateStore();
const isState = computed(() => {
  return !users.data.role.includes("ADMIN") && !users.data.role.includes("EDITOR");
});
const userRole = computed(() => {
  if(users.data.role === "USER") return "Utente";
  if(users.data.role === "EDITOR") return "Gestore";
  if(users.data.role === "ADMIN") return "Amministratore";
});
const user = computed(() => {
  const store = userStore();
  return store.id;
})
const users = userStore();
const op = ref<any[]>([]);
const confirm = useConfirm();
const ratingLabels = ['Pessimo', 'Scarso', 'Nella media', 'Buono', 'Eccellente']
const toast = useToast();
const canSubmit = computed(() => rating.value > 0 && reviewText.value.trim().length > 0);

async function handleSubmit() {
  if (!canSubmit.value || isLoading.value) return
  isLoading.value = true
  emit('review-submitted', {
    bookId: props.bookId,
    rating: rating.value,
    review: reviewText.value.trim(),
    userid: user.value
  })
  submitted.value = true
  isLoading.value = false
  setTimeout(() => {
    rating.value = 0
    reviewText.value = ''
    submitted.value = false
    store.setFeedBack(false);
  }, 3000)
}

const setRef = (el: any, index: number) => {
  if (el) op.value[index] = el
}

const toggle = (event: MouseEvent, index: number) => {
  console.log(op.value)
    op.value[index]?.toggle(event);
}

const confirmDelete = (event: any, id: number) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Vuoi Procedere al Eliminazione della Recenzione!!',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Annulla',
            severity: 'danger',
            outlined: false
        },
        acceptProps: {
            label: 'Elimina'
        },
        accept: () => {
            store.deleteRate(id);
            const feedback = store.delete;
            if (feedback) {
              toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Eliminazione andata a Buon Fine.', life: 3000 });
            } else {
              toast.add({ severity: 'error', summary: 'Errore', detail: 'Eliminazione non andata a Buon Fine.', life: 3000 });
            }
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Avviso', detail: 'Eliminazione Annullata.', life: 3000 });
        }
    });
};

</script>

<style scoped>
.book-detail {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding: 40px 20px;
}

.review-user{
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
}

.review-options{
  background-color: white;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 10px;
  border: 2px solid #cecece;
  border-radius: 10px;
  margin-top: .2px;
  gap: 5px;
}

/* Popover user card */
.user-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 2px;
  min-width: 200px;
}

.user-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  letter-spacing: 0.5px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.2px;
}

.user-verified {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  font-weight: 500;
  border-radius: 20px;
  padding: 2px 8px;
  width: fit-content;
}

.user-verified.verified {
  background: #dcfce7;
  color: #16a34a;
}

.user-verified.unverified {
  background: #fee2e2;
  color: #dc2626;
}

.user-verified i {
  font-size: 0.75rem;
}

.review-bg{
  width: 100%;
  background-color: rgba(255, 255, 255, 0.79);
  position: absolute;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: end;
  top: 0;
  left: 0;
  height: 100%;
  z-index: -1;
  opacity: 0;
  border-radius: 10px;
  backdrop-filter: blur(2px);
  transform: translateY(-6%);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.review-card{
  position: relative;
}

.review-card:hover .review-bg{
  z-index: 100;
  opacity: 1;
  transform: translateY(0);
}

.container {
  max-width: 700px;
  margin: 0 auto;
}

.box-content {
  background: white;
  border-radius: 12px;
  padding: 48px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-bottom: 10px;
}

.section-title {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 4px;
  text-align: center;
}

.section-subtitle {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #6e6e73;
  margin: 0 0 28px;
  text-align: center;
}

.rating-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.rating-label,
.input-label {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #6e6e73;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stars-wrapper { display: flex; gap: 4px; }

.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.15s ease;
  line-height: 0;
}

.star-btn:hover, .star-btn.active { transform: scale(1.15); }

.rating-text {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #FFB800;
  min-height: 20px;
}

.rating-text.placeholder { color: #c7c7cc; font-weight: 400; }

.divider {
  width: 100%;
  height: 1px;
  background: #f0f0f3;
  margin: 20px 0;
}

.input-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d1d1d6;
  border-radius: 10px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 15px;
  color: #1d1d1f;
  background: #fafafa;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  outline: none;
  line-height: 1.5;
}

.review-textarea::placeholder { color: #aeaeb2; }

.review-textarea:focus {
  border-color: #0070C9;
  background: white;
  box-shadow: 0 0 0 3px rgba(0,112,201,0.12);
}

.char-count {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 12px;
  color: #aeaeb2;
  text-align: right;
}

.success-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0faf3;
  border: 1px solid #34C759;
  border-radius: 8px;
  padding: 12px 18px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1a7a34;
  margin-top: 10px;
  width: 100%;
  box-sizing: border-box;
}

.action-footer {
  text-align: center;
  margin-bottom: 32px;
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
  box-shadow: 0 4px 12px rgba(0,112,201,0.25);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.return-button:hover:not(:disabled) {
  background: #0077D4;
  box-shadow: 0 6px 16px rgba(0,112,201,0.35);
  transform: translateY(-2px);
}

.return-button:active:not(:disabled) { transform: translateY(0); }

.return-button.disabled,
.return-button:disabled {
  background: #b0cfe8;
  box-shadow: none;
  cursor: not-allowed;
}

.hint-text {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #aeaeb2;
  margin-top: 10px;
}

/* ── Reviews list ── */
.reviews-section {
  background: white;
  border-radius: 12px;
  margin-bottom: 30px;
  padding: 32px 40px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.reviews-title {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reviews-count {
  font-size: 14px;
  font-weight: 400;
  color: #6e6e73;
}

.reviews-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 0;
  color: #aeaeb2;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
}

.reviews-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.review-card {
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f3;
  position: relative;
}

.review-card:last-child { border-bottom: none; padding-bottom: 0; }
.review-card:first-child { padding-top: 0; }

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.review-avatar {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  background: #e8f2fb;
  color: #0070C9;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.review-author {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
}

.review-date {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 12px;
  color: #aeaeb2;
}

.review-stars { display: flex; gap: 2px; }

.review-text {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #3a3a3c;
  line-height: 1.6;
  margin: 0;
}

/* Spinner */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .book-detail { padding: 24px 16px; }
  .box-content { padding: 28px 20px; }
  .reviews-section { padding: 24px 20px; }
  .section-title { font-size: 18px; }
  .stars-wrapper { gap: 2px; }
  .return-button {
    width: 100%;
    justify-content: center;
    padding: 16px 24px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .box-content { padding: 20px 16px; }
  .reviews-section { padding: 20px 16px; }
  .review-header { flex-wrap: wrap; }
  .review-stars { order: 3; width: 100%; margin-top: 2px; }
}
</style>