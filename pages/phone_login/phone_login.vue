<template>
	<view class="content">
		<view class="empty"></view>
		<view class="navigation" @tap="back">
			<view class="iconfont icon-arrow-lift-copy"></view>
		</view>
		<view class="login_logo">
			<image src="../../static/images/login_logo.png" mode=""></image>
		</view>
		<view class="mian">
			<view class="gain-box">
				<view class="txt">
					<text>+86</text>
				</view>
				<input type="number" v-model="account" maxlength="11" placeholder="请输入手机号" placeholder-class="fz30" />
			</view>
			<view class="string"></view>
			<view class="sbumit" @tap="get_code">获取验证码</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				account: "",
				login_show: ""
			};
		},
		onLoad() {
			uni.$once("sendType", (data) => {
				this.login_show = data.data
			})
		},
		computed: {
			// 电话号码格式验证
			accountVerifier() {
				let reg = /^1(3|4|5|6|7|8|9)\d{9}$/
				return reg.test(this.account)
			},
			// 获取电话号码的尾数
			get_terminal() {
				return this.account.slice(7)
			}
		},
		methods: {
			get_code() {
				let that = this
				if (this.accountVerifier) {
					//发起请求
					if (this.login_show) {
						// 用户获取验证嘛
					    this.User.phone_code({
							url: "/logins/getcode",
							data: {
								phone: this.account
							},
							type: this.login_show,
						}, this.account, this.get_terminal) // 后面两个参数是传电话号码,和电话尾号
					} else {
						// 技术员获取验证码
						this.User.phone_code({
							url: "/logins/tlogincode",
							data: {
								phone: this.account
							},
							type: this.login_show
						}, this.account, this.get_terminal) // 后面两个参数是传电话号码,和电话尾号
					}
				} else {
					uni.showToast({
						title: "手机号码格式错误",
						icon: "none"
					})
				}
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			}

		}
	}
</script>

<style lang="less">
	.content {
		width: 100%;

		.empty {
			height: 80rpx;
		}

		.navigation {
			height: 50rpx;
			padding-left: 40rpx;

			view {
				height: 50rpx;
				line-height: 50rpx;
				font-size: 36rpx;
			}
		}

		.login_logo {
			image {
				display: block;
				width: 210rpx;
				height: 210rpx;
				padding-top: 75rpx;
				margin: 0 auto;
			}
		}

		.mian {
			margin-top: 140rpx;
			padding: 0 75rpx;

			.gain-box {
				display: flex;
				margin-bottom: 10rpx;

				input {
					height: 50rpx;
					margin-left: 30rpx;
				}

				.fz30 {
					font-size: 30rpx;
				}
			}

			.string {
				height: 1px;
				padding: 0 75rpx;
				background: rgba(225, 225, 225, 1);
			}

			.sbumit {
				margin-top: 100rpx;
				height: 88rpx;
				background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
				color: #FFFFFF;
				line-height: 88rpx;
				text-align: center;
				font-size: 34rpx;
			}
		}


	}
</style>
