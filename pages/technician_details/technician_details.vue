<template>
	<view class="content" @scroll="more">
		<view class="hd-box"></view>
		<hd-nav class="hd" :title="title" :rtbtn="rtbtn"></hd-nav>
		<view class="main">
			<view class="info">
				<view class="top">
					<image class="hd-img" :src="info.headimg" mode=""></image>
					<view class="right">
						<view class="name-xinxin">
							<text>{{ info.realname }}</text>
							<view class="xin-box"><image class="xinxin" src="../../static/images/xinxin.png" mode="" v-for="(item, index) in dataStar1" :key="index"></image></view>
						</view>
						<view class="text">{{ info.intro ? info.intro : '' }}</view>
					</view>
				</view>
				<view class="register-time">
					<text class="tit">注册时间</text>
					<text>{{ regTime }}</text>
					<!-- createtime -->
				</view>
				<view class="working-area">
					<view class="left">
						<text class="tit">工作区域</text>
						<text>{{ county }}</text>
					</view>
					<view class="right1">
						<text class="tit">已完成</text>
						<text class="unit">({{ info.complatenum }}单)</text>
					</view>
				</view>
			</view>
			<view class="evaluate-box" v-if="evaluateList.length">
				<view class="li" v-for="(item, index) in evaluateList" :key="index">
					<image class="hd-img" :src="item.headimg" mode=""></image>
					<view class="right">
						<view class="name">{{ item.name }}</view>
						<view class="xinBox">
							<image class="xinxin" src="../../static/images/xinxin.png" mode="" v-for="(item1, index1) in dataStar[index]" :key="index1"></image>
						</view>
						<view class="text">{{ item.intro }}</view>
					</view>
					<text class="time">{{ item.createTime }}</text>
				</view>
			</view>
			<view class="evaluate-empty" v-else>该师傅暂无评价~</view>
		</view>
		<uni-load-more :status="loadingType" :contentText="contentText" v-if="evaluateList.length"></uni-load-more>
	</view>
</template>
<script>
let tid = null;

// 第一次请求得页数;
let pagenum = 0;
// 上拉滚动加载得定时器
let timer = null;
export default {
	data() {
		return {
			title: '详情页面',
			rtbtn: '',
			info: null,
			evaluateList: [], // 评价列表
			dataStar: [], // 用户评价星星数量
			dataStar2: [],
			dataStar1: [], // 技术员星星总体数量
			county: '', // 工作区域
			regTime: '', // 注册时间
			lookmore: null,
			loadingType: "more",
			contentText: {
				contentdown: '上拉显示更多',
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了'
			},
			moreshow:true
		};
	},
	onLoad() {
		uni.$once ('details', data => {
			tid = data.tid;
			if (tid) {
				this.request();
			}
		});
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.request();
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	// 上拉加载
	onReachBottom() {
		if (timer != null) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			this.request_more();
		}, 1000);
	},
	methods: {
		request() {
			pagenum = 0
			uni.showNavigationBarLoading(); //显示加载动画
			this.$http
				.post('/indent/tuserevaluatelist', {
					tid,
					pagenum:0,
					pagesize:10
				})
				.then(([err, res]) => {
				
					uni.hideNavigationBarLoading(); //关闭加载动画
					this.info = res.data.data.tuserinfo; // 技术员信息
					let list = res.data.data.list;
					
					this.evaluateList = list;
					// 循环遍历出用户评价星星的个数
					let data0 = list;
					for (let i = 0; i < data0.length; i++) {
						let index = data0[i].star - 0;
						let star = [];
						for (let j = 0; j < index; j++) {
							star.push(j);
						}
						this.dataStar.push(star);
					}
					// 截取注册时间
					let reg_time = res.data.data.tuserinfo.createtime;
					this.regTime = reg_time
						.slice(0, 11)
						.replace('-', '年')
						.replace('-', '月')
						.replace(' ', '日');

					// 截取区县
					let county = res.data.data.tuserinfo.address;
					let begin = county.indexOf('市') + 1,
						num = county.indexOf('县'),
						end = (num > -1 ? num : county.indexOf('区')) + 1; // 大余-1 就市存在
					this.county = county.slice(0, end);

					// 循环遍历出技术员总体星星的个数
					let data1 = res.data.data.tuserinfo.star - 0;
					let star = [];
					for (let i = 0; i < data1; i++) {
						star.push(i);
					}
					this.dataStar1 = star;
					pagenum++
					// 第一页如果小于10条数据
					if(list.length < 10){
						this.loadingType = "noMore"
						return
					}
					this.loadingType = "more"
				});
		},
		request_more() {
			if (this.loadingType === "noMore") {
				return false; //直接返回
			}
			this.loadingType = "loading";
			uni.showNavigationBarLoading(); //显示加载动画
			this.$http
				.post('/indent/tuserevaluatelist', {
					tid,
					pagenum,
					pagesize: 10
				})
				.then(([err, res]) => {
					uni.hideNavigationBarLoading(); //关闭加载动画
					this.info = res.data.data.tuserinfo; // 技术员信息
					let list = res.data.data.list;
					if(list.length === 0){
						this.loadingType = "noMore"
						return
					}
					pagenum++; //每触底一次 page +1
					this.evaluateList = this.evaluateList.concat(res.data.data.list);
					// 循环遍历出用户评价星星的个数
					let data0 = list;
					let dataStar = []
					for (let i = 0; i < data0.length; i++) {
						let index = data0[i].star - 0;
						let star = [];
						for (let j = 0; j < index; j++) {
							star.push(j);
						}
						dataStar.push(star);
					}
					this.dataStar = this.dataStar.concat(dataStar)
					// 截取注册时间
					let reg_time = res.data.data.tuserinfo.createtime;
					this.regTime = reg_time
						.slice(0, 11)
						.replace('-', '年')
						.replace('-', '月')
						.replace(' ', '日');

					// 截取区县
					let county = res.data.data.tuserinfo.address;
					let begin = county.indexOf('市') + 1,
						num = county.indexOf('县'),
						end = (num > -1 ? num : county.indexOf('区')) + 1; // 大余-1 就市存在
					this.county = county.slice(0, end);

					// 循环遍历出技术员总体星星的个数
					let data1 = res.data.data.tuserinfo.star - 0;
					let star = [];
					for (let i = 0; i < data1; i++) {
						star.push(i);
					}
					this.dataStar1 = star;
				});
		}
	}
};
</script>

