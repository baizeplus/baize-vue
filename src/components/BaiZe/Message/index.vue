<template>
  <div>
    <el-popover placement="bottom-end" :width="500" trigger="click" @show="userNotice" v-model:visible="visibleValue">
      <template #reference>
        <el-badge :value="badgeValue" class="item" :max="99" :show-zero="false">
          <svg-icon icon-class="wechat"/>
        </el-badge>
      </template>
      <el-button
          type="primary"
          plain
          @click="showAll"
      >全部
      </el-button>
      <el-table :data="gridData" stripe :show-header=false @row-click="rowClick">
        <el-table-column label="" width="26">
          <template #default="scope">
            <svg-icon v-if="scope.row.status==='1'" icon-class="example" style="color:red"/>
          </template>
        </el-table-column>
        <el-table-column label="" prop="title" :show-overflow-tooltip="true" align="left">
          <template #default="scope">
            <span>{{ scope.row.title }}</span><br>
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="" align="center" prop="type" width="100">
          <template #default="scope">
            <dict-tag :options="sys_notice_type" :value="scope.row.type"/>
            <span>{{ scope.row.createName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-popover>
  </div>
</template>

<script setup>

import {newMessage, userNoticeList} from "@/api/system/notice";
import {useRouter} from 'vue-router'

const {proxy} = getCurrentInstance();
const {sys_notice_type} = proxy.useDict("sys_notice_type");

const gridData = ref([]);
const visibleValue = ref(false);
const badgeValue = ref(0)
const queryParams = ({pageNum: 1, pageSize: 5,})
const router = useRouter();

function getNewMessage() {
  newMessage().then(res => {
    badgeValue.value = res.data;
  });
};

function userNotice() {
  userNoticeList(queryParams).then(res => {
    gridData.value = res.data.rows;
  });
  visibleValue.value = true
}

function rowClick(a) {
  // 跳转 URL
  router.push('/userNotice?noticeId=' + a.id);
  visibleValue.value = false
}
function showAll() {
  // 跳转 URL
  router.push('/userNotice');
  visibleValue.value = false
}

getNewMessage()
defineExpose({getNewMessage})
</script>
<style scoped>
::v-deep(.el-badge__content) {
  top: 10px;
}
</style>
