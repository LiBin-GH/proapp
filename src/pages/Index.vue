<template>
  <div id="app">
    <!-- 顶部商家信息 -->
    <div class="head-div" :style="{background: `url('${avatar}')`}">
      <div class="sub-head-div">
        <!-- 店铺头像 -->
        <img :src="avatar" style="width:80px;height:80px" />
        <!-- 店铺信息 -->
        <div class="head-info-div">
          <p class="name-p" @click="show = true" :style="namebackgroundimg">{{name}}</p>
          <p style="font-size:14px">
            {{description}}/
            <span>{{deliveryTime}}</span>分钟送达
          </p>
          <p :style="supportsbackgroundimg" class="supports-p">{{supports.join(',')}}</p>
        </div>
        <div class="suppots-num-div">
          <van-tag round color="rgba(27, 24, 22, 0.9)">
            {{supports.length}}个
            <van-icon name="arrow" size="10" />
          </van-tag>
        </div>
      </div>
      <!-- 公告 -->
      <div style="display:flex;flex-direction: column;">
        <van-notice-bar
          left-icon="volume-o"
          :text="bulletin"
          mode="link"
          style="height:24px;line-height:24px;font-size:12px;background:rgba(27, 24, 22, 0.8);"
          color="#fff"
        />
      </div>
    </div>

    <!-- 导航栏 -->
    <div class="router-link-div">
      <router-link to="/">商品</router-link>
      <router-link to="/ratings">评价</router-link>
      <router-link to="/merchant">商家</router-link>
    </div>

    <!-- 动态加载盒子 -->
    <div id="main-div">
      <router-view></router-view>
    </div>

    <!-- 底部购物车 -->
    <div id="footer-div">
      <!-- 购物车图标 -->
      <div style="width:60px">
        <div class="footer-shopcar-div" @click="isshowboard = !isshowboard">
          <van-icon
            name="shopping-cart"
            size="30px"
            color="#808589"
            style="position:relative;top:8px;left:8px"
          />
        </div>
      </div>
      <!-- 价格盒子 -->
      <div class="footer-totalprice-div">
        ￥
        <span>{{totalprice}}</span>
      </div>
      <!-- 配送费 -->
      <div style="font-size:12px">另需配送费￥{{deliveryPrice}}元</div>
      <!-- 按钮 -->
      <div v-show="totalprice>=minPrice" class="footer-settlement-div">去结算</div>
      <div v-show="!(totalprice>=minPrice)" class="footer-settlement-div">{{minPrice}}起送</div>
    </div>

    <!-- 购物车面板 -->
    <transition name="slide-fade">
      <div v-show="isshowboard" class="shopcar-board-div">
        <h4 class="title">购物车</h4>
        <div v-show="!getshopcarlist.length" style="text-indent:20px">您暂未选购商品</div>
        <div class="good-div" v-for="item in getshopcarlist" :key="item.id">
          <div class="shopcar-name-div">{{ item.name }}</div>
          <div class="shopcar-price-div">￥{{(item.price * item.num).toFixed(2)}}</div>
          <div class="shopcar-btn-div">
            <div v-show="item.num" class="goodsnumbtnred" @click="changegoodnum(-1,item.id)">-</div>
            <div v-show="item.num">{{item.num}}</div>
            <div class="goodsnumbtnadd" @click="changegoodnum(1,item.id)">+</div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 遮罩层 -->
    <van-overlay :show="show" @click="show = false" class="over_div">
      <div style="text-align:center; font-size:20px;font-weight:bold;padding-bottom:22px">{{name}}</div>
      <div style="text-align:center">
        <van-rate v-model="value" allow-half void-icon="star" void-color="#eee" />
      </div>
      <van-divider :style="{ color: '#fff', padding: '0 16px',fontSize:'18px' }">优惠信息</van-divider>
      <div v-for="item in supports" :key="item" style="text-align:center;padding:8px 0">{{ item }}</div>
      <van-divider style="font-size:18px;padding: 0 16px;color: #fff">商家公告</van-divider>
      <div class="over_div_arg" style="line-height:24px">{{bulletin}}</div>
      <div style="display:flex;justify-content:center; align-items:flex-end;margin-top:50px">
        <van-icon name="close" size="40" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { MERCHANTINFO_API,GOODS_API } from "@/api/apis.js";
