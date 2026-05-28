import { defineStore } from "pinia";
import libroService from "../api/bookControl";
import axios from "axios";

export interface LoginResponse {
    email: string,
    password: string
}

export interface ResponseRegister {
    fullname: string,
    email: string,
    password: string,
    role: string,
    verified: boolean 
}

export interface DataUser {
    id: number,
    nomeCompleto: string,
    email: string,
    password: string,
    role: string,
    verified: boolean
}

export interface UserResponse{
    data?: DataUser[] | DataUser,
    success: boolean,
    error: boolean,
    message: string
}

const userStore = defineStore('user', {
    state: () => ({
        data: {
            fullname: "",
            email: "",
            password: "",
            verified: false,
            role: ""
        },
        feedback: {
            operations: false,
            created: false,
            login: false,
            errors: false,
            access: false
        },
        id: 0
    }),

    getters: {
        getUserData: (state) => {
            return state.data;
        },

        getVerify: (state) => {
            for(const value in state.data){
                if(!Object.prototype.hasOwnProperty.call(state.data, value)) continue;
                const element = state.data[value];
                if(element !== "" && element !== false){
                return true;
                }
            }

            return false;
        },

        getID: (state) => {
            return state.id;
        }
    },

    actions: {
        async getAccess(form: LoginResponse){
            try {
                const response = await libroService.getLoginUser(form);
                const data = response.data as UserResponse;

                if(!data.success && data.error) return;

                if (data.data) {
                    if (Array.isArray(data.data) && data.data.length > 0) {
                        const user = data.data[0] as DataUser;
                        this.data.fullname = user.nomeCompleto || "";
                        this.data.email = user.email || "";
                        this.data.password = user.password || "";
                        this.data.role = user.role || "";
                        this.data.verified = !!user.verified;
                        this.id = user.id || 0;
                    } else if (!Array.isArray(data.data)) {
                        const user = data.data as DataUser;
                        this.data.fullname = user.nomeCompleto || "";
                        this.data.email = user.email || "";
                        this.data.password = user.password || "";
                        this.data.role = user.role || "";
                        this.data.verified = !!user.verified;
                        this.id = user.id || 0;
                    }
                }

                try {
                    sessionStorage.setItem('userResponse', JSON.stringify(data));
                } catch (e) {
                    console.error(e);
                }

                this.feedback.login = true;
                this.feedback.errors = false;
                this.feedback.access = false;
            } catch (error) {

                if(axios.isAxiosError(error)){
                    const statusErrors = error.response?.status;
                    console.log(statusErrors)
                   
                    if(statusErrors === 401){
                        this.feedback.access = true;
                        this.feedback.created = false;
                        this.feedback.errors = false;
                    }

                } else if(error instanceof Error){
                    this.feedback.errors = true;
                    this.feedback.created = false;
                    this.feedback.operations = false;
                }

                console.error("Error fetching login:", error);
            }
        },

        // alias che espone lo stesso comportamento in italiano
        async access(form: LoginResponse){
            return await this.getAccess(form);
        },

        ResetFeedBackErrors(){
            const lists = ['operations', 'errors', 'access'];
            for (let key in this.feedback){
                if (lists.includes(key)) {
                    this.feedback[key] = false;
                }
            }
        },

        // registrazione: comportamento analogo all'accesso, popola store e storage
        async getRegister(form: ResponseRegister){
            try {
                const response = await libroService.getRegisterUser(form);
                const data = response.data as UserResponse;

                if(!data.success && data.error) return;

                if (data.data) {
                    if (Array.isArray(data.data) && data.data.length > 0) {
                        const user = data.data[0] as DataUser;
                        this.data.fullname = user.nomeCompleto || "";
                        this.data.email = user.email || "";
                        this.data.password = user.password || "";
                        this.data.role = user.role || "";
                        this.data.verified = !!user.verified;
                        this.id = user.id || 0;
                    } else if (!Array.isArray(data.data)) {
                        const user = data.data as DataUser;
                        this.data.fullname = user.nomeCompleto || "";
                        this.data.email = user.email || "";
                        this.data.password = user.password || "";
                        this.data.role = user.role || "";
                        this.data.verified = !!user.verified;
                        this.id = user.id || 0;
                    }
                }

                try {
                    sessionStorage.setItem('userResponse', JSON.stringify(data));
                } catch (e) {
                    console.error(e);
                }

                this.feedback.created = true;
                this.feedback.errors = false;
            } catch (error) {
                if(axios.isAxiosError(error)){
                    const statusErrors = error.response?.status;
                    console.log(statusErrors)
                   
                    if(statusErrors === 400){
                        this.feedback.operations = true;
                        this.feedback.created = false;
                        this.feedback.errors = false;
                    }

                } else if(error instanceof Error){
                    this.feedback.errors = true;
                    this.feedback.created = false;
                    this.feedback.operations = false;
                }
            }
        }
    },

    persist: {
        storage: sessionStorage
    }
})

export default userStore