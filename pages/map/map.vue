<template>
	<view class="content">
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>确认地址</text>
					<view class="right"></view>
				</view>
			</view>
			<view class="search">
				<view class="city">
					<text @tap="chooseLocation">重庆市</text>
					<view class="iconfont icon-jiantoushang-copy-copy"></view>
				</view>
				<view class="string"></view>
				<view class="input-box">
					<view class="iconfont icon-fangdajing"></view>
					<input type="text" v-model="address" confirm-type="search" @confirm="address_search" @input="search(address)"
					 placeholder="请输入您的地址" />
				</view>
			</view>
		</view>
		<view class="map-box">
			<map id="map" :latitude="latitude" :longitude="longitude" :markers="getMarkers"></map>
		</view>
		<scroll-view class="scroll-y" scroll-y="true" show-scrollbar="true">
			<view class="address-info">
				<view class="list-li" v-for="(item,index) in poiList" :key="index" @tap="location(index)">
					<view class="icon-box">
						<view class="iconfont icon-dibiao" v-if="index === 0"></view>
						<view class="round" v-else></view>
					</view>
					<view class="info">
						<view class="address">{{item.address}}</view>
						<view class="name">{{item.name}}</view>
					</view>
				</view>
			</view>
			<view class="btn">
				<view class="add"  @tap="reduce">加载上一页</view>
				<view class="page">第{{num}}页</view>
				<view class="reduce" @tap="add">加载下一页</view>
			</view>
		</scroll-view>
		
	</view>
</template>
<script>
	export default {
		data() {
			return {
				latitude: "", // 纬度
				longitude: "", // 精度
				address: "", // 地址
				poiList: [], // 存放数据的数组
				num:1 // 第一页
			};
		},
		computed:{
			getMarkers(){
				let arr = [{id:1,latitude:this.latitude,longitude:this.longitude,iconPath:"../../static/imagse/sign.png"}]
				return arr
			}
		},
		onLoad() {
			// 当前试图条件编译
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			// #ifdef APP-PLUS  
			var currentWebview = page.$getAppWebview(); //页面栈最顶层就是当前webview  
			// #endif
		},
		onReady() {
			this.initial()
		},
		methods: {
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			// 选中地址返回上一页面
			location(index){
				let location = "";
				let address = ""
				location = this.poiList[index].point.longitude + "," + this.poiList[index].point.latitude
				address = this.poiList[index].address
				uni.$emit("getLocation",{data:location,data1:address})
				uni.navigateBack({
					delta:1
				})
			},
			// 加载下一页
			add(){
				++this.num
				this.search(this.address,this.num)
			},
			// 加载上一页
			reduce(){
				if(this.num>1){
					--this.num
					this.search(this.address,this.num)
				}else{
					uni.showToast({
						title:"已是第一页"
					})
				}
			},
			// 初始定位坐标
			initial() {
				// 获取map对象
				// 在地图中打开当前位s
				uni.getLocation({
					type: "gcj02 ",
					geocode: true,
					success: (res) => {
						// 保存经纬度
						this.latitude = res.latitude
						this.longitude = res.longitude
						// 当前地址的关键字
						let address = res.address.poiName
						this.address = address
						this.search(address)
					}
				})
			},
			search(address,num) {
				// 地图对象
				let mapContext = uni.createMapContext("map")
				var searchObj = new plus.maps.Search(mapContext);
				searchObj.setPageCapacity(10);
				// 创建地图坐标对象
				searchObj.poiSearchInCity("重庆", address, num);
				searchObj.onPoiSearchComplete = (state, result) => {
					if(result.pageNumber<num){
						uni.showToast({
							title:"已是最后一页"
						})
						return
					}
					if (state === 0) {
						this.latitude = result.poiList[0].point.latitude
						this.longitude = result.poiList[0].point.longitude
						this.poiList = result.poiList
					}
				}
			}
		}
	}
</script>

<style lang="less">
	.content {
		height: 100vh;
		.hd {
			height: 224rpx;
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
						width: 40rpx;
						height: 40rpx;
						margin-top: 30rpx;
						padding-left: 40rpx;
						line-height: 40rpx;
					}

					text {
						font-size: 40rpx;
					}

					.right {
						width: 40rpx;
						padding-right: 40rpx;
					}
				}

			}

			.search {
				display: flex;
				padding-top: 1rpx;
				margin: 0 30rpx;
				height: 64rpx;
				border-radius: 30px;
				background: rgba(230, 230, 230, 1);

				.city {
					display: flex;
					width: 148rpx;
					height: 30rpx;
					margin-top: 17rpx;

					text {
						margin-left: 26rpx;
						line-height: 30rpx;
						font-size: 24rpx;
					}

					.iconfont {
						margin-left: 20rpx;
						line-height: 30rpx;
						font-size: 14rpx;
						color: rgba(110, 110, 110, 1);
					}
				}

				.string {
					width: 1px;
					height: 30rpx;
					margin-top: 19rpx;
					background: rgba(167, 167, 167, 1);
				}

				.input-box {
					display: flex;

					.iconfont {
						width: 56rpx;
						height: 30rpx;
						margin-top: 20rpx;
						line-height: 30rpx;
						font-size: 30rpx;
						color: rgba(52, 52, 52, 1);
						text-align: center;
					}

					input {
						height: 64rpx;
						width: 500rpx;
					}
				}
			}
		}

		.map-box {
			height: 506rpx;
			margin-top: 10rpx;
			map {
				width: 750rpx;
				height: 506rpx;
			}
		}
		.scroll-y{
			height: calc(100vh - 506rpx - 234rpx );
			.address-info {
				padding-left: 35rpx;
			
				.list-li {
					display: flex;
					height: 120rpx;
					border-bottom: 1px solid rgba(225, 225, 225, 1);
			
					.icon-box {
						width: 34rpx;
						height: 36rpx;
						margin-top: 37rpx;
						.iconfont{
							width: 25rpx;
							height: 36rpx;
							line-height: 36rpx;
							font-size: 36rpx;
							color:red;
						}
						.round{
							width: 10rpx;
							height: 10rpx;
							margin:7rpx auto;
							border: 6rpx solid rgba(129, 129, 129, 1);
							border-radius: 50%;
							
						}
					}
			
					.info{
						flxe:1;
						margin-top: 24rpx;
						margin-left: 15rpx;
						
						.address {
							width:650rpx ;
							padding-bottom: 20rpx;
							line-height: 28rpx;
							font-size: 28rpx;
							
							white-space:nowrap;
							text-overflow:ellipsis; 
							overflow:hidden;
						}
						.name {
							width:650rpx ;
							font-size: 24rpx;
							line-height: 24rpx;
							
							white-space:nowrap;
							text-overflow:ellipsis; 
							overflow:hidden;
						}
					}
				}
			}
			.btn{
				display: flex;
				justify-content: space-between;
				padding:0 80rpx;
				height: 80rpx;
				view{
					line-height: 80rpx;
				}
				
			}
		}
		
	}
</style>
