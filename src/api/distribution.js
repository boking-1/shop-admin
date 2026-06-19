import { queryParams } from '~/composables/util'
import axios from '~/axios'

export function getAgentStatistics() {
    return axios.get(`admin/agent/statistics`)
}

export function getAgentList(page, query = {}) {
    let r = queryParams(query)
    return axios.get(`admin/agent/${page}${r}`)
}

export function getAgentOrderList(page, query = {}) {
    let r = queryParams(query)
    return axios.get(`admin/user_bill/${page}${r}`)
}