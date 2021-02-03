<template>
  <div class="home">
    <swiper class="swiper" ref="mySwiper" :options="swiperOptions">
      <swiper-slide>
        <img class="w-100" src='../assets/images/match/match_01.jpg'>
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src='../assets/images/match/match_01.jpg'>
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src='../assets/images/match/match_01.jpg'>
      </swiper-slide>
      <div class="swiper-pagination pagination-home text-right px-3 pb-1" slot="pagination"></div>
    </swiper>
    <!-- end of swiper -->
    <div class="nav-icons text-center bg-white mt-3 pt-3 text-dark-1">
      <div class="d-flex flex-wrap">
        <div class="nav-items mb-3"
          v-for="n in 10"
          :key="n"
        >
          <i class="sprite sprite-news"></i>
          <div class="py-2">爆料站</div>
        </div>
      </div>
      <div class="bg-light py-2 fs-sm mr-1">
        <i class="sprite sprite-arrow"></i>
        <span>收起</span>
      </div>
    </div>
    <!-- <m-card icon="menu" title="新闻资讯">
      <div class="nav jc-between">
          <div class="nav-item active">
            <div class="nav-link">
              热门
            </div>
          </div>
          <div class="nav-item">
            <div class="nav-link">
              新闻
            </div>
          </div>
          <div class="nav-item">
            <div class="nav-link">
              新闻
            </div>
          </div>
          <div class="nav-item">
            <div class="nav-link">
              新闻
            </div>
          </div>
          <div class="nav-item">
            <div class="nav-link">
              新闻
            </div>
          </div>
        </div>
        <div class="pt-3">
         <swiper>
          <swiper-slide v-for="m in 5" :key="m">
            <div
              class="py-2"
              v-for="n in 5"
              :key="n"
            >
              <span>[新闻]</span>
              <span>|</span>
              <span>夏日新版本"稷下星之队"即将6月上线</span>
              <span>06/02</span>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </m-card> -->

    <m-list-card 
      icon="menu"
      title="新闻资讯"
      :categories="newsCats"
    >
      <template #items="{category}">
        <router-link
          tag="div"
          class="py-2 fs-lg d-flex"
          v-for="(news, i) in category.newsList"
          :key="i"
          :to="`/articles/${news._id}`"
        >
          <span class="text-info">[{{news.categoryName}}]</span>
          <span class="px-2">|</span>
          <span class="flex-1 text-dark-1 text-ellipsis pr-2">{{news.title}}</span>
          <span class="text-grey-1 fs-sm">{{news.createdAt | date}}</span>
        </router-link>
      </template>
    </m-list-card>

    <m-list-card
      icon="menu"
      title="英雄列表"
      :categories="heroCats"
    >
      <template #items="{category}">
       <div class="d-flex flex-wrap" style="margin: 0 -0.2rem;">
          <router-link
            tag="div"
            :to="`/heroes/${hero._id}`"
            class="p-2 text-center"
            style="width: 20%;"
            v-for="(hero, i) in category.heroList"
            :key="i"
          >
            <img :src="hero.avatar" class='w-100'>
            <div>{{ hero.name }}</div>
          </router-link>
        </div>
      </template>
    </m-list-card>

    <!-- end of nav icons -->
    <!-- 字体图标可以改颜色 可以设置大小 -->
    <!-- <i class="iconfont icon-menu text-primary"></i> -->
    <!-- <div class="card bg-white p-3 mt-2">
      <div class="card-header d-flex ai-center">
        <i class="iconfont icon-menu"></i>
        <div class="fs-xl flex-1 px-2">新闻资讯</div>
        <i class="iconfont icon-menu"></i>
      </div>
      <div class="card-body pt-3">
        <div class="nav jc-between">
          <div class="nav-item active">
            <div class="nav-link">
              热门
            </div>
          </div>
          <div class="nav-item">
            <div class="nav-link">
              新闻
            </div>
          </div>
          <div class="nav-item">
            <div class="nav-link">
              新闻
            </div>
          </div>
          <div class="nav-item">
            <div class="nav-link">
              新闻
            </div>
          </div>
          <div class="nav-item">
            <div class="nav-link">
              新闻
            </div>
          </div>
        </div>
        <div class="pt-3">
         <swiper>
          <swiper-slide v-for="m in 5" :key="m">
            <div
              class="py-2"
              v-for="n in 5"
              :key="n"
            >
              <span>[新闻]</span>
              <span>|</span>
              <span>夏日新版本"稷下星之队"即将6月上线</span>
              <span>06/02</span>
            </div>
          </swiper-slide>
        </swiper>
        </div>
      </div>
    </div> -->
    <!-- <m-card icon="menu" title="英雄列表"></m-card> -->
    <m-card icon="menu" title="精彩视频"></m-card>
    <m-card icon="menu" title="图文攻略"></m-card>
  </div>
