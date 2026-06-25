# Shop Admin - 电商后台管理系统

一个基于 Vue 3 + Element Plus 构建的现代化电商后台管理系统，提供完整的商品管理、订单管理、用户管理、分销管理等核心功能。

## 技术栈

| 技术 | 说明 | 版本 |
|------|------|------|
| Vue 3 | 渐进式 JavaScript 框架 | ^3.5.29 |
| Vue Router | Vue.js 官方路由管理器 | ^4.6.4 |
| Vuex 4 | Vue.js 状态管理模式 | ^4.0.2 |
| Element Plus | 基于 Vue 3 的组件库 | ^2.13.3 |
| Axios | HTTP 请求库 | ^1.13.6 |
| Vite | 新一代前端构建工具 | ^7.3.1 |
| WindiCSS | 原子化 CSS 框架 | ^3.5.6 |
| ECharts | 可视化图表库 | ^6.0.0 |
| TinyMCE | 富文本编辑器 | ^6.8.3 |

## 功能特性

### 核心功能
- **商品管理**：商品列表、分类管理、规格管理、商品详情编辑、轮播图设置
- **订单管理**：订单列表、订单导出、发货管理、订单详情查看
- **用户管理**：用户列表、会员等级管理、分销员管理
- **评价管理**：商品评价审核与回复
- **系统设置**：基础配置、交易设置、物流设置

### 权限管理
- 动态路由权限控制
- 按钮级权限指令（v-permission）
- Token 认证机制
- 角色与权限分配

### 用户体验
- 响应式布局设计
- 侧边栏折叠/展开
- 骨架屏加载优化
- 键盘快捷键支持（回车登录）
- NProgress 加载进度条

## 项目结构

```
shop-admin/
├── src/
│   ├── api/                  # API 接口模块
│   │   ├── index.js          # 统计接口
│   │   ├── manager.js        # 管理员接口
│   │   ├── goods.js          # 商品接口
│   │   ├── order.js          # 订单接口
│   │   └── ...
│   ├── components/           # 可复用组件
│   │   ├── Search.vue        # 搜索组件
│   │   ├── FormDrawer.vue     # 抽屉表单组件
│   │   ├── ChooseImage.vue   # 图片选择器
│   │   ├── CountTo.vue       # 数字滚动组件
│   │   ├── Editor.vue        # 富文本编辑器
│   │   └── ...
│   ├── composables/          # 组合式函数
│   │   ├── auth.js           # 认证相关
│   │   ├── useCommon.js      # 通用表格/表单逻辑
│   │   ├── useSku.js         # SKU 规格管理
│   │   └── util.js           # 工具函数
│   ├── directives/           # 自定义指令
│   │   └── permission.js     # 权限指令
│   ├── layouts/              # 布局组件
│   │   ├── admin.vue         # 管理后台布局
│   │   └── components/       # 布局子组件
│   ├── pages/                # 页面组件
│   │   ├── goods/            # 商品模块
│   │   ├── order/            # 订单模块
│   │   ├── user/             # 用户模块
│   │   ├── distribution/     # 分销模块
│   │   └── ...
│   ├── router/               # 路由配置
│   │   └── index.js          # 路由定义与动态路由
│   ├── store/                # Vuex 状态管理
│   │   └── index.js          # 状态定义与 actions
│   ├── App.vue               # 根组件
│   ├── main.js               # 应用入口
│   ├── permission.js         # 路由守卫
│   └── axios.js              # Axios 封装
├── public/                   # 静态资源
├── vite.config.js            # Vite 配置
└── package.json              # 项目依赖
```

## 快速开始

### 环境要求
- Node.js ^20.19.0 或 >=22.12.0
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 生产环境打包

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 核心模块说明

### 权限控制实现

项目采用完整的权限控制体系：

1. **路由权限**：通过 `src/permission.js` 全局前置守卫实现
2. **按钮权限**：通过 `v-permission` 自定义指令实现
3. **Token 管理**：通过 `src/composables/auth.js` 管理登录凭证

```javascript
// 权限指令使用示例
<el-button v-permission="['getStatistics3,GET']">查看图表</el-button>
```

### 动态路由机制

```javascript
// 登录后获取菜单，动态添加路由
const { menus } = await store.dispatch("getinfo")
addRoutes(menus) // 根据后端返回的菜单动态注册路由
```

### 组合式函数

项目封装了多个组合式函数以提高代码复用：

- `useInitTable`：通用表格列表逻辑（搜索、分页、批量操作）
- `useInitForm`：通用表单逻辑（新增、编辑、验证）
- `useSku`：商品规格管理逻辑

## 页面预览

项目包含以下主要页面：

| 页面 | 路由 | 说明 |
|------|------|------|
| 登录页 | /login | 用户登录 |
| 首页 | / | 数据统计概览 |
| 商品管理 | /goods/list | 商品列表与编辑 |
| 分类管理 | /category/list | 商品分类 |
| 订单管理 | /order/list | 订单列表 |
| 用户管理 | /user/list | 用户列表 |
| 管理员管理 | /manager/list | 后台用户管理 |
| 角色管理 | /role/list | 角色与权限配置 |
| 分销管理 | /distribution/* | 分销员与设置 |
| 会员等级 | /level/list | 会员等级管理 |
| 优惠券 | /coupon/list | 优惠券管理 |
| 规格管理 | /skus/list | 商品规格模板 |
| 图库管理 | /image/list | 图片素材管理 |
| 公告管理 | /notice/list | 系统公告 |
| 系统设置 | /setting/* | 商城配置 |

## 开发指南

### 添加新页面

1. 在 `src/pages/` 下创建页面组件
2. 在 `src/router/index.js` 的 `asyncRoute` 中添加路由配置
3. 在后端菜单配置中关联该路由

```javascript
{
  path: '/new-page',
  name: '/new-page',
  component: NewPage,
  meta: { title: "新页面" }
}
```

### 添加权限指令

```javascript
// src/directives/permission.js
app.directive("permission", {
  mounted(el, binding) {
    // 检查权限逻辑
  }
})
```

### API 接口规范

```javascript
// src/api/xxx.js
export function getList(page, query = {}) {
  return axios.get(`/api/xxx/${page}`, { params: query })
}

export function create(data) {
  return axios.post("/api/xxx", data)
}

export function update(id, data) {
  return axios.post(`/api/xxx/${id}`, data)
}

export function deleteItem(id) {
  return axios.post(`/api/xxx/${id}/delete`)
}
```

## 环境变量

```bash
# .env.development
VITE_APP_BASE_API=/api

# .env.production
VITE_APP_BASE_API=https://your-api-domain.com
```

## 相关资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Element Plus 官方文档](https://element-plus.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Vue Router 官方文档](https://router.vuejs.org/)
- [Vuex 官方文档](https://vuex.vuejs.org/)

## License

MIT
