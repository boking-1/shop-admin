<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '20px' }">
            <!-- 搜索 -->
            <el-form :model="searchForm" label-width="80px" :inline="false" size="default">
                <el-row :gutter="20">
                    <el-col :span="8" :offset="0">
                        <el-form-item label="关键词">
                            <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" :offset="8">
                        <div class="flex items-center justify-center">
                            <el-button type="primary" @click="getData">搜索</el-button>
                            <el-button @click="resetSearchForm">重置</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>


            <!-- 新增|刷新 -->
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

                <el-table-column label="管理员">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar icon="el-icon-user-solid" :size="40" shape="circle" :src="row.avatar" fit="fill">
                            </el-avatar>
                            <div class="ml-3">
                                <h6>{{ row.username }}</h6>
                                <small>ID:{{ row.id }}</small>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="所属角色">
                    <template #default="{ row }">
                        {{ row.role?.name || "-" }}
                    </template>
                </el-table-column>

                <el-table-column label="状态" width="120">
                    <template #default="{ row }">
                        <el-switch :loading="row.statusLoading" :modelValue="row.status" :active-value="1"
                            :inactive-value="0" @change="handleStatusChange($event, row)" :disabled="row.super == 1">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <small class="text-sm text-gray-500" v-if="scope.row.super == 1">暂无操作</small>
                        <div v-else>
                            <el-button type="primary" size="small" text @click="handleUpdate(scope.row)">修改</el-button>
                            <el-popconfirm title="是否要删除此该管理员?" confirm-button-text="确认" cancel-button-text="取消"
                                @confirm="handleDelete(scope.row.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
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
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <ChooseImage v-model="form.avatar" />
                </el-form-item>
                <el-form-item label="所属角色" prop="content">
                    <el-select v-model="form.role_id" placeholder="选择所属角色">
                        <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="状态" prop="content">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<script setup>
import { toast } from '~/composables/util'
import { ref, reactive, computed } from 'vue'
import { getManagerList, updateManagerStatus, createManager, updateManager, deleteManager } from '~/api/manager'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
const roles = ref([])
//列表，分页，搜索
const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData
} = useInitTable({
    searchForm: {
        keyword: ""
    },
    getList: getManagerList,
    onGetListSuccess: (res) => {
        roles.value = res.roles
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            return o
        })
    }
})
//新增，修改
const {
    formDrawerRef,
    formRef,
    form,
    rules,
    drawerTitle,
    handleCreate,
    handleSubmit,
    handleUpdate
} = useInitForm({
    form:{
        username: "",
        password: "",
        role_id: "null",
        status: 1,
        avatar: ""
    },
    getData,
    update:updateManager,
    create:createManager,

})




//删除管理员
const handleDelete = (id) => {
    loading.value = true
    deleteManager(id)
        .then(res => {
            toast("删除成功")
            getData()
        })
        .finally(() => loading.value = true)
}

//修改管理员状态
const handleStatusChange = (status, row) => {
    row.statusLoading = true
    updateManagerStatus(row.id, status)
        .then(res => {
            toast("修改状态成功")
            row.status = status
        })
        .finally(() => {
            row.statusLoading = false

        })
}




</script>