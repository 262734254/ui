<template>
	<header class="head-nav">
		<el-row>
			<el-col class="logo-wrap" :span="4">
				<img src="../assets/logo.png" alt="" />
				<span>用户中心</span>
			</el-col>
			<!--<el-col :span='2' @click.native="toIcon">展开</el-col>-->
			<el-col :span="3">
				<el-menu class="el-menu-demo my-menu" mode="horizontal" @select="handleSelect">
				  <el-submenu index="2">
				    <template slot="title">{{EnterpriseName}}</template>
				    <el-menu-item v-for="(item,index) in enterprise_data" :key="index" :index="item.id" :class="{'is-active' :item.id==EnterpriseID}">{{item.name}}</el-menu-item>
				  </el-submenu>
				</el-menu>
			</el-col>
			<el-col class="info-wrap" :span="12">								
				<span class="user-info" style="float: right;">
					<img src="../assets/logo.png"/>
					<span>{{user_name}}</span>
				</span>	
				<span style="float: right;margin-right: 20px;">
					<span @click="loginOut" style="cursor: pointer;">退出</span>
				</span>
			</el-col>
		</el-row>
	</header>
</template>

<script>
	import jwt_decode from 'jwt-decode';
//	import Crypto from "crypto";
//	import { Decrypt } from '../util/secret.js'
	export default{
		data(){
			return{
				isCollapse:false,
				decode:'',
				user_name:sessionStorage.getItem('userName'),
				enterprise_data:[],
				EnterpriseID:'',
				EnterpriseName:'',
				currentUser:''
			}
		},
		created(){
			//刷新页面的时候，记住当前的企业id
			if(sessionStorage.getItem('EnterpriseID')){
				this.EnterpriseID=sessionStorage.getItem('EnterpriseID');				
			}
//			this.getCurrentUser()
			console.log(this.EnterpriseID)			
			
			this.$root.$on('addCompany', (value) => {
				if(value){
					this.getCompanyList();
				}
			})
//			console.log(this.showShow)
			this.getCompanyList();
			
			this.$root.$on('getCompany', (value) => {
				if(value){
					this.getCompanyAudit();
				}
			})
			
			
//			this.decode = Decrypt(sessionStorage.getItem('token')) // 解密用户名
//			console.log(sessionStorage.getItem('token'))
////			this.decode=jwt_decode('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjBmZTQxYzVjYzNmMDFlNDA5NzhjZCIsIm5hbWUiOiJ6eXQiLCJhdmF0YXIiOiIvL3d3dy5ncmF2YXRhci5jb20vYXZhdGFyLzcyNzJhNjlhZmIxOTJkMWIwYjM3ZDdjMjE3YTk3YmUyP3M9MjAwJnI9cGcmZD1tbSIsImlhdCI6MTU0NjU2OTg5NCwiZXhwIjoxNTQ2NTczNDk0fQ.T7v2k43prvhfq0XuSXxT6VnlukHxGnPm8DqfwBICB08');
//			this.decode=jwt_decode(sessionStorage.getItem('token'))
//			console.log(this.decode)
			
//			let str2 = Crypto.get(unescape(sessionStorage.getItem('token')));
//			console.log(str2)
		},
		methods:{
			//获取当前用户所属企业
			getCurrentUser(resolve,reject){
				this.$axios.get(`/UserInfo/get_userInfos?keyword=${this.user_name}&selectValue&accountType=List
					&selectEnterpriseInfo&selectRoleId&pageIndex=1`)
				.then(res => {
					console.log(res)
					if(res.data.DataModel.length>0){
						this.currentUser=res.data.DataModel[0].EnterpriseInfoID;
						if(!sessionStorage.getItem('EnterpriseID')){
							this.$store.commit('setCompany',this.currentUser)
						}						
						resolve(this.currentUser)
					}else{
						resolve(false)
					}					
				}).catch(err => {
					console.log(err)
				})
			},
			getCompanyList(){
				//获取企业列表
				new Promise(this.getCurrentUser).then(result => {
					console.log(result)
					this.$axios.get(`/api/UserCenter/EnterpriseInfo/get_all_enterpriseinfo`)
					.then(res => {
						console.log(res)	
						this.enterprise_data=res.data.DataModel.filter(item => item.State===1).map(item => {
							return {name:item.Name,id:item.Id}
						})
						this.enterprise_data.push({name:'目前没有企业的用户',id:'99999'})
						if(!this.EnterpriseID){
							console.log(this.currentUser,'99999999')
							console.log(result,'99999999')
							if(this.currentUser){
								this.EnterpriseID=this.currentUser;
								let select_name=this.enterprise_data.find(item => {
									return item.id==this.currentUser;
								})
								this.EnterpriseName=select_name.name;
							}else{
								this.EnterpriseID=this.enterprise_data[0].id;
								this.EnterpriseName=this.enterprise_data[0].name;
	//							this.EnterpriseID=res.data.DataModel[0].Id;
	//							this.EnterpriseName=res.data.DataModel[0].Name;
							}
						}else{
							let select_name=this.enterprise_data.find(item => {
								return item.id==this.EnterpriseID;
							})
							this.EnterpriseName=select_name.name;
						}
						sessionStorage.setItem('EnterpriseID',this.EnterpriseID)
						
						
						this.$root.$emit('getUserList',this.EnterpriseID)
						
//						if(this.currentUser && !sessionStorage.getItem('currentUser')){
//							this.EnterpriseID=this.currentUser;
//							let select_name=this.enterprise_data.find(item => {
//								return item.id==this.currentUser;
//							})
//							this.EnterpriseName=select_name.name;
//							sessionStorage.setItem('EnterpriseID',this.EnterpriseID)
//							sessionStorage.setItem('EnterpriseName',this.EnterpriseName)
////							return;
//						}
//						if(!sessionStorage.getItem('EnterpriseID') ){
//							this.EnterpriseID=res.data.DataModel[0].Id;
//							this.EnterpriseName=res.data.DataModel[0].Name;
//							sessionStorage.setItem('EnterpriseID',this.EnterpriseID)
//							sessionStorage.setItem('EnterpriseName',this.EnterpriseName)
//						}else{
//							this.EnterpriseID=sessionStorage.getItem('EnterpriseID')
//							this.EnterpriseName=sessionStorage.getItem('EnterpriseName')
//							console.log(this.EnterpriseName)
//						}				
					}).catch(err => {
						console.log(err)
					})
				})				
			},
			//企业审核通过之后重新获取企业列表
			getCompanyAudit(){
				this.$axios.get(`/api/UserCenter/EnterpriseInfo/get_all_enterpriseinfo`)
				.then(res => {
					console.log(res)	
					this.enterprise_data=res.data.DataModel.filter(item => item.State===1).map(item => {
						return {name:item.Name,id:item.Id}
					})
				}).catch(err => {})
			},
			toIcon(){
				this.isCollapse=!this.isCollapse;
				this.$root.$emit('todo',this.isCollapse)
			},
			loginOut(){	
				this.$confirm('是否确定要退出?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	sessionStorage.clear();
		        	this.$store.state.nowCompany='';
					this.$router.push('/login')
//		          this.$message({
//		            type: 'success',
//		            message: '删除成功!'
//		          });
		        }).catch(() => {
//		          this.$message({
//		            type: 'info',
//		            message: '已取消删除'
//		          });          
		        });
				
			},
			handleSelect(val){
				console.log(val)
				this.$store.commit('setCompany',val)
//				sessionStorage.setItem('currentUser',true)
				this.EnterpriseID=val;
//				console.log(this.enterprise_data)
				sessionStorage.setItem('EnterpriseID',this.EnterpriseID)
				let select_name=this.enterprise_data.find(item => {
					return item.id==val;
				})
				console.log(select_name)
				this.EnterpriseName=select_name.name;
				
//				sessionStorage.setItem('EnterpriseName',select_name.name)
//				location.reload();
//				this.resetSetItem('watchStorage', this.EnterpriseID);
			}
		}
	}
