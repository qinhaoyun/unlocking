<template>
	<view class="content">
		<view class="empty"></view>
		<view class="back" @tap="back">
			<view class="iconfont icon-arrow-lift-copy"></view>
		</view>
		<view class="main">
			<view class="title">输入短信验证码</view>
			<view class="txt-box">
				<text class="txt1">验证码以发送至尾号{{terminal}}</text>
				<text class="txt2" v-if="!showText" @tap="back">重新发送</text>
				<text class="c-red" v-if="showText">{{second}}后可重新发送</text>
			</view>
		</view>
		<view class="code-box">
			<view v-for="(item,index) in code_boxarr" :key="index">
				{{item}}
			</view>
			<input class="input-hide" type="number" v-model="input_code" maxlength="6" focus="getfocus" @input="getcode" />
		</view>
		<view class="underline-box">
			<view class="underline" v-for="(item,index) in underlinearr" :key="index">

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/**
				 * 打开页面获取焦点
				 * 输入框的数组
				 * 输入框下面的线
				 * 用户输入的code
				 * 服务器返回的code
				 * 用户手机尾数
				 * 用户的手机号
				 */
				getfocus: true,
				code_boxarr: ["", "", "", "", "", ""],
				underlinearr: [1, 2, 3, 4, 5, 6],
				input_code: "",
				code: "",
				terminal: "",
				account: "",
				second: 60, // 发送验证码初始值
				showText: false, // 是否显示倒计时,否
				login_type: "" // 登录类型
			};
		},
		onLoad() {
			uni.$once("get_code", (data) => {
				//获取上一个页面传过来的尾数和code,手机号码
				this.code = data.code
				this.terminal = data.terminal
				this.account = data.phone
				this.login_type = data.login_type
			})
		},
		methods: {
			// 输入框的数据传页面的样式框中
			getcode(e) {
				let valcode = e.detail.value;
				let codearr = valcode.split("")
				this.code_boxarr = codearr
				if (this.input_code.length === 6) {
					this.submit()
				}
			},
			// 返回上一页面
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			submit() {
				let input_code = this.input_code // 用户输入的验证嘛
				let code = this.code // 后端返回的验证嘛
				// 用户输入的code是否正确
				if (input_code === code) {
					if (this.login_type) {
						// 用户登录
						this.User.phone_login({
							url: "/logins/login",
							data: {
								phone: this.account
							},
							login_type:this.login_type
						}, this.account)
					} else {
						// 技术员登录
						this.User.phone_login({
							url: "/logins/tlogin",
							data: {
								phone: this.account
							},
							login_type:this.login_type
						})
					}
				} else {
					uni.showToast({
						title: "验证码错误",
						icon: "none"
					})
				}
			},
			timer() {
				this.showText = true
				let interall = setInterval(() => {
					--this.second
				}, 1000)
				setTimeout(() => {
					clearInterval(interall)
					this.showText = false
					this.second = 60
				}, 60000)
			}
		},
		onReady() {
			this.timer()
		},
		onUnload() {
			// 解除事件监听器
			uni.$off("get_code")
		}
	}
</script>

<style lang="less">
	.content {
		.empty {
			height: 80rpx;
		}

		.back {
			height: 50rpx;
			padding-left: 40rpx;

			view {
				height: 50rpx;
				line-height: 50rpx;
				font-size: 36rpx;
			}
		}

		.main {
			margin-top: 75rpx;
			padding-left: 46rpx;
			padding-right: 84rpx;

			.title {
				font-size: 40rpx;
			}

			.txt-box {
				display: flex;
				justify-content: space-between;
				margin-top: 40rpx;

				.txt1 {
					font-size: 22rpx;
				}

				.txt2 {
					font-size: 24rpx;
					color: rgba(255, 78, 0, 1);
				}
			}
		}

		.code-box {
			position: relative;
			height: 80rpx;
			padding: 0 52rpx;
			margin-top: 130rpx;

			view {
				float: left;
				width: 76rpx;
				height: 76rpx;
				margin-right: 38rpx;
				line-height: 76rpx;
				text-align: center;
				color: #000;
			}

			view:nth-child(6) {
				margin-right: 0;
			}

			.input-hide {
				position: absolute;
				top: 0;
				left: -100%;
				z-index: 9;
				width: 200%;
				height: 100%;
				text-align: left;
			}
		}

		.underline-box {
			padding: 0 52rpx;

			view {
				float: left;
				width: 76rpx;
				height: 4rpx;
				margin-right: 38rpx;
				background: rgba(191, 191, 191, 1);
				opacity: 0.3;
			}

			view:nth-child(6) {
				margin-right: 0;
			}
		}

	}
</style>
