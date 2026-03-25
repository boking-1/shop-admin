import { ElNotification } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import nprogress from 'nprogress'

//消息提示框
export function toast(message, type = 'success', dangerouslyUseHTMLString = true) {
  ElNotification({
    message,
    type,
    dangerouslyUseHTMLString,
    duration: 3000
  })
}

//弹出确认框
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

//提交内容弹出框

export function showPrompt(tip,value='')
{
   return ElMessageBox.prompt(tip,'', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: value,
  })
}


//开启全局loading
export function showFullLoading() {
  nprogress.start()
}

//隐藏全局loding
export function hideFullLoading() {
  nprogress.done()
}
