<template>
  <div class="rating-app">
    <div>
      <!-- 综合评分 -->
      <div class="ratings-score-div">
        <div class="score-left-div">
          <p>3.9</p>
          <p>综合评分</p>
          <p>高于周边商家69.2%</p>
        </div>
        <div style="height:84px;border:1px solid rgb(255, 218, 218)"></div>
        <div class="score-right-div">
          <p>
            服务态度
            <van-rate size="14px" v-model="sellerscore" />3.9
          </p>
          <p>
            服务态度
            <van-rate size="14px" v-model="sellerscore" />4.0
          </p>
          <p>
            送达时间
            <span style="color:#969da4">44分钟</span>
          </p>
        </div>
      </div>

      <!-- 查看评论 -->
      <div style="border:10px solid #ededed"></div>
      <div class="ratings-button-div">
        <van-button color="#00a0dc" @click="allratings">
          全部
          <span class="ratings-num-span">{{ratings.length}}</span>
        </van-button>
        <van-button color="#ccecf7" @click="satisfied">
          满意
          <span class="ratings-num-span">{{ratings.length}}</span>
        </van-button>
        <van-button color="#ccecf7" @click="dissatisfied">
          不满意
          <span class="ratings-num-span">{{ratings.length}}</span>
        </van-button>
        <div class="icon-div">
          <van-checkbox v-model="checked" @click="change">只看有内容的评价</van-checkbox>
        </div>
      </div>

      <!-- 评论列表 -->
      <div class="ratings-list-div" v-for="(item,index) in newratings" :key="index">
        <van-image round width="50px" height="50px" :src="item.avatar" />
        <div class="rating-info-div">
          <div class="user-time-div" style="font-size:14px">
            <span>{{item.username}}</span>
            <span style="color:#b7babf">{{datetime(item.rateTime)}}</span>
          </div>
          <p>
            <van-rate size="14px" v-model="item.score" />
            <span
              v-if="item.deliveryTime"
              style="color:#b7babf;font-size:14px"
            >{{item.deliveryTime}}分钟送达</span>
          </p>
          <p v-if="item.text" style="font-size:14px">{{item.text}}</p>
          <p>
            <van-icon v-if="!item.rateType" color="#3a68c8" name="good-job" />
            <van-icon
              v-if="item.rateType"
              color="#655"
              style="transform: rotateX(180deg);"
              name="good-job"
            />
            <van-tag plain v-for="(food,foodindex) in item.recommend" :key="foodindex">{{food}}</van-tag>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RATINGS_API } from "@/api/apis";
import BScroll from "better-scroll"; //引入better-scroll插件
export default {
  data() {
    return {
      ratings: [], //所有评价信息
      newratings: [], //只看有内容的评价的筛选信息
      checked: false, //只看有内容的评价是否选中
      sellerscore: 4, //店铺综合评分
      selectBtn:true
    };
  },
  methods: {
    //   时间转化函数
    datetime(dateTime) {
      let date = new Date(dateTime);
      let Y = date.getFullYear() + "/";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "/";
      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let H = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let MI =
        date.getMinutes() < 10
          ? "0" + date.getMinutes()
          : date.getMinutes() + "";
      let S =
        date.getSeconds() < 10
          ? "0" + date.getSeconds()
          : date.getSeconds() + "";
      return Y + M + D + " " + H + ":" + MI + ":" + S;

      //   return dateTime;
    },
    //选择是否有内容的评价
    change() {
      if (this.checked) {
        this.newratings = this.ratings.filter(item =>
          item.text == "" ? null : item
        );
      } else {
        this.newratings = this.ratings;
      }
    },
    //所有评论按钮
    allratings() {
      if (this.checked) {
        this.newratings = this.ratings.filter(item =>
          item.text == "" ? null : item
        );
      } else {
        this.newratings = this.ratings;
      }
    },
    //评论满意
    satisfied() {
      if (this.checked) {
        this.newratings = this.ratings.filter(item =>
          item.rateType == 0 && item.text !== "" ? item : null
        );
      } else {
        this.newratings = this.ratings.filter(item =>
          item.rateType == 0 ? item : null
        );
      }
    },
    //评论不满意
    dissatisfied() {
      if (this.checked) {
        this.newratings = this.ratings.filter(item =>
          item.rateType == 1 && item.text !== "" ? item : null
        );
      } else {
        this.newratings = this.ratings.filter(item =>
          item.rateType == 1 ? item : null
        );
      }
    }
  },
  //初始化函数钩子
  created() {
    RATINGS_API().then(res => {
      // console.log(res);
      this.ratings = res.data.data;
      this.newratings = this.ratings;
    });
  },
  //渲染完毕钩子函数
  mounted() {
    //调用better-sscroll插件
    new BScroll(".rating-app", { click: true });
  }
};
</script>

<style lang="scss" scoped>
.rating-app {
  height: 100%;
  //综合评分盒子
  .ratings-score-div {
    display: flex;
    justify-content: space-around;
    padding: 20px;
    height: 86px;
    p {
      margin: 0;
      line-height: 28px;
      font-size: 14px;
    }
    .score-left-div {
      text-align: center;
      p:nth-child(1) {
        font-size: 24px;
        font-weight: bold;
        color: rgb(149, 185, 81);
      }
      p:nth-child(3) {
        font-size: 12px;
        color: rgb(167, 167, 167);
      }
    }
  }

  //选择评价分类盒子
  .ratings-button-div {
    height: 107px;
    padding: 15px 20px;
    border-bottom: 1px solid rgb(209, 209, 209);

    //评价是否满意按钮
    .van-button {
      margin-right: 20px;
      margin-bottom: 20px;
      .van-button__text {
        color: #000;
        .ratings-num-span {
          font-size: 10px;
        }
      }
      .btnactive{
        color: #fff;
      }
    }

    //只看有内容的评价
    .icon-div {
      padding: 10px;
      border-top: 1px solid rgb(206, 206, 206);
    }
  }

  //评价列表
  .ratings-list-div {
    border-bottom: 1px solid rgb(194, 194, 194);
    display: flex;
    padding: 20px;

    //除用户头像外的评价信息盒子
    .rating-info-div {
      margin-left: 20px;
      flex: 1;
      p {
        margin: 0;
        padding: 5px 0;
      }
      .user-time-div {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>