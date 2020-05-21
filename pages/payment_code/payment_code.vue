<template>
	<view class="content">
		<hd-nav :title="title" :rtbtn="rtbtn"></hd-nav>
		<view class="main">
			<view class="name">
				<input disabled="true" type="text" v-model="phone" placeholder="" />
			</view>
			<view class="name code">
				<input type="number" v-model="code" placeholder="验证码" />
				<view class="get-code">
					<text v-if="!showText" @click.stop="getCode">获取验证码</text>
					<text v-else><text class="c-red">{{second}}</text>秒后可重新获取</text>
				</view>
			</view>
			<view class="submit" @tap="submit">
				立即验证
			</view>
			<view class="text">设置账户支付密码,用于钱包支付,请牢记密码,不要告诉他人</view>
		</view>
	</view>
</template>

<script>
	let dataCode = null
	// 是否返回支付页
	let isback = null
	export default {
		data() {
			return {
				title: "设置支付密码",
				rtbtn: "",
				phone: "",
				code: "",
				second: 60,
				showText: false
			};
		},
		onLoad() {
			uni.$once("backpa",(data)=>{
			
				isback = data.isback
				
			})
			
			let phone = this.User.userinfo.phone
			let initio = phone.slice(0, 3);
			let end = phone.slice(7);
			this.phone = initio + "***" + end;
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
				} else {
					uni.navigateTo({
						url: "./add_payment_code/add_payment_code",
						success: () => {
							
							uni.$emit("back2",{isback2:isback})
						}
					})
				}
			},
			getCode() {
				this.request_code({
					url: "/logins/getcode",
					data: {
						phone: this.User.userinfo.phone
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
					dataCode = res.data.data
					uni.showToast({
						title: "已发送,请等待",
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
				} else {
					uni.showToast({
						title: res.data.msg,
						icon: "none"
					})
				}
			}
		}
	}
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
