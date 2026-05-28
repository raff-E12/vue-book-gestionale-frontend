<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import userStore from '../../stores/UserStore';

const emit = defineEmits<{
  (e: 'show', payload: 'Login'): void
}>()

const SetShow = () => emit("show", 'Login')

const step = ref<'register' | 'role' | 'done'>('register')
const transitioning = ref(false)

function goTo(next: typeof step.value) {
  transitioning.value = true
  setTimeout(() => {
    step.value = next
    transitioning.value = false
  }, 380)
}

const email    = ref('');
const password = ref('');
const error    = ref('');
const loading  = ref(false);
const success  = ref(false);
const fullname = ref('');
const userStores = userStore();
const loadingRole  = ref(false);
const successRole  = ref(false);

const route = useRouter()

async function handleRegister() {
  error.value = ''
  if (!fullname.value || !email.value || !password.value) {
    error.value = 'Completa tutti i campi.'
    return
  }
  if (password.value.length < 8) {
    error.value = 'La password deve essere lunga almeno 8 caratteri.'
    return
  }

  loading.value = true

  setTimeout(() => { 
    loading.value = false
    success.value = true
  }, 1500);

  setTimeout(() => goTo('role'), 1700)
}

const roles = [
  { id: 'USER',   label: 'Utente',    icon: 'pi-user', desc: 'Esplora i diversi prodotti in vetrina' },
  { id: 'EDITOR',    label: 'Gestore Generale',  icon: 'pi-user-edit',  desc: 'Gestione dei diversi prodotti' },
  { id: 'ADMIN',    label: 'Amministratore Generale',  icon: 'pi-wrench', desc: 'Amministrazione del Portale' },
]
const selectedRole = ref<string | null>(null)
const roleError    = ref('')

function selectRole(id: string) {
  selectedRole.value = id;
  roleError.value = '';
}


function OperationForm() {

    loadingRole.value = true;

    const forms = {
      fullname: fullname.value,
      email: email.value,
      password: password.value,
      // ensure role is always a string to satisfy ResponseRegister type
      role: selectedRole.value || '',
      verified: false
    }

    // call register action (no unused variable)
    userStores.getRegister(forms);
    const feedback = userStores.feedback.created;

    if(feedback){
      setTimeout(() => {
        successRole.value = true;
        loadingRole.value = false;
        goTo('done')
        userStores.ResetFeedBackErrors()
      }, 600);
    } else {
      const ops = userStores.feedback.operations;
      const error = userStores.feedback.errors;

      if(ops) roleError.value = "Utente gia esistente, Accedi Manualemente!!";
      if(error) roleError.value = "Errore di Registrazione, Riprova!!";

      setInterval(() => {
        userStores.ResetFeedBackErrors()
        successRole.value = false;
        loadingRole.value = false;
        roleError.value = "";
        ResetStep();
       }, 1300);
    }

}

const ResetStep = () => {
    setTimeout(() => {
      step.value = 'register';
      loading.value = false;
      success.value = false;
      loadingRole.value = false;
      successRole.value = false;
      email.value = "";
      password.value = "";
      fullname.value = "";
      error.value = "";
      error.value = "";
      selectedRole.value = "";
      roleError.value = "";
    }, 1300);
}

function confirmRole() {
  if (!selectedRole.value) {
    roleError.value = 'Seleziona un ruolo per continuare.'
    return
  }
  OperationForm();
}

const skip = () => {
    setTimeout(() => {
      goTo('done')
      setTimeout(() => route.push('/'), 1200)
    }, 1000);
}

watchEffect(() => {
  if(step.value === "done") skip()
});

const stepIndex = computed(() => ({ register: 0, role: 1, done: 2 }[step.value]));
</script>

