<template>
	<view class="content">
		<view class="user-login" v-if="login_show">
			<view class="enroll">
				<view class="enroll-empty"></view>
				<view class="title">用户登录</view>
				<view class="" @tap="to_register">注册</view>
			</view>
			<image class="login-logo" src="../../static/images/login_logo.png" mode="aspectFit"></image>
			<view class="login-box">
				<view class="account">
					<image src="../../static/images/zhanghao.png" mode=""></image>
					<input type="number" v-model="account" placeholder="请输入您的账号" maxlength="11" placeholder-class="fz30" />
				</view>
				<view class="string"></view>
				<view class="password">
					<image src="../../static/images/mima.png" mode=""></image>
					<input :type="password_text" v-model="password" placeholder="请输入您的密码" placeholder-class="fz30" />
					<view class="eye" @click.stop="password_visible">
						<image src="../../static/images/eye.png" mode="" v-if="!visible"></image>
						<image src="../../static/images/eye2.png" mode="" v-else></image>
					</view>
				</view>
				<view class="string mb70"></view>
				<view class="primary" @tap="login">登录</view>
			</view>
			<view class="login_way">
				<view class="right" @tap="change_login">
					<text>技术人员登录</text>
				</view>
				<view class="left" @tap="to_phone_login">
					手机登录
				</view>
			</view>
			<view class="rapid-login">
				<view class="rapid">微信登录</view>
				<view class="icon" @tap="weixin_login">
					<view class="iconfont icon-weixin1"></view>
				</view>
			</view>
			<view class="agreement">
				<image v-if="agreement_checked" src="../../static/images/tongyi.png" mode="" @tap="agreement"></image>
				<view v-else class="no-checked" @tap="agreement"></view>
				<text @tap="go_agreement(1)">已阅读并同意 <text class="color-b">《用户隐私》</text>协议</text>
			</view>
		</view>
		<view class="tech-login" v-else>
			<view class="hd"></view>
			<view class="main">
				<image class="back-pic" src="../../static/images/backTech.png" mode=""></image>
				<view class="reg">
					<text class="" @tap="to_register">注册</text>
				</view>
				<view class="pic">
					<image class="logo" src="../../static/images/192.png" mode=""></image>
				</view>
				<view class="login-box">
					<view class="account">
						<image src="../../static/images/tech1.png" mode=""></image>
						<input type="number" v-model="account" placeholder="请输入您的账号" maxlength="11" placeholder-style="color:#ffffff" />
					</view>
					<view class="password">
						<image src="../../static/images/tech2.png" mode=""></image>
						<input :type="password_text" v-model="password" placeholder="请输入您的密码" placeholder-style="color:#ffffff" />
						<view class="eye" @click.stop="password_visible">
							<image src="../../static/images/by.png" mode="" v-if="!visible"></image>
							<image src="../../static/images/zy.png" mode="" v-else></image>
						</view>
					</view>
					<view class="change-btn">
						<text @tap="change_login">用户登录</text>
						<text @tap="to_phone_login">手机登录</text>
					</view>
					<view class="primary" @tap="login">
						<text class="txt1">登</text>
						<text>录</text>
					</view>
				</view>
			</view>
			<view class="agreement">
				<image v-if="agreement_checked" class="tongyi1" src="../../static/images/dui.png" mode="" @tap="agreement"></image>
				<view v-else class="no-checked" @tap="agreement"></view>
				<text @tap="go_agreement(2)">已阅读并同意 <text class="color-b">《师傅隐私》</text>协议</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				login_show: true,
				account: "",
				password: "",
				visible: false,
				password_text: "password",
				userToken: "",
				agreement_checked:true ,// 是否勾选协议
			};
		},
		onLoad() {

		},
		computed: {
			// 验证手机号码
			isPhone() {
				let mPattern = /^1[34578]\d{9}$/;
				return mPattern.test(this.account);
			},
		},
		methods: {
			// 协议页
			go_agreement(i){
				if(i === 1){
					uni.navigateTo({url:"../agreement/agreement"})
				}
				if(i === 2){
					uni.navigateTo({url:"../agreement/tech_agreement"})
				}
			},
			// 勾选协议
			agreement(){
				this.agreement_checked = !this.agreement_checked
				
			},
			// 改变密码是否可见
			password_visible() {
				this.visible = !this.visible
				if (this.visible) {
					this.password_text = "text"
				} else {
					this.password_text = "password"
				}
			},
			// 切换用户和技术人员登录
			change_login() {
				this.login_show = !this.login_show
				// 清空输入框
				this.account = ""
				this.password = ""
			},
			// 跳转到验证码快捷登录页面
			to_phone_login() {
				uni.navigateTo({
					url: "../phone_login/phone_login",
					success: () => {
						uni.$emit("sendType", {
							data: this.login_show
						}) // login_show为true的时候是用户登录,false的是技术员登录
					}
				})
			},
			// 跳转到注册页面
			to_register() {
				// 初始 地址是用户注册页
				let url = "../register/register";

				// 当切换状态的时候改变路由地址
				if (!this.login_show) {
					// 技术员注册页
					url = "../technicist_select/technicist_select"
				};
				// 跳转api
				uni.navigateTo({
					url
				})
			},
			//登录
			login() {
				let longin_type = this.login_show
				let account = this.account;
				let password = this.password;
				if (!this.isPhone) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: "none"
					});
					return
				}
				// 验证密码
				if (this.password.length < 6) {
					uni.showToast({
						title: "密码少于6位",
						icon: "none"
					})
					return;
				}
				if(!this.agreement_checked) return uni.showToast({title:"请详细阅读协议,并勾选~",icon:"none"})
					
				
				// longin_type 为true的时候是 用户登录 / false为技术员登录
				let url = "/logins/pwlogin";
				// 切换登录类型后改变相应的路由地址
				if (!longin_type) {
					url = '/logins/tpwlogin';
				}
				this.User.login({
					url,
					data: {
						phone: account,
						password,
					},
					type: longin_type
				})
			},
			weixin_login() {
				// 微信登录 获取用户信息
			
				uni.login({
					provider: 'weixin',
					success: (res) => {
						let unionid = res.authResult.unionid
						this.$http.post("/logins/wxlogincheck", {unionid})
						.then(([err, res]) => {
							if (res.data.result === "SUCCESS") {
								if (res.data.data === "nobind") {
									uni.navigateTo({
										url: "./weixin_login/weixin_login"
									})
								} else {
									this.User.weixin_2(res)
								}
							}
						})
					}
				})
			}
		},
	}
