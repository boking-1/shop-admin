<template>
    <div>
        <ListHeader @refresh="getData" @create="handleCreate" />

        <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" node-key="id"
            :default-expanded-keys="defaultExpendedKeys" v-loading="loading">

            <template #default="{ node, data }">
                <div class="flex flex-1 items-center justify-center pr-[8px] text-[14px] ">
                    <el-tag :type="data.menu ? 'primary' : 'info'" size="small">{{ data.menu ? "菜单" : "权限" }}</el-tag>
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon"></component>
                    </el-icon>
                    <span>{{ data.name }}</span>
                    <div class="ml-auto">
                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0"
                            @change="handleStatusChange($event, data)">
                        </el-switch>
                        <el-button text type="primary" size="small" @click.stop="handleUpdate(data)">修改</el-button>
                        <el-button text type="primary" size="small" @click.stop="addChild(data.id)">增加</el-button>
                            <el-popconfirm
                                title="是否要删除此该记录?" confirm-button-text="确认" cancel-button-text="取消"
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
        <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">
                <el-form-item label="上级菜单" prop="rule_id">
                    <el-cascader v-model="form.rule_id" :options="options"
                        :props="{ label: 'name', children: 'child', checkStrictly: true, emitPath: false, value: 'id' }"
                        placeholder="请输入上级菜单" />
                </el-form-item>

                <el-form-item label="菜单/规则" prop="menu">
                    <el-radio-group v-model="form.menu">
                        <el-radio value="1" border>菜单</el-radio>
                        <el-radio value="0" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" style="width: 30%;" placeholder="名称"></el-input>
                </el-form-item>

                <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
                    <IconSelect v-model="form.icon" />
                </el-form-item>
                <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 1 && form.rule_id > 0">
                    <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
                </el-form-item>
                <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
                    <el-input v-model="form.condition" placeholder="后端规则"></el-input>
                </el-form-item>

                <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
                    <el-select v-model="form.method" class="m-2" placeholder="请选择请求方式">
                        <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']" :key="item" :label="item"
                            :value="item">

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000" />
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>

</template>

<script setup>
import ListHeader from '~/components/ListHeader.vue';
import IconSelect from '~/components/IconSelect.vue'
import { getRuleList, updateRuleList, createRuleList, updateRuleStatus, deleteRule } from '~/api/rule.js';
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
import { ref } from 'vue'
import FormDrawer from '~/components/FormDrawer.vue'
const options = ref([])
const defaultExpendedKeys = ref([])
const {

    tableData,
    getData,
    handleDelete,
    handleStatusChange,
    loading
} = useInitTable({
    getList: getRuleList,
    onGetListSuccess: (res) => {
        options.value = res.rules
        tableData.value = res.list
        defaultExpendedKeys.value = res.list.map(o => o.id)
    },
    delete: deleteRule,
    updateStatus: updateRuleStatus
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
        rule_id: 0,
        menu: 0,
        name: '',
        condition: '',
        method: 'GET',
        status: 1,
        order: 50,
        icon: '',
        frontpath: ''
    },
    update: updateRuleList,
    create: createRuleList

})

const addChild = (id) => {
    handleCreate()
    form.rule_id = id
    form.status = 1

}
</script>

<style>
.el-tree-node__content {
    padding: 20px 0;
}
</style>