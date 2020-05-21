<template>
	<view class="content">
		<view class="empty"></view>
		<view class="navigation" @tap="back">
			<view class="iconfont icon-arrow-lift-copy"></view>
		</view>
		<view class="title">设置登陆密码</view>
		<view class="mian">
			<view class="gain-box">
				<view class="txt">

				</view>
				<input type="text" disabled="true" v-model="account" placeholder="" />
			</view>
			<view class="string"></view>
			<view class="sbumit" @tap="get_code">获取验证码</view>
		</view>
	</view>
</template>

<script>
	let type = null
	export default {
		data() {
			return {
				account: ""
			};
		},
		onLoad() {
			uni.$once("change_type",(data)=>{
				type = data.type
			})
			let userinfo = uni.getStorageSync("userinfo");
			let phone = userinfo.phone;
			let initio = phone.slice(0, 3);
			let end = phone.slice(7);
			this.account = initio + "***" + end;
		},
		computed: {

		},
		methods: {
			get_code() {
				this.$http.post("/logins/getcode", {
					phone: uni.getStorageSync("userinfo").phone
				}).then(([err, res]) => {
					if (res.data.result === "SUCCESS") {
						let code = res.data.data
						uni.navigateTo({
							url: "./import_code/import_code",
							success: () => {
								uni.$emit("sendcoed", {
									data: code,
									type
								})
							}
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
