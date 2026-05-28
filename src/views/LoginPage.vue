<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AcessComponents from '../assets/elements/AcessComponents.vue'
import RegisterComponents from '../assets/elements/RegisterComponents.vue'

const router = useRouter()
const isShow = ref(false);
const isAnimated = ref(false);

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
