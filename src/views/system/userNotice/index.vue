<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class=" ep-bg-purple"/>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="User" name="">全部</el-tab-pane>
          <el-tab-pane label="Config" name="1">消息</el-tab-pane>
          <el-tab-pane label="Role" name="2">通知</el-tab-pane>
        </el-tabs>
        <el-table :data="noticeList" stripe @selection-change="handleSelectionChange" @row-click="rowClickHandle">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="" width="26">
            <template #default="scope">
              <svg-icon v-if="scope.row.status==='1'" icon-class="example" style="color:red"/>
            </template>
          </el-table-column>
          <el-table-column label="公告标题" prop="title" :show-overflow-tooltip="true" align="left"/>
          <el-table-column label="公告类型" align="center" prop="type" width="100">
            <template #default="scope">
              <dict-tag :options="sys_notice_type" :value="scope.row.type"/>
            </template>
          </el-table-column>
          <el-table-column label="发送人" align="center" prop="createName" width="100"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button link type="primary" icon="Delete" @click="deleteById(scope.row)">
                删除
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
      </el-col>
      <el-col :span="16">
        <div class=" ep-bg-purple"/>
        <el-scrollbar>

        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>


<script setup name="userNotice">
import {userNoticeList, noticeRead, noticeReadAll,userNoticeGetInfo, noticeDelete} from "@/api/system/notice.js";


const {proxy} = getCurrentInstance();
const {sys_notice_type} = proxy.useDict("sys_notice_type");
const activeName = ref('')
const noticeList = ref([]);
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
const total = ref(0);

/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

function getList() {
  loading.value = true;
  userNoticeList(queryParams).then(response => {
    noticeList.value = response.data.rows;
    total.value = response.data.total;
    loading.value = false;
  });
}

function rowClickHandle(row) {

  if (row.status === '1') {
    row.status = '2';
    noticeRead(row.id)
  }
}

function deleteById(row) {
  const userIds = row.userId || ids.value;
  noticeDelete(userIds).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  })
}

function handleClick(a, b) {

}

getList()
</script>
<style scoped lang="scss">

</style>