<template>
    <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">

        <el-container style="height:65vh">
            <el-aside width="220px" class="image-aside" v-loading="loading">
                <div class="top">
                    <div v-for="(item, index) in tableData" :key="index" class="sku-list"
                        :class="{ 'active': (item.id == activeId) }" @click="handleChangeActiveId(item.id)">
                        {{ item.name }}
                    </div>
                </div>
                <div class="bottom">
                    <el-pagination background layout="prev, next" :total="total" :current-page="currentPage"
                        :page-size="limit" @current-change="getData" />
                </div>
            </el-aside>
            <el-main class="image-main">
                <el-checkbox-group v-model="form.list" @change="">
                    <el-checkbox v-for="(item, index) in list" :key="index" :value="item" border>{{ item
                    }}</el-checkbox>
                </el-checkbox-group>



            </el-main>

        </el-container>

        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>


</template>

<script setup>
import { reactive, ref } from 'vue'
import { getGoodsSkusList } from '~/api/goods'
import { useInitTable } from '~/composables/useCommon'
const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
} = useInitTable({
    getList: getGoodsSkusList,
    onGetListSuccess: res => {
        tableData.value = res.list
        total.value = res.totalCount
        if (tableData.value.length>0) {
            handleChangeActiveId(tableData.value[0].id)
        }
    }
})
const dialogVisible = ref(false)


const open = () => {
    getData(1)
    dialogVisible.value = true
}
const close = () => {
    dialogVisible.value = false
}

const form = reactive({
    list: []
})

const activeId = ref(0)
const list = ref([])
function handleChangeActiveId(id) {
    activeId.value = id
    list.value = []
    let item = tableData.value.find(o => o.id == id)
    list.value = item.default.split(",")

}
const submit = () => {

}
defineExpose({
    open
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

.sku-list {
    border-bottom: 1px solid #dbdbdbf4;
    @apply p-3 text-sm text-gray-600 flex justify-center items-center cursor-pointer;

}

.sku-list:hover,
.active {
    @apply bg-blue-100;
}
</style>