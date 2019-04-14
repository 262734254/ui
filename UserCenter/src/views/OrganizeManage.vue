<template>
	<el-card class="box-card organize-manage-wrap">
		<!---->
	  	<div slot="header" class="clearfix" ref="test">
	    	<span>组织架构</span>
	 	</div>
	  	<!---->
		<div class="menu-left">
			<div class="tree-list">
				<el-tree
				  ref="tree"
			      :data="tree_data"
			      node-key="id"
			      :default-expand-all="false"
			      :highlight-current='true'
			      :default-expanded-keys='expandedKeys'
			      :current-node-key='currentNode'
			      @node-click='nodeClick'
			      @node-expand="nodeExpand"
			      @node-collapse="nodeCollapse"
			      accordion
			      :expand-on-click-node="false">
			      <span class="custom-tree-node" slot-scope="{ node, data }">
			      	<!--<el-tooltip class="item" effect="dark" :content="node.label" placement="bottom-start">-->
			        	<span :title="node.label" style="line-height: 20px;vertical-align: middle;">{{node.label}}</span>			      		
			      	<!--</el-tooltip>-->

			        <span style="margin-left:  20px;">
			          <el-button
			            type="text"
			            size="mini"
			            v-if="data.level<5"
			            @click.stop="() => append(node,data)">
			            <i class="el-icon-plus"></i>
			          </el-button>			          
			          <el-button
			            type="text"
			            size="mini"
			            v-if="data.level>0"
			            @click.stop="() => edit(node, data)">
			            <i class="el-icon-edit"></i>
			          </el-button>
			          <el-button
			            type="text"
			            size="mini"
			            v-if="data.level>0"
			            @click.stop="() => remove(node, data)">
			            <i class="el-icon-delete"></i>
			          </el-button>
			        </span>
			      </span>
			    </el-tree>					
			</div>
		</div>
		<!---->
		<div class="menu-right">
			<el-row>	
				<el-col :span="6">
	    			<el-input
					    placeholder="请输入姓名或手机号码"
					    v-model="keyWord"
					    @input="searchUser"
					    suffix-icon="el-icon-search">
					</el-input>
	    		</el-col>  		
	    		<!--<el-col :span="3.5" style="float: right;">
	    			<el-button type="primary" @click="dialogForm=true">添加</el-button>
	    		</el-col>-->
	    	</el-row>
	    	<el-row style="width: 100%;margin: 10px 0;">
	    		<template>
					  <el-table
					    :data="tableData"									    
					    border
					    style="width: 100%">					     
					    <el-table-column
					    	align="center"
					    	show-overflow-tooltip
					      type="index">
					      <template slot-scope="scope"><span>{{scope.$index+(pageIndex - 1) * pageSize + 1}} </span></template>
					    </el-table-column>
					    <el-table-column
					      align="center"
					      prop="ChsName"
					      show-overflow-tooltip
					      label="姓名">
					    </el-table-column>
					    <el-table-column
					      align="center"
					      prop="Name"
					      show-overflow-tooltip
					      label="所属部门">
					      <template slot-scope="scope">{{departmentToString(scope.row.DeptInfoId)}}</template>
					    </el-table-column>
					    <el-table-column
					      align="center"
					      show-overflow-tooltip
					      prop="RolesName"
					      label="所属角色">
					    </el-table-column>
					    <el-table-column
					      align="center"
					      prop="Phone"
					      show-overflow-tooltip
					      label="手机号码">
					    </el-table-column>
					    <el-table-column label="操作" align="center" width="">
	                        <template slot-scope="scope">
	                            <el-button 
	                            	@click.native.prevent="handleDetail(scope.row)" 
	                            	type="text"
	                                size="small">详情
	                            </el-button>
	                            <!--<el-button                            	
	                            	@click="deleteRow(scope.$index, scope.row)" 
	                            	type="text" 
	                            	size="small">删除
	                            </el-button>-->
	                        </template>
	                    </el-table-column>
					</el-table>
					<el-pagination
					  style="text-align: right;margin-top: 10px;"
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page="pageIndex"
				      :page-size="pageSize"
				      layout="total, prev, pager, next, jumper"
				      :total="total">
				    </el-pagination>
				</template>				    						
			</el-row>
		</div>
	  	<!---->
		<el-dialog :title="dialog_title" :visible.sync="dialogForm">
			<el-form :model="form" :rules="form_rule" ref="form">
			    <el-form-item label="部门名称" :label-width="formLabelWidth"  prop="name"> 
			      <el-input v-model="form.name" placeholder="请输入部门名称" maxlength="15"></el-input>
			    </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogForm = false">取 消</el-button>
			    <el-button type="primary" @click="submitDialogForm">确 定</el-button>
			</div>
		</el-dialog>
		<!---->
		<el-dialog title="详情" :visible.sync="dialogDetail">
			<el-form :model="OperationForm" label-width="130px">
				<el-form-item label="ID:" v-if="false">
					<span>{{OperationForm.Id}}</span>
				</el-form-item>
				<el-form-item label="姓名:">
					<span>{{OperationForm.ChsName}}</span>
				</el-form-item>
				<el-form-item label="手机号码:">
					<span>{{OperationForm.Phone}}</span>
				</el-form-item>
				<el-form-item label="用户名:">
					<span>{{OperationForm.UserName}}</span>
				</el-form-item>
				<el-form-item label="昵称:">
					<span>{{OperationForm.NickName}}</span>
				</el-form-item>
				<el-form-item label="通讯地址:">
					<span>{{OperationForm.PostalAddress}}</span>
				</el-form-item>
				<el-form-item label="详细地址:">
					<span>{{OperationForm.DetailAddress}}</span>
				</el-form-item>
				<el-form-item label="所属角色:">
					<span>{{OperationForm.RolesName}}</span>
				</el-form-item>
				<el-form-item label="所属企业:">
					<span>{{enterpriseToString(OperationForm.EnterpriseInfoID)}}</span>
				</el-form-item>
				<el-form-item label="所属部门:">
					<span>{{departmentToString(OperationForm.DeptInfoId)}}</span>
				</el-form-item>
				<el-form-item label="备注:">
					<span>{{OperationForm.Remark}}</span>
				</el-form-item>
			</el-form>
		    <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogDetail = false">取 消</el-button>
			    <el-button type="primary" @click="dialogDetail=false">确 定</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
	let id = 1000;
	import {data_validation} from '../util/util'
	export default{
		data(){
			return{
				tableData:[],
				currentPage:1,
				pageSize:10,
				total:0,
				form:{
					name:'',
				},
				dialogForm:false,
				formLabelWidth:'120px',				
				tree_data: [],
		        defaultProps: {
		          children: 'children',
		          label: 'label'
		        },
		        form_rule:{
		        	name:[{required: true,validator:data_validation.checkName}],
		        },
		        parent_id:'',
		        pageIndex:1,
		        keyWord:'',
		        EnterpriseID:'',
		        node_level:'',
		        edit_id:'',
		        dialog_title:'',
		        current_tree:'',
		        current_node:'',
		        department_data:'',
		        expandedKeys:[],
		        OperationForm:{},
		        dialogDetail:false,
		        option_enterprise:[],
		        nodeId:'',
		        currentNode:'',
			}
		},
		created(){
			this.currentNode=sessionStorage.getItem('currentNode')
			if(this.$store.state.nowCompany){
				this.EnterpriseID=this.$store.state.nowCompany;
			}else{
				this.EnterpriseID=sessionStorage.getItem('EnterpriseID');
			}
			this.getOrganization();		
			
			window.addEventListener('setItem', ()=> {
//				this.newVal = sessionStorage.getItem('watchStorage');
				console.log(sessionStorage.getItem('watchStorage'))
			})
			console.log(this.EnterpriseID)
			//获取部门列表
			this.$axios.get(`/DeptInfo/get_select_deptinfo?EnterpriseID=${this.EnterpriseID}`)
			.then(res => {
				console.log(res)
				this.department_data=res.data.DataModel;
			}).catch(err => {
				console.log(err)
			})
			//获取企业数据
			this.$axios.get(`/api/UserCenter/EnterpriseInfo/get_all_enterpriseinfo`)
			.then(res => {
				console.log(res)
				this.option_enterprise=res.data.DataModel.map(item => {
					return {name:item.Name,id:item.Id}
				})
			}).catch(err => {
				console.log(err)
			})
		},
		mounted(){
			
		},
		computer:{

		},
		watch:{
			"$store.state.nowCompany":function(){
				this.EnterpriseID=this.$store.state.nowCompany;
				//置空this.tableData数据，避免企业切换的时候读取到上一个企业的部门
				this.tableData=[];
				//获取部门列表
				this.$axios.get(`/DeptInfo/get_select_deptinfo?EnterpriseID=${this.EnterpriseID}`)
				.then(res => {
					console.log(res)
					this.department_data=res.data.DataModel;
					this.getOrganization();
				}).catch(err => {
					console.log(err)
				})					
			}
		},
		methods:{
			//获取组织架构列表
			getOrganization(){
				if(this.EnterpriseID=='99999'){
					this.tree_data=[];
				}
				this.$axios.get(`/DeptInfo/get_organization?EnterpriseID=${this.EnterpriseID}`)
				.then(res => {
					console.log(res)
					if(res.data.DataModel && res.data.DataModel.length>0){
						this.tree_data=res.data.DataModel;
						this.$nextTick(() => {
							if(this.current_tree){
								this.$refs.tree.setCurrentKey(this.current_tree);
							}else if(sessionStorage.getItem('currentNode')){
								this.$refs.tree.setCurrentKey(sessionStorage.getItem('currentNode'))
							}else{
			            		this.$refs.tree.setCurrentKey(res.data.DataModel[0].id); // treeBox 元素的ref   value 绑定的node-key							
							}
							if(sessionStorage.getItem('expandedKeys')){
								this.expandedKeys=JSON.parse(sessionStorage.getItem('expandedKeys'))
							}							
//							this.currentNode=sessionStorage.getItem('currentNode')
							
							this.nodeClick();	
						});						
					}					
				}).catch(err => {
					console.log(err)
				})
			},
			append(node,data) {
				console.log(node)
				this.edit_id='';
				this.dialog_title='添加';
				this.dialogForm=true;				
				this.node_level=node.level-1;
				if(node.level==1){
					this.parent_id='';
				}else{
					this.parent_id=node.data.id;
				}
				this.$nextTick(() => {
					this.$refs.form.resetFields();
				})
				
//		        const newChild = { id: id++, label: 'testtest', children: [] };
//		        if (!data.children) {
//		          this.$set(data, 'children', []);
//		        }
//		        data.children.push(newChild);
		    },	
		    //确定添加编辑组织架构按钮
		    submitDialogForm(){
		    	this.$refs.form.validate(valid => {
		    		if(valid){
		    			if(this.edit_id){
		    				let data={
			    				EnterpriseID:this.EnterpriseID,
			    				ParentID:this.parent_id,
			    				Name:this.form.name,
			    				CreateUserId:sessionStorage.getItem('UserId'),
			    				Sort:this.node_level,
			    				Id:this.edit_id,
			    			}
			    			this.$axios.post('/DeptInfo/modity_deptinfo',data)
			    			.then(res => {
			    				console.log(res)
			    				if(res.data.State==10){
			    					this.dialogForm=false;
			    					this.getOrganization();
			    					this.$message({
										type: 'success',
										message: res.data.Message
									});
			    				}else{
			    					this.$message({
										type: 'error',
										message: res.data.Message
									});
			    				}			    				
			    			}).catch(err => {
			    				console.log(err)
			    			})
		    			}else{
		    				let data={
			    				EnterpriseID:this.EnterpriseID,
			    				ParentID:this.parent_id,
			    				Name:this.form.name,
			    				CreateUserId:sessionStorage.getItem('UserId'),
			    				Sort:this.node_level,
			    			}
			    			this.$axios.post('/DeptInfo/add_deptinfo',data)
			    			.then(res => {
			    				console.log(res)
			    				if(res.data.State==10){
			    					this.dialogForm=false;
			    					this.getOrganization();
			    					this.$message({
										type: 'success',
										message: res.data.Message
									});
			    				}else{
			    					this.$message({
										type: 'error',
										message: res.data.Message
									});
			    				}		    				
			    			}).catch(err => {
			    				console.log(err)
			    			})
		    			}		    			
		    		}
		    	})
		    },
		    //tree node点击事件
		    nodeClick(node){		    	
		    	console.log(node)
//		    	if(node && node.level!=0){
//		    		sessionStorage.setItem('currentNode',node.id)
//		    	}else{
//		    		this.nodeId=sessionStorage.getItem('currentNode');
//		    	}
		    	if(node && node.level!=0){
		    		sessionStorage.setItem('currentNode',node.id)
		    	}
		    	if(node && node.level==0){
		    		sessionStorage.setItem('currentNode','')
		    	}
//		    	this.nodeId;
		    	if(node && node.level!=0){
		    		this.nodeId=node.id;	
		    		this.current_tree=node.id;		    		
//			    	this.current_node=node;		
			    	
		    	}else if(!node){
		    		this.nodeId=sessionStorage.getItem('currentNode');
		    	}else{
//		    		Id=this.tree_data[0].id;
					this.nodeId='';
					
//					if(!node){
//			    		this.nodeId=sessionStorage.getItem('currentNode');
//			    	}
		    	}
		    	
		    	this.$axios.get(`/UserInfo/get_userInfos?keyword=${this.keyWord}&selectValue=026&accountType=List
					&selectEnterpriseInfo=${this.EnterpriseID}&selectRoleId&pageIndex=${this.pageIndex}&deptInfoId=${this.nodeId}`)
				.then(res => {
					console.log(res)
					this.tableData=res.data.DataModel;
					if (this.tableData == false && this.pageIndex > 1) {
	                	this.pageIndex--;
	                	this.getOrganization();
	                }
					this.total=res.data.TotalCount;
				}).catch(err => {
					console.log(err)
				})
		    },
		    remove(node, data) {
		    	console.log(node)
		    	this.$confirm('确定要删该行吗，删除后不能恢复！', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let params={'':node.data.id}
			    	this.$axios.post('/DeptInfo/delete_deptinfo',params)
			    	.then(res => {
			    		console.log(res)
			    		if(res.data.State==10){
			    			this.getOrganization();
			    			this.$message({
								type: 'success',
								message: res.data.Message
							});
			    		}else{
			    			this.$message({
								type: 'error',
								message: res.data.Message
							});
			    		}			    		
			    	}).catch(err => {
			    		console.log(err)
			    	})	          
		        }).catch(() => {});		    			    			    	
//		        const parent = node.parent;
//		        const children = parent.data.children || parent.data;
//		        const index = children.findIndex(d => d.id === data.id);
//		        children.splice(index, 1);
		    },
		    edit(node,data){
		    	this.dialog_title='编辑';
		    	this.dialogForm=true;
		    	this.$nextTick( () => {
		    		this.form.name=node.data.label;		    		
		    	})	
		    	this.edit_id=node.data.id;
		    },
		    //节点展开事件
		    nodeExpand(node,data,self){
//		    	console.log(this.expandedKeys)
		    	this.expandedKeys.push(node.id);   
		    	sessionStorage.setItem('expandedKeys',JSON.stringify(this.expandedKeys))
		    },
		    //节点收起事件
		    nodeCollapse(node){
				let collapse_index='';
				this.expandedKeys.forEach((item,index) => {
					if(item==node.id){
						console.log(index)
						collapse_index=index;
					}					 
				})
				this.expandedKeys.splice(collapse_index);
				sessionStorage.setItem('expandedKeys',JSON.stringify(this.expandedKeys))
		    },
		    //搜索
		    searchUser(){
		    	this.getOrganization();
		    },
			handleNodeClick(data) {
		        console.log(data);
		    },
			handleDetail(row){
				this.dialogDetail=true;
				this.OperationForm=Object.assign({},row);
			},
			handleSizeChange(val){
				
			},
			handleCurrentChange(val){
				this.pageIndex=val;
				
				this.$axios.get(`/UserInfo/get_userInfos?keyword=${this.keyWord}&selectValue=026&accountType=List
					&selectEnterpriseInfo=${this.EnterpriseID}&selectRoleId&pageIndex=${this.pageIndex}&deptInfoId=${this.nodeId}`)
				.then(res => {
					console.log(res)
					this.tableData=res.data.DataModel;
					if (this.tableData == false && this.pageIndex > 1) {
	                	this.pageIndex--;
	                	this.getOrganization();
	                }
					this.total=res.data.TotalCount;
				}).catch(err => {
					console.log(err)
				})
			},
			departmentToString(val){
				console.log(val)
				if(val){				
					console.log(this.department_data)
					let department_name=this.department_data.find(item => {
						return item.Id==val;
					})
					console.log(department_name)
					return department_name.Name;
				}				
			},
			enterpriseToString(val){
				if(val){
					let enterprise_name=this.option_enterprise.find(item => {
						return item.id==val;
					})
					return enterprise_name.name;
				}
			},
			isEllipsis(val){
				console.log(val)
				if(val.includes('...')){
					return 1;
				}else{
					return 2;
				}
			}
		},
		destroyed(){
			sessionStorage.removeItem('expandedKeys');
			sessionStorage.removeItem('currentNode');
		}
	}
</script>

<style>
	.organize-manage-wrap{
		margin: 70px 10px 10px 10px;
	}
	.menu-left{
		width: 300px;
		border-right: 1px solid #ebeef5;	
		float: left;
		height: calc(100vh - 140px);	
	}
	.menu-right{
		float: left;
		width: calc(100% - 320px);
		padding: 20px 0 20px 20px;
		box-sizing: border-box;
	}
	.tree-list{
		padding: 10px;
		height: calc(100% - 20px);
		overflow-y: auto;
		font-size: 14px;
	}
	.organize-manage-wrap .el-card__body{
		padding: 0;
	}
	.tree-list .custom-tree-node>span:first-child{
		max-width: 80px;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		display: inline-block;		
	}
</style>