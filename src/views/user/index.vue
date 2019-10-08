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
				<el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加用户</el-button>
			</div>
			<el-table v-loading="listLoading" :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
				<!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
				<el-table-column type="index" label="序号" sortable width="150">
				</el-table-column>
				<el-table-column prop="username" label="用户名称" width="120">
				</el-table-column>
				<el-table-column prop="identity" label="身份">
				</el-table-column>
				<!-- <el-table-column prop="miningAreaName" label="矿区名称">
                </el-table-column> -->
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
			<div class="pagination-container">
				<el-pagination :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
				 :total="dataTotal" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
				 @current-change="handleCurrentChange" />
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" :visible.sync="editVisible" width="30%">
			<el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="80px">
				<el-form-item label="用户名称" prop="username">
					<el-input v-model="ruleForm.username"></el-input>
				</el-form-item>
				<el-form-item label="身份" prop="identityId">
					<el-select v-model="ruleForm.identityId" class="filter-item" placeholder="请选择身份">
						<el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="矿区名称" prop="miningAreaId">
                    <el-select v-model="ruleForm.miningAreaId" class="filter-item" placeholder="请选择">
                        <el-option v-for="item in miningOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item> -->
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="ruleForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password" v-if="this.dialogStatus !='update'">
					<el-input type="password" v-model.trim="ruleForm.password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="spwd" v-if="this.dialogStatus !='update'">
					<el-input type="password" v-model.trim="ruleForm.spwd"></el-input>
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

		<!-- 重置密码弹出框 -->
		<el-dialog title="重置密码" :visible.sync="resetVisible" width="30%">
			<el-form ref="ruleForm2" :rules="rules2" :model="rulePwd" label-width="80px">
				<!-- <el-form-item label="用户名称" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item> -->
				<el-form-item label="密码" prop="pwds">
					<el-input type="password" v-model="rulePwd.pwds"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="spwds">
					<el-input type="password" v-model="rulePwd.spwds"></el-input>
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
		userAdd,
		userMod,
		userDel,
		userResetPwd
	} from "@/api/user";
	import {
		parseTime
	} from "@/utils";
	import {
		validatePhone,
		validatePassword,
		validateUserName
	} from "@/utils/validate";
	export default {
		name: "user",
		data() {
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.rulePwd.pwds) {
					callback(new Error('两次输入密码不一致!'));
				} else if (!validatePassword(value)) {
					callback(new Error('请输入正确密码'));
				} else {
					callback();
				}
			};
			var validatePass1 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (!validatePassword(value)) {
					callback(new Error('请输入正确密码'));
				} else if (value !== this.ruleForm.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			var checkPhone = (rule, value, callback) => {
				if (!value) {
					callback();
				} else {
					if (validatePhone(value)) {
						callback();
					} else {
						callback(new Error('请输入正确的手机号'));
					}
				}
			}
			var checkUserName = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入用户名'));
				} else {
					if (validateUserName(value)) {
						callback();
					} else {
						callback(new Error('请输入正确的用户名'));
					}
				}
			}
			return {
				tableData: [],
				cur_page: 1,
				multipleSelection: [],
				select_cate: "",
				select_word: "",
				del_list: [],
				is_search: false,
				editVisible: false,
				delVisible: false,
				resetVisible: false,
				ruleForm: {
					id: undefined,
					username: "",
					identityId: "",
					phone: "",
					password: "",
					spwd: ""
				},
				rulePwd: {
					pwds: null,
					spwds: null,
					username: ""
				},
				listQuery: {
					pageNumber: 1,
					pageSize: 10,
				},
				listLoading: true,
				dataTotal: 1,
				statusOptions: [],
				idx: -1,
				fapassowrd: '',
				dialogStatus: "", //status add update
				rules: {
					username: [{
							validator: checkUserName,
							required: true,
							trigger: "blur"
						},
						{
							min: 2,
							max: 8,
							message: '长度在 2到 8 个字符',
							trigger: 'blur'
						}
					],
					phone: [{
						validator: checkPhone,
						trigger: 'blur'
					}],
					identityId: [{
						required: true,
						message: "身份必填",
						trigger: "change"
					}],
					password: [{
							required: true,
							message: "密码必填",
							trigger: "blur"
						},
						{
							min: 6,
							max: 16,
							message: '长度在 6 到 16 个字符',
							trigger: 'blur'
						}
					],
					spwd: [{
							validator: validatePass1,
							trigger: 'blur',
							required: true
						},
						{
							min: 6,
							max: 16,
							message: '长度在 6 到 16 个字符',
							trigger: 'blur'
						}
					]
				},
				rules2: {
					pwds: [{
							required: true,
							message: "密码必填",
							trigger: "blur"
						},
						{
							min: 6,
							max: 16,
							message: '长度在6 到 16 个字符',
							trigger: 'blur'
						}
					],
					spwds: [{
							validator: validatePass2,
							trigger: 'blur',
							required: true
						},
						{
							min: 6,
							max: 16,
							message: '长度在6 到 16 个字符',
							trigger: 'blur'
						}
					]
				}
			};
		},
		created() {
			// this.getData();
			this.getList();
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
					username: "",
					identityId: "",
					phone: "",
					password: "",
					spwd: "",
				};
			},
			resetUser() {
				this.rulePwd = {
					pwds: "",
					spwds: ""
				};
			},

			surePwd() {
				this.$refs["ruleForm2"].validate(valid => {
					if (valid) {
						this.resetVisible = false;
						userResetPwd({
							id: this.rulePwd.id,
							password: this.$md5(this.rulePwd.pwds)
						}).then(() => {
							this.$notify({
								title: "成功",
								message: "重置成功",
								type: "success",
								duration: 2000
							});
						})
					}
				});
			},
			handleCreate() {
				this.resetTemp();
				this.dialogStatus = "create";
				this.editVisible = true;
				this.$nextTick(() => {
					this.$refs["ruleForm"].clearValidate();
				});
			},
			createData() {
				this.$refs["ruleForm"].validate(valid => {
					if (valid) {
						this.ruleForm.password = this.$md5(this.ruleForm.password)
						delete this.ruleForm.spwd
						this.editVisible = false;
						userAdd(this.ruleForm).then((res) => {
							if (res.data.errorCode == '10002') {
								this.$notify.error({
									title: '失败',
									message: '已存在该用户',
									type: 'success',
									duration: 2000
								})
								return
							}
							if (res.data.errorCode == '10003') {
								this.$notify.error({
									title: '失败',
									message: '手机号已存在',
									type: 'success',
									duration: 2000
								})
								return
							}
							this.getList()
							this.$notify({
								title: "成功",
								message: "创建成功",
								type: "success",
								duration: 2000
							});
						})
					}
				});
			},
			resetPwd(index, row) {
				this.resetUser();
				this.resetVisible = true;
				this.rulePwd.id = row.id
				this.$nextTick(() => {
					this.$refs["ruleForm2"].clearValidate();
				});
			},
			handleEdit(index, row) {
				this.dialogStatus = "update";
				this.idx = index;
				this.ruleForm = Object.assign({}, row); // copy obj
				this.ruleForm.identityId = row.identityId
				this.editVisible = true;
				this.$nextTick(() => {
					this.$refs["ruleForm"].clearValidate();
				});
			},
			updateData() {
				console.log(this.ruleForm)
				let {
					created_at,
					identity,
					...obj
				} = this.ruleForm
				this.$refs["ruleForm"].validate(valid => {
					if (valid) {
						this.editVisible = false;
						userMod(obj).then((res) => {
							if (res.data.errorCode == '10002') {
								this.$notify.error({
									title: '失败',
									message: '已存在该用户',
									type: 'success',
									duration: 2000
								})
								return
							}
							if (res.data.errorCode == '10003') {
								this.$notify.error({
									title: '失败',
									message: '手机号已存在',
									type: 'success',
									duration: 2000
								})
								return
							}
							this.getList()
							this.$notify({
								title: "成功",
								message: "更新成功",
								type: "success",
								duration: 2000
							});
						})
					}
				});
			},
			// 分页导航
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
				fetchList({
					pageSize: this.listQuery.pageSize,
					pageNumber: this.listQuery.pageNumber
				}).then(res => {
					this.tableData = res.data.data.userLists;
					this.statusOptions = res.data.data.idLists;
					this.dataTotal = res.data.data.dataTotal;
					this.listLoading = false
				});
			},
			// 获取 easy-mock 的模拟数据
			getData() {
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				if (process.env.NODE_ENV === "development") {
					this.url =
						"https://www.easy-mock.com/mock/592501a391470c0ac1fab128/ms/table/list";
				}
				this.$axios
					.post(this.url, {
						page: this.cur_page
					})
					.then(res => {
						this.tableData = res.data.list;
					});
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
				console.log(row)
				this.ruleForm.id = row.id
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
				userDel({
					id: this.ruleForm.id
				}).then(res => {
					this.$message.success("删除成功");
					this.delVisible = false;
					this.getList()
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
