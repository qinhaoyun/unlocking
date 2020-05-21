<template>
	<view class="content">
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>个人信息</text>
					<view class="right"></view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="set">
				<view class="hd-photo li">
					<text>头像</text>
					<view class="right" @tap="setphoto">
						<image :src="userinfo.headimg" mode=""></image>
						<view class="iconfont icon-gengduo1"></view>
					</view>
				</view>
				<view class="li">
					<text>昵称</text>
					<view class="right">
						<text>{{ userinfo.realname }}</text>
						<view class="iconfont icon-gengduo1"></view>
					</view>
				</view>
				<view class="li" @tap="openSex">
					<text>性别</text>
					<view class="right">
						<text>{{ userinfo.sex ? userinfo.sex : '去设置' }}</text>
						<view class="iconfont icon-gengduo1"></view>
					</view>
				</view>
				<view class="li" @tap="go_skip(1)">
					<text>手机号</text>
					<view class="right">
						<text class="color-0">{{ phone }}</text>
						<view class="iconfont icon-gengduo1"></view>
					</view>
				</view>
				<view class="li bor-none" @tap="go_skip(3)">
					<text>个人简介</text>
					<view class="right">
						<text>去设置</text>
						<view class="iconfont icon-gengduo1"></view>
					</view>
				</view>
			</view>
			<view class="recompose">
				<view class="li" @tap="go_skip(2)">
					<text>登录密码</text>
					<view class="right">
						<text>去修改</text>
						<view class="iconfont icon-gengduo1"></view>
					</view>
				</view>
				<view class="li" @tap="go_skip(4)">
					<text>提现密码</text>
					<view class="right">
						<text>去修改</text>
						<view class="iconfont icon-gengduo1"></view>
					</view>
				</view>
				<view class="li" @tap="go_skip(6)">
					<text>银行卡</text>
					<view class="right">
						<text>去绑定</text>
						<view class="iconfont icon-gengduo1"></view>
					</view>
				</view>
				<view class="li bor-none"> <!-- @tap="go_skip(5)" -->
					<text>微信账户</text>
					<view class="right">
						<image class="wximg" v-if="wximg" :src="wximg" mode=""></image>
						<text v-else>授权绑定</text>
						<view class="iconfont icon-gengduo1"></view>
					</view>
				</view>
			</view>
		</view>
		<w-picker mode="selector" :defaultVal="['女']" @confirm="onConfirm" ref="selector" themeColor="#f00" :selectList="selectList"></w-picker>
	</view>
</template>

