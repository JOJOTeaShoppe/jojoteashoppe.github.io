# 部署说明 - 缓存控制

## 工作原理

网站使用版本号系统来控制浏览器缓存：
- **平时**：浏览器会缓存所有资源文件（CSS、JS、HTML），提高加载速度
- **部署后**：通过更新版本号，强制浏览器重新下载所有文件

## 部署步骤

### 方法1：使用一键部署脚本（最推荐）⭐

最简单的方式，自动完成版本更新和代码提交：

```bash
cd jojosteashoppe.github.io
./deploy.sh
```

脚本会自动：
1. ✅ 更新版本号（格式：YYYYMMDDHHMM）
2. ✅ 检查未提交的更改
3. ✅ 提交所有更改（包括版本号和代码）
4. ✅ 询问是否推送到远程仓库

### 方法2：使用版本更新脚本

如果只想更新版本号，不自动提交：

```bash
cd jojosteashoppe.github.io
./update-version.sh
git add version.js
git commit -m "Update version for deployment"
git push
```

### 方法3：手动更新

编辑 `version.js` 文件，更新版本号：

```javascript
window.APP_VERSION = '202412041530';  // 改为当前时间戳
```

## 版本号格式

版本号格式：`YYYYMMDDHHMM`
- YYYY: 年份（4位）
- MM: 月份（2位）
- DD: 日期（2位）
- HH: 小时（2位，24小时制）
- MM: 分钟（2位）

例如：`202412041530` 表示 2024年12月4日 15:30

## 自动应用

版本号会自动应用到：
- ✅ `home.css`
- ✅ `home.js`
- ✅ `top_scroll_view.html` (iframe)
- ✅ `tag_scroll_view.html` (iframe)
- ✅ `envslide.html` (iframe)

## 注意事项

1. **只在部署时更新版本号**：不要每次提交代码都更新版本号，否则会失去缓存优势
2. **版本号必须唯一**：每次部署使用不同的版本号，建议使用时间戳
3. **Git提交**：记得将 `version.js` 的更改提交到 Git

