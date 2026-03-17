<template>
    <el-container>
        <el-header><f-header></f-header></el-header>
        <el-container>
            <el-aside :width="$store.state.asideWidth" class="el-aside"><f-menu></f-menu></el-aside>
            <el-main>
                <f-tag-list></f-tag-list>
                <router-view v-slot="{ Component }">
                    <transition name="fade"  enter-active-class="animate__backInLeft"
                        leave-active-class="animate__backOutRight">
                        <keep-alive :max="10">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>
                </router-view>
            </el-main>

        </el-container>
    </el-container>

</template>

<script setup>
import FHeader from './components/FHeader.vue';
import FMenu from './components/FMenu.vue';
import FTagList from './components/FTagList.vue';
</script>

<style>
.el-aside {
    transition: all 0.3s;
}




/* 页面进入动画 */


@keyframes backInLeft {
    0% {
        transform: translateX(-1000px) scale(0.7);
        opacity: 0;
    }

    80% {
        transform: translateX(0px) scale(0.7);
        opacity: 0.7;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.animate__backInLeft {
    animation: backInLeft 0.6s ease-in-out;
    /* transition-delay: 0s; */
    animation-fill-mode: both;
}

/* 页面退出动画 */
@keyframes backOutRight {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    20% {
        transform: translateX(0px) scale(0.7);
        opacity: 0.7;
    }

    100% {
        transform: translateX(100px) scale(0.7);
        /* 替换2000px为100vw */
        opacity: 0;
    }
}

.animate__backOutRight {
    animation: backOutRight 0.6s ease-in-out;
    animation-fill-mode: both;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    /* 完全透明 */
    transform: translateX(-2000px) scale(0.7);
    /* 和动画初始状态一致 */
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    /* 完全不透明 */
    transform: translateX(0) scale(1);
    /* 最终状态 */
}
</style>