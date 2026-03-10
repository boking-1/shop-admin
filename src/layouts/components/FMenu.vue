<template>
  <div class="f-menu" :width="$store.state.asideWidth">
    <el-menu class="border-0 " @select="handleSelect" :collapse="$store.state.isCollapse" unique-opened :default-active="defaultActive">
      <template v-for="(item, index) in asideMenu" :key="index">
        <!-- 二级菜单 -->
        <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <!-- 子菜单 -->
          <el-menu-item v-for="(item2, index2) in item.child" :index="item2.frontpath">
            <el-icon>
              <component :is="item2.icon"></component>
            </el-icon>
            {{ item2.name }}
          </el-menu-item>

        </el-sub-menu>
        <!-- 一级菜单 -->
        <el-menu-item v-else :index="item2.frontpath">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>

    </el-menu>

  </div>
</template>

<style>
.f-menu {
  width: 250px;
  top: 64px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  /* transition: all 0.3s; */
  @apply shadow-md  fixed bg-light-500;

}
</style>

<script setup>
import { useRouter,useRoute } from 'vue-router';
import {ref} from 'vue'
import{useStore} from 'vuex'
const router=useRouter()
const route=useRoute()
const store=useStore()
const defaultActive=ref(route.path)
const asideMenu = store.state.menus
function handleSelect(e){
  console.log(e);
  router.push(e)
}
</script>