<template>
	<view class="content">
		<view class="hd">
			<view class="empty"></view>
			<view class="nav">
				<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
				<view class="title">确认订单</view>
				<view class="iconfont"></view>
			</view>
		</view>
		<view class="main">
			<view class="locktype-comment">
				<view class="comment">
					<text class="left">订单备注</text>
					<view class="right">
						<text>{{ datamsg.intro }}</text>
					</view>
				</view>
			</view>

			<view class="order-info">
				<view class="title">下单人资料</view>
				<view class="time info-box">
					<image src="../../static/images/rl.png" mode=""></image>
					<text>{{ datamsg.timer }}</text>
				</view>
				<view class="name info-box">
					<image src="../../static/images/LXR.png" mode=""></image>
					<text>{{ datamsg.username }}</text>
				</view>
				<view class="phone info-box">
					<image src="../../static/images/DH.png" mode=""></image>
					<text>{{ datamsg.phone }}</text>
				</view>
				<view class="address info-box">
					<image src="../../static/images/xxdz.png" mode=""></image>
					<text>{{ datamsg.address }}</text>
				</view>
				<view class="info-box">
					<image src="../../static/images/XZ.png" mode=""></image>
					<text>{{ datamsg.goods }}</text>
				</view>
				<view class="pic info-box">
					<image src="../../static/images/tp.png" mode=""></image>
					<view class="pic-img">
						<view class="pic-li" v-for="(item, index) in datamsg.pic" :key="index"><image class="pic" :src="item" mode=""></image></view>
					</view>
				</view>
			</view>
			<view class="agreement">
				<image v-if="agreement_checked" src="../../static/images/tongyi.png" mode="" @tap="agreement"></image>
				<view v-else class="no-checked" @tap="agreement"></view>
				<text @tap="go_agreement">
					已阅读并同意协议
					<text class="color-b">《订单服务协议》</text>
				</text>
			</view>
			<view class="price-box">
				<text class="price">
					￥
					<text class="price-num">{{ datamsg.pri }}</text>
				</text>
				<view class="predict">预计金额?</view>
			</view>
			<view class="next" @tap="popup_pay">提交订单</view>
		</view>
		<pay-type ref="payType" :balance="balance" :money="money" :w="w" :coupon="coupon" :orderData="orderData"></pay-type>
	</view>
</template>
<script>
let orderdata = null;

export default {
	data() {
		return {
			// datamsg: {},
			datamsg: {},
			indent: '',
			money: null,
			balance: null, // 用户钱包可用余额
			picstr: '',
			coupon: [],
			w: null, // 优惠卷的张数用于计算优惠卷box的宽度
			isSend: false, // // 监听订单是否提交
			orderData: {},
			agreement_checked: true
		};
	},
	onLoad() {
		uni.$once('sendOderInfo', data => {
			this.datamsg = data.inputinfo;
			this.money = data.inputinfo.pri;
			orderdata = data.orderdata;
		});
		// 查询可用余额
		this.$http.post('/indent/quarymoney', { uid: this.User.userinfo.uid }).then(([err, res]) => {
			if (res.data.result === 'SUCCESS') {
				this.balance = res.data.data;
			}
		});
		// 查询可用优惠卷
		this.$http
			.post('/indent/selectcoupon', {
				uid: this.User.userinfo.uid,
				state: 0
			})
			.then(([err, res]) => {
				if (res.data.result === 'SUCCESS') {
					this.coupon = res.data.data;

					this.w = res.data.data.length;
				}
			});
	},
	methods: {
		// 跳转到计费规则页面
		go_pre() {
			uni.navigateTo({
				url: '../index/predict_rule/predict_rule'
			});
		},
		// 协议页面
		go_agreement() {
			uni.navigateTo({
				url: '../agreement/agreement'
			});
		},
		agreement() {
			this.agreement_checked = !this.agreement_checked;
		},
		// 下一步,拉起支付
		popup_pay() {
			if (!this.agreement_checked) return uni.showToast({ title: '请仔细阅读协议,并勾选~', icon: 'none' });
			// 上传图片
			if (this.datamsg.pic.length !== 0) {
				let imgs = this.datamsg.pic.map((value, index) => {
					return {
						name: 'image' + index,
						uri: value
					};
				});
				uni.showLoading({
					title: '提交中...',
					mask: true
				});
				uni.uploadFile({
					url: 'http://rg.cqlaiku.com:8811/logins/upload',
					files: imgs,
					fileType: 'image',
					formData: {},
					success: res => {
						const data = JSON.parse(res.data);
						uni.hideLoading();
						if (data.result === 'SUCCESS') {
							let picObj = data.data;
							let picStr = [];
							for (let key in picObj) {
								picStr.push(picObj[key]);
							}
							this.picstr = picStr;
							this.request_PlaceOrder();
						} else {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							});
						}
					}
				});
			} else {
				this.request_PlaceOrder();
			}
		},
		request_PlaceOrder() {
			orderdata.img = this.picstr;
			this.orderData = orderdata;
			this.$refs.payType.show();
			// uni.request({
			// 	url: 'http://rg.cqlaiku.com:8811/indent/setIndent',
			// 	data,
			// 	method: 'POST',
			// 	header: {
			// 		'Content-Type': 'application/x-www-form-urlencoded'
			// 	},
			// 	success: res => {
			// 		if (res.data.result === 'SUCCESS') {
			// 			this.isSend = true; // 订单已提交
			// 			this.indent = res.data.data.indent;
			//
			// 		}
			// 	}
			// });
		},
		back() {
			// 判断订单提交了,退出支付页面时,提醒是否退出
			uni.navigateBack({
				delta: 1
			});
		}
	},
	onBackPress(e) {
		if (e.from === 'navigateBack') {
			return false;
		}
		this.back();
		return true;
	}
};
</script>

