<template>
	<view class="content">
		<view class="hd-empty"></view>
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>选择服务人员</text>
					<view class="right"></view>
				</view>
			</view>
			<view class="sort-area">
				<view class="sort" type="primary" @click="togglePopup('center', 'tip')">
					<text>排序方式</text>
					<view class="iconfont icon-jiantoushang-copy-copy" @click="togglePopup('center', 'tip')"></view>
				</view>
				<view class="area">
					<text @tap="openTime">{{ district_apply }}</text>
					<view class="iconfont icon-jiantoushang-copy-copy" @tap="openTime"></view>
				</view>
			</view>
		</view>
		<view class="main">
			<scroll-view class="list-box" :scroll-y="true" @scrolltolower="onreachbottom" v-if="!showHint">
				<view class="li" :class="check === index ? 'bgd-red' : ''" v-for="(item, index) in dataArr" :key="index" @tap="checked(index)">
					<view class="li-box">
						<image class="headPortrait" :src="item.headimg" mode=""></image>
						<view class="text">
							<view class="text-top">
								<text class="name">{{ item.name }}</text>
								<view class="xinxin-box">
									<image class="xinxin" v-for="(item1, index1) in dataStar[index]" :key="index1" src="../../static/images/xinxin.png" mode=""></image>
								</view>
								<text class="district">{{ county[index] }}</text>
							</view>
							<view class="synopsis">{{ item.intro ? item.intro : '' }}</view>
						</view>
						<text class="distance">距离{{ item.juli }}</text>
						<view class="iconfont icon-gengduo" @click.stop="to_brief(item.tid)"></view>
					</view>
				</view>
			</scroll-view>
			<view class="develop" v-else>
				<text>该区域未找到符合您的技术人员....</text>
				<br />
				<text>敬请期待</text>
			</view>
			<view class="next" @tap="next" v-if="!showHint">确认</view>
		</view>
		<!-- 选择区域插件 -->
		<w-picker mode="region" :defaultVal="['重庆市', '市辖区', '万州区']" :areaCode="['50', '5001', '500101']" :hideArea="false" @confirm="onConfirm" ref="region"></w-picker>
		<!-- 排序插件 -->
		<uni-popup ref="showtip" :type="type" :mask-click="false">
			<view class="uni-tip">
				<text class="uni-tip-title">排序方式</text>
				<text class="uni-tip-content">默认排序:系统默认排序;距离排序:按您所在位置的距离排序</text>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancel('tip', 1)">默认排序</text>
					<text class="uni-tip-button" @click="cancel('tip')">距离排序</text>
				</view>
			</view>
		</uni-popup>
		<uni-load-more :status="loadingType" :contentText="contentText" v-if="dataArr.length"></uni-load-more>
	</view>
</template>
<script>
import wPicker from '@/components/w-picker/w-picker.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';

