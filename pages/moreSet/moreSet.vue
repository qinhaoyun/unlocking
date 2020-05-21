<template>
	<view class="content">
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>更多设置</text>
					<view class="right"></view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="list">
				<view class="li deal bor" @tap="go_page(0)">
					<text>{{type==="shifu"?'师傅协议':'用户协议'}}</text>
					<view class="iconfont icon-gengduo1"></view>
				</view>
				<view class="li privacy" @tap="go_page(1)">
					<text>隐私政策</text>
					<view class="iconfont icon-gengduo1"></view>
				</view>
			</view>
			<view class="list">
				<view class="li share bor" @tap="go_page(2)">
					<text>分享</text>
					<view class="iconfont icon-gengduo1"></view>
				</view>
				<view class="li about" @tap="go_page(3)">
					<text>关与</text>
					<view class="iconfont icon-gengduo1"></view>
				</view>
			</view>
			<view class="list mar-top">
				<view class="li about" @tap="go_page(4)">
					<text>检查更新</text>
					<view class="iconfont icon-gengduo1"></view>
				</view>
			</view>
			<view class="log-out" @tap="log_out">退出登录</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			type:null
		};
	},
	onLoad() {
		uni.$on("shifu_user",(data)=>{
			this.type = data.type
		})
	},
	methods: {
		log_out() {
			uni.showModal({
				title:"提示",
				content:"是否确认退出登录",
				success: (res) => {
					if(res.confirm){
						try {
							uni.clearStorageSync();
							uni.reLaunch({
								url: '../login/login'
							});
						} catch (e) {}
					}
				}
			})
		},
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		go_page(index) {
			if (index === 1 || index === 2) {
				uni.showToast({
					title: '正在努力开发中...',
					icon: 'none'
				});
			}
			if(index===0){
				if(this.type==="shifu") {
					uni.navigateTo({url:"../agreement/tech_agreement"})
				}else{
					uni.navigateTo({url:"../agreement/agreement"})
				}
			}
			if (index === 3) {
				uni.navigateTo({
					url: './about/about'
				});
			}
			if(index === 4){
				this.lib.Update(true)
			}
		}
	}
};
</script>

<style lang="less">
page {
	background: rgb(238, 238, 238);
}

.content {
	.nav-box {
		height: 160rpx;
		background: #ffffff;

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
		.list {
			background: #ffffff;
		}
		.li {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 87rpx;
			margin-left: 20rpx;
			.iconfont {
				margin-right: 44rpx;
				color: rgba(110, 110, 110, 0.8);
			}
		}

		.bor {
			margin-top: 20rpx;
			border-bottom: 1rpx solid rgba(229, 229, 229, 1);
		}
		.mar-top{
			margin-top: 20rpx;
		}
		.log-out {
			height: 88rpx;
			margin: 150rpx 20rpx 0 20rpx;
			line-height: 88rpx;
			text-align: center;
			color: #ffffff;
			font-size: 36rpx;
			background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
		}
	}
}
</style>
