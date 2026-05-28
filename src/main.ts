import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import PrimeVue from "primevue/config"
import DialogService from "primevue/dialogservice"
import Aura from "@primeuix/themes/aura"
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
    theme: {
      preset: Aura
    }
})
app.use(DialogService)
app.use(ConfirmationService)
app.use(ToastService)
app.mount('#app')
