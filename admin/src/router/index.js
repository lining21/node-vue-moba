import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import CategoryEdit from '../views/CategoryEdit.vue';
import CategoryList from '../views/CategoryList.vue';

import ItemEdit from '../views/ItemEdit.vue';
import ItemList from '../views/ItemList.vue';

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
      }
    ]
  }
];

const router = new VueRouter({
  routes,
});

export default router;
