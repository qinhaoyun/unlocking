<template>
	<view class="content">
		<view class="hd-empty"></view>
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>选择已有地址</text>
					<view class="right" @tap="addAddress">新增地址</view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="list" v-for="(item,index) in dataArr" :key="index" @tap="check(item.id)">
				<view class="left">
					<view class="address">{{item.addr}}</view>
					<view class="house-number">{{item.doornum}}</view>
					<view class="name-phone">
						<text class="name">{{item.name}}</text><text class="phone">{{item.phone}}</text>
					</view>
				</view>
				<view class="right" @tap="amend(item.id)">
					<image src="../../static/images/bj.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	// 判断是否 去添加或者修改
	let num = 1
	// add_order页面来的
	let isAddorder = null;
	export default {
		data() {
			return {
				dataArr: [],
				// isAddorder:null,
			};
		},
		onLoad() {
			// index页面过来的
			uni.$once("index_order",(data)=>{
				isAddorder = data.isAddorder
				num = 1
			})
			// add_odrder,页面过来的
			uni.$once("add_order",(data)=>{
				isAddorder = data.isAddorder
				num = 1
			})
			//请求地址列表
			this.requestAddresslidt({
				url: "/function/selectAddr",
				data: {
					uid: this.User.userinfo.uid,
					addrid: ""
				}
			})
		},
		methods: {
			// 新增地址
			addAddress() {
				uni.navigateTo({
					url: "../addAddress/addAddress",
					success: () => {
						num += 2
					}
				})
			},
			// 修改地址
			amend(Id) {
				uni.navigateTo({
					url: "../amend/amend",
					success: () => {
						num += 2
						uni.$emit("sendAddre_id", {Id})
					}
				})
			},
			// 返回上一页面
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 选中地址
			check(Id){
				
				if(isAddorder){
					uni.navigateBack({
						delta:num,
						success:()=>{
							uni.$emit("send_addrid1",{Id})
						}
					})
					
				}else{
					uni.navigateBack({
						delta:num,
						success:()=>{
							uni.$emit("send_addrid",{Id})
						}
					})
				}
			},
			//请求地址列表
			async requestAddresslidt(optins) {
				uni.showNavigationBarLoading(); //显示加载动画
				let [err, res] = await this.$http.post(optins.url, optins.data)
				uni.hideNavigationBarLoading(); //关闭加载动画
			
				if (res.data.result === "SUCCESS") {
					this.dataArr = res.data.data
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
	.content {
		.hd-empty{
			height: 160rpx;
		}
		.hd{
			position: fixed;
			top: 0;
			left: 0;
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
						border: ;
					}
			
					text {
						font-size: 36rpx;
					}
			
					.right {
						width: 100rpx;
						padding-right: 34rpx;
						line-height: 100rpx;
						font-size: 26rpx;
					}
				}
			
			}
		}
		.main {
			padding-left: 58rpx;
			margin-top: 30rpx;

			.list {
				display: flex;
				justify-content: space-between;
				padding: 20rpx 0;
				border-bottom: 1px solid rgba(225, 225, 225, 1);

				.left {
					font-size: 28rpx;

					.name-phone {
						line-height: 40rpx;
						font-size: 24rpx;
					}

					.address {
						line-height: 40rpx;
					}

					.house-number {
						line-height: 40rpx;
					}
				}

				.right {
					image {
						width: 40rpx;
						height: 40rpx;
						margin-top: 30rpx;
						margin-right: 34rpx;
					}
				}
			}
		}

	}
</style>
