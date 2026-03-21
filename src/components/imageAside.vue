<template>

    <el-aside width="220px" class="image-aside">
        <div class="top">
            <aside-list active>
                分类标题
            </aside-list>   
            <aside-list>
                分类标题
            </aside-list>
        </div>

        <div class="bottom">
            分页区域
        </div>
    </el-aside>             
</template>

<style>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.image-aside .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-aside .bottom {
    @apply flex items-center justify-center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
}
</style>
<script setup>
import AsideList from './AsideList.vue';

</script>