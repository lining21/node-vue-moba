import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import CategoryEdit from '../views/CategoryEdit.vue';
import CategoryList from '../views/CategoryList.vue';

import ItemEdit from '../views/ItemEdit.vue';
import ItemList from '../views/ItemList.vue';

import HeroEdit from '../views/HeroEdit.vue';
import HeroList from '../views/HeroList.vue';

import ArticleEdit from '../views/ArticleEdit.vue';
import ArticleList from '../views/ArticleList.vue';

import AdEdit from '../views/AdEdit.vue';
import AdList from '../views/AdList.vue';

import AdminUserEdit from '../views/AdminUserEdit.vue';
import AdminUserList from '../views/AdminUserList.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login', 
    name:"login", 
    component: Login,
    meta: {
      isPublic: true
    }
  },
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
      },

      {
        path: '/ads/create',
        name: 'AdEdit',
        component: AdEdit
      },
      {
        path: '/ads/edit/:id',
        name: 'AdEdit',
        component: AdEdit,
        props: true
      },
      {
        path: '/ads/list',
        name: 'AdList',
        component: AdList
      },

      {
        path: '/admin_users/create',
        name: 'AdminUserEdit',
        component: AdminUserEdit
      },
      {
        path: '/admin_users/edit/:id',
        name: 'AdminUserEdit',
        component: AdminUserEdit,
        props: true
      },
      {
        path: '/admin_users/list',
        name: 'AdminUserList',
        component: AdminUserList
      },
    ]
  }
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to,from,next)=>{
  if (!to.meta.isPublic && !localStorage.token) {
    return next('/login');
  }
  next();
})

export default router;
