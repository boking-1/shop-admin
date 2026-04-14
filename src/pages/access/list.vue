<template>
    <ListHeader @refresh="getData" />
    <div>
        <el-tree  :data="tableData" :props="{label:'name',children:'child'}" node-key="id" 
        :default-expanded-keys="defaultExpendedKeys"
            v-loading="loading" />

    </div>
</template>

<script setup>
import ListHeader from '~/components/ListHeader.vue';
import { getRuleList } from '~/api/rule.js';
import { useInitTable } from '~/composables/useCommon.js'
import {ref} from 'vue'
const defaultExpendedKeys=ref([])
const {
    tableData,
    getData,
    loading
} = useInitTable({
    getList: getRuleList,
    onGetListSuccess:(res)=>{
        tableData.value=res.list
        defaultExpendedKeys.value=res.list.map(o=>o.id)
    }
})


</script>