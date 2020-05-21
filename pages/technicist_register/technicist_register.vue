<template>
	<view class="content">
		<view class="empty"></view>
		<view class="navigation-box">
			<view class="empty"></view>
			<view class="navigation">
				<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
				<text>个人信息</text>
				<view class=""></view>
			</view>
		</view>
		<view class="register_info">
			<view class="phone input_box">
				<image src="../../static/images/technologistPic/sjh.png" mode=""></image>
				<input type="number" v-model="phone" />
				<text>手机号</text>
				<view class="get_code" @tap="get_code" v-if="!showTime">获取验证码</view>
				<view class="again" v-else>{{num}}秒后重获取</view>
			</view>
			<view class="code input_box">
				<image src="../../static/images/technologistPic/yzm.png" mode=""></image>
				<input type="text" v-model="inputCode" placeholder="请输入验证码" placeholder-class="sj" />
				<text>验证码</text>
			</view>
			<view class="password input_box">
				<image src="../../static/images/technologistPic/mm.png" mode=""></image>
				<input type="password" v-model="password" maxlength="16" placeholder="密码6-16位字符" placeholder-class="sj" />
				<text>密码</text>
			</view>
			<view class="location-box input_box" @tap="getLocation">
				<image src="../../static/images/technologistPic/gzdz.png" mode=""></image>
				<view class="location"><text>{{location_address?location_address:'定位地址'}}</text></view>
				<view class="iconfont icon-gengduo"></view>
			</view>
			<view class="input_box">
				<image src="../../static/images/technologistPic/zsxm.png" mode=""></image>
				<input type="text" v-model="address" placeholder="请输入详细地址或门牌号" placeholder-class="sj"/>
				<text>详细地址</text>
			</view>
			<view class="address input_box">
				<image src="../../static/images/sxt.png" mode=""></image>
				<view class="hd-img">
					<image class="img" :src="hd_img" mode=""></image>
					<image class="upload-btn" src="../../static/images/ctx.png" mode="" @tap="up_hd_btn"></image>
				</view>
				<text>头像</text>
			</view>
		</view>
		<view class="authentication">
			<view class="tit">实名认证</view>
			<view class="input_box">
				<image src="../../static/images/technologistPic/zsxm.png" mode=""></image>
				<input type="text" v-model="name" />
				<text>真实姓名</text>
			</view>
			<view class="input_box">
				<image src="../../static/images/technologistPic/sfzh.png" mode=""></image>
				<input type="idcard" v-model="id" />
				<text>身份证号码</text>
			</view>
		</view>
		<view class="permit Profile-picture" v-show="show_permit">
			<text class="tit">执照</text>
			<image class="icon" src="../../static/images/technologistPic/xh.png" mode=""></image>
			<view class="btn" :class="upd1?'bor-none':''" @tap="updateLoad(0)">
				<image :class="upd1?'pic2':''" :src="permit" mode="aspectFit"></image>
				<view class="tishi">点击上传</view>
			</view>
		</view>
		<view class="idcard Profile-picture">
			<text class="tit">身份证正面照</text>
			<image class="icon" src="../../static/images/technologistPic/xh.png" mode=""></image>
			<view class="positive">
				<view class="btn" :class="upd2?'bor-none':''" @tap="updateLoad(1)">
					<image :class="upd2?'pic2':''" :src="id_front" mode="aspectFit"></image>
					<view class="tishi">上传正面</view>
				</view>
			</view>
		</view>
		<view class="Profile-picture">
			<text class="tit">身份证反面照</text>
			<image class="icon" src="../../static/images/technologistPic/xh.png" mode=""></image>
			<view class="counter">
				<view class="btn" :class="upd3?'bor-none':''" @tap="updateLoad(2)">
					<image :class="upd3?'pic2':''" :src="id_contrary" mode="aspectFit"></image>
					<view class="tishi">上传反面</view>
				</view>
			</view>
		</view>
		<view class="Profile-picture">
			<text class="tit">手持身份证照</text>
			<image class="icon" src="../../static/images/technologistPic/xh.png" mode=""></image>
			<view class="btn" :class="upd4?'bor-none':''" @tap="updateLoad(3)">
				<image :class="upd4?'pic2':''" :src="id_hand" mode="aspectFit"></image>
				<view class="tishi">点击上传</view>
			</view>
		</view>
		<view class="sbumit" @tap="submite">
			同意协议并注册
		</view>
		<view class="agreement">
			<image v-if="agreement_checked" src="../../static/images/tongyi.png" mode="" @tap="agreement"></image>
			<view v-else class="no-checked" @tap="agreement"></view>
			<text @tap="go_agreement">已阅读并同意《师傅注册》协议</text>
		</view>
	</view>
