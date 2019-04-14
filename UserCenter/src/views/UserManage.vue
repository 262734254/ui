<template>
	<el-card class="box-card user-wrap">
	  <div slot="header" class="clearfix">
	    <span>账户管理</span> 
	  </div>
	  <el-row>
	  		<!--<el-col :span="4">
    			<el-select v-model="selectEnterpriseInfo" value-key="name" style="width: 100%;" >
				    <el-option
				      v-for="item in option_enterprise"
				      :label="item.name"
				      :key="item.id"
				      :value="item.id">
				    </el-option>
				</el-select>
    		</el-col>-->
    		<el-col :span="4">
    			<el-select v-model="selectValue" placeholder="全部用户状态" style="width: 100%;" @change="searchUser">
    				<el-option value="">全部</el-option>
				    <el-option
				      v-for="item in status_data"
				      :label="item.label"
				      :key="item.value"
				      :value="item.value">
				    </el-option>
				</el-select>
    		</el-col>
    		<el-col :span="4" style="margin-left: 10px;">
    			<el-select v-model="selectRoleId" placeholder="全部角色" style="width: 100%;" @change="searchUser">
    				<el-option value="">全部</el-option>
				    <el-option
				      v-for="item in option_role"
				      :label="item.name"
				      :key="item.id"
				      :value="item.id">
				    </el-option>
				</el-select>
    		</el-col>
    		<el-col :span="4" style="margin-left: 10px;">
    			<el-input
				    placeholder="请输入姓名或手机号码"
				    v-model="keyword"
				    @input="searchUser"
				    suffix-icon="el-icon-search">
				</el-input>
    		</el-col>  		
    		<el-col :span="3.5" style="float: right;margin-left: 10px;">
    			<el-button type="primary" @click="addUserForm">添加</el-button>
    		</el-col>
    		<!--<el-col :span="3.5" style="float: right;margin-left: 10px;">
    			<el-button type="primary" @click="syncFace">同步身份证到人脸库</el-button>
    		</el-col>-->
    		<el-col :span="3.5" style="float: right;">
    			<el-button type="primary" @click="exportToTIM">导入账号到TIM</el-button>
    		</el-col>
    	</el-row>
    	<el-row style="width: 100%;margin: 10px 0;">
    		<template>
				  <el-table
				    :data="tableData"									    
				    border
				    @selection-change="handleSelectionChange"
				    style="width: 100%">
				    <!--<el-table-column type="expand">
				      <template slot-scope="props">
				        <el-form label-position="left" inline class="demo-table-expand">
				          <el-form-item label="姓名">
				            <span>{{ props.row.ChsName }}</span>
				          </el-form-item>
				          <el-form-item label="手机号码">
				            <span>{{ props.row.Phone }}</span>
				          </el-form-item>
				          <el-form-item label="用户名">
				            <span>{{ props.row.UserName }}</span>
				          </el-form-item>
				          <el-form-item label="昵称">
				            <span>{{ props.row.NickName }}</span>
				          </el-form-item>
				          <el-form-item label="通讯地址">
				            <span>{{ props.row.PostalAddress }}</span>
				          </el-form-item>
				          <el-form-item label="详细地址">
				            <span>{{ props.row.DetailAddress }}</span>
				          </el-form-item>
				          <el-form-item label="用户角色">
				            <span>{{roleToString(props.row.RolesID) }}</span>
				          </el-form-item>
				          <el-form-item label="所属企业">
				            <span>{{ enterpriseToString(props.row.EnterpriseInfoID) }}</span>
				          </el-form-item>
				          <el-form-item label="用户状态">
				            <span>{{ props.row.State }}</span>
				          </el-form-item>
				          <el-form-item label="备注">
				            <span>{{ props.row.Remark }}</span>
				          </el-form-item>
				        </el-form>
				      </template>
				    </el-table-column>-->
				    <el-table-column
				      type="selection"
				      width="35">
				    </el-table-column>
				    <el-table-column
				    	align="center"
				      type="index">
				      <template slot-scope="scope"><span>{{scope.$index+(pageIndex - 1) * pageSize + 1}} </span></template>
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="AccountState"
				      show-overflow-tooltip
				      label="账户状态">	
				      <!--<template slot-scope="scope"><span>{{userStatus(scope.row.AccountState)}}</span></template>-->
				      <template slot-scope="scope">
				      	<el-tag style="width:83px;" :type="scope.row.AccountState == 2 ? 'success' :'danger'" disable-transitions>{{ userStatus(scope.row.AccountState)}}</el-tag>
				      </template>
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="EnterpriseInfoID"
				      show-overflow-tooltip
				      label="所属企业">
				      <template slot-scope="scope"><span>{{enterpriseToString(scope.row.EnterpriseInfoID)}}</span></template>
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="RolesID"
				      show-overflow-tooltip
				      label="所属角色">
				      <template slot-scope="scope"><span>{{scope.row.RolesName}}</span></template>
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="UserName"
				      show-overflow-tooltip
				      label="用户名">
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="ChsName"
				      show-overflow-tooltip
				      label="姓名">
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="Phone"
				      show-overflow-tooltip
				      label="手机号码">
				    </el-table-column>
				    <el-table-column label="操作" width="">
                        <template slot-scope="scope">
                        	<el-button 
                            	@click.native.prevent="handleDetail(scope.row)" 
                            	type="text"
                                size="small">详情
                            </el-button>
                            <el-button 
                            	@click.native.prevent="handleEdit(scope.row)" 
                            	v-if="scope.row.AccountState==0 || scope.row.AccountState==2"
                            	type="text"
                                size="small">编辑
                            </el-button>
                            <!--<el-button                            	
                            	@click="deleteRow(scope.row)" 
                            	type="text" 
                            	size="small">删除
                            </el-button>-->
                        </template>
                    </el-table-column>
				</el-table>
				<el-pagination
				  style="text-align: right;margin-top: 10px;"
			      @current-change="handleCurrentChange"
			      :current-page="pageIndex"
			      :page-size="pageSize"
			      layout="total, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			</template>				    						
		</el-row>
		<el-dialog :title="userFormTitle" :visible.sync="dialogUserForm">
			<el-form ref="user_form" :model="user_form" :rules="user_rule">
			    <el-form-item label="姓名" :label-width="formLabelWidth"  prop="ChsName"> 
			      <el-input v-if="!isDetail" v-model="user_form.ChsName" maxlength="32"></el-input>
			      <span v-if="isDetail">{{user_form.ChsName}}</span>
			    </el-form-item>
			    <el-form-item label="手机号码" :label-width="formLabelWidth"  prop="Phone"> 
			      <el-input v-if="!isDetail" v-model="user_form.Phone" maxlength="11"></el-input>
			      <span v-if="isDetail">{{user_form.Phone}}</span>
			    </el-form-item>
			    <el-form-item label="用户名" :label-width="formLabelWidth"  prop="UserName"> 
			      <el-input v-if="!isDetail" v-model="user_form.Phone" disabled></el-input>
			      <span v-if="isDetail">{{user_form.Phone}}</span>
			    </el-form-item>
			    <el-form-item label="昵称" :label-width="formLabelWidth"  prop="NickName"> 
			      <el-input v-if="!isDetail" v-model="user_form.NickName" maxlength="32"></el-input>
			      <span v-if="isDetail">{{user_form.NickName}}</span>
			    </el-form-item>
			    <el-form-item label="通讯地址" :label-width="formLabelWidth"  prop="PostalAddress"> 
			      <el-input v-if="!isDetail" v-model="user_form.PostalAddress" maxlength="32"></el-input>
			      <span v-if="isDetail">{{user_form.PostalAddress}}</span>
			    </el-form-item>
			    <el-form-item label="详细地址" :label-width="formLabelWidth"  prop="DetailAddress"> 
			      <el-input v-if="!isDetail" v-model="user_form.DetailAddress" maxlength="32"></el-input>
			      <span v-if="isDetail">{{user_form.DetailAddress}}</span>
			    </el-form-item>
			    <el-form-item label="选择角色" :label-width="formLabelWidth"  prop="RolesID"> 
			      <el-select v-if="!isDetail" v-model="user_form.RolesID" placeholder="请选择角色" style="width: 100%;">
				    <el-option
				      v-for="item in option_role"
				      :label="item.name"
				      :key="item.id"
				      :value="item.id">
				    </el-option>
				  </el-select>
				  <span v-if="isDetail">{{user_form.RolesName}}</span>
			    </el-form-item>
			    <el-form-item label="选择企业" :label-width="formLabelWidth"  prop="EnterpriseInfoID"> 
			      <el-select v-if="!isDetail" v-model="user_form.EnterpriseInfoID" placeholder="请选择企业" style="width: 100%;">
				    <el-option
				      v-for="item in option_enterprise"
				      :label="item.name"
				      :key="item.id"
				      :value="item.id">
				    </el-option>
				  </el-select>
				  <span v-if="isDetail">{{enterpriseToString(user_form.EnterpriseInfoID)}}</span>
			    </el-form-item>
			    <el-form-item label="选择部门" :label-width="formLabelWidth"  prop="DeptInfoId"> 
				    <el-select v-if="!isDetail" v-model="user_form.DeptInfoId" placeholder="请选择部门" value-key="name" style="width: 100%;">
					    <el-option
					      v-for="item in department_data"
					      :label="item.Name"
					      :key="item.Id"
					      :value="item.Id">
					    </el-option>
					</el-select>
					<span v-if="isDetail">{{departmentToString(user_form.DeptInfoId)}}</span>
			    </el-form-item>
			    <el-form-item label="备注" :label-width="formLabelWidth"  prop="Remark"> 
			      <el-input v-if="!isDetail" v-model="user_form.Remark" maxlength="300"></el-input>
			      <span v-if="isDetail">{{user_form.Remark}}</span>
			    </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogUserForm = false">取 消</el-button>
			    <el-button type="primary" v-if="!isDetail" @click="submitUserForm">确 定</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
	import {data_validation} from '../util/util'
	import qs from 'qs'
	export default{
		data(){
			return{
				tableData:[],
				currentPage:1,
				pageSize:10,
				total:0,
				test:'',
				user_form:{
					ChsName:'',
					Phone:'',
					UserName:'',
					NickName:'',
					PostalAddress:'',
					DetailAddress:'',
					RolesID:'',
					EnterpriseInfoID:'',
					Remark:'',
					DeptInfoId:'',
				},
				dialogUserForm:false,
				dialogUserFormDetail:false,
				formLabelWidth:'120px',
				option_role:[],										   
				option_enterprise:[],
				user_rule:{
					ChsName:[{required: true,validator:data_validation.checkChiAndEn}],
					Phone:[{required: true,validator:data_validation.checkPhone}],
					UserName:[{validator:data_validation.checkName}],
					NickName:[{required: true,validator:data_validation.checkName}],
					PostalAddress:[{required: true,validator:data_validation.checkName}],
					DetailAddress:[{required: true,validator:data_validation.checkName}],
					RolesID:[{required: true,validator:data_validation.checkName}],
					EnterpriseInfoID:[{validator:data_validation.checkName}],
					Remark:[{validator:data_validation.checkName}],
					DeptInfoId:[{validator:data_validation.checkEmpty}],
				},
				keyword:'',
				selectValue:'',
				status_data: [{
                    value: '0',
                    label: '待实名认证'
                }, {
                    value: '1',
                    label: '已禁用'
                }, {
                    value: '2',
                    label: '正常' //已经实名认证
                }, {
                    value: '3',
                    label: '新增待审核'
                }, {
                    value: '4',
                    label: '已经离场'
                }, {
                    value: '5',
                    label: '修改待审核'
                }, {
                    value: '6',
                    label: '实名认证审核中'
                }],
				selectRoleId:'',
				pageIndex:1,
				userFormTitle:'',
				user_id:'',
				multipleSelection:'',
				department_data:[],
				EnterpriseID:'',	
				isDetail:false,
				test:'',
			}
		},
		created(){	
			if(this.$store.state.nowCompany){
				this.EnterpriseID=this.$store.state.nowCompany;
			}else{
				console.log(sessionStorage.getItem('EnterpriseID'))
				this.EnterpriseID=sessionStorage.getItem('EnterpriseID');
			}
			//获取部门数据
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
				this.option_enterprise=res.data.DataModel.filter(item => item.State===1).map(item => {
						return {name:item.Name,id:item.Id}				
				})
			}).catch(err => {
				console.log(err)
			})
			//获取角色数据
			this.$axios.post(`/api/UserCenter/Roles/get_role`)
			.then(res => {
				console.log(res)
				this.option_role=res.data.DataModel.map(item => {
					return {name:item.RoleName,id:item.Id}
				})
			}).catch(err => {
				console.log(err)
			})

			if(sessionStorage.getItem('EnterpriseID')){
				this.getUserList();
			}			
			
			this.$root.$on('getUserList', (value) => {
				console.log(value)
				if(value){				
					this.EnterpriseID=value;
					this.getUserList();
				}
			})
			
			//监听缓存
