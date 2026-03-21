<template>
    <el-card shadow="never">
        <template #header>
            <div>
                <div class="flex gap-2">
                    <span>订单统计</span>
                    <el-check-tag :checked="current == item.value" @click="handleChange(item.value)"
                        v-for="(item, index) in options" :key="index">{{ item.text }}</el-check-tag>
                </div>
            </div>
        </template>
        <div ref="el" id="chart" style="width:100%; height: 300px;"></div>
    </el-card>


</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts';
import { getStatistics3 } from '~/api/index.js';
import { useResizeObserver } from '@vueuse/core'
const current = ref("week")
const options = [
    {
        text: "近一个月",
        value: 'month'
    },
    {
        text: "近一个周",
        value: 'week'
    },
    {
        text: "近24小时",
        value: 'hour'
    },

]
const handleChange = (t) => {
    current.value = t
    getData()
}
var myChart = null
//界面被挂载后，获取统计图实例
onMounted(() => {
    var chartDom = document.getElementById('chart');
    if (chartDom) {
        myChart = echarts.init(chartDom);
        getData()
    }
})
// 被卸载前销毁实例
onBeforeUnmount(() => {
    if (myChart) echarts.dispose(myChart)
})
function getData() {

    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar'
            }
        ]
    };
    myChart.showLoading()
    getStatistics3(current.value).then(res => {
        option.xAxis.data = res.x
        option.series[0].data = res.y
        myChart.setOption(option);
    }).finally(() => myChart.hideLoading())
}
const el = ref(null)
useResizeObserver(el, (entries) => {
    if (myChart) {
        myChart.resize()
    }
})
</script>