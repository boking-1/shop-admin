import axios from '~/axios'

export function getRuleList(){
    return axios.get(`admin/rule/1`)
}

export function createRuleList(data){
    return axios.post(`admin/rule`,data)
}

export function updateRuleList(id,data){
    return axios.post(`admin/rule/${id}`,data)
}

export function updateRuleStatus(id,status){
    return axios.post(`admin/rule/${id}/update_status`,{status})
}

export function deleteRule(id){
    return axios.post(`admin/rule/${id}/delete`)
}

