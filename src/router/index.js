import { createWebHashHistory, createRouter } from 'vue-router'

import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'

import NotFound from '~/pages/404.vue'
import Admin from '~/layouts/admin.vue'
import GoodList from '~/pages/list.vue'
import CategoryList from '~/pages/category/list.vue'

//默认路由
const routes = [
  {
    path: '/',
    name: 'admin',
    component: Admin,
    meta: {
      title: "首页"
    }
  },
  {
    path: '/login',
    name: 'login',
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
  }]
//动态路由
const asyncRoute = [
  {
    path: '/',
    name: '/',
    component: Index,
    meta: {
      title: "主控台"
    }
  },
  {
    path: '/goods/list',
    name: '/goods/list',

    component: GoodList,
    meta: {
      title: "商品管理"
    }
  },
  {
    path: '/category/list',
    name: '/category/list',
    component: CategoryList,
    meta: {
      title: "分类列表"
    }
  }
]
//动态添加路由的方法
export function addRoutes(menus) {
  //是否有新的路由
  let hasNewRoute = false
  const findAndAddRoutesByMenus = (arr) => {
    arr.forEach(e => {
      let item = asyncRoute.find(o => o.path == e.frontpath)
      if (item && !router.hasRoute(item.name)) {
        router.addRoute('admin', item)
        hasNewRoute = true
      }
      if (e.child && e.child.length > 0) {
        findAndAddRoutesByMenus(e.child)
      }
    })
  }
  findAndAddRoutesByMenus(menus)
  console.log(router.getRoutes());
  
  return hasNewRoute
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})



