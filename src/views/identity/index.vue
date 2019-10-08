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
                <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加身份</el-button>
            </div>
            <el-table v-loading="listLoading" :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column type="index" label="序号" sortable width="150">
                </el-table-column>
                <el-table-column prop="identityName" label="身份名称" width="120">
                </el-table-column>
                <el-table-column prop="miningName" label="检测矿区">
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.created_at }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
                <el-form-item label="身份名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="检测矿区" prop="miningId">
                    <el-select v-model="ruleForm.miningId" value-key='id' multiple placeholder="请选择">
                        <el-option v-for="item in miningAreaLists" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
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
    </div>
</template>

<script>
import { fetchList, addIdentity, delIdentity } from '@/api/mine'
import { parseTime } from '@/utils'
export default {
    name: 'identity',
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
            listLoading: true,
            ruleForm: {
                name: '',
                miningId: [],
                type: 1,
            },
            idx: -1,
            dialogStatus: '',//status add update
            rules: {
                name: [{ required: true, message: '身份名称必填', trigger: 'blur' }],
                miningId: [{ required: true, message: '检测矿区必填', trigger: 'blur' }]
            },
            dataTotal:1,
            listQuery: {
                pageNumber: 1,
                pageSize:10
            },
            miningAreaLists: []
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
                name: '',
                miningId: [],
                type: 1
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
                    addIdentity(this.ruleForm).then((res) => {
                         if (res.data.errorCode == '10002') {
                            this.$notify.error({
                                title: '失败',
                                message: '已存在',
                                type: 'success',
                                duration: 2000
                            })
                            return
                        }
                        this.getList()
                        this.editVisible = false
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
            //     identityName: item.identityName,
            //     title: item.title,
            // }
            // this.ruleForm = Object.assign({}, row) // copy obj
            let { miningAreaId, identityName, id } = Object.assign({}, row) // copy obj
            this.$set(this.ruleForm, 'name', identityName);
            this.$set(this.ruleForm, 'miningId', miningAreaId);
            this.$set(this.ruleForm, 'id', id);
            this.editVisible = true;
            this.$nextTick(() => {
                this.$refs['ruleForm'].clearValidate()
            })
        },
        updateData() {
            this.ruleForm.type = 2
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    
                    this.editVisible = false;
                    addIdentity(this.ruleForm).then((res) => {
                         if (res.data.errorCode == '10002') {
                            this.$notify.error({
                                title: '失败',
                                message: '已存在',
                                type: 'success',
                                duration: 2000
                            })
                            return
                        }
                        this.getList()
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
            fetchList({pageSize:this.listQuery.pageSize,pageNumber:this.listQuery.pageNumber}).then(res => {
                this.tableData = res.data.data[0].data;
                this.miningAreaLists = res.data.data[0].miningAreaLists;
                this.dataTotal = res.data.data[0].dataTotal;
                // this.list = response.data.items
                // this.total = response.data.total
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
        deleteRow() {
            delIdentity({ id: this.ruleForm.id }).then(res => {
                this.tableData.splice(this.idx, 1);
                this.getList()
            })
            this.$message.success('删除成功');
            this.delVisible = false;
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
