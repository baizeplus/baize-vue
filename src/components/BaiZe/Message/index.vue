<template>
  <div @click="userNoticeList">
    <el-popover placement="bottom-end" :width="500" trigger="click">
      <template #reference>
        <el-badge :value="badgeValue" class="item" :max="99" :show-zero="false">
          <svg-icon icon-class="wechat"/>
        </el-badge>
      </template>
      <el-table :data="gridData">
        <el-table-column  property="date.title" label="date"/>
      </el-table>
    </el-popover>
  </div>
</template>

<script setup>

import {newMessage, userNoticeList} from "@/api/system/notice";

const gridData = ref([]);
const badgeValue = ref(0)
const queryParams = ({pageNum: 1, pageSize: 5,})

function getNewMessage() {
  loading.value = true;
  newMessage().then(res => {
    badgeValue.value = res.data;
  });
};

function userNoticeList() {
  userNoticeList(queryParams).then(res => {
    gridData.value = res.data.rows;
  });
}

getNewMessage()
</script>
<style scoped>
::v-deep .el-badge__content {
  top: 10px;
}
</style>
