<template>
	<view class="content" id="cnt">
		<!-- 主页 -->
		<view class="homepage" @touchstart="openstart" @touchend="openend">
			<view class="hd">
				<image class="h_bgd" src="../../static/images/hd_bgd.png" mode=""></image>
				<view class="top">
					<view class="empty"></view>
					<view class="my_logo">
						<view class="my" @tap="open_broadside"><image class="my_img" src="../../static/images/my.png" mode=""></image></view>
						<view class="hd_logo">
							<image src="../../static/images/h_logo.png" mode=""></image>
							<text>{{ user.name }}</text>
						</view>
						<view class="my_logo_empty"></view>
					</view>
				</view>
				<view class="tab">
					<view class="ptn" v-for="(item, index) in dataArr" :key="index" @tap="change(index)">
						<view class="pic-box">
							<view class="pic-1" v-if="!item.active"><image :src="item.img" mode=""></image></view>
							<view class="pic-2" :class="[index === 0 ? 'pic-2-one' : '', index === 4 ? 'pic-2-last' : '']" v-else>
								<image :src="item.checkimg" mode=""></image>
							</view>
						</view>
						<text :class="item.active ? 'red' : ''">{{ item.name }}</text>
						<view class="square1" v-if="item.active">
							<view class="square1-white"></view>
							<view :class="['square1-red-' + index, item.active ? 'square1-red' + index : '']"></view>
						</view>
						<view class="square" v-if="item.active && index !== 4">
							<view class="square-white"></view>
							<view :class="['square-red-' + index, item.active ? 'square-red' + index : '']"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="main">
				<view class="main-open" v-if="active0">
					<view class="lock-img-btn" v-show="!show_lock">
						<image class="btn-img" src="../../static/images/suo.png" mode="aspectFit" 
						@tap="isShow_lock"></image>
					</view>
					<view class="lock-box" :animation="animationDataLock" v-show="show_lock">
						<scroll-view class="lock" scroll-y="true">
							<view class="cha-icon"><view class="iconfont icon-cha" @tap="close"></view></view>
							<view class="open-change-repair">
								<view class="li" :class="lockChecked === i ? 'lock-checked-bor' : ''" v-for="(items, i) in dataArr3" :key="i" @tap="lock_checked_change(i)">
									<text>{{ items.name }}</text>
									<view class="triangle" v-if="lockChecked === i"></view>
								</view>
							</view>
							<view class="type-tit text-title">
								<image class="icon-img" src="../../static/images/XZ.png" mode=""></image>
								<text>选择产品类型</text>
								<image class="star" src="../../static/images/technologistPic/xh.png" mode=""></image>
							</view>
							<sPicker :productArr="productArr" ref="sPicker"></sPicker>
							<view class="text-title" v-if="show_unit">
								<image class="icon-img" src="../../static/images/unit.png" mode=""></image>
								<text>选择产品数量</text>
								<image class="star" src="../../static/images/technologistPic/xh.png" mode=""></image>
							</view>
							<view class="unit-box" v-if="show_unit">
								<input type="number" v-model="unit_num" placeholder="点击输入.."/>
								<view class="unit"> <text>/</text>  {{unit}}</view>
							</view>
							<view class="describe text-title">
								<image class="icon-img" src="../../static/images/MS.png" mode=""></image>
								<text>描述锁状态</text>
								<image class="star" src="../../static/images/technologistPic/xh.png" mode=""></image>
							</view>
							<view class="uni-textarea">
								<textarea class="describe-info" auto-height="true" v-model="describe_text" adjust-position="fasle" placeholder="请描述锁的具体情况:" />
							</view>
							<view class="upload-pic text-title">
								<image class="icon-img" src="../../static/images/SC.png" mode=""></image>
								<text>上传图片</text>
								<image class="star" src="../../static/images/technologistPic/xh.png" mode=""></image>
							</view>
							<view class="pic-wrap">
								<view class="pics" v-for="(item, index) in picArr" :key="index">
									<image :src="item" mode=""></image>
									<view class="det" @tap="det(index)"><view class="txt">x</view></view>
								</view>
								<view class="upload-btn" @tap="upload_pic">
									<image class="icon-img" src="../../static/images/technologistPic/zp.png" mode=""></image>
									<view class="click">点击上传</view>
									<view class="num">(最多五张)</view>
								</view>
							</view>
							<view class="text-title">
								<image class="icon-img" src="../../static/images/xx.png" mode=""></image>
								<text>详细信息</text>
								<image class="star" src="../../static/images/technologistPic/xh.png" mode=""></image>
							</view>
							<view class="detailed-info">
								<view class="address" @tap="location">
									<image class="icon-img" src="../../static/images/DZ.png" mode=""></image>
									<view class="address-txt">{{ address ? address : '地址' }}</view>
									<view class="iconfont icon-gengduo1"></view>
								</view>
								<view class="house-number">
									<image class="icon-img" src="../../static/images/xxdz.png" mode=""></image>
									<input :disabled="disabled" type="text" v-model="house_number" placeholder="详细地址及门牌号" />
								</view>
								<view class="name-phone">
									<view class="name">
										<image class="icon-img" src="../../static/images/LXR.png" mode=""></image>
										<input :disabled="disabled" type="text" v-model="linkman" placeholder="联系人" placeholder-class="t-indent" />
									</view>
									<view class="phone">
										<image class="icon-img" src="../../static/images/DH.png" mode=""></image>
										<input :disabled="disabled" type="number" v-model="linkmanPhone" placeholder="联系电话" placeholder-class="t-indent" />
									</view>
								</view>
							</view>
							<view class="select-default" v-if="isaddress">
								<view class="select" @tap="selectAddress">
									<view class="add-btn">+</view>
									<text>选择已有地址</text>
								</view>
								<view class="default" @tap="changeIsdefault">
									<view class="default-btn"><view class="iconfont icon-iconset0125" v-if="default_address"></view></view>
									<text class="default-txt">设为默认地址</text>
								</view>
							</view>
							<view class="select-default" v-else>
								<view class="select" @tap="selectAddress">
									<view class="add-btn">+</view>
									<text>选择已有地址</text>
								</view>
								<view class="default" @tap="amend_addre"><text class="default-txt">修改</text></view>
							</view>
							<view class="price-box">
								<text class="price" v-if="predict_money">
									￥
									<text class="price-num">{{ predict_money_sum }}</text>
								</text>
								<view class="predict" @tap="go_pre">订购须知?</view>
							</view>
							<view class="booking-order">
								<view class="booking" @tap="openTime">
									<text class="mar1">预</text>
									<text>约</text>
								</view>
								<view class="order" @tap="PlaceOrder(place_order)">
									<text class="mar1">下</text>
									<text>单</text>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="list-box" v-for="(item, index) in dataArr2" :key="index" v-else>
					<view class="list clearfix" v-if="item.active">
						<view class="li" v-for="(item1, i) in item.functions" :key="i" @tap="go_add_order(item1.id)">
							<image :src="item1.img" mode=""></image>
							<view>{{ item1.name }}</view>
						</view>
					</view>
				</view>
			</view>
			<image class="shopping" :style="shopping_move" @touchmove="handletouchmove" src="../../static/images/shop.gif" mode="" @tap="checkWeChat"></image>
		</view>
		<!-- 用户测边栏 -->
		<view class="broadside" :animation="animationData" @touchstart="closestart" @touchend="closeend">
			<!-- 用户内容 -->
			<view class="left">
				<view class="empty"></view>
				<view class="userinfo" @tap="go_skip(2)">
					<image class="photo" :src="userinfo.headimg" mode="aspectFit"></image>
					<text class="phone">{{ userinfo.name }}</text>
				</view>
				<view class="string"></view>
				<view class="list">
					<view class="list-li" @tap="go_skip(0)">
						<view class="pic">
							<image src="../../static/images/dingdan2.png" mode="aspectFit"></image>
							<text>订单列表</text>
						</view>
					</view>
					<view class="list-li" @tap="go_skip(1)">
						<view class="pic">
							<image src="../../static/images/wodejishuyuan2.png" mode="aspectFit"></image>
							<text>我的技术员</text>
						</view>
					</view>
					<view class="list-li" @tap="go_skip(2)">
						<view class="pic">
							<image src="../../static/images/geren2.png" mode="aspectFit"></image>
							<text>个人信息</text>
						</view>
					</view>
					<view class="list-li" @tap="go_skip(3)">
						<view class="pic">
							<image src="../../static/images/yaoqing2.png" mode="aspectFit"></image>
							<text>邀请有奖</text>
							<image class="img-2" src="../../static/images/chongzhitehui.png" mode="aspectFit"></image>
						</view>
					</view>
					<view class="list-li" @tap="go_skip(4)">
						<view class="pic">
							<image src="../../static/images/wodeqianbao.png" mode="aspectFit"></image>
							<text>我的钱包</text>
							<image class="img-2" src="../../static/images/yinghongbao.png" mode=""></image>
						</view>
					</view>
					<view class="list-li" @tap="go_skip(6)">
						<view class="pic">
							<image src="../../static/images/wodeqianbao.png" mode="aspectFit"></image>
							<text>我的优惠卷</text>
						</view>
					</view>
					<view class="list-li">
						<view class="pic" @tap="go_skip(5)">
							<image src="../../static/images/gengduo2.png" mode="aspectFit"></image>
							<text>更多设置</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 空白区域 -->
			<view class="right" :class="opacity ? 'right-opacity' : ''"></view>
		</view>
		<!-- 时间选择器 -->
		<w-picker mode="limit" dayStep="60" startHour="8" endHour="20" minuteStep="5" afterStep="30" @confirm="onConfirm" ref="limit" themeColor="#f00"></w-picker>
	</view>
