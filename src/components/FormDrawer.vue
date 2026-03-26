<template>
    <el-drawer v-model="showDrawer" :destroy-on-close="destroyOnClose" :title="title" :size="size"
        :close-on-click-modal="false">
        <div class="formDrawer">
            <div class="body">
                <slot></slot>
            </div>
            <div class="actions">
                <el-button type="primary" size="large" :loading="loading" @click="submit">{{confirmText}}</el-button>
                <el-button type="default" size="large" @click="close">取消</el-button>
            </div>
        </div>

    </el-drawer>

</template>

<script setup>
import { ref } from 'vue'

const loading=ref(false)
const showDrawer = ref(false)

//打开抽屉组件
const open = () => showDrawer.value = true
//关闭抽屉组件
const close = () => showDrawer.value = false
//loading状态
const showLoading = ()=>loading.value=true
//取消loading
const hideLoading = ()=>loading.value=false

//属性
const props = defineProps({
    title: String,
    destroyOnClose: {
        type:Boolean,
        default: false
    },
    size: {
        type: String,
        default: "45%"
    },
    confirmText: {
        type: String,
        default: "提交"
    }
})
//事件
const emit=defineEmits(["submit"])

const submit=()=>emit("submit")


//向父组件暴露以下方法
defineExpose({
    open,
    close,
    showLoading,
    hideLoading
})
</script>

<style>
.formDrawer {
    width: 100%;
    height: 100%;
    position: relative;
    @apply flex flex-col;
}

.body {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 50px;
    top: 0;
    overflow-y: auto;

}

.actions {
    height: 50px;
    @apply mt-auto flex items-center
}
</style>