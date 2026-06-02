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

export function showPrompt(tip, value = '') {
  return ElMessageBox.prompt(tip, '', {
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

//将query对象转化为url参数
export function queryParams(query) {
  let q = []
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`)
    }
  }
  let r = q.join("&")
  r = r ? ("?" + r) : ""
  return r
}

//置换数组中的元素
function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}
//上移
export function useArrayMoveUp(arr, index) {
  swapArray(arr, index, index - 1)
}
//下移
export function useArrayMoveDown(arr, index) {
  swapArray(arr, index, index + 1)
}

//sku排列算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(arguments, function (a, b) {
    var ret = [];
    a.forEach(function (a) {
      b.forEach(function (b) {
        ret.push(a.concat([b]));
      });
    });
    return ret;
  }, [[]]);
}