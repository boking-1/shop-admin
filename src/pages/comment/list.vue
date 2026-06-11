<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '20px' }">
            <!-- 搜索 -->
            <Search :model="searchForm" @reset="resetSearchForm" @search="getData">
                <SearchItem label="商品标题">
                    <el-input v-model="searchForm.title" placeholder="商品标题" clearable></el-input>
                </SearchItem>
            </Search>


            <el-table default-expand-all :data="tableData" stripe style="width: 100%" v-loading="loading">

                <el-table-column type="expand">
                    <template #default="{ row }" >
                        <div class="flex pl-18" >
                            <el-avatar :size="50" :src="row.user.avatar" fit="cover" class="mr-3"></el-avatar>
                            <div class="flex-1">
                                <h6 class="flex items-center">
                                    {{ row.user.nickname || row.user.username }}
                                    <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                                    <el-button v-if="!row.textareaEdit && !row.extra" class="ml-auto" size="small" @click="openTextArea(row)">回复</el-button>
                                </h6>
                                {{ row.review.data }}
                                <div class="py-2">
                                    <el-image v-for="(item, index) in row.review.image" :key="index" :src="item"
                                        fit="cover" :lazy="true" style="width: 100px; height: 100px;"
                                        class="rounded"></el-image>
                                </div>
                                
                                <div v-if="row.textareaEdit">
                                    <el-input v-model="textarea" placeholder="请输入评价内容" type="textarea" clearable
                                        :row="2"></el-input>
                                    <div class="py-2">
                                        <el-button type="primary" size="small" @click="review(row)">回复</el-button>
                                        <el-button size="small" class="ml-2" @click="row.textareaEdit=false">取消</el-button>
                                    </div>
                                </div>

                                <template v-else>
                                    <div class="mt-3 bg-gray-100 p-3 rounded" v-for="(item, index) in row.extra"
                                    :key="index">
                                    <h6 class="flex font-bold">
                                        客服
                                        <el-button type="info" size="small"  class="ml-auto" @click="openTextArea(row,item.data)">修改</el-button>
                                    </h6>
                                    <p>{{ item.data }}</p>
                                </div>
                                </template>
                            </div>
                        </div>
                    </template>

                </el-table-column>


                <el-table-column prop="id" label="ID" align="center" width="70"></el-table-column>

                <el-table-column label="商品" width="200">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-image :src="row.goods_item ? row.goods_item.cover : ''" fit="cover"
                                style="width: 50px; height:50px;" class="rounded"></el-image>
                            <div class="ml-3">
                                <h6>{{ row.goods_item?.title ?? "商品已被删除" }}</h6>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="评价信息" width="200">
                    <template #default="{ row }">
                        <div>
                            <p>用户:{{ row.user.nickname || row.user.username }}</p>
                            <p>
                                <el-rate v-model="row.rating" disabled show-score text-color="#ff9900"
                                    score-template="{value}" />
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="评价时间" width="180" align="center" prop="review_time" />

                <el-table-column label="状态">
                    <template #default="{ row }">
                        <el-switch :loading="row.statusLoading" :modelValue="row.status" :active-value="1"
                            :inactive-value="0" @change="handleStatusChange($event, row)" :disabled="row.super == 1">
                        </el-switch>
                    </template>
                </el-table-column>


            </el-table>

        </el-card>
        <!-- 分页 -->
        <div class=" flex items-center justify-center mt-3 ">
            <el-pagination background layout="prev, pager,next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>

    </div>
</template>

<script setup>
import { toast } from '~/composables/util'
import { ref } from 'vue'
import { getGoodsCommentList, updateGoodsCommentStatus,reviewGoodsComment } from '~/api/goods_comment'
import Search from '~/components/Search.vue'
import SearchItem from '~/components/SearchItem.vue'
import { useInitTable } from '~/composables/useCommon.js'
const user_level = ref([])
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
    handleStatusChange
} = useInitTable({
    searchForm: {
        title: "",
    },
    getList: getGoodsCommentList,
    updateStatus: updateGoodsCommentStatus,
    onGetListSuccess: (res) => {
        user_level.value = res.user_level
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            o.textareaEdit = false
            return o
        })
        total.value = res.totalCount
    }
})

const textarea = ref("")
const openTextArea = (row,data="") => {
    textarea.value = data
    row.textareaEdit = true
}
const review = (row) => {
    if(textarea.value=="")
{
    return toast("回复内容不能为空","error")
}
reviewGoodsComment(row.id,textarea.value)
.then(res=>{
    row.textareaEdit=false
    toast("回复成功")
    getData()
})
}
</script>