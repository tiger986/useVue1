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
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <!-- <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select> -->
                <!-- <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input> -->
                <!-- <el-button type="primary" icon="search" @click="search">搜索</el-button> -->
                <!-- <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加矿区</el-button> -->
            </div>
            <el-table v-loading="listLoading" :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column type="index" align="center" label="序号" width="60" sortable>
                </el-table-column>
                <el-table-column prop="username" align="center" label="反馈用户" width="150">
                </el-table-column>
                <el-table-column prop="contact" align="center" label="联系方式" width="180">
                </el-table-column>
                <el-table-column prop="status" align="center" label="状态" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === 0 ? 'primary' : 'success'" disable-transitions>{{scope.row.status === 0?'未处理':'已处理'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.created_at }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-select style="width:100px" v-model="scope.row.changeStatus" @change="changeHandler(scope.$index,scope.row)" class="filter-item" placeholder="状态">
                            <el-option label="已处理" value="1" />
                            <el-option label="未处理" value="0" />
                        </el-select>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination :current-page="listQuery.pageNumber" :page-sizes="[10,20,30,40]" :page-size="listQuery.pageSize" :total="dataTotal" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="详情" :visible.sync="editVisible" width="30%">
            <el-form ref="ruleForm" :model="ruleForm" label-width="80px">
                <el-form-item label="反馈用户">
                    <el-input :readonly="true" v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="反馈内容">
                    <el-input type="textarea" autosize :readonly="true" v-model="ruleForm.content"></el-input>
                </el-form-item>
                <el-form-item label="反馈时间">
                    <el-input :readonly="true" v-model="ruleForm.created_at"></el-input>
                </el-form-item>
            </el-form>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
            </span> -->
        </el-dialog>
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getComplaintList, changeComplaintStatus, deleteComplaint, getComplaintInfo } from '@/api/evaluate'
export default {
    name: 'evaluate',
    data() {
        return {
            tableData: [],
            editVisible: false,
            multipleSelection: [],
            delVisible: false,
            ruleForm: {
                username: '',
                contact: '',
                created_at: '',
                status: '状态'
            },
            listQuery: {
                pageNumber: 1,
                pageSize: 10
            },
            dataTotal: 1,
            listLoading: true
        }
    },
    created() {
        this.getList()
    },
    methods: {
        changeHandler(index, row) {
            changeComplaintStatus({ id: row.id, status: row.changeStatus }).then(res => {
                this.getList()
            });
        },
        resetTemp() {
            this.ruleForm = {
                username: '',
                contact: '',
                created_at: ''
            }
        },
        handleEdit(index, row) {
            this.ruleForm = Object.assign({}, row) // copy obj
            this.editVisible = true;
            this.$nextTick(() => {
                this.$refs['ruleForm'].clearValidate()
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
            getComplaintList({ pageSize: this.listQuery.pageSize, pageNumber: this.listQuery.pageNumber }).then(res => {
                this.tableData = res.data.data.data;
                this.dataTotal = res.data.data.total;
                this.listLoading = false
                for (var key in this.tableData) {
                    this.$set(this.tableData[key], 'changeStatus', '状态')
                }

            })
        },
        handleDelete(index, row) {
            this.delVisible = true;
            this.ruleForm.id = row.id
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 确定删除
        deleteRow(index, row) {
            deleteComplaint({ id: this.ruleForm.id }).then(res => {
                this.$message.success("删除成功");
                this.getList()
            });
            this.delVisible = false;
        },
        delAll() {
            let item = [];
            this.multipleSelection.map(i => {
                return item.push(i.id)
            })
            if (item != '') {
                deleteComplaint({ id: item }).then(res => {
                    this.$message.success("删除成功");
                    this.getList()
                });
            }
        }
    }
}

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
</style>
