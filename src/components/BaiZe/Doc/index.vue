<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script setup>
const url = ref('http://doc.ibaize.vip');

function goto() {
  window.open(url.value)
}
</script>
