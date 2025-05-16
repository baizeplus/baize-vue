import useUserStore from '@/store/modules/user'

function authPermission(permission) {
  const permissions = useUserStore().permissions
  if (permission && permission.length > 0) {
    return permissions.some(v => {
      return v === permission
    })
  } else {
    return false
  }
}


export default {
  // 验证用户是否具备某权限
  hasPermi(permission) {
    return authPermission(permission);
  },
  // 验证用户是否含有指定权限，只需包含其中一个
  hasPermiOr(permissions) {
    return permissions.some(item => {
      return authPermission(item)
    })
  },
  // 验证用户是否含有指定权限，必须全部拥有
  hasPermiAnd(permissions) {
    return permissions.every(item => {
      return authPermission(item)
    })
  }
}


