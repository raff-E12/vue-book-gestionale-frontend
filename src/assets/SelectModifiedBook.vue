<template>
  <Dialog
    :visible="visible"
    :header="`Modifica: ${book?.titolo}`"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="book-dialog"
    :style="{ width: '520px', maxWidth: '95vw' }"
    @update:visible="onDialogClose"
  >
    <div v-if="book" class="modal-body">

      <!-- Step 1: selezione del campo da modificare -->
      <div class="field">
        <label class="field-label">Campo da modificare</label>
        <Select
          v-model="selectedField"
          :options="fieldOptions"
          optionLabel="label"
          placeholder="— Seleziona un campo —"
          class="w-full"
          @change="onFieldChange"
        >
          <template #option="{ option }">
            <div class="field-option">
              <i :class="option.icon" class="field-option-icon" />
              <span>{{ option.label }}</span>
            </div>
          </template>
          <template #value="{ value }">
            <div v-if="value" class="field-option">
              <i :class="value.icon" class="field-option-icon" />
              <span>{{ value.label }}</span>
            </div>
          </template>
        </Select>
      </div>

      <!-- Step 2: input dinamico, compare solo dopo aver scelto il campo -->
      <transition name="fade-slide">
        <div v-if="selectedField" class="input-section">

          <div class="current-value">
            <span class="current-label">Valore attuale</span>
            <span class="current-text">{{ currentValue ?? '—' }}</span>
          </div>

          <div class="field">
            <label class="field-label">Nuovo valore</label>

            <!-- Testo -->
            <InputText
              v-if="selectedField.type === 'text'"
              v-model="newValue"
              class="w-full"
              :placeholder="`Inserisci ${selectedField.label.toLowerCase()}`"
            />

            <!-- Numero -->
            <InputNumber
              v-else-if="selectedField.type === 'number'"
              v-model="newValueNumber"
              :useGrouping="false"
              :min="selectedField.min ?? 0"
              class="w-full"
            />

            <!-- Colore -->
            <div v-else-if="selectedField.type === 'color'" class="color-field">
              <InputText
                v-model="newValue"
                class="w-full"
                placeholder="#3b82f6"
              />
              <span class="color-preview" :style="{ background: newValue || '#94a3b8' }" />
            </div>

            <div v-else-if="selectedField.type === 'file'" class="color-field">
              <FileUpload
                class="w-full"
                mode="basic"
                choose-label="Carica" 
                upload-label=""
                :with-credentials="true"
                style="background: #EEEDFE !important; border-color: #7F77DD; color: #3C3489; font-weight: 500; font-family: Arial, Helvetica, sans-serif;"
                name="img-upload"
                :multiple="false"
                accept="image/*"
                :auto="false"
                choose-icon="pi pi-image"
                invalid-file-type-message="Deve Essere un Immagine"
                custom-upload
                :maxFileSize="500000" 
                :show-cancel-button="true"
                :file-limit="1" 
                @select="(e) => UploadFile(e)"
              />
            </div>

            <!-- Testo lungo -->
            <Textarea
              v-else-if="selectedField.type === 'textarea'"
              v-model="newValue"
              rows="4"
              class="w-full"
              autoResize
            />
          </div>

        </div>
      </transition>

    </div>

    <template #footer>
      <div class="dialog-footer">
        <!-- Annulla → emette @close, il padre imposta modalOpen = false -->
        <Button
          label="Annulla"
          icon="pi pi-times"
          text
          @click="onCancel"
          class="cancel-btn"
        />
        <!-- Salva → emette @save con Book aggiornato, il padre chiude e chiama il backend -->
        <Button
          label="Applica modifica"
          icon="pi pi-check"
          :disabled="!selectedField || !hasValue"
          @click="onSave"
          class="save-btn"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import type { Book } from '../stores/bookStore'
import FileUpload from 'primevue/fileupload'

// ─── Campi modificabili ───────────────────────────────────────────────────────
interface FieldOption {
  key: keyof Book
  label: string
  icon: string
  type: 'text' | 'number' | 'color' | 'textarea' | 'file'
  min?: number
}

