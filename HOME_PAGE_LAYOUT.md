# 网站首页布局文档

> **重要提示：每次修改代码后，必须同步更新本文档！**

## 文档更新记录

| 日期 | 修改内容 | 修改人 |
|------|---------|--------|
| 2025-12-20 | 初始文档创建 | - |

---

## 1. 整体布局结构

网站首页 (`index.html`) 采用单页应用（SPA）架构，主要包含以下区域：

```
┌─────────────────────────────────────────┐
│          Header (固定顶部)               │
│  Logo + 标题 + Order按钮 + Download按钮  │
├─────────────────────────────────────────┤
│                                         │
│    Top Scroll View (iframe)            │
│    高度: 视口高度的99%                  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│    Tag Scroll View (iframe)            │
│    动态高度，通过postMessage调整         │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│          Footer Section                │
│  ┌──────────────┬──────────────────┐  │
│  │ 左侧:         │ 右侧:            │  │
│  │ 环境展示      │ 外送平台按钮      │  │
│  │ (iframe)     │ 联系信息          │  │
│  │              │ 社交媒体          │  │
│  │              │ Google地图        │  │
│  └──────────────┴──────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 2. 主要组件详解

### 2.1 Header（头部区域）

**位置**: 页面顶部，固定定位  
**文件**: `index.html` (第52-61行), `home.css` (第9-23行), `home.js` (第267-327行)

#### HTML 结构
```html
<header class="header christmas-header">
    <div class="header-title-container">
        <img src="logo.png" alt="JOJO TEA SHOPPE Logo" class="header-logo">
        <h1 class="header-title">Welcome to <span class="christmas-accent">JOJO TEA SHOPPE</span></h1>
    </div>
    <div class="header-buttons">
        <button class="order-button" id="orderButton">Order</button>
        <button class="download-button" id="downloadButton">Download App</button>
    </div>
</header>
```

#### 样式特性
- **定位**: `position: fixed` - 始终悬浮在窗口顶部
- **层级**: `z-index: 1000` - 确保在其他内容之上
- **背景**: `rgba(0, 0, 0, 0.7)` - 半透明黑色背景
- **响应式**: 移动端自动调整字体和按钮大小

#### 交互功能
- **滚动透明度控制** (`home.js` 第267-327行):
  - 向下滚动：头部逐渐变透明（最小透明度 0.1）
  - 向上滚动：头部逐渐变不透明
  - 在顶部：完全不透明（opacity: 1）
- **Order 按钮**: 点击显示订单类型选择模态
- **Download App 按钮**: 
  - iOS 设备 → 跳转 App Store
  - Android 设备 → 跳转 Google Play
  - 其他设备 → 默认跳转 Google Play

#### 修改注意事项
- 修改头部样式时，需同时更新 `home.css` 中的 `.header` 样式
- 修改滚动效果时，需更新 `home.js` 中的 `setupHeaderScrollEffect()` 函数
- 修改按钮功能时，需更新 `home.js` 中的相应事件监听器

---

### 2.2 Top Scroll View（顶部滚动视图）

**位置**: Header 下方  
**文件**: `index.html` (第64行), `top_scroll_view.html`, `topscroll.css`, `topscroll.js`

#### HTML 结构
```html
<iframe id="topScrollView" width="100%" height="400px" style="border: none; background: transparent;"></iframe>
```

#### 功能说明
- 通过 iframe 加载 `top_scroll_view.html`
- 高度动态设置为视口高度的 99% (`home.js` 第77-83行)
- 用于展示主要横幅/轮播内容
- 加载时自动添加版本号参数避免缓存

#### 修改注意事项
- 修改高度计算逻辑时，更新 `home.js` 中的 `adjustTheViewHeight()` 函数
- 修改 iframe 内容时，编辑 `top_scroll_view.html` 及相关文件

---

### 2.3 Tag Scroll View（标签滚动视图）

**位置**: Top Scroll View 下方  
**文件**: `index.html` (第67行), `tag_scroll_view.html`, `tagscroll.css`, `tagscroll.js`

#### HTML 结构
```html
<iframe id="tagScrollView" width="100%" height="" style="border: none; margin-top: 20px; background: transparent;"></iframe>
```

#### 功能说明
- 通过 iframe 加载 `tag_scroll_view.html`
- 高度动态调整（通过 postMessage 通信，`home.js` 第18-21行）
- 用于展示产品分类/标签
- 支持与父页面通信调整高度

#### 修改注意事项
- 修改高度通信逻辑时，更新 `home.js` 中的 message 事件监听器
- 修改 iframe 内容时，编辑 `tag_scroll_view.html` 及相关文件

---

### 2.4 Product Details Modal（产品详情模态）

**位置**: 覆盖整个页面  
**文件**: `index.html` (第71-75行), `home.css` (第175-287行), `home.js` (第1-14行, 第35-47行)

#### HTML 结构
```html
<div id="productDetails" class="modal">
    <button id="closeButton" class="close-button">X</button>
    <img id="productImage" src="" alt="Product Image" class="product-image">
    <iframe id="productDetailFrame" width="100%" height="500px" style="border: none;"></iframe>
