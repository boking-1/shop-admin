<template>
    <div v-for="(item,index) in props.skuItem" :key='index'">
    {{ item.text }}
    </div>
</template>

<script setup>

const props=defineProps({
    skuItem:[Array,Object]
})
</script>