import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


const store = new Vuex.Store({
    //state: store核心属性，存放所有交互数据
    state: {
        goodsList: [],

    },
    //mutation: 改变, 是改变state里面数据的值的唯一方式
    mutations: {
        changegoodslist(state, list) {
            state.goodsList = list
        }
    },
    getters: {
        shopcarlist(state) {
            let arr = []
            for (let i of state.goodsList) {
                for (let j of i.foods) {
                    if (j.num > 0) {
                        arr.push(j)
                    }
                }
            }
            return arr
        }

    }

})

export default store