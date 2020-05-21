<template>
	<view class="content" v-if="isshow">
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>订单详情</text>
					<view class="right"></view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="li-top">
				<view class="left">
					<image src="../../../static/images/LXR.png" mode=""></image>
					<text>姓名:</text>
				</view>
				<text class="right">{{dataObj.username}}</text>
			</view>
			<view class="li-top mar-t-1">
				<view class="left">
					<image src="../../../static/images/DH.png" mode=""></image>
					<text>电话:</text>
				</view>
				<text class="right">{{dataObj.userphone}}</text>
			</view>
			<view class="li li-one mar-t-20">
				<text>订单编号：{{dataObj.indent}}</text>
				<view class="right" @tap="call_client">
					<image src="../../../static/images/lxjs.png" mode=""></image>
					<text>联系用户</text>
				</view>
			</view>
			<view class="li">
				<image src="../../../static/images/0suo.png" mode=""></image>
				<text>{{dataObj.modename}}</text>
			</view>
			<view class="li">
				<image src="" mode=""></image>
				<text>{{dataObj.dname}}{{dataObj.modename}}</text>
			</view>
			<view class="li li-des">
				<view class="left">
					<image src="../../../static/images/MS.png" mode=""></image>
					<text>故障描述:</text>
				</view>
				<view class="des">
					{{dataObj.intro}}
				</view>
			</view>
			<view class="li li-des" v-if="dataObj.reason">
				<view class="left">
					<image src="../../../static/images/MS.png" mode=""></image>
					<text>用户投诉:</text>
				</view>
				<view class="des">
					{{dataObj.reason}}
				</view>
			</view>
			<view class="li li-des" v-if="dataObj.describe">
				<view class="left">
					<image src="../../../static/images/MS.png" mode=""></image>
					<text>异常详情:</text>
				</view>
				<view class="des">
					{{dataObj.describe}}
				</view>
			</view>
			<view class="li">
				<image src="../../../static/images/xxdz.png" mode=""></image>
				<text>{{dataObj.addr}}</text>
			</view>
			<view class="li li-left" v-if="dataObj.appointment">
				<view class="left">
					<image src="../../../static/images/rl.png" mode=""></image>
					<text>预约时间:</text>
				</view>
				<text class="right">{{dataObj.appointment}}</text>
			</view>
			<view class="li">
				<view class="left">
					<image src="../../../static/images/tp.png" mode=""></image>
					<text>照片:</text>
				</view>
				<view class="pic">
					<image :src="item" mode="" v-for="(item,index) in picarr" :key="index" @tap="preview(index)"></image>
				</view>
			</view>
			<view class="li li-left" v-if="dataObj.starttime">
				<view class="left" >
					<image src="../../../static/images/jd.png" mode=""></image>
					<text>接单时间:</text>
				</view>
				<text class="right">{{dataObj.starttime}}</text>
			</view>
			<view class="li li-left">
				<view class="left">
					<image src="../../../static/images/je.png" mode=""></image>
					<text>金额:</text>
				</view>
				<text class="right col-ff0">￥{{dataObj.money}}</text>
			</view>
			<view class="li li-left" v-if="dataObj.state === 7">
				<view class="left">
					<image src="../../../static/images/je.png" mode=""></image>
					<text>差价:</text>
				</view>
				<text class="right col-ff0">￥{{dataObj.moneyTwo}}</text>
			</view>
			<view class="li li-last">
				<text class="left">状态:</text>
				<text class="right">{{state[dataObj.state]}}</text>
			</view>
		</view>
		<view class="btn1">
			<view class="order-receiving" @tap="event(0)" v-if="dataObj.state == 1">  
				接单
			</view>
			<view class="order-receiving" @tap="event(1)" v-if="dataObj.state == 2">  
				到达目的地
			</view>
		</view>
		<view class="btn2" v-if="dataObj.state === 3 || dataObj.state === 7 || dataObj.state === 8">
			<view class="difference item" @tap="event(2)" v-if="dataObj.state === 3">
				补差价
			</view>
			<view class="done item" @tap="event(3)" v-if="dataObj.state !== 7">
				已完成
			</view>
		</view>
		<image class="pic-seal" src="../../../static/images/wancheng.png" mode="" v-if="dataObj.state == 4"></image>
		
	</view>
