import axios from '~/axios'

export function getCategoryList() {
    return axios.get(`admin/category`)
}

export function updateCategoryStatus(id, status) {
    return axios.post(`admin/category/${id}/update_status`, { status })
}

export function createCategory(name) {
    return axios.post(`admin/category`, name )
}

export function updateCategory(id, name) {
    return axios.post(`admin/category/${id}`, name)
}

export function deleteCategory(id) {
    return axios.post(`admin/category/${id}/delete`)
}

export function getCategoryGoodsList(id) {
    return axios.get(`admin/app_category_item/list?category_id=${id}`)
}

export function deleteCategoryGoods(id) {
    return axios.post(`admin/app_category_item/${id}/delete`)
}

export function connectCategoryGoods(data) {
    return axios.post(`admin/app_category_item`,data)
}