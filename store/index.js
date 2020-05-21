import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	// state:{
	// 	// 存储token
	// 	Authorization: uni.getStorageSync('Authorization')?uni.getStorageSync('Authorization'):""
	// },
	// mutatione:{
	// 	// 修改token,并讲token存入到本地
	// 	changeLogin(state,user){
	// 		state.Authorization = user.Authorization;
	// 		uni.setStorageSync('Authorization', user.Authorization);
	// 	}
	// }
})
export default store