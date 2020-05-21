<template>
	<view class="content" @touchstart="openstart" @touchend="openend">
		<view class="hd-empty"></view>
		<view class="hd">
			<image class="h_bgd" src="../../static/images/hd_bgd.png" mode=""></image>
			<view class="top">
				<view class="empty"></view>
				<view class="my_logo">
					<view class="my" @tap="open_broadside"><image class="my_img" src="../../static/images/my.png" mode=""></image></view>
					<view class="hd_logo">
						<image src="../../static/images/h_logo.png" mode=""></image>
						<text>{{ user.name }}</text>
					</view>
					<view class="my_logo_empty"></view>
				</view>
			</view>
			<view class="tab">
				<view class="item" :class="active === 0 ? 'bor-bot' : ''" @tap="changeTab(0)">全部订单</view>
				<view class="item" :class="active === 1 ? 'bor-bot' : ''" @tap="changeTab(1)">代接订单({{ djlength }})</view>
				<view class="item" :class="active === 2 ? 'bor-bot' : ''" @tap="changeTab(2)">进行中({{ jinxinlength }})</view>
				<view class="item" :class="active === 3 ? 'bor-bot' : ''" @tap="changeTab(3)">已完成</view>
				<view class="item" :class="active === 4 ? 'bor-bot' : ''" @tap="changeTab(4)">异常订单</view>
			</view>
		</view>
		<view class="main">
			<view class="list">
				<view class="li" v-for="(item, index) in oderdata" :key="index" @tap="go_details(item.indent)">
					<view class="top">
						<view class="left">
							<image class="top-icon" src="../../static/images/xx.png" mode=""></image>
							<text class="time">{{ item.createtime }}</text>
						</view>
						<view class="right">
							<text class="color-f5" v-if="(item.state === 1 || item.state === 2) && item.appointment">
								{{ item.show ? '超时:' + item.timer : '距离上门剩时间:' + item.timer }}{{ item.units
								}}{{ item.units === '天' ? '>' : item.units === '小时' ? '>' : '' }}
							</text>
							<text v-else>{{ dataState[item.state] }}</text>
							<view class="iconfont icon-gengduo1"></view>
						</view>
					</view>
					<view class="category">
						<image :src="item.modeimg" mode=""></image>
						<text>{{ item.modename }}-{{ item.dname }}</text>
					</view>
					<view class="address">
						<view class="left">
							<image src="../../static/images/xxdz.png" mode=""></image>
							<text>{{ item.addr }}</text>
						</view>
						<view class="priec">￥{{ item.money }}</view>
					</view>
				</view>
			</view>
		</view>
		<tecSidebar :userinfo="userinfo" ref="sidebar"></tecSidebar>
	</view>
</template>

