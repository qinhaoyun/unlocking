<template>
	<view class="content">
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>编辑地址</text>
					<view class="right" @tap="storage">保存</view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="list">
				<view class="item">
					<image src="../../static/images/LXR.png" mode=""></image>
					<input type="text" v-model="linkman" placeholder="请输入联系人" />
				</view>
				<view class="item">
					<image src="../../static/images/DH.png" mode=""></image>
					<input type="text" v-model="linkmanPhone" placeholder="请输入联系电话" />
				</view>
				<view class="item" @tap="getLocation">
					<image src="../../static/images/DZ.png" mode=""></image>
					<text>{{address}}</text>
					<view class="iconfont icon-gengduo"></view>
				</view>
				<view class="item">
					<image src="../../static/images/xxdz.png" mode=""></image>
					<input type="text" v-model="houseNumber" placeholder="请输入详细地址及门牌号" />
				</view>
			</view>
			<view class="default">
				<text>设为默认地址</text>
				<switch @change="isDefault" color="rgba(255,137,110,1)" />
			</view>
			<view class="delete" @tap="del">
				删除编辑地址
			</view>
		</view>
	</view>
</template>

<script>
	// 默认地址变量 
	let num = 0;
	// 地址id
	let addrId = null;
	//定位经纬度
	let location = null;
	export default {
		data() {
			return {
				dataArr: [],
				linkman: "",
				linkmanPhone: "",
				address: "", // 定位地址
				houseNumber: "",
				addrdata: null // 需要修改的地址
			};
		},
		onLoad() {
			uni.$once("sendAddre_id", (data) => {
				addrId = data.Id
				if (addrId) {
					this.$http.post("/function/selectAddr", {
						uid: this.User.userinfo.uid,
						addrid: addrId
					}).then(([err, res]) => {

						if (res.data.result === "SUCCESS") {
							let addrdata = res.data.data[0]
							// 表单赋值
							this.linkman = addrdata.name
							this.linkmanPhone = addrdata.phone
							this.address = addrdata.addr
							this.houseNumber = addrdata.doornum
							location = addrdata.fixed
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
						}
					})
				}
			})
			uni.$once("getLocation", (data) => {
				// 存值 经纬度
				location = data.data
				
				// 地址
				this.address = data.data1
			})
		},
		computed: {
			// 联系人
			verifieLinkman() {
				return this.linkman
			},
			// 地址定位
			verifieLlocation() {
				return this.address
			},
			// 验证手机号码
			isPhone() {
				let mPattern = /^1[34578]\d{9}$/;
				return mPattern.test(this.linkmanPhone);
			},
			// 验证详细地址地址不能为空
			verifierAddress() {
				return this.houseNumber
			},
		},
		methods: {
			// 跳转到map页面,获取定位
			getLocation() {
				uni.navigateTo({
					url: "../map/map"
				})
			},
			// 请求需要修改的地址
			async request_onesAddress(options) {
				let [err, res] = await this.$http.post(options.url, options.data)
				
				this.dataArr = res.data.data
			},
			// 删除该条地址
			del() {
				this.$http.post("/function/removeAddr",{
					uid: this.User.userinfo.uid,
					addrid: addrId
				}).then(([err, res]) => {
					if (res.data.result === "SUCCESS") {
						uni.showToast({
							title: "删除成功",
							success() {
								uni.navigateTo({
									url: "../addressList/addressList"
								})
							}
						})
					} else {
						uni.showToast({
							title: res.data.msg
						})
					}
				})
			},
			// 返回上一页
			back() {
				uni.navigateTo({
					url:"../addressList/addressList"
				})
			},
			// 修改完成保存地址
			storage() {
				if (!this.verifieLinkman) {
					uni.showToast({
						title: "请输入联系人",
						icon: "none"
					})
					return
				}
				if (!this.verifieLlocation) {
					uni.showToast({
						title: "请输入地址",
						icon: "none"
					})
					return
				}
				// 验证详细地址
				if (!this.verifierAddress) {
					uni.showToast({
						title: "请输入详细地址"
					})
					return
				}
				// 验证手机号码
				if (!this.isPhone) {
					uni.showToast({
						title: "请输入正确的手机号码"
					})
					return
				}
				
				this.$http.post("/function/updateUserAddr",{
					username: this.linkman,
					phone: this.linkmanPhone,
					addr: this.address,
					doornum: this.houseNumber,
					state:num,
					uid: this.User.userinfo.uid,
					fixed: location,
					addrid:addrId
				}).then(([err,res])=>{
					if (res.data.result === "SUCCESS") {
						uni.showToast({
							title: "修改成功",
							success:()=>{
								uni.navigateTo({
									url: "../addressList/addressList"
								})
							}
						})
					} else {
						uni.showToast({
							title: res.data.msg
						})
					}
				})
				
			},
			// 切换是否为默认地址
			isDefault(e) {
				let state = null
				state = e.detail.value
				if (state) {
					num = 1
				} else {
					num = 0
				}
				
			},
		},
		onBackPress(e) {
			if (e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		}
	}
</script>

<style lang="less">
	page {
		background: rgb(238, 238, 238);
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
					color: rgba(255, 0, 0, 1);
					text-align: right;
				}
			}

		}

		.main {
			padding: 14rpx 32rpx 0 32rpx;

			.item {
				display: flex;
				position: relative;
				align-items: center;
				height: 88rpx;
				margin-bottom: 1px;
				background: #FFFFFF;

				image {
					width: 40rpx;
					height: 40rpx;
					margin: 0 20rpx 0 10rpx;

				}

				input {
					width: 80%;
					height: 60rpx;
					font-size: 28rpx;
				}

				text {
					width: 580rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.iconfont {
					position: absolute;
					right: 8rpx;
					color: rgba(182, 182, 182, 1);
				}
			}
		}

		.default {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 88rpx;
			margin-top: 30rpx;
			background: #FFFFFF;

			text {
				margin-left: 10rpx;
			}
		}

		.delete {
			padding-left: 12rpx;
			height: 88rpx;
			line-height: 88rpx;
			margin-top: 30rpx;
			background: #FFFFFF;
			color: rgba(255, 0, 0, 1);
			font-size: 28rpx;
		}
	}
</style>
