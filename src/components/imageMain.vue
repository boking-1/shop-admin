<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top p-3">
            <el-row :gutter="10">
                <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
                    <el-card shadow="hover" :body-style="{ padding: '0' }" class="relative mb-3">
                        <el-image :src="item.url" fit="cover" class="w-full h-[150px]" :preview-src-list="[item.url]"
                            :initial-index="0">
                        </el-image>
                        <div class="image-title">{{ item.name }}</div>
                        <div class="flex items-center justify-center p-2">
                            <el-button type="primary" size="small" text @click="handleEdit(item)">重命名</el-button>

                            <el-popconfirm title="是否要删除此图片?" confirm-button-text="确认" cancel-button-text="取消"
                                @confirm="handleDelete(item.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

        </div>
        <div class="bottom">
            <el-pagination background layout="prev, pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
    </el-main>

    <el-drawer title="上传图片" v-model="drawer">
        <UploadFiled :data="{image_class_id}" @success="uploadFlieSuccess"/>
    </el-drawer>

</template>

<script setup>
import { ref, reactive } from 'vue'
import {
    getImageList,
    updateImage,
    deleteImage
} from '~/api/image.js'
import { showPrompt, toast } from '~/composables/util.js'
import UploadFiled from './UploadFile.vue'

const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const image_class_id = ref(0)
const list = ref([])
const loading = ref(false)
const drawer = ref(false)

//打开抽屉
const openUpLoadFile = () => {
    drawer.value = true
}
//上传成功
const uploadFlieSuccess=()=>{
    getData(1)
}


//获取数据
const getData = (p = null) => {
    if (typeof p == "number") {
        currentPage.value = p
    }
    loading.value = true
    getImageList(image_class_id.value, currentPage.value)
        .then((res) => {
            total.value = res.totalCount
            list.value = res.list
        })
        .finally(() => loading.value = false)
}

//跟据分类Id重新加载图片列表
const loadingData = (id) => {
    currentPage.value = 1
    image_class_id.value = id
    getData()
}

//重命名
const handleEdit = (item) => {
    showPrompt("重命名", item.name)
        .then(res => {
            loading.value = true
            updateImage(item.id, res.value)
                .then(res => {
                    toast("修改成功")
                    getData()
                })
                .finally(() => loading.value = false)
        })
}

//删除
const handleDelete = (id) => {
    loading.value = true
    deleteImage([id])
        .then(res => {
            toast("删除成功")
            getData()
        })
        .finally(() => loading.value = false)
}


//暴露给父组件
defineExpose({
    loadingData,
    openUpLoadFile
})
</script>


<style>
.image-main {
    position: relative;
}

.image-main .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-main .bottom {
    @apply flex items-center justify-center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
}

.image-title {
    position: absolute;
    top: 122px;
    left: -1px;
    right: -1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;

}
</style>