<template>
  <section class="box-form">
    <div class="glass-card" :class="{ 'is-transitioning': transitioning }">

      <!-- ── Progress dots ── -->
      <div class="progress-dots" v-if="step !== 'done'">
        <span
          v-for="i in 3"
          :key="i"
          class="dot"
          :class="{ active: stepIndex >= i - 1, completed: stepIndex > i - 1 }"
        />
      </div>

      <!-- ════════════════════════════════════════════
           STEP 1 — REGISTRAZIONE
      ════════════════════════════════════════════ -->
      <Transition name="slide" mode="out-in">
        <div v-if="step === 'register'" key="register">
          <div class="brand"><i class="pi pi-book"></i></div>
          <h1 class="title">Crea il tuo account</h1>
          <p class="subtitle">Registrati per iniziare.</p>

          <form @submit.prevent="handleRegister" novalidate>
            <div class="field-group">
              <div class="field">
                <label for="fullName">Nome Completo</label>
                <input id="fullName" type="text" placeholder="John Appleseed"
                  autocomplete="name" v-model="fullname" />
              </div>
              <div class="field">
                <label for="email">Indirizzo Email</label>
                <input id="email" type="email" placeholder="you@example.com"
                  autocomplete="email" v-model="email" />
              </div>
              <div class="field">
                <label for="password">Password</label>
                <input id="password" type="password" placeholder="8+ caratteri"
                  autocomplete="new-password" v-model="password" />
              </div>
            </div>

            <Transition name="err">
              <p v-if="error" class="error-msg">{{ error }}</p>
            </Transition>

            <button type="submit" class="submit-btn" :disabled="loading || success">
              <span v-if="loading" class="spinner" />
              <span v-else-if="success" class="checkmark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span v-else>Crea Account</span>
            </button>
          </form>

          <div class="divider"><span>Hai già un account?</span></div>
          <p class="signin-link" @click="SetShow">Accedi</p>
          <p class="signin-link" @click="() => route.push('/')" :style="{ marginTop: '20px' }">Vai Alla Homepage</p>
        </div>
      </Transition>

      <!-- ════════════════════════════════════════════
           STEP 2 — SELEZIONE RUOLO
      ════════════════════════════════════════════ -->
      <Transition name="slide" mode="out-in">
        <div v-if="step === 'role'" key="role">
          <div class="step-header">
            <div class="step-icon"><i class="pi pi-user"></i></div>
            <h1 class="title">Chi sei?</h1>
            <p class="subtitle">Scegli il ruolo che ti descrive meglio.</p>
          </div>

          <div class="role-grid">
            <button
              v-for="(r, idx) in roles"
              :key="r.id"
              class="role-card"
              :class="{ selected: selectedRole === r.id }"
              :style="{ '--delay': idx * 80 + 'ms' }"
              @click="selectRole(r.id)"
            >
              <span class="role-icon"><i :class="`pi ${r.icon}`"></i></span>
              <span class="role-label">{{ r.label }}</span>
              <span class="role-desc">{{ r.desc }}</span>
              <span class="role-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </button>
          </div>

          <Transition name="err">
            <p v-if="roleError" class="error-msg">{{ roleError }}</p>
          </Transition>

          <button class="submit-btn" @click="confirmRole" :disabled="loadingRole || successRole">
              <span v-if="loadingRole" class="spinner" />
              <span v-else-if="successRole" class="checkmark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span v-else>Continua</span>
          </button>
        </div>
      </Transition>

      <!-- ════════════════════════════════════════════
           STEP 4 — DONE
      ════════════════════════════════════════════ -->
      <Transition name="pop" mode="out-in">
        <div v-if="step === 'done'" key="done" class="done-screen">
          <div class="done-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 class="title" style="margin-top:1.5rem;">Bentornato!</h1>
          <p class="subtitle" v-if="!loading">Stai per essere reindirizzato…</p>
          <div class="loading-bar" v-if="!loading"><div class="loading-fill" /></div>
        </div>
      </Transition>

    </div>
  </section>
</template>

<style scoped>

/* ─────────────────────────────────────────
   Layout
───────────────────────────────────────── */
.box-form {
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
  padding: 3rem 3.5rem 3.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 32px 64px rgba(0, 0, 0, 0.06);
  transition: opacity 0.3s ease;
}

.glass-card.is-transitioning {
  opacity: 0.5;
  pointer-events: none;
}

/* ─────────────────────────────────────────
   Progress dots
───────────────────────────────────────── */
.progress-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.12);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dot.active {
  background: #0071e3;
  transform: scale(1.25);
}

.dot.completed {
  background: #34c759;
  transform: scale(1);
}

