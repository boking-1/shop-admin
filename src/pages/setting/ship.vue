<template>
    <div class="bg-white p-4 rounded">
        <el-form :model="form" label-width="100px" :inline="false">
            <el-form-item label="物流查询key">
                <div>
                    <el-input v-model="form.ship" placeholder="物流查询key"></el-input>
                <small class="text-gray-500 flex ml-2">
                    用于查询物流信息，接口申请
                </small>
                </div>

            </el-form-item>

            <el-form-item class="mt-2">
                <el-button type="primary" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>



    </div>
</template>

<script setup>
import { toast } from '~/composables/util';
import { ref, reactive } from 'vue';
import { getSysconfig, setSysconfig, uploadAction } from '~/api/sysconfig';
import { getToken } from '~/composables/auth';

const token = getToken()
const form = reactive({
    "close_order_minute": 30,
    "auto_received_day": 7,
    "after_sale_day": 23,
    "alipay": {
        "app_id": "",
        "ali_public_key": "",
        "private_key": ""
    },
    "wxpay": {
        "app_id": "",
        "miniapp_id": "",
        "secret": "",
        "appid": "",
        "mch_id": "",
        "key": "",
        "cert_client": "",
        "cert_key": ""
    },
    "ship": ""
})



const loading = ref(false)

function getData() {
    loading.value = true
    getSysconfig()
        .then(res => {
            for (const key in form) {
                form[key] = res[key]
            }
        })
        .finally(() => loading.value = false)
}
getData()






const submit = () => {
    loading.value = true
    setSysconfig({
        ...form,
    })
        .then(res => {
            toast("修改成功")
            getData()
        })
        .finally(() => loading.value = false)

}

</script>