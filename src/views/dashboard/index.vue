<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div> -->
    <div class="dashboard-huanying">欢迎使用综采工作面压力监测系统管理后台</div>
    <el-row style="margin-left:20px;margin-top:20px;cursor: pointer;" v-if="count">
        <el-col :span="4">
            <el-card shadow="hover" @click.native="$router.push('/evaluate/index')">
                <span class="svg-container">
                    <svg-icon icon-class="guide" />
                </span> 有{{count}}条新的审批消息
            </el-card>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import { untreated } from '@/api/evaluate'
export default {
  name: 'Dashboard',
  data() {
    return {
      count:0
    };
  },
  created(){
      this.getList()
  },
  methods:{
      getList(){
          untreated().then((res)=>{
            this.count = res.data.data.count
          })
      }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    width: 100%
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-huanying{
  width: 100%;
  height: 60px; 
  font-size: 22px;
  color: #999999;
  line-height: 60px; 
  background-color: #E4E4E4;
  text-indent: 20px; 
  margin-top: 2px;
}
</style>
