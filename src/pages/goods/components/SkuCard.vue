<template>
    <el-form-item label="规格选项" v-loading="bodyLoading">
        <el-card shadow="never" class="w-full mb-3" v-for="(item, index) in sku_card_list" :key='item.id'" v-loading="item.loading">
            <template #header>
                <div class=" flex items-center">
                    <el-input placeholder="规格名称" style="width: 200px;" v-model="item.text"
                        @change="updateSkuCard(item)">
                        <template #append>
                            <el-icon @click="handleChooseSku" class="cursor-pointer">
                                <More />
                            </el-icon>
                        </template>
                    </el-input>
                    <el-button size="small" @click="sortCard('up',index)" class="ml-auto" :disabled="index==0">
                        <el-icon>
                            <Top />
                        </el-icon>
                    </el-button>
                    <el-button size="small" @click="sortCard('down',index)" :disabled="index==(sku_card_list.length-1)"> 
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
            <SkuCardItem :sku-card-id="item.id"></SkuCardItem>
        </el-card>
        <el-button type="success" size="small" @click="addSkusCardEvent" :loading="btnLoading">添加规格</el-button>

    </el-form-item>

    <!-- 规格选择弹框组件 -->
     <ChooseSku ref="ChooseSkuRef"></ChooseSku>

</template>

<script setup>
    import { ref } from 'vue';
import SkuCardItem from './SkuCardItem.vue';
import ChooseSku from '~/components/ChooseSku.vue';
import { sku_card_list, addSkusCardEvent, btnLoading, updateSkuCard, deleteSkusCard,sortCard,bodyLoading } from '~/composables/useSku.js'

const ChooseSkuRef=ref(null)
const handleChooseSku=()=>{
    ChooseSkuRef.value.open()
}

</script>
<style>
.el-card__header {
    @apply !p-2 bg-gray-200;
}
</style>