<template>
	<el-card class="box-card user-wrap">
		<div slot="header" class="clearfix">
			<span>角色管理</span>
		</div>
		<el-row>
			<el-col :span="4">
				<el-input @input="handleSearch" v-model="searchName" placeholder="请输入角色名称" suffix-icon="el-icon-search">
				</el-input>
			</el-col>
			<el-col :span="3.5" style="float: right;">
				<el-button type="primary" @click="AddOperation=true">添加角色</el-button>
			</el-col>
		</el-row>

		<el-row style="width: 100%;margin: 10px 0;">
			<template>
				<el-table :data="tableData" v-loading="listLoading" @selection-change="handleSelectionChange" border style="width: 100%;border-left: 1px solid #ebeef5;border-top: 1px solid #ebeef5;">
					<el-table-column align="center" type="index">
						<template scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
					</el-table-column>
					</el-table-column>
					<el-table-column prop="RoleName" label="角色名称" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="CreatedTime" label="创建时间" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="Remark" label="备注" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="操作" width="180" align="center">
						<template slot-scope="scope">
							<el-button @click.native.prevent="showDetail(scope.$index, scope.row)" type="text" size="small">
								设置权限
							</el-button>
							<el-button @click.native.prevent="handleEdit(scope.$index, scope.row)" type="text" size="small">
								编辑
							</el-button>
							<el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">
								移除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</template>
		</el-row>

		<!--设置权限-->
		<el-dialog :visible.sync="reviewDetail" :close-on-press-escape="false" :close-on-click-modal="true" :show-close="true"
		 title="设置权限">
			<div>
				<div v-if="IsAndroid==false" style="height: 600px; overflow-y: auto;">

					<div style="float: left;width: 49%;border-right: 1px solid silver;">
						<div style="font-size: 20px;font-weight: 800;margin-bottom: 10px;text-align: center;">设置页面权限</div>
						<el-tree class="filter-tree" :data="treeData" accordion node-key="id" @check="treeCheck" @node-click="handleNodeClick"
						 show-checkbox :props="defaultProps" v-loading="treeLoading" ref="tree">
						</el-tree>
					</div>

					<div style="float: right;width: 49%;">
						<div style="font-size: 20px;font-weight: 800;margin-bottom: 10px;text-align: center;">设置操作权限</div>
						<el-tree class="filter-tree" :data="buttontreeData" node-key="id" check-on-click-node @check="buttonTreeCheck"
						 show-checkbox :props="defaultProps" v-loading="buttonTreeLoading" ref="buttonTree">
						</el-tree>

					</div>
				</div>


				<div v-if="IsAndroid==true" style="height: 600px; overflow-y: auto;">
					<el-tree class="filter-tree" :data="treeAndroidData" accordion node-key="id" @check="treeAndroidCheck"
					 @check-change="treeCheckChange" show-checkbox :props="defaultProps" v-loading="treeAndroidLoading" ref="androidTree">
					</el-tree>
				</div>

				<div slot="footer" class="dialog-footer">
					<el-button ref="btn" @click.stop.prevent="setAndroid()"> {{IsAndroid ? '设置PC端权限' : '设置移动端权限'}}</el-button>
					<!--<el-button @click.native="setAndroid()" :autofocus="false" v-if="IsAndroid==true">设置PC端权限</el-button>-->
					<el-button @click.native="closeReviewDetail()">关闭</el-button>
				</div>
			</div>
		</el-dialog>

		<!--编辑-->
		<el-dialog :visible.sync="EditOperation" title="编辑角色">
			<p>
				<el-form :model="editRoleForm" label-width="80px" :rules="RoleForm_rule" ref="editRoleForm">
					<el-form-item label="角色名称" prop="RoleName">
						<el-input v-model="editRoleForm.RoleName" maxlength="20" auto-complete="off" placeholder="请输入角色名称"></el-input>
					</el-form-item>
					<el-form-item label="备注" prop="Remark" class="textDescrib">
						<el-input v-model="editRoleForm.Remark" maxlength="1000" type="textarea" auto-complete="off" placeholder=""></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="EditOperation = false">取消</el-button>
					<el-button type="primary" @click.native="EditSubmit" :loading="OperateLoading">提交</el-button>
				</div>
			</p>
		</el-dialog>

		<!--添加-->
		<el-dialog :visible.sync="AddOperation" title="添加角色">
			<p>
				<el-form :model="addRoleForm" label-width="80px" :rules="RoleForm_rule" ref="addRoleForm">
					<el-form-item label="角色名称" prop="RoleName">
						<el-input v-model="addRoleForm.RoleName" maxlength="20" auto-complete="off" placeholder="请输入角色名称"></el-input>
					</el-form-item>
					<el-form-item label="备注" prop="Remark" class="textDescrib">
						<el-input v-model="addRoleForm.Remark" maxlength="1000" type="textarea" auto-complete="off" placeholder=""></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="AddOperation = false">取消</el-button>
					<el-button type="primary" @click.native="AddSubmit" :loading="OperateLoading">提交</el-button>
				</div>
			</p>
		</el-dialog>
	</el-card>
