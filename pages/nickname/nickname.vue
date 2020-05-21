<template>
	<view class="content">
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>编辑昵称</text>
					<view class="right" @tap="submit">保存</view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="name">
				<input type="text" v-model="name" placeholder="输入昵称" />
			</view>
		</view>
	</view>
</template>

<script>
	
	let data1 = {} // 请求用户信息的参数
	let type = null
	export default {
		data() {
			return {
				name: ""
			};
		},
		onLoad() {
			uni.$once("change_type",(data)=>{
				type = data.type
			})
			this.name = this.User.userinfo.name
		},
		computed: {
			isName() {
				return this.name
			}
		},
		methods: {
			submit() {
				if (!this.isName) uni.showToast({
					title: "昵称不能为空",
					icon: "none"
				})
				let data = {}
				
				let url = ""
				if(type){
					url = "/user/updateUserInfo";
					data.uid = this.User.userinfo.uid
					data.name = this.name
					data1.uid = this.User.userinfo.uid
				}else{
					url = "/user/updateTUserInfo"
					data.tid = this.User.userinfo.tid
					data.name = this.name
					data1.tid = this.User.userinfo.tid
				}
				
				this.request({
					url,
					data
				})
			},
			async request(opt) {
				let [err, res] = await this.$http.post(opt.url, opt.data)
				
				if (res.data.result === "SUCCESS") {
					this.$http.post("/user/selectUserInfo", data1)
					.then(([err, res]) => {
						if (res.data.result === "SUCCESS") {
							
							uni.setStorageSync("userinfo", res.data.data);
							
							uni.showToast({
								title: "修改成功",
								success: () => {
									if(type){
										uni.navigateTo({
											url: "../personal_information/personal_information"
										})
									}else{
										uni.navigateTo({
											url:"../technician_Iindex/technician_personal/technician_personal"
										})
									}
								}
							})
						} else {
							uni.uni.showToast({
								title: res.data.msg,
								icon: "none"
							});
						}
					})
				} else {
					uni.showToast({
						title: res.data.msg,
						icon: "none"
					})
				}
			},
			back() {
				uni.navigateTo({
					url: "../personal_information/personal_information"
				})
			}
		},

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
					text-align: right;
				}
			}

		}

		.main {
			margin-top: 22rpx;

			.name {
				height: 88rpx;
				line-height: 88rpx;
				color: #999999;
				font-size: 30rpx;
				background: #FFFFFF;

				input {
					height: 88rpx;
					margin-left: 20rpx;
				}
			}
		}
	}
</style>
