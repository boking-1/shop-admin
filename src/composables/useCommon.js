import { ref, reactive, computed } from 'vue'
import { toast } from '~/composables/util'

//列表，分页，搜索
export function useInitTable(opt = {}) {
    let searchForm = null
    let resetSearchForm = null
    if (opt.searchForm) {
        searchForm = reactive({ ...opt.searchForm })
        resetSearchForm = () => {
            for (const key in opt.searchForm) {
                searchForm[key] = opt.searchForm[key]
            }
            getData()
        }
    }
    //公告列表数据
    const tableData = ref([])
    //加载动画
    const loading = ref(false)
    //分页
    const currentPage = ref(1)
    const total = ref(0)
    const limit = ref(10)

    //获取数据
    const getData = (p = null) => {
        if (typeof p == "number") {
            currentPage.value = p
        }
        loading.value = true
        opt.getList(currentPage.value, searchForm)
            .then((res) => {
                if (opt.onGetListSuccess && typeof opt.onGetListSuccess == 'function') {
                    opt.onGetListSuccess(res)
                }
                else {
                    tableData.value = res.list
                    total.value = res.totalCount
                }
            })
            .finally(() => loading.value = false)
    }
    getData()
    return {
        searchForm,
        resetSearchForm,
        tableData,
        loading,
        currentPage,
        total,
        limit,
        getData
    }
}


//新增，修改
export function useInitForm(opt = {}) {
    //抽屉组件
    const formDrawerRef = ref(null)
    //表单
    const formRef = ref(null)
    const form = reactive({})
    //表单验证规则
    const rules = opt.rules || {}
    //重置表单
    function resetForm(row = null) {
        if (formRef.value) {
            formRef.value.clearValidate()
        }
        if (row) {
            for (const key in row)
                form[key] = row[key]
        }
    }

    const editId = ref(0)//若为0，抽屉即为新增管理员功能，若为管理员id，即为修改功能
    const drawerTitle = computed(() => editId.value ? '修改管理员' : '新增管理员')

    //新增
    const handleCreate = () => {
        resetForm(opt.form)
        editId.value = 0
        formDrawerRef.value.open()
    }

    //修改
    const handleUpdate = (row) => {
        editId.value = row.id
        resetForm(row)
        formDrawerRef.value.open()
    }

    //提交表单-新增或修改
    const handleSubmit = () => {
        formRef.value.validate(valid => {
            if (!valid) return
            formDrawerRef.value.showLoading()
            const fun = editId.value ? opt.update(editId.value, form) : opt.create(form)
            fun.then(res => {
                toast(editId.value ? "修改成功" : "新增成功")
                //修改刷新当前页，新增刷新第一页
                opt.getData(editId.value ? false : 1)
                formDrawerRef.value.close()
            })
                .finally(() => {
                    formDrawerRef.value.hideLoading()
                })
        })
    }


    return {
        formDrawerRef,
        formRef,
        form,
        rules,
        editId,
        drawerTitle,
        resetForm,
        handleCreate,
        handleSubmit,
        handleUpdate
    }
}