</template>

<script>
	let active = null;
	export default {
		data() {
			return {
				dataObj: null,
				state: {
					0: "未支付",
					1: "等待接单",
					2: "已接单",
					3: "已到达",
					4: "已完成",
					5: "预约",
					6: "已评价",
					7: "申请补差价",
					8: "补差价成功",
					9: "申请退款",
					10:"退款成功",
					11:"拒绝退款"
				}, // 状态
				isshow:false,
				picarr:[],
				dataabc:null // 没处理过的数据
			}
		},
		onLoad() {
			uni.$once("tec_sendindent", (data) => {
				let indent = data.indent
				active = data.active
				if (indent) {
					this.request(indent)
				}
			})

		},
		methods: {
			// 返回的订单详细
			async request(indent){
				uni.showLoading({
					title:"加载中...",
					mask: true
				})
				let [err,res] = await this.$http.post("/indent/indentinfo", {
					indent
				})
			
				uni.hideLoading();
				this.isshow = true
				if (res.data.result === "SUCCESS") {
					this.dataabc = JSON.stringify(res.data.data) // 没处理过的数据
					let data0 = res.data.data
					// 截取隐藏用户电话,姓名
					let name = data0.username.slice(0, 1)
					if (data0.username.length === 3) {
						data0.username = name + "**"
					}
					if (data0.username.length === 2) {
						data0.username = name + "*"
					}
					let phone1 = data0.userphone.slice(0, 3)
					let phone2 = data0.userphone.slice(7)
					data0.userphone = phone1 + "****" + phone2
					this.dataObj = data0
					this.picarr = res.data.data.img.split(",")
				}else{
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
				}
			},
			preview(index){
				uni.previewImage({
					current:index,
					urls:this.picarr,
					indicator:"default",
					success: (res) => {
						
					},
					fail: (err) => {
						
					}
				})
			},
			// 联系客户
			call_client(){
				let phone = JSON.parse(this.dataabc).phone;
				let userphone = JSON.parse(this.dataabc).userphone
				
				this.$http.post("/indent/bindnumber", {
					tel_a: phone, // 师傅电话
					tel_b: userphone // 用户电话
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
			/**
			 * 接单
			 */
			event(i){
				// 点击接单
				if(i===0){
					this.$http.post("/indent/tuseragree",{
						indent:this.dataObj.indent
					}).then(([err,res])=>{
						if(res.data.result === "SUCCESS"){
							uni.showToast({
								title:"接单成功",
								success:()=>{
									this.refresh()  // 执行方法再次请求数据刷新状态
								}
							})
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:"none"
							})
						}
					})
				}
				// 点击已到达
				if(i===1){
					this.$http.post("/indent/tuserarrive",{
						indent:this.dataObj.indent
					}).then(([err,res])=>{
						if(res.data.result === "SUCCESS"){
							if(res.data.result === "SUCCESS"){
								uni.showToast({
									title:"成功",
									success:()=>{
										this.refresh()  // 执行方法再次请求数据刷新状态
									}
								})
							}else{
								uni.showToast({
									title:res.data.msg,
									icon:"none"
								})
							}
						}
					})
				}
				// 点击补差价
				if(i===2){
					uni.navigateTo({
						url:"../difference/difference",
						success:()=>{
							uni.$emit("diff_indent",{indent:this.dataObj.indent})
						}
					})
				}
				// 点击完成
				if(i===3){
					this.$http.post("/indent/tusercomplate",{
						indent:this.dataObj.indent
					}).then(([err,res])=>{
						if(res.data.result === "SUCCESS"){
							uni.showToast({
								title:"成功",
								success:()=>{
									this.refresh()  // 执行方法再次请求数据刷新状态
								}
							})
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:"none"
							})
						}
					})
				}
			},
			back() {
				uni.navigateBack({
					delta:1,
					success:()=>{
						uni.$emit("send_active",{active})
					}
				})
			},
			// 再次请求刷新页面
			refresh(){
				 this.$http.post("/indent/indentinfo", {
				 	indent:this.dataObj.indent
				 }).then(([err, res]) => {
				 	if (res.data.result === "SUCCESS") {
				 		let data0 = res.data.data
				 		// 截取隐藏用户电话,姓名
				 		let name = data0.username.slice(0, 1)
				 		if (data0.username.length === 3) {
				 			data0.username = name + "**"
				 		}
				 		if (data0.username.length === 2) {
				 			data0.username = name + "*"
				 		}
				 		let phone1 = data0.userphone.slice(0, 3)
				 		let phone2 = data0.userphone.slice(7)
				 		data0.userphone = phone1 + "****" + phone2
				 		this.dataObj = data0
				 	}
				 })
			}
		},
		onBackPress(e) {
			if (e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		}
	}
