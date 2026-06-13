import axios from '~/axios'
import { queryParams } from '~/composables/util.js'

export function getOrderList(page, query = {}) {
    let r = queryParams(query)
    return axios.get(`admin/order/${page}${r}`, query)
}

export function deleteOrder(ids) {
    ids = !Array.isArray(ids) ? [ids] : ids

    return axios.post(`admin/order/delete_all`, { ids })
}

export function exportOrder(query = {}) {
    let r = queryParams(query)
    return axios.post(`admin/order/excelexport${r}`, {}, {
        responseType: "blob"
    })
}

