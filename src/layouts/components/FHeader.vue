<template>

    <div class="f-header">
        <!-- 左 -->

        <span class="logo">
            <el-icon class="mr-1" :size="50">
                <Shop />
            </el-icon>
            商城后台
        </span>
        <!-- 列表按钮 -->
        <el-tooltip class="box-item" effect="dark" content="更多" placement="bottom" :hide-after="0" >
            <el-icon class="icon-btn" @click="$store.commit('toggleIsCollapse')">
                <Expand />
            </el-icon>
        </el-tooltip>

        <!-- 刷新按钮 -->
        <el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom" :hide-after="0">
            <el-icon class="icon-btn" @click="HandleRefresh">
                <Refresh />
            </el-icon>
        </el-tooltip>


        <!-- 右 -->
        <div class="ml-auto flex items-center">


            <!-- 全屏按钮 -->
            <el-tooltip class="box-item" effect="dark" :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom"
                :hide-after="0">
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <Close v-else />
                </el-icon>
            </el-tooltip>


            <!-- 头像 -->
            <el-avatar :size="50" :src="$store.state.user.avatar" />
            <!-- 下拉菜单 -->
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="el-dropdown-link flex items-center text-light-50">
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword"> 修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <!-- 侧边抽屉 -->
    <!-- <el-drawer v-model="drawer" title="" :with-header="false">
        <span>修改密码</span>
        
    </el-drawer> -->
    <formDrawer ref="formDrawerRef" title="确定" destroyOnClose @submit="onsubmit">
        <el-form ref="FormRef" :model="Form" :rules="rules" label-width="80px">
            <el-form-item label="旧密码" prop="oldpassword" placeholder="请输入旧密码">
                <el-input v-model="Form.oldpassword" />
            </el-form-item>
            <el-form-item label="新密码" prop="password" placeholder="请输入旧密码">
                <el-input v-model="Form.password" />
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword" placeholder="请输入确认密码">
                <el-input v-model="Form.repassword" />
            </el-form-item>

        </el-form>
    </formDrawer>


</template>


<style>
.f-header {
    height: 64px;
    @apply flex bg-indigo-500 text-light-50 items-center fixed top-0 left-0 right-0;
}

;

.logo {
    @apply flex justify-center items-center text-xl font-thin;
    width: 250px;
}

.icon-btn {
    @apply flex justify-center items-center mr-3;
    width: 42px;
    height: 64px;
    cursor: pointer;
    font-size: 25px;
}

.icon-btn:hover {
    @apply bg-indigo-600;
}

.f-header .dropdown {
    height: 64px;
    cursor: pointer;
    @apply flex justify-center items-center mx-4;
}
</style>

<script setup>
import { useFullscreen } from '@vueuse/core'
import FormDrawer from '~/components/FormDrawer.vue'
import { useRePassword, useLogout } from '~/composables/useManager'



const { isFullscreen, toggle } = useFullscreen()
const {
    FormRef,
    formDrawerRef,
    Form,
    formDrawer,
    rules,
    openRePassword,
    onsubmit
} = useRePassword()
const handleLogout = useLogout()


function HandleRefresh() {
    location.reload();
}
function Handlelog() {
    console.log('点击');
    
}

const handleCommand = (c) => {
    switch (c) {
        case "rePassword":
            openRePassword()
            break;
        case "logout":
            handleLogout()
            break;
    }

}







</script>