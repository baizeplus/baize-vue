<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">baize-vue v1.0.0</h1>

## 平台简介

*
本仓库为前端技术栈由于若依vue3改写  [Vue3](https://v3.cn.vuejs.org) + [Element Plus](https://element-plus.org/zh-CN) + [Vite](https://cn.vitejs.dev)
版本。
* 配套后端代码仓库地址[baize](https://gitee.com/baizeplus/baize) 版本。

## 前端运行

```bash
# 克隆项目
git clone https://gitee.com/baizeplus/baize-vue

# 进入项目目录
cd baize-vue

# 安装依赖
yarn --registry=https://registry.npmmirror.com

# 启动服务
yarn dev

# 构建测试环境 yarn build:stage
# 构建生产环境 yarn build:prod
# 前端访问地址 http://localhost:80
```

## 内置功能

1. 用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2. 部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
3. 岗位管理：配置系统用户所属担任职务。
4. 菜单管理：配置系统菜单，操作权限，按钮权限标识等。
5. 角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
6. 字典管理：对系统中经常使用的一些较为固定的数据进行维护。
7. 登录日志：系统登录日志记录查询包含登录异常。
8. 在线用户：当前系统中活跃用户状态监控。
9. 系统接口：根据业务代码自动生成相关的api接口文档。
10. 服务监控：监视当前系统CPU、内存、磁盘、堆栈等相关信息。

正在开发

11. 参数管理：对系统动态配置常用参数。
12. 通知公告：系统通知公告信息发布维护。
13. 操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。

## 在线体验

- admin/admin123

