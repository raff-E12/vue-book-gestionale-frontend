<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['confirm'])
</script>

<template>
  <div class="logout-card">
    <div class="logout-card__header">
      <div class="logout-card__icon">
        <i class="pi pi-sign-out"></i>
      </div>
      <div>
        <h1>Uscita sicura</h1>
        <p>Effettua il logout e torna alla pagina di accesso con un feedback chiaro e animato.</p>
      </div>
    </div>

    <div class="logout-card__body">
      <p>Premi il pulsante qui sotto per terminare la sessione. Riceverai una conferma visiva e verrai reindirizzato automaticamente.</p>
      <Button
        label="Esci ora"
        severity="danger"
        icon="pi pi-power-off"
        :loading="props.loading"
        class="logout-card__button"
        @click="emit('confirm')"
      />
    </div>
  </div>
</template>

<style scoped>
.logout-card {
  width: min(560px, 100%);
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  border: 1px solid #e8e8ed;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logout-card__header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logout-card__icon {
  width: 62px;
  height: 62px;
  border-radius: 18px;
  background: #ffe8e8;
  display: grid;
  place-items: center;
  color: #d32f2f;
  font-size: 1.6rem;
}

.logout-card__header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 500;
  color: #1d1d1f;
}

.logout-card__header p {
  margin: 6px 0 0;
  color: #5f5f67;
  line-height: 1.7;
}

.logout-card__body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.logout-card__body p {
  margin: 0;
  color: #6b6b75;
  line-height: 1.75;
  font-size: 15px;
}

.logout-card__button {
  width: fit-content;
}
</style>