<template>
	<view class="content">
		<hd-nav :title="title" :rtbtn="rtbtn"></hd-nav>
		<view class="main">
			<view class="name"><input type="number" maxlength="6" v-model="password" placeholder="输密码6位数密码" /></view>
			<view class="submit" @tap="submit">确认</view>
			<view class="text">设置账户支付密码,用于钱包支付,请牢记密码,不要告诉他人</view>
		</view>
	</view>
</template>

<script>
let isback2 = null;
export default {
	data() {
		return {
			title: '支付密码',
			rtbtn: '',
			password: '',
			password_once: ''
		};
	},
	onLoad() {
		uni.$once('back2', data => {
			isback2 = data.isback2;
		});
	},
	computed: {
		verPassword() {
			return this.password.length === 6;
		},
		verPassword_same() {
			return this.password === this.password_once;
		}
	},
	methods: {
		submit() {
			if (!this.verPassword) {
				uni.showToast({
					title: '密码长度为6位',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '发送中...',
				mask: true
			});
			this.$http
				.post('/user/updatepaypassword', {
					uid: this.User.userinfo.uid,
					password: this.password
				})
				.then(([err, res]) => {
					uni.hideLoading();
					if (res.data.result === 'SUCCESS') {
						this.$http.post('/user/selectUserInfo', { uid: this.User.userinfo.uid }).then(([err, res]) => {
							if ((res.data.result = 'SUCCESS')) {
								console.log(res);
								uni.showToast({
									title: '成功',
									duration:500,
									success: () => {
										uni.setStorageSync('userinfo', res.data.data);
										setTimeout(function() {
											if (isback2) {
												uni.navigateBack({
													delta: 2
												});
											} else {
												uni.navigateTo({
													url: '../../personal_information/personal_information'
												});
											}
										}, 500);
									}
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
		}
	}
};
</script>

<style lang="less">
page {
	background: rgb(238, 238, 238);
}

.content {
	.main {
		margin-top: 22rpx;

		.name {
			height: 88rpx;
			line-height: 88rpx;
			color: #999999;
			font-size: 30rpx;
			background: #ffffff;

			input {
				height: 88rpx;
				margin-left: 20rpx;
			}
		}

		.submit {
			height: 88rpx;
			line-height: 88rpx;
			margin: 40rpx 50rpx 0 50rpx;
			background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
			text-align: center;
			color: #ffffff;
		}

		.text {
			width: 505rpx;
			height: 43rpx;
			line-height: 24rpx;
			margin: 22rpx auto;
			font-size: 20rpx;
			font-weight: 300;
			color: rgba(51, 51, 51, 1);
		}
	}
}
</style>
