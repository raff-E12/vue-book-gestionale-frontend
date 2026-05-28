import axios from "axios";
import { CreateOrderTemplate, OrderTemplate } from "../stores/OrdersStore";
import { CreateRate, Rate } from "../stores/rateStore";

const headers = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Accept-Language": "it",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
}

const rootUrl = "";
const BaseUrl = `/api-rating`;

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

const RateService = {
  getComments() {
    return apiClient.get(`/api/get-comments`);
  },
  getComment(id: number) {
    return apiClient.get(`/api/get-comment/${id}`);
  },
  getCommentsBook(id: number) {
    return apiClient.get(`/api/book-comment/${id}`);
  },
  createComment(comment: CreateRate) {
    return apiClient.post(`/api/create-comment`, comment);
  },
  deleteComment(id: number) {
    return apiClient.delete(`/api/comments/${id}`);
  },
};

export default RateService