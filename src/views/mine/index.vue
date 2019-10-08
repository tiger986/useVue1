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
                <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
                <!-- <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select> -->
                <!-- <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input> -->
                <!-- <el-button type="primary" icon="search" @click="search">搜索</el-button> -->
                <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加矿区</el-button>
            </div>
            <el-table :row-class-name="tableRowClassName" v-loading="listLoading" :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column type="index" label="序号" sortable width="150">
                </el-table-column>
                <el-table-column prop="name" label="矿区名称" width="120">
                </el-table-column>
                <el-table-column prop="workingFaceName" label="工作面">
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.created_at }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" v-if="scope.row.status==1" class="red" @click="handleDelete(scope.$index, scope.row)">禁用</el-button>
                        <el-button type="text" icon="el-icon-tickets" v-if="scope.row.status==0" class="red" @click="handleRecovery(scope.$index, scope.row)">恢复</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="dataTotal" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="80px">
                <el-form-item label="矿区名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <!-- <el-form-item label="工作面">
                    <el-input v-model="ruleForm.workingFaceName"></el-input>
                </el-form-item> -->
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
            <div class="del-dialog-cnt">是否确定禁用？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { fetchList, miningAreaAdd, miningAreaDel, miningAreaMod ,statusChange  } from '@/api/mineManage'
import { parseTime } from '@/utils'
export default {
    name: 'mine',
    data() {
        return {
            url: './static/vuetable.json',
            tableData: [],
            cur_page: 1,
            multipleSelection: [],
            select_cate: '',
            select_word: '',
            del_list: [],
            is_search: false,
            editVisible: false,
            delVisible: false,
            ruleForm: {
                name: '',
            },
            listQuery: {
                pageNumber: 1,
                pageSize: 10
            },
            idx: -1,
            dialogStatus: '',//status add update
            rules: {
                name: [{ required: true, message: '矿区名称必填', trigger: 'blur' }]
            },
            dataTotal: 1,
            listLoading: true
        }
    },
    created() {
        // this.getData();
        this.getList()
    },
    computed: {
        // data() {
        //     return this.tableData.filter((d) => {
        //         let is_del = false;
        //         for (let i = 0; i < this.del_list.length; i++) {
        //             if (d.name === this.del_list[i].name) {
        //                 is_del = true;
        //                 break;
        //             }
        //         }
        //         if (!is_del) {
        //             if (d.address.indexOf(this.select_cate) > -1 &&
        //                 (d.name.indexOf(this.select_word) > -1 ||
        //                     d.address.indexOf(this.select_word) > -1)
        //             ) {
        //                 return d;
        //             }
        //         }
        //     })
        // }
    },
    methods: {
        resetTemp() {
            this.ruleForm = {
                name: ''
            }
        },
        handleCreate() {
            this.resetTemp()
            this.dialogStatus = 'create'
            this.editVisible = true
            this.$nextTick(() => {
                this.$refs['ruleForm'].clearValidate()
            })
        },
        createData() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.editVisible = false
                    miningAreaAdd(this.ruleForm).then((res) => {
                        if (res.data.errorCode == '10002') {
                            this.$notify.error({
                                title: '失败',
                                message: '已存在该矿区',
                                type: 'success',
                                duration: 2000
                            })
                            return
                        }
                        this.getList()
                        this.$notify({
                            title: '成功',
                            message: '创建成功',
                            type: 'success',
                            duration: 2000
                        })
                    })
                }
            })
        },
        handleEdit(index, row) {
            this.dialogStatus = 'update'
            this.idx = index;
            // const item = this.tableData[index];
            // this.ruleForm = {
            //     name: item.name,
            //     title: item.title,
            // }
            this.ruleForm = Object.assign({}, row) // copy obj
            this.editVisible = true;
            this.$nextTick(() => {
                this.$refs['ruleForm'].clearValidate()
            })
        },
        updateData() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    miningAreaMod(this.ruleForm).then((res) => {
                        if (res.data.errorCode == '10002') {
                            this.$notify.error({
                                title: '失败',
                                message: '已存在该矿区',
                                type: 'success',
                                duration: 2000
                            })
                            return
                        }
                        this.getList()
                        this.editVisible = false
                        this.$notify({
                            title: '成功',
                            message: '更新成功',
                            type: 'success',
                            duration: 2000
                        })
                    })
                }
            })
        },
        handleCurrentChange(val) {
            this.listQuery.pageNumber = val;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.pageSize = val
            this.getList()
        },
        getList() {
            this.listLoading = true
            fetchList({pageSize: this.listQuery.pageSize, pageNumber: this.listQuery.pageNumber }).then(res => {
                this.tableData = res.data.data.data;
                this.dataTotal = res.data.data.dataTotal;
                // this.statusOptions = res.data.data.miningAreas;
                this.listLoading = false
            })
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
            if (process.env.NODE_ENV === 'development') {
                this.url = 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128/ms/table/list';
            };
            this.$axios.post(this.url, {
                page: this.cur_page
            }).then((res) => {
                this.tableData = res.data.list;
            })
        },
        search() {
            this.is_search = true;
        },
        // formatter(row, column) {
        //     console.log(row, column)
        //     // return row.address;
        // },
        filterTag(value, row) {
            return row.tag === value;
        },

        handleDelete(index, row) {
            this.idx = index;
            this.delVisible = true;
            this.ruleForm.id = row.id
            this.ruleForm.status = row.status
        },
        handleRecovery(index,row) {
            statusChange({ id: this.tableData[index].id,status:this.tableData[index].status }).then(res => {
                this.getList()
                this.$message.success("恢复成功");
            });
        },
        delAll() {
            const length = this.multipleSelection.length;
            let str = '';
            this.del_list = this.del_list.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error('删除了' + str);
            this.multipleSelection = [];
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 确定删除
        deleteRow(index,row) {
            statusChange({ id: this.ruleForm.id,status:this.ruleForm.status }).then(res => {
                this.$message.success("禁用成功");
                this.getList()
            });
            this.delVisible = false;
        },
        tableRowClassName({row, rowIndex}) {
        if (row.status === 0) {
          return 'warning-row';
        }
        return '';
      }
    }
}

</script>
<style>
  .el-table .warning-row {
    background: #e4e7ed;
  }
</style>

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
</style>