</template>

<script>
	let pic = "../../static/images/technologistPic/zp.png"
	// 功能类型
	let industry = ""
	// 地位经纬度
	let location = ""
	export default {
		data() {
			return {
				phone: "", // 手机号码
				password: "", // 密码
				name: "", //姓名
				id: "", //身份证号码
				location_address:"", //定位地址
				address:"", // 详细地址
				permit: pic, // 执照
				id_front: pic, // 身份证正面照
				id_contrary: pic, // 身份证反面照
				id_hand: pic, // 手持身份证照
				inputCode: "", // 用户输入的验证码
				code: "", // 返回的验证码
				upd1: false, // 上传照片是改变图片的样式开关
				upd2: false,
				upd3: false,
				upd4: false,
				showTime:false, // 定时器
				num:60 ,// 定时器时间
				show_permit:"",
				hd_img:null,
				agreement_checked: true // 协议勾选
			};
		},
		computed: {
			// 地址定位
			verifieLlocation(){
				return this.location_address === ""
			},
			// 验证手机号码
			isPhone() {
				let mPattern = /^1[34578]\d{9}$/;
				return mPattern.test(this.phone);
			},
			// 验证身份证号码
			verifierID() {
				let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
				return reg.test(this.id)
			},
			// 验证姓名
			verifierName() {
				let reg = /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,10}$/
				return reg.test(this.name)
			},
			// 验证密码
			verifierPassword() {
				return this.password.length > 5
			},
			// 验证证件照片是否上传
			verifierPic() {
				let {
					permit,
					id_front,
					id_contrary,
					id_hand
				} = this;
				let arr = []
				// 如果需要上传执照 把permit存入数组用于验证,不需要就不存
				if(this.show_permit){
					arr = [permit, id_front, id_contrary, id_hand];
				}else{
					arr = [id_front, id_contrary, id_hand]
				}
				return arr.every((item) => item !== pic)
			},
			// 验证是否上传头像
			verifierHdimg() {
				return this.hd_img
			},
			// 门牌号
			verifierAddress(){
				return this.address
			},
			// 验证码是否正确
			verifierCode() {
				return this.code === this.inputCode
			}
		},
		methods: {
			// 跳转到协议页面
			go_agreement(){
				uni.navigateTo({url:"../agreement/tech_agreement"})
			},
			// 验证时否有开锁项目注册
			verifier_unlocking(data){
				let num = data.indexOf(1)
				
				if(num === 0){
					this.show_permit = true
				}else{
					this.show_permit = false
				}
			},
			// 协议勾选
			agreement(){
				this.agreement_checked = !this.agreement_checked
			},
			// 获取验证码
			get_code() {
				if (this.isPhone) {
					uni.request({
						url: "https://rg.cqlaiku.com:8811/logins/getcode",
						data: {
							phone: this.phone
						},
						method: "POST",
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success: (res) => {
							if (res.data.result === "SUCCESS") {
								this.code = res.data.data
								this.showTime = true
								let time = setInterval(()=>{
									--this.num	
								},1000)
								setTimeout(()=>{
									clearInterval(time)
									this.num = 60
									this.showTime = false
								},60000)
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: "none"
								})
							}
						}
					})
				} else {
					uni.showToast({
						title: "手机号码输入有误",
						icon: "none"
					})
				}
			},
			// 获取定位
			getLocation(){
				uni.navigateTo({
					url:"../map/map"
				})
			},
			// 上传执照
			updateLoad(num) {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this['upd' + (num + 1)] = true
						switch (num) {
							case 0:
								this.permit = res.tempFiles[0].path
								break;
							case 1:
								this.id_front = res.tempFiles[0].path
								break;
							case 2:
								this.id_contrary = res.tempFiles[0].path
								break;
							case 3:
								this.id_hand = res.tempFiles[0].path
								break;
						}
					}
				})
			},
			// 上传头像
			up_hd_btn(){
				uni.chooseImage({
					count:1,
					success:(res)=>{
						this.hd_img = res.tempFiles[0].path
					}
				})
			},
			submite() {
				if (!this.isPhone) {
					uni.showToast({
						title: "手机号码输入有误",
						icon: "none"
					})
					return;
				}
				if (!this.verifierCode) {
					uni.showToast({
						title: "验证码输入错误",
						icon: "none"
					})
					return;
				}
				if (!this.verifierPassword) {
					uni.showToast({
						title: "密码至少6位",
						icon: "none"
					})
					return;
				}
				if(this.verifieLlocation){
					uni.showToast({
						title: "请进行地址地位",
						icon: "none"
					})
					return;
				}
				if(!this.verifierAddress){
					uni.showToast({
						title:"请输入详细地址",
						icon:"none"
					})
					return;
				}
				if (!this.verifierHdimg) {
					uni.showToast({
						title: "请上传头像",
						icon: "none"
					})
					return;
				}
				if (!this.verifierName) {
					uni.showToast({
						title: "姓名输入有误",
						icon: "none"
					})
					return;
				}
				if (!this.verifierID) {
					uni.showToast({
						title: "身份证号码输入有误",
						icon: "none"
					})
					return;
				}
				if (!this.verifierPic) {
					uni.showToast({
						title: "请上传相关证件照片",
						icon: "none"
					})
					return;
				}
				if(!this.agreement_checked) return uni.showToast({title:"请详细阅读协议,并勾选~",icon:"none"})
				uni.showLoading({
					title: '提交中...',
					mask: true
				});
				// 保存图片路径到数组
				let picarr = [this.permit, this.id_front, this.id_contrary, this.id_hand,this.hd_img]
				// 遍历图片数组里每一项为对象格式
				let imgs = picarr.map((value, index) => {
					return {
						name: "image" + index,
						uri: value
					}
				});
				// 上传图片
				uni.uploadFile({
					url: "https://rg.cqlaiku.com:8811/logins/upload",
					files: imgs,
					fileType: "image",
					formData: {},
					success: (res) => {
						const data = JSON.parse(res.data)
						if (data.result === "SUCCESS") {
							let picObj = data.data
							this.register(picObj)
						} else {
							uni.showToast({
								title: data.msg,
								icon: "none"
							})
						}
					},
				})
			},
			// 请求接口注册信息
			register(picObj) {
				uni.request({
					url: "https://rg.cqlaiku.com:8811/logins/tregister",
					data: {
						phone: this.phone,
						password: this.password,
						name: this.name,
						idcard: this.id,
						addr: location,
						address :this.location_address,
						certificate: picObj.image0,
						handIDcard: picObj.image3,
						Pcard: picObj.image1,
						Tcard: picObj.image2,
						headimg:picObj.image4,
						doornum:this.address,
						industry,
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: "POST",
					success: (res) => {
						uni.hideLoading();
						if (res.data.result === "SUCCESS") {
							uni.showModal({
							    title: '提交成功',
							    content: '等待审核,预计一个工作日之内审核完毕',
							    success: function (res) {
							        if (res.confirm) {
							           uni.navigateTo({
							           	url:"../login/login"
							           })
							        } 
							    }
							});
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
						}
					}
				})
			},
			back(){
				uni.navigateBack({
					delta:1
				})
			}
		},
		onLoad() {
			uni.$once("sendStr",(data)=>{
				// 获取参数 存数据
				let str = data.data
				industry = str
				this.verifier_unlocking(str)
			})
			uni.$once("getLocation",(data)=>{
				this.location_address = data.data1
				location = data.data
			})
		}
	}
