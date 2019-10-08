<template>
    <div class="app-container">

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
            <!-- <el-table-column align="center" label="ID" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column> -->
            <el-table-column type="index" label="序号" sortable width="120">
            </el-table-column>

            <el-table-column min-width="300px" label="文章标题">
                <template slot-scope="scope">
                    <router-link :to="'/example/edit/'+scope.row.id" class="link-type">
                        <span>{{ scope.row.title }}</span>
                    </router-link>
                </template>
            </el-table-column>

            <el-table-column width="120px" align="center" label="发布人">
                <template slot-scope="scope">
                    <span>{{ scope.row.author }}</span>
                </template>
            </el-table-column>

            <el-table-column class-name="status-col" label="状态" width="110">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status==1?"已发布":"已撤回" }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column width="180px" align="center" label="发布时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            
            <el-table-column class-name="status-col" label="阅读量" width="110">
                <template slot-scope="scope">
                    <span>{{ scope.row.readings }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button v-show="scope.row.status==1" type="text" icon="el-icon-refresh"  style="color:#67C23A" class="success" @click="handleWithdraw(scope.$index, scope.row)">撤回</el-button>
                    <router-link :to="'/example/edit/'+scope.row.id"  v-show="scope.row.status==2">
                        <el-button type="text" icon="el-icon-edit">编辑</el-button>
                    </router-link>
                    <el-button  v-show="scope.row.status==2" type="text" icon="el-icon-delete" style="color:red" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 撤回提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible2" width="300px" center>
            <div class="del-dialog-cnt">撤回不再展示，是否确定撤回？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="withdrawRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchList, delNews, changeStatus } from "@/api/article";

export default {
  name: "ArticleList",
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      delVisible: false,
      delVisible2: false,
      idx: -1,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        //console.log(response.data);
        if (response.data.excuCode) {
          this.list = response.data.data.data;
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
    // 确定删除
    deleteRow() {
      //console.log(this.tableData[this.idx].id);
      delNews({ id: this.list[this.idx].id }).then(response => {
        //console.log(res)
        if (response.data.excuCode) {
          this.list.splice(this.idx, 1);
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
    },
    handleWithdraw(index, row) {
      this.idx = index;
      this.delVisible2 = true;
    },
    // 确定撤回
    withdrawRow() {
      //console.log(this.tableData[this.idx].id);
      changeStatus({ id: this.list[this.idx].id }).then(response => {
        //console.log(res)
        if (response.data.excuCode) {
          this.list[this.idx].status = 2;
          this.$message.success("撤回成功");
          this.delVisible2 = false;
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
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
