import axios from '~/axios'
import { queryParams } from '~/composables/util.js'

export function getGoodsList(page, query = {}) {
    let r = queryParams(query)
    return axios.get(`admin/goods/${page}${r}`)
}

export function updateGoodsStatus(ids, status) {
    return axios.post(`admin/goods/changestatus`, { ids, status })
}

export function createGoods(data) {
    return axios.post(`admin/goods`, data)
}

export function updateGoods(id, data) {
    return axios.post(`admin/goods/${id}`, data)
}

export function deleteGoods(ids) {
    ids=!Array.isArray(ids)?[ids]:ids

    return axios.post(`admin/goods/delete_all`, { ids })
}

export function readGoods(id) {
    return axios.get(`admin/goods/read/${id}`)
}

export function setGoodsBanners(id,banners) {
    return axios.post(`admin/goods/banners/${id}`,banners)
}