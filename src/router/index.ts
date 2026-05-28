import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import BookDetail from '../views/BookDetail.vue'
import ShopList from '../views/ShopList.vue'
import LoginPage from '../views/LoginPage.vue'
import LogoutPage from '../views/LogoutPage.vue'
import BooksTable from '../views/BooksTable.vue'
import OrdersView from '../views/OrdersView.vue'
import MyOrdersView from '../views/MyOrdersView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/book/:id',
    name: 'BookDetail',
    component: BookDetail,
    props: true
  },
  {
    path: "/checkout",
    name: "CheckoutSuccess",
    component: ShopList,
    props: true
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
    props: true
  },
  {
    path: "/books",
    name: "BooksTable",
    component: BooksTable,
    props: true
  },
  {
    path: "/trashed-books",
    name: "TrashedBooks",
    component: () => import('../views/TrashedBooks.vue'),
    props: true
  },
  {
    path: "/logout",
    name: "LogoutPage",
    component: LogoutPage,
    props: true
  },
  {
    path: "/orders",
    name: "OrdersLists",
    component: OrdersView,
    props: true
  },
  {
    path: "/user-order",
    name: "OrdersListsUser",
    component: MyOrdersView,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
