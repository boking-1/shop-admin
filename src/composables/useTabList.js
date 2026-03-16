import { ref } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import {router} from '~/router'
export function useTabList() {
    const route = useRoute()
    const cookie = useCookies()
    //激活的标签页
    const activeTab = ref(route.path)
    const tabList = ref([
        {
            title: '后台首页',
            path: '/'
        },
        {
            title: '商城管理',
            path: '/goods/list'
        },
    ])
    //初始化标签
    function initTabList() {
        let tabs = cookie.get("tabList")
        if (tabs) {
            tabList.value = tabs
        }
    }
    initTabList()
    //添加导航的方法
    function addTab(tab) {
        let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
        if (noTab) {
            tabList.value.push(tab)
        }
        cookie.set("tabList", tabList.value)
    }
    //点击菜单添加导航
    onBeforeRouteUpdate((to, from) => {
        addTab({
            title: to.meta.title,
            path: to.path
        })
        activeTab.value = to.path
    })
    // 切换标签，跳转页面
    const tabChange = (t) => {
        activeTab.value = t
        router.push(t)
    }
    //移除标签
    const removeTab = (t) => {
        let tabs = tabList.value
        let a = activeTab.value
        if (a == t) {
            tabs.forEach((item, index) => {
                if (item.path == t) {
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        a = nextTab.path
                    }
                }
            })
        }
        activeTab.value = a
        router.push(a)
        tabList.value = tabList.value.filter(tab => tab.path != t)
        cookie.set("tabList", tabList.value)
    }
    //关闭菜单
    const handleClose = (c) => {
        if (c == "closeAll") {
            tabList.value = [{
                title: '后台首页',
                path: '/'
            }]
            router.push('/')
        }
        else if (c == "closeOther") {
            tabList.value = tabList.value.filter(tab => tab.path == '/' || tab.path == activeTab.value)
        }
        cookie.set("tabList", tabList.value)
    }
    return {
        activeTab,
        tabList,
        tabChange,
        removeTab,
        handleClose
    }
}