<style lang="less">
page {
	background: rgb(238, 238, 238);
}
.content {
	.hd-box {
		height: 160rpx;
	}

	.hd {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		background: #FFFFFF;
		border-bottom: 1rpx solid #e5e5e5;
	}

	.main {
		margin-top: 15rpx;

		.info {
			background: #ffffff;

			.hd-img {
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;
				margin-left: 42rpx;
				border-radius: 50%;
			}

			.top {
				display: flex;
				padding: 42rpx 0;

				.right {
					.name-xinxin {
						display: flex;

						text {
							font-weight: Medium;
							font-size: 30rpx;
						}

						.xinxin {
							width: 26rpx;
							height: 26rpx;
						}
					}

					.text {
						width: 520rpx;
						line-height: 26rpx;
						font-size: 24rpx;
					}
				}
			}

			.register-time {
				display: flex;
				align-items: center;
				height: 88rpx;
				border-top: 1rpx solid #e5e5e5;
				border-bottom: 1rpx solid #e5e5e5;

				.tit {
					margin-right: 50rpx;
					margin-left: 42rpx;
				}
			}

			.working-area {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 88rpx;

				.left {
					width: 49%;
					height: 88rpx;
					font-size: 26rpx;

					.tit {
						line-height: 88rpx;
						font-weight: Regular;
						margin-left: 42rpx;
						margin-right: 50rpx;
					}
				}

				.right1 {
					width: 49%;
					height: 88rpx;
					line-height: 88rpx;
					font-size: 26rpx;

					.tit {
						line-height: 88rpx;
						font-weight: Regular;
						margin-left: 80rpx;
						margin-right: 50rpx;
					}

					.unit {
						color: #ff0000;
					}
				}

				.right1::before {
					display: inline-block;
					content: '';
					width: 1rpx;
					height: 60rpx;
					vertical-align: middle;
					background: #e5e5e5;
				}
			}
		}

		.evaluate-box {
			margin-top: 24rpx;
			background: #ffffff;

			.li {
				display: flex;
				position: relative;
				padding-top: 36rpx;
				padding-bottom: 36rpx;
				border-bottom: 1rpx solid #e5e5e5;

				.hd-img {
					width: 70rpx;
					height: 70rpx;
					margin-right: 20rpx;
					margin-left: 42rpx;
					border-radius: 50%;
				}

				.right {
					font-size: 22rpx;

					.name {
						height: 26rpx;
						font-weight: Medium;
					}

					.xinBox {
						height: 24rpx;

						.xinxin {
							width: 20rpx;
							height: 20rpx;
							line-height: 24rpx;
						}
					}

					.text {
						width: 500rpx;
						margin-top: 16rpx;
						font-size: 22rpx;
					}
				}

				.time {
					position: absolute;
					top: 32rpx;
					right: 20rpx;
					font-size: 20rpx;
				}
			}

			.bor-none {
				border: none;
			}
		}
		.evaluate-empty{
			width: 100vw;
			text-align: center;
			font-size: 40rpx;
		}
	}

	.pull-down {
		display: block;
		width: 120rpx;
		margin: 0 auto;
		font-size: 20rpx;
	}
}
</style>
