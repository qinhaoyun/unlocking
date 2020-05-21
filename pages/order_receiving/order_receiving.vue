<template>
	<view class="content">
		<view class="hd-box">
			<view class="hd-empty"></view>
			<view class="hd">
				<view class="nav-box">
					<view class="empty"></view>
					<view class="nav">
						<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
						<text></text>
						<view class="right"></view>
					</view>
				</view>
			</view>
			<view class="h1">
				<text>{{start1[dataArr.state][0]}}</text>
				<image class="img0" :src="start1[dataArr.state][1]" mode=""></image>
				<view class="complaint" @tap="go_complaint">
					<image src="../../static/images/tousu.png" mode=""></image>
					<text>投诉</text>
				</view>
			</view>
			<view class="order-details">
				<view class="list-box">
					<view class="li pad-top bor-none">
						<text>服务类型：</text>
						<text class="right">开锁</text>
					</view>
					<view class="li">
						<text>服务详情：</text>
						<text class="right">{{dataArr.dname}}</text>
					</view>
					<view class="li" @tap="change(0)">
						<text>下单资料</text>
						<view class="iconfont right" :class="active0?'icon-jiantoushang':'icon-jiantoushang-copy-copy'"></view>
					</view>
					<view class="order-data" :animation="animationData">
						<!-- v-if="active0" -->
						<view class="time info-box">
							<image src="../../static/images/rl.png" mode=""></image>
							<text>{{dataArr.createtime}}</text>
						</view>
						<view class="name info-box">
							<image src="../../static/images/LXR.png" mode=""></image>
							<text>{{dataArr.username}}</text>
						</view>
						<view class="phone info-box">
							<image src="../../static/images/DH.png" mode=""></image>
							<text>{{dataArr.userphone}}</text>
						</view>
						<view class="address info-box">
							<image src="../../static/images/xxdz.png" mode=""></image>
							<text>{{dataArr.addr}}</text>
						</view>
						<view class="info-box">
							<image src="../../static/images/XZ.png" mode=""></image>
							<text>{{dataArr.dname}}</text>
						</view>
						<view class="info-box">
							<image src="../../static/images/MS.png" mode=""></image>
							<text>{{dataArr.intro}}</text>
						</view>
						<view class="pic info-box">
							<image src="../../static/images/tp.png" mode=""></image>
							<view class="pic-img">
								<image :src="item" mode="" v-for="(item,index) in imgArr" :key="index"></image>
							</view>
						</view>
					</view>
					<view class="li money" @tap="change(1)" v-if="!active1">
						<text>付款金额：</text>
						<view class="right">
							<text>￥{{sum}}</text>
							<view class="iconfont icon-jiantoushang-copy-copy"></view>
						</view>
					</view>
					<view class="money-down" :class="active1?'bor-bot':''" :animation="animationData1">
						<!-- v-if="active1" -->
						<view class="top">
							<text class="title">付款总金额：</text>
							<view class="right">
								<view class="actual">
									<text class="tit">付款金额：</text>
									<text>￥{{dataArr.money?dataArr.money:''}}</text>
								</view>
								<view class="differential">
									<text class="tit">差价：</text>
									<text>￥{{dataArr.moneyTwo}}</text>
								</view>
								<view class="sum-pay">
									<view class="iconfont icon-jiantoushang" @tap="change(1)"></view>
									<text>￥{{sum?sum:''}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="li clerk-ordering">
						<text>维修人员：{{dataArr.name?dataArr.name:'未选择技术人员'}}</text>
						<text class="state right">{{dataState[dataArr.state]}}</text>
					</view>
					<view class="bottom" v-if="dataArr.state === 1 && dataArr.checkTuser">
						<view class="count-down">
							<text class="num">{{minute_end}}:{{second_end}}</text>
							<text class="tit">接单剩余时间:</text>
						</view>
						<view class="top">
							<view class="change" v-if="isChange" @tap="change_technicist">跟换</view>
							<view class="" v-else>继续等待</view>
						</view>
					</view>
				</view>
				<view class="bottom-box">
					<view class="left1" @tap="call_technician">
						<image src="../../static/images/lxjs.png" mode=""></image>
						<text>联系师傅</text>
					</view>
					<view class="right1" @tap="call_service">
						<image src="../../static/images/lxkf.png" mode=""></image>
						<text>联系客服</text>
					</view>
				</view>
			</view>
		</view>
		<view class="order-info">
			<view class="h3">订单信息</view>
			<view class="li">
				<text class="tit" v-if="dataArr.zfway">支付方式</text>
				<text>{{payType[dataArr.zfway]}}</text>
			</view>
			<view class="li">
				<text class="tit">订单编号</text>
				<text>{{dataArr.indent?dataArr.indent:''}}</text>
			</view>
			<view class="li" v-if="dataArr.starttime">
				<text class="tit">接单时间</text>
				<text>{{dataArr.starttime}}</text>
			</view>
			<view class="li" v-if="dataArr.paytime">
				<text class="tit">付款时间</text>
				<text>{{dataArr.paytime}}</text>
			</view>
			<view class="li" v-if="dataArr.createtime">
				<text class="tit">创建时间</text>
				<text>{{dataArr.createtime}}</text>
			</view>
			<view class="li" v-if="dataArr.appointment">
				<text class="tit">预约时间</text>
				<text>{{dataArr.appointment}}</text>
			</view>
			<view class="look-more" v-if="active_info" @tap="look_more">
				<text>查看更多</text>
				<view class="iconfont icon-jiantoushang-copy-copy"></view>
			</view>
			<view class="more" v-if="!active_info">
				<view class="li" v-if="dataArr.payid">
					<text class="tit">{{dataArr.zfway==3?'支付宝交易号':'微信交易号'}}</text>
					<text>{{dataArr.payid}}</text>
				</view>
				<view class="li .pad-b-20" v-if="dataArr.endtime">
					<text class="tit">师傅到达时间</text>
					<text>{{dataArr.endtime}}</text>
				</view>
			</view>
			<view class="look-more" v-if="!active_info" @tap="look_more">
				<text>收起</text>
				<view class="iconfont icon-jiantoushang"></view>
			</view>
		</view>
		<view class="cancel-order" @tap="cancel" v-if="dataArr.state === 0 || dataArr.state === 1 || dataArr.state === 5">取消订单</view>
		<view class="cancel-order" @tap="showMake" v-else-if="dataArr.state !== 9 && dataArr.state !== 10 && dataArr.state !== 11">
			{{dataArr.state===7?'补差价':'申请退款'}}
		</view>

		<make-up :balance="balance" :difference="moneyTwo" :indent="indent" :money="dataArr.money"  ref="makeShow"></make-up> 
	</view>
</template>
<script>
	import makeUp from "../../components/make-up/make-up.vue"
	export default {
		components: {
			makeUp
		},
		data() {
			return {
				dataArr: {},
				active0: false,
				active1: false,
				active_info: true, // 显示查看更多
				picArr: null,
				sum: null,
				count_dowm: [],
				Interval: [],
				showDifference: false, // 是否显示补差价
				minute_end: "00",
				second_end: "00",
				indent: "",
				isChange: false,
				imgArr: [],
				animation: null,
				animationData: null,
				animation1: null,
				animationData1: {},
				payType: {
					3: "支付宝",
					2: "微信",
					1: "钱包支付"
				},
				start1: {
					0: ["等待付款中", "../../static/images/ddfk.png"],
					1: ["等待技术员接单", "../../static/images/ddjsyjd.png"],
					2: ["进行中", "../../static/images/ddjxz.png"],
					3: ["进行中", "../../static/images/ddjxz.png"],
					4: ["已完成", "../../static/images/jdywc.png"],
					5: ["等待付款中", "../../static/images/ddfk.png"],
					7: ["进行中", "../../static/images/ddjxz.png"],
					8: ["进行中", "../../static/images/ddjxz.png"],
					9: ["退款审核中", "../../static/images/shenhe.png"],
					10: ["退款成功", "../../static/images/yituikuan.png"],
					11: "拒绝退款"
				},
				dataState: {},
				balance: null, // 用户余额
				moneyTwo: null
			};
		},
		onLoad() {
			uni.$once("send_indent1", (data) => {
				this.indent = data.indent
				this.request_orderDetails()
			})
			// 查询可用余额
			this.$http.post("/indent/quarymoney", {
					uid: this.User.userinfo.uid
				})
				.then(([err, res]) => {
				
					if (res.data.result === "SUCCESS") {
						this.balance = res.data.data
					}
				})
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.request_orderDetails()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		// 监听手机默认返回键返回
		onBackPress(e) {
			if (e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true
		},
		methods: {
			// 联系技术人员
			call_technician() {
				this.$http.post("/indent/bindnumber", {
					tel_a: this.User.userinfo.phone,  //17623113553
					tel_b: this.dataArr.phone,
					tid: this.dataArr.tid
				}).then(([err, res]) => {
					if(res.data.result === "SUCCESS"){
						uni.makePhoneCall({
							phoneNumber:res.data.data
						})
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
					}
				})
			},
			// 联系客服
			call_service() {
				uni.makePhoneCall({
				    phoneNumber: '4000001602' //客服电话号
				});
			},
			request_orderDetails() {
				if (this.indent) {
					uni.showNavigationBarLoading(); //显示加载动画
					this.$http.post("/indent/indentinfo", {
						indent: this.indent
					}).then(([err, res]) => {
						
						uni.hideNavigationBarLoading(); //关闭加载动画
						let data0 = res.data.data
						if (data0.checkTuser !== null) {
							let checkTuser = data0.checkTuser
							let bb = checkTuser.replace("-", "/")
							let aa = bb.replace("-", "/")
							this.time(aa)
						}
						// 图片字符串切割成数组
						this.imgArr = data0.img.split(",")
						this.dataArr = res.data.data

						// 总计价格,差价
						this.moneyTwo = this.dataArr.moneyTwo // 差价
						this.sum = this.dataArr.moneyTwo + this.dataArr.money
						if (this.dataArr.moneyTwo !== 0) {
							this.showDifference = true
						}
						this.dataState = {
							0: "等待支付",
							1: "等待接单",
							2: "已接单",
							3: "已到达",
							4: "已完成",
							5: "预约中",
							7: "申请补差价 " + this.moneyTwo + " 元",
							8: "差价支付完成",
							9: "申请退款",
							10: "退款成功",
							11: "拒绝退款"
						}
					})
				}
			},
			// 取消订单
			cancel() {
				this.$http.post("/indent/userdelindent", {
					indent: this.dataArr.indent
				}).then(([err, res]) => {
					if (res.data.result === "SUCCESS") {
						uni.showToast({
							title: "取消成功",
							success: () => {
								uni.navigateTo({
									url: "../order_list/order_list"
								})
							}
						})
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						})
					}
				})
			},
			// 查看更多
			look_more() {
				this.active_info = !this.active_info
			},
			// 查看下拉
			change(index) {
				if (index === 0) {
					this.active0 = !this.active0
					if (this.active0) {
						this.animation.height(224).step()
						this.animationData = this.animation.export()
					} else {
						this.animation.height(0).step()
						this.animationData = this.animation.export()
					}
				}
				if (index === 1) {
					this.active1 = !this.active1
					if (this.active1) {
						this.animation1.height(166).step()
						this.animationData1 = this.animation1.export()
					} else {
						this.animation1.height(0).step()
						this.animationData1 = this.animation1.export()
					}
				}
			},
			// 跳转到投诉页面
			go_complaint() {
				uni.navigateTo({
					url: "../complaint/complaint",
					success: () => {
						uni.$emit("complaint",{indent:this.dataArr.indent,uid:this.dataArr.uid,tid:this.dataArr.tid})
					}
				})
			},
			// 去补差价
			showMake() {
				this.$refs.makeShow.show()  // 弹出组件
			},
			back() {
				uni.navigateTo({
					url: "../order_list/order_list"
				})
			},
			// 去跟换技术人员
			change_technicist() {
				uni.navigateTo({
					url: "../s_s_personal/s_s_personal",
					success: () => {
						uni.$emit("send_Indent", {
							indent: this.indent
						})
					}
				})
			},
			time(start) {
				let startTime = new Date(start) // 开始时间
				let endTime = new Date() // 结束时间
				let difference = Math.floor(startTime - endTime + 900000)
			
				let minute = Math.floor(difference / 1000 / 60)
				let second = Math.floor(difference / 1000 % 60)
				let minute_end = '';
				let second_end = ''
				let length = this.Interval.length

				let timer = setInterval(() => {
					second -= 1
					if (second == -1) {
						second = 59
						minute -= 1
					}
					if (minute < 10) minute_end = '0' + minute
					else minute_end = minute
					if (second < 10) second_end = '0' + second
					else second_end = second
					this.count_dowm.splice(length, 1, minute_end + ':' + second_end)
					this.second_end = second_end
					this.minute_end = minute_end
					if (minute <= 0 && second <= 0) {
						clearInterval(timer)
						this.isChange = true
						this.second_end = "00"
						this.minute_end = "00"
					}
				}, 1000);
			}
		},
		onReady() {
			let animation = uni.createAnimation({
				duration: 150,
				timingFunction: "linear"
			})
			this.animation = animation

			let animation1 = uni.createAnimation({
				duration: 150,
				timingFunction: "linear"
			})
			this.animation1 = animation1
		}
	}
</script>

<style lang="less">
	page {
		background: rgb(238, 238, 238);
	}

	.content {
		.hd-box {
			padding: 0 10rpx;
			padding-bottom: 22rpx;
			background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));

			.hd-empty {
				height: 146rpx;
			}

			.nav-box {
				position: fixed;
				top: 0;
				left: 0;
				z-index: 9999;
				width: 100%;
				height: 120rpx;
				background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));

				.empty {
					height: 60rpx;
				}

				.nav {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 80rpx;
					background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));

					.iconfont {
						width: 40rpx;
						height: 40rpx;
						padding-left: 34rpx;
						color: #FFFFFF;
					}
				}
			}

			.h1 {
				display: flex;
				justify-content: space-between;
				position: relative;
				line-height: 50rpx;
				margin-top: 50rpx;
				margin-left: 35rpx;
				font-size: 50rpx;
				color: #FFFFFF;

				.img0 {
					position: absolute;
					top: -56rpx;
					left: 500rpx;
					width: 116rpx;
					height: 116rpx;
				}

				.complaint {
					display: flex;
					align-items: center;
					position: absolute;
					right: 20rpx;
					bottom: -46rpx;

					image {
						width: 24rpx;
						height: 28rpx;
						margin-right: 4rpx;
					}
				}


			}

			.order-details {
				margin-top: 45rpx;
				border-radius: 10px;
				background: #FFFFFF;

				.list-box {
					.pad-top {
						padding-top: 22rpx;
					}

					.li {
						display: flex;
						justify-content: space-between;
						align-items: center;
						height: 88rpx;
						margin: 0 10rpx 0 30rpx;
						border-top: 1px solid #E5E5E5;
						font-size: 28rpx;
						font-weight: 400;

						.right {
							margin-right: 20rpx;
						}
					}

					.bor-none {
						border: none;
					}

					.money {
						.right {
							display: flex;
							align-items: center;

							text {
								margin-right: 16rpx;
								color: #FF0000;
							}
						}
					}

					.clerk-ordering {
						.state {
							font-size: 32rpx;
						}
					}

					// 下单人资料
					.order-data {
						height: 0;
						overflow: hidden;

						.info-box {
							height: 40rpx;
							line-height: 40rpx;
							margin-left: 30rpx;
							margin-bottom: 24rpx;
							font-size: 24rpx;

							image {
								width: 40rpx;
								height: 40rpx;
								margin-right: 30rpx;
							}
						}

						.address {
							display: flex;

							text {
								display: block;
								width: 600rpx;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}
						}

						.pic {
							display: flex;

							.pic-img {
								display: flex;

								image {
									width: 70rpx;
									height: 50rpx;
									margin-right: 20rpx;
								}
							}
						}
					}

					.bor-bot {
						border-top: 1rpx solid #E5E5E5;
					}

					.money-down {
						height: 0;
						overflow: hidden;

						.top {
							display: flex;
							justify-content: space-between;
							padding-bottom: 120rpx;
						}

						.title {
							line-height: 88rpx;
							margin-left: 30rpx;
							font-size: 28rpx;
						}

						.right {
							margin-top: 24rpx;
							margin-right: 30rpx;

							.actual,
							.differential {
								display: flex;
								line-height: 60rpx;

								.tit {
									display: block;
									width: 140rpx;
								}
							}

							.sum-pay {
								display: flex;
								flex-direction: row-reverse;
								align-items: center;

								text {
									margin-right: 20rpx;
									font-weight: bold;
									color: red;
								}
							}
						}
					}

					.bottom {
						margin: 0 30rpx;
						border-top: 1rpx solid #E5E5E5;

						.top {
							display: flex;
							flex-direction: row-reverse;
							width: 100%;
							padding-bottom: 38rpx;

							.change {
								width: 82rpx;
								height: 44rpx;
								line-height: 44rpx;
								margin: 44rpx 0 0 28rpx;
								border-radius: 4px;
								text-align: center;
								background: rgba(255, 96, 60, 1);
								color: #FFFFFF;
							}
						}

						.count-down {
							display: flex;
							flex-direction: row-reverse;
							padding-top: 50rpx;
							font-size: 36rpx;
							font-weight: Regular;

							// .tit{line-height: 36rpx;}
							.num {
								line-height: 54rpx;
								margin-left: 20rpx;
								font-size: 48rpx;
							}
						}

					}
				}

				.bottom-box {
					display: flex;
					height: 92rpx;
					border-top: 1rpx solid #E5E5E5;

					.left1,
					.right1 {
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 28rpx;

						image {
							width: 36rpx;
							height: 36rpx;
							padding-right: 16rpx;
						}
						
					}

					.left1 {
						width: 49%;
						border-right: 1rpx solid #E5E5E5;
					}

					.right1 {
						width: 49%;
					}


				}

			}

		}

		.order-info {
			background: #FFFFFF;

			.h3 {

				margin-left: 42rpx;
				padding-top: 20rpx;
				font-weight: bold;
				font-size: 30rpx;

			}

			.li {
				line-height: 50rpx;
				margin-left: 40rpx;
				margin-bottom: 10rpx;
				font-size: 24rpx;

				.tit {
					margin-right: 20rpx;
				}
			}

			.pad-b-20 {
				padding-bottom: 20rpx;
			}

			.look-more {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;

				text {
					font-weight: 600;
				}

				.iconfont {
					margin-left: 4rpx;
				}
			}
		}

		.cancel-order {
			height: 88rpx;
			margin: 38rpx 28rpx 38rpx 28rpx;
			line-height: 88rpx;
			text-align: center;
			background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
			color: #FFFFFF;
		}
	}
</style>