</script>

<style lang="less">
	.content {
		.empty {
			height: 80rpx;
			width: 100%;
		}
		.navigation-box{
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			background: #FFFFFF;
			.empty{
				height: 80rpx;
			}
		}
		.navigation {
			display: flex;
			justify-content: space-between;
			height: 50rpx;
			padding: 0 40rpx;
			text {
				color: rgba(51, 51, 51, 1);
				line-height: 50rpx;
				font-size: 40rpx;
			}

			view {
				height: 50rpx;
				width: 50rpx;
				line-height: 50rpx;
				font-size: 36rpx;
			}
		}
		.register_info{
			margin-top: 130rpx;
		}
		.register_info,
		.authentication {
			padding-left: 66rpx;
			padding-right: 56rpx;

			.input_box {
				display: flex;
				position: relative;
				margin-bottom: 40rpx;
				.hd-img{
					flex: 1;
					height: 60rpx;
					border-bottom: 1px solid rgba(225, 225, 225, 1);
					.img{
						position: absolute;
						width: 80rpx;
						height: 80rpx;
						top: -38rpx;
						left: 140rpx;
					}
					.upload-btn{
						position: absolute;
						width: 50rpx;
						height: 50rpx;
						right: 10rpx;
						top: -20rpx;
					}
				}
				input {
					flex: 1;
					height: 60rpx;
					border-bottom: 1px solid rgba(225, 225, 225, 1);
				}
				.location{
					flex: 1;
					border-bottom: 1px solid rgba(225, 225, 225, 1);
					text{
						width: 80%;
						overflow: hidden;
						white-space:nowrap;
						text-overflow:ellipsis; 
						font-size: 30rpx;
					}
				}
				.sj {
					text-indent: 158rpx;
					font-size: 30rpx;
					color: rgba(102, 102, 102, 1);
				}

				image {
					width: 52rpx;
					height: 52rpx;
					margin-right: 5rpx;
					margin-top: 6rpx;
					
				}

				text {
					position: absolute;
					left: 60rpx;
					top: 4rpx;
					font-size: 30rpx;
				}

				.get_code,.again{
					position: absolute;
					right: 5rpx;
					top: 10rpx;
					z-index: 9;
					font-size: 22rpx;
					color: rgba(102, 102, 102, 1);
				}
				.again{
					color: red;
				}
			}
			.location-box{
				position: relative;
				.iconfont{
					position: absolute;
					right: 4rpx;
					color: rgba(182, 182, 182, 1);
				}
			}
			.tit {
				margin-left: 10rpx;
				margin-bottom: 40rpx;
				color: rgba(51, 51, 51, 1);
				font-size: 34rpx;
				font-weight: 500;
			}
		}

		.register_info {
			input {
				text-indent: 125rpx;
			}
		}

		.authentication {
			input {
				text-indent: 150rpx;
			}
		}

		.Profile-picture {
			position: relative;
			margin-bottom: 130rpx;

			.tit {
				padding-left: 66rpx;
				font-size: 34rpx;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}

			.icon {
				width: 24rpx;
				height: 24rpx;
			}
			.btn {
				width: 217rpx;
				height: 217rpx;
				margin: 0 auto;
				margin-top: 30rpx;
				border: 6rpx solid #BFBFBF;
				text-align: center;

				image {
					width: 106rpx;
					height: 106rpx;
					margin-top: 30rpx;
					padding-left: 18rpx;
				}

				.pic2 {
					position: absolute;
					top: 100rpx;
					left: 110rpx;
					width: 500rpx;
					height: 380rpx;
				}

				.tishi {
					font-size: 24rpx;
					color: #666666;
				}
			}
			.bor-none{
				padding-top: 180rpx;
				border: none;
			}
			.pic {
				width: 500rpx;
				margin: 20rpx auto;

				image {
					width: 500rpx;
					height: 300rpx;
				}
			}
		}

		.sbumit {
			height: 88rpx;
			margin: 0 60rpx;
			margin-top: 100rpx;
			line-height: 88rpx;
			background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
			text-align: center;
			font-size: 30rpx;
			color: #FFFFFF;
		}

		.agreement {
			width: 100%;
			margin-top: 30rpx;
			text-align: center;

			image {
				width: 42rpx;
				height: 42rpx;
				vertical-align: middle;
			}

			text {
				font-size: 22rpx;
				vertical-align: middle;
			}
		}
	}
</style>
