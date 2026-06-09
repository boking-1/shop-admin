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
                <SearchItem label="商品名称">
                    <el-input v-model="searchForm.title" placeholder="商品名称" clearable></el-input>
                </SearchItem>

                <template #show>
                    <SearchItem label="商品分类">
                        <el-select v-model="searchForm.category_id" placeholder="商品分类" clearable>
                            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </SearchItem>
                </template>

            </Search>


            <!-- 新增|刷新 -->
            <ListHeader layout="create,refresh" @create="handleCreate" @refresh="getData">

                <el-button class="ml-2" size="small" @click="multiSelectionDelete" v-if="searchForm.tab != 'delete'"
                    type="danger">批量删除</el-button>
                <el-button class="ml-2" size="small" @click="handleRestoreGoods" v-else type="warning">批量恢复</el-button>
                <el-popconfirm title="是否要彻底删除此该商品?" confirm-button-text="确认" cancel-button-text="取消"
                    @confirm="handleDestoryGoods" v-if="searchForm.tab == 'delete'">
                    <template #reference>
                        <el-button class="ml-2" size="small" type="danger"
                            >彻底删除</el-button>
                    </template>
                </el-popconfirm>

                <el-button class="ml-2" size="small" @click="handleMultiStatusChange(1)"
                    v-if="searchForm.tab == 'all' || searchForm.tab == 'off'">上架</el-button>

                <el-button class="ml-2" size="small" @click="handleMultiStatusChange(0)"
                    v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'">下架</el-button>
            </ListHeader>

            <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%" v-loading="loading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />

                <!-- 商品 -->
                <el-table-column label="商品">
                    <template #default="{ row }">
                        <div class="flex">
                            <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true"
                                style="width:50px;height: 50px;"></el-image>
                            <div class="flex-1">
                                <div>
                                    <span>{{ row.title }}</span>
                                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                                    <el-divider direction="vertical"></el-divider>
                                    <span class="text-gray-500">￥{{ row.min_oprice }}</span>
                                </div>
                                <p class="text-gray-400 text-xs mb-1">{{ row.category ? row.category.name : "未分类" }}</p>
                                <p class="text-gray-400 text-xs">创建时间{{ row.create_time }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <!-- 实际销量 -->
                <el-table-column label="实际销量" width="80" prop="sale_count" align="center" />
                <!-- 商品状态 -->
                <el-table-column label="商品状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="small">{{ row.status ? '上架' : '仓库'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <!-- 审核状态 -->
                <el-table-column label="审核状态" width="120" align="center">
                    <template #default="{ row }">
                        <div v-if="row.ischeck == 0" class="flex flex-col">
                            <el-button type="success" size="small" @click="" plain>审核通过</el-button>
                            <el-button type="danger" size="small" @click="" class="mt-2 !ml-0" plain>审核拒绝</el-button>
                        </div>
                        <span v-else>{{ row.ischeck == 1 ? '通过' : '拒绝' }}</span>
                    </template>
                </el-table-column>
                <!-- 总库存 -->
                <el-table-column label="总库存" width="90" prop="stock" align="center" />
                <!-- 操作 -->
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <div v-if="searchForm.tab != 'delete'">
                            <el-button class="px-1" type="primary" size="small" text
                                @click="handleUpdate(row)">修改</el-button>
                            <el-button class="px-1" size="small" @click="handleSetSkus(row)" :loading="row.skusLoading"
                                text
                                :type="(row.sku_type == 0 && !row.sku_value) || (row.sku_type == 1 && !row.goods_skus.length) ? 'danger' : 'primary'">
                                商品规格
                            </el-button>
                            <el-button class="px-1" :type="row.goods_banner.length == 0 ? 'danger' : 'primary'"
                                size="small" @click="handleSetBanners(row)" :loading="row.bannersLoading"
                                text>设置轮播图</el-button>
                            <el-button class="px-1" :type="row.content == null ? 'danger' : 'primary'" size="small" text
                                @click="handleSetContent(row)" :loading="row.contentLoading">商品详情</el-button>

                            <el-popconfirm title="是否要删除此该商品?" confirm-button-text="确认" cancel-button-text="取消"
                                @confirm="handleDelete(row.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" text>删除</el-button>
                                </template>
                            </el-popconfirm>
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
        <!-- 抽屉 -->
        <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handleSubmit">

            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">

                <el-form-item label="商品名称" prop="title">
                    <el-input v-model="form.title" placeholder="请输入商品名称,不能超过60个字符"></el-input>
                </el-form-item>

                <el-form-item label="封面" prop="cover">
                    <ChooseImage v-model="form.cover" />
                </el-form-item>
                <el-form-item label="商品分类" prop="category_id">
                    <el-select v-model="form.category_id" placeholder="选择商品分类">
                        <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="商品描述" prop="desc">
                    <el-input type="textarea" v-model="form.desc" placeholder="选填，商品卖点"></el-input>
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="form.unit" placeholder="请输入单位" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="总库存" prop="stock">
                    <el-input v-model="form.stock" type="number">
                        <template #append>件</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="库存预警" prop="min_stock">
                    <el-input v-model="form.min_stock" type="number">
                        <template #append>件</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="最低销售价" prop="min_price">
                    <el-input v-model="form.min_price" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="最低原价" prop="min_oprice">
                    <el-input v-model="form.min_oprice" type="number">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="库存显示" prop="stock_display">
                    <el-radio v-model="form.stock_display" label="0" @change="">隐藏</el-radio>
                    <el-radio v-model="form.stock_display" label="1" @change="">显示</el-radio>


                </el-form-item>
                <el-form-item label="是否上架" prop="status">
                    <el-radio v-model="form.status" label="0" @change="">放入仓库</el-radio>
                    <el-radio v-model="form.status" label="1" @change="">立即上架</el-radio>
                </el-form-item>
            </el-form>
        </FormDrawer>
        <!-- 设置轮播图界面 -->
        <banners ref="bannersRef" @reLoadData="getData"></banners>
        <!-- 设置商品详情 -->
        <content ref="contentRef" @reLoadData="getData"></content>
        <!-- 设置商品规格 -->
        <skus ref="skusRef" @reLoadData="getData"></skus>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getGoodsList, updateGoodsStatus, createGoods, updateGoods, deleteGoods, restoreGoods, destoryGoods } from '~/api/goods'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import Search from '~/components/Search.vue'
