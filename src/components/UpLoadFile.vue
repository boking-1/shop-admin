<template>
  <el-upload class="upload-demo" drag :action="uploadImageAction" multiple name="img" :headers="{
    token
  }" :data="data" :on-success="uploadSuccess" :on-error="uploadError">
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      拖拽文件或<em>点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        大小小于500KB的JPG/PNG文件
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import { UploadFilled } from '@element-plus/icons-vue'
import { uploadImageAction } from '~/api/image'
import { getToken } from '~/composables/auth'
import { toast } from '~/composables/util'

const token = getToken()

defineProps({
  data: Object
})

const emit = defineEmits(["success"])


//上传成功
const uploadSuccess = (response, uploadFile, uploadFiles) => {
  emit("success", {
    response, uploadFile, uploadFiles
  })
  toast("上传成功")
}


//上传失败
const uploadError = (error, uploadFile, uploadFiles) => {
  console.log(error)
  let msg = JSON.parse(error.message).msg || "上传失败"
  toast(msg, "error")
}
</script>