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

            <el-table-column min-width="300px" label="消息内容">
                <template slot-scope="scope">
                    <span>{{ scope.row.content }}</span>
                </template>
            </el-table-column>

            <el-table-column width="120px" align="center" show-overflow-tooltip="ture" label="通知对象">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column width="180px" align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-delete" style="color:red" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchList, deleteNotice } from "@/api/notice";

export default {
  name: "Notice",
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
      deleteNotice({ noticeId: this.list[this.idx].id }).then(response => {
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
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
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
