<template>
	<div class="index_wrap">
		<Header></Header>
		<Menubar></Menubar>
		<div class="show-content-info">
			<router-view></router-view>					
		</div>
	</div>
</template>

<script>
import Header from '../components/header'
import Menubar from '../components/menu-bar'
export default{
	name:'index',
	data(){
		return{

		}
	},
	components:{
		Header,
		Menubar,
	},
	created(){
		
	},
	mounted(){
		
	},
	methods:{
		
	}
}
</script>

<style>
	.show-content-info{
		margin-left: 200px;
	}
</style>