<template>
	<view class="content">
		<view class="empty"></view>
		<view class="back" @tap="back"><view class="iconfont icon-arrow-lift-copy"></view></view>
		<view class="title">手机号注册</view>
		<view class="main-box">
			<view class="phone">
				<text>+86</text>
				<input type="number" v-model="account" maxlength="11" placeholder="请输入手机号" placeholder-style="font-size:30rpx" />
			</view>
			<view class="string"></view>
			<view class="get_code_box">
				<input type="number" v-model="code" placeholder="请输入验证码" placeholder-style="font-size:30rpx" />
				<view class="get_code">
					<text v-if="!showText" @click.stop="get_code">获取验证码</text>
					<text v-if="showText">
						<text class="c-red">{{ second }}</text>
						秒后可重新获取
					</text>
				</view>
			</view>
			<view class="string"></view>
			<view class="password">
				<input :type="password_text" v-model="password" maxlength="16" placeholder="密码6-16字符" placeholder-style="font-size:30rpx" />
				<view class="eye" @click.stop="password_visible">
					<image src="../../static/images/eye.png" mode="" v-if="!visible"></image>
					<image src="../../static/images/eye2.png" mode="" v-if="visible"></image>
				</view>
			</view>
			<view class="string"></view>
		</view>
		<view class="sbumit-box"><view class="sbumit" @tap="sbumit">同意协议并注册</view></view>
		<view class="agreement">
			<image v-if="agreement_checked" src="../../static/images/tongyi.png" mode="" @tap="agreement"></image>
			<view v-else class="no-checked" @tap="agreement"></view>
			<text @tap="go_agreement">已阅读并同意《用户注册》协议</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			account: '',
			password: '',
			visible: false, // 初始为false,密码不可见
			password_text: 'password', // 输入框类型,初始为密码
			code: '', // 用户输入code
			res_code: '', // 后台返回code
			second: 60, // 发送验证码初始值
			showText: false ,// 是否显示倒计时,否
			agreement_checked:false
		};
	},
	computed: {
		/**
		 * account 验证
		 */
		accountVerifier() {
			// 根据 accoun t验证结果
			let reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
			return reg.test(this.account);
		}
	},
	methods: {
		// 跳转到协议页面
		go_agreement() {
			uni.navigateTo({
				url: '../agreement/agreement'
			});
		},
		// 密码是否可见
		password_visible() {
			this.visible = !this.visible;
			if (this.visible) {
				this.password_text = 'text';
			} else {
				this.password_text = 'password';
			}
		},
		// 勾选协议
		agreement(){
			this.agreement_checked = !this.agreement_checked
		},
		// 获取验证码

		get_code() {
			const that = this;
			if (this.accountVerifier) {
				uni.request({
					url: 'https://rg.cqlaiku.com:8811/logins/getcode?phone=' + this.account,
					method: 'POST',
					success: res => {
						if (res.data.data) {
							//如果返回结果存在
							that.res_code = res.data.data; //保存验证码
							uni.showToast({
								title: '验证码已发送,请耐心等待',
								icon: 'none',
								success: () => {
									this.showText = true;
									let interval = setInterval(() => {
										--this.second;
									}, 1000);
									setTimeout(() => {
										clearInterval(interval);
										this.showText = false;
										this.second = 60;
									}, 60000);
								}
							});
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			} else {
				if (that.account) {
					uni.showToast({
						title: '手机号格式错误',
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					});
				}
			}
		},
		//同意协议并注册
		sbumit() {
			if(!this.agreement_checked) return uni.showToast({title:"请详细阅读协议,并勾选~",icon:"none"})
			const that = this;
			if (this.code === this.res_code) {
				if (this.password.length > 5 && this.password.length < 17) {
					uni.request({
						url: 'https://rg.cqlaiku.com:8811/logins/register?phone=' + this.account + '&password=' + this.password,
						method: 'POST',
						success: res => {
							// 获取返回得msg
							let msg = res.data.msg;
							if (res.data.data) {
								uni.showModal({
									title: '注册成功',
									content: '点击确认去登录',
									success: function(res) {
										if (res.confirm) {
											uni.redirectTo({
												url: '../login/login'
											});
										}
									}
								});
							} else {
								uni.showToast({
									title: msg,
									icon: 'none'
								});
							}
						}
					});
				} else {
					uni.showToast({
						title: '请输入6-16位字符',
						icon: 'none'
					});
				}
			} else {
				uni.showToast({
					title: '验证码错误',
					icon: 'none'
				});
			}
		},
		back() {
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
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

	.title {
		margin-top: 80rpx;
		padding-left: 64rpx;
		font-size: 40rpx;
		color: rgba(51, 51, 51, 1);
	}

	.main-box {
		margin-top: 120rpx;
		padding: 0 60rpx;
		.phone {
			display: flex;
			align-items: center;
			input {
				margin-left: 10rpx;
			}
		}
		input {
			height: 50rpx;
		}

		.string {
			height: 1px;
			margin-bottom: 48rpx;
			background: rgba(225, 225, 225, 1);
		}

		.get_code_box {
			position: relative;

			.get_code {
				position: absolute;
				top: 10rpx;
				right: 20rpx;
				z-index: 99;
				color: rgba(102, 102, 102, 1);
				font-size: 22rpx;
			}
		}

		.password {
			position: relative;

			.eye {
				position: absolute;
				z-index: 999;
				top: 9rpx;
				right: 16rpx;
				width: 52rpx;
				height: 34rpx;

				image {
					position: absolute;
					width: 52rpx;
					height: 34rpx;
					padding: 0;
				}
			}
		}
	}

	.sbumit-box {
		padding: 0 60rpx;

		.sbumit {
			height: 88rpx;
			line-height: 88rpx;
			margin-top: 130rpx;
			background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
			text-align: center;
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
}
</style>
