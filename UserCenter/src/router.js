import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router=new Router({
//mode: 'history',
//base: process.env.BASE_URL,
  routes: [
  	{
    	path:'/login',
    	name:'Login',
    	component: () => import('./views/Login'),
   	},{
      path: '/',
      name: 'Index',
      component: () => import('./views/Index'),
//    redirect:'/UserManage',
      children:[
	      {path: '/UserManage', name: '用户管理', component: () => import('./views/UserManage') },
	      {path: '/CompanyManage', name: '企业管理', component: () => import('./views/CompanyManage') },
	      // {path: '/AuthManage', name: '权限管理', component: () => import('./views/AuthManage') },
	      {path: '/OrganizeManage', name: '组织架构信息管理', component: () => import('./views/OrganizeManage') },
	      {path: '/MenuManage', name: '菜单管理', component: () => import('./views/MenuManage') },
	      {path: '/RoleManage', name: '角色管理',component: () => import('./views/RoleManage')},
	      {path: '/UserAudit', name: '用户审核',component: () => import('./views/UserAudit')},
      ]
    }
  ]
})

router.afterEach(to => {
	console.log(to)
	sessionStorage.setItem('path',to.path)
})

export default router;