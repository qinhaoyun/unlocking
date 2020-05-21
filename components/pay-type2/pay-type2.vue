<template>
	<view class="content">
		<view class="mask" v-if="isShow" @tap="show"></view>
		<view class="main" :animation="animationData">
			<view class="price">
				￥<text>{{money}}</text> 
			</view>
			<view class="select-pay">
				<view class="h3">选择支付方式</view>
				<view class="balance item" @tap="pay(2)">
					<view class="left">
						<view class="iconfont icon-yue"></view>
						<view class="text">
							<view class="title">余额支付</view>
							<view class="balance-num">可用余额<text>{{balance}}</text>元</view>
						</view>
					</view>
					<view class="right circle" :class="checked === 2?'bor-checked':''">
						<view class="checked" v-show="checked === 2"></view>
					</view>
				</view>
				<view class="weixin item" @tap="pay(0)">
					<view class="left">
						<view class="iconfont icon-weixin"></view>
						<text class="title">微信</text>
					</view>
					<view class="right circle" :class="checked === 0?'bor-checked':''">
						<view class="checked" v-show="checked === 0"></view>
					</view>
				</view>
				<view class="zhifubao item" @tap="pay(1)">
					<view class="left">
						<view class="iconfont icon-zhifubao"></view>
						<text class="title">支付宝</text>
					</view>
					<view class="right circle" :class="checked === 1?'bor-checked':''">
						<view class="checked" v-show="checked === 1"></view>
					</view>
				</view>
			</view>
			<view class="go-pay" @tap="goPay">
				去支付
			</view>
		</view>
	</view>
</template>

<script>
	let payData = "";
	let coupon_id = "";
	export default {
		data() {
			return {
				checked: 0,
				animationData: {},
				isShow: false
			};
		},
		onLoad() {
			
		},
		computed:{
			
		},
		props: ["indent","money", "balance"],
		methods: {
			pay(index) {
				this.checked = index
			},
			show() {
				this.isShow = !this.isShow
				if (this.isShow) {
					var animation = uni.createAnimation({
						duration: 500,
						timingFunction: 'ease',
					})
					animation.bottom(5).step();
					this.animationData = animation.export()
				} else {
					var animation = uni.createAnimation({
						duration: 500,
						timingFunction: 'ease',
					})
					animation.bottom(-800).step();
					this.animationData = animation.export()
				}
			},
			goPay(){
				if (this.checked === 1) {
					uni.request({
						url: "https://rg.cqlaiku.com:8811/appPay/alipay",
						data: {
							uid: this.User.userinfo.uid,
							indent: this.indent,
							money:this.money
						},
						method: "POST",
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success: (res) => {
							payData = res.data
							this.zhifu(payData)
						}
					})
				}
				// 余额支付,去余额支付页面
				if (this.checked === 2) {
					uni.navigateTo({
						url: "../../pages/confirm_order/input_payment_code/input_payment_code",
						success: () => {
							uni.$emit("sendIndent_money", {
								indent: this.indent,
								money: this.money,
								iSdiff:false
							})
						}
					})
				}
				// 微信支付
				if (this.checked === 0) {
					uni.login({
						provider:"weixin",
						success: (e) => {
							this.$http.post("/appPay/wxapppay",{
								uid:this.User.userinfo.uid,
								indent:this.indent,
								money:this.money
							}).then(([err,res])=>{
								if(res.statusCode === 200){
									let data = JSON.stringify(res.data)
									uni.requestPayment({
										provider:"wxpay",
										orderInfo:data,
										success:(res)=>{
											uni.redirectTo({
												url:"../../pages/s_s_personal/s_s_personal",
												success: () => {
													uni.$emit("send_Indent",{indent: this.indent})
												}
											})
										},
										fail: function(err) {
											console.log('fail:' + JSON.stringify(err));
										}
									})
								}
							})
						},
						fail:(err)=>{
							
						}
					})
				}
			},
			// 支付宝
			zhifu(payData) {
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: payData, //支付宝订单数据
					success: (res) => {
						uni.redirectTo({
							url: "../../pages/s_s_personal/s_s_personal",
							success: () => {
								uni.$emit("send_Indent", {
									indent: this.indent
								})
							}
						})
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			},
			check_coupon(i){
				coupon_id = this.coupon[i].id
				this.check_c = i
			},
			go_coupon(){
				uni.navigateTo({
					url:"../../pages/coupon/coupon"
				})
			}
		},
		onReady() {
			
		}
	}
</script>
<style lang="less" scoped>
	.content {
		.mask {
			background: #000;
			opacity: 0.75;
			height: 100vh;
			width: 100vw;
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 1000;
		}

		.main {
			position: fixed;
			left: 10rpx;
			right: 10rpx;
			bottom: -800rpx;
			z-index: 1001;
			width: 730rpx;
			background: #FFFFFF;
			.h3 {
				line-height: 24rpx;
				padding-bottom: 34rpx;
				font-size: 24rpx;
			}
			.coupon-tit{
				display: flex;
				justify-content: space-between;
				margin-top: 40rpx;
				padding: 0 32rpx;
				text{
					font-size: 24rpx;
					line-height: 24rpx;
				}
			}
			.coupon-box{
				width: 730rpx;
				height: 160rpx;
				overflow:scroll;
				.coupon-box1{
					padding: 30rpx 0;
				}
				.bgk-red{
					background: #FF896E;
				}
				.coupon{
					display: inline-block;
					position: relative;
					padding: 0 0 0 32rpx;
					image{
						width: 210rpx;
						height: 100rpx;
					}
					.num{
						position: absolute;
						top: 20rpx;
						left: 108rpx;
						.num-money{
							font-size: 40rpx;
							line-height: 40rpx;
						}
						.unit{
							font-size: 20rpx;
						}
					}
					.color-check{
						color: red;
					}
					.deadline{
						position: absolute;
						top: 70rpx;
						left: 98rpx;
						font-size: 12rpx;
						line-height: 12rpx;
					}
				}
			}
			.select-pay {
				padding: 0 32rpx;
			}

			.price {
				text-align: center;
				font-size: 36rpx;

				text {
					margin-left: 20rpx;
					font-size: 50rpx;
				}
			}

			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 62rpx;
				margin-bottom: 50rpx;

				.iconfont {
					width: 62rpx;
					height: 62rpx;
					line-height: 62rpx;
					margin-right: 18rpx;
					font-size: 62rpx;
				}

				.icon-yue {
					color: rgba(253, 66, 34, 1);
				}

				.icon-weixin {
					color: rgba(72, 201, 49, 1);
				}

				.icon-zhifubao {
					color: rgb(2, 169, 241);
				}

				.left {
					display: flex;

					.text {
						font-size: 30rpx;
						font-weight: 500;
					}

					.balance-num {
						font-size: 24rpx;
						font-weight: 400;
					}
				}

				.circle {
					width: 32rpx;
					height: 32rpx;
					border: 1px solid rgba(167, 167, 167, 1);
					border-radius: 50%;

					.checked {
						width: 18rpx;
						height: 18rpx;
						margin: 7rpx auto;
						background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
						border-radius: 50%;
					}

					.bor-checked {
						border: 1px solid rgba(255, 40, 92, 1) !important;
					}
				}
			}

			.balance {
				.title {
					line-height: 30rpx;
				}

				.balance-num {
					line-height: 24rpx;
					margin-top: 4rpx
				}
				
			}

			.go-pay {
				height: 88rpx;
				line-height: 88rpx;
				background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
				text-align: center;
				color: #FFFFFF;
				font-size: 36rpx;
			}
		}
	}
</style>