export default {
  data() {
    return {
      avatar: "", //店铺头像
      name: "", //店铺名字
      description: "", //配送方式
      supports: [], //店铺活动
      deliveryTime: "", //送达时间
      bulletin: "", //店铺公告
      deliveryPrice: "", //配送费
      minPrice: "", //起送价
      isshowboard: false, //是否显示购物车面板
      show: false, //遮罩层
      value: 4,
      //顶部店铺名品牌背景图
      namebackgroundimg: {
        backgroundImage: "url(" + require("@/assets/images/brand@2x.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "35px",
        backgroundPosition: "0px 3px"
      },
      //顶部店铺活动‘减’字图片
      supportsbackgroundimg: {
        backgroundImage:
          "url(" + require("@/assets/images/decrease_1@2x.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "15px",
        backgroundPosition: "0px 6px"
      }
    };
  },
  methods: {
    //商品数量加减按钮点击
    changegoodnum(val, id) {
      for (let i of this.getgoodslist) {
        for (let j of i.foods) {
          if (j.id == id) {
            j.num += val;
            return;
          }
        }
      }
    }
  },
  //初始化钩子函数
  created() {
    //发送请求获取店铺信息
    MERCHANTINFO_API().then(res => {
      // console.log(res);
      let {
        avatar,
        name,
        description,
        supports,
        deliveryTime,
        bulletin,
        deliveryPrice,
        minPrice
      } = res.data.data;
      this.avatar = avatar;
      this.name = name;
      this.description = description;
      this.supports = supports;
      this.deliveryTime = deliveryTime;
      this.bulletin = bulletin;
      this.deliveryPrice = deliveryPrice;
      this.minPrice = minPrice;
    });
    GOODS_API().then(res => {
      let arr = res.data.goodsList;
      arr.map(item => item.foods.map(j => (j.num = 0)));

      this.$store.commit("changegoodslist", arr);

      console.log(arr);
    });
  },
  computed: {
    getshopcarlist() {
      return this.$store.getters.shopcarlist;
    },
    //获取vuex中的goodslist
    getgoodslist() {
      return this.$store.state.goodsList;
    },
    totalprice() {
      let allmoney = 0;
      this.$store.getters.shopcarlist.forEach(item => {
        allmoney += item.price * item.num;
      });
      return allmoney.toFixed(2);
    }
  }
};
</script>

<style lang="scss">
//购物车面板动画效果实现-vue.js
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  transform: translateY(300px);
}

// 页面样式
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  // 头部
  .head-div {
    height: 124px;
    .sub-head-div {
      display: flex;
      height: 80px;
      justify-content: start;
      background-color: rgba(75, 55, 45, 0.8);
      padding: 10px;
      position: relative;
      .suppots-num-div {
        position: absolute;
        right: 10px;
        bottom: 10px;
      }
      .head-info-div {
        height: 80px;
        margin-left: 10px;
        flex: 1;
        p {
          margin: 0;
          line-height: 28px;
          color: #fff;
        }
        p.name-p {
          font-size: 18px;
          font-weight: bold;
          text-indent: 40px;
        }
        p.supports-p {
          font-size: 12px;
          display: block;
          width: 80%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-indent: 20px;
        }
      }
    }
  }
  //导航
  .router-link-div {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    border-bottom: 1px solid rgb(255, 203, 203);
    z-index: 100;
    a {
      text-decoration-line: none;
      font-size: 20px;
      color: rgb(29, 22, 19);
    }
  }
  // 主体
  #main-div {
    flex: 1;
    height: 100%;
    overflow-y: scroll;
  }
  // 尾部
  #footer-div {
    padding-left: 10px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    line-height: 50px;
    background: #141c27;
    color: rgb(173, 154, 154);
    z-index: 100;
    //购物车图标
    .footer-shopcar-div {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 7px solid #141c27;
      box-sizing: border-box;
      background: rgb(53, 52, 50);
      position: absolute;
      bottom: 0px;
    }
    //总价盒子
    .footer-totalprice-div {
      color: rgb(173, 154, 154);
      font-size: 20px;
      font-weight: bold;
    }
    //起送价盒子
    .footer-settlement-div {
      background: rgb(75, 65, 65);
      text-align: center;
      width: 100px;
    }
  }
  //购物车面板
  .shopcar-board-div {
    position: fixed;
    bottom: 50px;
    max-height: 200px;
    width: 100%;
    overflow-y: scroll;
    background: #fff;
    z-index: 99;
    padding-bottom: 20px;
    .title {
      background: rgb(226, 255, 217);
      display: flex;
      margin: 0;
      text-indent: 20px;
      padding: 10px 0;
    }
    .good-div {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      .shopcar-name-div {
        width: 150px;
      }
      .shopcar-btn-div {
        display: flex;
        text-align: center;

        .goodsnumbtnadd {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          line-height: 20px;
          border: none;
          background-color: rgb(46, 144, 255);
          color: #fff;
        }
        .goodsnumbtnred {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          line-height: 16px;
          border: 2px solid rgb(46, 144, 255);
          background: #fff;
        }
      }
    }
  }

  .over_div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    z-index: 100;
    background: rgba(0, 0, 0, 0.9);
    .over_div_arg {
      margin: 0 40px;
      display: flex;
      justify-content: center;
      align-content: center;
    }
  }
}
</style>