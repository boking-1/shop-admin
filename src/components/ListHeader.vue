<template>
    <div class="flex items-center justify-between mb-4">
        <div>
            <el-button type="primary" v-if="btns.includes('create')" size="small"
                @click="$emit('create')">新增</el-button>
            <el-popconfirm title="是否要删除此规格?" confirm-button-text="确认" cancel-button-text="取消"
                @confirm="$emit('delete')">
                <template #reference>
                    <el-button type="danger" v-if="btns.includes('delete')" size="small">批量删除</el-button>
                </template>
            </el-popconfirm>
        </div>

        <el-tooltip content="刷新数据" placement="top" effect="dark">
            <el-button v-if="btns.includes('refresh')" text @click="$emit('refresh')">
                <el-icon size="20">
                    <Refresh />
                </el-icon>
            </el-button>
        </el-tooltip>
    </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
    layout: {
        type: String,
        default: "create,refresh"
    }
})
const btns = computed(() => props.layout.split(","))
const emit=defineEmits(["create", "refresh","delete"])


</script>