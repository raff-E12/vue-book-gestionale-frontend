<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { Book } from '../stores/bookStore'

const props = defineProps<{
  books: Book[]
  loading: boolean
  isAdmin: boolean
}>()

const emit = defineEmits<{
  (e: 'restore', id: number): void
}>()

const restoreBook = (id: number) => {
  emit('restore', id)
}
</script>

<template>
  <div class="trashed-books-table">
    <div class="table-actions" v-if="isAdmin">
      <p class="table-subtitle">Libri attualmente nel cestino</p>
      <p class="table-description">Puoi ripristinare i libri solo se sei un amministratore.</p>
    </div>

    <DataTable
      :value="books"
      :loading="loading"
      emptyMessage="Nessun libro da ripristinare"
      class="p-datatable-sm"
      responsiveLayout="scroll"
    >
      <Column field="id" header="ID" />
      <Column field="titolo" header="Titolo" />
      <Column field="autore" header="Autore" />
      <Column field="editore" header="Editore" />
      <Column field="categoria" header="Categoria" />
      <Column field="disponibile" header="Disponibilità" />
      <Column field="trashDate" header="Data Cancellazione" />
      <Column header="Azioni">
        <template #body="slotProps">
          <Button
            severity="success"
            size="small"
            label="Ripristina"
            icon="pi pi-undo"
            class="restore-button"
            @click.stop="() => restoreBook(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.trashed-books-table {
  width: 100%;
}
.table-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}
.table-subtitle {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: #333;
}
.table-description {
  margin: 0;
  color: #5d5d6b;
  font-size: 13px;
}
</style>
