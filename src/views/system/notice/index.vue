<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input
            v-model="queryParams.noticeTitle"
            placeholder="请输入公告标题"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="createBy">
        <el-input
            v-model="queryParams.createBy"
            placeholder="请输入操作人员"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="noticeType">
        <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable style="width: 200px">
          <el-option
              v-for="dict in sys_notice_type"
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
            v-hasPermi="['system:notice:add']"
        >新增
        </el-button>
      </el-col>

      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" prop="id" width="100"/>
      <el-table-column
          label="公告标题"
          align="center"
          prop="title"
          :show-overflow-tooltip="true"
      />
      <el-table-column label="公告类型" align="center" prop="type" width="100">
        <template #default="scope">
          <dict-tag :options="sys_notice_type" :value="scope.row.type"/>
        </template>
      </el-table-column>

      <el-table-column label="创建者" align="center" prop="createName" width="100"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleQueryById(scope.row)"
                     v-hasPermi="['system:notice:query']">查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或查看公告对话框 -->
    <el-dialog :title="title" v-model="open" width="780px" append-to-body>
      <el-form ref="noticeRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入公告标题"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                    v-for="dict in sys_notice_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-form-item label="发送部门">
            <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
            <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
            <el-tree
                class="tree-border"
                :data="deptOptions"
                show-checkbox
                default-expand-all
                ref="deptRef"
                node-key="id"
                :check-strictly=checkStrictly
                empty-text="加载中，请稍候"
                :props="{value: 'id', label: 'label', children: 'children' }"
            ></el-tree>
          </el-form-item>
          <el-col :span="24">
            <el-form-item label="内容">
              <editor v-model="form.txt" :min-height="192"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="form.id==undefined" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Notice">
import {listNotice, getNotice, addNotice} from "@/api/system/notice";
import {listDept} from "@/api/system/dept";

const {proxy} = getCurrentInstance();
const {sys_notice_type} = proxy.useDict("sys_notice_type");

const deptOptions = ref([]);
const noticeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const checkStrictly = ref(true);
const deptRef = ref(null);

const data = reactive({
  deptNodeAll: false,
  deptExpand: true,
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    noticeTitle: undefined,
    createBy: undefined,
    status: undefined
  },
  rules: {
    title: [{required: true, message: "公告标题不能为空", trigger: "blur"}],
    type: [{required: true, message: "公告类型不能为空", trigger: "change"}]
  },
});

const {queryParams, form, rules, deptNodeAll, deptExpand} = toRefs(data);

/** 查询公告列表 */
function getList() {
  loading.value = true;
  listNotice(queryParams.value).then(response => {
    noticeList.value = response.data.rows;
    total.value = response.data.total;
    loading.value = false;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}


/** 查询部门下拉树结构 */
function getDeptTree() {
  listDept().then(response => {
    deptOptions.value = proxy.handleProps(response.data, 'deptId', 'deptName');
  });
};

/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value) {
  let treeList = deptOptions.value;
  for (let i = 0; i < treeList.length; i++) {
    deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
  }
}


/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value) {
  checkStrictly.value = false
  nextTick(() => {
    deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
    nextTick(() => {
      checkStrictly.value = true
    })
  })

}

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    title: undefined,
    type: undefined,
    txt: undefined,
  };
  deptNodeAll.value = false
  deptExpand.value = true
  proxy.resetForm("noticeRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.noticeId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  getDeptTree();
  open.value = true;
  title.value = "添加公告";
  nextTick(() => {
    deptRef.value.setCheckedNodes([]);
  })
}

/**查看按钮操作 */
function handleQueryById(row) {
  reset();
  getDeptTree();
  getNotice(row.id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "查看公告";
    if (response.data.deptIds.length !== 0) {
      nextTick(() => {
        deptRef.value.setCheckedKeys(response.data.deptIds, true);
      })
    }
  });
}

/** 提交按钮 */
function submitForm() {
  form.value.deptIds = deptRef.value.getCheckedKeys();
  addNotice(form.value).then(response => {
    proxy.$modal.msgSuccess("新增成功");
    open.value = false;
    getList();
  });
}


getList();
</script>
