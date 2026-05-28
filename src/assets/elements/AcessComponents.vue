<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import userStore from '../../stores/UserStore';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const emit = defineEmits<{
  (e: 'show', payload: 'Register'): void
}>()

const SetShow = () => {
    emit("show", 'Register')
};

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const success = ref(false);
const userStores = userStore();

const route = useRouter();

async function handleLogin() {
  try {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields.'
    return
  }

  loading.value = true

  const form = {
    email: email.value,
    password: password.value,
  };

  const fetch = await userStores.getAccess(form);
  const feed = userStores.feedback.login;

  if(feed){
    success.value = true;
    setTimeout(() => { loading.value = false; }, 1300);
    setTimeout(() => {
      if(userStores.data.role.includes("ADMIN") || userStores.data.role.includes("EDITOR")) route.push('/books');
      else { route.push('/'); }
    }, 1500)
  }

  } catch (error) {
    console.log(error)
    error.value = (error as Error).message;
  }
}

watch(() => userStores.feedback.access, (newFeed) => {
    if (newFeed) {
      loading.value = false;
      success.value = false;
      error.value = "Email o Password non corrispondo!!";
    }
    setTimeout(() => { 
      userStores.ResetFeedBackErrors()
      error.value = "";
      email.value = "";
      password.value = "";
    }, 1200);
}, { immediate: true })
</script>

<template>
    <section class="box-card">
      <Toast />

        <div class="glass-card">
            <div class="brand">
               <i class="pi pi-book"></i>
            </div>

            <h1 class="title">Accedi al tuo account</h1>
            <p class="subtitle">Benvenuto Nella Piattaforma.</p>

            <form @submit.prevent="handleLogin" novalidate>
                <div class="field-group">
                <div class="field">
                    <label for="email">Indirizzo Email</label>
                    <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autocomplete="email"
                    v-model="email"
                    />
                </div>

                <div class="field">
                    <label for="password">Password</label>
                    <input
                    id="password"
                    type="password"
                    placeholder="password1290"
                    autocomplete="current-password"
                    v-model="password"
                    />
                </div>
                </div>

                <transition name="err">
                <p v-if="error" class="error-msg">{{ error }}</p>
                </transition>

                <button type="submit" class="submit-btn">
                    <span class="spinner" v-if="loading" />
                    <span class="checkmark" v-if="success">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </span>
                    <span v-else>Accedi</span>
                </button>
            </form>

            <div class="divider"><span>Sei nuovo qui?</span></div>
            <p class="switch-link" @click="SetShow">Crea un account</p>
            <p class="switch-link" @click="() => route.push('/')" :style="{ marginTop: '20px' }">Vai Alla Homepage</p>
        </div>
    </section>
</template>

<style scoped>

.box-card{
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    z-index: 100;
}

.glass-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 20px;
  padding: 3rem 2.5rem 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 32px 64px rgba(0, 0, 0, 0.06);
}

.brand {
  display: flex;
  justify-content: center;
  margin-bottom: 1.75rem;
}

.apple-icon {
  width: 42px;
  height: 42px;
  color: #1d1d1f;
}

.title {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1d1d1f;
  text-align: center;
  letter-spacing: -0.025em;
  line-height: 1.2;
  margin: 0 0 0.4rem;
}

.subtitle {
  text-align: center;
  color: #6e6e73;
  font-size: 0.9375rem;
  margin: 0 0 2rem;
  font-weight: 400;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  overflow: hidden;
  margin-bottom: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  position: relative;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  transition: background 0.15s;
}

.field:last-child {
  border-bottom: none;
}

.field label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6e6e73;
  padding: 0.625rem 1rem 0;
  letter-spacing: 0.01em;
}

.field input {
  border: none;
  outline: none;
  padding: 0.3rem 1rem 0.625rem;
  font-size: 1rem;
  color: #1d1d1f;
  background: transparent;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  transition: background 0.15s;
}

.field input::placeholder {
  color: #aeaeb2;
}

.field:focus-within {
  background: #f0f4ff;
}

.field input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-msg {
  color: #ff3b30;
  font-size: 0.8125rem;
  text-align: center;
  margin: 0 0 1rem;
  font-weight: 400;
}

.err-enter-active,
.err-leave-active {
  transition: all 0.25s ease;
}
.err-enter-from,
.err-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.submit-btn {
  width: 100%;
  padding: 0.875rem;
  background: #0071e3;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s ease, transform 0.15s ease, opacity 0.2s;
  letter-spacing: -0.01em;
  min-height: 52px;
}

.submit-btn:hover:not(:disabled) {
  background: #0077ed;
  transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  background: #006acf;
}

.submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.checkmark svg {
  width: 22px;
  height: 22px;
}

@keyframes pop {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.25rem 0 0.75rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
}

.divider span {
  font-size: 0.75rem;
  color: #aeaeb2;
  white-space: nowrap;
}

.switch-link {
  text-align: center;
  margin: 0;
  cursor: pointer;
  font-size: 0.875rem;
}

.switch-link{
  text-decoration: none;
  font-weight: 500;
}

.switch-link:hover {
  color: #0071e3;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-bg {
    padding: 1rem;
    align-items: flex-start;
    padding-top: 3rem;
  }
  .glass-card {
    padding: 2.5rem 1.5rem 2rem;
  }
}
</style>