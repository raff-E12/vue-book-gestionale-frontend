<script setup lang="ts">
import { computed, ref, toRaw, toRef, toRefs, watch, watchEffect } from 'vue';
import UseBookStoreApi from '../../stores/bookStore.ts';
import { DynamicDialog, useDialog, useToast, Toast } from 'primevue';
import ConfirmModal from '../../components/ConfirmModal.vue';
import Button from 'primevue/button';
import { useRoute, useRouter } from 'vue-router';
import Badge from 'primevue/badge';
import OrderStore from '../../stores/OrdersStore.ts';
import FileUpload from 'primevue/fileupload';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';   //Optional for grouping
import userStore from '../../stores/UserStore.ts';
import Popover from 'primevue/popover';

const isOpen = ref(false);
const isPrevColor = ref("");
const store = UseBookStoreApi();
const orders = OrderStore();
const router = useRouter();
const toast = useToast();
const props = defineProps(["loading", "load"]);
const emit = defineEmits(["load"]);
const isLoading = toRef(props.loading);
const users = userStore();
const op = ref(null);
const route = useRoute();

const userName = computed(() => users.data.fullname || users.data.email || "Utente");
const userInitial = computed(() => userName.value.charAt(0).toUpperCase() || "U");
const userEmail = computed(() => users.data.email || "email non disponibile");
const userVerified = computed(() => users.data.verified ? "Verificato" : "Non verificato");
const userId = computed(() => users.id || 0);
const userRole = computed(() => {
  if(users.data.role === "USER") return "Utente";
  if(users.data.role === "EDITOR") return "Gestore";
  if(users.data.role === "ADMIN") return "Amministratore";
});

const marginFix = computed(() => ({
    'margin-fix': !userRole.value!.includes('Utente') || userRole.value!.includes('Utente'),
}));

const toggle = (event: any) => {
  op.value!.toggle(event);
}

const isFormsData = ref({
  titolo: "",
  autore: "",
  editore: "",
  annoPubblicazione: 0,
  categoria: "",
  isbn: "",
  posizioneScaffale: "",
  numCopie: 0,
  disponibile: "",
  coverColor: "",
  note: "",
  prezzo: 0,
  coverImg: "",
  trashed: false,
  trashDate: null,
})

function selectColor(target: string) {
   isPrevColor.value = target;
   isFormsData.value.coverColor = target;
}

// Coverti l'immagine in base64 e salvala nello stato per poterla inviare al backend
function UploadFile(event: { files: File[] }) {
  const file = event.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      isFormsData.value.coverImg = url;
    };
    reader.readAsDataURL(file);
  } else {
    console.warn("Nessun file selezionato.");
  }
}

const dialog = useDialog();
const confirm = useToast();
const HandleClearForms = () => {
  setTimeout(() => {
    isFormsData.value = {
        titolo: "",
        autore: "",
        editore: "",
        annoPubblicazione: 0,
        categoria: "",
        isbn: "",
        posizioneScaffale: "",
        numCopie: 0,
        disponibile: "",
        coverColor: "",
        note: "",
        prezzo: 0,
        coverImg: "",
        trashDate: null,
        trashed: false
    }
  }, 1500); 
}

const HandleInputCheckForm = () => {
    const id = Number(store.books[store.length - 1].id) ?? 0;
    const hasEmptyFields = Object.values(isFormsData.value).some(value => value === "" || value === null || value === undefined || value === 0);
    const formRaw = toRaw(isFormsData.value);
    const formData = new FormData();
      for (const [key, value] of Object.entries(formRaw)) {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }

      dialog.open(ConfirmModal, {
          props: {
            header: 'Conferma aggiunta libro',
            modal: true,
            style: { width: '400px' },
            draggable: false,
          },
          data: {
            message: 'Vuoi aggiungere questo libro?'
          },
          onClose(res) {
            if (hasEmptyFields) {
              confirm.add({ severity: "warn", summary: "Avviso", detail: "I Campi devono essere Compilati", life: 1500 });
              HandleClearForms();
            } else {
                if (res?.data === true) {
                  store.AddBook(formRaw);
                  if (store.operations) {
                    confirm.add({ severity: "error", summary: "Errore", detail: "Il File non Mandato, Riprova più tardi!!", life: 1500 });
                    HandleClearForms();
                    } else {
                    toast.add({
                      severity: 'success',
                      summary: 'Libro Creato',
                      detail: `Libro è stato Creato`,
                      life: 3500,
                    })
                    HandleClearForms();
                  }
                }
            }
          }
        });
}

