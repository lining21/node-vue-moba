import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import CategoryEdit from '../views/CategoryEdit.vue';
import CategoryList from '../views/CategoryList.vue';

import ItemEdit from '../views/ItemEdit.vue';
import ItemList from '../views/ItemList.vue';

import HeroEdit from '../views/HeroEdit.vue';
import HeroList from '../views/HeroList.vue';

import ArticleEdit from '../views/ArticleEdit.vue';
import ArticleList from '../views/ArticleList.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import(/* webpackChunkName: "about" */ '../views/Main.vue'),
    children:[
      {
        path: '/categories/create',
        name: 'CategoryEdit',
        component: CategoryEdit
      },
      {
        path: '/categories/edit/:id',
        name: 'CategoryEdit',
        component: CategoryEdit,
        props: true
      },
      {
        path: '/categories/list',
        name: 'CategoryList',
        component: CategoryList
      },
      {
        path: '/items/create',
        name: 'ItemEdit',
        component: ItemEdit
      },
      {
        path: '/items/edit/:id',
        name: 'ItemEdit',
        component: ItemEdit,
        props: true
      },
      {
        path: '/items/list',
        name: 'ItemList',
        component: ItemList
      },

      {
        path: '/heroes/create',
        name: 'HeroEdit',
        component: HeroEdit
      },
      {
        path: '/heroes/edit/:id',
        name: 'HeroEdit',
        component: HeroEdit,
        props: true
      },
      {
        path: '/heroes/list',
        name: 'HeroList',
        component: HeroList
      },

      {
        path: '/articles/create',
        name: 'ArticleEdit',
        component: ArticleEdit
      },
      {
        path: '/articles/edit/:id',
        name: 'ArticleEdit',
        component: ArticleEdit,
        props: true
      },
      {
        path: '/articles/list',
        name: 'ArticleList',
        component: ArticleList
      }
    ]
  }
];

const router = new VueRouter({
  routes,
});

export default router;