// 排序方式
let sort = 1;
// 区域
let district = '';
// 上拉加载的定时器
let timer = null;
// 初始页数
let pagenum = 0;
export default {
	components: {
		wPicker,
		uniPopup
	},
	data() {
		return {
			dataArr: [],
			content: '',
			type: '',
			check: 0,
			dataStar: [], // 星星
			county: [], // 区域
			indent: '',
			district_apply: '工作区域',
			showHint: false,
			loadingType: "more",
			showImage: true,
			contentText: {
				contentdown: '上拉显示更多',
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了'
			},
			isCheck:false
		};
	},
	onLoad() {
		// 接收indent
		let indent = '';
		uni.$once('send_Indent', data => {
			this.indent = data.indent;
		
			if (this.indent) {
				this.request()
			}
		});
	},
	onReady() {},
	methods: {
		onreachbottom() {
			if (timer != null) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				this.request_more();
			}, 1000);
		},
		request(){
			pagenum = 0
			this.request_technician({
				url: '/indent/tuserlist',
				data: {
					indent: this.indent,
					pagenum:0,
					pagesize:10,
					star: sort,
					area:district
				}
			});
		},
		to_brief(tid) {
			uni.navigateTo({
				url: '../technician_details/technician_details',
				success: () => {
					uni.$emit('details', {
						tid
					});
				}
			});
		},
		back() {
			if(!this.isCheck){
				uni.showModal({
					title:"提示",
					content:"您还未选择师傅,是否继续退出!",
					success: (res) => {
						if(res.confirm){
							uni.navigateTo({
								url:"../index/index"
							})
						}
					}
				})
			}
		},
		// 请求技术员列表
		async request_technician(options) {
			uni.showNavigationBarLoading(); //显示加载动画
			let [err, res] = await this.$http.post(options.url, options.data);
			uni.hideNavigationBarLoading(); //关闭加载动画
		
			if (res.data.result === 'SUCCESS') {
				this.dataArr = res.data.data;
				// 获取data数据
				let data0 = res.data.data;
				if (data0.length === 0) {
					this.showHint = true;
				} else {
					this.showHint = false;
				}
				// 循环遍历出星星的个数
				for (let i = 0; i < data0.length; i++) {
					let index = data0[i].star - 0;
					let star = [];
					for (let j = 0; j < index; j++) {
						star.push(j);
					}
					this.dataStar.push(star);
				}
				// 截取区县
				let countyArr = [];
				for (let i = 0; i < data0.length; i++) {
					let county = data0[i].address;
					let begin = county.indexOf('市') + 1,
						num = county.indexOf('县'),
						end = (num > -1 ? num : county.indexOf('区')) + 1; // 大余-1 就市存在
					countyArr.push(county.slice(begin, end));
				}
				this.county = countyArr;
				this.check = 0;
				pagenum++
				if(data0.length < 10){
					this.loadingType === "noMore"
					return
				}
				this.loadingType = "more"
			} else {
				uni.showToast({
					title: res.data.msg,
					icon: 'none'
				});
			}
		},
		request_more(){
			if (this.loadingType === "noMore") {
				return false; //直接返回
			}
			this.loadingType = "loading";
			uni.showNavigationBarLoading(); //显示加载动画
			this.$http.post("/indent/tuserlist",{
				indent: this.indent,
				pagenum,
				pagesize:10,
				star: sort,
				area:district
			}).then(([err,res])=>{
				uni.hideNavigationBarLoading(); //关闭加载动画
				if(res.data.result === "SUCCESS"){
					this.dataArr = this.dataArr.concat(res.data.data)
					// 获取data数据
					let data0 = res.data.data;
					if(data0.length === 0){
						this.loadingType = "noMore";
						return
					} else this.loadingType = 'more';
					// 循环遍历出星星的个数
					let dataStar = [];
					for (let i = 0; i < data0.length; i++) {
						let index = data0[i].star - 0;
						let star = [];
						for (let j = 0; j < index; j++) {
							star.push(j);
						}
						dataStar.push(star);
					}
					this.dataStar = this.dataStar.concat(dataStar)
					
					// 截取区县
					let countyArr = [];
					for (let i = 0; i < data0.length; i++) {
						let county = data0[i].address;
						let begin = county.indexOf('市') + 1,
							num = county.indexOf('县'),
							end = (num > -1 ? num : county.indexOf('区')) + 1; // 大余-1 就市存在
						countyArr.push(county.slice(begin, end));
					}
					this.county = this.county.concat(countyArr);
					pagenum++
					
				}
			})
		},
		// 打开区域选择器
		openTime() {
			this.$refs.region.show();
		},
		// 选择回调
		onConfirm(res) {
			pagenum = 0
			district = res.checkArr[2];
			this.district_apply = res.checkArr[2];
			this.request_technician({
				url: '/indent/tuserlist',
				data: {
					indent: this.indent,
					area: district,
					star: sort,
					pagenum,
					pagesize :10
				}
			});
		},
		togglePopup(type, open) {
			this.content = '居中弹出 popup';
			this.type = type;
			this.$nextTick(() => {
				this.$refs['show' + open].open();
			});
		},
		cancel(type, num) {
			pagenum = 0
			this.$refs['show' + type].close();
			if (num === undefined) {
				num = '';
			}
			sort = num;
			this.request_technician({
				url: '/indent/tuserlist',
				data: {
					indent: this.indent,
					area: district,
					star: sort,
					pagenum,
					pagesize:10
				}
			});
		},
		// 选中时列表状态
		checked(index) {
			this.check = index;
		},
		// 选中技术员
		next() {
			this.check_technician({
				url: '/indent/checktuser',
				data: {
					tid: this.dataArr[this.check].tid,
					indent: this.indent,
					phone: this.dataArr[this.check].phone
				}
			});
		},
		async check_technician(opt) {
			let [err, res] = await this.$http.post(opt.url, opt.data);
			if ((res.data.result = 'SUCCESS')) {
				this.isCheck = true
				uni.navigateTo({
					url: '../order_receiving/order_receiving',
					success: () => {
						
						uni.$emit('send_indent1', {
							indent: this.indent
						});
					}
				});
			}
		}
	},
	onBackPress(e) {
		this.$refs['showtip'].close();
		
			if (e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		
	}
};
</script>

