<template>

    <div class="flex gap-2" v-loading="loading">
        <el-tag v-for="(tag, index) in item.goodsSkusCardValue" :key='index' closable :disable-transitions="false"
            @close="handleClose(tag)" effect="plain">

            <el-input v-model="tag.text" placeholder="选项值" size="small" @change="handleChange($event, tag)"
                class=" ml-[-10px] w-20"></el-input>

        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + New Tag
        </el-button>

    </div>
</template>

<script setup>
import { initSkusCardItem } from '~/composables/useSku';
const props = defineProps({
    skuCardId: [Number, String]
})
const {
    item,
    inputVisible,
    handleClose,
    showInput,
    handleInputConfirm,
    InputRef,
    inputValue,
    loading,
    handleChange
} = initSkusCardItem(props.skuCardId)

</script>