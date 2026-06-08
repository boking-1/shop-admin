<template>
    <div>
        <ListHeader @refresh="getData" @create="handleCreate" />

        <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" node-key="id"
             v-loading="loading">

            <template #default="{ node,data }">
                <div class="flex flex-1 items-center justify-center pr-[8px] text-[14px] ">
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon"></component>
                    </el-icon>
                    <span>{{ data.name }}</span>
                    <div class="ml-auto">
                        <el-button text type="primary" size="small" @click.stop="openGoodsDrawer(data)" :loading="data.goodsDrawerLoading">推荐产品</el-button>

                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0"
                            @change="handleStatusChange($event, data)">
                        </el-switch>
                        <el-button text type="primary" size="small" @click.stop="handleUpdate(data)">修改</el-button>
                        <el-popconfirm title="是否要删除此该分类?" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDelete(data.id)">
                            <template #reference>
                                <el-button type="primary" size="small" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>

            </template>
        </el-tree>

        <!-- 抽屉 -->
        <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handleSubmit()">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">

                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" style="width: 30%;" placeholder="分类名称"></el-input>
                </el-form-item>

                
            </el-form>
        </FormDrawer>

        <GoodsDrawer ref="goodsDrawerRef"></GoodsDrawer>
    </div>

</template>

<script setup>
import ListHeader from '~/components/ListHeader.vue';
import { updateCategoryStatus, getCategoryList,updateCategory,createCategory,deleteCategory } from '~/api/category.js';
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
import FormDrawer from '~/components/FormDrawer.vue'
import GoodsDrawer from './components/GoodsDrawer.vue';
import { ref } from 'vue';
const {

    tableData,
    getData,
    handleDelete,
    handleStatusChange,
    loading
} = useInitTable({
    getList: getCategoryList,
    onGetListSuccess: (res) => {
        tableData.value = res.map(o=>{
            o.goodsDrawerLoading=false
            return o
        })
    },
    delete:deleteCategory,
    updateStatus: updateCategoryStatus
})
const {
    formDrawerRef,
    formRef,
    form,
    handleCreate,
    handleSubmit,
    handleUpdate,
    rules,
    drawerTitle
} = useInitForm({
    form: {
        name:''
    },
    getData,
    update: updateCategory,
    create: createCategory

})

const goodsDrawerRef=ref(null)
const openGoodsDrawer=(item)=>{
    goodsDrawerRef.value.open(item)
}


</script>

<style>
.el-tree-node__content {
    padding: 20px 0;
}
</style>