<script>
import wPicker from '@/components/w-picker/w-picker.vue';
export default {
	components: {
		wPicker
	},
	data() {
		return {
			selectList: [
				{
					label: '男',
					value: 0
				},
				{
					label: '女',
					value: 1
				}
			],
			userinfo: null,
			phone: '',
			wximg:null
		};
	},
	onLoad() {
		this.userinfo = uni.getStorageSync('userinfo');
		this.wximg = uni.getStorageSync('userinfo').wximg;
		let phone = uni.getStorageSync('userinfo').phone;
		let initio = phone.slice(0, 3);
		let end = phone.slice(7);
		this.phone = initio + '***' + end;
		
	},
	onBackPress(e) {
		if (e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
	},
	methods: {
		// 修改头像
		setphoto() {
			uni.chooseImage({
				count: 1,
				success: res => {
					let pic = res.tempFilePaths[0];
					this.photo = res.tempFilePaths[0];
					// 保存图片路径到数组
					let picarr = [this.photo];
					// 遍历图片数组里每一项为对象格式
					let imgs = picarr.map((value, index) => {
						return {
							name: 'image' + index,
							uri: value
						};
					});
					// 上传图片到手机
					uni.uploadFile({
						url: 'https://rg.cqlaiku.com:8811/logins/upload',
						files: imgs,
						fileType: 'image',
						formData: {},
						success: res => {
							const data = JSON.parse(res.data);
							if (data.result === 'SUCCESS') {
								let picObj = data.data;
								this.request_amend(picObj);
							} else {
								uni.showToast({
									title: data.msg,
									icon: 'none'
								});
							}
						}
					});
				}
			});
		},
		// 上传到服务器
		request_amend(picObj) {
			this.$http
				.post('/user/updateTUserInfo', {
					tid: this.User.userinfo.tid,
					headimg: picObj.image0
				})
				.then(([err, res]) => {
					if (res.data.result === 'SUCCESS') {
						this.$http
							.post('/user/selectUserInfo', {
								tid: this.User.userinfo.tid
							})
							.then(([err, res]) => {
								if (res.data.result === 'SUCCESS') {
									this.userinfo = res.data.data;
									uni.setStorageSync('userinfo', this.userinfo);
									uni.showToast({
										title: '修改成功'
									});
								} else {
									uni.uni.showToast({
										title: res.data.msg,
										icon: 'none'
									});
								}
							});
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				});
		},
		go_skip(index) {
			if (index === 1)
				uni.navigateTo({
					url: '../../phone/phone',
					success: () => {
						uni.$emit('change_type', {
							type: false
						});
					}
				});
			
			if (index === 2)
				uni.navigateTo({
					url: '../../setLogin_pass/setLogin_pass',
					success: () => {
						uni.$emit('change_type', {
							type: false
						});
					}
				});
			
			// 个人简介
			if (index === 3) 
				uni.navigateTo({
					url:"./individual_resume/individual_resume"
				})
			// 修改提现密码
			if(index === 4)
				uni.navigateTo({
					url: './tech_payment_code/tech_payment_code',
					success: () => {
						// uni.$emit('Back', {
						// 	type: false
						// });
					}
				});
			// 绑定微信
			if(index === 5){
				uni.login({
					provider:"weixin",
					success: (res) => {
						uni.getUserInfo({
							provider:"weixin",
							success: (res1) => {
								this.$http.post("/user/bindwx",{
									openid :res.authResult.openid,
									phone :this.userinfo.phone,
									unionid :res.authResult.unionid,
									type :2,
									headimg:res1.userInfo.avatarUrl
								}).then(([err,res])=>{
									if(res.data.result === "SUCCESS"){
										// 绑定微信后的微信头像
										this.wximg = res.data.data.wximg
										uni.showToast({
											title:"绑定成功"
										})
									}else{
										uni.showToast({
											title:res.data.msg,
											icon:"none"
										})
									}
								})
							}
						})
						
					}
				})
			}
			if(index === 6){
				// uni.navigateTo({
				// 	url:"./bank_card/bank_card"
				// })
				uni.showToast({title:"正在努力开发中~",icon:"none"})
					
			}
		},
		openSex() {
			this.$refs.selector.show();
		},
		// 修改性别的回调请求
		onConfirm(e) {
			let sex = e.checkArr.label;

			this.$http
				.post('/user/updateTUserInfo', {
					tid: this.User.userinfo.tid,
					sex
				})
				.then(([err, res]) => {
					if (res.data.result === 'SUCCESS') {
						this.$http
							.post('/user/selectUserInfo', {
								// 修改后请求回来服务器的数据
								tid: this.User.userinfo.tid
							})
							.then(([err, res]) => {
								if (res.data.result === 'SUCCESS') {
									this.userinfo = res.data.data;
									uni.setStorageSync('userinfo', this.userinfo);
									uni.showToast({
										title: '修改成功'
									});
								} else {
									uni.uni.showToast({
										title: res.data.msg,
										icon: 'none'
									});
								}
							});
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				});
		},
		back() {
			uni.navigateTo({
				url: '../technician_Iindex'
			});
		}
	}
};
</script>

<style lang="less">
page {
	background: rgb(238, 238, 238);
}

.content {
	.nav-box {
		height: 160rpx;
		background: #ffffff;

		.empty {
			height: 60rpx;
		}

		.nav {
			display: flex;
			justify-content: space-between;
			height: 100rpx;
			line-height: 100rpx;

			.iconfont {
				width: 100rpx;
				height: 40rpx;
				margin-top: 30rpx;
				padding-left: 34rpx;
				line-height: 40rpx;
			}

			text {
				font-size: 36rpx;
			}

			.right {
				width: 100rpx;
				padding-right: 34rpx;
				line-height: 100rpx;
				font-size: 26rpx;
				text-align: right;
			}
		}
	}

	.main {
		margin-top: 20rpx;

		.set {
			background: #ffffff;
		}

		.li {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 88rpx;
			margin-left: 20rpx;
			border-bottom: 1rpx solid #e5e5e5;
			color: rgba(153, 153, 153, 1);
			font-size: 30rpx;

			.right {
				display: flex;
				align-items: center;
				margin-right: 42rpx;

				text {
					margin-right: 20rpx;
				}
			}
		}

		.bor-none {
			border: none;
		}

		.hd-photo {
			height: 130rpx;

			image {
				width: 84rpx;
				height: 85rpx;
				margin-right: 20rpx;
				border-radius: 50%;
			}
		}

		.recompose {
			margin-top: 20rpx;
			background: #ffffff;
			.li{
				.wximg{
					width: 66rpx;
					height: 66rpx;
					border-radius: 50%;
				}
			}
		}

		.color-0 {
			color: rgba(51, 51, 51, 1);
		}
	}
}
</style>
