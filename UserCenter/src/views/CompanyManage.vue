<template>
	<el-card class="box-card user-wrap">
	  <div slot="header" class="clearfix">
	    <span>企业管理</span>
	  </div>
	  <el-row>
	  		<el-col :span="4">
    			<el-select v-model="selectValue" placeholder="全部审核状态" style="width: 100%;" @change="searchUser">
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
    			<el-input
				    placeholder="请输入企业名称"
				    v-model="keyValue"
				    @input="searchCompany"
				    suffix-icon="el-icon-search"
				    >
				</el-input>
    		</el-col>		
    		<el-col :span="3.5" style="float: right;">
    			<el-button type="primary" @click="addDialogForm">添加</el-button>
    		</el-col>
    	</el-row>
    	<el-row style="width: 100%;margin: 10px 0;">
    		<template>
				  <el-table
				    :data="tableData"									    
				    border
				    style="width: 100%">
				    <el-table-column
				    	align="center"
				      type="index">
				      <template slot-scope="scope"><span>{{scope.$index+(pageIndex - 1) * pageSize + 1}} </span></template>
				    </el-table-column>
				    <el-table-column prop="State" label="审核状态" align="center" width="130" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.State == 0 ? 'primary' : (scope.row.State == 1 ?'success':'danger')" disable-transitions>{{formatStatus(scope.row.State)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="BusinessLicenseNum" label="营业执照注册号" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="Name" label="企业名称" width="200px" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="RegisteredCapital" label="注册资金" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="RepresentativePerson" label="法定代表人" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="RepresentativeTel" label="法定代表电话" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="Safety" label="安全生产许可证" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="Address" label="企业地址" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="Tel" label="企业联系电话" align="center" show-overflow-tooltip>
                    </el-table-column>
				    <el-table-column label="操作" align="center" width="">
                        <template slot-scope="scope">
                        	 <el-button 
                            	@click.native.prevent="handleDetail(scope.row)" 
                            	type="text"
                                size="small">详情
                            </el-button>
                            <el-button 
                            	v-if="scope.row.State === 1"
                            	@click.native.prevent="handleEdit(scope.row)" 
                            	type="text"
                                size="small">编辑
                            </el-button>
                            <el-button                            	
                            	@click="handleAudit(scope.row)" 
                            	type="text" 
                            	v-if="scope.row.State === 0"
                            	size="small">审核
                            </el-button>
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
		<el-dialog :title="dialogFormTitle" :visible.sync="dialogForm">
			<el-form :model="OperationForm" :rules="OperationRule" ref="OperationForm">
			    <el-form-item label="企业名" prop="Name" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.Name" v-if="IsAdd==false" maxlength="32" disabled auto-complete="off" placeholder="请输入企业名"></el-input>
                    <el-input v-model="OperationForm.Name" v-else-if="IsAdd==true" maxlength="32" auto-complete="off" placeholder="请输入企业名"></el-input>
                </el-form-item>
                <el-form-item label="营业执照注册号" prop="BusinessLicenseNum" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.BusinessLicenseNum" v-if="IsAdd==false" disabled minlength="15" maxlength="18" auto-complete="off" placeholder="请输入营业执照注册号"></el-input>
					<el-input v-model="OperationForm.BusinessLicenseNum" v-else-if="IsAdd==true" minlength="15" maxlength="18" auto-complete="off" placeholder="请输入营业执照注册号"></el-input>
                </el-form-item>
                <el-form-item label="法定代表人" prop="RepresentativePerson" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.RepresentativePerson" v-if="IsAdd==false" disabled maxlength="30" auto-complete="off" placeholder="请输入法定代表人"></el-input>
					<el-input v-model="OperationForm.RepresentativePerson" v-else-if="IsAdd==true" maxlength="30" auto-complete="off" placeholder="请输入法定代表人"></el-input>
                </el-form-item>
                <el-form-item label="法定代表电话" prop="RepresentativeTel" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.RepresentativeTel" v-if="IsAdd==false" disabled maxlength="11" auto-complete="off" placeholder="请输入法定代表电话"></el-input>
                    <el-input v-model="OperationForm.RepresentativeTel" v-else-if="IsAdd==true" maxlength="11" auto-complete="off" placeholder="请输入法定代表电话"></el-input>
                </el-form-item>
                <el-form-item label="企业联系电话" prop="Tel" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.Tel" auto-complete="off" maxlength="15" placeholder="请输入企业联系电话"></el-input>
                </el-form-item>
                <el-form-item label="企业地址" prop="Address" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.Address" auto-complete="off" maxlength="50" placeholder="请输入企业地址"></el-input>
                </el-form-item>
                <el-form-item label="安全生产许可证" prop="Safety" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.Safety" auto-complete="off" maxlength="50" placeholder="请输入安全生产许可证"></el-input>
                </el-form-item>
                <el-form-item label="社会统一信用代码" prop="CreditCode" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.CreditCode" maxlength="50" auto-complete="off" placeholder="请输入社会统一信用代码"></el-input>
                </el-form-item>
                <el-form-item label="企业邮箱" prop="Email" :label-width="formLabelWidth"> 
                    <el-input v-model="OperationForm.Email" maxlength="50" auto-complete="off" placeholder="请输入企业邮箱"></el-input>
                </el-form-item>
                <el-form-item label="注册资金" prop="RegisteredCapital" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.RegisteredCapital" maxlength="15" auto-complete="off" placeholder="请输入注册资金"></el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="OpenAnAccount" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.OpenAnAccount" maxlength="50" auto-complete="off" placeholder="请输入开户行"></el-input>
                </el-form-item>
                <el-form-item label="银行账号" prop="BankAccount" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.BankAccount" maxlength="30" auto-complete="off" placeholder="请输入银行账号"></el-input>
                </el-form-item>
                <el-form-item label="资质证书号" prop="AptitudeCertificate" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.AptitudeCertificate" maxlength="30" auto-complete="off" placeholder="请输入资质证书号"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="Remark" class="textDescrib" :label-width="formLabelWidth">
                    <el-input v-model="OperationForm.Remark" type="textarea" maxlength="2000" auto-complete="off" placeholder=""></el-input>
                </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogForm = false">取 消</el-button>
			    <el-button type="primary" @click="submitDialogForm">确 定</el-button>
			</div>
		</el-dialog>
		
		<!--审核-->
		<el-dialog :title="dialogTitle" :visible.sync="dialogAudit">
			<el-form :model="detailData" label-width="150px">
                <el-form-item label="企业名:">
                    <span>{{detailData.Name}}</span>
                </el-form-item>
                <el-form-item label="营业执照注册号:">
                    <span>{{detailData.BusinessLicenseNum}}</span>
                </el-form-item>
                <el-form-item label="法定代表人:">
                    <span>{{detailData.RepresentativePerson}}</span>
                </el-form-item>
                <el-form-item label="法定代表电话:">
                    <span>{{detailData.RepresentativeTel}}</span>
                </el-form-item>                
                <el-form-item label="企业联系电话:">
                    <span>{{detailData.Tel}}</span>
                </el-form-item>
                <el-form-item label="企业地址:">
                    <span>{{detailData.Address}}</span>
                </el-form-item>
                <el-form-item label="安全生产许可证:">
                    <span>{{detailData.Safety}}</span>
                </el-form-item>                               
                <el-form-item label="社会统一信用代码:">
                    <span>{{detailData.CreditCode}}</span>
                </el-form-item>    
                <el-form-item label="企业邮箱:">
                    <span>{{detailData.Email}}</span>
                </el-form-item>
                <el-form-item label="注册资金:">
                    <span>{{detailData.RegisteredCapital}}</span>
                </el-form-item>
                <el-form-item label="开户行:">
                    <span>{{detailData.OpenAnAccount}}</span>
                </el-form-item>
                <el-form-item label="银行账号:">
                    <span>{{detailData.BankAccount }}</span>
                </el-form-item>
                <el-form-item label="资质证书号:">
                    <span>{{detailData.AptitudeCertificate}}</span>
                </el-form-item>
                <el-form-item label="备注:">
                    <span>{{detailData.Remark}}</span>
                </el-form-item>
                <el-form-item v-if="!isDetail" label="审核:" prop="State">
                    <el-radio-group v-model="IsAuditPass">
                        <el-radio  :label="true">通过</el-radio>
                        <el-radio  :label="false">不通过</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
		    <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogAudit = false">{{dialogTitle=='详情'?'关 闭':'取 消'}}</el-button>
			    <el-button type="primary" v-if="!isDetail" @click="submitDialogAudit">确 定</el-button>
			</div>
		</el-dialog>
		
	</el-card>
