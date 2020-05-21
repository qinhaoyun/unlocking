<template>
	<view class="content">
		<view class="broadside" :animation="animationData" @touchstart="closestart" @touchend="closeend">
			<!-- 用户内容 -->
			<view class="left">
				<view class="empty"></view>
				<view class="userinfo" @tap="go_page(1)">
					<image class="photo" :src="userinfo.headimg" mode="aspectFit"></image>
					<text class="phone">{{userinfo.realname}}</text>
				</view>
				<view class="string"></view>
				<view class="list">
					<view class="list-li" @tap="go_page(0)">
						<view class="pic">
							<image src="../../static/images/dingdan2.png" mode="aspectFit"></image>
							<text>我的评价</text>
						</view>
					</view>
					<view class="list-li" @tap="go_page(1)">
						<view class="pic">
							<image src="../../static/images/geren2.png" mode="aspectFit"></image>
							<text>个人信息</text>
						</view>
					</view>
					<view class="list-li">
						<view class="pic" @tap="go_page(2)">
							<image src="../../static/images/yaoqing2.png" mode="aspectFit"></image>
							<text>邀请有奖</text>
							<image class="img-2" src="../../static/images/chongzhitehui.png" mode="aspectFit"></image>
						</view>
					</view>
					<view class="list-li">
						<view class="pic" @tap="go_page(4)">
							<image src="../../static/images/wodeqianbao.png" mode="aspectFit"></image>
							<text>我的钱包</text>
							<!-- <image class="img-2" src="../../static/images/yinghongbao.png" mode=""></image> -->
						</view>
					</view>
					<view class="list-li" @tap="go_page(5)">
						<view class="pic">
							<view class="iconfont icon-guize"></view>
							<text>平台规则</text>
						</view>
					</view>
					<view class="list-li" @tap="go_page(3)">
						<view class="pic">
							<image src="../../static/images/gengduo2.png" mode="aspectFit"></image>
							<text>更多设置</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 空白区域 -->
			<view class="right" :class="opacity?'right-opacity':''"></view>
		</view>
		
	</view>
</template>
<script>
	export default {
		data() {
			return {
				Spagex: null,
				Epagex: null,
				animationData: {},
				animation: null,
				animationDataLock:{},
				animationLock:null,
				opacity: false
			};
		},
		onLoad() {
			
		},
		props:["userinfo"],
		methods:{
			// 滑动 打开测边栏
			open(){
				this.animation.left(0).step()
				this.animationData = this.animation.export()
				setTimeout(() => {
					this.opacity = false
				}, 150);
			},
			// 点击打开测边栏
			open_broadside() {
				this.animation.left(0).step()
				this.animationData = this.animation.export()
				setTimeout(() => {
					this.opacity = false
				}, 200);
			},
			// 滑动关闭测边栏
			closestart(e) {
				this.Spagex = e.changedTouches[0].pageX
			},
			closeend(e) {
				this.Epagex = e.changedTouches[0].pageX
				let value = this.Spagex - this.Epagex
				if (value > 50) {
					this.animation.left(-750 + "rpx").step()
					this.animationData = this.animation.export()
					this.opacity = true
				}
			},
			go_page(i){
				// 我的评价
				if(i===0)uni.navigateTo({url:"../../pages/technician_Iindex/my_evaluate/my_evaluate"})
				// 个人信息
				if(i===1)uni.navigateTo({url:"../../pages/technician_Iindex/technician_personal/technician_personal"})
				// 邀请有奖
				if(i===2) uni.showToast({title:"功能正在努力开发中...",icon:"none"})
				// 更多设置
				if(i===3) uni.navigateTo({url:"../../pages/moreSet/moreSet",success: () => {
					uni.$emit("shifu_user",{type:"shifu"})
				}})
				// 我的钱包
				if(i===4) uni.navigateTo({url:"../../pages/technician_Iindex/tech_wallet/tech_wallet"})
				// 平台规则
				if(i===5) uni.navigateTo({url:"../../pages/technician_Iindex/rule_set/rule_set"})
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
				duration:300,
				timingFunction: 'ease'
			})
			this.animationLock = animationLock
			this.animationLock.scale(0.2).step()
			this.animationDataLock = this.animationLock.export()
		}
		
	}
</script>
<style lang="less">
	.content{
		.broadside {
			position: fixed;
			height: 100vh;
			z-index: 999;
			top: 0;
			left: -750rpx;
			.left {
				float: left;
				width: 560rpx;
				height: 100%;
				background: #FFFFFF;
		
				.empty {
					height: 42rpx;
				}
		
				.userinfo {
					display: flex;
					align-items: center;
					height: 218rpx;
					margin-left: 40rpx;
		
					.photo {
						width: 107rpx;
						height: 107rpx;
						border-radius: 50%;
						margin-right: 24rpx;
						vertical-align: middle;
					}
		
					.phone {
						font-size: 32rpx;
						vertical-align: middle;
					}
				}
		
				.string {
					width: 535rpx;
					height: 1px;
					margin: 0 auto;
					background: rgba(225, 225, 225, 1);
				}
		
				.list {
					margin-left: 40rpx;
					margin-top: 74rpx;
		
					.list-li {
						display: flex;
						align-items: flex-end;
						height: 60rpx;
						margin-bottom: 45rpx;
		
						image {
							width: 46rpx;
							height: 46rpx;
							vertical-align: middle;
						}
		
						.img-2 {
							width: 114rpx;
							height: 60rpx;
							margin-left: 10rpx;
						}
		
						text {
							margin-left: 40rpx;
							font-size: 32rpx;
							vertical-align: middle;
						}
						.iconfont{
							display: inline-block;
							margin-left: 6rpx;
							color: rgb(75,75,75);
							font-size: 38rpx;
							vertical-align: middle;
						}
					}
				}
		
			}
		
			.right {
				float: left;
				width: 191rpx;
				height: 100%;
				background: rgba(0, 0, 0, 1);
				opacity: 0.5;
			}
		
			.right-opacity {
				opacity: 0;
			}
		
		}
	}
</style>