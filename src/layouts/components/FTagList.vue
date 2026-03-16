<template>
    <div class="f-tag-list" :style="{ left: $store.state.asideWidth }">
        <!-- <el-button size="small" @click="addTab(editableTabsValue)">
            add tab
        </el-button> -->
        <el-tabs v-model="activeTab" type="card" class="demo-tabs" @tab-remove="removeTab" style="min-width: 100px;"
            @tab-change="tabChange">
            <el-tab-pane v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path"
                :closable="item.path != '/'">
                <!-- {{ item.content }} -->
            </el-tab-pane>
        </el-tabs>
        <span class="tag-btn">
            <el-dropdown @command="handleClose">
                <span class="el-dropdown-link">
                    <el-icon class="w-32px h-32px">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="closeAll">关闭全部</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div style="height: 44px;"></div>
</template>

<script setup>
import { useTabList } from '~/composables/useTabList.js';
const {
    activeTab,
    tabList,
    tabChange,
    removeTab,
    handleClose
} = useTabList()
</script>
<style scoped>
.f-tag-list {
    @apply bg-gray-200 flex fixed items-center;
    top: 64px;
    left: 250px;
    right: 0;
    height: 44px;
    z-index: 100;
}

.tag-btn {
    @apply bg-white rounded ml-auto mr-3;
    height: 32px;
    width: 32px;
}

:deep(.el-tabs__header) {
    @apply mb-0
}

:deep(.el-tabs__nav) {
    border: 0 !important;
}

:deep(.el-tabs__item) {
    border: 0 !important;
    height: 32px;
    line-height: 32px;
    @apply bg-white mx-1 rounded;

}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
    line-height: 32px;
    height: 32px;
}
</style>