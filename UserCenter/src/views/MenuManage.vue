<template>
	<el-card class="box-card menu-manage-wrap">
		<div slot="header" class="clearfix">
			<span>菜单管理</span>
		</div>
		<div class="menu-left">
			<div style="text-align: center;padding: 10px 0;border-bottom: 1px solid #ebeef5;">
				<el-select v-model="SelectFunctionTypeValue" @change="SelectFunctionTypeValueChange" placeholder="请选择菜单类型" size="small"
				 style="width: 120px;">
					<el-option v-for="item in SelectFunctionType" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button type="primary" size="small" style="float:right;margin-right: 20px;" @click="addMenu">添加根菜单</el-button>
			</div>
			<div style="color: #FF0000;padding: 20px 0 0 0px;text-align: center;font-size: 12px;">(右键可删除菜单列表)</div>
			<div class="tree-list">
				<el-tree :data="ProjectMenuList" :expand-on-click-node="false" v-loading="treeLoading" @node-click="handleNodeClick"
				 @node-contextmenu="handleNodeContextmenu" style="float: left; max-height: calc(100vh - 257px); width: 100%; overflow: auto;"
				 default-expand-all>
				</el-tree>
			</div>
		</div>
		<!--子菜单管理-->
		<div class="menu-right">
			<el-row>
				<el-col :span="3.5" style="float: left;">
					已选父菜单：｛ <span style="color: red;">{{TableTitle==""?"未选择":TableTitle}}</span> ｝
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="3.5" style="float: right;">
					<el-button type="primary" v-if="addItem" :disabled="IsDisabled" @click="addSubmenu(TableId,TableTitle)">添加子菜单</el-button>
				</el-col>
			</el-row>
			<el-row style="width: 100%;margin: 10px 0;">
				<template>
					<el-table :data="subMenuData" @selection-change="handleSelectionChange" border style="width: 100%;">
						<el-table-column align="center" type="index">
							<template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * 5 + 1}} </span></template>
						</el-table-column>
						<el-table-column prop="FunctionKey" label="菜单Key" align="center" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="FunctionName" label="菜单名称" align="center" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="FunctionUrl" label="菜单Url" align="center" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="CreatedTime" label="创建时间" align="center">
						</el-table-column>
						<el-table-column label="操作" width="300" align="center">
							<template slot-scope="scope">
								<el-button @click.native.prevent="editMenu(scope.$index, scope.row)" type="text" size="small">
									编辑
								</el-button>
								<el-button @click.native.prevent="deleteMenu(scope.$index, scope.row)" type="text" size="small">
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
			<hr />
			<hr />
			<el-row>
				<el-col :span="3.5" style="float: right;">
					<el-button type="primary" :disabled="IsDisabled" @click="addButton(TableId,TableTitle)">添加操作项</el-button>
				</el-col>
			</el-row>
			<el-row style="width: 100%;margin: 10px 0;">
				<el-table :data="buttonData" @selection-change="handleSelectionChanges" border style="width: 100%;">
					<el-table-column align="center" type="index">
						<template slot-scope="scope"><span>{{scope.$index+(currentPages - 1) * pageSize + 1}} </span></template>
					</el-table-column>
					</el-table-column>
					<el-table-column prop="ButtonKey" label="按钮Key" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="ButtonName" label="按钮名称" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="ButtonUrl" label="按钮Url" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="CreatedTime" label="创建时间" align="center">
					</el-table-column>
					<el-table-column label="操作" width="300" align="center">
						<template slot-scope="scope">
							<el-button @click.native.prevent="editButton(scope.$index, scope.row)" type="text" size="small">
								编辑
							</el-button>
							<el-button @click.native.prevent="deleteButton(scope.$index, scope.row)" type="text" size="small">
								移除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChanges" @current-change="handleCurrentChanges" :current-page="currentPages"
				 :page-size="pageSizes" layout="total, prev, pager, next, jumper" :total="totals">
				</el-pagination>
			</el-row>
		</div>
		<!--添加/编辑（菜单）-->
		<el-dialog :visible.sync="OperationPage" :title="modelTitle">
			<p>
				<el-form :model="OperationForm" label-width="120px" :rules="OperationRules" ref="OperationForm">

					<el-form-item label="父级菜单Id" v-if="false" prop="TableId"></el-form-item>
					<el-form-item label="父级菜单" v-if="IsAddSubmenu">
						<span style="font-weight: bold;">{{TableTitle}}</span>
					</el-form-item>
					<el-form-item label="菜单Key" prop="FunctionKey">
						<el-input v-model="OperationForm.FunctionKey" maxlength="64" auto-complete="off" placeholder="请输入菜单Key"></el-input>
					</el-form-item>
					<el-form-item label="菜单名称" prop="FunctionName">
						<el-input v-model="OperationForm.FunctionName" maxlength="10" auto-complete="off" placeholder="请输入菜单名称"></el-input>
					</el-form-item>
					<el-form-item label="菜单Url" prop="FunctionUrl">
						<el-input v-model="OperationForm.FunctionUrl" maxlength="500" auto-complete="off" placeholder="请输入菜单Url"></el-input>
					</el-form-item>
					<el-form-item label="菜单图标" prop="Icon">
						<el-input v-model="OperationForm.Icon" maxlength="256" auto-complete="off" placeholder="请输入菜单图标"></el-input>
					</el-form-item>
					<el-form-item label="排序码" prop="DisplayNo">
						<el-input v-model="OperationForm.DisplayNo" maxlength="5" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="OperationPage = false">取消</el-button>
					<el-button type="primary" @click.native="SubmitOperation" :loading="OperateLoading">提交</el-button>
				</div>
			</p>
		</el-dialog>

		<!--添加/编辑（按钮）-->
		<el-dialog :visible.sync="ButtonPage" :title="buttonTitle">
			<p>
				<el-form :model="ButtonForm" label-width="120px" :rules="ButtonRules" ref="ButtonForm">
					<el-form-item label="菜单Id" v-if="false" prop="TableId"></el-form-item>
					<el-form-item label="所属菜单">
						<span style="font-weight: bold;">{{TableTitle}}</span>
					</el-form-item>
					<el-form-item label="按钮Key" prop="ButtonKey">
						<el-input v-model="ButtonForm.ButtonKey" maxlength="50" auto-complete="off" placeholder="请输入按钮Key"></el-input>
					</el-form-item>
					<el-form-item label="按钮名称" prop="ButtonName">
						<el-input v-model="ButtonForm.ButtonName" maxlength="50" auto-complete="off" placeholder="请输入按钮名称"></el-input>
					</el-form-item>
					<el-form-item label="按钮Url" prop="ButtonUrl">
						<el-input v-model="ButtonForm.ButtonUrl" maxlength="500" auto-complete="off" placeholder="请输入按钮Url"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="ButtonPage = false">取消</el-button>
					<el-button type="primary" @click.native="SubmitButton" :loading="ButtonLoading">提交</el-button>
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

				//默认禁用添加按钮
				IsDisabled: true,

				//当前选中父菜单的label和Id
				TableTitle: '',
				TableId: '',

				//系统菜单Tree数据
				ProjectMenuList: [],
				treeLoading: false,

				//是否正在添加子菜单
				IsAddSubmenu: false,

				//是否正在添加父菜单
				IsAddMenu: false,

				//菜单类型
				SelectFunctionTypeValue: 2,
				SelectFunctionType: [{
					value: 2,
					label: '系统平台'
				}, {
					value: 3,
					label: '移动平台'
				}],

				//操作页面
				OperationPage: false,
				ButtonPage: false,

				//弹出操作窗口标题
				modelTitle: '',
				buttonTitle: '',

				//操作请求Url
				requestUrl: '',
				buttonUrl: '',

				listLoading: false,

				//分页参数_子菜单
				currentPage: 1,
				pageSize: 5,
				multipleSelection: [],
				total: 0,
				subMenuData: [],

				//分页参数_按钮
				currentPages: 1,
				pageSizes: 5,
				multipleSelections: [],
				totals: 0,
				buttonData: [],

				//初始化操作表单域
				OperationForm: {
					FunctionKey: '',
					FunctionName: '',
					FunctionUrl: '',
					FunctionType: '',
					DisplayNo: 0,
					Icon: ''
				},

				//表单数据验证
				OperationRules: {
					FunctionKey: [{
						required: true,
						validator: data_validation.checkName
					}],
					FunctionName: [{
						required: true,
						validator: data_validation.checkName
					}],
					FunctionUrl: [{
						required: true,
						message: '请输入菜单Url',
						trigger: 'blur'
					}],
					FunctionType: [{
						required: true,
						message: '请选择菜单类型',
						trigger: 'change'
					}]
				},

				//初始化操作按钮表单域
				ButtonForm: {
					ButtonKey: '',
					ButtonName: '',
					ButtonUrl: ''
				},
				//操作按钮表单数据验证
				ButtonRules: {
					ButtonKey: [{
						required: true,
						validator: data_validation.checkName
					}],
					ButtonName: [{
						required: true,
						validator: data_validation.checkName
					}],
					ButtonUrl: [{
						required: true,
						message: '请输入按钮Url',
						trigger: 'blur'
					}]
				},

				//添加、编辑按钮提交时，显示加载中
				OperateLoading: false,
				ButtonLoading: false,
				addItem:true,
			}
		},
		methods: {

			//按菜单类型筛选数据
			SelectFunctionTypeValueChange() {
				this.buttonData = [];
				this.subMenuData = [];
				this.TableTitle = '';
				this.TableId = '';
				this.currentPage = 1;
				this.pageSize = 5;
				this.total = 0;
				this.currentPages = 1;
				this.pageSizes = 5;
				this.totals = 0;
				this.IsDisabled = true;
				this.getTreeData();
			},

			//添加父菜单
			addMenu() {
				this.requestUrl = "/api/UserCenter/MenuOrButton/add_projectmenu";
				this.modelTitle = "添加根菜单";
				this.IsAddMenu = true;
				this.IsAddSubmenu = false;
				this.OperationPage = true;
				//回调获取更新后的dom再渲染
				this.$nextTick(() => {
					this.$refs.OperationForm.resetFields();
				});
			},

			//添加子菜单
			addSubmenu(menuId, menuTitle) {
				this.requestUrl = "/api/UserCenter/MenuOrButton/add_projectmenu";
				this.modelTitle = "添加子菜单";
				this.TableId = menuId;
				this.TableTitle = menuTitle;
				this.IsAddMenu = false;
				this.IsAddSubmenu = true;
				this.OperationPage = true;
				//回调获取更新后的dom再渲染
				this.$nextTick(() => {
					this.$refs.OperationForm.resetFields();
				});
			},

			//点击编辑
			editMenu(index, row) {
				this.requestUrl = "/api/UserCenter/MenuOrButton/modify_projectmenu";
				this.modelTitle = "编辑子菜单";
				this.IsAddMenu = false;
				this.IsAddSubmenu = false;
				this.OperationPage = true;
				//回调获取更新后的dom再渲染
				this.$nextTick(() => {
					//拷贝对象
					this.OperationForm = Object.assign({}, row);
					this.$refs.OperationForm.resetFields();
				});
			},

			//点击移除
			deleteMenu(index, row) {
				this.$confirm('确定要删该行吗，删除后不能恢复！', '删除提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let _this = this;
					//向后台发送数据进行删除
					this.$axios.post("/api/UserCenter/MenuOrButton/delete_projectmenu", {
						"": row.Id
					}).then(data => {
						if (data.data.State == 10) {
							_this.$message({
								type: 'success',
								message: data.data.Message
							});
							_this.totalData();
							_this.getTreeData();
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

			//点击tree
			handleNodeClick(data,node) {
				//选择父菜单后，启用添加功能
				this.IsDisabled = false;
				this.TableTitle = data.label;
				this.TableId = data.id;
				this.totalData();
				if(node.level>3){
					this.addItem=false;
				}else{
					this.addItem=true;
				}				
			},

			//删除父菜单
			handleNodeContextmenu(event, data) {
				this.$confirm('确定要删该菜单吗，删除后不能恢复！', '删除提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let _this = this;
					//向后台发送数据进行删除
					this.$axios.post("/api/UserCenter/MenuOrButton/delete_projectmenu", {
						"": data.id
					}).then(data => {
						if (data.data.State == 10) {
							_this.$message({
								type: 'success',
								message: data.data.Message
							});
							_this.getTreeData();
							this.TableTitle = '';
							this.IsDisabled = true;
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

			//获取系统菜单Tree数据
			getTreeData() {
				this.treeLoading = true;
				var parameter = 'type=' + this.SelectFunctionTypeValue;
				this.$axios.get('/api/UserCenter/MenuOrButton/get_projectmenus_by_type?' + parameter)
					.then((response) => {
						this.ProjectMenuList = JSON.parse(response.data.DataModel);
						this.treeLoading = false;
					})
			},

			//获取子菜单、按钮数据
			totalData() {
				this.listLoading = true;
				var parameter = 'menuId=' + this.TableId + "&pageIndex=" + this.currentPage + "&pageSize=" + this.pageSize;
				this.$axios.get('/api/UserCenter/MenuOrButton/get_project_submenus?' + parameter)
					.then((response) => {
						this.subMenuData = response.data.DataModel;
						this.total = response.data.TotalCount;
						this.listLoading = false;
					});

				var parameters = 'menuId=' + this.TableId + "&pageIndex=" + this.currentPages + "&pageSize=" + this.pageSize;
				this.$axios.get('/api/UserCenter/MenuOrButton/get_project_buttons?' + parameters)
					.then((response) => {
						this.buttonData = response.data.DataModel;
						if (this.tableData == false && this.currentPage > 1) {
							this.currentPage--;
							this.totalData();
						}
						this.totals = response.data.TotalCount;
						this.listLoading = false;
					})
			},

			//提交操作
			SubmitOperation() {
				//数据验证
				this.$refs.OperationForm.validate((valid) => {
					this.OperateLoading = true;
					if (valid) {
						//序列化表单
						let _this = this;
						var dataForm = _this.OperationForm;
						var jsonStr = JSON.stringify(dataForm);
						var jsonObj = JSON.parse(jsonStr);
						jsonObj["FunctionType"] = _this.SelectFunctionTypeValue;
						if (this.IsAddMenu != true) {
							jsonObj["ParentID"] = this.TableId;
						}
						this.$axios.post(this.requestUrl, jsonObj).then(data => {
							if (data.data.State == 10) {
								_this.$message({
									type: 'success',
									message: data.data.Message
								});
								_this.totalData();
								_this.getTreeData();
								_this.OperationPage = false;
								_this.$refs.OperationForm.resetFields();
							} else {
								_this.$message({
									type: 'error',
									message: data.data.Message
								});
							}
							_this.OperateLoading = false;
						});
					} else {
						this.OperateLoading = false;
					}
				})
			},

			//添加操作按钮
			addButton(menuId, menuTitle) {
				this.TableId = menuId;
				this.buttonTitle = '添加操作项';
				this.buttonUrl = '/api/UserCenter/MenuOrButton/add_projectbutton';
				this.ButtonPage = true;
				//回调获取更新后的dom再渲染
				this.$nextTick(() => {
					this.$refs.ButtonForm.resetFields();
				});
			},
			//编辑操作按钮
			editButton(index, row) {
				this.buttonTitle = '编辑操作项';
				this.buttonUrl = '/api/UserCenter/MenuOrButton/modify_projectbutton';
				this.ButtonPage = true;
				//回调获取更新后的dom再渲染
				this.$nextTick(() => {
					//拷贝对象
					this.ButtonForm = Object.assign({}, row);
					this.$refs.ButtonForm.resetFields();
				});
			},
			//删除操作按钮
			deleteButton(index, row) {
				this.$confirm('确定要删该行吗，删除后不能恢复！', '删除提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let _this = this;
					//向后台发送数据进行删除
					this.$axios.post("/api/UserCenter/MenuOrButton/delete_projectbutton", {
						"": row.Id
					}).then(data => {
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

			//添加、编辑操作按钮提交
			SubmitButton() {
				//数据验证
				this.$refs.ButtonForm.validate((valid) => {
					this.ButtonLoading = true;
					if (valid) {
						//序列化表单
						let _this = this;
						var dataForm = _this.ButtonForm;
						var jsonStr = JSON.stringify(dataForm);
						var jsonObj = JSON.parse(jsonStr);
						jsonObj["ProjectMenuId"] = _this.TableId;
						this.$axios.post(this.buttonUrl, jsonObj).then(data => {
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
							_this.ButtonLoading = false;
							_this.ButtonPage = false;
							_this.$refs.ButtonForm.resetFields();
						});
					} else {
						this.ButtonLoading = false;
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
			//表格操作
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//操作表分页的方法
			handleSizeChanges(val) {
				this.pageSizes = val;
				this.totalData();
			},
			handleCurrentChanges(val) {
				this.currentPages = val;
				this.totalData();
			},
			//表格操作
			handleSelectionChanges(val) {
				this.multipleSelections = val;
			}
		},
		mounted() {
			this.getTreeData();
		}
	}
</script>

<style>
	.menu-manage-wrap {
		margin: 70px 10px 10px 10px;
	}

	.menu-left {
		width: 300px;
		border-right: 1px solid #ebeef5;
		float: left;
		height: calc(100vh - 140px);
	}

	.menu-right {
		float: left;
		width: calc(100% - 301px);
		padding: 20px;
		box-sizing: border-box;
		max-height: calc(100vh - 138px);
		overflow-y: auto;
	}

	.tree-list {
		padding: 20px;
		height: calc(100% - 100px);
		overflow-y: scroll;
	}

	.menu-manage-wrap .tree-list::-webkit-scrollbar {
		display: none;
	}

	.menu-manage-wrap .el-card__body {
		padding: 0;
	}
</style>
