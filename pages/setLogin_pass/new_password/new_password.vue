<template>
	<view class="content">
		<view class="empty"></view>
		<view class="navigation" @tap="back">
			<view class="iconfont icon-arrow-lift-copy"></view>
		</view>
		<view class="title">修改登陆密码</view>
		<view class="mian">
			<view class="gain-box">
				<view class="txt">
					<image src="../../../static/images/mima.png" mode=""></image>
				</view>
				<input password v-model="password" maxlength="16" placeholder="请设置6-16位字符密码" placeholder-class="fz30" />
			</view>
			<view class="string"></view>
			<view class="gain-box mar-top">
				<view class="txt">
					<image src="../../../static/images/mima.png" mode=""></image>
				</view>
				<input password v-model="password_once" maxlength="16" placeholder="再次输入密码" placeholder-class="fz30" />
			</view>
			<view class="string"></view>
			<view class="sbumit" @tap="subumit">确定</view>
		</view>
	</view>
</template>

<script>
	let type = null
	export default {
		data() {
			return {
				password: "", // 第一次输入的密码
				password_once:"" // 再次输入的密码
			};
		},
		onLoad() {
			uni.$once("change_type1", (data) => {
				type = data.type
			})
		},
		computed: {
			verifierPassword() {
				return this.password.length > 5
			},
			// 验证密码是否相同
			verifierSame(){
				return this.password === this.password_once
			}
		},
		methods: {
			subumit() {
				if (!this.verifierPassword) {
					uni.showToast({
						title: "密码至少6位",
						icon:"none"
					})
					return
				}
				if(!this.verifierSame){
					uni.showToast({
						title:"两次密码输入不同",
						icon:"none"
					})
					return
				}
				let url = ""
				let data = {}
				if (type) {
					url = "/user/updateUserInfo";
					data.uid = this.User.userinfo.uid;
					data.password = this.password
				} else {
					url = "/user/updateTUserInfo"
					data.tid = this.User.userinfo.tid
					data.password = this.password
				}
				this.$http.post(url, data)
					.then(([err, res]) => {
						if (res.data.result === "SUCCESS") {
							uni.showToast({
								title: "修改成功",
								success: () => {
									if(type){
										uni.navigateTo({
											url: "../../personal_information/personal_information"
										})
									}else{
										uni.navigateTo({
											url:"../../technician_Iindex/technician_personal/technician_personal"
										})
									}
								}
							})
						} else {
							uni.showToast({
								title:res.data.msg,
								icon:"none"
							})
						}
					})


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

		.title {
			margin-top: 70rpx;
			margin-left: 44rpx;
			font-size: 40rpx;
			color: #333333;
			font-weight: Medium;
		}

		.mian {
			margin-top: 140rpx;
			padding: 0 75rpx;
			.mar-top{
				margin-top: 20rpx;
			}
			.gain-box {
				display: flex;
				margin-bottom: 10rpx;

				image {
					width: 40rpx;
					height: 42rpx;
					margin-left: 16rpx;
				}

				input {
					height: 50rpx;
					width: 500rpx;
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