</script>

<style scoped>
	.head-nav{
		width: 100%;
		background: #324057;
		color: #fff;
		padding:0px 20px;
		box-sizing: border-box;
		position: fixed;
		z-index: 99;
		top: 0;
		line-height: 60px;
	}
	.logo-wrap{
		text-align: left;
	}
	.logo-wrap>img{
		width: 20px;
	}
	.logo-wrap>img,.logo-wrap>span{
		vertical-align: middle;
	}
	/**/
	.info-wrap{
		float: right;
		text-align: right;
	}
	.user-info{
		/*width: 150px;*/
	}
	.user-info img{
		width: 20px;
		display: inline-block;
		vertical-align: middle;
		border-radius: 50px;
	}
	.user-info span{
		vertical-align: middle;
	}	
</style>
<style>
	.my-menu{
		background-color: #324057;
	}
	.my-menu.el-menu.el-menu--horizontal{
		border-bottom: none;
	}
	.my-menu.el-menu--horizontal>.el-submenu .el-submenu__title{
		color: #fff;
	}
	.my-menu.el-menu--horizontal>.el-submenu .el-submenu__title:hover{
		background-color: #495060;
	}
	.my-menu .el-submenu.is-active .el-submenu__title{
		border-bottom-color:none;
		border-bottom: none;
	}
	.el-menu--horizontal .el-menu .el-menu-item.is-active{
		color: #409EFF;
	}
</style>