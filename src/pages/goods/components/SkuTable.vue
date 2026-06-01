<template>
    <el-form-item label="规格设置">
        <table class="border">
            <thead>
                <tr class="border">
                    <th v-for="(th, thi) in tableThs" :key="thi" class="border" :width="th.width" :colspan="th.colspan"
                        :rowspan="th.rowspan">{{ th.name }}</th>
                </tr>
                <tr> 
                    <th v-for="(th, thi) in skuLabels" :key="thi" class="border" :width="100">{{ th.name }}</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(item, index) in sku_list" :key="index">
                    <td class="border text-center"  v-for="(sku,skui) in item.skus" :key="skui">{{sku.value }}</td>
                    <td class="border">
                        <el-input v-model="item.pprice"  size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="item.oprice"  size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="item.cprice"  size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="item.stock"  size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="item.volume"  size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="item.weight"  size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="item.code"  size="small" type="number"></el-input>
                    </td>
                </tr>
            </tbody>
        </table>



    </el-form-item>


</template>

<script setup>
import { initSkuTable } from '~/composables/useSku';
const {
    skuLabels,
    tableThs,
    sku_list
} = initSkuTable()


</script>