</template>

<script>
import dayjs from 'dayjs';
// @ is an alias to /src
export default {
  name: 'Home',
  filters: {
    date(val) {
      return dayjs(val).format('MM/DD')
    }
  },
  data() {
    return {
      swiperOptions: {
        loop: true,
        pagination: {
          el: '.pagination-home',
        },
        // Some Swiper option/callback...
      },
      newsCats: [
        {
          name: '热门',
          newsList: new Array(5).fill({}).map(v => ({
              categoryName: '公告',
              title: '6月2日全服不停机更新公告',
              data: '06/01'
          }))
        },
        {
          name: '新闻',
          newsList: new Array(5).fill({}).map(v => ({
              categoryName: '公告',
              title: '6月2日全服不停机更新公告',
              data: '06/01'
          }))
        },
        {
          name: '新闻',
          newsList: new Array(5).fill({}).map(v => ({
              categoryName: '公告',
              title: '6月2日全服不停机更新公告',
              data: '06/01'
          }))
        },
        {
          name: '新闻',
          newsList: new Array(5).fill({}).map(v => ({
              categoryName: '公告',
              title: '6月2日全服不停机更新公告',
              data: '06/01'
          }))
        },
        {
          name: '新闻',
          newsList: new Array(5).fill({}).map(v => ({
              categoryName: '公告',
              title: '6月2日全服不停机更新公告',
              data: '06/01'
          }))
        },
      ],
      // newsCats: [
      //   {
      //     name: '热门',
      //     newsList: [
      //       {
      //         categoryName: '公告',
      //         title: '6月2日全服不停机更新公告',
      //         data: '06/01'
      //       },
      //       {
      //         categoryName: '公告',
      //         title: '6月2日全服不停机更新公告',
      //         data: '06/01'
      //       },
      //       {
      //         categoryName: '公告',
      //         title: '6月2日全服不停机更新公告',
      //         data: '06/01'
      //       },
      //       {
      //         categoryName: '公告',
      //         title: '6月2日全服不停机更新公告',
      //         data: '06/01'
      //       },
      //       {
      //         categoryName: '公告',
      //         title: '6月2日全服不停机更新公告',
      //         data: '06/01'
      //       },
      //     ]
      heroCats: []
    };
  },
  methods: {
    async fetchNewsCats() {
      const res = await this.$http.get('news/list');
      this.newsCats = res.data;
    },
    async fetchHeroCats() {
      const res = await this.$http.get('heroes/list');
      this.heroCats = res.data;
    }
  },
  created() {
    this.fetchNewsCats();
    this.fetchHeroCats();
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  mounted() {
    console.log('Current Swiper instance object', this.swiper);
    this.swiper.slideTo(3, 1000, false);
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.pagination-home {
  .swiper-pagination-bullet {
    opacity: 1;
    border-radius: 0.1538rem;
    background: #ffffff;
    & .swiper-pagination-bullet-active {
      background-color: map-get($colors, "info");
    }
  }
}
.nav-icons {
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  .nav-items {
    width: 25%;
    border-right: 1px solid $border-color;
    &:nth-child(4n) {
      border-right: none;
    }
  }
}
</style>
