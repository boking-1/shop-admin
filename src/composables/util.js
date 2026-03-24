import { ElNotification } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import nprogress from 'nprogress'

export function toast(message, type = 'success', dangerouslyUseHTMLString = true) {
  ElNotification({
    message,
    type,
    dangerouslyUseHTMLString,
    duration: 3000
  })
}

export function showModal(content = "提示内容", type = "") {
  return ElMessageBox.confirm(
    content,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )

}

//开启全局loading
export function showFullLoading() {
  nprogress.start()
}

//隐藏全局loding
export function hideFullLoading() {
  nprogress.done()
}
