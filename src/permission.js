import { addRoutes, router } from './router'
import { getToken } from './composables/auth'
import { hideFullLoading, showFullLoading, toast } from './composables/util'
import store from './store'

//全局前置守卫

let hasGetInfo=false//是否已经请求getinfo，防止重复请求
router.beforeEach(async (to, from, next) => {
    showFullLoading()
    const token = getToken()
    //没有登录强制跳转到登录页
    if (!token && to.path != '/login') {
        toast("请先登录", "error")
        return next({ path: '/login' })
    }

    //防止重复登录
    if (token && to.path == '/login') {
        toast("请勿重复登陆！", "error")
        return next({ path: from.path })
    }
    //如果已经登录，自动获取用户信息，并存储到vuex中
    let hasNewRoute = false

    if (token&&!hasGetInfo) {
        let { menus } = await store.dispatch("getinfo")
        //动态添加路由
        hasNewRoute = addRoutes(menus)
        // console.log(res.menus)
        hasGetInfo=true
    }
    //设置标题
    let title = (to.meta.title ? to.meta.title : "") + "-商城后台"
    document.title = title
    hasNewRoute ? next(to.fullPath) : next()
})

//全局后置钩子
router.afterEach((to, from) => hideFullLoading())