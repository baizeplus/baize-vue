
/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
 noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
 icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
 breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
 activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
 }
 */

export const homeRoutes=[
    {name: "System",    path: "/system",    hidden: false,  redirect: "noRedirect",     component:  () => import('@/layout'),   alwaysShow: true,   permissions:["system"],   meta: {title: "系统管理", icon: "system",   noCache: false}},
    {name: "Monitor",   path: "/monitor",   hidden: false,  redirect: "noRedirect",     component:  () => import('@/layout'),   alwaysShow: true,   permissions:["monitor"],  meta: {title: "系统监控", icon: "monitor",  noCache: false}},
    {name: "Tool",      path: "/tool",      hidden: false,  redirect: "noRedirect",     component:  () => import('@/layout'),   alwaysShow: true,   permissions:["tool"],     meta: {title: "系统工具", icon: "tool",     noCache: false}},
]

//菜单路由，基于用户权限动态去加载
export const permissionRoutes = [
    {name: "User",parentName:"System",path: "user",hidden: false, component:  () => import('@/views/system/user/index.vue'), permissions:["system:user"], alwaysShow: false, meta: {title: "用户管理", icon: "user", noCache: false}},
    {name: "Role",parentName:"System", path: "role", hidden: false, component: () => import('@/views/system/role/index.vue'), permissions:["system:role"], alwaysShow: false, meta: {title: "角色管理", icon: "peoples", noCache: false}},
    {name: "Permission", parentName:"System",path: "permission", hidden: false, component: () => import('@/views/system/permission/index.vue'), permissions:["system:permission"], alwaysShow: false, meta: {title: "权限管理", icon: "tree-table", noCache: false}},
    {name: "Dept",parentName:"System", path: "dept", hidden: false, component: () => import('@/views/system/dept/index.vue'), permissions:["system:dept"], alwaysShow: false, meta: {title: "部门管理", icon: "tree", noCache: false}},
    {name: "Post",parentName:"System", path: "post", hidden: false, component: () => import('@/views/system/post/index.vue'), permissions:["system:post"], alwaysShow: false, meta: {title: "岗位管理", icon: "post", noCache: false}},
    {name: "Dict", parentName:"System",path: "dict", hidden: false, component: () => import('@/views/system/dict/index.vue'), permissions:["system:dict"], alwaysShow: false, meta: {title: "字典管理", icon: "dict", noCache: false}},
    {name: "Config", path: "config", hidden: false, component: () => import('@/views/system/config/index.vue'), permissions:["system:config"], alwaysShow: false, meta: {title: "参数设置", icon: "edit", noCache: false}},
    {name: "Notice", parentName:"System",path: "notice", hidden: false, component: () => import('@/views/system/notice/index.vue'), permissions:["system:notice"], alwaysShow: false, meta: {title: "通知公告", icon: "message", noCache: false}},
    {name: "Log", parentName:"System",path: "log", hidden: false, redirect: "noRedirect", component: ()=>import('@/components/ParentView'), permissions:["system:monitor"], alwaysShow: true, meta: {title: "日志管理", icon: "log", noCache: false}},
    {name: "Operlog",parentName:"Log", path: "operlog", hidden: false, component: () => import('@/views/monitor/operlog/index.vue'), permissions:["system:monitor:operlog"], alwaysShow: false, meta: {title: "操作日志", icon: "form", noCache: false}},
    {name: "Logininfor",parentName:"Log", path: "logininfor", hidden: false, component: () => import('@/views/monitor/logininfor/index.vue'), permissions:["system:monitor:operlog"], alwaysShow: false, meta: {title: "登录日志", icon: "logininfor", noCache: false}},
    {name: "Online", parentName:"Monitor", path: "online", hidden: false, component: () => import('@/views/monitor/online/index.vue'), permissions:["monitor:online"], alwaysShow: false, meta: {title: "在线用户", icon: "online", noCache: false},},
    {name: "Job", parentName:"Monitor", path: "job", hidden: false, component: () => import('@/views/monitor/job/index.vue'), permissions:["monitor:job"], alwaysShow: false, meta: {title: "定时任务", icon: "job", noCache: false},},
    {name: "Druid", parentName:"Monitor", path: "druid", hidden: true, component: () => import('@/views/monitor/druid/index.vue'), permissions:["monitor:druid"], alwaysShow: false, meta: {title: "数据监控", icon: "druid", noCache: false}},
    {name: "Server", parentName:"Monitor", path: "server", hidden: false, component: () => import('@/views/monitor/server/index.vue'), permissions:["monitor:server"], alwaysShow: false, meta: {title: "服务监控", icon: "server", noCache: false}},
    {name: "Build",  parentName:"Tool",path: "build", hidden: false, component: () => import('@/views/tool/build/index.vue'), permissions:["tool:build"], alwaysShow: false, meta: {title: "表单构建", icon: "build", noCache: false}},
    {name: "Gen",  parentName:"Tool",path: "gen", hidden: false, component: () => import('@/views/tool/gen/index.vue'), permissions:["tool:gen"], alwaysShow: false, meta: {title: "代码生成", icon: "code", noCache: false}},
    {name: "Swagger",  parentName:"Tool",path: "swagger", hidden: false, component: () => import('@/views/tool/swagger/index.vue'), permissions:["tool:swagger"], alwaysShow: false, meta: {title: "系统接口", icon: "swagger", noCache: false}}
]
