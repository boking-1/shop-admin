<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '20px' }">
            <!-- 搜索 -->
            <Search :model="searchForm" @reset="resetSearchForm" @search="getData">
                <SearchItem label="关键词">
                    <el-input v-model="searchForm.keyword" placeholder="手机号/邮箱/会员昵称" clearable></el-input>
                </SearchItem>
                <template #show>
                    <SearchItem label="会员等级">
                        <el-select v-model="searchForm.user_level_id" placeholder="请选择" clearable>
                            <el-option v-for="item in user_level" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>

                    </SearchItem>
                </template>
            </Search>



            <!-- 新增|刷新 -->
            <ListHeader @create="handleCreate" @refresh="getData" />

            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">

                <el-table-column label="会员">
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

                <el-table-column label="会员等级">
                    <template #default="{ row }">
                        {{ row.user_level?.name || "-" }}
                    </template>
                </el-table-column>

                <el-table-column label="登陆注册" align="center">
                    <template #default="{ row }">
                        <p v-if="row.last_login_time">
                            最后登录:{{ row.last_login_time }}
                        </p>
                        <p>
                            注册时间:{{ row.create_time }}
                        </p>

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
                <el-form-item label="昵称" prop="username">
                    <el-input v-model="form.nickname" placeholder="昵称"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <ChooseImage v-model="form.avatar" />
                </el-form-item>
                <el-form-item label="会员等级" prop="user_level_id">
                    <el-select v-model="form.user_level_id" placeholder="选择会员等级">
                        <el-option v-for="item in user_level" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                    </el-select>

                </el-form-item>
                 <el-form-item label="手机" prop="phone">
                    <el-input v-model="form.phone" placeholder="昵称"></el-input>
                </el-form-item>
                 <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="昵称"></el-input>
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
import { ref } from 'vue'
import { getUserList, updateUserStatus, createUser, updateUser, deleteUser } from '~/api/user'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import Search from '~/components/Search.vue'
import SearchItem from '~/components/SearchItem.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
import ListHeader from '~/components/ListHeader.vue'
const user_level = ref([])
//列表，分页，搜索
const {
    searchForm,
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
    searchForm: {
        keyword: "",
        user_level_id: null
    },
    getList: getUserList,
    delete: deleteUser,
    updateStatus: updateUserStatus,
    onGetListSuccess: (res) => {
        user_level.value = res.user_level
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            return o
        })
        total.value=res.totalCount
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
    form: {
        username: "", // 用户名
        password: "", // 密码
        status: 1,  // 状态：1=启用
        nickname: "", // 昵称
        phone: "",    // 手机号
        email: "",    // 邮箱
        avatar: "", // 头像地址
        user_level_id: "", // 用户等级ID
    },
    getData,
    update: updateUser,
    create: createUser,

})
</script>