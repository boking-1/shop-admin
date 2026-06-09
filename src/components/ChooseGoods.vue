<template>
    <el-dialog title="关联商品" v-model="dialogVisible" width="80%" destroy-on-close >

        <el-table ref="multipleTableRef" :data="tableData" stripe v-loading="loading"
            @selection-change="handleSelectionChange" height="300px">

            <el-table-column type="selection" width="55" />
            <!-- 商品 -->
            <el-table-column label="商品">
                <template #default="{ row }">
                    <div class="flex">
                        <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true"
                            style="width:50px;height: 50px;"></el-image>
                        <div class="flex-1">
                            <div>
                                <span>{{ row.title }}</span>
                                <span class="text-rose-500">￥{{ row.min_price }}</span>
                                <el-divider direction="vertical"></el-divider>
                                <span class="text-gray-500">￥{{ row.min_oprice }}</span>
                            </div>
                            <p class="text-gray-400 text-xs mb-1">{{ row.category ? row.category.name : "未分类" }}</p>
                            <p class="text-gray-400 text-xs">创建时间{{ row.create_time }}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>

            <!-- 总库存 -->
            <el-table-column label="总库存" width="90" prop="stock" align="center" />
            <!-- 价格 -->
            <el-table-column label="价格(元)" align="center">
                <template #default="{ row }">
                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                </template>
            </el-table-column>

        </el-table>

        <!-- 分页 -->
        <div class=" flex items-center justify-center mt-3 ">
            <el-pagination background layout="prev, pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </span>
        </template>
    </el-dialog>


</template>

<script setup>
import { useInitTable } from '~/composables/useCommon.js'
import { getGoodsList, updateGoodsStatus, createGoods, updateGoods, deleteGoods, restoreGoods, destoryGoods } from '~/api/goods'


import { ref } from 'vue';
import { toast } from '~/composables/util';
const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleSelectionChange,
    multipleTableRef,
    multiSelectionIds
} = useInitTable({
    searchForm: {
        tab: "all",
        title: "",
        category_id: null
    },
    getList: getGoodsList,
    delete: deleteGoods,
    updateStatus: updateGoodsStatus,
    onGetListSuccess: (res) => {
        tableData.value = res.list
        total.value = res.totalCount
    }
})

const dialogVisible = ref(false)
const callBackFunction = ref(null)
const open = (callback = null) => {
    dialogVisible.value = true
    callBackFunction.value = callback

}

const close = () => {
    dialogVisible.value = false
}

const submit = () => {
    if (typeof callBackFunction.value === "function") {
        callBackFunction.value(multiSelectionIds.value)
        close()
    }
}

defineExpose({
    open,
    close
})

</script>