//			window.addEventListener('setItem', ()=> {
//				this.newVal = sessionStorage.getItem('watchStorage');
//			})
		},
		mounted(){
//			this.getUserList();
		},
		computed:{
//			setCompany(){
//				return this.$store.state.nowCompany
//			}
		},
		watch:{
			"$store.state.nowCompany":function(){
				console.log(this.$store.state.nowCompany,'666666')
				this.EnterpriseID=this.$store.state.nowCompany;
				this.getUserList();
			}
		},
		methods:{
			//获取列表信息
			getUserList(){
				console.log(this.EnterpriseID)
				let selectNoEnID=false;
				if(this.EnterpriseID=='99999'){
					this.EnterpriseID='';
					selectNoEnID=true;
				}
				this.$axios.get(`/UserInfo/get_userInfos?keyword=${this.keyword}&selectValue=${this.selectValue}&accountType='List'
					&selectEnterpriseInfo=${this.EnterpriseID}&selectRoleId=${this.selectRoleId}&pageIndex=${this.pageIndex}&selectNoEnID=${selectNoEnID}`)
				.then(res => {
					console.log(res)	
					this.tableData=res.data.DataModel;
					if (this.tableData == false && this.pageIndex > 1) {
	                	this.pageIndex--;
	                	this.getUserList();
	                }
					this.total=res.data.TotalCount;
				}).catch(err => {
					console.log(err)
				})
			},
			//筛选
			searchUser(){
				this.pageIndex=1;
				this.getUserList();
			},
			//添加
			addUserForm(){
				this.userFormTitle='添加';
				this.dialogUserForm=true;
				this.isDetail=false;
				this.user_id='';
				this.$nextTick(() => {
					this.$refs.user_form.resetFields();
					this.user_form.EnterpriseInfoID=sessionStorage.getItem('EnterpriseID');
				})				
			},
			//添加用户提交按钮
			submitUserForm(){
				this.$refs.user_form.validate(valid => {
					if(valid){
						if(this.user_id){
							this.user_form['Id']=this.user_id;
							this.$axios.post('/UserInfo/modity_userImg_for_pc',this.user_form)
							.then(res => {
								console.log(res)
								if(res.data.State==10){
									this.dialogUserForm=false;
									this.getUserList();
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
							this.user_form['UserName']=this.user_form['Phone'];
							this.$axios.post('/UserInfo/add_userInfo',this.user_form)
							.then(res => {
								console.log(res)
								if(res.data.State==10){
									this.dialogUserForm=false;
									this.getUserList();
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
			//用户状态转换
			userStatus(status){
//				console.log(status)
				return this.status_data.find(item => {
					if(item.value==status){
						return item;
					}
				}).label;				
				
//				let status_name=this.status_data.find(item => {
//					if(item.value==status){
//						return item.label;
//					}
//				})
//				return status_name.label;
			},
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
			handleEdit(row){
				this.userFormTitle='编辑';
				this.dialogUserForm=true;
				this.isDetail=false;
				this.user_id=row.Id;
				this.$nextTick(() => {
					this.user_form=Object.assign({},row);
					this.$nextTick(() => {
						this.$refs.user_form.clearValidate();
					})
				})
			},
			deleteRow(row){
				this.$confirm('确定要删该行吗，删除后不能恢复！', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let data={'':row.Id};
		        	this.$axios.post(`/UserInfo/delete_userInfo`,data)
		        	.then(res => {
		        		console.log(res)
		        		if(res.data.State==10){
		        			this.getUserList();
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
		        	}).catch(() => {})		          
		        }).catch(() => {});
			},
			handleDetail(row){
				this.userFormTitle='详情';
				this.dialogUserForm=true;
				this.isDetail=true;
				this.$nextTick(() => {
					this.user_form=Object.assign({},row);
				})
			},
			handleCurrentChange(val){
				this.pageIndex=val;
				this.getUserList();
			},
//			roleToString(val){
//				let role_name=this.option_role.find(item => {
//					return item.id==val;
//				})
//				console.log(role_name)
//				return role_name.name;
//			},			
			enterpriseToString(val){
				if(this.option_enterprise.length>0 && val){
					let enterprise_name=this.option_enterprise.find(item => {
//						console.log(item.id,val)
						return item.id==val;
					})
//					console.log(enterprise_name)
					if(enterprise_name){
						return enterprise_name.name;
					}					
				}			
			},
			departmentToString(val){
				if(val){
					let department_name=this.department_data.find(item => {
						return item.Id==val;
					})
					return department_name.Name;
				}				
			},
			//导入到TIM
			exportToTIM(){
				if (this.multipleSelection.length <= 0) {
                    this.$message({
                        type: 'warning',
                        message: "请选择用户信息"
                    });
                    return;
                }
				let data=this.multipleSelection.map(item => {
					return {Identifier:item.Phone,Nick:item.NickName,FaceUrl:item.UserImgUrl,Type:0}
				});
				let params={'':data};
				//console.log(params,'params')
				this.$axios.post('/UserInfo/import_userinfo',params)
				.then(res => {
//					console.log(params,'params')
					console.log(res)
					if(res.data.State==10){
						this.getUserList();
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
			},
			//同步身份到人脸识别库
			syncFace(){
				if (this.multipleSelection.length <= 0) {
                    this.$message({
                        type: 'warning',
                        message: "请选择用户信息"
                    });
                    return;
                }
				let data=this.multipleSelection.map(item => {
					if(!item.FrontUserIdCardImgUrl){
						this.$message('所选用户暂无身份证信息');
						return false;
					}else{
						return {userId:item.Phone,image:item.FrontUserIdCardImgUrl}						
					}
				});
				let has_false=data.find(item => {
					return item==false;
				});				
				if(!has_false){
					let params={'':data};
					this.$axios.post('/UserInfo/syncface_userinfo',params)
					.then(res => {
						console.log(res)
						if(res.data.State==10){
							this.getUserList();
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
		}
	}
</script>

<style>
	.user-wrap{
		margin: 70px 10px 10px 10px;
	}
</style>