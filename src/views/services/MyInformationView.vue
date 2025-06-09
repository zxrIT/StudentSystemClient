<script setup lang="ts">
import {useSystemStore} from "@/store";
import {useUserInfoStore} from "@/store/storeHooks/userInfoStore";
import {TEACHER_JOB} from "@/typings/enum/user";
import carouselImage1 from "@/assets/icon/carouselImage1.jpg"
import carouselImage2 from "@/assets/icon/carouselImage2.jpg"
import carouselImage3 from "@/assets/icon/carouselImage3.jpg"
import carouselImage4 from "@/assets/icon/carouselImage4.jpg"

const systemStore = useSystemStore()
const userInfoStore = useUserInfoStore()
const carouselImageList = [carouselImage1, carouselImage2, carouselImage3, carouselImage4]

const __VITE_USER_AVATAR__ = computed(() => import.meta.env.VITE_USER_AVATAR)
</script>

<template>
  <div class="my-information-container">
    <el-card class="card-container">
      <div class="card-header">
        <div class="block text-center" style="border-radius: 10px">
          <el-carousel height="300px" motion-blur style="border-radius: 10px">
            <el-carousel-item v-for="(item,index) in carouselImageList" :key="index">
              <el-image style="width: 100%;height: 100%" :src="item"/>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="card-descriptions">
        <el-descriptions title="用户详细身份数据" border>
          <el-descriptions-item
              :rowspan="2"
              :width="140"
              label="用户照片"
              align="center"
              class="description-item"
          >
            <el-image
                style="width: 100px; height: 100px"
                :src="
                userInfoStore.userInfoStore.icon===undefined ||  userInfoStore.userInfoStore.icon===null?
                __VITE_USER_AVATAR__:
                 userInfoStore.userInfoStore.icon"
            />
          </el-descriptions-item>
          <el-descriptions-item
              label="用户名"
              class="description-item"
          >{{ userInfoStore.userInfoStore.name }}
          </el-descriptions-item>
          <el-descriptions-item
              label="用户id"
              class="description-item"
          >{{ userInfoStore.userInfoStore.id }}
          </el-descriptions-item>
          <el-descriptions-item
              :label="userInfoStore.userInfoStore.roleId===1? '职称':'所在班级'"
              class="description-item"
          >
            <el-tag size="large" type="warning">
              {{
                userInfoStore.userInfoStore.roleId === 1 ? (userInfoStore.userInfoStore.job === 0 ? TEACHER_JOB.LECTURER :
                    userInfoStore.userInfoStore.job === 1 ?
                        TEACHER_JOB.ASSOCIATE_PROFESSOR : TEACHER_JOB.PROFESSOR) : userInfoStore.userInfoStore.className
              }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item
              label="所在学院"
              class="description-item"
          >
            <el-tag size="large">{{ userInfoStore.userInfoStore.college }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item
              label="用户令牌"
              class="description-item"
          >
            {{ (userInfoStore.userInfoStore.token as string).substring(0, 100) + "..." }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="less">
.my-information-container {
  width: 100%;
  height: 100%;

  .card-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-header {
    width: 100%;
    flex: 3;

    .demonstration {
      color: var(--el-text-color-secondary);
    }

    .el-carousel__item h3 {
      color: #475669;
      opacity: 0.75;
      line-height: 200px;
      margin: 0;
      text-align: center;
    }

    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n + 1) {
      background-color: #d3dce6;
    }
  }

  .card-descriptions {
    flex: 2;
    width: 100%;
    margin-top: 50px;

    :deep(.el-descriptions) {
      .el-descriptions__body {
        .el-descriptions__table {
          width: 100%;

          tbody {
            tr {
              td, th {
                text-align: center;
                vertical-align: middle;
                padding: 12px 10px;

                .el-tag {
                  margin: 0 auto;
                }

                .el-image {
                  display: block;
                  margin: 0 auto;
                }
              }
            }
          }
        }
      }

      .description-item {
        .cell {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      }
    }
  }
}
</style>