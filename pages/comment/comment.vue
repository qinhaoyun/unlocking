<template>
	<view class="content">
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>发表评价</text>
					<view class="right"></view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="comment-box">
				<view class="info">
					<image class="hd-photo" :src="info.headimg" mode=""></image>
					<view class="right">
						<text class="name">{{ info.realname }}</text>
						<view class="xinxin">
							<view class="xinxin-box"><image src="../../static/images/xinxin.png" mode="" v-for="(item, index) in dataStar1" :key="index"></image></view>
							<text>{{ info.star }}分</text>
						</view>
					</view>
				</view>
				<view class="publish">
					<view class="star-box">
						<view class="star"><image :src="item" mode="" v-for="(item, index) in xinArr" :key="index" @tap="check_star(index)"></image></view>
						<text class="txt">{{ grade }}</text>
					</view>
					<view class="anonymous" @tap="anonymity(is_anonymity)">
						<text>匿名评价</text>
						<view class="round"><view v-if="is_anonymity" class="iconfont icon-iconset0125"></view></view>
					</view>
				</view>
				<textarea class="text-box" v-model="text" placeholder="您的评价会帮助我们选择更好的师傅,带去更好的服务~" placeholder-class="suojin" />
				<view class="pic-box">
					<view class="pics" v-for="(item, index) in picArr" :key="index">
						<image :src="item" mode=""></image>
						<view class="det" @tap="det(index)"><view class="txt">x</view></view>
					</view>
					<view class="upload-btn" @tap="add_pic"><image src="../../static/images/tj.png" mode=""></image></view>
				</view>
			</view>
		</view>
		<view class="sbumit" @tap="sbumit">发布</view>
	</view>
</template>

