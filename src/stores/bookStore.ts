import { defineStore } from "pinia";
import libroService from "../api/bookControl";
import { Ref } from "vue";

export interface Book {
    annoPubblicazione: number,
    autore: string,
    categoria: string,
    disponibile: number,
    editore: string,
    id: number,
    isbn: string,
    note: string,
    numCopie: number,
    posizioneScaffale: string,
    titolo: String,
    prezzo: number,
    coverColor: string,
    coverImg: string,
    trashed: boolean,
    trashDate: string | null,
}

const UseBookStoreApi = defineStore("books", {

    state: () => ({
        books: [] as Book[],
        filtered: [] as Book[],
        trashed: [] as Book[],
        length: 0,
        trash: 0,
        loading: false,
        operations: false,
        restore: false,
        find: {} as Book | {}
    }),

    getters: {
        getTotals: (state) => {
            return state.length;
        },

        getBooks: (state) => {
            return state.books;
        }
    },

    actions: {
        async setBook(){
            try {
                const getData = await libroService.getListTrashed(false);
                const data = getData.data.books ?? [];
                const length = getData.data.books.length ?? 0;
                this.books = data;
                this.length = length;
            } catch (error) {
                console.error(error);
                this.books = [];
                this.length = 0;
            }
        },

        RefreshPage(){
            this.loading = true;
            setTimeout(() => {
                this.setBook();
                this.getBookTrashed()
                this.loading = false;
                this.restore = false;
            }, 1300)
        },

        getBookById(id: number): Book | undefined {
           return this.filtered.find(book => book.id === id)
        },

        async IdFindBook(id: number){
            try {
                const fetch = await libroService.getById(id);
                const data = fetch.data.books;
                this.find = data;
            } catch (error) {
                console.error(error);
                this.find = {};
            }
        },

        FiltedBook(searchQuery: Ref<string>, searchMode: Ref<string>, books: Book[]) {

        if (!searchQuery.value) {
            this.filtered = books;
            return;
        }

        if (searchMode.value === "category") {
            this.filtered = searchQuery.value === "" ? [] : books.filter((book) => book.categoria === searchQuery.value);
            return;
        }

        const query = searchQuery.value.toLowerCase();
        this.filtered = books.filter(
            (book) =>
            book.titolo.toLowerCase().includes(query) ||
            book.autore.toLowerCase().includes(query) ||
            book.editore.toLowerCase().includes(query)
        );

        },

        async AddBook(bk: any){
            try {
                const fetch = await libroService.create(bk);
                const status = fetch.status;
                if (status === 201){
                    this.operations = true;
                    this.setBook();
                }
            } catch (error) {
                console.log(error);
                this.operations = false;
                this.setBook();
            }
        },

        async DeleteBook(id: number){
            try {
                const fetch = await libroService.delete(id);
                const status = fetch.status;
                if (status === 200){
                    this.operations = true;
                    this.setBook();
                } 
            } catch (error) {
                console.log(error);
                this.operations = false;
                this.setBook();
            }
        },

        async EditBook(id: number, bk: any){
            try {
                const fetch = await libroService.update(id, bk);
                const status = fetch.status;
                if (status === 200){
                    this.operations = true;
                    this.setBook();
                    this.IdFindBook(id);
                }
            } catch (error) {
                console.log(error);
                this.operations = false;
                this.setBook();
                this.IdFindBook(id);
            }
        },

        async getBookTrashed(){
            try {
                const getData = await libroService.getListTrashed(true);
                const data = getData.data.books ?? [];
                const length = getData.data.books.length ?? 0;
                this.trashed = data;
                this.trash = length;
            } catch (error) {
                console.error(error);
                this.trashed = [];
                this.trash = 0;
            }
        },

        async editDelete(id: number){
            try {
                const date = new Date().toISOString().slice(0, 10);
                const fetch = await libroService.checkdelete(id, date);
                const status = fetch.data.status;
                if (status === 200){
                    this.restore = true;
                    // this.RefreshPage();
                }
            } catch (error) {
                this.restore = false;
                console.log(error);
            }
        }

    },

    persist: {
        storage: sessionStorage
    }
})

export default UseBookStoreApi