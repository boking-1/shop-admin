<template>

    <FormDrawer ref="formDrawerRef" title="推荐商品">

        <el-table :data="tableData" border stripe style="width: 100%;">
            <el-table-column align="center" prop="goods_id" label="ID" width="60" />
            <el-table-column align="center" label="商品封面" width="180">
                <template #default="{ row }">
                    <el-image :src="row.cover" fit="fill" :lazy="true" style="width: 64px; height: 64px;"></el-image>
                </template>
            </el-table-column>


            <el-table-column align="center" prop="name" label="商品名称" width="180" />
            <el-table-column align="center" label="操作">
                <template #default="{ row }">
                    <el-button type="primary" size="small" text @click="handleDelete(row)" :loading="row.loading">删除</el-button>

                </template>
            </el-table-column>

        </el-table>

    </FormDrawer>

</template>

<script setup>
import FormDrawer from '~/components/FormDrawer.vue';
import { ref } from 'vue';
import { getCategoryGoodsList,deleteCategoryGoods } from '~/api/category';
import { toast } from '~/composables/util';
const formDrawerRef = ref(null)
const category_id = ref(0)
const tableData = ref([])
const open = (item) => {
    item.goodsDrawerLoading = true
    category_id.value = item.id
    getData()
        .then(res => {
            formDrawerRef.value.open()
        })
        .finally(() => item.goodsDrawerLoading = false)


}
function getData() {
    return getCategoryGoodsList(category_id.value)
        .then(res => {
            tableData.value = res.map(o=>{
                o.loading=false
                return o
            })
        })
}

const handleDelete=(row)=>{
    row.loading=true
    deleteCategoryGoods(row.id)
    .then(res=>{
        toast("删除成功")
        getData()
    })
    .finally(()=>row.loading=false)
}

defineExpose({
    open,
})
</script>