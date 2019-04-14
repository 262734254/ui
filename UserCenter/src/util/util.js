const data_validation={
	//只验证不能为空
	checkEmpty:(rule,value,callback) =>{
		if(rule.required && (!value && value !== 0)){
			return callback(new Error('当前项不能为空'));
		}
		callback();
	},
	//验证名称
	checkName:(rule, value, callback) =>{
		if(rule.required && (!value && value !== 0)){
			return callback(new Error('当前项不能为空'));
		}
		//验证是否存在特殊字符
		let pattern = new RegExp("[`@]");
		if(value && pattern.test(value)) {
			return callback(new Error('内容存在特殊字符'));
		}
		if(value && value.toString().match(/[, ]/g)) {
			return callback(new Error('内容不能输入空格'));
		}
		callback();
	},
	//只能输入整数
	checkNum: (rule, value, callback) => {
		if(rule.required && (!value)){
			return callback(new Error('当前项不能为空'));
		}
		if(value && !value.toString().match(/^[0-9]*$/)) {
			return callback(new Error('只能输入整数'));
		}
		callback();
	},
	//验证手机号码
	checkPhone: (rule, value, callback) => {
		if(rule.required && (!value)){
			return callback(new Error('当前项不能为空'));
		}
		if(value && !value.toString().match(/^1[3456789]\d{9}$/)) {
			return callback(new Error('手机号码不正确'));
		}
		callback();
	},
	//验证身份证号
	checkIDCard: (rule, value, callback) => {
		if(rule.required && (!value)){
			return callback(new Error('当前项不能为空'));
		}
		if(value && !value.toString().match(/^\d{15}|\d{18}$/)) {
			return callback(new Error('身份证号不正确'));
		}
		callback();
	},
	//只能输入汉字
	checkHanzi: (rule, value, callback) => {
		if(!value) {
			return callback(new Error('当前项不能为空'));
		}
		if(!value.toString().match(/^[\u4e00-\u9fa5]{0,}$/)) {
			return callback(new Error('只能输入汉字'));
		}
		if(value.toString().match(/[, ]/g)) {
			return callback(new Error('内容不能输入空格'));
		}
		callback();
	},
	//验证营业执照编号
	checkBusinessLicenseNum : (rule, value, callback) => {
		if(!value) {
			return callback(new Error('当前项不能为空'));
		}
		if(!value.toString().match(/(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/)) {
			return callback(new Error('营业执照编号有误，正确为15位或18位'));
		}
		callback();
	},
	checkAmt:(rule,value,callback)=>{
		if(rule.required && (!value)){
			return callback(new Error('当前项不能为空'));
		}
		if(value && !value.toString().match(/^\d{1,12}(.\d{1,2})?$/)){
			return callback(new Error('请输入正确格式'));
		}
		callback();
	},
	//只能输入中文和英文
	checkChiAndEn:(rule, value, callback) => {
		if(!value) {
			return callback(new Error('当前项不能为空'));
		}
		if(value.toString().match(/[, ]/g)) {
			return callback(new Error('内容不能输入空格'));
		}
		if(!value.toString().match(/^[a-zA-Z\u4e00-\u9fa5]+$/)) {
			return callback(new Error('只能输入中文和英文'));
		}
		callback();
	},
}

export {data_validation};