const HandleRefreshBookStorage = () => { emit("load") }
const RefreshOrdersList = () => { 
  orders.ResetOrdersInfo();
  setTimeout(() => { orders.getOrdersInfo() }, 1300);
}
</script>

<template>
    <DynamicDialog />
    <Toast position="top-right" class="z-50" />
    <nav class="nav-sc">

    <div class="navbar">
      <div class="nav-container">
        <div class="hamburger-lines" v-if="load && (users.feedback.login || users.feedback.created)" >
            <Avatar :label="userInitial" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" @click="toggle" />
            <Popover ref="op">
                <div class="popover-user-card">
                  <div class="popover-user-header">
                    <b>{{ userName }}</b>
                  </div>
                  <div class="popover-user-row" :style="{ marginTop: '12px'}">
                    <small :style="{ fontWeight: '700'}">{{ userEmail }}</small>
                  </div>
                  <div class="popover-user-row" :style="{ marginTop: '2px'}"><span :style="{ fontWeight: '700' }">Ruolo:</span> {{ userRole }}</div>
                  <div class="btn-sc">
                    <Button severity="contrast" v-if="load && (users.feedback.login || users.feedback.created) && userRole?.includes('Utente')" :class="marginFix" @click="() => router.push('/user-order')"><i class="pi pi-shopping-cart"></i></Button>
                    <Button severity="info" v-if="load && (users.feedback.login || users.feedback.created) && !userRole?.includes('Utente')" :class="marginFix" @click="() => isOpen = true"><i class="pi pi-plus-circle"></i></Button>
                    <Button severity="danger" v-if="load && (users.feedback.login || users.feedback.created)" :class="marginFix" @click="() => router.push('logout')"><i class="pi pi-sign-out"></i></Button>
                  </div>
                </div>
            </Popover>
        </div>

        <div class="logo" v-if="load">
            <Button type="button" class="btn-refresh" severity="help" label="Riepilogo Ordini" icon="pi pi-list" :loading="isLoading" @click="() => router.push('/orders')"  v-if="userRole?.includes('Amministratore') && (users.feedback.login || users.feedback.created)" />
            <Button type="button" class="btn-refresh" severity="success" label="Pagina Principale" icon="pi pi-home" :loading="isLoading" @click="() => router.push('/books')"  v-if="route.path.includes('/trashed-books') && userRole?.includes('Amministratore') && (users.feedback.login || users.feedback.created)" />
            <Button type="button" class="btn-refresh" severity="danger" label="Cencellati" icon="pi pi-trash" :loading="isLoading" @click="() => router.push('/trashed-books')"  v-if="!route.path.includes('/trashed-books') && (userRole?.includes('Amministratore') || userRole?.includes('Gestore')) && (users.feedback.login || users.feedback.created)" />
            <Button type="button" class="btn-refresh" severity="info" label="Ricarica" icon="pi pi-sync" :loading="isLoading" @click="HandleRefreshBookStorage" />
            <Button severity="secondary" @click="() => router.push('/checkout')" class="btn-logo" v-if="userRole?.includes('Utente') && (users.feedback.login || users.feedback.created)">
               <Badge v-if="orders.length !== 0" class="badge-icons" :value="orders.length" size="small" severity="info"></Badge>
                <div class="icon-btn">
                    <i class="pi pi-shopping-bag"></i>
                </div>
            </Button>
          <p class="logo-text">Libreria</p>
        </div>

        <div class="logo" v-if="!load">
          <p class="logo-text">Libreria</p>
          <Button type="button" class="btn-refresh" severity="secondary" icon="pi pi-refresh" @click="RefreshOrdersList"  v-if="route.path.includes('/orders') && userRole?.includes('Amministratore') && (users.feedback.login || users.feedback.created)" />
          <Button type="button" class="btn-refresh" severity="secondary" icon="pi pi-home" @click="() => users.data.role.includes('USER') ? router.push('/') : router.push('/books')"  v-if="route.path.includes('/user-order') || route.path.includes('/orders') && userRole?.includes('Amministratore') && (users.feedback.login || users.feedback.created)" />
        </div>
      </div>
    </div>

    <!-- Menu overlay con form -->
    <div v-if="load" :class='`menu-items ${isOpen ? "active" : "toast"}`'>

      <div class="form-header">
        <div class="form-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#534AB7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          </svg>
        </div>
        <div>
          <p class="form-title">Aggiungi libro</p>
          <p class="form-subtitle">Compila i campi per aggiungere un volume al catalogo</p>
        </div>
      </div>

      <p class="section-label">Informazioni principali</p>
      <div class="form-grid">
        <div class="field span2">
          <label>Titolo <span class="required-star">*</span></label>
          <input type="text" id="titolo" placeholder="Es. Il nome della rosa" v-model="isFormsData.titolo"/>
        </div>
        <div class="field">
          <label>Autore <span class="required-star">*</span></label>
          <input type="text" id="autore" placeholder="Nome e cognome" v-model="isFormsData.autore" />
        </div>
        <div class="field">
          <label>editore</label>
          <input type="text" id="editore" placeholder="Es. Bompiani" v-model="isFormsData.editore" />
        </div>
        <div class="field">
          <label>Anno di pubblicazione</label>
          <input type="number" id="annoPubblicazione" placeholder="Es. 1980" min="1000" max="2099" v-model="isFormsData.annoPubblicazione" />
        </div>
        <div class="field">
          <label>Categoria</label>
          <select id="categoria" v-model="isFormsData.categoria">
            <option value="">— Seleziona —</option>
            <option>Narrativa</option>
            <option>Saggistica</option>
            <option>Fantascienza</option>
            <option>Storico</option>
            <option>Filosofia</option>
            <option>Scienze</option>
            <option>Economia</option>
            <option>Arte</option>
            <option>Altro</option>
          </select>
        </div>
      </div>

      <p class="section-label">Dati catalogo</p>
      <div class="form-grid">
        <div class="field">
          <label>ISBN</label>
          <input type="text" id="isbn" placeholder="978-3-16-148410-0" maxlength="17" v-model="isFormsData.isbn"/>
        </div>
        <div class="field">
          <label>Posizione scaffale</label>
          <input type="text" id="posizioneScaffale" placeholder="Es. A3-12" v-model="isFormsData.posizioneScaffale"/>
        </div>
        <div class="field">
          <label>Numero copie</label>
          <input type="number" id="numCopie" placeholder="0" min="0" v-model="isFormsData.numCopie"/>
        </div>
        <div class="field">
          <label>Disponibilità</label>
          <input type="number" id="numDisp" placeholder="0" min="0" v-model="isFormsData.disponibile"/>
        </div>
      </div>

      <p class="section-label">Copertina</p>
      <div class="field">
        <label>Colore copertina</label>
        <div class="color-row">
          <div :class='`color-swatch ${isPrevColor === "#534AB7" ? "selected" : ""}`' style="background:#534AB7;" @click="(event) => selectColor('#534AB7')"></div>
          <div :class='`color-swatch ${isPrevColor === "#D85A30" ? "selected" : ""}`' style="background:#D85A30;" @click="(event) => selectColor('#D85A30')"></div>
          <div :class='`color-swatch ${isPrevColor === "#1D9E75" ? "selected" : ""}`' style="background:#1D9E75;" @click="(event) => selectColor('#1D9E75')"></div>
          <div :class='`color-swatch ${isPrevColor === "#D4537E" ? "selected" : ""}`' style="background:#D4537E;" @click="(event) => selectColor('#D4537E')"></div>
          <div :class='`color-swatch ${isPrevColor === "#378ADD" ? "selected" : ""}`' style="background:#378ADD;" @click="(event) => selectColor('#378ADD')"></div>
          <div :class='`color-swatch ${isPrevColor === "#BA7517" ? "selected" : ""}`' style="background:#BA7517;" @click="(event) => selectColor('#BA7517')"></div>
          <div :class='`color-swatch ${isPrevColor === "#888780" ? "selected" : ""}`' style="background:#888780;" @click="(event) => selectColor('#888780')"></div>
          <input type="color" class="color-custom" id="coverColor" value="#534AB7" title="Colore personalizzato" v-model="isFormsData.coverColor" />
        </div>
      </div>

      <p class="section-label">Note</p>
      <div class="field">
        <label>Note aggiuntive</label>
        <textarea id="note" placeholder="Condizioni del libro, annotazioni particolari…" v-model="isFormsData.note"></textarea>
      </div>

      <p class="section-label">Extra</p>
      <div class="form-grid">
        <label>Prezzo</label>
        <div class="field span2">
          <input type="number" id="int-prezzo" step="0.01" placeholder="0" min="0" max="999.99" v-model="isFormsData.prezzo"/>
        </div>
        <div class="field field-margin">
          <label>Copertina Immagine</label>
            <FileUpload 
              mode="basic"
              choose-label="Carica" 
              class="btn-upload"
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
      </div>

      <div class="submit-row">
        <button class="btn-cancel" @click="() => isOpen = false">Annulla</button>
        <button class="btn-submit" @click="HandleInputCheckForm">Aggiungi libro</button>
      </div>

    </div>

  </nav>
