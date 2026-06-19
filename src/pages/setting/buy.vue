<template>
    <div class="bg-white p-4 rounded">
        <el-form :model="form" label-width="80px" :inline="false">
            <el-tabs v-model="activeName">
                <el-tab-pane label="支付设置" name="first">
                    <el-table :data="tableData">
                        <el-table-column label="支付方式" align="left">
                            <template #default="{ row }">
                                <div class="flex items-center">
                                    <el-image :src="row.src" fit="cover" :lazy="true" style="width: 40px; height: 40px;"
                                        class="rounded mr-2"></el-image>
                                    <div>
                                        <h6>{{ row.name }}</h6>
                                        <small class="flex text-gray-500 mt-1">{{ row.desc }}</small>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" align="center" width="150">
                            <template #default="{ row }">
                                <el-button type="primary" size="small" @click="handleOpen(row.key)" text>配置</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-form-item class="mt-2">
                        <el-button type="primary" @click="submit">保存</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-tab-pane>

                <el-tab-pane label="购物设置" name="second">

                </el-tab-pane>
            </el-tabs>
        </el-form>

        <FormDrawer ref="formDrawerRef" title="配置" @submit="submit">
            <el-form :model="form" label-width="80px" v-if="drawerType == 'alipay'">
                <el-form-item label="app_id">
                    <el-input v-model="form.alipay.app_id" placeholder="app_id" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="ali_public_key">
                    <el-input v-model="form.alipay.ali_public_key" placeholder="ali_public_key" style="width: 90%;"
                        type="textarea" :rows="4"></el-input>
                </el-form-item>
                <el-form-item label="private_key">
                    <el-input v-model="form.alipay.private_key" placeholder="private_key"
                        style="width: 90%;"></el-input>
                </el-form-item>
            </el-form>

            <el-form :model="form" label-width="100px" v-else>
                <el-form-item label="公众号 APPID">
                    <el-input v-model="form.wxpay.app_id" placeholder="app_id" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="小程序 APPID">
                    <el-input v-model="form.wxpay.miniapp_id" placeholder="miniapp_id" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="小程序 secret">
                    <el-input v-model="form.wxpay.secret" placeholder="secret" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="appid">
                    <el-input v-model="form.wxpay.appid" placeholder="appid" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="商户号">
                    <el-input v-model="form.wxpay.mch_id" placeholder="mch_id" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="API密钥">
                    <el-input v-model="form.wxpay.key" placeholder="key" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="cert_client">
                    <el-upload :action="uploadAction" :headers="{ token }" :limit="1" accept=".pem"
                        :on-success="uploadClientSuccess">
                        <el-button type="primary">点击上传</el-button>
                        <template #tip>
                            <p class="text-rose-500">{{ form.wxpay.cert_client ? form.wxpay.cert_client : "还未配置" }}</p>
                            <div class="el-upload__tip">例如：apiclient_cert.pem</div>
                        </template>
                    </el-upload>
                </el-form-item>

                <el-form-item label="cert_key">
                    <el-upload :action="uploadAction" :headers="{ token }" :limit="1" accept=".pem"
                        :on-success="uploadkeySuccess">
                        <el-button type="primary">点击上传</el-button>
                        <template #tip>
                            <p class="text-rose-500">{{ form.wxpay.cert_key ? form.wxpay.cert_key : "还未配置" }}</p>
                            <div class="el-upload__tip">例如：apiclient_key.pem</div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>



        </FormDrawer>
    </div>
</template>

<script setup>
import { toast } from '~/composables/util';
import { ref, reactive } from 'vue';
import { getSysconfig, setSysconfig, uploadAction } from '~/api/sysconfig';
import FormDrawer from '~/components/FormDrawer.vue';
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

const tableData = [
    {
        name: "支付宝支付",
        desc: "该系统支持即时到账接口",
        src: "/alipay.png",
        key: "alipay"

    },
    {
        name: "微信支付",
        desc: "该系统支持微信网页支付和扫码支付",
        src: "/wepay.png",
        key: "wepay"

    },
]
const drawerType = ref("alipay")
const formDrawerRef = ref(null)
const handleOpen = (key) => {
    drawerType.value = key
    formDrawerRef.value.open()
}
const activeName = ref("first")

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




const uploadClientSuccess = (response, uploadFile, uploadFiles) => {
    form.wxpay.cert_client = response.data
}
const uploadkeySuccess = (response, uploadFile, uploadFiles) => {
    form.wxpay.cert_key = response.data
}

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