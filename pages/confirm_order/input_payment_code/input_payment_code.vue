<template>
	<view class="content">
		<hd-nav :title="title" :rtbtn="rtbtn"></hd-nav>
		<view class="main">
			<!-- <view class="name">
				<input type="password" maxlength="6" v-model="password" placeholder="请输入6位数密码" />
			</view> -->
			<view class="pass-warp">
				<input type="number" value="" @input="inputcode" maxlength="6" focus="true" v-model="password"/>
				<view class="pass-box" v-for="(item,index) in arr_pass" :key="index">
					{{item}}
				</view>
			</view>
			<view class="submit" @tap="submit">
				确认支付
			</view>
			<view class="text">支付密码请在个人中心页,设置 <text class="go-set" @tap="set_pass">点击去设置</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "支付",
				rtbtn: "",
				money: null,
				indent: null,
				password: "",
				arr_pass:["","","","","",""]
			};
		},
		onLoad() {
			uni.$once("sendIndent_money", (data) => {
				this.money = data.money
				this.indent = data.indent
				this.isDiff = data.iSdiff
			})
		},
		methods: {
			set_pass(){
				uni.navigateTo({
					url:"../../payment_code/payment_code",
					success: () => {
						uni.$emit("backpa",{
							isback:true
						})
					}
				})
			},
			submit() {
				let orderdata = {};
				
					orderdata.uid = this.User.userinfo.uid;
					orderdata.indent = this.indent;
					orderdata.money = this.money;
					orderdata.password = this.password

				uni.showLoading({
					title: '支付中...',
					mask: true
				});
				
				this.$http.post("/appPay/balpay", orderdata)
				.then(([err, res]) => {
					uni.hideLoading();
					console.log(res)
					if (res.data.result === "SUCCESS") {
						uni.showToast({
							title: "支付成功",
							duration:2000,
							success: () => {
								setTimeout(()=>{
									if (this.isDiff) {
										uni.redirectTo({
											url: "../../order_receiving/order_receiving",
											success: () => {
												uni.$emit("send_indent1", {
													indent: this.indent
												})
											}
										})
									} else {
										uni.redirectTo({
											url: "../../s_s_personal/s_s_personal",
											success: () => {
												uni.$emit("send_Indent", {
													indent: this.indent
												})
											}
										})
									}
								},1500)
							}
						})
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						})
					}
				})
			},
			inputcode(e){
				let valcode = e.detail.value;
				let codearr = valcode.split("")
					for (let i = 0; i < 6; i++) {
						if(codearr[i] === undefined){
							codearr[i] = ""
						}else{
							codearr[i] = "•"
						}
					}
				this.arr_pass = codearr
			}
		},
		onReady() {
			
		}
	}
</script>

<style lang="less">
	page {
		background: rgb(238, 238, 238);
	}

	.content {
		.main {
			margin-top: 22rpx;
			.pass-warp{
				display: flex;
				position: relative;
				padding: 0 50rpx;
				height: 100rpx;
				.pass-box{
					display: flex;
					align-items: center;
					justify-content: center;
					width: 70rpx;
					height: 70rpx;
					margin:20rpx 18rpx;
					border: 2rpx solid #999999;
					font-size: 40rpx;
				}
				input{
					position: absolute;
					width: 200%;
					height: 82rpx;
					left: -100%;
				}
			}
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

			.submit {
				height: 88rpx;
				line-height: 88rpx;
				margin: 40rpx 50rpx 0 50rpx;
				background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
				text-align: center;
				color: #FFFFFF;
			}

			.text {
				width: 505rpx;
				height: 43rpx;
				line-height: 24rpx;
				margin: 22rpx auto;
				font-size: 20rpx;
				font-weight: 300;
				color: rgba(51, 51, 51, 1);

				.go-set {
					border-bottom: 1rpx solid;
					margin-left: 50rpx;
					color: #FF0000;
				}
			}
		}
	}
</style>
