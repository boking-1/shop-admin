<template>
    <el-form :model="model" label-width="80px" :inline="false" size="default">
        <el-row :gutter="20">
            <!-- 搜索栏1 -->
            <slot></slot>
            <!-- 搜索栏2 -->
            <template v-if="showCategory">
                <slot name="show"></slot>
            </template>

            <el-col :span="8" :offset="showCategory ? 0 : 8">
                <div class="flex items-center justify-center">
                    <el-button type="primary" @click="$emit('search')">搜索</el-button>
                    <el-button @click="$emit('reset')">重置</el-button>
                    <el-button type="primary" size="default" @click=" showCategory = !showCategory" text v-if="showSearch">
                        {{ showCategory ? "收起" : "展开" }}
                        <el-icon>
                            <ArrowUp v-if="showCategory" />
                            <ArrowDown v-else />
                        </el-icon>
                    </el-button>

                </div>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref ,useSlots } from 'vue'
const slots=useSlots()
const showSearch=ref(!!slots.show)

const showCategory = ref(false)
defineEmits(["search", "reset"])
defineProps({
    model:Object
})
</script>