<script>
let indent = null;
let tid = null;
export default {
	data() {
		return {
			xinArr: ['../../static/images/pj2.png', '../../static/images/pj1.png', '../../static/images/pj1.png', '../../static/images/pj1.png', '../../static/images/pj1.png'],
			isadd: true,
			is_anonymity: 0,
			picArr: [],
			star: 1,
			text: '', // 评价类容
			info: null, // 技术员信息
			dataStar1: [], // 星星
			grade: '非常差' // 分数
		};
	},
	onLoad() {
		uni.$once('send_comm_info', data => {
			indent = data.indent;
			tid = data.tid;
			if (tid) {
				uni.showNavigationBarLoading(); //显示加载动画
				this.$http.post('/indent/tuserevaluatelist', { tid, pagenum: 0, pagesize: 1 }).then(([err, res]) => {
					uni.hideNavigationBarLoading(); //关闭加载动画
					if (res.data.result === 'SUCCESS') {
						this.info = res.data.data.tuserinfo;
						// 循环遍历出技术员总体星星的个数
						let data1 = res.data.data.tuserinfo.star - 0; // 星星的个数
						let star = []; // 存星星的数组
						for (let i = 0; i < data1; i++) {
							star.push(i);
						}
						this.dataStar1 = star;
					}
				});
			}
		});
	},
	methods: {
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		check_star(i) {
			this.star = i + 1;
			switch (i) {
				case 0:
					this.xinArr = [
						'../../static/images/pj2.png',
						'../../static/images/pj1.png',
						'../../static/images/pj1.png',
						'../../static/images/pj1.png',
						'../../static/images/pj1.png'
					];
					this.grade = '非常差';
					break;
				case 1:
					this.xinArr = [
						'../../static/images/pj2.png',
						'../../static/images/pj2.png',
						'../../static/images/pj1.png',
						'../../static/images/pj1.png',
						'../../static/images/pj1.png'
					];
					this.grade = '差';
					break;
				case 2:
					this.xinArr = [
						'../../static/images/pj2.png',
						'../../static/images/pj2.png',
						'../../static/images/pj2.png',
						'../../static/images/pj1.png',
						'../../static/images/pj1.png'
					];
					this.grade = '一般';
					break;
				case 3:
					this.xinArr = [
						'../../static/images/pj2.png',
						'../../static/images/pj2.png',
						'../../static/images/pj2.png',
						'../../static/images/pj2.png',
						'../../static/images/pj1.png'
					];
					this.grade = '好';
					break;
				case 4:
					this.xinArr = [
						'../../static/images/pj2.png',
						'../../static/images/pj2.png',
						'../../static/images/pj2.png',
						'../../static/images/pj2.png',
						'../../static/images/pj2.png'
					];
					this.grade = '非常好';
					break;
			}
		},
		// 是否匿名
		anonymity(i) {
			if (i === 0) {
				this.is_anonymity = 1;
			} else {
				this.is_anonymity = 0;
			}
		},
		add_pic() {
			uni.chooseImage({
				count: 5,
				success: res => {
					for (let i = 0; i < res.tempFilePaths.length; i++) {
						this.picArr.push(res.tempFilePaths[i]);
					}
				}
			});
		},
		// 删除图片
		det(index) {
			this.picArr.splice(index, 1);
		},
		// 提交
		sbumit() {
			if (this.picArr.length) {
				let imgs = this.picArr.map((value, index) => {
					return {
						name: 'image' + index,
						uri: value
					};
				});

				uni.uploadFile({
					url: 'https://rg.cqlaiku.com:8811/logins/upload',
					files: imgs,
					fileType: 'image',
					formData: {},
					success: res => {
						const data = JSON.parse(res.data);
						if (data.result === 'SUCCESS') {
							let picObj = data.data;
							let picStr = [];
							for (let key in picObj) {
								picStr.push(picObj[key]);
							}
							this.publish(picStr);
						} else {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							});
						}
					}
				});
			} else {
				this.publish();
			}
		},
		// 发表评价
		publish(picStr) {
			uni.showLoading({
				title: '发表中',
				mask: true
			});
			this.$http
				.post('/indent/userevaluate', {
					indent,
					star: this.star,
					type: this.is_anonymity,
					evaluate: this.text,
					img: picStr,
					tid,
					uid: this.User.userinfo.uid
				})
				.then(([err, res]) => {
					uni.hideLoading();
					if (res.data.result === 'SUCCESS') {
						uni.showToast({
							title: '评价成功',
							duration: 1500,
							success() {
								setTimeout(() => {
									uni.navigateTo({
										url: '../order_list/order_list'
									});
								}, 1500);
							}
						});
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
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
		padding: 16rpx 20rpx 0 20rpx;
		.comment-box {
			padding-top: 1rpx;
			background: #ffffff;
			.info {
				display: flex;
				margin: 30rpx 0 0 38rpx;
				.hd-photo {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 10rpx;
				}
				.right {
					.name {
						font-weight: 700;
						font-size: 30rpx;
					}
					.xinxin {
						display: flex;
						align-items: flex-end;
						height: 34rpx;
						// border: 1rpx solid;
						.xinxin-box {
							height: 34rpx;
							// border: 1rpx solid;
							line-height: 34rpx;
							image {
								width: 28rpx;
								height: 28rpx;
								vertical-align: middle;
							}
						}
						text {
							margin-left: 14rpx;
							line-height: 30rpx;
							font-size: 22rpx;
							// border: 1rpx solid;
						}
					}
				}
			}
			.publish {
				image {
					width: 52rpx;
					height: 52rpx;
					margin-right: 46rpx;
				}
				.star-box {
					display: flex;
					align-items: center;
					height: 52rpx;
					padding-left: 20rpx;
					margin-top: 60rpx;
					.star {
						width: 572rpx;
					}
					text {
						line-height: 52rpx;
						font-size: 36rpx;
						color: #ff0000;
					}
				}
				.anonymous {
					display: flex;
					flex-direction: row-reverse;
					height: 34rpx;
					margin-top: 70rpx;
					.round {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 34rpx;
						height: 34rpx;
						border-radius: 50%;
						background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
						.iconfont {
							font-size: 26rpx;
							font-weight: 600;
							color: #ffffff;
						}
					}
					text {
						margin-right: 22rpx;
						margin-left: 25rpx;
						line-height: 34rpx;
						font-size: 26rpx;
					}
				}
			}
			.text-box {
				width: 650rpx;
				height: 248rpx;
				background: rgba(247, 248, 251);
				border-radius: 4px;
				margin: 50rpx 20rpx 44rpx 20rpx;
				padding: 20rpx 0 0 20rpx;
			}
		}
		.pic-box {
			display: flex;
			flex-wrap: wrap;
			margin-left: 25rpx;
			padding-bottom: 45rpx;
			.pics {
				position: relative;
				width: 146rpx;
				height: 146rpx;
				margin-left: 2rpx;
				margin-right: 8rpx;
				margin-bottom: 15rpx;
				image {
					width: 146rpx;
					height: 146rpx;
					vertical-align: middle;
				}
				.det {
					position: absolute;
					top: -15rpx;
					left: -6rpx;
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					background: #ffffff;
					.txt {
						width: 30rpx;
						height: 30rpx;
						line-height: 23rpx;
						margin: 5rpx auto;
						border-radius: 50%;
						text-align: center;
						background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
					}
				}
			}
			image {
				width: 146rpx;
				height: 146rpx;
			}
		}
	}
	.sbumit {
		height: 88rpx;
		line-height: 88rpx;
		margin: 0 20rpx;
		margin-top: 28rpx;
		background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
		color: #ffffff;
		text-align: center;
		font-size: 36rpx;
	}
}
</style>
