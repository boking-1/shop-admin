<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '20px' }">
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
                <el-table-column prop="name" label="用户名称" />
                <el-table-column prop="desc" label="角色描述" width="380" />
                <el-table-column label="状态" width="120">
                    <template #default="{ row }">
                        <el-switch :loading="row.statusLoading" :modelValue="row.status" :active-value="1"
                            :inactive-value="0" @change="handleStatusChange($event, row)" :disabled="row.super == 1">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="small" text @click="openSetRule(scope.row)">配置权限</el-button>
                        <el-button type="primary" size="small" text @click="handleUpdate(scope.row)">修改</el-button>
                        <el-popconfirm title="是否要删除此角色?" confirm-button-text="确认" cancel-button-text="取消"
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
                <el-form-item label="用户名称" prop="title">
                    <el-input v-model="form.name" placeholder="用户名称"></el-input>
                </el-form-item>
                <el-form-item label="用户描述" prop="content">
                    <el-input v-model="form.desc" placeholder="用户描述" type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="用户描述" prop="content">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
        <!-- 权限配置 -->
        <FormDrawer title="权限配置" ref="setRuleFormDrawerRef" @submit="handleSetRuleSubmit">
            <el-tree-v2 ref="elTreeRef" style="max-width: 600px" :data="ruleList"
                :props="{ label: 'name', children: 'child' }" node-key="id" :default-expanded-keys="defaultExpendedKeys"
                :height="treeHeight" show-checkbox @check="handleCheck" :check-strictly="checkStrictly">
                <template #default="{ node, data }">
                    <el-tag :type="data.menu ? 'primary' : 'info'" size="small">{{ data.menu ? "菜单" : "权限" }}</el-tag>
                    <span>{{ node.label }}</span>
                </template>
            </el-tree-v2>
        </FormDrawer>
    </div>
</template>


<script setup>
import { toast } from '~/composables/util';
import { ref, reactive } from 'vue'

import { getRoleList, createRole, updateRole, deleteRole, updateRoleStatus, setRoleRules } from '~/api/role';
import { getRuleList } from '~/api/rule';
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
    getList: getRoleList,
    delete: deleteRole,
    updateStatus: updateRoleStatus,

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
    create: createRole,
    update: updateRole,
    form: {
        name: '',
        desc: '',
        status: 1
    },
    getData

})
const elTreeRef = ref(null)
const treeHeight = ref(0)
const ruleList = ref([])
const setRuleFormDrawerRef = ref(null)
//当前角色id
const roleId = ref(0)
//当前角色拥有的权限
const ruleIds = ref([])
const checkStrictly = ref(false)

const defaultExpendedKeys = ref([])
const openSetRule = (row) => {
    roleId.value = row.id
    treeHeight.value = window.innerHeight - 170
    getRuleList()
        .then(res => {
            ruleList.value = res.list
            defaultExpendedKeys.value = res.list.map(o => o.id)
            setRuleFormDrawerRef.value.open()
            ruleIds.value = row.rules.map(o => o.id)
            
            setTimeout(() => {
                elTreeRef.value.setCheckedKeys(ruleIds.value)
                
            }, 150);

        })
}

const handleCheck = (...e) => {
    const { checkedKeys } = e[1]
    ruleIds.value = [...checkedKeys]
}

const handleSetRuleSubmit = () => {
    setRuleFormDrawerRef.value.showLoading()

    setRoleRules(roleId.value, ruleIds.value)
        .then(res => {
            toast("配置成功")
            getData()
            setRuleFormDrawerRef.value.close()
        })
        .finally(() => {
            setRuleFormDrawerRef.value.hideLoading()
        })
}
</script>