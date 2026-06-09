<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '20px' }">

            <ListHeader @create="handleCreate" @refresh="getData" />

            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column prop="name" label="会员等级" align="center" />
                <el-table-column prop="discount" label="折扣率" align="center" />
                <el-table-column prop="level" label="等级序号" align="center" />

                <el-table-column label="状态" width="120">
                    <template #default="{ row }">
                        <el-switch :loading="row.statusLoading" :modelValue="row.status" :active-value="1"
                            :inactive-value="0" @change="handleStatusChange($event, row)" :disabled="row.super == 1">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="small" text @click="handleUpdate(scope.row)">修改</el-button>
                        <el-popconfirm title="是否要删除该会员等级?" confirm-button-text="确认" cancel-button-text="取消"
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
                <el-form-item label="等级名称" prop="name">
                    <el-input v-model="form.name" placeholder="等级名称"></el-input>
                </el-form-item>
                <el-form-item label="等级权重" prop="level">
                    <el-input type="number" v-model="form.level" placeholder="等级权重"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="升级条件">
                    <div>
                        <small class="text-xs mr-2">累计消费满</small>
                        <el-input type="number" v-model="form.max_price" placeholder="累计消费" style="width:50%;">
                            <template #append>元</template>
                        </el-input>
                    </div>

                        <small class="text-gray-500" flex>
                            设置该会员会员等级所需要的累计消费必须大于等于0,单位:元
                        </small>
                    <div>
                        <small class="text-xs mr-2">累计次数满</small>
                        <el-input type="number" v-model="form.max_times" placeholder="累计次数" style="width:50%;">
                            <template #append>笔</template>
                        </el-input>
                    </div>

                        <small class="text-gray-500">
                            设置该会员等级所需要的购买量必须大于等于0,单位:笔
                        </small>



                </el-form-item>
                <el-form-item label="折扣率(%)" prop="discount">
                    <el-input type="number" v-model="form.discount" placeholder="折扣率(%)" style="width:50%;">
                        <template #append>%</template>
                    </el-input>
                    <small class="text-gray-500">
                        折扣率单位为百分比,如输入90,表示该会员等级可以以商品原价的90%购买
                    </small>
                </el-form-item>

            </el-form>
        </FormDrawer>

    </div>
</template>


<script setup>
import { toast } from '~/composables/util';
import { ref, reactive } from 'vue'
import ListHeader from '~/components/ListHeader.vue';
import { getUserLevelList, createUserLevel, updateUserLevel, deleteUserLevel, updateUserLevelStatus } from '~/api/level';
import FormDrawer from '~/components/FormDrawer.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon';
const { searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getUserLevelList,
    delete: deleteUserLevel,
    updateStatus: updateUserLevelStatus,

})
const {
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
} = useInitForm({
    create: createUserLevel,
    update: updateUserLevel,
    form: {
        name: '',
        level: 100,
        discount: 0,
        max_price: 0,
        max_times: 0,
        status: 1
    },
    getData

})



</script>