</div>
```

#### 功能说明
- 默认隐藏 (`display: none`)
- 通过事件触发显示 (`home.js` 第1-14行, 第35-47行)
- 显示产品图片和详情页面
- 支持关闭按钮

#### 修改注意事项
- 修改模态样式时，更新 `home.css` 中的 `.modal` 样式
- 修改显示逻辑时，更新 `home.js` 中的事件监听器

---

### 2.5 Order Selection Modal（订单选择模态）

**位置**: 覆盖整个页面  
**文件**: `index.html` (第78-93行), `home.css` (第366-438行), `home.js` (第103-144行)

#### HTML 结构
```html
<div id="orderModal" class="modal">
    <div class="order-modal-content">
        <button id="closeOrderModal" class="close-button">X</button>
        <h2>Choose Order Type</h2>
        <div class="order-options">
            <button class="order-option-btn" id="instoreOption">
                <span class="order-icon">🏪</span>
                <span class="order-text">In-Store</span>
            </button>
            <button class="order-option-btn" id="deliveryOption">
                <span class="order-icon">🚚</span>
                <span class="order-text">Delivery</span>
            </button>
        </div>
    </div>
</div>
```

#### 功能说明
- 点击 Order 按钮时显示
- 提供两个选项：
  - **In-Store（店内点餐）**: 跳转到 App 下载页面
  - **Delivery（外送）**: 显示外送平台按钮，滚动到页脚

#### 修改注意事项
- 修改模态样式时，更新 `home.css` 中的 `.order-modal-content` 样式
- 修改选项功能时，更新 `home.js` 中的事件监听器（第128-144行）

---

### 2.6 Footer（页脚区域）

**位置**: 页面底部  
**文件**: `index.html` (第96-145行), `home.css` (第186-249行)

#### HTML 结构
```html
<footer class="footer">
    <div class="footer-left">
        <iframe id="envslideView" width="100%" height="500px" style="border: none; margin-top: 20px; background: transparent;"></iframe>
    </div>
    <div class="footer-right">
        <!-- 外送平台按钮 -->
        <!-- 联系信息 -->
        <!-- 社交媒体链接 -->
        <!-- Google 地图 -->
    </div>
