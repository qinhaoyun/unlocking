<template>
	<view class="content">
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>微信登录</text>
					<view class="right"></view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="name">
				<input type="number" v-model="phone" placeholder="绑定手机号码" />
			</view>
			<view class="name code">
				<input type="text" v-model="code" placeholder="验证码" />
				<view class="get-code">
					<text v-if="!showText" @click.stop="getCode">获取验证码</text>
					<text v-if="showText"><text class="c-red">{{second}}</text>秒后可重新获取</text>
				</view>
			</view>
			<view class="submit" @tap="submit">
				确认
			</view>
			<view class="text">第一次使用微信快捷登录需绑定手机号码</view>
		</view>
	</view>
</template>

<script>
	let type = null
	let dataCode = null
	export default {
		data() {
			return {
				phone: "",
				code: "",
				second: 60,
				showText: false
			};
		},
		onLoad() {
			uni.$once("change_type1", (data) => {
				type = data.type
			})
		},
		computed: {
			isPhone() {
				let mPattern = /^1[34578]\d{9}$/;
				return mPattern.test(this.phone);
			},
			isCode() {
				return this.code === dataCode
			}
		},
		methods: {
			submit() {
				if (!this.isCode) {
					uni.showToast({
						title: "验证码错误",
						icon: "none"
					})
					return
				}
				uni.login({
					provider: 'weixin',
					success: () => {
						uni.getUserInfo({
							success: (infoRes)=>{
								let userInfo = infoRes.userInfo
								this.User.weixin_(userInfo,this.phone)
							}
						})
					}
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			getCode() {
				if (!this.isPhone) {
					uni.showToast({
						title: "请输入正确的手机号码",
						icon: "none",
					}, )
					return
				}
				this.request_code({
					url: "/logins/getcode",
					data: {
						phone: this.phone
					}
				})
			},
			async request_code(opt) {
				uni.showLoading({
					title: '发送中...',
					mask: true
				});
				let [err, res] = await this.$http.post(opt.url, opt.data)
				uni.hideLoading();
				if (res.data.result === "SUCCESS") {
					
					uni.showToast({
						title: "验证码已发送,请耐心等待",
						icon: "none",
						success: () => {
							this.showText = true
							let interval = setInterval(() => {
								--this.second
							}, 1000)
							setTimeout(() => {
								clearInterval(interval)
								this.showText = false
								this.second = 60
							}, 60000);
						}
					})
				}else{
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
						
					
				}
				dataCode = res.data.data
			}
		},

	}
</script>

<style lang="less">
	page {
		background: rgb(238, 238, 238);
	}

	.content {
		.nav-box {
			height: 160rpx;
			background: #FFFFFF;

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
			margin-top: 22rpx;

			.name {
				height: 88rpx;
				line-height: 88rpx;
				color: #999999;
				font-size: 30rpx;
				background: #FFFFFF;

				input {
					height: 88rpx;
					margin-left: 20rpx;
				}
			}

			.code {
				position: relative;

				input {
					border-top: 1rpx solid #e5e5e5;
				}

				.get-code {
					position: absolute;
					right: 50rpx;
					top: 29rpx;
					z-index: 99;
					height: 30rpx;
					line-height: 30rpx;
					border-bottom: 1rpx solid;
					font-size: 24rpx;
					color: #FF6434;
				}
			}

			.submit {
				height: 88rpx;
				line-height: 88rpx;
				margin: 40rpx 50rpx 0 50rpx;
				background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
				text-align: center;
				color: #FFFFFF;
			}

			.text {
				margin-top: 22rpx;
				text-align: center;
				font-size: 20rpx;
				font-weight: 300;
				color: rgba(51, 51, 51, 1);
			}
		}
	}
</style>
