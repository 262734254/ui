<template>
	<div class="login-wrap">
		<div class="card-wrap" @keydown.enter="toLogin">
			<h1>登  录</h1>
			<div class="login-content">
				<!--<font-awesome-icon :icon="['far', 'user']"  color="#fff"/>-->
				<i class="fa fa-user" aria-hidden="true" style="color:#fff;font-size: 18px;"></i>
				<input type="text" v-model="userName" maxlength="11" placeholder="请输入手机号"/>
			</div>
			
			<div class="login-content">
				<!--<font-awesome-icon :icon="['fas', 'unlock-alt']"  color="#fff"/>-->
				<i class="fa fa-unlock-alt" aria-hidden="true" style="color: #fff;font-size: 18px;"></i>
				<!--onfocus="this.type='password'"-->
				<input type="password" v-model="passWord" maxlength="16" autocomplete="off" placeholder="请输入密码" oncopy="return false" onpaste="return false" oncut="return false" oncontextmenu="return false"/>
				<!--<el-button type="primary" @click="">获取验证码</el-button>-->
			</div>
			<div class="verify-tip">{{tip_message}}</div>
			<!--<div class="login-btn" @click="toLogin">登录</div>-->
			<el-button type="primary" @click="toLogin" style="width: 100%;">登录</el-button>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				userName:'',
				passWord:'',
				tip_message:'',
//				loading:false,
			}
		},
		created(){

		},
		mounted(){

		},
		methods:{
			toLogin(){
				if(!this.userName){
					this.tip_message='请输入手机号';
					return;
				}
				if(!this.passWord){
					this.tip_message='请输入密码';
					return;
				}
//				let data={'UserName':this.userName,'Password':this.passWord,'IsApp':false}
				this.$axios.get(`/api/UserCenter/Login/get_userLoginByPasswork?UserName=${this.userName}&Password=${this.passWord}&IsApp=false`)
				.then(res => {
//					const loading =this.$loading({
//						background:'rgba(255,255,255,0.3)'
//					})
					console.log(res)
					if(res.data.State==10){
						sessionStorage.setItem('token',res.data.DataModel.Token);
//						sessionStorage.setItem('token','645B355FE6E19468A548B4EB1321FA05EDCCB1417AF14134A7D8A4A905362DD4FC9804A7859361AB1875ECEDE0D2FCA43DC2ED69CD7FCF994537E3965738568A3B56607F1DA14AFD1A36DEE827350686A0C4DDD65D04AB8BFD9A8126E296CFBDD5B1BF50673C2359DBB5FD4862E54FF217C15C0BB7E7299AB9FE1B2E2851AAFD779F6CA1ECF92852E38C3F60C6B03F2520646375A6AEB902B177A9A8544424A3FAAAA41D36F32F10DAAA138F7E066417CF5C6288FE817773CFB9CDA737684B52C4A3F421FBC61FFB0EFD433949890234D95BC7372DA344DA6C6D810B467D480205FCA79D35E9A043F4770B98459508BF7736E14DA180CF38700FB8A22939C644FF9734845D6DCFF88C1345CB0289268647365E4F47ECB755F234A6B7B9900435AA8650B496822677C8B52A91DF4AAF19');
						sessionStorage.setItem('userName',this.userName);
						sessionStorage.setItem('UserId',res.data.DataModel.UserId);
//						sessionStorage.setItem('UserImgUrl',res.data.DataModel.UserImgUrl);
//						sessionStorage.setItem('SubContractorId',res.data.DataModel.SubContractorId);
//						sessionStorage.setItem('IsAdmin',res.data.DataModel.IsAdmin);
						this.$router.push('/UserManage');
						
					}else{
						this.tip_message=res.data.Message;
					}
//					loading.close();
				}).catch()
			}
		}
	}
</script>

<style scoped>
	.login-wrap{
		width: 100%;
		height: 100vh;
		background: url(../assets/login.jpg) no-repeat 50%;
		background-size: cover;
	}
	.card-wrap{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		background: rgba(255,255,255,.3);
		padding: 20px 20px 25px 20px;
		border: 1px solid #FFFFFF;
		border-radius: 10px;
		box-sizing: border-box;
	}
	.card-wrap>h1{
		text-align: center;
		font-size: 20px;
		font-weight: 600;
		color: #fff;
	}
	.login-content{
		width: 300px;
		border-bottom: 1px solid #fff;
		padding: 0 20px;
	}
	.login-content>input{
		border: none;
		background: none;
		outline: none;
		height: 50px;
		line-height: 50px;
		margin-left: 10px;
		font-size: 16px;
		color: #fff;
	}
	.login-content input::-webkit-input-placeholder {
		color: #fff;
	}
	.login-btn{
		width: 340px;
		line-height: 40px;
		background:skyblue ;
		color: #fff;
		border-radius: 5px;
		margin-top:20px;
		text-align: center;
		cursor: pointer;
	}
	.verify-tip{
		margin: 10px 0 13px 10px;
		color: #ff0000;
		height: 10px;
	}
	:-webkit-autofill {
	-webkit-text-fill-color: #fff !important;
	transition: background-color 5000s ease-in-out 0s;
	}
</style>