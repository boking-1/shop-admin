<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '20px' }">
            <div class="flex items-center justify-between mb-4">

                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>

                <el-tooltip content="刷新数据" placement="top" effect="dark">
                    <el-button text @click="getData()">
                        <el-icon size="20">
                            <Refresh />
                        </el-icon>
                    </el-button>
                </el-tooltip>
            </div>
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column label="优惠卷名称" width="380">
                    <template #default="{ row }">
                        <div class="border border-dashed py-2 px-4 rounded"
                            :class="row.statusText == '领取中' ? 'active' : 'inactive'">
                            <h5 class="font-bold text-md">{{ row.name }}</h5>
                            <small>{{ row.start_time }}~{{ row.end_time }}</small>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="statusText" label="状态" />
                <el-table-column label="优惠">
                    <template #default="{ row }">
                        {{ row.type ? "满减" : "折扣" }} {{ row.type ? ("￥" + row.value) : (row.value + "折") }}
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="发放数量" />
                <el-table-column prop="used" label="已使用数量" />


                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">

                        <el-button v-if="scope.row.statusText == '未开始'" type="primary" size="small" text
                            @click="handleUpdate(scope.row)">修改</el-button>

                        <el-popconfirm v-if="scope.row.statusText != '领取中'" title="是否要删除该优惠券?" confirm-button-text="确认"
                            cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button type="primary" size="small" text>删除</el-button>
                            </template>
                        </el-popconfirm>

                        <el-popconfirm v-if="scope.row.statusText == '领取中'" title="是否让该优惠券失效?" confirm-button-text="确认"
                            cancel-button-text="取消" @confirm="handleStatusChange(0,scope.row)">
                            <template #reference>
                                <el-button type="danger" size="small">失效</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
        <!-- 分页 -->
        <div class=" flex items-center justify-center mt-3 ">
            <el-pagination background layout="prev, pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
        <!-- 抽屉 -->
        <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false" size="default">
                <el-form-item label="优惠券名称" prop="name" style="width: 50%;">
                    <el-input v-model="form.name" placeholder="优惠券名称"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type" @change="">
                        <el-radio :value="0">满减</el-radio>
                        <el-radio :value="1">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="面值" prop="value" style="width: 50%;">
                    <el-input v-model="form.value" placeholder="面值">
                        <template #append>{{ form.type ? "折" : "元" }}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="发行量" prop="total">
                    <el-input-number v-model="form.total" :min="0" :max="10000"></el-input-number>
                </el-form-item>
                <el-form-item label="最低使用价格" prop="min_price">
                    <el-input v-model="form.min_price" placeholder="最低使用价格" type="number"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-date-picker v-model="timerange" type="datetimerange" range-separator="To"
                        start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="优惠券名称"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<script setup>
import { toast } from '~/composables/util'
import { ref, reactive, computed } from 'vue'
import { getCouponList, createCoupon, updateCoupon, deleteCoupon, updateCouponStatus } from '~/api/coupon'
import FormDrawer from '~/components/FormDrawer.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon'

const timerange = computed({
    get() {
        return form.start_time && form.end_time ? [form.start_time, form.end_time] : []
    },
    set(val) {
        form.start_time = val[0]
        form.end_time = val[1]

    }
})
// 格式化优惠券状态
const formatStatus = (row) => {
    let s = "领取中"
    let start_time = (new Date(row.start_time)).getTime()
    let end_time = (new Date(row.end_time)).getTime()
    let now = (new Date()).getTime()
    if (start_time > now) {
        s = "未开始"
    }
    else if (end_time < now) {
        s = "已结束"
    }
    else if (row.status == 0) {
        s = "已失效"
    }
    return s
}
//列表，分页，搜索
const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange

} = useInitTable({
    getList: getCouponList,
    delete: deleteCoupon,
    updateStatus: updateCouponStatus,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => {
            o.statusText = formatStatus(o)
            return o
        })
        total.value = res.totalCount

    }
})

//新增，修改
const {
    formDrawerRef,
    formRef,
    form,
    rules,
    drawerTitle,
    handleCreate,
    handleSubmit,
    handleUpdate
} = useInitForm({
    form: {
        name: "",
        type: 0,
        value: 0,
        total: 100,
        min_price: 0,
        start_time: null,
        end_time: null,
        order: 0
    },
    getData,
    update: updateCoupon,
    create: createCoupon,
    beforeSubmit: (f) => {
        if (typeof f.start_time != "number") {
            f.start_time = (new Date(f.start_time)).getTime()
        }
        if (typeof f.end_time != "number") {
            f.end_time = (new Date(f.end_time)).getTime()
        }
        return f
    }
})


</script>

<style scoped>
.active {
    @apply border-red-200 bg-rose-50 text-red-400;
}

.inactive {
    @apply border-gray-200 bg-gray-50 text-gray-400;

}
</style>