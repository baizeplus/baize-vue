<template>
  <div @click="userNotice">
    <el-popover placement="bottom-end" :width="500" trigger="click">
      <template #reference>
        <el-badge :value="badgeValue" class="item" :max="99" :show-zero="false">
          <svg-icon icon-class="wechat"/>
        </el-badge>
      </template>
      <el-table :data="gridData" stripe>
        <el-table-column label="" width="26"  >
          <template #default="scope"><svg-icon v-if="scope.row.status==='1'" icon-class="example" style="color:red"/></template>
        </el-table-column>
          <el-table-column label="公告标题" prop="title" :show-overflow-tooltip="true" align="left"/>
        <el-table-column label="公告类型" align="center" prop="type" width="100">
          <template #default="scope">
            <dict-tag :options="sys_notice_type" :value="scope.row.type"/>
          </template>
        </el-table-column>
        <el-table-column label="发送人" align="center" prop="createName" width="100"/>
      </el-table>
    </el-popover>
  </div>
</template>

<script setup>

import {newMessage, userNoticeList} from "@/api/system/notice";

const {proxy} = getCurrentInstance();
const {sys_notice_type} = proxy.useDict("sys_notice_type");

const gridData = ref([]);
const badgeValue = ref(0)
const queryParams = ({pageNum: 1, pageSize: 5,})

function getNewMessage() {
  newMessage().then(res => {
    badgeValue.value = res.data;
  });
};

function userNotice() {
  userNoticeList(queryParams).then(res => {
    gridData.value = res.data.rows;
  });
}

getNewMessage()
</script>
<style scoped>
::v-deep(.el-badge__content) {
  top: 10px;
}
</style>
