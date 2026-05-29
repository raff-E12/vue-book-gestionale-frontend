<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import AcessComponents from '../assets/elements/AcessComponents.vue'
import RegisterComponents from '../assets/elements/RegisterComponents.vue'
import userStore from '../stores/UserStore.ts'

const router = useRouter()
const isShow = ref(false);
const isAnimated = ref(false);
const user = userStore();

const register = computed(() => user.feedback.created);
const login = computed(() => user.feedback.access);
const role = computed(() => user.data.role);

const SetShow = (val: string) => {
  if (val === 'Login') {
    isShow.value = true
    requestAnimationFrame(() => {
      isAnimated.value = true
    })
  } else {
    isShow.value = false
    setTimeout(() => {
        isAnimated.value = false 
    }, 60)
  }
};

watchEffect(() => {
  if(login.value || register.value) window.alert("Sei Gia Loggato!!");
  setTimeout(() => {
    if(login.value || register.value) return;
    if(role.value.includes("USER")) router.push("/")
    if(role.value.includes("EDITOR") || role.value.includes("ADMIN")) router.push("/books")
  }, 1700);
})
</script>

<template>
  <div class="login-bg">
     <AcessComponents
       v-if="isShow"
       :class="isAnimated ? 'animation-open' : 'card-exit'"
       @show="SetShow"
     />
     <RegisterComponents 
      v-if="!isShow"
      :class="!isAnimated ? 'animation-open' : 'card-exit'"
      @show="SetShow"
    />
  </div>
</template>

<style scoped>
.login-bg {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f7;
  padding: 2rem;
}

.animation-open{
    display: flex;
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
    transform: translateY(0) scale(1);
    opacity: 1;
}

.card-exit {
  transform: translateY(-40px) scale(0.96);
  opacity: 0;
  position: fixed;
  left: 0;
  z-index: -9999;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.55s ease;
}
</style>
