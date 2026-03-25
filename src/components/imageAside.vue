<template>

    <el-aside width="220px" class="image-aside" v-loading="loading">
        <div class="top">
            <aside-list v-for="(item, index) in list" :key="index" :active="activeId == item.id"
                @edit="handleEdit(item)" @delete="handleDelete(item)" @click="handleSelect(item.id)">
                {{ item.name }}
            </aside-list>

        </div>

        <div class="bottom">
            <el-pagination background layout="prev, next" :total="total" :current-page="currentPage" :page-size="limit"
                @current-change="getData" />
        </div>
    </el-aside>

    <form-drawer ref="formDrawerRef" @submit="handleSubmit" :title="drawerTitle">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" :max="1000" />
            </el-form-item>
        </el-form>

    </form-drawer>

</template>


<script setup>
import {
    getImageClassList,
    createImageClassList,
    updateImageClassList,
    deleteImageClassList
} from '~/api/image_class.js';
import { ref, reactive, computed } from 'vue'
import AsideList from './AsideList.vue';
import FormDrawer from './FormDrawer.vue';
import { toast } from '~/composables/util';

const loading = ref(false)
const list = ref([])
const currentPage = ref(1)
const total = ref(0)
const activeId = ref(0)
const limit = ref(10)
const formDrawerRef = ref(null)
const formRef = ref(null)
const currentId = ref(0)

const emit = defineEmits(["select"])



const handleSelect = (id) => {
    currentId.value = id
    activeId.value = id
    emit("select", id)
}
const form = reactive({
    name: '',
    order: 50
})
//验证规则
const rules = {
    name: [
        {
            required: true,
            message: '分类名称不能为空',
            trigger: 'blur'
        },
    ],
}

//获取第p页的数据
function getData(p = null) {

    if (typeof p == "number") {
        currentPage.value = p
    }

    loading.value = true
    getImageClassList(currentPage.value)
        .then(res => {
            total.value = res.totalCount
            list.value = res.list
            if (list.value[0]) {
                activeId.value = list.value[0].id
                handleSelect(activeId.value)
            }
        })
        .finally(() => loading.value = false)
}
getData()

const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "修改" : "新增")

//新增分类
const handleCreate = () => {
    editId.value = 0
    form.name = ""
    form.order = 50
    formDrawerRef.value.open()
}
//修改分类
const handleEdit = (e) => {
    editId.value = e.id
    form.name = e.name
    form.order = e.order
    formDrawerRef.value.open()
}

//提交修改或新增请求
const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return

        formDrawerRef.value.showLoading()
        const fun = editId.value ? updateImageClassList(editId.value, form) : createImageClassList(form)
        fun
            .then((res) => {
                toast(drawerTitle.value + '成功')
                getData(editId.value ? currentPage.value : 1)
                formDrawerRef.value.close()

            })
            .finally(() => formDrawerRef.value.hideLoading())
    })
}

//删除分类
const handleDelete = (e) => {
    loading.value = true
    deleteImageClassList(e.id)
        .then(res => {
            toast("删除成功")
            getData()
        })
        .finally(() => loading.value = false)
}

defineExpose({
    handleCreate,
})

</script>

<style>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.image-aside .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-aside .bottom {
    @apply flex items-center justify-center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
}
</style>