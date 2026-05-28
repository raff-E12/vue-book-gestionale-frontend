<template>
  <div class="p-4">
    <p>{{ message }}</p>
    <div class="flex justify-end gap-2 mt-4">
      <Button class="btn-1" label="Annulla" severity="secondary" @click="dialogRef.close(false)" />
      <Button label="Conferma" @click="dialogRef.close(true)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import Button from 'primevue/button'

const dialogRef = inject<any>('dialogRef')
const message = dialogRef.value.data?.message ?? 'Sei sicuro?'
</script>

<style scoped>

.btn-1 {
  margin-right: 10px !important;
}
</style>