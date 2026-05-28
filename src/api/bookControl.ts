import axios from "axios";
import { Book } from "../stores/bookList";
import { LoginResponse, ResponseRegister } from "../stores/UserStore";

const headers = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Accept-Language": "it",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
}

const rootUrl = "";
const BaseUrl = `/api-book`;

const apiClient = axios.create({
    baseURL: BaseUrl,
    withCredentials: false,
    headers
})

apiClient.interceptors.request.use(
    (response) => {
      console.log(response);
      return response;
    },
    (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

const libroService = {
  getAll() {
    return apiClient.get("/api/libri");
  },
  getById(id: number) {
    return apiClient.get(`/api/libri/${id}`);
  },
  create(libro: Book) {
    return apiClient.post("/api/libri", libro);
  },
  update(id: number, libro: Book) {
    return apiClient.patch(`/api/libri/${id}`, libro);
  },
  delete(id: number) {
    return apiClient.delete(`/api/libri/${id}`);
  },
  checkdelete(id: number, date: string){
    return apiClient.patch(`/api/delete-check/${id}`, { DateTrash: date });
  },
  getListTrashed(sets: boolean){
    return apiClient.post("/api/get-list-trashed", { set: sets });
  },
  getLoginUser(acces: LoginResponse){
    return apiClient.post("/api-user/login", acces);
  },
  getRegisterUser(user: ResponseRegister){
    return apiClient.post("/api-user/register", user);
  }
};

export default libroService