import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/scss/style.scss';
import './assets/iconfont/iconfont.css';

// import style (>= Swiper 6.x)
import 'swiper/swiper-bundle.css';

// import style (<= Swiper 5.x)
// import 'swiper/css/swiper.css'

import Card from './components/Card.vue';
Vue.component('m-card', Card);

import ListCard from './components/ListCard.vue';
Vue.component('m-list-card', ListCard);

import axios from "axios";
Vue.prototype.$http = axios.create({
  baseURL: 'http://localhost:3000/web/api'
})

Vue.use(VueAwesomeSwiper);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
