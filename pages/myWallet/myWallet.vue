<template>
	<view class="content">
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>我的钱包</text>
					<view class="right" @tap="balance_statement">余额明细</view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="detail-box">
				<view class="tit">当前余额（元）</view>
				<view class="num">{{balance?balance:0.00}}</view>
				<view class="top-up" @tap="go_up">去充值</view>
			</view>
			<view class="share">分享有奖</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				balance:""
			};
		},
		onLoad() {
			this.$http.post("/indent/quarymoney",{
				uid:this.User.userinfo.uid
			}).then(([err,res])=>{
				if(res.data.result === "SUCCESS"){
					this.balance = res.data.data
				}else{
					uni.showToast({
						title:res.data.msg
					})
				}
			})
		},
		methods:{
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			balance_statement(){
				uni.navigateTo({
					url:"./wallet_detail_account/wallet_detail_account"
				})
			},
			go_up(){
				uni.navigateTo({
					url:"./save_money/save_money"
				})
			}
		}
	}
</script>

<style lang="less">
	page{
		background: rgb(238,238,238);
	}
	.content {
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
		.main{
			padding: 20rpx;
			.detail-box{
				height: 300rpx;
				padding-left: 52rpx;
				padding-top: 1rpx;
				background: rgba(56, 56, 56, 1);
				border-radius:15px;
				color: #FFFFFF;
				.tit{
					margin-top: 48rpx;
					line-height: 24rpx;
					font-size: 24rpx;
				}
				.num{
					margin-top: 44rpx;
					line-height: 56rpx;
					font-size: 56rpx;
					font-weight: bold;
				}
				.top-up{
					width:164rpx;
					height:54rpx;
					margin-top: 48rpx;
					line-height: 54rpx;
					background:linear-gradient(94deg,rgba(255,40,92,1),rgba(255,137,110,1));
					border-radius:27px;
					text-align: center;
				}
				
			}
			.share{
				height: 88rpx;
				line-height: 88rpx;
				margin-top: 20rpx;
				background: #FFFFFF;
				font-size: 30rpx;
			}
		}
	}
</style>