</template>

<script>
	import {data_validation} from '../util/util'
	export default{
		data(){
			return{
				tableData:[],
				currentPage:1,
				pageSize:10,
				total:0,
				OperationForm:{
					Name: '',
                    Tel: '',
                    Address: '',
                    Safety: '',
                    RepresentativePerson: '',
                    RepresentativeTel: '',
                    CreditCode: '',
                    BusinessLicenseNum: '',
                    Email: '',
                    RegisteredCapital: '',
                    OpenAnAccount: '',
                    BankAccount: '',
                    AptitudeCertificate: '',
                    Remark: ''
				},
				OperationRule:{
					Name: [{required: true,validator:data_validation.checkName}],
					RepresentativePerson:[{required: true,validator:data_validation.checkHanzi}],
					RepresentativeTel:[{required: true,validator:data_validation.checkPhone}],
					BusinessLicenseNum:[{required: true,validator:data_validation.checkBusinessLicenseNum}],
					RegisteredCapital:[{validator:data_validation.checkAmt}],					
				},
				dialogForm:false,
				formLabelWidth:'150px',
				IsAdd:true,
				dialogFormTitle:'',
				company_id:'',
				dialogAudit:false,
				keyValue:'',
				IsAuditPass:true,
				pageIndex:1,
				isDetail:false,
				dialogTitle:'',
				detailData:{},
				status_data:[{label:'待审核',value:0},{label:'已通过',value:1},{label:'未通过',value:2}],
				selectValue:'',
			}
		},
		created(){
			this.getCompanyList();
		},
		methods:{
			getCompanyList(){
				let data={
					pageIndex:this.pageIndex,
					Name:this.keyValue,
					pageSize:this.pageSize,
					State:this.selectValue,
				};
				this.$axios.post(`/api/UserCenter/EnterpriseInfo/get_enterpriseinfo_by_EnterpriseInfo`,data)
				.then(res => {
					console.log(res)
					this.tableData=res.data.DataModel;
					this.total=res.data.TotalCount;
				}).catch(err => {
					console.log(err)
				})
			},
			searchUser(){
				this.pageIndex=1;
				this.getCompanyList();
			},
			//搜索
			searchCompany(){
				this.pageIndex=1;
				this.getCompanyList();
			},
			//添加企业
			addDialogForm(){
				this.dialogForm=true;
				this.dialogFormTitle='添加';
				this.IsAdd=true,
				this.$nextTick(() => {
					this.$refs.OperationForm.resetFields();
				})				
			},
			//添加编辑确定提交按钮
			submitDialogForm(){				
				console.log(this.$refs.OperationForm)
				this.$refs.OperationForm.validate(valid => {
					console.log(valid)
					if(valid){
						if(this.IsAdd){							
							this.$axios.post('/api/UserCenter/EnterpriseInfo/add_enterpriseinfo',this.OperationForm)
							.then(res => {
								console.log(res)
								if(res.data.State==10){
//									this.$root.$emit('addCompany',true)
									this.dialogForm=false;
									this.getCompanyList();
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
							this.OperationForm['Id']=this.company_id;
							this.OperationForm['State']=0;
							this.$axios.post('/api/UserCenter/EnterpriseInfo/modify_enterpriseinfo',this.OperationForm)
							.then(res => {
								console.log(res)
								if(res.data.State==10){
									this.$root.$emit('getCompany',true)
									this.dialogForm=false;
									this.getCompanyList();
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
			//数据转换 ----审核状态
            formatStatus(Status) {
                //审核状态
                return Status == 0 ? "待审核" : Status == 1 ? "已通过" : "未通过";
            },
			handleEdit(row){
				this.dialogForm=true;
				this.dialogFormTitle='编辑';				
				this.IsAdd=false,
				this.company_id=row.Id;
				this.$nextTick(() => {					
					this.OperationForm=Object.assign({},row);
					this.$nextTick(() => {
						this.$refs.OperationForm.clearValidate();
					})					
				})				
			},
			handleAudit(row){
				this.dialogAudit=true;
				this.isDetail=false;
				this.IsAuditPass=true;
				this.dialogTitle='审核';
				this.company_id=row.Id;
				this.$nextTick(() => {
					this.detailData=Object.assign({},row);
				})
			},
			handleDetail(row){
				this.dialogAudit=true;				
				this.isDetail=true;
				this.dialogTitle='详情';
				this.$nextTick(() => {
					this.detailData=Object.assign({},row);
				})
			},
			//提交审核
			submitDialogAudit(){
				let data={
					EnterpriseID:this.company_id,
					IsAuditPass:this.IsAuditPass
				};
				this.$axios.post('/api/UserCenter/EnterpriseInfo/modify_enterpriseinfo_status',data)
				.then(res => {
					console.log(res)
					if(res.data.State==10){
						this.dialogAudit=false;
						this.$root.$emit('getCompany',true)
						this.getCompanyList();
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
			handleCurrentChange(val){
				this.pageIndex=val;
				this.getCompanyList();
			}
		}
	}
</script>

<style>
	.user-wrap{
		margin: 70px 10px 10px 10px;
	}
	.el-form-item__content span{
		word-break: break-all;
	}
</style>