<style lang="less">
.content {
	width: 100%;
	.hd-empty {
		height: 230rpx;
	}
	.hd {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background: #ffffff;
		z-index: 999;
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
					color: rgba(255, 0, 0, 1);
					text-align: right;
				}
			}
		}

		.sort-area {
			display: flex;
			height: 68rpx;

			border-top: 1rpx solid #e5e5e5;
			border-bottom: 1rpx solid #e5e5e5;

			.sort,
			.area {
				display: flex;
				align-items: center;
				width: 50%;
				height: 100%;
				font-size: 30rpx;

				.iconfont {
					font-size: 24rpx;
				}

				text {
					margin-right: 12rpx;
				}
			}

			.sort {
				text {
					margin-left: 40rpx;
				}
			}

			.area:before {
				display: block;
				content: '';
				height: 100%;
				width: 1rpx;
				background: #e5e5e5;
			}

			.area {
				text {
					margin-left: 186rpx;
				}
			}
		}
	}
	.main {
		.list-box {
			height: calc(100vh - 228rpx - 138rpx);
			
			padding-bottom: 113rpx;
			.li {
				padding: 0 40rpx;

				.li-box {
					display: flex;
					position: relative;
					align-items: center;
					height: 190rpx;
					border-bottom: 1px solid #e5e5e5;

					.headPortrait {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
						margin-right: 20rpx;
						vertical-align: middle;
					}

					.text {
						.xinxin-box {
							display: flex;
							align-items: center;
						}

						.text-top {
							display: flex;
							align-items: center;
							line-height: 30rpx;

							.xinxin {
								width: 26rpx;
								height: 26rpx;
							}

							.name {
								margin-right: 20rpx;
								font-size: 30rpx;
								font-weight: 500;
							}

							.district {
								margin-left: 14rpx;
								font-size: 24rpx;
								font-weight: 400;
							}
						}

						.synopsis {
							width: 454rpx;
							line-height: 24rpx;
							font-size: 22rpx;
						}
					}

					.distance {
						position: absolute;
						top: 30rpx;
						right: 0;
						font-size: 21rpx;
						font-weight: 400;
					}

					.iconfont {
						position: absolute;
						top: 90rpx;
						right: 0;
						font-size: 36rpx;
					}
				}
			}

			.bgd-red {
				background: rgba(183, 0, 6, 0.2);
			}
		}
		.develop {
			width: 100%;
			height: 500rpx;
			text-align: center;
			margin-top: 200rpx;
			font-size: 36rpx;
		}
		.next {
			position: fixed;
			bottom: 80rpx;
			right: 40rpx;
			left: 40rpx;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			color: #ffffff;
			font-size: 36rpx;
			background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
		}
	}

	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 300px;
		background-color: #fff;
		border-radius: 10px;
	}

	.uni-tip-title {
		margin-bottom: 10px;
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}

	.uni-tip-content {
		/* padding: 15px;
		*/
		font-size: 14px;
		color: #666;
	}

	.uni-tip-group-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 20px;
	}

	.uni-tip-button {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #3b4144;
	}
}
</style>