</footer>
```

#### 左侧区域
- **环境展示 iframe**: 加载 `envslide.html`，展示店铺环境图片
- 高度动态调整（通过 postMessage，`home.js` 第22-32行）

#### 右侧区域

##### 2.6.1 外送平台按钮 (`home.js` 第190-242行)
- **默认隐藏** (`display: none`)
- 选择 Delivery 后显示
- 包含四个平台：
  - DoorDash
  - Uber Eats
  - Grubhub
  - Fantuan

##### 2.6.2 联系信息
- 电话: 909-244-0245
- 地址: 9779 Base Line Rd, Rancho Cucamonga, CA

##### 2.6.3 社交媒体链接
- Yelp
- Instagram
- TikTok

##### 2.6.4 Google 地图
- 嵌入 Google Maps iframe
- 显示店铺位置

#### 响应式设计
- 移动端：页脚垂直堆叠（`home.css` 第221-249行）
- 桌面端：左右分栏布局

#### 修改注意事项
- 修改页脚布局时，更新 `home.css` 中的 `.footer` 样式
- 修改外送平台 URL 时，更新 `home.js` 中的 `deliveryUrls` 对象（第190-196行）
- 修改联系信息时，更新 `index.html` 中的相应内容

---

## 3. 文件依赖关系

### 3.1 核心文件

```
index.html (主页面)
├── version.js (版本管理)
├── home.css (主样式文件)
├── home.js (主脚本文件)
├── logo.png (Logo图片)
│
├── top_scroll_view.html (顶部滚动视图)
│   ├── topscroll.css
│   └── topscroll.js
│
├── tag_scroll_view.html (标签滚动视图)
│   ├── tagscroll.css
│   └── tagscroll.js
│
├── envslide.html (环境展示)
│   ├── envslide.css
│   └── envslide.js
│
└── product_detail.html (产品详情页)
```

### 3.2 资源加载顺序

1. **HTML 加载**
2. **版本号获取**: 通过 fetch 获取 `version.js`，解析版本号
3. **CSS 加载**: 动态加载 `home.css`，带版本号参数
4. **JavaScript 加载**: 动态加载 `home.js`，带版本号参数
5. **iframe 加载**: 依次加载各个 iframe，带版本号参数

---

## 4. 交互功能详解

### 4.1 版本控制和缓存

**文件**: `index.html` (第10-48行), `version.js`, `deploy.sh`

#### 工作原理
- 使用版本号系统控制浏览器缓存
- 所有资源（CSS、JS、iframe）都通过版本号参数避免缓存
- HTML 文件通过 meta 标签禁用缓存
- `version.js` 通过 fetch 获取，避免缓存

#### 部署流程
1. 运行 `./deploy.sh` 脚本
2. 自动更新版本号（格式：YYYYMMDDHHMM）
3. 提交更改到 Git
4. 推送到远程仓库

#### 修改注意事项
- 修改缓存策略时，需同时更新 `index.html` 中的加载逻辑
- 修改版本号格式时，需更新 `deploy.sh` 脚本

---

### 4.2 滚动效果

**文件**: `home.js` (第267-327行), `home.css` (第9-23行)

#### 头部滚动透明度
- **向下滚动**: 头部逐渐变透明
- **向上滚动**: 头部逐渐变不透明
- **在顶部**: 完全不透明

#### 修改注意事项
- 修改透明度计算逻辑时，更新 `home.js` 中的 `handleScroll()` 函数
- 修改过渡效果时，更新 `home.css` 中的 `transition` 属性

---

### 4.3 模态窗口管理

**文件**: `home.js` (第103-144行), `home.css` (第252-287行, 第366-438行)

#### 产品详情模态
- 通过 `navigateToProductDetail` 事件触发
- 通过 `message` 事件接收产品图片

#### 订单选择模态
- 点击 Order 按钮显示
- 支持点击外部区域关闭
- 支持关闭按钮

#### 修改注意事项
- 修改模态显示逻辑时，更新 `home.js` 中的事件监听器
- 修改模态样式时，更新 `home.css` 中的 `.modal` 样式

---

### 4.4 iframe 通信

**文件**: `home.js` (第17-33行)

#### 通信机制
- 使用 `postMessage` API 进行跨 iframe 通信
- 接收高度调整消息
- 接收产品详情消息

#### 修改注意事项
- 修改通信协议时，需同时更新 iframe 内部代码和父页面代码
- 添加新的通信消息类型时，更新本文档

---

### 4.5 App 下载功能

**文件**: `home.js` (第88-101行)

#### 设备检测
- iOS 设备: 跳转 App Store
- Android 设备: 跳转 Google Play
- 其他设备: 默认跳转 Google Play

#### 修改注意事项
- 修改下载链接时，更新 `home.js` 中的 `navigateToAppDownload()` 函数
- 添加新的应用商店支持时，更新设备检测逻辑

---

## 5. 样式系统

### 5.1 主样式文件

**文件**: `home.css`

#### 主要样式类
- `.header`: 头部样式
- `.modal`: 模态窗口样式
- `.footer`: 页脚样式
- `.order-button`: 订单按钮样式
- `.download-button`: 下载按钮样式
- `.delivery-btn`: 外送平台按钮样式
- `.social-btn`: 社交媒体按钮样式

#### 响应式断点
- 移动端: `@media screen and (max-width: 768px)`

#### 修改注意事项
- 修改样式时，确保同时更新移动端样式
- 添加新的样式类时，更新本文档

---

### 5.2 视觉效果

#### 背景
- 深色渐变背景（深蓝到黑色）
- 星空动画效果（`sparkle` 动画）
- 圣诞节雪花动画（`snowflakes-container`）

#### 按钮效果
- 渐变背景
- 悬停效果（`transform: translateY(-2px)`）
- 阴影效果

#### 修改注意事项
- 修改动画效果时，更新 `home.css` 中的 `@keyframes` 规则
- 修改背景时，更新 `body` 样式

---

## 6. JavaScript 功能模块

### 6.1 主要函数

| 函数名 | 位置 | 功能 |
|--------|------|------|
| `setupHeaderScrollEffect()` | `home.js` 第267行 | 设置头部滚动透明度效果 |
| `adjustTheViewHeight()` | `home.js` 第77行 | 调整顶部滚动视图高度 |
| `navigateToAppDownload()` | `home.js` 第88行 | 导航到应用下载页面 |
| `setupDeliveryButtons()` | `home.js` 第199行 | 设置外送平台按钮 |
| `createSnowflake()` | `home.js` 第147行 | 创建雪花动画 |

### 6.2 事件监听器

| 事件 | 元素/对象 | 功能 |
|------|----------|------|
| `scroll` | `window` | 控制头部透明度 |
| `click` | `#orderButton` | 显示订单选择模态 |
| `click` | `#downloadButton` | 跳转到应用下载 |
| `message` | `window` | 接收 iframe 消息 |
| `resize` | `window` | 响应窗口大小变化 |

