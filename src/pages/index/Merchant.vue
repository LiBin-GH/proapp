<template>
  <div id="merchant">
    <div>
      <!-- 店铺基本信息 -->
      <div class="merchant-name-div">
        <div>
          <h3>{{name}}</h3>
          <van-rate size="14px" v-model="sellerscore" />
          <span style="font-size:14px;color:#6f7478">
            月售
            <span>{{sellCount}}</span>单
          </span>
        </div>
        <div class="collection-div">
          <van-icon size="24px" color="red" name="like" />
          <p>已收藏</p>
        </div>
      </div>
      <!-- 配送相关 -->
      <div class="delivery-div">
        <div>
          <p>起送价</p>
          <span>{{minPrice}}</span>元
        </div>
        <div>
          <p>商家配送</p>
          <span>{{deliveryPrice}}</span>元
        </div>
        <div>
          <p>平均送达时间</p>
          <span>{{deliveryTime}}</span>分钟
        </div>
      </div>
      <!-- 公告 -->
      <div class="suppots-div">
        <h4>公告与活动</h4>
        <p class="bulletin-p">{{bulletin}}</p>
      </div>
      <!-- 活动 -->
      <div class="sub-suppot-div" v-for="item in supports" :key="item">{{item}}</div>
      <!-- 店铺实景 -->
      <div class="merchant-img-div">
        <h4>商家实景</h4>
        <img :src="item" v-for="item in pics" :key="item" alt />
      </div>
      <!-- 营业时间 -->
      <div class="time-div">
        <h4>营业时间</h4>
        {{date[0]}} -{{date[1]}}
      </div>




    </div>
  </div>
</template>

<script>
import { MERCHANTINFO_API } from "@/api/apis";
import BScroll from "better-scroll"; //引入better-scroll插件
export default {
  data() {
    return {
      name: "", //店铺名字
      supports: [], //店铺活动
      deliveryTime: "", //送达时间
      bulletin: "", //店铺公告
      deliveryPrice: "", //配送费
      minPrice: "", //起送价
      sellCount: 0, //月售
      sellerscore: 4, //评分
      pics: [], //店铺图片
      date: [] //营业时间
    };
  },
  created() {
    MERCHANTINFO_API().then(res => {
      // console.log(res);
      let {
        name,
        supports,
        deliveryTime,
        bulletin,
        deliveryPrice,
        minPrice,
        sellCount,
        pics,
        date
      } = res.data.data;
      this.name = name;
      this.supports = supports;
      this.deliveryTime = deliveryTime;
      this.bulletin = bulletin;
      this.deliveryPrice = deliveryPrice;
      this.minPrice = minPrice;
      this.sellCount = sellCount;
      this.pics = pics;
      this.date = date.map(item => item.substr(11, 5));
    });
  },
  mounted() {
    new BScroll(document.getElementById("merchant"), { click: true });
  },
  computed: {
    arr1() {
      return this.$store.state.arr;
    },
    arr2() {
      return this.$store.getters.arr;
    }
  },
  methods: {
    addBtn() {
      this.$store.commit('changeArr','王五')
    }
  }
};
</script>

<style lang="scss" scoped>
#merchant {
  height: 100%;
  // 基本信息
  .merchant-name-div {
    padding: 0 20px 20px 20px;
    display: flex;
    height: 81px;
    justify-content: space-between;
    .collection-div {
      padding-top: 20px;
      text-align: center;
      p {
        margin: 0;
      }
    }
  }
  // 配送
  .delivery-div {
    display: flex;
    padding: 20px;
    text-align: center;
    margin: 0 20px;
    height: 48px;
    justify-content: space-around;
    border-top: 1px solid rgb(212, 212, 212);
    border-bottom: 20px solid rgb(228, 228, 228);
    p {
      margin: 0;
      color: rgb(196, 196, 196);
      font-size: 14px;
    }
    span {
      font-size: 24px;
    }
  }
  // 公告
  .suppots-div {
    padding: 0 40px;
    .bulletin-p {
      margin: 0;
      padding: 0 10px 20px 10px;
      color: rgb(92, 128, 68);
      font-size: 14px;
    }
  }
  // 活动
  .sub-suppot-div {
    margin: 0 40px;
    padding: 20px 30px;
    color: rgb(97, 97, 97);
    font-size: 14px;
    border-top: 1px solid rgb(202, 202, 202);
  }
  // 店铺实景
  .merchant-img-div {
    margin: 0 30px;
    padding: 0 20px;
    border-top: 20px solid rgb(236, 236, 236);
    border-bottom: 20px solid rgb(230, 230, 230);
    img {
      width: 100px;
      height: 100px;
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }
  // 营业时间
  .time-div {
    margin: 0 30px;
    padding: 0 20px;
    font-size: 14px;
    padding-bottom: 20px;
  }
}
</style>