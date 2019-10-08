<template>
  <div class="app-container">
    <div style="height:20px"></div>
    <el-form label-width="80px">           
      <el-form-item label="发送对象">
        <el-select v-model="selectedId" value-key='id' placeholder="请选择" @change="selectChange()">
          <el-option v-for="item in selectOtions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
      </el-form-item>
    </el-form>

    <div style="margin-top: 30px">
    <el-checkbox-group style="margin-left:80px" v-model="checkedOtions" size="medium" @change="checkboxChange()">
      <el-checkbox style="margin:20px 20px 0 0" v-for="item in checkboxGroup" :label="item.id" :key="item.id" border>{{item.name}}</el-checkbox>
    </el-checkbox-group>
    </div>

    <div style="margin-top: 30px;margin-left:80px;color:red;font-size:16px;line-height:24px" v-if="selectedId == 1">
      注：<br/>
      1、选择矿区：发送目标是所有属于该矿区的用户<br/>
      2、矿区可多选
    </div>
    <div style="margin-top: 30px;margin-left:80px;color:red;font-size:16px;line-height:24px" v-if="selectedId == 2">
      注：<br/>
      1、选择身份：发送目标是所有拥有该身份的用户<br/>
      2、身份可多选
    </div>
    <div style="margin-top: 30px;margin-left:80px;color:red;font-size:16px;line-height:24px" v-if="selectedId == 3">
      注：<br/>
      1、选择个人：发送目标是所选的用户<br/>
      2、个人可多选
    </div>

    <div style="overflow:hidden;margin-top:80px">
      <span style="float:left;font-size:14px;color:#606266;font-weight:700;width:68px;text-align:right">发送内容</span>
      <el-input style="width:70%;margin-left:12px" type="textarea" :rows="5" maxlength="50" placeholder="请输入内容(最多50个字)" v-model="textareaCon"></el-input>
    </div>

    <div style="width:70%;margin-left:12px;overflow:hidden">
    <el-row style="width:300px;margin:80px auto 0;overflow:hidden">
      <el-button style="float:left;padding-left:40px;padding-right:40px" plain @click="cancel()">取消</el-button>
      <el-button style="float:right;padding-left:40px;padding-right:40px" type="primary" @click="submit()">提交</el-button>
    </el-row> 
    </div>

    <el-dialog title="确认发送通知" :visible.sync="sureVisible" width="400px" center>
      <div class="del-dialog-cnt">
        <div style="width:350px;overflow:hidden;">
          <div style="float:left;width:70px">角色对象</div>
          <div style="float:right;width:278px">{{checkedOtionStr}}</div>
        </div>
        <div style="width:350px;overflow:hidden;margin-top:20px">
          <div style="float:left;width:70px">发送内容</div>
          <div style="float:right;width:278px">{{textareaCon}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sureVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchCheckOtions, addNotice } from "@/api/notice";

export default {
  name: "CreateNotice",
  data() {
    return {
      selectedId: null,
      selectOtions: [
        { name: "矿区", id: 1 },
        { name: "身份", id: 2 },
        { name: "个人", id: 3 }
      ],
      checkboxGroup: [],
      checkedOtions: [],
      textareaCon: null,
      sureVisible: false,
      checkedOtionStrArr: [],
      checkedOtionStr: ""
    };
  },

  methods: {
    selectChange() {
      //console.log(this.selectId);
      this.getCheckOtions();
      this.checkedOtions = [];
    },
    getCheckOtions() {
      fetchCheckOtions({ toObject: this.selectedId }).then(response => {
        //console.log(response.data);
        if (response.data.excuCode) {
          this.checkboxGroup = response.data.data;
        } else {
          this.$alert(response.data.message, "提示", {
            confirmButtonText: "确定"
            // callback: action => {
            //   this.$message({
            //     type: "info",
            //     message: `action: ${action}`
            //   });
            // }
          });
        }
      });
    },
    checkboxChange() {
      //console.log(this.checkedOtions);
    },
    cancel() {
      this.$router.push({ path: this.redirect || "/notice/list" });
    },
    submit() {
      if (!this.checkedOtions.length) {
        this.$alert("请选择发送对象!", "提示", {
          confirmButtonText: "确定"
          // callback: action => {
          //   this.$message({
          //     type: "info",
          //     message: `action: ${action}`
          //   });
          // }
        });
        return false;
      }
      if (!this.textareaCon) {
        this.$alert("请填写发送内容!", "提示", {
          confirmButtonText: "确定"
          // callback: action => {
          //   this.$message({
          //     type: "info",
          //     message: `action: ${action}`
          //   });
          // }
        });
        return false;
      }
      this.checkedOtionStrArr = [];
      this.checkedOtionStr = "";
      for(var i = 0; i < this.checkedOtions.length; i++){
        for(var k = 0; k < this.checkboxGroup.length; k++){
          if(this.checkedOtions[i] == this.checkboxGroup[k].id){
            this.checkedOtionStrArr.push(this.checkboxGroup[k].name);
          }
        }
      }
       this.checkedOtionStr =  this.checkedOtionStrArr.join("、");
      this.sureVisible = true;
    },
    sureSubmit(){
      addNotice({
        toObject: this.selectedId,
        array: this.checkedOtions,
        content: this.textareaCon
      }).then(response => {
        if (response.data.excuCode) {
          this.$notify({
            title: "成功",
            message: "发布通知成功",
            type: "success",
            duration: 2000
          });
          this.$router.push({ path: this.redirect || "/notice/list" });
        } else {
          this.$alert(response.data.message, "提示", {
            confirmButtonText: "确定"
            // callback: action => {
            //   this.$message({
            //     type: "info",
            //     message: `action: ${action}`
            //   });
            // }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
