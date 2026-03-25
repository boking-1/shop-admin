<template>
    <div>
        <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
            <el-header class="image-header">
                <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
            </el-header>
            <el-container>
                <image-aside ref="imageAsideRef" @select="handleAsideSelect" />
                <image-main ref="imageMainRef" />
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
import { ref } from 'vue';


const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40
const imageAsideRef = ref(null)

const imageMainRef=ref(null)

const handleAsideSelect=(image_class_id)=>{
    imageMainRef.value.loadingData(image_class_id)
}

const handleOpenCreate = () => imageAsideRef.value.handleCreate()


</script>