</script>

<style lang="less">
	.content {
		height: 100vh;
		overflow: hidden;

		.user-login {

			// 注册按钮
			.enroll {
				display: flex;
				justify-content: space-between;
				padding-top: 105rpx;
				padding-right: 30rpx;
				padding-left: 30rpx;
				line-height: 36rpx;
				font-size: 30rpx;

				.enroll-empty {
					width: 56rpx;
				}

				.title {
					font-size: 36rpx;
				}

			}

			.login-logo {
				display: block;
				width: 210rpx;
				height: 210rpx;
				margin: 75rpx auto;
			}

			.login-box,
			.rapid-login {
				padding: 0 50rpx;

				.account {
					display: flex;
					align-items: center;
				}

				.password {
					display: flex;
					position: relative;
					align-items: center;
				}

				input {
					flex: 1;
					height: 50rpx;
					margin-left: 24rpx;
					vertical-align: middle;
				}

				.fz30 {
					font-size: 30rpx;
				}

				.string {
					height: 1px;
					margin-top: 15rpx;
					margin-bottom: 70rpx;
					background: rgba(225, 225, 225, 1);
				}

				.mb70 {
					margin-bottom: 70rpx;
				}

				image {
					display: inline-block;
					width: 40rpx;
					height: 40rpx;
					vertical-align: middle;
				}

				.eye {
					position: absolute;
					z-index: 999;
					top: 9rpx;
					right: 5rpx;
					width: 52rpx;
					height: 34rpx;

					image {
						position: absolute;
						width: 52rpx;
						height: 34rpx;
						padding: 0;
					}

				}

				.primary {
					height: 88rpx;
					line-height: 88rpx;
					text-align: center;
					font-size: 34rpx;
					color: #FFFFFF;
					background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
				}
			}

			.login_way {
				display: flex;
				justify-content: space-between;
				padding: 5rpx 84rpx;
				margin-top: 30rpx;
				font-size: 26rpx;
			}

			.agreement {
				width: 100%;
				position: fixed;
				left: 0;
				bottom: 46rpx;
				text-align: center;

				image {
					width: 42rpx;
					height: 42rpx;
					margin-left: -6rpx;
					vertical-align: middle;
				}

				text {
					font-size: 22rpx;
					vertical-align: middle;
				}
				.no-checked{
					display: inline-block;
					width: 23rpx;
					height: 23rpx;
					margin-right: 9rpx;
					border-radius: 50%;
					border: 1rpx solid rgb(255, 68, 95);
					vertical-align: middle;
				}
			}

			.rapid-login {
				margin-top: 40rpx;

				.rapid {
					position: relative;
					text-align: center;
				}

				.rapid::after {
					display: inline-block;
					position: absolute;
					top: 25rpx;
					content: "";
					height: 1rpx;
					width: 200rpx;
					left: 70rpx;
					background: rgba(225, 225, 225, 1);
				}

				.rapid::before {
					display: inline-block;
					position: absolute;
					top: 25rpx;
					right: 70rpx;
					content: "";
					height: 1rpx;
					width: 200rpx;
					background: rgba(225, 225, 225, 1);
				}

				.icon {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 80rpx;
					height: 80rpx;
					background: #e5e5e5;
					margin: 20rpx auto;
					border-radius: 50rpx;

					.iconfont {
						font-size: 50rpx;
						color: rgb(60, 176, 53);
					}
				}
			}
		}

		.tech-login {
			height: 100vh;

			.hd {
				height: 60rpx;
			}

			.main {
				position: relative;
				height: 100vh - 60rpx;
				padding: 1rpx 25rpx;

				.reg {
					margin: 45rpx 36rpx 0 0;
					text-align: right;
					font-size: 28rpx;
					color: #FFFFFF;
				}

				.back-pic {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					z-index: -999;
					width: 100vw;
					height:100vh;  
					background: #333333;
				}  

				.pic {
					width: 176rpx;
					height: 176rpx;
					margin: 104rpx auto;
					border-radius: 50%;
					background: #FFFFFF;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.login-box {

					.account,
					.password {
						display: flex;
						align-items: center;
						height: 100rpx;
						line-height: 100rpx;
						margin: 0 25rpx;
						border-radius: 40px;
						background: rgba(255, 255, 255, .24);

						input {
							color: #FFFFFF;
						}

						image {
							width: 32rpx;
							height: 36rpx;
							margin: 0 24rpx 0 22rpx;
						}

					}

					.account {
						margin-bottom: 84rpx;
					}

					.password {
						position: relative;
						margin-bottom: 60rpx;

						.eye {
							position: absolute;
							z-index: 999;
							top: 38rpx;
							right: 40rpx;
							width: 52rpx;
							height: 34rpx;

							image {
								position: absolute;
								width: 36rpx;
								height: 28rpx;
								padding: 0;
							}

						}
					}
				}

				.change-btn {
					display: flex;
					justify-content: space-between;
					margin: 0 80rpx;

					text {
						font-size: 26rpx;
						color: #FFFFFF;
					}
				}

				.primary {
					height: 88rpx;
					margin: 70rpx 25rpx 0 25rpx;
					line-height: 88rpx;
					background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
					font-size: 40rpx;
					color: #FFFFFF;
					text-align: center;

					.txt1 {
						margin-right: 36rpx;
					}
				}
			}

			.agreement {
				width: 100%;
				position: fixed;
				left: 0;
				bottom: 46rpx;
				text-align: center;
				image {
					width: 42rpx;
					height: 42rpx;
					margin-right: 10rpx;
					vertical-align: middle;
				}
				.tongyi1{
					width: 32rpx;
					height: 32rpx;
					vertical-align: middle;
				}
				text {
					font-size: 22rpx;
					color: #FFFFFF;
					vertical-align: middle;
				}
				.no-checked{
					display: inline-block;
					width: 23rpx;
					height: 23rpx;
					margin-right: 12rpx;
					border-radius: 50%;
					border: 1rpx solid rgb(255, 68, 95);
					vertical-align: middle;
				}
			}
		}
	}
</style>
