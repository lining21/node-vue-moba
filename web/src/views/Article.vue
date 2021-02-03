<template>
  <div class="page-article" v-if="model">
    <div class="d-flex ai-center py-3 px-2 border-bottom">
      <div class="iconfont icon-menu text-blue"></div>
      <strong class="flex-1 text-blue pl-2">
        {{ model.title }}
      </strong>
      <div class="text-grey fs-xm">
        2019-2-16
      </div>
    </div>
    <div v-html="model.body" class="px-3 article-body fs-lg"></div>
    <div class="px-3 border-top py-2">
      <div class="d-flex ai-center">
        <i class="iconfont icon-menu"></i>
        <strong class="text-blue fs-lg ml-1">相关资讯</strong>
      </div>
      <div class="pt-2 fs-lg">
        <router-link
          class="py-1"
          tag="div"
          :to="`/articles/${item._id}`"
          v-for="item in model.relate"
          :key=item.id
        >
          {{item.title}} 
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      model: null
    }
  },
  watch: {
    id: "fetch",
    // id() {
    //   this.fetch();
    // }
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`articles/${this.id}`);
      this.model = res.data;
    }
  }
}
</script>

<style lang="scss">
.page-article {
  .icon-menu {
    font-size: 1.5385rem;
  }
  .article-body {
    img {
      max-width: 100%;
      height: auto;
    }
    iframe {
      width: 100%;
      height: auto;
    }
  }
}
</style>