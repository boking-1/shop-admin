<template>
    <el-drawer title="物流详情" v-model="dialogVisible" direction="rtl" size="30%" :destroy-on-close="true">
        <el-card shadow="never" class="border-0 mb-3">
            <div class="flex  items-center">
                <el-image :src="info.logo" fit="cover" :lazy="true" style="width: 60px; height: 60px;"
                    class="rounded border"></el-image>
                <div class="ml-3">
                    <p>物流公司：{{ info.typename }}</p>
                    <p>物流单号：{{ info.number }}</p>
                </div>
            </div>
        </el-card>


        <el-card shadow="never" class="border-0 mb-3 border-t">
            <el-timeline class="ml-[-40px]">
                <el-timeline-item :timestamp="item.time" placement="top" v-for="(item, index) in info.list"
                    :key="index">
                    {{ item.status }}
                </el-timeline-item>
            </el-timeline>



        </el-card>




    </el-drawer>


</template>

<script setup>
import { toast } from '~/composables/util';
import { ref } from 'vue';
import { getShipInfo } from '~/api/order';

const dialogVisible = ref(false)
const info = ref({})
const open = (id) => {
    return getShipInfo(id)
        .then(res => {
            console.log(res);
            if (res.status != 0) {
                return toast(res.msg, "error")
            }
            info.value = res.result
            dialogVisible.value = true
        })
}
const close = () => dialogVisible.value = false


defineExpose({
    open,
    close
})

</script>