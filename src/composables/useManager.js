import { ref, reactive } from 'vue'
import { showModal, toast } from '~/composables/util';
import { rePassword, logout } from '~/api/manager';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'



export function useRePassword() {
    const router = useRouter()
    const store = useStore()
    const FormRef = ref(null)
    const formDrawerRef = ref(null)
    const openRePassword = () => formDrawerRef.value.open()

    const Form = reactive({
        oldpassword: "",
        password: "",
        repassword: ""
    })
    const rules = {
        oldpassword: [
            { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        repassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' }
        ],
    }
    const formDrawer = ref(null)
    function onsubmit() {
        FormRef.value.validate((valid) => {
            if (!valid) {
                return false
            }
            formDrawerRef.value.showLoading()
            rePassword(Form)
                .then((res) => {
                    toast("修改密码成功，请重新登录")
                    router.push('/login')
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    formDrawerRef.value.hideLoading()
                })

        })
    }

    return {
        FormRef,
        formDrawerRef,
        Form,
        formDrawer,
        openRePassword,
        onsubmit
    }

}

export function useLogout() {
    const router = useRouter()
    const store = useStore()
    function handleLogout() {
        showModal("是否要退出登录")
            .then(res => {
                logout().finally(() => {
                    store.dispatch("logout")
                    router.push('/login')
                    toast("已退出登录")
                })
            })
            .catch((err)=>{
                console.log(err);
                
            })
    }
    return handleLogout
}