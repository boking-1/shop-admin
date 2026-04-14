<template>
    <div>
        <ListHeader @refresh="getData" />

        <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" node-key="id"
            :default-expanded-keys="defaultExpendedKeys" v-loading="loading">

            <template #default="{ node, data }">
                <div class="flex flex-1 items-center justify-center pr-[8px] text-[14px] ">
                    <el-tag :type="data.menu ? '' : 'info'" size="samll">{{ data.menu ? "菜单" : "权限" }}</el-tag>
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon"></component>
                    </el-icon>
                    <span>{{ data.name }}</span>
                    <div class="ml-auto">
                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0">
                        </el-switch>
                        <el-button text type="primary" size="small">修改</el-button>
                        <el-button text type="primary" size="small">增加</el-button>
                        <el-button text type="primary" size="small">删除</el-button>
                    </div>
                </div>
            </template>


        </el-tree>

    </div>
</template>

<script setup>
import ListHeader from '~/components/ListHeader.vue';
import { getRuleList } from '~/api/rule.js';
import { useInitTable } from '~/composables/useCommon.js'
import { ref } from 'vue'
const defaultExpendedKeys = ref([])
const {
    tableData,
    getData,
    loading
} = useInitTable({
    getList: getRuleList,
    onGetListSuccess: (res) => {
        tableData.value = res.list
        defaultExpendedKeys.value = res.list.map(o => o.id)
    }
})


</script>

<style>
.el-tree-node__content{
    padding: 20px 0;
}
</style>