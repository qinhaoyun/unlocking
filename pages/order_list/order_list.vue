<template>
	<view class="content">
		<view class="hd_empty"></view>
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>订单列表</text>
					<view class="right"></view>
				</view>
			</view>
			<view class="tab">
				<view :class="active===0?'checked':''" @tap="switcher(0)">全部订单</view>
				<view :class="active===1?'checked':''" @tap="switcher(1)">进行中</view>
				<view :class="active===2?'checked':''" @tap="switcher(2)">已完成</view>
				<view :class="active===3?'checked':''" @tap="switcher(3)">未支付</view>
				<view :class="active===4?'checked':''" @tap="switcher(4)">退款</view>
			</view>
		</view>
		<view class="main">
			<!-- <scorll-view class="list-box" scroll-y="true"> -->
				<view class="list" v-for="(item,index) in orderArr" :key="index" @tap="go_receiv(item.indent)">
					<view class="top">
						<view class="order-num">订单编号：<text>{{item.indent}}</text></view>
						<view class="state">
							<text>{{state[item.state]}}</text>
							<view class="iconfont icon-gengduo"></view>
						</view>
					</view>
					<view class="info">
						<view class="left">
							<view class="lock-box">
								<text class="lock">{{item.modename}}</text>
								<text>({{item.dname}})</text>
							</view>
							<view class="timer-box">
								<text>下单时间：</text>
								<text>{{item.createtime}}</text>
							</view>
							<view class="personnel-box">
								<text>维修人员：</text>
								<text>{{item.name?item.name:''}}</text>
							</view>
						</view>
						<view class="right">
							<text>￥{{item.money}}</text>
							<view @click.stop="to_page(item.state,item.indent,item.tid,item.money,item.assess,item.checkTuser)">
								{{item.assess?'已评价':((!item.checkTuser) && (item.state === 1)?btn[12]:btn[item.state])}}</view>
						</view>
					</view>
				</view>
			<!-- </scorll-view> -->
		</view>
		<pay-type2 class="pay-type" ref="payType" :indent="indent" :money="money" :balance="balance"></pay-type2>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: 0,
				orderArr: [],
				state: {
					0: "等待付款",
					1: "等待接单",
					2: "已接单",
					3: "已到达",
					4: "已完成",
					5: "预约订单",
					6: "已评价",
					7: "补差价",
					8: "已补差价",
					9: "申请退款",
					10: "退款成功",
					11:"拒绝退款"
				},
				btn: {
					0: "去支付",
					1: "等待接单",
					2: "已接单",
					3: "已到达",
					4: "评价",
					5: "去支付",
					7: "补差价",
					8: "已补差价",
					9: "正在审核",
					10:"退款成功",
					11:"拒绝退款",
					12: "选择师傅"
				},
				indent: "",
				money: "",
				assArr: [], // 是否已评价的状态
				balance: null,
				w:null, // 可用优惠卷的张数
				coupon:[] // 优惠卷
			}
		},
		onLoad() {
			this.request_all();
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
		onPullDownRefresh() {
			switch(this.active){
				case 0:this.request_all(); // 全部
				break;
				case 1:this.request_underway(); // 进行
				break;
				case 2:this.request_complete(); //完成
				break;
				case 3:this.request_unpaid(); // 未支付
				break;
				case 4:this.request_refund(); // 退款
				break;
			}
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			// 跳转到订单详情
			go_receiv(indent) {
				uni.navigateTo({
					url: "../order_receiving/order_receiving",
					success: () => {
						uni.$emit("send_indent1", {
							indent
						})
					}
				})
			},
			// 全部订单
			request_all(){
				uni.showNavigationBarLoading(); //显示加载动画
				this.$http.post("/indent/userindentlist", {
					uid: this.User.userinfo.uid,
				}).then(([err, res]) => {
					uni.hideNavigationBarLoading(); //关闭加载动画
					if (res.data.result === "SUCCESS") {
						this.orderArr = res.data.data
					}
				})
			},
			// 进行中
			request_underway(){
				uni.showNavigationBarLoading(); //显示加载动画
				this.$http.post("/indent/userindentlist", {
					uid: this.User.userinfo.uid,
					state: "1"
				}).then(([err, res]) => {
					uni.hideNavigationBarLoading(); //关闭加载动画
					if (res.data.result === "SUCCESS") {
						this.orderArr = res.data.data
					}
				})
			},
			// 已完成
			request_complete(){
				uni.showNavigationBarLoading(); //显示加载动画
				this.$http.post("/indent/userindentlist", {
					uid: this.User.userinfo.uid,
					state: "4"
				}).then(([err, res]) => {
					uni.hideNavigationBarLoading(); //关闭加载动画
					if (res.data.result === "SUCCESS") {
						this.orderArr = res.data.data
					}
				})
			},
			//未支付
			request_unpaid(){
				uni.showNavigationBarLoading(); //显示加载动画
				this.$http.post("/indent/userindentlist", {
					uid: this.User.userinfo.uid,
					state: "0"
				}).then(([err, res]) => {
					uni.hideNavigationBarLoading(); //关闭加载动画
					if (res.data.result === "SUCCESS") {
						this.orderArr = res.data.data
					
					}
				})
			},
			// 退款
			request_refund(){
				uni.showNavigationBarLoading(); //显示加载动画
				this.$http.post("/indent/userindentlist", {
					uid: this.User.userinfo.uid,
					state: "10"
				}).then(([err, res]) => {
					uni.hideNavigationBarLoading(); //关闭加载动画
					if (res.data.result === "SUCCESS") {
						this.orderArr = res.data.data
					}
				})
			},
			// 切换渲染不同的订单状态
			switcher(index) {
				this.active = index
				if (index === 0) {
					this.request_all();
				}
				if (index === 1) {
					this.request_underway();
				}
				if (index === 2) {
					this.request_complete();
				}
				if (index === 3) {
					this.request_unpaid();
				}
				if (index === 4) {
					this.request_refund();
				}
			},
			// 监听手机默认返回键返回
			onBackPress(e) {
				if (e.from === 'navigateBack') {
					return false;
				}
				this.back();
				return true
			},
			// 返回上一页
			back() {
				uni.reLaunch({
					url: "../index/index"
				})
			},
			// 根据状态点击去评价或是付款...
			to_page(i, indent, tid, money, ass, checkTuser) {
				// 去评价
				if (i === 4) {
					if (ass == 1) {
						uni.showToast({
							title: "已经评价过了,亲!!",
							icon: "none"
						})
						return
					}
					uni.navigateTo({
						url: "../comment/comment",
						success: () => {
							uni.$emit("send_comm_info", {
								indent,
								tid
							})
						}
					})
				}
				// 去选择技术员
				if (i === 1) {
					if (!checkTuser) {
						uni.navigateTo({
							url: "../s_s_personal/s_s_personal",
							success: () => {
								uni.$emit("send_Indent", {
									indent
								})
							}
						})
					}else{
						uni.showToast({title:"订单状态:等待师傅接单",icon:"none"})
					}
				}
				// 去付款
				if (i === 0 || i === 5) {
					this.$refs.payType.show()
					this.indent = indent
					this.money = money
				}
				if(i === 2)uni.showToast({title:"订单状态:师傅已成功接单",icon:"none"})
				if(i ===3)uni.showToast({title:"订单状态:师傅已到达目的地",icon:"none"})
				if(i === 7)uni.showToast({title:"订单状态:师傅申请补差价",icon:"none"})
				if(i === 8)uni.showToast({title:"订单状态:差价已支付成功",icon:"none"})
				if(i=== 9)uni.showToast({title:"订单状态:退款申请正在审核中",icon:"none"})
				if(i=== 10)uni.showToast({title:"订单状态:申请通过,退款成功",icon:"none"})
				if(i === 11)uni.showToast({title:"订单状态:申请失败,拒绝退款",icon:"none"})
			}
		}
	}
