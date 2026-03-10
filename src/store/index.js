import { setToken,removeToken } from '~/composables/auth'
import { toast } from '~/composables/util'
import { createStore } from 'vuex'
import { getInfo, login } from '~/api/manager'
import { handleError } from 'vue'
const store = createStore({
    state() {
        return {
            //用户信息
            user: {},
            asideWidth:'250px',
            isCollapse:false,
            menus:[],
            ruleNames:[]
        }
    },
    mutations: {
        SET_USERINFO(state, user) {
            //记录用户信息
            state.user = user
        },
        toggleIsCollapse(state){
            state.isCollapse=!state.isCollapse
            state.asideWidth=state.isCollapse ? "62.67px":"250px"
        },
        SET_MENUS(state,menus){
            state.menus=menus
        },
        SET_RULENAMES(state,ruleNames){
            state.ruleNames=ruleNames
        }
    },
    actions: {
        //登录
        login({ commit }, { username, password }) {
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    setToken(res.token)
                    resolve(res)
                })
                    .catch(err => reject(err))
            })

        },
        //获取当前用户登录信息
        getinfo({ commit }) {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    commit("SET_USERINFO", res)
                    commit("SET_MENUS",res.menus)
                    commit("SET_RULENAMES",res.ruleNames)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        //退出登录
        logout({ commit }) {
            //清除cookie
            removeToken()
            //清除vuex中user信息
            commit("SET_USERINFO",{})
        }

    }
})

export default store