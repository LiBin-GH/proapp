<template>
  <div id="app">
    <!-- 左侧商品分类 -->
    <div class="goods-classification-div">
      <div>
        <!-- kind:分类；kindindex:分类对应的索引；kind.name:分类名 -->
        <div
          :class="{goods_kind_div:true,kindActive:selectkinddiv==kindindex}"
          v-for="(kind,kindindex) in getgoodslist"
          :id="kind.name"
          :key="kindindex"
          @click="scrollTo(kindindex)"
        >
          <span>{{kind.name}}</span>
        </div>
      </div>
    </div>

    <!-- 右侧商品详情 -->
    <div class="goods-info-div">
      <div>
        <!-- 循环创建种类盒子 item -->
        <div :id="index" v-for="(item,index) in getgoodslist" :key="index">
          <div class="kind-name-div">{{item.name}}</div>

          <!-- vant商品卡组件，循环创建一个种类下的每一个商品food -->
          <van-card
            :price="food.price.toFixed(2)"
            :desc="food.goodsDesc"
            :title="food.name"
            :thumb="food.imgUrl"
            v-for="(food,foodsindex) in item.foods"
            :key="foodsindex"
          >
            <template #tags>
              <van-tag plain type="danger" class="tag">月售{{food.sellCount}}份</van-tag>
              <van-tag plain type="danger" class="tag">好评率{{food.rating}}%</van-tag>
            </template>
            <template #footer>
              <button v-show="food.num" class="goodsnumbtnred" @click="changegoodnum(-1,food.id)">-</button>
              <span v-show="food.num">{{food.num}}</span>
              <button class="goodsnumbtnadd" @click="changegoodnum(1,food.id)">+</button>
            </template>
          </van-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { GOODS_API } from "@/api/apis";
import BScroll from "better-scroll"; //引入better-scroll插件
export default {
  data() {
    return {
      selectkinddiv: 0 //左侧种类选中样式
    };
  },
  methods: {
    //左侧商品分类点击，右侧滚动到对应位置
    scrollTo(index) {
      this.selectkinddiv = index;
      this.BSright.scrollToElement(document.getElementById(index), 500);
    },

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
  // created() {
  //   GOODS_API().then(res => {
  //     let arr = res.data.goodsList;
  //     arr.map(item => item.foods.map(j => (j.num = 0)));

  //     this.$store.commit("changegoodslist", arr);

  //     console.log(arr);
  //   });
  // },
  //调用better-scroll插件
  mounted() {
    //左侧种类盒子
    this.BSleft = new BScroll(".goods-classification-div", { click: true });
    //右侧商品盒子
    this.BSright = new BScroll(".goods-info-div", {
      click: true,
      probeType: 3
    });
    this.BSright.on("scroll", obj => {
      this.getheightlist.forEach(item => {
        if (Math.abs(obj.y) < item.max && Math.abs(obj.y) >= item.min) {
          this.selectkinddiv = item.index;
          this.BSleft.scrollToElement(document.getElementById(item.name), 500);
        }
      });
      // console.log(this.getheightlist);
      // console.log(this.getgoodslist)
    });
  },

  //计算属性
  computed: {
    //获取右侧每一个种类及其包含的商品的盒子高度
    getheightlist() {
      let totalheight = 0;
      let divheight;
      let heightlist = [];
      for (let i = 0; i < this.getgoodslist.length; i++) {
        divheight = document.getElementById(i).offsetHeight;
        let obj = {
          name: this.getgoodslist[i].name,
          index: i,
          min: totalheight,
          max: divheight + totalheight
        };
        totalheight += divheight;
        heightlist.push(obj);
      }
      return heightlist;
    },

    //获取vuex中的goodslist
    getgoodslist() {
      return this.$store.state.goodsList;
    }
  }
};
</script>

<style lang="scss" scoped>
#app {
  width: 100vw;
  display: flex;
  flex-direction: row;

  //左侧分类盒子
  .goods-classification-div {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;

    // 左侧单个种类样式
    .goods_kind_div {
      height: 60px;
      width: 100px;
      font-size: 16px;
      background-color: rgb(243, 248, 255);
      display: table;
      border-bottom: 1px solid rgb(255, 218, 218);

      span {
        padding: 0 10px;
        display: table-cell;
        vertical-align: middle;
        color: rgb(49, 49, 49);
      }
    }

    //种类盒子选中样式
    .kindActive {
      background: #fff;
    }
  }

  //右侧详情
  .goods-info-div {
    flex: 1;
    overflow-y: scroll;

    //右侧商品分类行
    .kind-name-div {
      padding: 5px;
      text-indent: 10px;
      background: rgb(255, 241, 241);
      border-left: 2px solid rgb(212, 212, 212);
    }

    //商品卡组件样式
    .van-card {
      margin: 0;
      padding: 10px 15px;
      background: #fff;
      border-bottom: 1px solid rgb(216, 216, 216);
      .goodsnumbtnadd {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: none;
        background-color: rgb(46, 144, 255);
        color: #fff;
      }
      .goodsnumbtnred {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid rgb(46, 144, 255);
        background: #fff;
      }
    }
  }
}
</style>