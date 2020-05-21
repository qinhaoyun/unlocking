<template>
	<view class="content">
		<hdNav :title="title" :rtbtn="rtbtn"></hdNav>
		<view class="main">
			<view class="price">
				￥<text>{{difference}}</text>
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
	export default {
		data() {
			return {
				checked: 0,
				title:"补差价",
				rtbtn:"",
				indent:null,
				difference:null, // 差价
				balance:null // 余额
			};
		},
		onLoad() {
			uni.$once("send_difference",(data)=>{
				this.indent = data.indent
				this.difference = data.difference // 差价
				this.balance = data.balance // 余额
			})
		},
		methods: {
			pay(index) {
				this.checked = index
			},
			goPay() {
				// 支付宝支付
				if(this.checked === 1){
					uni.request({
						url:"https://rg.cqlaiku.com:8811/appPay/alipay",
						data: {
							uid:this.User.userinfo.uid,
							indent: this.indent,
							money: this.difference
						},
						method: "POST",
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						success: (res) => {
							payData = res.data
							this.zhifubao(payData)
						}
					})
				}
				// 余额支付,去余额支付页面
				if(this.checked === 2){
					uni.navigateTo({
						url:"../../confirm_order/input_payment_code/input_payment_code",
						success:()=>{
							uni.$emit("sendIndent_money",{indent:this.indent,money:this.difference,iSdiff:true})
						}
					})
				}
				// 微信支付
				if(this.checked === 0){
					uni.login({
						provider:"weixin",
						success: (e) => {
							this.$http.post("/appPay/wxapppay",{
								uid:this.User.userinfo.uid,
								indent:this.indent,
								money:this.difference
							}).then(([err,res])=>{
								if(res.statusCode === 200){
									let data = JSON.stringify(res.data)
									uni.requestPayment({
										provider:"wxpay",
										orderInfo:data,
										success:(res)=>{
											uni.redirectTo({
												url:"../order_receiving",
												success: () => {
													uni.$emit("send_indent1",{indent: this.indent})
												}
											})
										},
										fail: function(err) {
											
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
			zhifubao(payData){
				uni.requestPayment({
				    provider: 'alipay',
				    orderInfo: payData, //微信、支付宝订单数据
				    success: (res)=>{
						uni.redirectTo({
							url:"../order_receiving",
							success:()=> {
								uni.$emit("send_indent1",{indent:this.indent})
							}
						})
				    },
				    fail: function (err) {
				        
				    }
				});
			}
			
		}
	}
</script>
<style lang="less">
	page{
		background: rgb(242,243,246);
	}
	.content {
		.main {
			margin-top: 22rpx;
			padding-bottom: 22rpx;
			background: #FFFFFF;
			.h3 {
				line-height: 24rpx;
				padding-bottom: 34rpx;
				font-size: 24rpx;
			}
			.select-pay{
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

				.top-up {
					width: 120rpx;
					height: 48rpx;
					line-height: 48rpx;
					background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
					text-align: center;
					font-size: 26rpx;
					color: #FFFFFF;
				}
			}

			.go-pay {
				height: 88rpx;
				line-height: 88rpx;
				margin: 0 32rpx;
				background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
				text-align: center;
				color: #FFFFFF;
				font-size: 36rpx;
			}
		}
	}
</style>
