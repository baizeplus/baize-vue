<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="权限名称" prop="permissionName">
            <el-input
               v-model="queryParams.permissionName"
               placeholder="请输入权限名称"
               clearable
               style="width: 200px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="权限状态" clearable style="width: 200px">
               <el-option
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="primary"
               plain
               icon="Plus"
               @click="handleAdd"
               v-hasPermi="['system:permission:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="info"
               plain
               icon="Sort"
               @click="toggleExpandAll"
            >展开/折叠</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table
         v-if="refreshTable"
         v-loading="loading"
         :data="permissionList"
         row-key="permissionId"
         :default-expand-all="isExpandAll"
         :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
         <el-table-column prop="permissionName" label="权限名称" :show-overflow-tooltip="true" width="300"></el-table-column>
         <el-table-column prop="sort" label="排序" width="100"></el-table-column>
         <el-table-column prop="permission" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
               <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" width="160" prop="createTime">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:permission:edit']">修改</el-button>
               <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['system:permission:add']">新增</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:permission:remove']">删除</el-button>
            </template>
         </el-table-column>
      </el-table>

      <!-- 添加或修改菜单对话框 -->
      <el-dialog :title="title" v-model="open" width="680px" append-to-body>
         <el-form ref="permissionRef" :model="form" :rules="rules" label-width="100px">
            <el-row>
               <el-col :span="23">
                  <el-form-item label="上级权限">
                     <el-tree-select
                        v-model="form.parentId"
                        :data="permissionOptions"
                        :props="{ value: 'permissionId', label: 'permissionName', children: 'children' }"
                        value-key="permissionId"
                        placeholder="选择上级权限"
                        check-strictly
                     />
                  </el-form-item>
               </el-col>

               <el-col :span="12">
                  <el-form-item label="权限名称" prop="permissionName">
                     <el-input v-model="form.permissionName" placeholder="请输入权限名称" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="显示排序" prop="sort">
                     <el-input-number v-model="form.sort" controls-position="right" :min="0" />
                  </el-form-item>
               </el-col>
              <el-col :span="23">
                <el-form-item  label="权限标识" prop="permission">
                  <el-input v-model="form.permission" placeholder="请输入权限标识" maxlength="100" />
                  <template #label>
                        <span>
                           <el-tooltip content="控制器中定义的权限字符，如：'system:user:list'" placement="top">
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>
                           权限字符
                        </span>
                  </template>
                </el-form-item>
              </el-col>
               <el-col :span="12">
                  <el-form-item>
                     <template #label>
                        <span>
                           <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                              <el-icon><question-filled /></el-icon>
                           </el-tooltip>
                           菜单状态
                        </span>
                     </template>
                     <el-radio-group v-model="form.status">
                        <el-radio
                           v-for="dict in sys_normal_disable"
                           :key="dict.value"
                           :value="dict.value"
                        >{{ dict.label }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
            </el-row>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup name="Permission">
import { addPermission, delPermission, getPermission, listPermission, updatePermission } from "@/api/system/permission.js";
import { selectBoxPermission} from "@/api/system/selectBox.js";
const { proxy } = getCurrentInstance();
const {  sys_normal_disable } = proxy.useDict( "sys_normal_disable");

const permissionList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const permissionOptions = ref([]);
const isExpandAll = ref(false);
const refreshTable = ref(true);

const data = reactive({
  form: {},
  queryParams: {
    permissionName: undefined,
    visible: undefined
  },
  rules: {
    permissionuName: [{ required: true, message: "权限名称不能为空", trigger: "blur" }],
    sort: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
    permission: [{ required: true, message: "权限标识不能为空", trigger: "blur" }]
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询菜单列表 */
function getList() {
  loading.value = true;
  listPermission(queryParams.value).then(response => {
    permissionList.value = proxy.handleTree(response.data, "permissionId")
    loading.value = false;
  });
}
/** 查询权限下拉树结构 */
function getTreeSelect() {
  permissionOptions.value = [];
  selectBoxPermission().then(response => {
    const permission = { permissionId: "0", permissionName: "主类目", children: [] };
    permission.children = proxy.handleTree(response.data, "permissionId");
    permissionOptions.value.push(permission);
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    permissionId: undefined,
    parentId: "0",
    permissionName: undefined,
    sort: 0,
    status: "0"
  };
  proxy.resetForm("permissionRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  getTreeSelect();
  if (row != null && row.permissionId) {
    form.value.parentId = row.permissionId;
  } else {
    form.value.parentId = "0";
  }
  open.value = true;
  title.value = "添加菜单";
}
/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}
/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  await getTreeSelect();
  getPermission(row.permissionId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改菜单";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["permissionRef"].validate(valid => {
    if (valid) {
      if (form.value.permissionId != undefined) {
        updatePermission(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPermission(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除名称为"' + row.permissionName + '"的数据项?').then(function() {
    return delPermission(row.permissionId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
</script>