</template>

<script>
	import {
		data_validation
	} from '../util/util.js';

	import qs from 'qs';

	export default {
		data() {
			return {

				IsAndroid: false,
				treeAndroidData: null,
				treeAndroidLoading: false,
				IsMark: false,

				//当前选择的角色ID
				selectRoleId: '',

				//按条件搜索
				searchName: '',

				//设置权限数据
				treeData: null,
				buttontreeData: null,
				defaultProps: {
					children: 'children',
					label: 'label'
				},

				//设置权限页面
				reviewDetail: false,
				treeLoading: false,
				buttonTreeLoading: false,
				buttonArray: [],
				//当前选择的菜单ID
				selectMenuId: '',

				//分页参数、表格数据源
				listLoading: false,
				currentPage: 1,
				pageSize: 10,
				multipleSelection: [],
				total: 0,
				pageNum: 1,
				page: 1,
				tableData: [],

				//添加界面
				AddOperation: false,
				//初始化添加表单域
				addRoleForm: {
					RoleName: '',
					Remark: ''
				},

				//编辑界面
				EditOperation: false,
				//初始化编辑表单域
				editRoleForm: {
					RoleName: '',
					Remark: ''
				},

				//表单验证
				RoleForm_rule: {
					RoleName: [{
						required: true,
						validator: data_validation.checkName,
					}]
				},

				//添加、编辑按钮提交时，显示加载中
				OperateLoading: false,
			}
		},
		methods: {

			//关闭设置权限窗口
			closeReviewDetail() {
				this.reviewDetail = false;
				this.IsAndroid = false;
			},

			//（android）设置安卓端权限
			setAndroid() {
				console.log(this.$refs.btn)
				this.$refs.btn.autoFocus = false
				if (this.IsAndroid == true) {
					this.IsAndroid = false;
					this.selectPc(this.selectRoleId);
				} else {
					this.androidTree = [];
					this.treeAndroidLoading = true;
					this.IsAndroid = true;

					//获取所有的菜单和按钮集合(这里处理android端权限)
					this.$axios.get('/api/UserCenter/MenuOrButton/get_projectmenus?' + 'type=' + 3).then((response) => {

						this.treeAndroidData = JSON.parse(response.data.DataModel);

						//绑定当前角色的所有权限
						this.$axios.get('/api/UserCenter/Roles/get_allroleright_android?roleId=' + this.selectRoleId)
							.then((response) => {
								if (response.data.DataModel != '') {
									var result = JSON.parse(response.data.DataModel);
									this.$refs.androidTree.setCheckedKeys(result);
								} else {
									this.$refs.androidTree.setCheckedKeys([]);
								}
								this.treeAndroidLoading = false;
							});
					});
				}
			},

			//（android）勾选菜单 自动保存
			treeAndroidCheck(data) {
				this.treeAndroidLoading = true;
				let _this = this;
				var jsonObj = new Object();
				jsonObj["menuId"] = data.id;
				jsonObj["roleId"] = this.selectRoleId;
				jsonObj["Mark"] = this.IsMark;
				this.$axios.post("/api/UserCenter/Roles/add_menuright_android", jsonObj).then(data => {
					if (data.data.State == 10) {
						_this.$message({
							type: 'success',
							message: data.data.Message
						});
					} else {
						_this.$message({
							type: 'error',
							message: data.data.Message
						});
					}
				});
				_this.treeAndroidLoading = false;
			},


			//勾选菜单 自动保存
			treeCheck(data) {
				this.treeLoading = true;
				let _this = this;
				var jsonObj = new Object();
				jsonObj["menuId"] = data.id;
				jsonObj["roleId"] = this.selectRoleId;

				this.$axios.post("/api/UserCenter/Roles/add_menuright", jsonObj).then(data => {
					if (data.data.State == 10) {
						_this.$message({
							type: 'success',
							message: data.data.Message
						});
					} else {
						_this.$message({
							type: 'error',
							message: data.data.Message
						});
					}
					_this.treeLoading = false;
				});

				this.handleNodeClick(data.data);
			},

			//点击tree节点触发
			treeCheckChange(data1, data2) {
				if (data1.lv == 1 || data1.lv == 2) {
					this.IsMark = data2;
				}
			},

			//勾选 操作按钮 自动保存
			buttonTreeCheck(data) {
				let _this = this;
				var jsonObj = new Object();
				jsonObj["btnId"] = data.id;
				jsonObj["menuId"] = this.selectMenuId;
				jsonObj["roleId"] = this.selectRoleId;
				this.$axios.post("/api/UserCenter/Roles/add_buttonright", jsonObj).then(data => {
					if (data.data.State == 10) {
						_this.$message({
							type: 'success',
							message: data.data.Message
						});
					} else {
						_this.$message({
							type: 'error',
							message: data.data.Message
						});
					}
				});
			},

			//选择菜单项，获取该菜单的操作按钮
			handleNodeClick(data) {
				//过滤一级菜单
				if (data.lv == "1") {
					this.buttontreeData = [];
					return false;
				}

				//判断当前选中的菜单是否为 已存在的页面权限（数据库中是否存在）
				var IsDisabled = true;
				var checkedKeys = this.$refs.tree.getCheckedKeys();
				if (checkedKeys.includes(data.id)) {
					IsDisabled = false;
				}

				this.buttonTreeLoading = true;
				var parameter = 'menuId=' + data.id;
				//根据菜单ID获取按钮集合
				this.$axios.get('/api/UserCenter/MenuOrButton/get_projectbutton_by_menuid?' + parameter)
					.then((response) => {
						//没有页面权限时，不让点击操作权限
						response.data.DataModel.forEach(function(value) {
							value["disabled"] = IsDisabled;
						});
						this.buttontreeData = response.data.DataModel;
						this.selectMenuId = data.id;
					});

				//绑定当前菜单下的的所有操作权限
				var btnParameter = 'menuId=' + data.id + '&roleId=' + this.selectRoleId;
				this.$axios.get('/api/UserCenter/Roles/get_allbuttonrights_by_menuid?' + btnParameter)
					.then((response) => {
						if (response.data.DataModel != '') {
							var result = JSON.parse(response.data.DataModel);
							this.$refs.buttonTree.setCheckedKeys(result);
						} else {
							this.$refs.buttonTree.setCheckedKeys([]);
						}
						this.buttonTreeLoading = false;
					});
			},

			//加载设置权限页面
			showDetail(index, rows) {
				this.selectPc(rows.Id);
			},

			//默认获取PC的权限
			selectPc(rowsId) {
				//每次点击“设置权限”时，清空tree
				this.buttontreeData = [];
				this.treeData = [];
				this.selectRoleId = rowsId;
				this.treeLoading = true;
				this.reviewDetail = true;

				//获取所有的菜单和按钮集合(这里处理PC端权限)
				this.$axios.get('/api/UserCenter/MenuOrButton/get_projectmenus?' + 'type=' + 2).then((response) => {
					this.treeData = JSON.parse(response.data.DataModel);

					//绑定当前角色的所有权限
					this.$axios.get('/api/UserCenter/Roles/get_allroleright?roleId=' + this.selectRoleId)
						.then((response) => {
							var result = JSON.parse(response.data.DataModel);
							this.$refs.tree.setCheckedKeys(result);
							this.treeLoading = false;
						});
				});
			},

			//获取数据
			totalData() {
				this.listLoading = true;
				var parameter = 'roleName=' + this.searchName + '&pageIndex=' + this.currentPage + '&pageSize=' + this.pageSize;
				this.$axios.get('/api/UserCenter/Roles/get_roles?' + parameter)
					.then((response) => {
						this.tableData = response.data.DataModel;
						if (this.tableData == false && this.currentPage > 1) {
							this.currentPage--;
							this.totalData();
						}
						this.total = response.data.TotalCount;
						this.listLoading = false;
					})
			},

			//按条件搜索
			handleSearch() {
				this.currentPage = 1;
				this.totalData();
			},

			//添加
			AddSubmit() {
				//数据验证
				this.$refs.addRoleForm.validate((valid) => {
					this.AddOperation = true;
					if (valid) {
						//序列化表单
						let _this = this;
						var dataForm = _this.addRoleForm;
						var jsonStr = JSON.stringify(dataForm);
						var jsonObj = JSON.parse(jsonStr);
						this.$axios.post("/api/UserCenter/Roles/add_role", jsonObj).then(data => {
							if (data.data.State == 10) {
								_this.$message({
									type: 'success',
									message: data.data.Message
								});
								_this.totalData();
								_this.AddOperation = false;
								_this.$refs.addRoleForm.resetFields();
							} else {
								_this.$message({
									type: 'error',
									message: data.data.Message
								});
							}														
						});
					}
				})
			},

			//删除
			deleteRow(index, rows) {
				this.$confirm('确定要删该行吗，删除后不能恢复！', '删除提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.listLoading = true;
					let _this = this;
					var param = {
						"": rows.Id
					};
					//向后台发送数据进行删除
					this.$axios.post("/api/UserCenter/Roles/delete_role", {"": rows.Id}).then(data => {
						if (data.data.State == 10) {
							_this.$message({
								type: 'success',
								message: data.data.Message
							});
							_this.totalData();
						} else {
							_this.$message({
								type: 'error',
								message: data.data.Message
							});
						}
						_this.listLoading = false;
					});
				});
			},

			//编辑弹出
			handleEdit(index, rows) {
				this.EditOperation = true;
				this.$nextTick(() => {
					var formData = Object.assign({}, rows);
					this.editRoleForm = formData;
					this.$nextTick(() => {
						this.$refs.editRoleForm.clearValidate();
					})					
				})				
				return;
			},

			//编辑提交
			EditSubmit() {
				this.$refs.editRoleForm.validate((valid) => {
					this.EditOperation = true;
					if (valid) {
						//序列化表单
						let _this = this;
						var dataForm = _this.editRoleForm;
						var jsonStr = JSON.stringify(dataForm);
						var jsonObj = JSON.parse(jsonStr);

						this.$axios.post("/api/UserCenter/Roles/edit_role", jsonObj).then(data => {
							if (data.data.State == 10) {
								_this.$message({
									type: 'success',
									message: data.data.Message
								});
								_this.totalData();
							} else {
								_this.$message({
									type: 'error',
									message: data.data.Message
								});
							}
							_this.EditOperation = false;
						});
					}
				})
			},

			//操作表分页的方法
			handleSizeChange(val) {
				this.pageSize = val;
				this.totalData();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.totalData();
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			}
		},
		mounted() {
			this.totalData();
		}
	}
</script>

<style>
	.user-wrap {
		margin: 70px 10px 10px 10px;
	}

	.dialog-footer {
		text-align: right;
	}
</style>
