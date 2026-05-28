<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Navbar from '../assets/Navbar.vue'
import TrashedBooksTable from '../components/TrashedBooksTable.vue'
import UseBookStoreApi from '../stores/bookStore'
import userStore from '../stores/UserStore'
import { useToast, useConfirm, Toast, ConfirmDialog  } from "primevue";

const confirm = useConfirm();
const store = UseBookStoreApi()
const user = userStore()
const toast = useToast()
const isLoading = ref(false)

const isAdmin = computed(() => {
  return user.data.role?.toString().toUpperCase() === 'ADMIN'
})

const books = computed(() => store.trashed);

const loadTrashedBooks = async () => {
  isLoading.value = true;
  await store.getBookTrashed()
  isLoading.value = false;
}

const handleRestore = async (id: number) => {
  isLoading.value = true;
  await store.editDelete(id)
  isLoading.value = false;

  if (store.restore) {
    toast.add({
      severity: 'success',
      summary: 'Ripristino riuscito',
      detail: 'Il libro è stato ripristinato correttamente.',
      life: 4000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Ripristino fallito',
      detail: 'Non è stato possibile ripristinare il libro. Riprova.',
      life: 4000
    })
  }
}

const UseConfirmDialog = (id: number) => {
    confirm.require({
        message: "Vuoi procedere con l'operazione Effettiva?",
        icon: 'pi pi-exclamation-triangle',
        header: "Sicuro di Procedere",
        rejectProps: {
            label: 'Annulla Operazione',
            severity: 'danger',
            outlined: true
        },
        acceptProps: {
            label: 'Prosegui'
        },
        accept: () => {
            handleRestore(id)
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Operazione Annullata', detail: "L'Operazione non stata Eseguita", life: 3000 });
        }
    });
};

onMounted(() => {
  if (isAdmin.value) {
    loadTrashedBooks()
  }
})
</script>

<template>
  <Toast />
  <ConfirmDialog />
  <Navbar :loading="isLoading" @load="loadTrashedBooks" :load="true" />

  <div class="trashed-books-page">
    <div class="container">
      <div class="page-header">
        <div>
          <p class="eyebrow">Cestino</p>
          <h1>Libri Eliminati</h1>
          <p class="intro-text">
            Visualizza i libri impostati come cestinati e ripristina quelli che devono tornare attivi.
          </p>
        </div>
      </div>

      <div v-if="!isAdmin" class="access-denied-card">
        <h2>Accesso negato</h2>
        <p>Questa sezione è accessibile solo agli utenti con ruolo amministratore.</p>
      </div>

      <div v-else class="table-card">
        <TrashedBooksTable
          :books="books"
          :loading="isLoading"
          :isAdmin="isAdmin"
          @restore="UseConfirmDialog"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.trashed-books-page {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding: 40px 20px;
}
.container {
  max-width: 1140px;
  margin: 0 auto;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
}
.eyebrow {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6e6e73;
  margin: 0 0 10px;
}
h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 600;
  color: #1d1d1f;
  line-height: 1.1;
}
.intro-text {
  margin: 14px 0 0;
  color: #6e6e73;
  font-size: 15px;
  line-height: 1.8;
  max-width: 740px;
}
.table-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  border: 1px solid #e8e8ed;
  overflow: hidden;
  padding: 24px;
}
.access-denied-card {
  background: white;
  border-radius: 18px;
  padding: 28px;
  border: 1px solid #f0f0f3;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
}
.access-denied-card h2 {
  margin: 0 0 12px;
  font-size: 22px;
}
.access-denied-card p {
  margin: 0;
  color: #5f5f67;
}
</style>
