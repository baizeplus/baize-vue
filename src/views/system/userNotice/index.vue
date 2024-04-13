<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="9">
        <div class=" ep-bg-purple"/>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="全部" name=""></el-tab-pane>
          <el-tab-pane label="消息" name="1"></el-tab-pane>
          <el-tab-pane label="通知" name="2"></el-tab-pane>
        </el-tabs>
        <el-button
            type="danger"
            plain
            @click="readAll"
        >全部已读
        </el-button>
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="deleteById"
        >删除
        </el-button>
        <el-table :data="noticeList" stripe @selection-change="handleSelectionChange" :show-header=false @row-click="rowClickHandle">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="" width="26">
            <template #default="scope">
              <svg-icon v-if="scope.row.status==='1'" icon-class="example" style="color:red"/>
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="title" :show-overflow-tooltip="true" align="left">
            <template #default="scope">
              <span>{{scope.row.title}}</span><br>
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="公共类型 发送人" align="center" prop="type" width="80">
            <template #default="scope">
              <dict-tag :options="sys_notice_type" :value="scope.row.type"/>
              <span>{{scope.row.createName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="70">
            <template #default="scope">
              <el-button link type="primary" icon="Delete" @click="deleteById(scope.row)" width="50">
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
      <el-col :span="15">

        <el-scrollbar>
          <div v-html="notice.txt"></div>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>


<script setup name="userNotice">
import {userNoticeList, noticeRead, noticeReadAll,userNoticeGetInfo, noticeDelete} from "@/api/system/notice.js";
const multiple = ref(true);
import { useRoute } from 'vue-router'
const route = useRoute();
const router = useRouter();
const {proxy} = getCurrentInstance();
const {sys_notice_type} = proxy.useDict("sys_notice_type");
const activeName = ref('')
const txt = ref('')
const loading = ref(true);
const noticeList = ref([]);
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
const notice = ref({
  txt:"",
});
const total = ref(0);
const ids = ref([]);
/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  multiple.value = !selection.length;
};

function readAll() {

  noticeReadAll().then(() => {
    noticeList.value = noticeList.value.map(obj => ({
      ...obj,
      status: "2"
    }));
  });
}
function getList() {
  loading.value = true;
  userNoticeList(queryParams).then(response => {
    noticeList.value = response.data.rows;
    total.value = response.data.total;
    loading.value = false;
  });
}

function rowClickHandle(row) {
  notice.value=row
  if (row.status === '1') {
    row.status = '2';
    noticeRead(row.id)
  }
}

function deleteById(row) {
  const ds = row.id || ids.value;
  noticeDelete(ds).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  })
}

function handleClick(a, b) {

}
function getInfo(id) {
  userNoticeGetInfo(id).then(response => {
    notice.value=response.data
  })
}

let id =route.query.id
if( id !==undefined){
  getInfo(id)
  router.push(route.path);
}
getList()
</script>
<style scoped lang="scss">

</style>
