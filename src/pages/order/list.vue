<template>
    <div>
        <div>
            <el-tabs v-model="searchForm.tab" class="demo-tabs" @tab-change="getData">
                <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) in tabbars"
                    :key="index"></el-tab-pane>
            </el-tabs>
        </div>
        <el-card shadow="never" :body-style="{ padding: '20px' }">
            <!-- 搜索 -->
            <Search :model="searchForm" @reset="resetSearchForm" @search="getData">
                <SearchItem label="订单编号">
                    <el-input v-model="searchForm.no" placeholder="订单编号" clearable></el-input>
                </SearchItem>

                <template #show>
                    <SearchItem label="收货人">
                        <el-input v-model="searchForm.name" placeholder="收货人" clearable></el-input>
                    </SearchItem>
                    <SearchItem label="手机号">
                        <el-input v-model="searchForm.phone" placeholder="手机号" clearable></el-input>
                    </SearchItem>
                    <SearchItem label="开始时间">
                        <el-date-picker v-model="searchForm.starttime" type="date" placeholder="开始日期"
                            style="width: 90%;" value-format="YYYY-MM-DD">
                        </el-date-picker>

                    </SearchItem>
                    <SearchItem label="结束时间">
                        <el-date-picker v-model="searchForm.endtime" type="date" placeholder="结束日期" style="width: 90%;"
                            value-format="YYYY-MM-DD">
                        </el-date-picker>
                    </SearchItem>
                </template>

            </Search>


            <!-- 刷新|导出数据 -->
            <ListHeader layout="refresh,download" @refresh="getData" @download="handleDownLoad">

                <el-button class="ml-2" size="small" @click="multiSelectionDelete" type="danger">
                    批量删除
                </el-button>
            </ListHeader>

            <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%" v-loading="loading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />

                <!-- 商品 -->
                <el-table-column label="商品">
                    <template #default="{ row }">
                        <div class="flex text-sm">
                            <div class="flex-1">
                                <p>订单号</p>
                                <small>{{ row.no }}</small>
                            </div>
                            <div>
                                <p>下单时间</p>
                                <small>{{ row.create_time }}</small>
                            </div>
                        </div>
                        <div class="flex" v-for="(item, index) in row.order_items" :key="index">
                            <el-image :src="item.goods_item ? item.goods_item.cover : ''" fit="cover" :lazy="true"
                                style="width: 30px;height: 30px;"></el-image>
                            <p class=" ml-2" :class="item.goods_item ? 'text-blue-500' : 'text-red-500'">
                                {{ item.goods_item ? item.goods_item.title : '商品已被删除' }}
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <!-- 实际付款 -->
                <el-table-column label="实际付款" width="120" prop="total_price" align="center" />
                <!-- 买家 -->
                <el-table-column label="买家" width="120" align="center">
                    <template #default="{ row }">
                        <p>{{ row.user.nickname || row.user.username }}</p>
                        <small>(用户ID{{ row.user.id }})</small>
                    </template>
                </el-table-column>
                <!-- 交易状态 -->
                <el-table-column label="审核状态" width="120" align="center">
                    <template #default="{ row }">
                        <div>
                            付款状态:
                            <el-tag type="primary" size="small" v-if="row.payment_method == 'alipay'">支付宝支付</el-tag>
                            <el-tag type="success" size="small" v-else-if="row.payment_method == 'wechat'">微信支付</el-tag>
                            <el-tag type="info" size="small" v-else>未支付</el-tag>
                        </div>
                        <div>
                            发货状态:
                            <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{ row.ship_data ? '已发货' :
                                '未发货' }}</el-tag>
                        </div>
                        <div>
                            收货状态:
                            <el-tag :type="row.ship_status == 'received' ? 'success' : 'info'" size="small">{{
                                row.ship_status == 'received' ? '已收货' : '未收货' }}</el-tag>
                        </div>
                    </template>
                </el-table-column>

                <!-- 操作 -->
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <div v-if="searchForm.tab != 'delete'">
                            <el-button class="px-1" type="primary" size="small" text
                                @click="openInfoModal(row)">订单详情</el-button>
                            <el-button v-if="searchForm.tab == 'noship'" class="px-1" type="primary" size="small" text
                                @click="">订单发货</el-button>
                            <el-button v-if="searchForm.tab == 'refunding'" class="px-1" type="primary" size="small"
                                text @click="handleRefund(row.id, 1)">同意退款</el-button>
                            <el-button v-if="searchForm.tab == 'refunding'" class="px-1" type="primary" size="small"
                                text @click="handleRefund(row.id, 0)">拒绝退款</el-button>


                        </div>
                        <span v-else>暂无操作</span>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
        <!-- 分页 -->
        <div class=" flex items-center justify-center mt-3 ">
            <el-pagination background layout="prev, pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>
        <exportExcel :tabs="tabbars" ref="exportExcelRef"></exportExcel>
        <infoModal ref="infoModalRef"></infoModal>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getOrderList, deleteOrder } from '~/api/order'
import Search from '~/components/Search.vue'
import SearchItem from '~/components/SearchItem.vue'
import { useInitTable } from '~/composables/useCommon.js'
import ListHeader from '~/components/ListHeader.vue'
import { getCategoryList } from '~/api/category'
import { toast } from '~/composables/util.js'
import exportExcel from './exportExcel.vue'
import infoModal from './infoModal.vue'
import { showModal, showPrompt } from '~/composables/util.js'
import { refundOrder } from '~/api/order.js'

//列表，分页，搜索
const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleMultiStatusChange,
    handleSelectionChange,
    multiSelectionDelete,
    multipleTableRef,
    multiSelectionIds
} = useInitTable({
    searchForm: {
        tab: "all",
        no: "",
        starttime: "",
        endtime: "",
        name: "",
        phone: ""
    },
    getList: getOrderList,
    delete: deleteOrder,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            o.bannersLoading - false
            o.contentLoading = false
            o.skusLoading = false
            return o
        })
        total.value = res.totalCount

    }
})

// 商品标签页
const tabbars = [
    {
        key: "all",
        name: "全部"
    },
    {
        key: "nopay",
        name: "待支付"
    },
    {
        key: "noship",
        name: "代发货"
    },
    {
        key: "noreceived",
        name: "代收货"
    },
    {
        key: "received",
        name: "已收货"
    },

    {
        key: "finish",
        name: "已完成"
    },
    {
        key: "closed",
        name: "已关闭"
    },
    {
        key: "refunding",
        name: "退款中"
    },
]

//商品分类列表
const categoryList = ref([])
getCategoryList().then((res) => {
    categoryList.value = res
})
//导出数据
const exportExcelRef = ref(null)
const handleDownLoad = () => {
    exportExcelRef.value.open()
}

//订单详情
const infoModalRef = ref(null)
const openInfoModal = (row) => {
    infoModalRef.value.open(row)
}


// 批量操作:恢复或彻底删除
function useMultiAction(func, msg) {
    loading.value = true
    func(multiSelectionIds.value)
        .then(res => {
            toast(msg + "成功")
            //清空选中
            if (multipleTableRef.value) {
                multipleTableRef.value.clearSelection()
            }
            getData()
        })
        .finally(() => {
            loading.value = false
        })
}
//同意或拒绝退款
const handleRefund = (id, agree) => {
    (agree ? showModal("是否同意该订单退款?") : showPrompt("请输入拒绝退款理由"))
        .then(({ value }) => {
            let data = { agree }
            if (!agree) {
                data.disagree_reason = value
            }
            refundOrder(id, data)
                .then(res => {
                    getData()
                    toast("操作成功")
                }
                )

        })
}

</script>