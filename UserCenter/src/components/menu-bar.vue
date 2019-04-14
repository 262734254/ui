<template>
	<div class="menu-wrap">
		<el-row>
			<el-col>				
				<el-menu
				  router
			      :default-active="default_active"
			      class="el-menu-vertical-demo"
			      @open="handleOpen"
			      @close="handleClose"
			      :collapse="isCollapse"
			      background-color="#324057"
			      text-color="#fff"
			      active-text-color="#ffd04b">
			      
			      <template v-for="child,index in menu_data">
			      	<el-submenu :index="index+''" :key="index" v-if="!child.hidden && child.children">
				        <template slot="title">
				          <i :class="child.icon" aria-hidden="true"></i>
				          <span> {{child.name}}</span>
				        </template>
				        <el-menu-item-group>
				          <el-menu-item v-for="item in child.children" :key="item.path" :index="item.path">
				          	<i :class="item.icon" aria-hidden="true"></i>
				          	<span> {{item.name}}</span>
				          </el-menu-item>
				        </el-menu-item-group>
				    </el-submenu>
				    <el-menu-item :index="child.path" :key="child.path" v-if="!child.hidden && !child.children">
				        <i :class="child.icon"></i>
				        <span slot="title"> {{child.name}}</span>
				    </el-menu-item>
			      </template>
			      
			      <!--<div v-for="child,index in $router.options.routes[0].children">
			      	<el-submenu :index="index+''" :key="child.path" v-if="!child.hidden && child.children">
				        <template slot="title">
				          <i class="el-icon-location"></i>
				          <span>{{child.name}}</span>
				        </template>
				        <el-menu-item-group>
				          <el-menu-item v-for="item in child.children" :key="item.path" :index="item.path">{{item.name}}</el-menu-item>
				        </el-menu-item-group>
				      </el-submenu>
				      <el-menu-item :index="child.path" :key="child.path" v-if="!child.hidden && !child.children">
				        <i class="el-icon-menu"></i>
				        <span slot="title">{{child.name}}</span>
				    </el-menu-item>
			      </div>-->
			    </el-menu>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default{
		name:'menu-bar',
		data(){
			return{
				isCollapse: false,
				default_active:'',
				menu_data:[
					{name:'用户管理',icon:'fa fa-users',children:[
						{name:'账户管理',icon:'fa fa-id-card',path:'/UserManage'},
						{name:'用户审核',icon:'fa fa-user',path:'/UserAudit'}
					]},
					{name:'企业管理',icon:'fa fa-building',path:'/CompanyManage'},
					{name:'组织架构',icon:'fa fa-sitemap',path:'/OrganizeManage'},
					{name:'菜单管理',icon:'fa fa-minus-square',path:'/menuManage'},
					{name:'角色管理',icon:'fa fa-book',path:'/RoleManage'},
				],
			}
		},
		created(){
			console.log(this.$router)
			this.$root.$on('todo', (value) => {
				this.isCollapse=value
			})
		},
		mounted(){
			this.default_active=sessionStorage.getItem('path')
			console.log(sessionStorage.getItem('path'))
		},
		methods:{
			//折叠导航栏
		    collapse(){
		        this.collapsed = !this.collapsed;
		    },
			handleOpen(key, keyPath) {
		        console.log(key, keyPath);
		    },
		    handleClose(key, keyPath) {
		        console.log(key, keyPath);
		    }
		}
	}
</script>

<style>
.menu-wrap {
  position: fixed;
  top: 60px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.el-menu {
  border: none;
  
}
.el-menu.el-menu--popup.el-menu--popup-bottom-start{
	max-height: 300px;
  overflow-y: auto;
}
.fa-margin {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 100%;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.el-menu-item-group__title{
  	padding: 0;
}
</style>