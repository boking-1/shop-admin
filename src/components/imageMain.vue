<template>
    <el-main class="image-main" v-loading="loading">
        <div class="top p-3">
            <el-row :gutter="10">
                <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
                    <el-card shadow="hover" :body-style="{ padding: '0' }" class="relative mb-3">
                        <el-image :src="item.url" fit="cover" class="w-full h-[150px]"></el-image>
                        <div class="image-title">{{ item.name }}</div>
                        <div class="flex items-center justify-center p-2">
                            <el-button type="primary" size="small" text>重命名</el-button>
                            <el-button type="primary" size="small" text>删除</el-button>
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

</template>

<script setup>
import { ref, reactive } from 'vue'
import { getImageList } from '~/api/image_class'

const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const image_class_id = ref(0)
const list = ref([])
const loading = ref(false)

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

defineExpose({
    loadingData,
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
.image-title{
    position: absolute;
    top: 122px;
    left: -1px;
    right: -1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;

}
</style>