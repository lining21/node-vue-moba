<template>
      <m-card :icon="icon" :title="title">
      <div class="nav jc-between">
          <div 
            class="nav-item" 
            :class="{active: active === i}"
            v-for="(category, i) in categories"
            :key="i"
            @click="$refs.list.$swiper.slideTo(i)"
          >
            <div class="nav-link">
              {{ category.name }}
            </div>
          </div>
        </div>
        <div class="pt-3">
         <swiper 
          ref="list"
          :options="{autoHeight: true}"
          @slide-change='()=> active = $refs.list.$swiper.activeIndex'
        >
          <swiper-slide
            v-for="(category, i) in categories" 
            :key="i"
          >
            <!-- <div
              class="py-2"
              v-for="n in 5"
              :key="n"
            >
              <span>[新闻]</span>
              <span>|</span>
              <span>夏日新版本"稷下星之队"即将6月上线</span>
              <span>06/02</span>
            </div> -->
            <slot name="items" :category="category"></slot>
          </swiper-slide>
        </swiper>
      </div>
    </m-card>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    categories: { type: Array, required: true },
  },
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style lang="scss" coped>

</style>
