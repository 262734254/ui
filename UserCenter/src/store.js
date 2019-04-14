import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		//设置属性
		nowCompany:'',
	},
	getters:{
		//获取属性的状态
	},
	mutations: {
		//改变属性的状态
		setCompany(state,data){
			state.nowCompany=data;
			console.log(state.nowCompany)
		}
	},
	actions: {
		//应用mutations
	},
	modules: {
		
	}
});

export default store;


//export default new Vuex.Store({
//state: {
//		
//},
//mutations: {
//
//},
//actions: {
//
//}
//})