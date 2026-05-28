import { defineStore } from "pinia";
import OrderService from "../api/orderControl";
import { Book } from "./bookStore";
import { ref } from "vue";
import axios from "axios";

export interface OrderTemplate {
    id: number,
    BookName: string,
    BookId?: number,
    Price: number,
    Quantity: number,
    SubTotal: number,
    CoverColor: string,
    Editor: string,
    Author: string,
    Available: number,
}

interface BookOrder {
    libro_id: number,
    libro_prezzo: number,
    quantita: number,
    prezzo_subtotale: number
}

interface BookOrderTemplate {
    id: number,
    prezzo: number,
    quantita: number,
    subtotale: number,
    BookId: number
}

interface Book {
  Id: number;
  BookTitle: string;
  Price: number;
  Quanity: number;
  SubTotal: number;
}

interface User {
  UserID: number;
  Name: string;
  Verified: boolean;
  Email: string;
  Role: string;
}

export interface OrdersList {
  Id: number;
  BookList: Book[];
  TotalPrice: number;
  User: User;
  Order: boolean;
}

export interface CreateOrderTemplate {
    shop: BookOrder[] | [];
    total: number
}

export interface UserState {
  fullname: string
  email: string
  password: string
  verified: boolean
  role: string
}

export interface UserFeedback {
  operations: boolean
  created: boolean
  login: boolean
  errors: boolean
  access: boolean
}

export interface UserStore {
  data: UserState
  feedback: UserFeedback
  id: number
}

export interface OrdersList {
  Id: number
  BookList: Book[]
  TotalPrice: number
  Order: boolean 
}


const indexOrder = ref(0);

const OrderStore = defineStore("orders", {

    state: () => ({
        orders: [] as OrderTemplate[],
        created: { id: 0, status: false, checks: false, error: false, timeout: false },
        checks: {
            shop: [] as BookOrderTemplate[],
            total: 0
        },
        length: 0,
        total: 0,
        list: [] as OrdersList[],
        feedback: false
    }),

    getters: {
        getTotal: (state): number => {
            return state.length;
        },

        getTotalOrder: (state): number => {
            return state.checks.total;
        },

        getChecks: (state): boolean => {
            return state.created.checks;
        },

        getCreated: (state): boolean => {
            return state.created.status;
        }
    },

    actions: {

        async getList(id: number){
            try {
                let fetch = await OrderService.getOrders(id);
                let data =  fetch.data.checkout ?? [];
                this.orders = data;
                this.length = data.length ?? 0;
            } catch (error) {
                console.error((error as Error).message);
            }
        },

        recalculateTotal() {
            this.total = this.orders.reduce((sum, order) => {
                return sum + (order.Price * order.Quantity);
            }, 0);
        },

        AddQuantity(id: number, sub: number){
            const findCheck = this.checks.shop.find(element => element.id === id);
            const findOrder = this.orders.find(element => element.id === id);

            if (!findCheck || !findOrder) return;
            if (findOrder?.Quantity < findOrder?.Available){
                findOrder!.Quantity += 1;
                findCheck!.quantita += 1;
                findCheck.subtotale = sub;
                findOrder.SubTotal = sub;
                this.recalculateTotal();
            }
        },

        async DeleteAllProd(){
            this.orders = [];
            this.checks.shop = [];
            this.checks.total = 0;
            this.length = 0;
            this.total = 0;
            this.created.id = 0;
            this.created.checks = false;
            this.created.status = false;
            this.created.error = false;
            this.created.timeout = false;
        },

        DecourtQuantity(id: number, sub: number){
            const findCheck = this.checks.shop.find(element => element.id === id);
            const findOrder = this.orders.find(element => element.id === id);

            if (!findCheck || !findOrder) return;

            if (findOrder?.Quantity! > 0) {
                findOrder!.Quantity -= 1;
                findCheck!.quantita -= 1;
                findCheck.subtotale = sub;
                findOrder.SubTotal = sub;
                this.recalculateTotal();
            }
        },

        async DeleteProdOrder(id: number){
            const length = this.orders.length;
            if (length === 0) return;
            this.orders = this.orders.filter(element => element.id !== id);
            this.checks.shop = this.checks.shop.filter(element => element.id !== id);
            this.length = this.orders.length;
            this.recalculateTotal();
        },

        addBook(book: Book, quantity: number, total: string, lenghts: number){
            const length = this.checks.shop.length;
            const item = book as unknown as {
                id: number;
                prezzo: number;
                autore: string;
                coverColor: string;
                editore: string;
                titolo: string;
            };

            indexOrder.value++;
            const Formatsub = Number((Number(item.prezzo) * quantity).toFixed(2));
            const PriceFormat = Number(Number(item.prezzo).toFixed(2));

            const CheckFormat = { id: indexOrder.value, prezzo: PriceFormat, quantita: quantity, subtotale: Formatsub, BookId: item.id };
            const bookFormat = {
                id: indexOrder.value,
                BookName: item.titolo,
                Price: PriceFormat,
                Quantity: quantity,
                SubTotal: Formatsub,
                CoverColor: item.coverColor,
                Editor: item.editore,
                Author: item.autore,
                Available: lenghts,
                BookId: item.id
            };

            this.checks.shop.push(CheckFormat);
            this.orders.push(bookFormat);
            this.checks.total = length + 1;
            this.length = length + 1;
            this.total = Number(total);
        },

        async CreateOrder(id: number){
            try {
                const ResponseConversion = { ...this.checks };
                const Conversion: BookOrder[] = ResponseConversion.shop.map((element) => {
                    return { libro_id: element.BookId, libro_prezzo: element.prezzo, quantita: element.quantita, prezzo_subtotale: element.subtotale }
                });
                const ResponseFormat = { shop: Conversion, total: this.total, idUtente: id };
                const fetch = await OrderService.createOrder(ResponseFormat);
                if(fetch.status === 200) {
                    this.created.status = true;
                    this.created.id = fetch.data.IdOrder;
                    this.created.error = false;
                    this.created.timeout = false;
                }

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const statusErrors = error.response?.status;
                    this.created.status = false;
                    this.created.id = 0;
                    if (statusErrors === 500) {
                        this.created.timeout = true;
                        this.created.error = false;
                    } else {
                        this.created.error = true;
                        this.created.timeout = false;
                    }
                    console.error(error.message);
                } else if (error instanceof Error) {
                    this.created.status = false;
                    this.created.error = true;
                    this.created.timeout = false;
                    this.created.id = 0;
                    console.error(error.message);
                }
            }
        },

        async CheckOrders(){
            try {
                const fetch = await OrderService.checkOrder(this.created.id);
                const status = fetch.status;
                if (status) {
                    this.created.checks = true;
                    this.created.error = false;
                } else {
                    this.created.checks = false;
                    this.created.error = false;
                }
            } catch (error) {
                if(error instanceof Error){
                    this.created.checks = false;
                    this.created.error = true;
                    console.error((error.message));
                }
            }
        },

        async getOrdersInfo(){
            try {
                const fetch = await OrderService.getInfoAll();
                const status = fetch.status;
                const data = fetch.data.Orders;

                if (status) {
                    this.list = data;
                    this.feedback = true;
                } else {
                    this.feedback = false;
                    this.list = [];
                }
            } catch (error) {
                if(error instanceof Error){
                    this.feedback = false;
                    this.list = [];
                    console.error((error.message));
                }
            }
        },

        ResetOrdersInfo(){
            this.list = [];
            this.feedback = false;
        }

    },

    persist: {
        storage: sessionStorage
    }
})

export default OrderStore