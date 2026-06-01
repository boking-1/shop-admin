<template>
    <formDrawer ref="formDrawerRef" title="设置商品规格" :destroyOnClose="true" @submit="onSubmit">
        <el-form :model="form" ref="formRef" label-width="80px" :inline="false">

            <el-form-item label="规格类型">
                <el-radio-group v-model="form.sku_type">
                    <el-radio :value="0" border>
                        单规格
                    </el-radio>
                    <el-radio :value="1" border>
                        多规格
                    </el-radio>
                </el-radio-group>
            </el-form-item>

            <!-- 单规格 -->
            <template v-if="form.sku_type == 0">
                <el-form-item label="市场价格">
                    <el-input v-model="form.sku_value.oprice" style="width:35%">
                        <template #append>元</template>
                    </el-input>

                </el-form-item>
                <el-form-item label="销售价格">
                    <el-input v-model="form.sku_value.pprice" style="width:35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="成本价格">
                    <el-input v-model="form.sku_value.cprice" style="width:35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="商品重量">
                    <el-input v-model="form.sku_value.weight" style="width:35%">
                        <template #append>公斤</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="商品体积">
                    <el-input v-model="form.sku_value.volume" style="width:35%">
                        <template #append>立方米</template>
                    </el-input>
                </el-form-item>
            </template>

            <!-- 多规格 -->
            <template v-else>
                <SkuCard></SkuCard>
                <SkuTable></SkuTable>
            </template>

        </el-form>

    </formDrawer>
    <el-drawer title="" v-model="dialogVisible" direction="rtl" size="50%" :destroy-on-close="true">



    </el-drawer>

</template>

<script setup>
import { ref, reactive } from 'vue'
import { readGoods, updateGoodsSkus } from '~/api/goods.js'
import { toast } from '~/composables/util'
import FormDrawer from '~/components/FormDrawer.vue'
import SkuCard from './components/SkuCard.vue'
import SkuTable from './components/SkuTable.vue'

import { goodId, initSkuCardList } from '~/composables/useSku.js'
const form = reactive({
    "sku_type": 0,
    "sku_value": {
        "oprice": 0,
        "pprice": 0,
        "cprice": 0,
        "weight": 0,
        "volume": 0
    },
})
const dialogVisible = ref(false)

const formDrawerRef = ref(null)
//打开设置抽屉
const open = (row) => {
    goodId.value = row.id
    row.skusLoading = true
    readGoods(goodId.value).then(res => {
        form.sku_type = res.sku_type
        form.sku_value = res.sku_value || {
            "oprice": 0,
            "pprice": 0,
            "cprice": 0,
            "weight": 0,
            "volume": 0
        }
        initSkuCardList(res)

        formDrawerRef.value.open()
    })
        .finally(() => {
            row.skusLoading = false

        })
}
const emit = defineEmits(["reLoadData"])
//提交
const onSubmit = () => {
    formDrawerRef.value.showLoading()
    updateGoodsSkus(goodId.value, form).then(res => {
        toast("设置商品规格成功")
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