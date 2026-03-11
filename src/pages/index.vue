<template>
   <div>
      首页
      {{ $store.state.user.username}}
      <el-button plain @click="handleLogout">退出登录</el-button>
   
   </div> 
</template>
<script setup>
import { showModal } from '~/composables/util';
import { logout } from '~/api/manager';
import { ElMessage } from 'element-plus'
import {router} from '~/router';
import { useStore } from 'vuex';

const store = useStore()

function handleLogout() {
   showModal("是否退出登录")
      .then(() => {
         logout()

            .finally(() => {
               //
               store.dispatch("logout")
               //提示退出登录成功
               ElMessage({
                  type: 'success',
                  message: '成功退出登录',
               })
               //跳转login页
               router.push('/login')
            })
      })
      .catch(() => {
         ElMessage({
            type: 'info',
            message: '取消退出登录',
         })
      })
}


</script>