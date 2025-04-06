import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import {permissionRoutes,homeRoutes} from '@/router/permissionRoutes.js'
import {isHttp} from "@/utils/validate.js";

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const usePermissionStore = defineStore(
  'permission',
  {
    state: () => ({
      routes: [],
      addRoutes: [],
      defaultRoutes: [],
      topbarRouters: [],
      //侧边栏路由
      sidebarRouters: []
    }),
    actions: {
      setRoutes(routes) {
        // this.addRoutes = routes
        this.routes = constantRoutes.concat(routes)
      },
      setDefaultRoutes(routes) {
        this.defaultRoutes = constantRoutes.concat(routes)
      },
      setTopbarRoutes(routes) {
        this.topbarRouters = routes
      },
      setSidebarRouters(routes) {
        this.sidebarRouters = routes
      },
      generateRoutes() {
          const hr = filterDynamicRoutes(homeRoutes)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
          asyncRoutes.forEach(route => { router.addRoute(route) })
          this.setSidebarRouters(constantRoutes.concat(hr))
          this.setDefaultRoutes(hr)
          this.setTopbarRoutes(hr)
          const mr = filterDynamicRoutes(permissionRoutes )


          hr.forEach(home => {
            home["children"]=findSubdirectory(mr, home.name)
          })
          this.setRoutes(hr)
          hr.forEach(route => {
              if (!isHttp(route.path)) {
                  router.addRoute(route) // 动态添加可访问路由表
              }
          })

      }
    }
  }
)

function findSubdirectory(menuRoutes,parentName){
  return   menuRoutes.filter(menuRoute => {
        if (menuRoute.parentName===parentName){
          let tep=  findSubdirectory(menuRoutes,menuRoute.name)
            if (tep.length){
                menuRoute["children"]=tep
            }
            return true
        }
        return false
    })
}


// 遍历后台传来的路由字符串，转换为组件对象
function filterDynamicRoutes(asyncRouterMap) {
    return  asyncRouterMap.filter(route => {
     return auth.hasPermiOr(route.permissions);
  })
}



export default usePermissionStore