</script>

<style lang="less">
	page {
		background: rgb(242, 243, 246);
	}

	.content {
		.hd_empty {
			height: 206rpx;
		}

		.hd {
			position: fixed;
			top: 0;
			z-index: 999;
			width: 100%;
			background: #FFFFFF;

			.nav-box {
				height: 160rpx;

				.empty {
					height: 60rpx;
				}

				.nav {
					display: flex;
					justify-content: space-between;
					height: 100rpx;
					line-height: 100rpx;

					.iconfont {
						width: 100rpx;
						height: 40rpx;
						margin-top: 30rpx;
						padding-left: 34rpx;
						line-height: 40rpx;
					}

					text {
						font-size: 36rpx;
					}

					.right {
						width: 100rpx;
						padding-right: 34rpx;
						line-height: 100rpx;
						font-size: 26rpx;
						text-align: right;
					}
				}
			}

			.tab {
				display: flex;
				justify-content: space-between;
				padding: 0 40rpx;
				font-size: 30rpx;

				view {
					height: 48rpx;
					line-height: 30rpx;
					text-align: center;
				}

				.checked {
					border-bottom: 1rpx solid rgba(255, 112, 72, 1);
					color: rgba(255, 112, 72, 1);
				}
			}
		}

		.main {
			width: 100%;
			height: 100vh - 206rpx;
			overflow-y: hidden;
			.list-box{
				height: 100vh - 20rpx - 206rpx;
			}
			.list {
				height: 324rpx;
				margin-top: 20rpx;
				padding: 0 20rpx;
				background: #FFFFFF;

				.top {
					display: flex;
					justify-content: space-between;
					height: 64rpx;
					border-bottom: 1rpx solid rgba(229, 229, 229, 1);

					.order-num {
						line-height: 64rpx;

						text {
							vertical-align: middle;
						}
					}

					.state {
						display: flex;
						align-items: center;

						.iconfont {
							margin-right: 20rpx;
							color: #999999;
						}

						text {
							margin-right: 10rpx;
						}
					}
				}

				.info {
					display: flex;
					justify-content: space-between;

					.left {
						margin-left: 38rpx;
						font-size: 28rpx;
						.lock-box {
							line-height: 32rpx;
							margin-top: 35rpx;

							.lock {
								margin-right: 40rpx;
								font-size: 32rpx;
								color: #333333;
							}
						}

						.timer-box {
							margin-top: 40rpx;
							line-height: 28rpx;
						}

						.personnel-box {
							margin-top: 36rpx;
							line-height: 28rpx;
						}

					}

					.right {
						display: flex;
						margin-right: 40rpx;
						margin-top: 186rpx;
						text {
							margin-right: 10rpx;
							font-weight: bold;
							color: #FF0000;
							font-size: 28rpx;
						}

						view {
							height: 46rpx;
							padding: 0 10rpx;
							line-height: 46rpx;
							text-align: center;
							border: 1rpx solid rgba(205, 205, 205, 1);
							border-radius: 4px;
							font-size: 28rpx;
							color: #333333;
						}
					}
				}
			}
		}

		.pay-type {
			padding: 0 32rpx;
		}
	}
</style>
