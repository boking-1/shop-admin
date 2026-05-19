<template>
    <el-drawer title="设置轮播图" v-model="dialogVisible" direction="rtl" size="50%" :destroy-on-close="true">

        <el-form :model="form" label-width="80px" :inline="false" >
            <el-form-item label="轮播图">
                <ChooseImage :limit="9" v-model="form.banners"></ChooseImage>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="loading">立即创建</el-button>
                <el-button @click="dialogVisible=false">取消</el-button>
            </el-form-item>
        </el-form>

    </el-drawer>

</template>

<script setup>
import { ref, reactive } from 'vue'
import ChooseImage from '~/components/ChooseImage.vue'
import { readGoods, setGoodsBanners } from '~/api/goods.js'
import { toast } from '~/composables/util'
const form = reactive({
    banners: []
})
const dialogVisible = ref(false)

const goodId = ref(0)
const open = (row) => {
    goodId.value = row.id
    row.bannersLoading=true
    readGoods(goodId.value).then(res => {
        form.banners = res.goodsBanner.map(o => o.url)
        dialogVisible.value = true
    })
    .finally(()=>{
    row.bannersLoading=false

    })
}
const emit=defineEmits(["reLoadData"])
const loading =ref(false)
const onSubmit=()=>{
    loading.value=true
    setGoodsBanners(goodId.value,form).then(res=>{
        toast("设置轮播图成功")
        dialogVisible.value=false
        emit("reLoadData")
    })
    .finally(()=>{
    loading.value=false

    })
}

defineExpose({
    open
})
</script>