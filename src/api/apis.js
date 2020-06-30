import axios from 'axios'

export const IP = 'http://localhost:5000'
axios.defaults.baseURL = IP

//店铺信息
export const MERCHANTINFO_API = () => axios.get('/shop/seller')

//商品信息
export const GOODS_API = () => axios.get('/goods/goods_list')

//评价信息
export const RATINGS_API = () => axios.get('/shop/ratings')