import Vue from 'vue'
import VueRouter from 'vue-router'
import Goods from '../pages/index/Goods'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'goods',
    component: Goods
  },
  {
    path: '/ratings',
    name: 'ratings',
    component: () => import('../pages/index/Ratings.vue')
  },
  {
    path: '/merchant',
    name: 'merchant',
    component: () => import('../pages/index/Merchant.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
