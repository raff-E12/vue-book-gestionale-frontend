# 📚 Vue Book Gestionale — Frontend

Interfaccia utente per il sistema di e-commerce di libri basata su **Vue 3** con TypeScript. Comunica con il backend tramite l'**API Gateway** su Spring Cloud.

**Repository Frontend:** [vue-book-gestionale-frontend](https://github.com/raff-E12/vue-book-gestionale-frontend)
**Repository Backend:** [book-ecommerce-microservices](https://github.com/raff-E12/book-ecommerce-microservices)

---

## 🛠️ Tecnologie

| Tecnologia | Versione | Ruolo |
|---|---|---|
| Vue 3 | ^3.5.30 | Framework UI reattivo |
| TypeScript | ~5.9.3 | Tipizzazione statica |
| Vite | ^8.0.1 | Build tool e dev server |
| Vue Router | ^4.6.4 | Routing lato client |
| Pinia | ^3.0.4 | State management |
| pinia-plugin-persistedstate | ^4.7.1 | Persistenza dello stato (es. autenticazione) |
| Axios | ^1.14.0 | Chiamate HTTP verso il Gateway |
| PrimeVue | ^4.5.4 | Libreria di componenti UI |
| PrimeIcons | ^7.0.0 | Icone per PrimeVue |
| Tailwind CSS | ^4.2.2 | Utility-first CSS framework |
| bcrypt | ^6.0.0 | Hashing lato client |

---

## ✅ Prerequisiti

- **Node.js** 18+
- **npm** 9+
- Il **backend** deve essere avviato e raggiungibile (in particolare il Gateway su porta `8089`)

> Consulta il [README del backend](https://github.com/raff-E12/book-ecommerce-microservices) per le istruzioni di avvio dei microservizi.

---

## 🚀 Avvio in sviluppo

### 1. Clona il repository

```bash
git clone https://github.com/raff-E12/vue-book-gestionale-frontend.git
cd vue-book-gestionale-frontend
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Configura le variabili d'ambiente

Crea (o verifica) il file `.env` nella root del progetto:

```env
VITE_URL_BASE="http://localhost:8089"
VITE_PORT=5174
```

| Variabile | Descrizione |
|---|---|
| `VITE_URL_BASE` | URL base del Gateway Spring Cloud (backend) |
| `VITE_PORT` | Porta su cui gira il dev server Vite |

> ⚠️ Non committare mai il file `.env` con credenziali reali in produzione. Usa `.env.production` per i valori di produzione.

### 4. Avvia il dev server

```bash
npm run dev
```

L'applicazione sarà disponibile su: [http://localhost:5174](http://localhost:5174)

---

## 📦 Script disponibili

| Comando | Descrizione |
|---|---|
| `npm run dev` | Avvia il server di sviluppo con hot-reload |
| `npm run build` | Compila il progetto per la produzione (output nella cartella `dist/`) |
| `npm run preview` | Anteprima locale della build di produzione |

---

## 📁 Struttura del progetto

```
vue-book-gestionale-frontend/
├── public/            # Asset statici pubblici
├── src/
│   ├── api/           # Tutte le chiamate con il backend
│   ├── assets/
|   |     |
│   |     ├── elements/               # Componenti generali
|   |     ├── helpers/                # Funzioni generali
|   |     └── components/             # Componenti Importanti
|   |
|   ├── css/                 # Stili Generali di Prova 
│   ├── router/              # Configurazione Vue Router
│   ├── stores/              # Store Pinia (stato globale)
│   ├── views/               # Componenti di Pagina
|   ├── App.vue              # Componenti di Entrata
|   ├── main.ts              # Entry point dell'applicazione
│   └── style.css            # Stile Globale (opzionale)
|
├── .env                     # Variabili d'ambiente locali
├── index.html               # Template HTML principale
├── vite.config.ts           # Configurazione Vite
├── tsconfig.json            # Configurazione TypeScript
└── package.json
```

---

## 🔗 Comunicazione con il Backend

Il frontend comunica **esclusivamente** con l'**API Gateway** del backend. Tutte le richieste passano da un unico punto d'ingresso:

```
Vue 3 App  →  API Gateway (http://localhost:8089)  →  Microservizi
```

Le chiamate HTTP sono gestite tramite **Axios**. L'URL base è configurato tramite la variabile d'ambiente `VITE_URL_BASE`.

Esempio di configurazione Axios:

```typescript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

const libroService = {
  getAll() {
    return apiClient.get("/api/servizio");
  },
  ...
};

export default apiClient
```

---

## 🏗️ Build per la produzione

```bash
npm run build
```

I file ottimizzati verranno generati nella cartella `dist/`. Per visualizzarli in locale prima del deploy:

```bash
npm run preview
```


## 📄 Premessa

Questo progetto è sviluppato a scopo didattico.