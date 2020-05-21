import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false

// 挂载全局方法
import config from "./common/js/config.js"
Vue.prototype.config=config

import request from "./common/js/request.js";
Vue.prototype.$http = request;

import User from "./common/js/user.js"
Vue.prototype.User = User

import lib from "./common/js/lib.js"
Vue.prototype.lib = lib
// 下拉支付组件
import payType from "./components/pay-type/pay-type.vue"
Vue.component('payType',payType)
import payType2 from "./components/pay-type2/pay-type2.vue"
Vue.component('payType2',payType2)

App.mpType = 'app'
// 头部导航
import hdNav from "./components/hd-nav/hd-nav.vue"
Vue.component("hdNav",hdNav)
// 三级联动组件
import sPicker from "./components/s-picker/s-picker.vue"
Vue.component('sPicker',sPicker)
// 上拉滚动刷新
import uniLoadMore from "./components/uni-load-more/uni-load-more.vue"
Vue.component("uniLoadMore",uniLoadMore)

const app = new Vue({
    ...App,
	config
})
app.$mount()
