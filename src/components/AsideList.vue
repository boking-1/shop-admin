<template>
    <div class="asideList" :class="{'active':active}">
                <span class="truncate"><slot></slot></span>
                <el-button text size="small" type="primary" class="ml-auto px-1" @click="$emit('edit')">
                    <el-icon :size="12">
                        <Edit />
                    </el-icon>
                </el-button>
                <el-button text size="small" type="primary" @click="$emit('delete')">
                    <el-icon :size="12">
                        <Close />
                    </el-icon>
                </el-button>
            </div>
</template>
<style>
.asideList {
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    @apply flex items-center justify-center p-3 text-sm text-gray-600;
}

.asideList:hover,
.active {
    @apply bg-blue-50;
}
</style>
<script setup>
defineProps({
    active:{
        type:Boolean,
        default:false
    }
})
defineEmits(["edit","delete"])
</script>