<template>
    <div>
        <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
            <el-header class="image-header">Header</el-header>
            <el-container>
                <imageAside/>
                <imageMain/>
            </el-container>
        </el-container>
    </div>
</template>
<style>
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}


</style>

<script setup>
import imageAside from '~/components/imageAside.vue';
import imageMain from '~/components/imageMain.vue';
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40
</script>