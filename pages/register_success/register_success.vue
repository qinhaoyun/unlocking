<template>
	<view class="content">
		<view class="empty"></view>
		<view class="navigation" @tap="back"><view class="iconfont icon-arrow-lift-copy"></view></view>
		<view class="title">注册成功</view>
		<view class="main">
			<view class="input">
				<input type="text" v-model="password1" maxlength="16" placeholder="请输入6-16位字符" placeholder-class="pla" />
				<text>设置密码</text>
			</view>
			<view class="input">
				<input type="text" v-model="password2" maxlength="16" placeholder="请在输入一次" placeholder-class="pla" />
				<text>确认密码</text>
			</view>
			<view class="sbumit-box">
				<view class="sbumit" @tap="sbumit"><text>登录</text></view>
			</view>
		</view>
		<view class="agreement" @tap="go_agreement">
			<image src="../../static/images/tongyi.png" mode=""></image>
			<text>已阅读并同意协议</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			account: '',
			password1: '',
			password2: ''
		};
	},
	onLoad() {
		// 监听拿到手机号码
		uni.$once('postphone', data => {
			this.account = data.phone;
		});
	},
	methods: {
		// 跳转到协议页面
		go_agreement() {
			uni.navigateTo({
				url: '../agreement/agreement'
			});
		},
		// 提交事件
		sbumit() {
			if (this.password1 === this.password2 && this.password1.length > 5) {
				this.User.login({ url: '/logins/updatepw', data: { phone: this.account, password: this.password1 }, type: true });
			} else {
				uni.showToast({
					title: '两次密码输入不一致',
					icon: 'none'
				});
			}
		},
		back() {
			uni.navigateBack({
				delta: 1
			});
		}
	},
	onUnload() {
		// 解除事件监听器
		uni.$off('postphone');
	}
};
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

	.title {
		padding: 0 46rpx;
		margin-top: 73rpx;
		color: rgba(51, 51, 51, 1);
		font-size: 40rpx;
	}

	.main {
		padding: 0 46rpx;
		margin-top: 112rpx;

		.input {
			position: relative;
			margin-bottom: 60rpx;

			input {
				height: 60rpx;
				padding: 0;
				border-bottom: 1px solid rgba(225, 225, 225, 1);
				text-indent: 173rpx;
			}

			text {
				position: absolute;
				left: 0;
				top: 6rpx;
				font-size: 30rpx;
				color: rgba(51, 51, 51, 1);
			}

			.pla {
				text-indent: 173rpx;
				line-height: 60rpx;
				vertical-align: top;
				font-size: 30rpx;
			}
		}

		.sbumit-box {
			padding-top: 33rpx;

			.sbumit {
				height: 88rpx;
				line-height: 88rpx;
				background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
				text-align: center;
				font-size: 40rpx;
				color: #ffffff;
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
			vertical-align: middle;
		}

		text {
			font-size: 22rpx;
			vertical-align: middle;
		}
	}
}
</style>
