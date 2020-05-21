// 引入配置文件
// import config from "./config.js";
import User from "./user.js";
export default {
	config:{
		baseUrl:"https://rg.cqlaiku.com:8811",
		// baseUrl:"http://192.168.1.111:8811",
		header:{
			// 'Content-Type':'application/json;charset=UTF-8',        
			'Content-Type':'application/x-www-form-urlencoded',
			"token":User.token
		},
		data: {},
		method: "GET",
		dataType: "json",
	},
	request(options = {}){
		options.header = options.header || this.config.header;
		options.method = options.method || this.config.method;
		options.dataType = options.dataType || this.config.dataType;
		options.url = this.config.baseUrl +options.url;
		
		
		return uni.request(options);
	},
	get(url,data,options={}){
		options.url = url;
		options.data = data;
		options.method = 'GET';
		return this.request(options);
	},
	post(url,data,options={}){
		options.url = url;
		options.data = data;
		options.method = 'POST';
		return this.request(options);
	},
	// 错误处理
	// errorCheck(err,res,errfun = false,resfun = false){
	// 	if (err) {
	// 		typeof errfun === 'function' && errfun();
	// 		uni.showToast({ title: '加载失败',icon:"none" });
	// 		return false;
	// 	}
	// 	if (res.data.errorCode) {
	// 		typeof errfun === 'function' && resfun();
	// 		uni.showToast({ title: res.data.msg,icon:"none" });
	// 		return false;
	// 	}
	// 	return true;
	// },
	
	//验证用户是否登录
	checkToken(checkToken){
		if(checkToken && !User.token){
			uni.showToast({ title: '请先登录', icon:"none" })
			uni.navigateTo({
				url: '/pages/login/login'
			});
			return false;
		}
		return true;
	}
}
