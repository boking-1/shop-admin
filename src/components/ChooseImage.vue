<template>
    <div class="flex">
        <div v-if="modelValue">
        <el-image :src="modelValue" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
    </div>
    <div class="choose-image-btn" @click="open">
        <div>
            <el-icon>
                <Plus />
            </el-icon>
        </div>
    </div>
    </div>
    <el-dialog title="选择头像" v-model="dialogVisible" width="80%" top="5vh">


        <el-container class="bg-white rounded" style="height: 70vh;">
            <el-header class=" image-header">
                <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
                <el-button type="warning" size="small" @click="handleUploadFile">上传图片</el-button>
            </el-header>
            <el-container>
                <image-aside ref="imageAsideRef" @select="handleAsideSelect" />
                <image-main ref="imageMainRef" @choose="handleChoose" :openChoose="true"/>
            </el-container>
        </el-container>




        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>


<script setup>
import { ref } from 'vue';
import imageAside from '~/components/imageAside.vue';
import imageMain from '~/components/imageMain.vue';
//打开和关闭头像选择
const dialogVisible = ref(false)
const open = () => dialogVisible.value = true
const close = () => dialogVisible.value = false



const imageAsideRef = ref(null)
const imageMainRef = ref(null)
//选择侧边分类，加载类内图片
const handleAsideSelect = (image_class_id) => {
    imageMainRef.value.loadingData(image_class_id)
}
//打开新增分类抽屉
const handleOpenCreate = () => imageAsideRef.value.handleCreate()
//打开上传文件抽屉
const handleUploadFile = () => imageMainRef.value.openUpLoadFile()



//选择头像
const props = defineProps({
    modelValue: [String, Array]
})
const emit = defineEmits(["update:modelValue"])
let urls = []
const handleChoose = (e) => {
    urls = e.map(o => o.url)
}
//提交
const submit = () => {
    if (urls.length) {
        emit("update:modelValue", urls[0])
    }
    close()
}
</script>
<style>
.choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
</style>