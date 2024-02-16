<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script setup>
const url = ref('');

function goto() {
  window.open(url.value)
}
</script>
