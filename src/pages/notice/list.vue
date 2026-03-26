<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '20px' }">
            <div class="flex items-center justify-between mb-4">

                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>

                <el-tooltip content="刷新数据" placement="top" effect="dark">
                    <el-button text @click="getData()">
                        <el-icon size="20">
                            <Refresh />
                        </el-icon>
                    </el-button>
                </el-tooltip>
            </div>
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column prop="title" label="公告标题" />
                <el-table-column prop="create_time" label="发布时间" width="380" />
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="small" text @click="handleUpdate(scope.row)">修改</el-button>

                        <el-popconfirm title="是否要删除此公告?" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button type="primary" size="small" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
        <!-- 分页 -->
        <div class=" flex items-center justify-center mt-3 ">
            <el-pagination background layout="prev, pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
        <!-- 抽屉 -->
        <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handleSubmit">

            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="公告标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="form.content" placeholder="公告内容" type="textarea" :rows="5"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<script setup>
import { toast } from '~/composables/util'
import { ref, reactive, computed } from 'vue'
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '~/api/notice'
import FormDrawer from '~/components/FormDrawer.vue'

//公告列表数据
const tableData = ref([])
//加载动画
const loading = ref(false)
//分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

//抽屉组件
const formDrawerRef = ref(null)


//表单
const formRef = ref(null)
const form = reactive({
    title: "",
    content: ""
})
//表单验证规则
const rules = {
    title: [
        {
            required: true,
            message: '公告标题不能为空',
            trigger: 'blur'
        },
    ],
    content: [
        {
            required: true,
            message: '公告内容不能为空',
            trigger: 'blur'
        },
    ],
}

const editId = ref(0)//若为0，抽屉即为新增公告功能，若为公告id，即为修改功能
const drawerTitle = computed(() => editId.value ? '修改公告' : '新增公告')
//重置表单
function resetForm(row = null) {
    if (formRef.value) {
        formRef.value.clearValidate()
    }
    if (row) {
        for (const key in form)
            form[key] = row[key]
    }
}
//新增公告
const handleCreate = () => {
    resetForm({
        title: '',
        content: ''
    })
    editId.value = 0
    formDrawerRef.value.open()
}
//修改公告
const handleUpdate = (row) => {
    editId.value = row.id
    resetForm(row)
    formDrawerRef.value.open()
}
//提交表单-新增或修改公告
const handleSubmit = () => {
    formRef.value.validate(valid => {
        if (!valid) return
        formDrawerRef.value.showLoading()
        console.log(editId.value);

        const fun = editId.value ? updateNotice(editId.value, form) : createNotice(form)
        fun.then(res => {
            toast(editId.value ? "修改成功" : "新增成功")
            //修改刷新当前页，新增刷新第一页
            getData(editId.value ? false : 1)
            formDrawerRef.value.close()
        })
            .finally(() => {
                formDrawerRef.value.hideLoading()
            })
    })
}
//删除公告
const handleDelete = (id) => {
    loading.value = true
    deleteNotice(id)
        .then(res => {
            toast("删除成功")
            getData()
        })
        .finally(() => loading.value = true)
}

//获取数据
const getData = (p = null) => {
    if (typeof p == "number") {
        currentPage.value = p
    }
    loading.value = true
    getNoticeList(currentPage.value)
        .then((res) => {
            tableData.value = res.list
            total.value = res.totalCount
        })
        .finally(() => loading.value = false)
}
getData()





</script>