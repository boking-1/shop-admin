<template>
    <formDrawer ref="formDrawerRef" title="设置商品详情" :destroyOnClose="true" @submit="onSubmit">
        <el-form :model="form">
            <el-form-item>
                <Editor v-model="form.content"></Editor>
            </el-form-item>
        </el-form>
    </formDrawer>
    <el-drawer title="" v-model="dialogVisible" direction="rtl" size="50%" :destroy-on-close="true">



    </el-drawer>

</template>

<script setup>
import { ref, reactive } from 'vue'
import { readGoods, updateGoods } from '~/api/goods.js'
import { toast } from '~/composables/util'
import Editor from '~/components/Editor.vue'
import FormDrawer from '~/components/FormDrawer.vue'
const form = reactive({
    content: ''
})
const dialogVisible = ref(false)

const goodId = ref(0)
const formDrawerRef = ref(null)
//打开设置抽屉
const open = (row) => {
    goodId.value = row.id
    row.contentLoading = true
    readGoods(goodId.value).then(res => {
        form.content = res.content
        formDrawerRef.value.open()
    })
        .finally(() => {
            row.contentLoading = false

        })
}
const emit = defineEmits(["reLoadData"])
//提交
const onSubmit = () => {
    formDrawerRef.value.showLoading()
    updateGoods(goodId.value, form).then(res => {
        toast("设置商品详情成功")
        formDrawerRef.value.close()
        emit("reLoadData")
    })
        .finally(() => {
            formDrawerRef.value.hideLoading()
        })
}

defineExpose({
    open
})
</script>