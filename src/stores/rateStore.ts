import { defineStore } from "pinia";
import RateService from "../api/rateControl";

export interface Rate {
    Id: number;
    BookId: number;
    Description: string;
    Vote: number;
    Checked: boolean;
    User: {
        UserId: number,
        Name: string,
        Verified: boolean
    } 
}

export interface CreateRate {
    BookId: number;
    Description: string;
    Rating: number;
    UserId: number;
}

const rateStore = defineStore("rates", {
    state: () => ({
        list: [] as Rate[],
        length: 0,
        rate: {
            Description: "",
            Rating: 0,
            BookId: 0
        },
        comments: [] as Rate[],
        feedback: false,
        delete: false
    }),

    getters: {
        getRates: (state) => {
            return state.comments;
        },

        getLength: (state) => {
            return state.length;
        },

        getRate: (state) => {
            return state.rate;
        }
    },

    actions: {
        async fetchRates() {
            try {
                const response = await RateService.getComments();
                const data = await response.data.comments as Rate[];
                this.list = data;
                this.length = data.length;
            } catch (error) {
                console.error("Error fetching rates:", error);
            }
        },

        async fetchCommentsBook(bookId: number) {
            try {
                const response = await RateService.getCommentsBook(bookId);
                const data = await response.data.comments as Rate[];
                this.comments = data.sort((a, b) => b.Id - a.Id);
            } catch (error) {
                console.error("Error fetching rates:", error);
            }
        },

        async createRate(rate: CreateRate) {
            try {
                const response = await RateService.createComment(rate);
                const data = await response.data as Rate;
                this.rate.BookId = rate.BookId;
                this.rate.Description = rate.Description;
                this.rate.Rating = rate.Rating;
                this.fetchCommentsBook(rate.BookId);
                this.feedback = true;
            } catch (error) {
                console.error("Error creating rate:", error);
                this.feedback = false;
            }
        },

        async deleteRate(id: number) {
            try {
                const response = await RateService.deleteComment(id);
                const data = await response.data.feedback as boolean;
                if (data) {
                    this.delete = true;
                    this.comments = [];
                    setTimeout(() => { this.fetchCommentsBook(id) }, 1300);
                }
            } catch (error) {
                console.error("Error creating rate:", error);
                this.delete = false;
            }
        },

        ResetComments(){
            setTimeout(() => {
                this.comments = [];
                this.rate = {
                    Description: "",
                    Rating: 0,
                    BookId: 0
                };
            }, 1200);
        },

        setFeedBack(value: boolean) {
            setTimeout(() => {
                this.feedback = value;
            }, 3000);
        }
    },

    persist: {
        storage: sessionStorage
    }
})

export default rateStore;