<script>
import tecSidebar from "../../components/tec_sidebar/tec_sidebar.vue"
export default {
	components: {
		tecSidebar
	},
	data() {
		return {
			active: 0,
			Spagex: null,
			Epagex: null,
			animationData: {},
			animation: null,
			animationDataLock: {},
			animationLock: null,
			opacity: false,
			oderdata: null, // 渲染列表
			djnum: 0,
			data0: null,
			data1: null,
			data2: null,
			data3: null,
			data4:null,
			active_time: false,
			jinxinlength: "",
			djlength: "",
			userinfo: null,
			dataState: {
				0: "等待支付",
				1: "等待接单",
				2: "已接单",
				3: "已到达",
				4: "已完成",
				7: "申请补差价",
				8: "补差价成功",
				9: "申请退款",
				10: "退款成功",
				11: "拒绝退款"
			}
		};
	},
	onLoad() {
		this.request_all(); // 全部
		this.request_await(); // 代接
		this.request_underway(); //进行中
		this.request_complete(); // 已完成
		this.request_unusual(); // 异常
		uni.$once("send_active",(data)=>{
			this.active = data.active
		})
		// 获取技术员信息
		uni.getStorage({
			key: "userinfo",
			success: (res) => {
				this.userinfo = res.data
			}
		})
	},
	// 下拉刷新
	onPullDownRefresh() {
		switch(this.active){
			case 0:this.request_all();
			break;
			case 1:this.request_await();
			break;
			case 2:this.request_underway();
			break;
			case 3:this.request_complete();
			break;
			case 4:this.request_unusual();
			break;
		}
		setTimeout(()=> {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	computed:{

	},
	methods: {
		// 全部订单
		request_all(){
			uni.showNavigationBarLoading(); //显示加载动画
			this.$http.post("/indent/tuserindentlist", {
				tid: this.User.userinfo.tid,
				state: ""
			}).then(([err, res]) => {
				uni.hideNavigationBarLoading(); //关闭加载动画
				if (res.data.result === "SUCCESS") {
					// 传入方法计算出时间添加在对象里面然后返回
					this.data0 = this.countTime(res.data.data)
					this.oderdata = this.data0
				} else {
					uni.uni.showToast({
						title: res.data.msg,
						icon: "none"
					});
				}
			})
		},
		//代接订单
		request_await(){
			this.$http.post("/indent/tuserindentlist", {
				tid: this.User.userinfo.tid,
				state: "1"
			}).then(([err, res]) => {
			
				if (res.data.result === "SUCCESS") {
					// 代接订单的条数
					this.djlength = res.data.data.length + "";
			
					// 传入方法计算出时间添加在对象里面然后返回
					this.data1 = this.countTime(res.data.data)
				} else {
					uni.uni.showToast({
						title: res.data.msg,
						icon: "none"
					});
				}
			})
		},
		// 进行中
		request_underway(){
			this.$http.post("/indent/tuserindentlist", {
				tid: this.User.userinfo.tid,
				state: "2"
			}).then(([err, res]) => {
			
				if (res.data.result === "SUCCESS") {
					// 进行中的条数
					this.jinxinlength = res.data.data.length + ""
					// 传入方法计算出时间添加在对象里面然后返回
					this.data2 = this.countTime(res.data.data)
				} else {
					uni.uni.showToast({
						title: res.data.msg,
						icon: "none"
					});
				}
			})
		},
		// 已完成
		request_complete(){
			this.$http.post("/indent/tuserindentlist", {
				tid: this.User.userinfo.tid,
				state: "4"
			}).then(([err, res]) => {
				if (res.data.result === "SUCCESS") {
					// 已完成不存在预约剩余或超时,所以直接赋值
					this.data3 = res.data.data
				} else {
					uni.uni.showToast({
						title: res.data.msg,
						icon: "none"
					});
				}
			})
		},
		// 投诉异常订单
		request_unusual(){
			this.$http.post("/indent/selectabnormal",{
				tid:this.User.userinfo.tid
			}).then(([err,res])=>{
				if(res.data.result === "SUCCESS"){
					this.data4 = res.data.data
				}else{
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
				}
			})
		},
		// 计算预约时间的方法
		countTime(datatem){
			datatem.forEach((item, index) => {
				if (item.appointment !== null) {
					let appointment = item.appointment
					let bb = appointment.replace("-", "/")
					let aa = bb.replace("-", "/")
					let startTime = new Date() // 开始时间
					let endtime = new Date(aa) //未来的时间

					let difference = Math.floor(endtime - startTime)
					let day = Math.floor(difference / 1000 / 60 / 60 / 24)

					let hour = Math.floor(difference / 1000 / 60 / 60)

					let minute = Math.floor(difference / 1000 / 60)

					// 根据时间挫判断是否超时
					if(difference>0){
						if (day > 0) {
							item.timer = day
							item.show = false
							item.units = "天"
						} else if (hour > 0) {
							item.timer = hour
							item.show = false
							item.units = "小时"
						} else if (minute > 0) {
							item.timer = minute
							item.show = false
							item.units = "分"
						}
					}else{
						if(-minute >0 && -minute <60){
							item.timer = -minute
							item.show = true
							item.units = "分"
						}else if(-hour < 23 && -hour > 1){
							item.timer = -hour
							item.show = true
							item.units = "小时"
						}else{
							item.timer = -day
							item.show = true;
							item.units = "天"
						}
					}
				}
			})
			return datatem;
		},
		// 点击选择tab
		changeTab(i) {
			this.active = i
			if (i === 0) {
				this.oderdata = this.data0
			}
			if (i === 1) {
				this.oderdata = this.data1
			}
			if (i === 2) {
				this.oderdata = this.data2
			}
			if (i === 3) {
				this.oderdata = this.data3
			}
			if(i === 4){
				this.oderdata = this.data4
			}
		},
		open_broadside() {
			this.$refs.sidebar.open_broadside()
		},
		// 滑动 打开测边栏
		openstart(e) {
			// 获取鼠标点击的开始x轴坐标
			this.Spagex = e.changedTouches[0].pageX
		},
		openend(e) {
			// 获取鼠标点击结束的的时候的x轴坐标
			this.Epagex = e.changedTouches[0].pageX
			// 开始结束的差值
			let value = this.Epagex - this.Spagex
			// 如果差值大于50 就执行动画
			if (value > 100) {
				this.$refs.sidebar.open()
			}
		},
		go_details(indent) {
			uni.navigateTo({
				url: "./orderDetails/orderDetails",
				success: () => {
					uni.$emit("tec_sendindent", {
						indent,
						active:this.active
					})
				}
			})
		}
	},
	onReady() {


		// 调用动画,获取animation
		var animation = uni.createAnimation({
			duration: 300,
			timingFunction: 'ease',
		})
		// 存入data
		this.animation = animation

		var animationLock = uni.createAnimation({
			duration: 300,
			timingFunction: 'ease'
		})
		this.animationLock = animationLock
		this.animationLock.scale(0.2).step()
		this.animationDataLock = this.animationLock.export()
	}
}
</script>

<style lang="less">
page {
	background: rgb(238, 238, 238);
}

.content {
	.hd-empty {
		height: 240rpx;
	}

	.hd {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 240rpx;

		.h_bgd {
			position: absolute;
			top: 0;
			left: 0;
			z-index: -999;
			width: 100%;
			height: 240rpx;
			vertical-align: middle;
		}

		.top {
			height: 128rpx;

			.empty {
				height: 42rpx;
			}

			.my_logo {
				display: flex;
				justify-content: space-between;
				height: 86rpx;

				.my {
					display: flex;
					align-items: center;
					padding-left: 40rpx;
					line-height: 96rpx;

					.my_img {
						width: 42rpx;
						height: 40rpx;
					}
				}

				.hd_logo {
					line-height: 86rpx;
					font-size: 38rpx;

					image {
						width: 72rpx;
						height: 70rpx;
						vertical-align: middle;
					}
				}

				.my_logo_empty {
					width: 38rpx;
					padding-right: 40rpx;
				}
			}
		}

		.tab {
			display: flex;
			justify-content: space-between;
			padding: 20rpx 20rpx 0 20rpx;

			.item {
				height: 70rpx;
				line-height: 70rpx;
				font-size: 30rpx;
				color: #000000;
				font-weight: 400;
			}

			.bor-bot {
				border-bottom: 1rpx solid;
				color: #ffffff;
			}
		}
	}

	.main {
		.li {
			margin-top: 20rpx;
			background: #ffffff;

			.top {
				display: flex;
				justify-content: space-between;
				margin: 0 20rpx;
				padding-top: 20rpx;
				border-bottom: 1rpx solid #e5e5e5;

				.left {
					font-size: 28rpx;

					.top-icon {
						width: 40rpx;
						height: 40rpx;
						margin: 0 22rpx;
					}
				}

				.right {
					display: flex;
					align-items: center;

					text {
						margin-right: 10rpx;
						font-size: 22rpx;
					}

					.iconfont {
						padding-right: 24rpx;
						color: #999999;
					}
				}
			}

			.category {
				margin-top: 40rpx;

				image {
					width: 50rpx;
					height: 50rpx;
					margin: 0 6rpx 0 42rpx;
				}

				text {
					line-height: 50rpx;
					font-size: 28rpx;
					font-weight: 400;
				}
			}

			.address {
				display: flex;
				justify-content: space-between;
				margin-top: 28rpx;
				padding-bottom: 40rpx;

				.left {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;

					image {
						width: 50rpx;
						height: 50rpx;
						margin: 0 6rpx 0 42rpx;
					}

					text {
						width: 500rpx;
						font-size: 28rpx;
						vertical-align: bottom;
					}
				}

				.priec {
					margin-right: 44rpx;
					color: #ff0000;
					font-weight: bold;
					font-size: 28rpx;
				}
			}
		}
	}

	.color-f0 {
		color: #ff0000;
	}

	.color-f5 {
		color: #ff5400;
	}
}
</style>
