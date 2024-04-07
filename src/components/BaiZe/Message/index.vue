<template>
  <div @click="goto">


    <el-popover placement="bottom-end" :width="500" trigger="click"  >
      <template #reference>
        <el-badge :value="1" class="item" :max="99" :show-zero="false">
          <svg-icon icon-class="wechat" />
        </el-badge>
      </template>
<!--      <div>-->
<!--        aaaa-->
<!--      </div>-->
      <el-table :data="gridData">
        <el-table-column width="150" property="date" label="date"/>
        <el-table-column width="100" property="name" label="name"/>
        <el-table-column width="300" property="address" label="address"/>
      </el-table>
    </el-popover>
  </div>
</template>

<script setup>

const gridData = ref([]);

function goto() {
  gridData.value=  [{
    date: '2016-05-02',
    name: 'Jack',
    address: 'New York City',
  },
      {
        date: '2016-05-04',
        name: 'Jack',
        address: 'New York City',
      },
      {
        date: '2016-05-01',
        name: 'Jack',
        address: 'New York City',
      },
      {
        date: '2016-05-01',
        name: 'Jack',
        address: 'New York City',
      },
      {
        date: '2016-05-01',
        name: 'Jack',
        address: 'New York City',
      },
      {
        date: '2016-05-03',
        name: 'Jack',
        address: 'New York City',
      },]
  console.log(gridData)
}
</script>
<style scoped>
::v-deep .el-badge__content {
  top: 10px;
}
</style>
