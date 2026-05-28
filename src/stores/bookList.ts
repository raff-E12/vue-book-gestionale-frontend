import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Book {
  id: number
  titolo: string
  autore: string
  isbn: string
  annoPubblicazione: number
  editore: string
  categoria: string
  numeroCopie: number
  copieDisponibili: number
  note: string
  coverColor: string
}

const books = ref<Book[]>([
    {
      id: 1,
      titolo: 'La coscienza di Zeno',
      autore: 'Italo Svevo',
      isbn: '978-88-07-90147-8',
      annoPubblicazione: 1923,
      editore: 'Feltrinelli',
      categoria: 'Narrativa',
      numeroCopie: 5,
      copieDisponibili: 2,
      note: 'Capolavoro del romanzo psicologico italiano',
      coverColor: '#4A90E2'
    },
    {
      id: 2,
      titolo: 'Il nome della rosa',
      autore: 'Umberto Eco',
      isbn: '978-88-452-6059-0',
      annoPubblicazione: 1980,
      editore: 'Bompiani',
      categoria: 'Romanzo storico',
      numeroCopie: 8,
      copieDisponibili: 4,
      note: 'Thriller medievale ambientato in un monastero benedettino',
      coverColor: '#8B4513'
    },
    {
      id: 3,
      titolo: 'Il giorno della civetta',
      autore: 'Leonardo Sciascia',
      isbn: '978-88-06-21937-8',
      annoPubblicazione: 1961,
      editore: 'Einaudi',
      categoria: 'Giallo',
      numeroCopie: 6,
      copieDisponibili: 3,
      note: 'Primo romanzo italiano sulla mafia',
      coverColor: '#2C3E50'
    },
    {
      id: 4,
      titolo: 'Il gattopardo',
      autore: 'Giuseppe Tomasi di Lampedusa',
      isbn: '978-88-07-88165-7',
      annoPubblicazione: 1958,
      editore: 'Feltrinelli',
      categoria: 'Narrativa storica',
      numeroCopie: 4,
      copieDisponibili: 1,
      note: 'Affresco della Sicilia durante il Risorgimento',
      coverColor: '#D4AF37'
    },
    {
      id: 5,
      titolo: 'La forma dell\'acqua',
      autore: 'Andrea Camilleri',
      isbn: '978-88-389-2098-3',
      annoPubblicazione: 1994,
      editore: 'Sellerio',
      categoria: 'Giallo',
      numeroCopie: 10,
      copieDisponibili: 7,
      note: 'Primo romanzo della serie del Commissario Montalbano',
      coverColor: '#1E88E5'
    },
    {
      id: 6,
      titolo: 'Se questo è un uomo',
      autore: 'Primo Levi',
      isbn: '978-88-06-21947-7',
      annoPubblicazione: 1947,
      editore: 'Einaudi',
      categoria: 'Testimonianza',
      numeroCopie: 7,
      copieDisponibili: 0,
      note: 'Testimonianza della deportazione ad Auschwitz',
      coverColor: '#616161'
    },
    {
      id: 7,
      titolo: 'Il deserto dei tartari',
      autore: 'Dino Buzzati',
      isbn: '978-88-04-66808-9',
      annoPubblicazione: 1940,
      editore: 'Mondadori',
      categoria: 'Narrativa',
      numeroCopie: 5,
      copieDisponibili: 2,
      note: 'Romanzo filosofico sull\'attesa e il senso della vita',
      coverColor: '#FFA726'
    },
    {
      id: 8,
      titolo: 'Novecento',
      autore: 'Alessandro Baricco',
      isbn: '978-88-07-01703-3',
      annoPubblicazione: 1994,
      editore: 'Feltrinelli',
      categoria: 'Teatro',
      numeroCopie: 6,
      copieDisponibili: 5,
      note: 'Monologo teatrale su un pianista nato su una nave',
      coverColor: '#26A69A'
    },
    {
      id: 9,
      titolo: 'Il fu Mattia Pascal',
      autore: 'Luigi Pirandello',
      isbn: '978-88-11-36389-7',
      annoPubblicazione: 1904,
      editore: 'Garzanti',
      categoria: 'Narrativa',
      numeroCopie: 4,
      copieDisponibili: 4,
      note: 'Riflessione sull\'identità e sulla libertà',
      coverColor: '#7E57C2'
    },
    {
      id: 10,
      titolo: 'Cent\'anni di solitudine',
      autore: 'Gabriel García Márquez',
      isbn: '978-88-04-68068-5',
      annoPubblicazione: 1967,
      editore: 'Mondadori',
      categoria: 'Narrativa',
      numeroCopie: 9,
      copieDisponibili: 6,
      note: 'Edizione italiana del capolavoro del realismo magico',
      coverColor: '#EF5350'
    },
    {
      id: 11,
      titolo: 'Il sentiero dei nidi di ragno',
      autore: 'Italo Calvino',
      isbn: '978-88-06-21906-4',
      annoPubblicazione: 1947,
      editore: 'Einaudi',
      categoria: 'Narrativa',
      numeroCopie: 5,
      copieDisponibili: 3,
      note: 'Primo romanzo di Calvino sulla Resistenza',
      coverColor: '#66BB6A'
    },
    {
      id: 12,
      titolo: 'Sostiene Pereira',
      autore: 'Antonio Tabucchi',
      isbn: '978-88-07-01711-8',
      annoPubblicazione: 1994,
      editore: 'Feltrinelli',
      categoria: 'Narrativa',
      numeroCopie: 6,
      copieDisponibili: 2,
      note: 'Ambientato nella Lisbona del 1938 sotto Salazar',
      coverColor: '#42A5F5'
    },
    {
      id: 13,
      titolo: 'Cristo si è fermato a Eboli',
      autore: 'Carlo Levi',
      isbn: '978-88-06-21909-5',
      annoPubblicazione: 1945,
      editore: 'Einaudi',
      categoria: 'Memorialistica',
      numeroCopie: 4,
      copieDisponibili: 0,
      note: 'Racconto del confino in Lucania',
      coverColor: '#8D6E63'
    },
    {
      id: 14,
      titolo: 'Ragazzi di vita',
      autore: 'Pier Paolo Pasolini',
      isbn: '978-88-11-81639-3',
      annoPubblicazione: 1955,
      editore: 'Garzanti',
      categoria: 'Narrativa',
      numeroCopie: 5,
      copieDisponibili: 1,
      note: 'Vita nelle borgate romane del dopoguerra',
      coverColor: '#FF7043'
    },
    {
      id: 15,
      titolo: 'L\'isola di Arturo',
      autore: 'Elsa Morante',
      isbn: '978-88-06-21915-6',
      annoPubblicazione: 1957,
      editore: 'Einaudi',
      categoria: 'Narrativa',
      numeroCopie: 4,
      copieDisponibili: 3,
      note: 'Storia di formazione ambientata a Procida',
      coverColor: '#29B6F6'
    }
  ])

  const searchQuery = ref('')
  const searchMode = ref<'text' | 'id'>('text')

  const filteredBooks = computed(() => {
    if (!searchQuery.value) {
      return books.value
    }

    if (searchMode.value === 'id') {
      const id = parseInt(searchQuery.value)
      return isNaN(id) ? [] : books.value.filter(book => book.id === id)
    }

    const query = searchQuery.value.toLowerCase()
    return books.value.filter(book =>
      book.titolo.toLowerCase().includes(query) ||
      book.autore.toLowerCase().includes(query) ||
      book.editore.toLowerCase().includes(query)
    )
  })

  function getBookById(id: number): Book | undefined {
    return books.value.find(book => book.id === id)
  }

  export default {
    books,
    searchQuery,
    searchMode,
    filteredBooks,
    getBookById
  }
