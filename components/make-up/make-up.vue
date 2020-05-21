<template>
	<view class="content">
		<view class="mask" v-if="isShow" @tap="show"></view>
		<view class="main" :animation="animationData">
			<view class="h1">
				<text>{{checked?'申请退款':'补差价'}}</text>
				<view class="iconfont icon-cha rf" @tap="show"></view>
			</view>
			<view class="select">
				<view class="h3">选择方式</view>
				<view class="item" @tap="change(0)">
					<view class="left">
						<image class="iconfont" src="../../static/images/quzhifu.png" mode=""></image>
						<view class="text">
							<view class="title">去支付</view>
							<view class="balance-num">支付额外产生金额</view>
						</view>
					</view>
					<view class="right circle" :class="checked === 0?'bor-checked':''">
						<view class="checked" v-if="checked === 0"></view>
					</view>
				</view>
				<view class="item" @tap="change(1)">
					<view class="left">
						<image class="iconfont" src="../../static/images/tuikuan.png" mode=""></image>
						<view class="text">
							<view class="title">申请退款</view>
							<view class="balance-num">与技术员沟通</view>
						</view>
					</view>
					<view class="right circle" :class="checked === 1?'bor-checked':''">
						<view class="checked" v-if="checked === 1"></view>
					</view>
				</view>
			</view>
			<view class="go-pay" @tap="goPay">
				{{checked?'退款':'去支付'}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked: 0,
				isShow:false,
				animationData: {}
			}
		},
		props:["difference","indent","balance","money"],
		methods: {
			change(index) {
				this.checked = index
			},
			show(){
				this.isShow = !this.isShow
				if(this.isShow === true){
					var animation = uni.createAnimation({
						duration: 500,
						timingFunction: 'ease',
					})
					animation.bottom(5).step();
					this.animationData = animation.export()
				}else{
					var animation = uni.createAnimation({
						duration: 500,
						timingFunction: 'ease',
					})
					animation.bottom(-603).step();
					this.animationData = animation.export()
				}
				
			},
			goPay(){
				if(this.checked===0){
					uni.navigateTo({
						url:"../../pages/order_receiving/pay_difference/pay_difference",
						success: () => {
							uni.$emit("send_difference",{difference:this.difference,indent:this.indent,balance:this.balance})
						}
					})
				}
				if(this.checked===1){
					uni.showModal({
						title:"提示:",
						content:"您在再申请退款,此时退款会扣除相应的手续费!",
						success:(res)=>{
							if(res.confirm){
								console.log(this.money,this.User.userinfo.uid,this.indent)
								this.$http.post("/indent/indnetrefund",{
									money:this.money,
									uid:this.User.userinfo.uid,
									indent:this.indent
								})
								.then(([err,res])=>{
									console.log(res)
									if(res.data.result === "SUCCESS"){
										uni.showToast({
											title:"申请已发送成功"
										})
									}else{
										uni.showToast({
											title:res.data.msg,
											icon:"none"
										})
									}
								})
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.content {
		.mask {
			background: #000;
			opacity: 0.75;
			/* 兼容IE */
			filter: alpha(opacity=75);
			/*整个页面的高度，要动态获取*/
			height: 100vh;
			width: 100vw;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 1000;
		}
		.main {
			position: fixed;
			left: 10rpx;
			right: 10rpx;
			bottom: -603rpx;
			z-index: 1001;
			width: 730rpx;
			background: #FFFFFF;
			.h1 {
				width: 100%;
				height: 125rpx;
				line-height: 125rpx;
				border-bottom: 1rpx solid #E5E5E5;
				font-size: 36rpx;
				color: 33rpx;
				text-align: center;

				.iconfont {
					line-height: 125rpx;
					margin-right: 14rpx;
				}
			}

			.select {
				padding: 0 32rpx 0 24rpx;

				.h3 {
					line-height: 24rpx;
					padding-bottom: 40rpx;
					margin-top: 40rpx;
					font-size: 24rpx;
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

					.left {
						display: flex;
						align-items: center;

						.title {
							margin-top: -6rpx;
							line-height: 30rpx;
							font-size: 30rpx;
							font-weight: 600;

						}

						.balance-num {
							margin-top: 8rpx;
							line-height: 24rpx;
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
					}

					.bor-checked {
						border: 1px solid rgba(255, 40, 92, 1) !important;
					}
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
