import axios from '~/axios'

export function getRuleList(){
    return axios.get(`admin/rule/1`)
}

export function createRuleList(data){
    return axios.post(`admin/rule`,data)
}

export function updateRuleList(data){
    return axios.post(`admin/rule/193`,data)
}