</template>

<style scoped>
  @import 'primeicons/primeicons.css';

    .nav-sc {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .margin-fix{
      margin-top: 10px;
      margin-left: 0px;
    }

    .btn-sc{
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 2px;
    }

    .btn-refresh{
      font-size: .7em;
    }

    .icon-btn{
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .badge-icons{
      position: absolute !important;
      top: -3px;
      left: 30px;
      z-index: 30;
    }

    .btn-logo{
      position: relative !important;
      overflow: visible;
    }

    .field-margin {
      margin-top: 10px !important;
    }

    .navbar {
      width: 100%;
      background: #fff;
      box-shadow: 0 1px 4px rgb(146 161 176 / 15%);
      z-index: 10;
    }

    .nav-container {
      max-width: 1350px;
      width: 90%;
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
    }

    .hamburger-lines {
      display: flex;
      justify-content: center;
      z-index: 2;
      cursor: pointer;
      position: relative !important;
    }

    .hamburger-lines i {
      font-size: 1.5rem;
      color: #0e2431;
    }

    .humburger-lines i:hover {
      color: #534AB7;
    }

    .hamburger-lines .line {
      display: block;
      height: 4px;
      width: 100%;
      border-radius: 10px;
      background: #0e2431;
    }

    .hamburger-lines .line1 { transform-origin: 0% 0%; transition: transform 0.4s ease-in-out; }
    .hamburger-lines .line2 { transition: transform 0.2s ease-in-out; }
    .hamburger-lines .line3 { transform-origin: 0% 100%; transition: transform 0.4s ease-in-out; }

    .logo {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 1.4rem;
      color: #0e2431;
      display: flex;
      align-items: center;
      gap: 20px;
      justify-content: center;
    }

    /* ── MENU OVERLAY ── */
    .menu-items {
      position: fixed;
      top: 0;
      left: 0;
      width: 380px;
      max-width: 100vw;
      height: 100vh;
      background: #fff;
      box-shadow: 4px 0 24px rgb(0 0 0 / 8%);
      transform: translateX(-100%);
      transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 100;
      overflow-y: auto;
      padding: 2rem 2rem 3rem;
    }

    /* ── TOGGLE ── */
    .nav-sc .menu-items.active {
      transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateX(0);
    }

    .nav-sc .navbar .hamburger-lines.active .line1 { transform: rotate(45deg); }
    .nav-sc .navbar .hamburger-lines.active .line2 { transform: scaleY(0); }
    .nav-sc .navbar .hamburger-lines.active .line3 { transform: rotate(-45deg); }

    /* ── FORM ── */
    .form-header {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      margin-bottom: 2rem;
      padding-bottom: 1.25rem;
      border-bottom: 0.5px solid #e5e5e0;
    }

    .form-icon {
      width: 42px;
      height: 42px;
      background: #EEEDFE;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .form-title {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 20px;
      font-weight: 400;
      color: #0e2431;
      font-weight: 600;
      line-height: 1.2;
    }

    .form-subtitle {
      font-size: 12px;
      color: #888;
      margin: 0px;
      margin-top: 30px;
    }

    .section-label {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #aaa;
      margin: 1.4rem 0 0.65rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .field { display: flex; flex-direction: column; gap: 4px; }
    .field.span2 { grid-column: span 2; }

    label {
      font-size: 11px;
      font-weight: 500;
      color: #666;
    }

    input, select, textarea {
      background: #f8f7f4;
      border: 0.5px solid #ddd;
      border-radius: 8px;
      padding: 8px 11px;
      font-size: 13px;
      font-family: Arial, Helvetica, sans-serif;
      color: #0e2431;
      outline: none;
      width: 100%;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    input:focus, select:focus, textarea:focus {
      border-color: #7F77DD;
      box-shadow: 0 0 0 3px rgba(127,119,221,0.12);
      background: #fff;
    }

    textarea { resize: vertical; min-height: 68px; line-height: 1.5; }

    .color-row {
      display: flex;
      gap: 7px;
      align-items: center;
      flex-wrap: wrap;
    }

    .color-swatch {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.15s, transform 0.1s;
      flex-shrink: 0;
    }

    .color-swatch:hover { transform: scale(1.15); }
    .color-swatch.selected { border-color: #0e2431; }

    .color-custom {
      flex: 1;
      min-width: 60px;
      height: 32px;
      padding: 2px 4px;
      cursor: pointer;
    }

    .availability-toggle { display: flex; gap: 8px; }

    .toggle-btn {
      flex: 1;
      padding: 7px;
      border: 0.5px solid #ddd;
      border-radius: 8px;
      background: #f8f7f4;
      font-size: 12px;
      font-family: 'DM Sans', sans-serif;
      color: #888;
      cursor: pointer;
      transition: all 0.15s;
    }

    .toggle-btn.active {
      background: #EEEDFE;
      border-color: #7F77DD;
      color: #3C3489;
      font-weight: 500;
    }

    .required-star { color: #D85A30; margin-left: 2px; }

    .submit-row {
      display: flex;
      gap: 10px;
      margin-top: 2rem;
      padding-top: 1.25rem;
      border-top: 0.5px solid #e5e5e0;
    }

    .btn-cancel {
      flex: 1;
      padding: 10px;
      border: 0.5px solid #ccc;
      border-radius: 8px;
      background: transparent;
      font-size: 13px;
      font-family: 'DM Sans', sans-serif;
      color: #666;
      cursor: pointer;
      transition: background 0.15s;
    }

    .btn-cancel:hover { background: #f8f7f4; }

    .btn-submit {
      flex: 2;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      background: #534AB7;
      font-size: 13px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      color: #EEEDFE;
      cursor: pointer;
      transition: background 0.15s, transform 0.1s;
    }

    .btn-submit:hover { background: #3C3489; }
    .btn-submit:active { transform: scale(0.98); }

    .toast {
      display: none;
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #534AB7;
      color: #EEEDFE;
      font-size: 13px;
      font-weight: 500;
      padding: 10px 22px;
      border-radius: 20px;
      z-index: 999;
      animation: fadeup 0.3s ease;
    }

    @keyframes fadeup {
      from { opacity: 0; transform: translateX(-50%) translateY(10px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* ── PAGE CONTENT ── */
    .page-content {
      max-width: 800px;
      margin: 80px auto;
      padding: 0 2rem;
      text-align: center;
      color: #888;
      font-size: 15px;
    }

    .page-content h2 {
      font-family: 'DM Serif Display', serif;
      font-size: 2rem;
      color: #0e2431;
      margin-bottom: 0.5rem;
      font-weight: 400;
    }
</style>
