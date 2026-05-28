import axios from "axios";
import { CreateOrderTemplate, OrderTemplate } from "../stores/OrdersStore";

const headers = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Accept-Language": "it",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
}

const rootUrl = "";
const BaseUrl = `/api-orders`;

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

const OrderService = {
  getOrders(id: number) {
    return apiClient.get(`/api/orders/${id}`);
  },
  deleteSingleId(id: number) {
    return apiClient.delete(`/api/delete-prod/${id}`);
  },
  deleteAllId(id: number) {
    return apiClient.delete(`/api/delete-all/${id}`);
  },
  createOrder(orders: CreateOrderTemplate) {
    return apiClient.post(`/api/create-order`, orders);
  },
  checkOrder(id: number) {
    return apiClient.patch(`/api/check-order/${id}`);
  },
  getInfoAll(){
    return apiClient.get("/api/orders")
  }
};

export default OrderService