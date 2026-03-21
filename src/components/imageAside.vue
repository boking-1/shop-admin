<template>

    <el-aside width="220px" class="image-aside" v-loading="loading">
        <div class="top">
            <aside-list v-for="(item, index) in list" ::key="index" :active="activeId == item.id">
                {{ item.name }}
            </aside-list>

        </div>

        <div class="bottom">
            <el-pagination background layout="prev, next" :total="total" :current-page="currentPage" :page-size="limit"
                @current-change="getData" />
        </div>
    </el-aside>
</template>

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
<script setup>
import { getImageClassList } from '~/api/image_class.js';
import { ref } from 'vue'
import AsideList from './AsideList.vue';

const loading = ref(false)
const list = ref([])
const currentPage = ref(1)
const total = ref(0)
const activeId = ref(0)
const limit = ref(10)

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
            }

        })
        .finally(() => loading.value = false)
}
getData()

</script>