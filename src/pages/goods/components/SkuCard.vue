<template>
    <el-form-item label="规格选项">
        <el-card shadow="never" class="w-full mb-3" v-for="(item, index) in sku_card_list" :key='item.id'" v-loading="item.loading">
            <template #header>
                <div class=" flex items-center">
                    <el-input placeholder="规格名称" style="width: 200px;" v-model="item.text"
                        @change="updateSkuCard(item)">
                        <template #append>
                            <el-icon>
                                <More />
                            </el-icon>
                        </template>
                    </el-input>
                    <el-button size="small" @click="" class="ml-auto">
                        <el-icon>
                            <Top />
                        </el-icon>
                    </el-button>
                    <el-button size="small" @click="">
                        <el-icon>
                            <Bottom />
                        </el-icon>
                    </el-button>
                    <el-popconfirm title="是否要删除此该规格选项?" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="deleteSkusCard(item.id)">
                        <template #reference>
                            <el-button size="small"><el-icon>
                                    <Delete />
                                </el-icon></el-button>
                        </template>
                    </el-popconfirm>





                </div>
            </template>
            <SkuCardItem :skuItem="item.goodsSkusCardValue"></SkuCardItem>
        </el-card>
        <el-button type="success" size="small" @click="addSkusCardEvent" :loading="btnLoading">添加规格</el-button>

    </el-form-item>



</template>

<script setup>
import SkuCardItem from './SkuCardItem.vue';
import { sku_card_list, addSkusCardEvent, btnLoading, updateSkuCard, deleteSkusCard } from '~/composables/useSku.js'
</script>
<style>
.el-card__header {
    @apply !p-2 bg-gray-200;
}
</style>