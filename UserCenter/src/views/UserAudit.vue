<template>
	<el-card class="box-card user-wrap">
	  <div slot="header" class="clearfix">
	    <span>用户审核</span>
	  </div>
	  <el-row>
    		<!--<el-col :span="4">
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
    		</el-col>-->
    		<el-col :span="4">
    			<el-input
				    placeholder="请输入姓名或手机号码"
				    v-model="keyword"
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
				            <span>{{props.row.RolesName}}</span>
				          </el-form-item>
				          <el-form-item label="所属企业">
				            <span>{{ enterpriseToString(props.row.EnterpriseInfoID) }}</span>
				          </el-form-item>
				          <el-form-item label="备注">
				            <span>{{ props.row.Remark }}</span>
				          </el-form-item>
				        </el-form>
				      </template>
				    </el-table-column>-->
				    <!--<el-table-column
				      type="selection"
				      width="35">
				    </el-table-column>-->
				    <el-table-column
				    	align="center"
				      type="index">
				      <template slot-scope="scope"><span>{{scope.$index+(pageIndex - 1) * 10 + 1}} </span></template>
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="AccountState"
				      show-overflow-tooltip
				      label="用户状态">	
				      <template slot-scope="scope">
				      	<el-tag :type="scope.row.AccountState == 0 ? 'success' :'danger'" disable-transitions>{{ userStatus(scope.row.AccountState)}}</el-tag>
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
				    <el-table-column label="操作" align="center" width="">
                        <template slot-scope="scope">
                            <el-button 
                            	@click.native.prevent="handleEdit(scope.row)" 
                            	type="text"
                                size="small">审核
                            </el-button>                          
                        </template>
                    </el-table-column>
				</el-table>
				<el-pagination
				  style="text-align: right;margin-top: 10px;"
			      @current-change="handleCurrentChange"
			      :current-page="pageIndex"
			      layout="total, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			</template>				    						
		</el-row>
		<el-dialog title="审核" :visible.sync="dialogForm">
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
				<el-form-item label="用户角色:">
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
				<el-form-item label="审核:" prop="radio">
					<el-radio-group v-model="radio">
						<el-radio :label="true">通过</el-radio>
						<el-radio :label="false">未通过</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
		    <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogForm = false">取 消</el-button>
			    <el-button type="primary" @click="submitDialogForm">确 定</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
	export default{
		data(){
			return{
				tableData:[],
				total:0,
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
				},
				OperationForm:{},
				radio:true,
				dialogUserForm:false,
				option_role:[],										   
				option_enterprise:[],
				keyword:'',
				selectValue:'',
				selectEnterpriseInfo:'',
				selectRoleId:'',
				
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
				pageIndex:1,
				dialogForm:false,
				formLabelWidth:'120px',
				department_data:[],
				EnterpriseID:'',	
			}
		},
		created(){
			console.log(this.$store.state.nowCompany)
			if(this.$store.state.nowCompany){
				this.EnterpriseID=this.$store.state.nowCompany;
			}else{
				console.log(sessionStorage.getItem('EnterpriseID'))
				this.EnterpriseID=sessionStorage.getItem('EnterpriseID');
			}
			
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
			//获取部门数据
			this.$axios.get(`/DeptInfo/get_select_deptinfo?EnterpriseID=${this.EnterpriseID}`)
			.then(res => {
				console.log(res)
				this.department_data=res.data.DataModel;
			}).catch(err => {
				console.log(err)
			})
			console.log(this.EnterpriseID,'888888888')
			
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
		},
		watch:{
			"$store.state.nowCompany":function(){
				this.EnterpriseID=this.$store.state.nowCompany;
				this.getUserList();
			}
		},
		methods:{
			//获取列表信息
			getUserList(){				
				let selectNoEnID;
				if(this.EnterpriseID!='99999'){										
					selectNoEnID=false;
				}else{
					this.EnterpriseID='';
					selectNoEnID=true;
				}
				this.$axios.get(`/UserInfo/get_userInfos?keyword=${this.keyword}&selectValue=${this.selectValue}&accountType=Audit
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
			submitDialogForm(){
				let data={
					UserInfoId:this.OperationForm.Id,
					IsAuditPass:this.radio,
					UserState:this.OperationForm.AccountState,
				};
				this.$axios.post('/UserInfo/audit_userInfo',data)
				.then(res => {
					console.log(res)
					if(res.data.State==10){
						this.dialogForm=false;
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
			//搜索
			searchName(){
				this.pageIndex=1;
				this.getUserList();
			},
			handleSelectionChange(val) {
//		        this.multipleSelection = val;
		    },
			handleEdit(row){
				this.OperationForm=Object.assign({},row);
				this.radio=true;
				this.dialogForm=true;
			},
			deleteRow(){
				
			},
			handleCurrentChange(val){
				this.pageIndex=val;
				this.getUserList();
			},
			//用户状态转换
			userStatus(status){
				console.log(status)
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
			roleToString(val){
				let role_name=this.option_role.find(item => {
					return item.id==val;
				})
				console.log(role_name)
//				return role_name.name;
			},			
			enterpriseToString(val){
//				if(val){
//					let enterprise_name=this.option_enterprise.find(item => {
//						return item.id==val;
//					})
//					return enterprise_name.name;
//				}
				
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
		}
	}
</script>

<style>
	.user-wrap{
		margin: 70px 10px 10px 10px;
	}
</style>