---

## 7. 修改代码时的文档更新要求

### 7.1 必须更新的情况

以下情况**必须**同步更新本文档：

1. ✅ **添加新的 HTML 元素或组件**
   - 更新"主要组件详解"章节
   - 添加组件说明、HTML 结构、功能说明

2. ✅ **修改现有组件的功能**
   - 更新对应组件的"功能说明"部分
   - 更新"修改注意事项"

3. ✅ **添加新的 JavaScript 函数**
   - 更新"主要函数"表格
   - 添加函数说明

4. ✅ **修改文件依赖关系**
   - 更新"文件依赖关系"章节
   - 更新依赖图

5. ✅ **添加新的样式类或修改样式**
   - 更新"样式系统"章节
   - 添加样式说明

6. ✅ **修改交互逻辑**
   - 更新"交互功能详解"章节
   - 更新相关事件监听器说明

7. ✅ **添加新的 iframe 或修改现有 iframe**
   - 更新组件说明
   - 更新文件依赖关系

8. ✅ **修改响应式设计**
   - 更新响应式设计说明
   - 更新断点信息

### 7.2 文档更新步骤

1. **修改代码前**：
   - 确定需要修改的组件/功能
   - 查看本文档中相关章节

2. **修改代码时**：
   - 按照代码修改同步更新文档
   - 确保文档与代码一致

3. **修改代码后**：
   - 检查文档是否完整更新
   - 更新"文档更新记录"表格
   - 提交代码和文档一起提交

### 7.3 文档更新模板

更新文档时，使用以下格式：

```markdown
#### 修改内容
- 修改了 XXX 组件的 YYY 功能
- 添加了新的 ZZZ 组件

#### 影响范围
- `index.html` 第 X 行
- `home.js` 第 Y 行
- `home.css` 第 Z 行

#### 注意事项
- 需要注意的配置或依赖
```

---

## 8. 常见问题排查

### 8.1 头部不悬浮

**可能原因**：
- CSS 中 `position: fixed` 未正确应用
- 被其他样式覆盖
- JavaScript 未正确执行

**排查步骤**：
1. 检查浏览器开发者工具中的 Computed 样式
2. 查看 Console 中的调试信息
3. 确认 `home.js` 中的 `setupHeaderScrollEffect()` 函数已执行

### 8.2 资源未更新

**可能原因**：
- 版本号未更新
- 浏览器缓存
- 版本号参数未正确添加

**排查步骤**：
1. 检查 `version.js` 中的版本号
2. 检查资源 URL 是否包含版本号参数
3. 清除浏览器缓存或使用硬刷新（Cmd+Shift+R）

### 8.3 iframe 通信失败

**可能原因**：
- postMessage 事件未正确监听
- 消息格式不正确
- iframe 未正确加载

**排查步骤**：
1. 检查 `home.js` 中的 message 事件监听器
2. 检查 iframe 内部代码的消息发送格式
3. 使用浏览器开发者工具查看网络请求

---

## 9. 开发规范

### 9.1 代码规范

- 使用有意义的变量名和函数名
- 添加必要的注释
- 保持代码格式一致

### 9.2 文件命名

- HTML 文件: 小写字母，使用连字符（如 `top_scroll_view.html`）
- CSS 文件: 小写字母，使用连字符（如 `home.css`）
- JavaScript 文件: 小写字母，使用连字符（如 `home.js`）

### 9.3 版本控制

- 每次部署前运行 `./deploy.sh` 更新版本号
- 提交代码时包含版本号更新
- 重要功能更新时添加 Git 标签

---

## 10. 联系信息

如有问题或需要帮助，请联系开发团队。

---

**最后更新**: 2025-12-20  
**文档版本**: 1.0  
**维护者**: 开发团队
