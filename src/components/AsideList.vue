<template>
    <div class="asideList" :class="{ 'active': active }">
        <span class="truncate">
            <slot></slot>
        </span>
        <el-button text size="small" type="primary" class="ml-auto px-1" @click.stop="$emit('edit')">
            <el-icon :size="12">
                <Edit />
            </el-icon>
        </el-button>

        <el-popconfirm title="是否要删除此类?" confirm-button-text="确认" cancel-button-text="取消" @confirm="$emit('delete')">
            <template #reference>
                <el-button text size="small" type="primary" >
                    <el-icon :size="12">
                        <Close />
                    </el-icon>
                </el-button>
            </template>
        </el-popconfirm>


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
    active: {
        type: Boolean,
        default: false
    }
})
defineEmits(["edit", "delete"])
</script>