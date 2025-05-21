<script setup lang="ts">
import LeftNav from "@/components/home/LeftNav.vue";
import {useInternationalization, useTopic} from "@/hooks/useSystem";

watch(() => {
  console.log(useInternationalization(), useTopic())
})

</script>

<template>
  <el-config-provider :locale="useInternationalization()" :theme="useTopic()">
    <div class="home-container">
      <div class="header-container">
        <Header/>
      </div>
      <div class="content-container">
        <div class="left-container">
          <LeftNav/>
        </div>
        <div class="context-container">
          <div class="router-container">
            <keep-alive>
              <router-view/>
            </keep-alive>
          </div>
          <div class="footer-container">
            <Footer/>
          </div>
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<style scoped lang="less">
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header-container {
    flex: 1;
    margin: 5px 25px 15px 5px;
  }

  .content-container {
    flex: 19;
    display: flex;
    flex-direction: row;

    .left-container {
      margin-left: 10px;
      flex: 1;
      margin-bottom: 5px;
    }

    .context-container {
      flex: 7;
      display: flex;
      flex-direction: column;

      .router-container {
        flex: 14;
        margin-left: 10px;
        margin-right: 20px;
        margin-bottom: 10px;
      }

      .footer-container {
        flex: 1;
        text-align: center;
        margin-left: 5px;
        margin-right: 20px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>