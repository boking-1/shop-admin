<template>
    <el-row class="login-container">
        <el-col :lg="16" :md="12" class="left">
            <div>欢迎光临</div>

        </el-col>


        <el-col :lg="8" :md="12" class="right">
            <h2>欢迎回来</h2>
            <div>
                <span class="line"></span>
                <span class="text-sm text-gray-300">账号密码登录</span>
                <span class="line"></span>
            </div>


            <el-form ref="formRef" :model="form" :rules="rules" class="w-[250px]">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password>
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>



                <el-form-item>
                    <el-button :loading="loading" round color="#626aef" type="primary" @click="onSubmit"
                        class="w-[250px]">登录</el-button>
                </el-form-item>
            </el-form>

        </el-col>
    </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { login, getInfo } from '~/api/manager'
import { useRouter } from 'vue-router'
import { setToken } from '~/composables/auth'
import { toast } from '~/composables/util'
import { useStore } from 'vuex'

//输入框验证规则
const rules = {
    username: [
        {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
        },
        // {
        //     min: 3,
        //     max: 15,
        //     message: '长度在 3 到 15 个字符',
        //     trigger: 'blur'
        // },
    ],
    password: [
        {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
        },
        // {
        //     min: 6,
        //     message: '密码长度不能少于 6 位',
        //     trigger: 'blur'
        // }
    ]
}

const formRef = ref(null)
const router = useRouter()
const loading = ref(false)
const store = useStore()
const form = reactive({
    username: '',
    password: ''
})

//登录触发事件
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) {
            return false
        }
        loading.value = true
        // login(form.username, form.password)
        //     .then(res => {
        //         //提示成功
        //        toast("登陆成功！",)
        //         //存储cookie
        //         setToken(res.token)

        //         router.push('/')
        //     })
        //     .finally(() => {
        //         loading.value = false
        //     })
        store.dispatch("login", form).then(res => {
            toast("登陆成功")
            router.push('/')
        }).finally(() => {
            loading.value = false
        })

    })
}

//监听函数
function onKeyUp(e) {
    console.log(e);
    
    if(e.key=="Enter")
    onSubmit()

}
//添加键盘监听器
onMounted(() => {
    document.addEventListener("keyup", onKeyUp)
})
//移除键盘监听器
onBeforeUnmount(()=>{
    document.removeEventListener("keyup",onKeyUp)
})
</script>



<style>
.login-container {
    @apply min-h-screen bg-indigo-500;
}

.login-container .left,
.login-container .right {
    @apply flex items-center justify-center;
}

.login-container .left {
    @apply bg-indigo-500;
}

.login-container .right {
    @apply bg-light-50 flex-col;
}

.left:first-child {
    @apply font-bold text-4xl text-gray-50;
}

.right>h2 {
    @apply font-bold text-3xl text-gray-800;
}

.right>:nth-child(2) {
    @apply flex items-center justify-center space-x-2 my-5;
}

.right .line {
    @apply h-[1px] w-16 bg-gray-300;
}
</style>