<template>
	<el-card class="box-card user-wrap">
	  <div slot="header" class="clearfix">
	    <span>权限管理</span>
	  </div>
	  <el-row>
    		<el-col :span="4">
    			<el-input
				    placeholder="请输入"
				    suffix-icon="el-icon-search"
				    >
				</el-input>
    		</el-col>
    		<el-col :span="4" style="margin-left: 10px;">
    			<el-input
				    placeholder="请输入"
				    suffix-icon="el-icon-search"
				    >
				</el-input>
    		</el-col>  		
    		<el-col :span="3.5" style="float: right;">
    			<el-button type="primary" @click="dialogForm=true">添加</el-button>
    		</el-col>
    	</el-row>
    	<el-row style="width: 100%;margin: 10px 0;">
    		<template>
				  <el-table
				    :data="tableData"									    
				    border
				    style="width: 100%">
				     <el-table-column type="expand">
				      <template slot-scope="props">
				        <el-form label-position="left" inline class="demo-table-expand">
				          <el-form-item label="姓名">
				            <span>{{ props.row.name }}</span>
				          </el-form-item>
				          <el-form-item label="姓名">
				            <span>{{ props.row.name }}</span>
				          </el-form-item>
				          <el-form-item label="姓名">
				            <span>{{ props.row.name }}</span>
				          </el-form-item>
				          <el-form-item label="姓名">
				            <span>{{ props.row.name }}</span>
				          </el-form-item>
				          <el-form-item label="姓名">
				            <span>{{ props.row.name }}</span>
				          </el-form-item>
				          <el-form-item label="姓名">
				            <span>{{ props.row.name }}</span>
				          </el-form-item>
				          <el-form-item label="姓名">
				            <span>{{ props.row.name }}</span>
				          </el-form-item>
				          <el-form-item label="姓名">
				            <span>{{ props.row.name }}</span>
				          </el-form-item>
				          <el-form-item label="姓名">
				            <span>{{ props.row.name }}</span>
				          </el-form-item>
				        </el-form>
				      </template>
				    </el-table-column>
				    <el-table-column
				    	align="center"
				      type="index">				      
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="name"
				      label="姓名">	
				      <template slot-scope="scope"><span>{{isEmpty(scope.row.name)}}</span></template>
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="name"
				      label="姓名">
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="name"
				      label="姓名">
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="name"
				      label="姓名">
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="name"
				      label="姓名">
				    </el-table-column>
				    <el-table-column
				      align="center"
				      prop="name"
				      label="姓名">
				    </el-table-column>
				    <el-table-column label="操作" align="center" width="">
                        <template slot-scope="scope">
                            <el-button 
                            	@click.native.prevent="handleEdit(scope.$index, scope.row)" 
                            	type="text"
                                size="small">编辑
                            </el-button>
                            <el-button                            	
                            	@click="deleteRow(scope.$index, scope.row)" 
                            	type="text" 
                            	size="small">删除
                            </el-button>
                        </template>
                    </el-table-column>
				</el-table>
				<el-pagination
				  style="text-align: right;margin-top: 10px;"
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage"
			      :page-sizes="[10, 20, 30, 40]"
			      :page-size="pageSize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			</template>				    						
		</el-row>
		<el-dialog title="添加" :visible.sync="dialogForm">
			<el-form :model="form">
			    <el-form-item label="**" :label-width="formLabelWidth"  prop="name"> 
			      <el-input v-model="form.name"></el-input>
			    </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogForm = false">取 消</el-button>
			    <el-button type="primary" @click="dialogForm=false">确 定</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
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
			}
		},
		created(){
			
		},
		methods:{
			handleEdit(){
				
			},
			deleteRow(){
				
			},
			handleSizeChange(val){
				
			},
			handleCurrentChange(val){
				
			}
		}
	}
</script>

<style>
	.user-wrap{
		margin: 70px 10px 10px 10px;
	}
</style>