</template>

<script>
// 时间选择器插件
import wPicker from "@/components/w-picker/w-picker.vue";
// 查询服务分类的id
let numId = null 
// 地址的经纬度
let location = null;
// 预约的时间
let times = "";
// 默认地址id
let defaultAddrid = "";
// 下单或者预约成功
let strSuccess = ""
// 传递的时间
let timer = null
export default {
	components:{
		wPicker,
	},
	data() {
		return {
			lockChecked: 0, //预约,下单
			user: {
				name: "木人岛"
			},
			active0: true,
			Spagex: null,
			Epagex: null,
			animationData: {},
			animation: null,
			animationDataLock:{},
			animationLock:null,
			opacity: false,
			app_Height: null,
			dataArr: [],
			dataArr2:[],
			dataArr3:[], // 分类锁有关的数据类型
			show_lock:false,
			describe_text:"" ,// 开锁描述文本
			picArr:[] ,// 预约开锁上传的照片数组
			address:"", // 定位地址
			linkmanPhone:"", // 联系人电话
			linkman:"", // 联系人
			house_number:"" ,//详细地址门牌号
			default_address:0 ,//是否选勾选为默认地址,1为默认,0不默认
			index:0,
			productArr: [], // 服务类型数组
			isaddress:true, // 没有默认地址就显示 ,是否勾选默认地址
			userinfo:null,
			disabled:false ,// 是否禁用表单
			predict_money:"" ,// 预计价格
			place_order:"下单成功",
			appoint:"预约成功",
			sweixin:null ,// 微信跳转
			lastY:500 ,// 商城图片的y轴坐标
			show_unit:false, // 是否显示产品计量
			unit:null ,// 单位
			unit_num:"" // 产品数量
		}
	},
	computed:{
		shopping_move(){
			return "top: "+this.lastY+"px"
		},
		verDescribe(){
			return this.describe_text
		},
		// 验证定位地址
		verAddress(){
			return this.address
		},
		// 详细地址
		verHouse_number(){
			return this.house_number
		},
		// 联系人姓名
		verLinkman(){
			let reg = /^[\u4E00-\u9FA5\uf900-\ufa2d_a-zA-Z]{1,10}$/
			return reg.test(this.linkman)
		},
		// 联系人手机号嘛
		verLinkmanPhone(){
			let mPattern = /^1[34578]\d{9}$/;
			return mPattern.test(this.linkmanPhone);
		},
		// 计算预计总价
		predict_money_sum(){
			if(this.show_unit){ // 如果显示计量,所以就需要计算总价
				return this.unit_num * this.predict_money
			}else{
				return this.predict_money
			}
		}
		
	},
	onError(err) {
		console.log(err)
	},
	onLoad() {
		// 跳转小程序
		this.getPlus()
		// 请求后台功能分类接口
		this.request_classified({
			url: "/function/selectFunction"
		});
		// 请求用户信息
		uni.getStorage({
			key:"userinfo",
			success:(res)=>{
				this.userinfo = res.data
			}
		})
		// 接受定位信息
		uni.$on("getLocation",(data)=>{
			location = data.data
			this.address = data.data1
		});
		// 请求全部地址
		this.$http.post("/function/selectAddr",{
			uid:this.User.userinfo.uid,
			addrid:""
		}).then(([err,res])=>{
			let deft = res.data.data
			
		    deft.map((item,i)=>{
				if(item.state == 1){
					defaultAddrid = item.id // 默认地址id
					this.disabled = true // 表单禁用
					this.isaddress = false // 是否显示修改
					this.address = item.addr // 定位地址
					this.linkmanPhone = item.phone // 联系人手机号
					this.linkman = item.name // 联系人
					this.house_number = item.doornum  //门牌号
					location = item.fixed
				}
			})
		})
		uni.$on("send_addrid",(data)=>{
			defaultAddrid = data.Id
			if(defaultAddrid = data.Id){
				this.$http.post("/function/selectAddr",{
					uid:this.User.userinfo.uid,
					addrid:defaultAddrid
				}).then(([err,res])=>{
					this.isShow_lock()
					this.isaddress = true
					this.disabled = false
					if(res.data.result === "SUCCESS"){
						let address = res.data.data[0]
						
						this.address = address.addr,
						this.linkmanPhone = address.phone,
						this.linkman = address.name,
						this.house_number = address.doornum
						location = address.fixed
					}
				})
			}
		})
	},
	methods: {
		// 时间格式化
		addZero(n){
			return n < 10? "0" + n : n + "";
		},
		// 关闭lock 页面
		close(){
			this.show_lock = false;
			this.off()
		},
		// 修改地址 初始化
		amend_addre(){
			this.address = ""
			this.linkmanPhone = ""
			this.house_number = ""
			this.linkman = ""
			this.isaddress = true
			this.disabled = false
			defaultAddrid = "";
			location = "";
		},
		// 点击切换选项
		change(index) {
			this.dataArr.forEach((item)=>{
				item.active = false
			})
			this.dataArr[index].active = true
			if(index===0){
				this.active0 = true
				this.lock_type()
			} else{
				this.active0 = false
				this.productArr = []
			}
		},
		// 滑动 打开测边栏
		openstart(e) {
			// 获取鼠标点击的开始x轴坐标
			this.Spagex = e.changedTouches[0].pageX
		},
		openend(e) {
			// 获取鼠标点击结束的的时候的x轴坐标
			this.Epagex = e.changedTouches[0].pageX
			// 开始结束的差值
			let value = this.Epagex - this.Spagex
			// 如果差值大于50 就执行动画
			if (value > 100) {
				this.animation.left(0).step()
				this.animationData = this.animation.export()
				// 遮罩的透明度
				setTimeout(() => {
					this.opacity = false
				}, 150);
			}
		},
		// 点击打开测边栏
		open_broadside() {
			this.animation.left(0).step()
			this.animationData = this.animation.export()
			setTimeout(() => {
				this.opacity = false
			}, 200);
		},
		// 滑动关闭测边栏
		closestart(e) {
			this.Spagex = e.changedTouches[0].pageX
		},
		closeend(e) {
			this.Epagex = e.changedTouches[0].pageX
			let value = this.Spagex - this.Epagex
			if (value > 50) {
				this.animation.left(-750 + "rpx").step()
				this.animationData = this.animation.export()
				this.opacity = true
			}
		},
		go_add_order(i){
			uni.navigateTo({
				url:"../add_order/add_order",
				success() {
					uni.$emit("send_funId",{funId:i})
				}
			})
		},
		// 请求后台分类接口
		async request_classified(options){
			uni.showNavigationBarLoading(); //显示加载动画
			let [err,res] = await this.$http.post(options.url)
			uni.hideNavigationBarLoading(); //关闭加载动画
			if(res.data.result === "SUCCESS"){
				let data = res.data.data
				for (let i = 0; i < data.length; i++) {
					// 设置开关值
					data[i].active = false
					data[0].active = true
				}
				// 赋值每个选项
				this.dataArr = data
				// 赋值每个选项中子选项
				for (let i = 0; i < data.length; i++) {
					this.dataArr2.push(data[i+1])
				}
				numId = data[0].functions[0].id
			
				this.dataArr3 = data[0].functions
			}
		},
		// 锁请求服务类型
		lock_type(){
			// 锁请求服务类型
			this.$http.post("/function/selectType",{
				modeid:numId
			}).then(([err,res])=>{
				if(res.data.result === "SUCCESS"){
					this.productArr = res.data.data
				}
			})
		},
		// 弹出开锁
		isShow_lock(){
			this.show_lock = true
			this.animationLock.scale(1).step()
			this.animationDataLock = this.animationLock.export()
		},
		// 变小开锁
		off(){
			this.animationLock.scale(0.2).step()
			this.animationDataLock = this.animationLock.export()
		},
		// 预约,下单时 选着的功能类型
		lock_checked_change(index){
			this.lockChecked = index;
			// 改变时获取功能id
			// 获取当前tab的索引
			let idx = null
			for (let i = 0; i < this.dataArr.length; i++) {
				if(this.dataArr[i].active === true){
					idx = i
				}
			}
			numId = this.dataArr[idx].functions[index].id
			// 不同的服务类型再次请求返回的数据
			this.lock_type()
		},
		// 跳转,地图定位
		location(){
			if(!this.disabled){
				uni.navigateTo({
					url:"../map/map"
				})
			}
		},
		// 上传图片
		upload_pic(){
			uni.chooseImage({
				count: 5,
				success: (res) => {
					for (let i = 0; i < res.tempFilePaths.length; i++) {
						if(this.picArr.length < 5){
							this.picArr.push(res.tempFilePaths[i])
						}else{
							uni.showToast({
								title:"最多只能上传5张照片",
								icon:"none"
							})
						}
					}
				}
			})
		},
		// 删除图片
		det(index){
			this.picArr.splice(index,1)
		},
		// 选择已有地址
		selectAddress(){
			uni.navigateTo({
				url:"../addressList/addressList",
				success: () => {
					uni.$emit("index_order",{isAddorder:false})
				}
			})
		},
		// 是否勾选设为默认地址
		changeIsdefault(){
			if(this.default_address === 1){
				this.default_address = 0
			}else{
				this.default_address = 1
			}
		},
		// 时间选择器
		openTime(){
			this.$refs.limit.show();
		},
		// 时间选择器的结果回调
		onConfirm(time){
			times = time.result
			this.PlaceOrder(this.appoint)
		},
		// 获取价格
		get_money(e){
			this.predict_money = this.$refs.sPicker.pri
		},
		showUnit(){
			this.show_unit = true;
			this.unit = this.$refs.sPicker.unit
		},
		// 跳转到计费规则页面
		go_pre(){
			uni.navigateTo({
				url:"../flow_chart/flow_chart"
			})
		},
		// 下单
		PlaceOrder(str){
			if(this.$refs.sPicker.name === null){
				uni.showToast({
					title:"请选择产品类型"
				})
				return
			}
			if(!this.verDescribe){
				uni.showToast({title:"请描述下锁状态",icon:"none"})
				return
			}
			if(!this.verAddress){
				uni.showToast({title:"请输入地址",icon:"none"})
				return
			}
			if(!this.verHouse_number){
				uni.showToast({title:"请输入详细地址",icon:"none"})
				return
			}
			if(!this.verLinkman){
				uni.showToast({title:"请输入联系人,并且不能为数字",icon:"none"})
				return
			}
			if(!this.verLinkmanPhone){
				uni.showToast({title:"请输正确的电话号码",icon:"none"})
				return
			}
			// 验证是否需要输入参评数量
			if(this.show_unit){
				if(!this.unit_num){
					uni.showToast({title:"产品数量不能为空,或者零~",icon:"none"})
					return
				}
			}
			// 服务类型id
			let type = this.$refs.sPicker.idList
			
			//用户id
			let uid = this.User.userinfo.uid
			// 地址
			let address = this.address+ " " +this.house_number
			// 物品
			let goods = this.$refs.sPicker.name

			// 获取传递的时候,判断是预约时间还是,当前时间
			
			if(times){
				timer = times
			}else{
				var date = new Date();
				let yy = date.getFullYear();    //获取年
				let mm = date.getMonth()+1;    //获取月份 0-11
				let dd = date.getDate();
				let	hh = this.addZero(date.getHours());    //小时
				let	ff = this.addZero(date.getMinutes());     //分钟
				let	ss = this.addZero(date.getSeconds());   //秒钟
				let sss = yy + "-" + mm + "-" + dd + ' '+ hh + ':' + ff + ':' + ss;
				timer = sss
			}
			// 传递的的下单/预约请求的数据
			let orderdata = {
				uid: uid,
				type :type,
				mode:numId,
				intro:this.describe_text,
				addrid:defaultAddrid, // 默认地址id
				username:this.linkman,
				phone:this.linkmanPhone,
				address:this.address, // 定位地址
				doornum:this.house_number,
				fixed:location,
				state:this.default_address,
				money:this.predict_money_sum,
				appointment:times,
				num:this.unit_num
			}
		
			// 表单数据
			let inputinfo = {
				username:this.linkman,
				phone:this.linkmanPhone,
				address,
				pic:this.picArr,
				goods:goods,
				pri:this.predict_money_sum,
				intro:this.describe_text,
				timer
			}
			uni.navigateTo({
				url:"../confirm_order/confirm_order",
				success:()=>{
					times = ""
					uni.$emit("sendOderInfo",{
						orderdata,
						inputinfo,
						strSuccess:str
					})
				}
			})
		},
		// 我的里面跳转页面
		go_skip(index){
			if(index===0)uni.navigateTo({url:"../order_list/order_list"}) // 订单列表
			if(index===2)uni.navigateTo({url:"../personal_information/personal_information"}) // 个人信息
			if(index===5)uni.navigateTo({url:"../moreSet/moreSet"}) // 更多设置
			if(index===4)uni.navigateTo({url:"../myWallet/myWallet"}) // 我的钱包
			if(index===6)uni.navigateTo({url:"../coupon/coupon"}) // 我的优惠卷
		},
		getPlus() {
			//获取当前显示的webview
				var pages = getCurrentPages()
				var page = pages[pages.length - 1]
				var currentWebview = page.$getAppWebview()
				//调用H5+APP的扩展API
				var shares=null;
				let that = this
				var pusher = plus.share.getServices(function(s){
					shares={};
					for(var i in s){
						var t=s[i];
						shares[t.id]=t;
					}
					that.sweixin=shares['weixin'];
				}, function(e){
					
				});
				//放入当前的webview
				currentWebview.append(pusher);

		},

		checkWeChat(){
			//调用微信小程序
			this.sweixin.launchMiniProgram({
				id:'gh_71bb941083ac' ,//要跳转小程序的原始ID
				path:"pages/index/index",
				type:0
			})
		},
		// 上下滑动商城图片
		handletouchmove(event){
			 let currentY = event.changedTouches[0].pageY;
			 this.lastY = currentY - 34  // top值
		},
	},
	onReady() {
		// 调用动画,获取animation
		var animation = uni.createAnimation({
			duration: 300,
			timingFunction: 'ease',
		})
		// 存入data
		this.animation = animation
		var animationLock = uni.createAnimation({
			duration:300,
			timingFunction: 'ease'
		})
		this.animationLock = animationLock
		if(!this.show_lock){
			this.off()
		}
		// 请求锁的服务类型
		this.lock_type()
	}
}
</script>
<style lang="less">
.content {
	position: relative;
	height: 100vh;
	.shop_pic {
		position: fixed;
		bottom: 160rpx;
		left: 0;
		width: 210rpx;
		height: 136rpx;
	}
	.homepage {
		display: flex;
		flex-direction: column;
		align-content: space-between;
		height: 100%;
		.hd {
			position: relative;
			height: 268rpx;
			.h_bgd {
				position: absolute;
				top: 0;
				left: 0;
				z-index: -999;
				width: 100%;
				height: 268rpx;
				vertical-align: middle;
			}
			.top {
				height: 128rpx;

				.empty {
					height: 42rpx;
				}

				.my_logo {
					display: flex;
					justify-content: space-between;
					height: 86rpx;

					.my {
						display: flex;
						align-items: center;
						padding-left: 40rpx;
						line-height: 96rpx;

						.my_img {
							width: 42rpx;
							height: 40rpx;
						}
					}

					.hd_logo {
						line-height: 86rpx;
						font-size: 38rpx;
						color: #ffffff;
						image {
							width: 72rpx;
							height: 70rpx;
							vertical-align: middle;
						}
					}

					.my_logo_empty {
						width: 38rpx;
						padding-right: 40rpx;
					}
				}
			}

			.tab {
				display: flex;
				justify-content: space-between;
				height: 140rpx;
				.ptn {
					position: relative;
					height: 140rpx;
					width: 140rpx;
					.pic-box {
						position: relative;
						width: 140rpx;
						height: 100%;

						view {
							display: flex;
							justify-content: center;
						}

						.pic-1 {
							position: absolute;
							width: 100%;
							height: 100%;
						}
						.pic-2 {
							position: absolute;
							width: 100%;
							height: 140rpx;
							border-radius: 10px 10px 0 0;
							background: #ffffff;
						}

						.pic-2-one {
							border-radius: 0 10px 0 0;
						}

						.pic-2-last {
							border-radius: 10px 0 0 0;
						}

						.pic-1 {
							border-radius: 0 0 10px 10px;
						}

						image {
							will-change: transform;
							width: 66rpx;
							height: 66rpx;
							margin-top: 30rpx;
							vertical-align: middle;
						}
					}
					.square {
						position: absolute;
						bottom: 0rpx;
						left: 140rpx;
						width: 50rpx;
						height: 50rpx;

						.square-white {
							position: absolute;
							bottom: 0;
							width: 50rpx;
							height: 50rpx;
							background: #ffffff;
						}

						.square-red-0 {
							position: absolute;
							bottom: 0;
							width: 50rpx;
							height: 50rpx;
							background: rgb(242, 97, 100);
						}

						.square-red-1 {
							position: absolute;
							width: 50rpx;
							height: 50rpx;
							background: rgb(230, 97, 103);
						}

						.square-red-2 {
							position: absolute;
							width: 50rpx;
							height: 50rpx;
							background: rgb(217, 97, 114);
						}

						.square-red-3 {
							position: absolute;
							width: 50rpx;
							height: 50rpx;
							background: rgb(209, 97, 121);
						}

						.square-red0 {
							border-radius: 0 0 0 20rpx;
						}

						.square-red1 {
							border-radius: 0 0 0 20rpx;
						}

						.square-red2 {
							border-radius: 0 0 0 20rpx;
						}

						.square-red3 {
							border-radius: 0 0 0 20rpx;
						}
					}
					.square1 {
						position: absolute;
						bottom: 0;
						left: -50rpx;
						width: 50rpx;
						height: 50rpx;

						.square1-white {
							position: absolute;
							width: 50rpx;
							height: 50rpx;
							background: #ffffff;
						}

						.square1-red-1 {
							position: absolute;
							width: 50rpx;
							height: 50rpx;
							background: rgb(242, 98, 100);
						}

						.square1-red-2 {
							position: absolute;
							width: 50rpx;
							height: 50rpx;
							background: rgb(234, 97, 101);
						}

						.square1-red-3 {
							position: absolute;
							width: 50rpx;
							height: 50rpx;
							background: rgb(222, 97, 110);
						}
						.square1-red-4 {
							position: absolute;
							width: 50rpx;
							height: 50rpx;
							background: rgb(211, 97, 120);
						}
						.square1-red0 {
							border-radius: 0 0 20rpx 0;
						}

						.square1-red1 {
							border-radius: 0 0 20rpx 0;
						}

						.square1-red2 {
							border-radius: 0 0 20rpx 0;
						}

						.square1-red3 {
							border-radius: 0 0 20rpx 0;
						}
						.square1-red4 {
							border-radius: 0 0 20rpx 0;
						}
					}

					text {
						position: absolute;
						top: 68%;
						left: 50% - 16rpx;
						z-index: 2;
						font-size: 24rpx;
						color: #ffffff;
					}
					.red {
						color: red;
					}
				}
			}
		}

		.main {
			position: relative;
			height: calc(100vh - 268rpx);
			.main-open {
				height: 100%;
				.lock-img-btn {
					text-align: center;
					.btn-img {
						margin-top: 150rpx;
					}
				}
				.lock-box {
					position: relative;
					z-index: 9999;
					height: 100%;
					padding: 0 44rpx;
					background: #ffffff;
					.lock {
						height: 100%;
						.cha-icon {
							display: flex;
							flex-direction: row-reverse;
							margin-top: 20rpx;
							.icon-cha {
								width: 40rpx;
								font-size: 40rpx;
								color: rgb(255, 50, 94);
							}
						}
						.icon-img {
							width: 40rpx;
							height: 40rpx;
						}
						.open-change-repair {
							display: flex;
							justify-content: space-between;
							margin-top: 20rpx;
							.lock-checked-bor {
								border: 2px solid red !important;
							}
							.li {
								position: relative;
								width: 180rpx;
								height: 64rpx;
								line-height: 64rpx;
								border: 2px solid rgba(167, 167, 167, 1);
								border-radius: 6px;
								text-align: center;
								font-size: 32rpx;
								
								.triangle {
									position: absolute;
									top: 0;
									right: 0;
									width: 0;
									height: 0;
									border-top: 8rpx solid red;
									border-bottom: 8rpx solid transparent;
									border-left: 12rpx solid transparent;
									border-right: 12rpx solid red;
								}
							}
						}
						.text-title {
							display: flex;
							margin-top: 40rpx;
							.star {
								width: 20rpx;
								height: 20rpx;
								margin-top: 10rpx;
							}
							text {
								margin: 0 6rpx 0 14rpx;
								line-height: 40rpx;
								font-size: 34rpx;
							}
						}
						.unit-box{
							display: flex;
							align-items: bottom;
							margin-top: 20rpx;
							input{
								width: 200rpx;
								height: 66rpx;
								padding-left: 20rpx;
								border: 1rpx solid rgba(167, 167, 167, 1);
								border-radius: 10rpx;
							}
							.unit{
								margin-left: 20rpx;
								font-size: 34rpx;
								color:rgba(100, 100, 100, 1);
								text{
									font-size: 40rpx;
								}
							}
						}
						.select-type {
							width: 346rpx;
							height: 66rpx;
							margin-top: 50rpx;
							border: 1px solid rgba(167, 167, 167, 1);
							border-radius: 6px;
							line-height: 66rpx;
							text-align: center;
							font-size: 30rpx;
							color: rgba(167, 167, 167, 1);
						}
						.describe {
							margin-top: 40rpx;
						}
						.uni-textarea {
							position: relative;
							margin-top: 20rpx;
							.describe-info {
								width: 100%;
								height: 40rpx;
								background: rgba(166, 166, 166, 0.1);
							}
						}
						.pic-wrap {
							display: flex;
							flex-wrap: wrap;
							margin-top: 20rpx;
							.pics {
								position: relative;
								width: 158rpx;
								height: 158rpx;
								margin-left: 2rpx;
								margin-right: 8rpx;
								margin-bottom: 15rpx;
								image {
									width: 158rpx;
									height: 158rpx;
									vertical-align: middle;
								}
								.det {
									position: absolute;
									top: -15rpx;
									left: -6rpx;
									width: 40rpx;
									height: 40rpx;
									border-radius: 50%;
									background: #ffffff;
									.txt {
										width: 30rpx;
										height: 30rpx;
										line-height: 23rpx;
										margin: 5rpx auto;
										border-radius: 50%;
										text-align: center;
										background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
									}
								}
							}
							.upload-btn {
								width: 156rpx;
								height: 156rpx;
								border: 1px dashed rgba(191, 191, 191, 1);
								text-align: center;
								color: rgba(191, 191, 191, 1);
								image {
									width: 80rpx;
									height: 80rpx;
									margin-left: 12rpx;
									vertical-align: middle;
								}
								.click {
									margin: 10rpx 0 5rpx 0;
									line-height: 20rpx;
									font-size: 20rpx;
								}
								.num {
									line-height: 14rpx;
									font-size: 14rpx;
								}
							}
						}
						.detailed-info {
							margin-top: 20rpx;
							.address {
								display: flex;
								height: 50rpx;
								line-height: 50rpx;
								border-bottom: 1px solid rgba(225, 225, 225, 1);
								.icon-img {
									margin-top: 10rpx;
								}
								.address-txt {
									width: 580rpx;
									margin-left: 16rpx;
									line-height: 50rpx;
									font-size: 30rpx;
									color: #666666;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								}
								.icon-gengduo1 {
									color: rgba(182, 182, 182, 1);
								}
							}
							.house-number {
								display: flex;
								height: 50rpx;
								margin-top: 20rpx;
								border-bottom: 1px solid rgba(225, 225, 225, 1);
								.icon-img {
									margin-top: 10rpx;
								}
								input {
									margin-left: 16rpx;
								}
								.house-pla {
									font-size: 30rpx;
									color: rgba(51, 51, 51, 1);
								}
							}
							.name-phone {
								display: flex;
								height: 50rpx;
								margin-top: 20rpx;
								border-bottom: 1px solid rgba(225, 225, 225, 1);
								.t-indent {
									text-indent: 18rpx;
								}
								.icon-img {
									margin-top: 10rpx;
								}
								input {
									height: 50rpx;
								}
								.name {
									display: flex;
									position: relative;
									width: 50%;
								}
								.name:after {
									display: flex;
									position: absolute;
									top: 0;
									right: 0;
									content: '';
									width: 1px;
									height: 43rpx;
									background: rgba(154, 156, 155, 1);
								}

								.phone {
									display: flex;
									width: 50%;
								}
							}
						}
						.select-default {
							display: flex;
							justify-content: space-between;
							margin-top: 20rpx;
							.add-btn,
							.default-btn {
								width: 22rpx;
								height: 22rpx;
								border: 1px solid rgba(167, 167, 167, 1);
								line-height: 22rpx;
								text-align: center;
								.iconfont {
									line-height: 22rpx;
									font-size: 22rpx;
									color: red;
								}
							}
							.select,
							.default {
								display: flex;
								text {
									margin-left: 12rpx;
									line-height: 24rpx;
									font-size: 24rpx;
								}
								.default-txt {
									margin-right: 22rpx;
								}
							}
						}
						.price-box {
							display: flex;
							align-items: center;
							justify-content: center;
							margin-top: 40rpx;
							line-height: 52rpx;

							.price {
								font-size: 26rpx;
								.price-num {
									font-size: 52rpx;
								}
							}
							.predict {
								width: 78rpx;
								height: 22rpx;
								line-height: 22rpx;
								margin-top: 6rpx;
								border: 1px solid rgba(167, 167, 167, 1);
								font-size: 14rpx;
								text-align: center;
							}
						}
						.booking-order {
							display: flex;
							justify-content: space-between;
							margin-top: 20rpx;
							padding-bottom: 15rpx;
							text-align: center;
							.booking,
							.order {
								width: 260rpx;
								height: 88rpx;
								line-height: 88rpx;
								background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
								color: #ffffff;
								font-size: 36rpx;
								.mar1 {
									margin-right: 30rpx;
								}
							}
						}
					}
				}
			}
			.list-box {
				.list {
					display: flex;
					flex-wrap: wrap;
					image {
						width: 114rpx;
						height: 114rpx;
						vertical-align: middle;
					}
					.li {
						float: left;
						width: 114rpx;
						width: 33.33333%;
						margin-top: 70rpx;
						text-align: center;
						view {
							line-height: 32rpx;
							font-size: 26rpx;
							text-align: center;
						}
					}
					.maintain {
						position: relative;
						.maintain-txt {
							position: absolute;
							top: 114rpx;
							left: -8rpx;
							width: 130rpx;
						}
					}
				}
			}
		}
		.shopping {
			position: fixed;
			// top: 660rpx;
			left: 0;
			width: 210rpx;
			height: 136rpx;
		}
	}

	.broadside {
		position: absolute;
		height: 100vh;
		z-index: 9999;
		top: 0;
		left: -750rpx;
		.left {
			float: left;
			width: 560rpx;
			height: 100%;
			background: #ffffff;

			.empty {
				height: 42rpx;
			}

			.userinfo {
				display: flex;
				align-items: center;
				height: 218rpx;
				margin-left: 40rpx;

				.photo {
					width: 107rpx;
					height: 107rpx;
					border-radius: 50%;
				}

				.phone {
					font-size: 32rpx;
					margin-left: 20rpx;
				}
			}

			.string {
				width: 535rpx;
				height: 1px;
				margin: 0 auto;
				background: rgba(225, 225, 225, 1);
			}

			.list {
				margin-left: 40rpx;
				margin-top: 74rpx;

				.list-li {
					display: flex;
					align-items: flex-end;
					height: 60rpx;
					margin-bottom: 45rpx;

					image {
						width: 46rpx;
						height: 46rpx;
						vertical-align: bottom;
					}

					.img-2 {
						width: 114rpx;
						height: 60rpx;
						margin-left: 10rpx;
					}

					text {
						margin-left: 40rpx;
						font-size: 32rpx;
						vertical-align: bottom;
					}
				}
			}
		}

		.right {
			float: left;
			width: 191rpx;
			height: 100%;
			background: rgba(0, 0, 0, 1);
			opacity: 0.5;
		}

		.right-opacity {
			opacity: 0;
		}
	}

	.left0 {
		left: 0;
	}
	.abc {
		width: 100%;
		height: 100rpx;
	}
}
</style>