</script>

<style lang="less">
	page {
		background: rgb(238, 238, 238);
	}

	.content {
		position: relative;
		.pic-seal{
			position: absolute;
			top: 500rpx;
			right: 0;
			width: 422rpx;
			height: 522rpx;
			
			
		}
		.nav-box {
			height: 160rpx;
			background: #FFFFFF;

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

		.main {
			margin-top: 15rpx;

			.li-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 88rpx;
				background: #FFFFFF;

				image {
					width: 40rpx;
					height: 38rpx;
					margin-left: 32rpx;
					margin-right: 28rpx;
				}

				.right {
					margin-right: 42rpx;
				}
			}

			.mar-t-1 {
				margin-top: 1rpx;
			}

			.li {
				display: flex;
				height: 88rpx;
				align-items: center;
				background: #FFFFFF;
				border-bottom: 1rpx solid #e5e5e5;
				image {
					width: 40rpx;
					height: 40rpx;
					margin: 0 32rpx;
				}
				.des {
					width: 510rpx;
					margin-left: 10rpx;
					line-height: 28rpx;
				}
				.pic{
					image{
						width: 80rpx;
						height: 60rpx;
						margin:0 5px;
					}
				}
			}
			.li-des{
				height: auto;
				padding: 20rpx 0;
			}
			.li-one {
				justify-content: space-between;
				margin-top: 20rpx;

				text {
					margin-left: 20rpx;
					font-size: 26rpx;
				}

				.right {
					display: flex;
					align-items: center;
					width: 158rpx;
					height: 56rpx;
					padding: 0 6rpx;
					border: 1rpx solid rgba(255, 90, 90, 1);
					border-radius: 5px;
					margin-right: 40rpx;

					text {
						line-height: 56rpx;
						font-size: 28rpx;
						margin-left: 8rpx;
					}

					image {
						width: 36rpx;
						height: 36rpx;
						margin: 0;
					}
				}
			}

			.li-left {
				justify-content: space-between;

				.right {
					margin-right: 42rpx;
					font-size: 26rpx;
				}

				.col-ff0 {
					color: #FF0000;
					font-size: 30rpx;
				}
			}

			.li-last {
				justify-content: space-between;
				padding: 0 42rpx;

				.left {
					font-size: 28rpx;
				}

				.right {
					color: #FF0000;
					font-size: 26rpx;
				}
			}
		}

		.order-receiving {
			height: 88rpx;
			line-height: 88rpx;
			margin: 15rpx 20rpx 0 20rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 36rpx;
			background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
		}
		.btn2{
			margin-top: 20rpx;
			padding: 0 40rpx;
			.item{
				height:88rpx;
				line-height: 88rpx;
				margin: 10rpx 20rpx;
				background:linear-gradient(94deg,rgba(255,40,92,1),rgba(255,137,110,1));
				color: #FFFFFF;
				text-align: center;
			}
		}
		.abv{
			width: 100rpx;
			border: 1rpx solid;
		}
	}
</style>