<style lang="less" scoped>
page {
	background: rgb(238, 238, 238);
}

.content {
	.hd {
		height: 130rpx;
		background: #ffffff;

		.empty {
			height: 64rpx;
		}

		.nav {
			display: flex;
			justify-content: space-between;

			.iconfont {
				display: flex;
				align-items: center;
				width: 40rpx;
				padding: 0 30rpx;
			}

			.title {
				font-size: 36rpx;
				color: rgba(51, 51, 51, 1);
			}
		}
	}

	.main {
		padding: 0 32rpx;
		background: rgb(238, 238, 238);

		.locktype-comment {
			padding-top: 15rpx;

			.comment {
				display: flex;
				justify-content: space-between;
				height: 88rpx;
				line-height: 88rpx;
				margin-bottom: 1px;
				background: #ffffff;
				font-size: 28rpx;

				.left {
					width: 120rpx;
					margin-left: 10rpx;
				}

				.right {
					display: flex;
					align-items: center;
					width: 540rpx;
					height: 88rpx;
					margin-right: 10rpx;
					line-height: 26rpx;
					font-size: 24rpx;
					color: rgba(153, 153, 153, 1);

					text {
						margin-right: 10rpx;
					}
				}
			}
		}

		.order-info {
			margin-top: 42rpx;

			.title {
				font-size: 22rpx;
				margin-left: 10rpx;
			}
		}

		.order-info {
			.address {
				text {
					width: 600rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
			.info-box {
				display: flex;
				height: 88rpx;
				line-height: 88rpx;
				margin-bottom: 1px;
				background: #ffffff;
				font-size: 28rpx;

				image {
					width: 40rpx;
					height: 40rpx;
					margin: 24rpx 14rpx 0 10rpx;
				}

				.pic-img {
					display: flex;
					align-items: center;
					.pic {
						height: 70rpx;
						width: 100rpx;
						line-height: 88rpx;
						margin: 0 0 0 4rpx;
					}
				}
			}
		}

		.hint {
			font-size: 18rpx;

			text {
				border-bottom: 1rpx solid red;
				color: red;
			}
		}

		.agreement {
			text-align: center;
			image {
				width: 40rpx;
				height: 40rpx;
				margin-left: -6rpx;
				vertical-align: middle;
			}

			text {
				font-size: 22rpx;
			}
			.no-checked {
				display: inline-block;
				width: 21rpx;
				height: 21rpx;
				margin-right: 8rpx;
				border-radius: 50%;
				border: 1rpx solid rgb(255, 68, 95);
				vertical-align: middle;
			}
		}

		.price-box {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 170rpx;
			line-height: 52rpx;

			.price {
				font-size: 26rpx;

				.price-num {
					margin-right: 10rpx;
					font-size: 52rpx;
				}
			}

			.predict {
				width: 78rpx;
				height: 22rpx;
				line-height: 22rpx;
				margin-top: 6rpx;
				border: 1px solid rgba(167, 167, 167, 1);
				font-size: 14rpx;
				color: red;
				text-align: center;
			}
		}

		.next {
			height: 88rpx;
			line-height: 88rpx;
			margin-top: 58rpx;
			background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
			text-align: center;
			color: #ffffff;
			font-size: 36rpx;
		}
	}
}
</style>
