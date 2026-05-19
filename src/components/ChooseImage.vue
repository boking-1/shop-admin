<template>
    <div class="flex">
        <div v-if="modelValue">
            <el-image v-if="typeof modelValue == 'string'" :src="modelValue" fit="cover"
                class="w-[100px] h-[100px] rounded border mr-2"></el-image>
            <div v-else class="flex flex-wrap">
                <div class="relative mx-1 mb-2 w-[100px] h-[100px] " v-for="(url, index) in modelValue" :key="index">

                    <el-image :src="url" fit="cover" :lazy="true" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
                    <el-icon class="absolute right-[5px] top-[5px] cursor-pointer" style="z-index:10;"
                        @click="removeImage(url)">
                        <CircleClose />
                    </el-icon>

                </div>
            </div>
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
                <image-main :limit="limit" ref="imageMainRef" @choose="handleChoose" :openChoose="true" />
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
import { toast } from '~/composables/util';
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
    modelValue: [String, Array],
    limit: {
        type: Number,
        default: 1
    }
})
const emit = defineEmits(["update:modelValue"])
let urls = []
const handleChoose = (e) => {
    urls = e.map(o => o.url)
}
//提交
const submit = () => {
    let value = []
    if (props.limit == 1) {
        value = urls[0]
    } else {
        value = [...props.modelValue, ...urls]
        if (value.length > props.limit) {
            toast("最多还能选择" + (value.length - props.limit) + "张")
            return
        }
    }
    if (value) {
        emit("update:modelValue", value)
    }

    close()
}
//移除图片
const removeImage = (url) => {
    emit("update:modelValue", props.modelValue.filter(u => u!= url))
}

</script>
<style>
.choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
</style>