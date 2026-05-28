<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Toast, useToast } from 'primevue'
import LogoutCard from '../components/LogoutCard.vue'
import LogoutResult from '../components/LogoutResult.vue'
import userStore from '../stores/UserStore'

const router = useRouter()
const toast = useToast()
const user = userStore()
const isLoggingOut = ref(false)
const logoutComplete = ref(false)
const logoutMessage = ref('Il logout è stato eseguito con successo. Reindirizzamento in corso...')

const confirmLogout = () => {
  isLoggingOut.value = true

  setTimeout(() => {
    user.$reset()
    sessionStorage.clear()

    toast.add({
      severity: 'success',
      summary: 'Logout effettuato',
      detail: 'Sei stato disconnesso correttamente.',
      life: 2600,
    })

    logoutComplete.value = true
    isLoggingOut.value = false

    setTimeout(() => {
      router.push('/')
    }, 1600)
  }, 650)
}
</script>

<template>
  <div class="logout-page">
    <Toast />
    <div class="logout-shell">
      <transition name="fade-scale" mode="out-in">
        <LogoutCard
          v-if="!logoutComplete"
          :loading="isLoggingOut"
          @confirm="confirmLogout"
          key="logout-card"
        />
        <LogoutResult
          v-else
          :message="logoutMessage"
          key="logout-result"
        />
      </transition>
    </div>
  </div>
</template>

<style scoped>
.logout-page {
  min-height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  padding: 40px 20px;
  background-color: #f5f5f7;
}

.logout-shell {
  width: 100%;
  display: grid;
  place-items: center;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.97);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>