/* ─────────────────────────────────────────
   Step header
───────────────────────────────────────── */
.step-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.step-icon {
  font-size: 2.25rem;
  margin-bottom: 0.75rem;
  animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* ─────────────────────────────────────────
   Typography (unchanged from original)
───────────────────────────────────────── */
.brand {
  display: flex;
  justify-content: center;
  margin-bottom: 1.75rem;
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

/* ─────────────────────────────────────────
   Fields (unchanged from original)
───────────────────────────────────────── */
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

.field:last-child { border-bottom: none; }

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
}

.field input::placeholder { color: #aeaeb2; }
.field:focus-within { background: #f0f4ff; }

.feedback-textarea {
  border: none;
  outline: none;
  padding: 0.3rem 1rem 0.625rem;
  font-size: 0.9375rem;
  color: #1d1d1f;
  background: transparent;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  resize: none;
  line-height: 1.5;
}

.feedback-textarea::placeholder { color: #aeaeb2; }

/* ─────────────────────────────────────────
   Role grid
───────────────────────────────────────── */
.role-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
}

.role-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 1rem 0.75rem;
  border-radius: 14px;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  cursor: pointer;
  font-family: inherit;
  position: relative;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease;
  animation: card-in 0.4s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  animation-delay: var(--delay, 0ms);
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0)  scale(1); }
}

.role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 113, 227, 0.12);
  border-color: rgba(0, 113, 227, 0.3);
}

.role-card.selected {
  border-color: #0071e3;
  background: #f0f6ff;
  box-shadow: 0 4px 16px rgba(0, 113, 227, 0.15);
}

.role-icon  { font-size: 1.75rem; }
.role-label { font-size: 0.875rem; font-weight: 600; color: #1d1d1f; }
.role-desc  { font-size: 0.7rem;   color: #6e6e73; }

.role-check {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0071e3;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.2s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.role-card.selected .role-check {
  opacity: 1;
  transform: scale(1);
}

.role-check svg {
  width: 10px;
  height: 10px;
  stroke: white;
}

/* ─────────────────────────────────────────
   Star rating
───────────────────────────────────────── */
.star-row {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #d1d1d6;
  transition: color 0.15s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 0 0.1rem;
  line-height: 1;
}

.star-btn:hover,
.star-btn.lit {
  color: #ff9500;
}

.star-btn:hover {
  transform: scale(1.2);
}

.star-btn.lit {
  animation: star-pop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes star-pop {
  from { transform: scale(0.7); }
  to   { transform: scale(1); }
}

/* ─────────────────────────────────────────
   Done screen
───────────────────────────────────────── */
.done-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 0;
}

.done-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #34c759;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  box-shadow: 0 8px 24px rgba(52, 199, 89, 0.35);
}

.done-circle svg {
  width: 34px;
  height: 34px;
  stroke: white;
}

@keyframes pop-in {
  from { transform: scale(0.4); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.loading-bar {
  width: 100%;
  height: 3px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 99px;
  overflow: hidden;
  margin-top: 2rem;
}

.loading-fill {
  height: 100%;
  width: 0%;
  background: #0071e3;
  border-radius: 99px;
  animation: fill-bar 1.1s ease forwards;
}

@keyframes fill-bar {
  to { width: 100%; }
}

/* ─────────────────────────────────────────
   Submit button (unchanged from original)
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   Spinner / checkmark
───────────────────────────────────────── */
.spinner {
  width: 20px; height: 20px;
  border: 2.5px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.checkmark svg { width: 22px; height: 22px; }

@keyframes pop {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* ─────────────────────────────────────────
   Misc
───────────────────────────────────────── */
.error-msg {
  color: #ff3b30;
  font-size: 0.8125rem;
  text-align: center;
  margin: 0 0 1rem;
}

.err-enter-active, .err-leave-active { transition: all 0.25s ease; }
.err-enter-from, .err-leave-to { opacity: 0; transform: translateY(-4px); }

.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.25rem 0 0.75rem;
}

.divider::before, .divider::after {
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

.signin-link {
  text-align: center;
  margin: 0;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6e6e73;
}

.signin-link:hover {
  color: #0071e3;
  text-decoration: underline;
}

/* ─────────────────────────────────────────
   Slide transition (between steps)
───────────────────────────────────────── */
.slide-enter-active {
  transition: all 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-leave-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 1, 1);
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

/* Done screen pop */
.pop-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

/* ─────────────────────────────────────────
   Responsive
───────────────────────────────────────── */
@media (max-width: 480px) {
  .glass-card { padding: 2.5rem 1.5rem 2rem; }
  .role-grid  { grid-template-columns: 1fr 1fr; gap: 0.5rem; }
}
</style>
