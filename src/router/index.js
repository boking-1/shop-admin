import { createWebHashHistory, createRouter } from 'vue-router'

import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'

import NotFound from '~/pages/404.vue'
import Admin from '~/layouts/admin.vue'
import GoodList from '~/pages/list.vue'

const routes = [
  {
    path: '/',
    component: Admin,
    children: [
      {
        path: '/',
        component: Index,
        meta: {
          title: "主控台"
        }
      },
      {
        path: '/goods/list',
        component: GoodList,
        meta: {
          title: "商品管理"
        }
      }

    ]
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: "登录页"

    }
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: "404 Not Found"

    }
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})


export default router