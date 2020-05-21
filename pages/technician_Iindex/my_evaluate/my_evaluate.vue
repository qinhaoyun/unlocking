<template>
	<view class="content" v-if="isShow">
		<view class="hd">
			<view class="hd-empty"></view>
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>我的评价</text>
					<view class="right"></view>
				</view>
			</view>
		</view>
		<view class="main" v-if="dataArr.length">
			<view class="li" v-for="(item,index) in dataArr" :key="index">
				<view class="li-box">
					<image v-if="item.type==0" class="headPortrait" :src="item.headimg" mode=""></image>
					<image v-else class="headPortrait" src="../../../static/images/touxiang.png" mode=""></image>
					<view class="text">
						<view class="text-top">
							<text class="name">{{item.type == 0 ?item.name:'匿名用户'}}</text>
							<view class="xinxin-box">
								<image class="xinxin" src="../../../static/images/xinxin.png" mode="" v-for="(item1,index1) in dataStar[index]" :key="index1"></image>
							</view>
						</view>
						<view class="synopsis">
							{{item.intro}}
						</view>
					</view>
					<text class="distance">{{item.createTime}}</text>
				</view>
				<view class="pic-box" v-if="dataArr[index].img !== 'undefined'">
					<image :src="item2" mode="" v-for="(item2,index2) in img[index]" :key="index2" @tap="preview(index,index2)"></image>
				</view>
			</view>
		</view>
		<view class="not-have" v-else>
			暂时无用户评价...
		</view>
		<uni-load-more v-if="dataArr.length" :status="loadingType" :contentText="contentText"></uni-load-more>
	</view>
</template>

<script>
	// 页数
	let pagenum = 0;
	export default {
		data() {
			return {
				dataArr: [],
				img:[],
				dataStar:[],
				loadingType: "more",
				showImage: true,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				isShow:false
			};
		},
		computed:{
			
		},
		onReachBottom(){
			// 滚动到底部加载下一页
			this.request_more()
		},
		onLoad() {
			pagenum = 0
			this.$http.post("/indent/tuserevaluatelist", {
				tid: this.User.userinfo.tid,
				pagenum,
				pagesize: 10
			}).then(([err, res]) => {
			
				if (res.data.result === "SUCCESS") {
					this.dataArr = res.data.data.list
					let data0 = res.data.data.list
					let picArr = []
					for (let i = 0; i < data0.length; i++) {
						picArr.push(data0[i].img.split(","))
					}
					this.img = picArr
					// 循环遍历出星星的个数
					for (let i = 0; i < data0.length; i++) {
						let index = data0[i].star - 0
						let star = []
						for (let j = 0; j < index; j++) {
							star.push(j)
						}
						this.dataStar.push(star)
					}
					pagenum ++
					this.isShow = true
				}
			})
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 图片预览
			preview(index,index2){
				uni.previewImage({
					current:index2,
					urls:this.img[index],
					indicator:"default",
					success: (res) => {
						
					},
					fail: (err) => {
						
					}
				})
			},
			request_more(){
				// 状态为noMore就是没有数据了就直接return
				if (this.loadingType === "noMore") {
					return false; //直接返回
				}
				// 如果有就状态就改为加载中然后请求数据
				this.loadingType = "loading";
				this.$http.post("/indent/tuserevaluatelist",{
					tid: this.User.userinfo.tid,
					pagenum,
					pagesize: 10
				}).then(([err,res])=>{
					if(res.data.result === "SUCCESS"){
						this.dataArr = this.dataArr.concat(res.data.data.list)
						let data0 = res.data.data.list
						
						if(data0.length === 0){
							this.loadingType = "noMore";
							return
						} else this.loadingType = 'more';
						let picArr = []
						for (let i = 0; i < data0.length; i++) {
							picArr.push(data0[i].img.split(","))
						}
						
						this.img = this.img.concat(picArr)
						// 循环遍历出星星的个数
						for (let i = 0; i < data0.length; i++) {
							let index = data0[i].star - 0
							let star = []
							for (let j = 0; j < index; j++) {
								star.push(j)
							}
							this.dataStar.push(star)
						}
						pagenum ++
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.content {
		.hd-empty{
			height: 160rpx;
		}
		.nav-box {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 999;
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
				border-bottom: 1rpx solid #E5E5E5;
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
			.li {
				position: relative;
				padding: 0 40rpx;
				border-top: 1px solid #E5E5E5;
				padding-bottom: 26rpx;
				.li-box {
					display: flex;
					margin-top: 50rpx;

					.headPortrait {
						width: 100rpx;
						height: 100rpx;
						margin-right: 20rpx;
						border-radius: 50%;
						vertical-align: middle;
					}

					.text {
						padding-top: 12rpx;

						.text-top {
							display: flex;
							height: 30rpx;
							line-height: 30rpx;
							.xinxin-box {
								display: flex;
								align-items: center;
								height: 30rpx;
								.xinxin {
									width: 26rpx;
									height: 26rpx;
								}
							}

							.name {
								margin-right: 20rpx;
								font-size: 30rpx;
								font-weight: 500;
							}
						}

						.synopsis {
							width: 454rpx;
							line-height: 24rpx;
							margin-top: 10rpx;
							font-size: 22rpx;
						}
					}

					.distance {
						position: absolute;
						top: 30rpx;
						right: 44rpx;
						height: 22rpx;
						line-height: 22rpx;
						font-size: 22rpx;
						font-weight: 400;
					}
				}

				.pic-box {
					margin-left: 120rpx;
					margin-top: 10rpx;
					image {
						width: 86rpx;
						height: 66rpx;
						margin-right: 32rpx;
					}
				}
			}
			
		}
		.not-have{
			font-size: 40rpx;
			text-align: center;
		}
	}
</style>
