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
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Home',
  data() {
    return {
      swiperOptions: {
        loop: true,
        pagination: {
          el: '.pagination-home',
        },
        // Some Swiper option/callback...
      },
    };
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
@import './base.scss';
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
</style>
