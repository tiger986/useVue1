<template>
    <div class="app-container">
        <!-- <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
        <div class="container">
            <div class="handle-box">
                <div></div>
                <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
                <!-- <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select> -->
                <!-- <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input> -->
                <!-- <el-button type="primary" icon="search" @click="search">搜索</el-button> -->
                <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加后台用户</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column type="index" label="序号" sortable width="120">
                </el-table-column>
                <el-table-column prop="username" label="用户名称" width="120">
                </el-table-column>
                <el-table-column prop="phone" label="手机号">
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.created_at}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button type="text" icon="el-icon-refresh" class="success" @click="resetPwd(scope.$index, scope.row)">重置密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="100">
                </el-pagination>
            </div> -->
            <div class="pagination-container">
                <el-pagination v-show="total>0" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="80px">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="ruleForm.phone"></el-input>
                </el-form-item>
                <div v-show="editVisible2">
                  <el-form-item label="密码" prop="pwd">
                      <el-input type="password" v-model="ruleForm.pwd"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="spwd">
                      <el-input type="password" v-model="ruleForm.spwd"></el-input>
                  </el-form-item>
                </div>
                <!-- <el-form-item label="矿区名称">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item> -->

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 重置密码弹出框 -->
        <el-dialog title="重置密码" :visible.sync="resetVisible" width="30%">
            <el-form ref="ruleForm2" :rules="rules2" :model="rulePwd" label-width="80px">
                <!-- <el-form-item label="用户名称" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item> -->
                <el-form-item label="密码" prop="pwd">
                    <el-input type="password" v-model="rulePwd.pwd"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="spwd">
                    <el-input type="password" v-model="rulePwd.spwd"></el-input>
                </el-form-item>
                <!-- <el-form-item label="矿区名称">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item> -->

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetVisible = false">取 消</el-button>
                <el-button type="primary" @click="surePwd()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
  fetchList,
  editUser,
  resetPwd,
  addUser,
  delUser
} from "@/api/userList";
// import { parseTime } from "@/utils";
export default {
  name: "userList",
  data() {
    return {
      url: "./static/vuetable.json",
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      editVisible2: false,
      delVisible: false,
      resetVisible: false,
      ruleForm: {
        userId: undefined,
        username: "",
        identity: "",
        phone: "",
        pwd: "",
        spwd: ""
      },
      ruleFormsd: {
        userId: undefined,
        username: "",
        identity: "",
        phone: "",
        pwd: "",
        spwd: ""
      },
      rulePwd: {
        pwd: "",
        spwd: "",
        username: ""
      },
      rulePwds: {
        pwd: "",
        spwd: "",
        username: ""
      },
      listQuery: {
        pageNumber: 1,
        pageSize: 10
      },
      total: null,
      statusOptions: ["矿长", "副矿长", "采取队长", "调度室"],
      idx: -1,
      dialogStatus: "", //status add update
      rules: {
        username: [
          { required: true, message: "用户名称必填", trigger: "blur" }
        ],
        identity: [{ required: true, message: "身份必填", trigger: "blur" }],
        pwd: [{ required: true, message: "密码必填", trigger: "blur" }],
        spwd: [{ required: true, message: "确认密码必填", trigger: "blur" }]
      },
      rules2: {
        pwd: [{ required: true, message: "密码必填", trigger: "blur" }],
        spwd: [{ required: true, message: "确认密码必填", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  computed: {},
  methods: {
    resetTemp() {
      this.ruleForm = {
        username: "",
        title: "",
        identity: "",
        phone: "",
        pwd: "",
        spwd: "",
        created_at: new Date()
      };
    },
    resetUser() {
      this.rulePwd = {
        pwd: "",
        spwd: ""
      };
    },

    surePwd() {
      //console.log(this.rulePwd);

      this.$refs["ruleForm2"].validate(valid => {
        if (valid) {
          if(this.rulePwd.pwd != this.rulePwd.spwd){
              this.$alert("两次密码不一致！", "提示", {
                confirmButtonText: "确定",
                // callback: action => {
                //   this.$message({
                //     type: "info",
                //     message: `action: ${action}`
                //   });
                // }
              });
              return false
          }
          this.resetVisible = false;
          //console.log(this.rulePwd);
          this.rulePwds = Object.assign({}, this.rulePwd);
          this.rulePwds.pwd = this.$md5(this.rulePwds.pwd);
          resetPwd(this.rulePwds).then(response => {
            //console.log(res)
            if (response.data.excuCode) {
              this.$notify({
                title: "成功",
                message: "重置成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.$alert(response.data.message, "提示", {
                confirmButtonText: "确定",
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
      });
    },
    handleCreate() {
      this.rules = {
        username: [
          { required: true, message: "用户名称必填", trigger: "blur" }
        ],
        identity: [{ required: true, message: "身份必填", trigger: "blur" }],
        pwd: [{ required: true, message: "密码必填", trigger: "blur" }],
        spwd: [{ required: true, message: "确认密码必填", trigger: "blur" }]
      };
      this.resetTemp();
      this.dialogStatus = "create";
      this.editVisible = true;
      this.editVisible2 = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          //console.log(this.ruleForm);
          var re = /^1[34578]\d{9}$/;
          //var re2 = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
          if (this.ruleForm.phone && !re.test(this.ruleForm.phone)) {
            this.$alert("请输入正确的电话号码！", "提示", {
              confirmButtonText: "确定",
              // callback: action => {
              //   this.$message({
              //     type: "info",
              //     message: `action: ${action}`
              //   });
              // }
            });
            return false;
          }
          if(this.ruleForm.pwd != this.ruleForm.spwd){
              this.$alert("两次密码不一致！", "提示", {
                confirmButtonText: "确定",
                // callback: action => {
                //   this.$message({
                //     type: "info",
                //     message: `action: ${action}`
                //   });
                // }
              });
              return false
          }
          this.ruleFormsd = Object.assign({}, this.ruleForm);
          this.ruleFormsd.pwd = this.$md5(this.ruleFormsd.pwd);
          addUser(this.ruleFormsd).then(response => {
            //console.log(res)
            if (response.data.excuCode) {
              this.ruleForm.id = parseInt(Math.random() * 100) + 1024; // mock a id
              this.tableData.unshift(this.ruleForm);
              this.editVisible = false;
              this.editVisible2 = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.$alert(response.data.message, "提示", {
                confirmButtonText: "确定",
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
      });
    },
    resetPwd(index, row) {
      this.resetUser();
      this.resetVisible = true;
      this.rulePwd = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs["ruleForm2"].clearValidate();
      });
    },
    handleEdit(index, row) {
      this.rules = {
        username: [
          { required: true, message: "用户名称必填", trigger: "blur" }
        ],
        identity: [{ required: true, message: "身份必填", trigger: "blur" }],
      };
      this.dialogStatus = "update";
      this.idx = index;
      this.ruleForm = Object.assign({}, row); // copy obj
      this.editVisible = true;
      this.editVisible2 = false;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          //console.log(this.ruleForm);
          var re = /^1[34578]\d{9}$/;
          //var re2 = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
          if (this.ruleForm.phone && !re.test(this.ruleForm.phone)) {
            this.$alert("请输入正确的电话号码！", "提示", {
              confirmButtonText: "确定",
              // callback: action => {
              //   this.$message({
              //     type: "info",
              //     message: `action: ${action}`
              //   }); 
              // }
            });
            return false;
          }
          editUser(this.ruleForm).then(response => {
            //console.log(res)
            if (response.data.excuCode) {
              this.$set(this.tableData, this.idx, this.ruleForm);
              this.editVisible = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.$alert(response.data.message, "提示", {
                confirmButtonText: "确定",
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
      });
    },
    // 分页导航
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        //console.log(response.data);
        if (response.data.excuCode) {
          this.tableData = response.data.data.data;
          this.total = response.data.data.total;
          this.listLoading = false;
        } else {
          this.listLoading = false;
          this.$alert(response.data.message, "提示", {
            confirmButtonText: "确定",
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

    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 确定删除
    deleteRow() {
      //console.log(this.tableData[this.idx].id);
      delUser({ userId: this.tableData[this.idx].userId }).then(response => {
        //console.log(res)
        if (response.data.excuCode) {
          this.tableData.splice(this.idx, 1);
          this.$message.success("删除成功");
          this.delVisible = false;
        } else {
          this.$alert(response.data.message, "提示", {
            confirmButtonText: "确定",
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
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.success {
  color: #67c23a;
}
</style>
