<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute();

watchEffect(() => {
  console.log(route.params.classId)
})
</script>

<template>
  <div class="class-details-management-container">
    class-details
  </div>
</template>

<style scoped lang="less">
.class-details-management-container {
  width: 100%;
  height: 100%;
}
</style>