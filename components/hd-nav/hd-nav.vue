<template>
	<view class="hd">
		<view class="nav-box">
			<view class="empty"></view>
			<view class="nav">
				<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
				<text>{{title}}</text>
				<view class="right" @tap="event">{{rtbtn}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				
			}
		},
		props:["title","rtbtn"],
		methods:{
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			event(){
				 this.$parent.authentication();
			}
		}
	}
</script>

<style lang="less">
	.hd{
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
	}
</style>
