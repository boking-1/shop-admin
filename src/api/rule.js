import axios from '~/axios'

export function getRuleList(){
    return axios.get(`admin/rule/1`)
}