const fieldOptions: FieldOption[] = [
  { key: 'titolo',            label: 'Titolo',             icon: 'pi pi-tag',          type: 'text'     },
  { key: 'autore',            label: 'Autore',             icon: 'pi pi-user',         type: 'text'     },
  { key: 'isbn',              label: 'ISBN',               icon: 'pi pi-barcode',      type: 'text'     },
  { key: 'annoPubblicazione', label: 'Anno Pubblicazione', icon: 'pi pi-calendar',     type: 'number'   },
  { key: 'editore',           label: 'Editore',            icon: 'pi pi-building',     type: 'text'     },
  { key: 'categoria',         label: 'Categoria',          icon: 'pi pi-list',         type: 'text'     },
  { key: 'numCopie',          label: 'Numero Copie',       icon: 'pi pi-copy',         type: 'number',  min: 0 },
  { key: 'disponibile',       label: 'Disponibili',        icon: 'pi pi-check-circle', type: 'number',  min: 0 },
  { key: 'posizioneScaffale', label: 'Posizione Scaffale', icon: 'pi pi-map-marker',   type: 'text'     },
  { key: 'coverColor',        label: 'Colore Copertina',   icon: 'pi pi-palette',      type: 'color'    },
  { key: 'note',              label: 'Note',               icon: 'pi pi-file-edit',    type: 'textarea' },
  { key: 'coverImg',          label: 'Copertina Immagine', icon: 'pi pi-image',    type: 'file' },
]

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps<{
  book: Book | null   // libro selezionato dal padre
  visible: boolean    // il padre decide apertura/chiusura
}>()

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: Book): void
}>()

// ─── State ───────────────────────────────────────────────────────────────────
const selectedField  = ref<FieldOption | null>(null)
const newValue = ref<string>('')
const newValueNumber = ref<number | null>(null)

// ─── Computed ────────────────────────────────────────────────────────────────
const currentValue = computed(() => {
  if (!selectedField.value || !props.book) return null
  if(selectedField.value.key === 'coverImg'){
    return props.book.coverColor !== "Not Found" ? "La Copertina è Visibile" : "La Copertina Non è Visibile"
  } else {
    return props.book[selectedField.value.key]; 
  }
})

const hasValue = computed(() => {
  if (!selectedField.value) return false
  if (selectedField.value.type === 'number') return newValueNumber.value !== null
  return newValue.value.trim() !== ''
})

// ─── Handlers ────────────────────────────────────────────────────────────────
function onFieldChange() {
  newValue.value= '';
  newValueNumber.value = null;
}

function onCancel() {
  reset()
  emit('close')         // padre: modalOpen = false
}

function UploadFile(event: { files: File[] }) {
  const file = event.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      newValue.value = url;
    };
    reader.readAsDataURL(file);
  } else {
    console.warn("Nessun file selezionato.");
  }
}

function onDialogClose(val: boolean) {
  if (!val) {
    reset()
    emit('close')       // padre: modalOpen = false (click sulla X)
  }
}

// Funzione per salvare le modifiche: emette l'evento 'save' con il libro aggiornato
function onSave() {
  if (!props.book || !selectedField.value || !hasValue.value) return

  const updatedBook: Book = { ...props.book };

  if (selectedField.value.type === 'number') {
    // @ts-ignore
    updatedBook[selectedField.value.key] = newValueNumber.value as number
  } else {
    // @ts-ignore
    updatedBook[selectedField.value.key] = newValue.value;
  }

  emit('save', updatedBook)   // padre: chiama backend + modalOpen = false
  reset()
}

function reset() {
  selectedField.value  = null
  newValue.value = ''
  newValueNumber.value = null
}
</script>

<style scoped>
@import 'primeicons/primeicons.css';

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px 0 8px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #475569;
  font-family: 'Inter', sans-serif;
}

.field-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.field-option-icon {
  color: #2563eb;
  font-size: 0.9rem;
  width: 16px;
  text-align: center;
}

/* ── Sezione input dinamica ──────────────────────────────────────────────── */
.input-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 18px;
}

.current-value {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.current-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
}

.current-text {
  font-size: 0.95rem;
  color: #334155;
  font-family: 'Lora', Georgia, serif;
  padding: 6px 10px;
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  word-break: break-word;
}

.color-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-preview {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
  transition: background 0.3s;
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  color: #64748b !important;
  font-family: 'Inter', sans-serif;
}

.save-btn {
  background: #2563eb !important;
  border-color: #2563eb !important;
  border-radius: 8px !important;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}

.save-btn:not(:disabled):hover {
  background: #1d4ed8 !important;
}

/* ── Transizione ─────────────────────────────────────────────────────────── */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>