import SearchItem from '~/components/SearchItem.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
import ListHeader from '~/components/ListHeader.vue'
import { getCategoryList } from '~/api/category'
import banners from './banners.vue'
import content from './content.vue'
import skus from './skus.vue'
import { toast } from '~/composables/util.js'

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
        title: "",
        category_id: null
    },
    getList: getGoodsList,
    delete: deleteGoods,
    updateStatus: updateGoodsStatus,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            o.bannersLoading - false
            o.contentLoading = false
            o.skusLoading = false
            return o
        })
        total.value=res.totalCount
        
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
        title: null,//商品名称
        category_id: null,//商品分类
        cover: null,//商品封面
        desc: null,//商品描述
        unit: "件",//商品单位
        stock: 100,//总库存
        min_stock: 10,//库存预警
        status: 1,//是否上架 0仓库 1上架
        stock_display: 1,//库存显示 0隐藏 1禁用
        min_price: 1.00,//最低销售价
        min_oprice: 100.00//最低原价
    },
    getData,
    update: updateGoods,
    create: createGoods,

})


// 商品标签页
const tabbars = [
    {
        key: "all",
        name: "全部"
    },
    {
        key: "checking",
        name: "审核中"
    },
    {
        key: "saling",
        name: "出售中"
    },
    {
        key: "off",
        name: "已下架"
    },
    {
        key: "min_stock",
        name: "库存预警"
    },
    {
        key: "delete",
        name: "回收站"
    }
]

//商品分类列表
const categoryList = ref([])
getCategoryList().then((res) => {
    categoryList.value = res
})

// 设置轮播图
const bannersRef = ref(null)
const handleSetBanners = (row) => {
    bannersRef.value.open(row)
}
// 设置商品详情
const contentRef = ref(null)
const handleSetContent = (row) => {
    contentRef.value.open(row)
}
// 设置商品规格
const skusRef = ref(null)
const handleSetSkus = (row) => {
    skusRef.value.open(row)
}
//批量恢复
const handleRestoreGoods = () => {
    useMultiAction(restoreGoods, "恢复")
}

//彻底删除
const handleDestoryGoods = () => {
    useMultiAction(destoryGoods, "彻底删除")
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


</script>