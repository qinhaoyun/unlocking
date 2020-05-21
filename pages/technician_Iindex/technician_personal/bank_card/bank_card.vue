<template>
	<view class="content">
		<view class="main" v-if="show">
			<view class="name">
				<input disabled="true" type="text" v-model="phone"/>
			</view>
			<view class="name code">
				<input type="number" v-model="code" placeholder="验证码" />
				<view class="get-code">
					<text v-if="!showText" @click.stop="getCode">获取验证码</text>
					<text v-else><text class="c-red">{{second}}</text>秒后可重新获取</text>
				</view>
			</view>
			<view class="submit" @tap="submit">
				立即验证
			</view>
			<view class="text">设置账户提现密码,用于钱包提现,请牢记密码,不要告诉他人</view>
		</view>
		<view class="main-tow" v-else>
			<view class="card-box">
				<view class="card-li" :class="check===index?'checked':''" v-for="(item,index) in cardArr" :key="index" @tap="checked(index)">{{item.bankname}}</view>
			</view>
			<view class="card-info">
				<input type="number" v-model="cardNum" placeholder="请输入银行卡卡号!"/>
				<input type="text" maxlength="19" v-model="name" placeholder="请输入银行卡留存姓名"/>
			</view>
			<view class="submit" @tap="submit1">
				确定
			</view>
			
		</view>
	</view>
</template>

<script>
	let dataCode = null;
	export default {
		data() {
			return {
				phone: "",
				code: "",
				second: 60,
				showText: false,
				show:true,
				cardArr:null,
				check:0,
				cardNum:"",
				name:""
			};
		},
		onLoad() {
			let phone = this.User.userinfo.phone
		
			let initio = phone.slice(0, 3);
			let end = phone.slice(7);
			this.phone = initio + "***" + end;
		
			this.request_card()
		},
		computed:{
			isCode() {
				return this.code === dataCode
			},
			// 验证姓名
			verifierName() {
				let reg = /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,10}$/
				return reg.test(this.name)
			},
			// 验证银行卡号
			verifiercardNum(){
				return this.cardNum.length === 19
			}
		},
		methods:{
			submit() {
				if (!this.isCode) {
					uni.showToast({
						title: "验证码错误",
						icon: "none"
					})
				} else {
					// 显示绑定银行卡信息
					this.show = false
				}
			},
			getCode() {
				this.request_code({
					url: "/logins/getcode",
					data: {
						phone: this.User.userinfo.phone
					}
				})
			},
			async request_code(opt) {
				uni.showLoading({
					title: '发送中...',
					mask: true
				});
				let [err, res] = await this.$http.post(opt.url, opt.data)
				uni.hideLoading();
				if (res.data.result === "SUCCESS") {
					dataCode = res.data.data
					uni.showToast({
						title: "已发送,请等待",
						success: () => {
							this.showText = true
							let interval = setInterval(() => {
								--this.second
							}, 1000)
							setTimeout(() => {
								clearInterval(interval)
								this.showText = false
								this.second = 60
							}, 60000);
						}
					})
				} else {
					uni.showToast({
						title: res.data.msg,
						icon: "none"
					})
				}
			},
			request_card(){
				this.$http.post("/user/getbanklist",{
					card:"",
					tid:this.User.userinfo.tid,
					name:this.User.userinfo.realname,
					code:""
				}).then(([err,res])=>{
					console.log(res)
					if(res.data.result === "SUCCESS"){
						this.cardArr = res.data.data
					}
				})
			},
			checked(index){
				this.check = index
			},
			// 绑定银行卡号
			submit1(){
				let bankcode = this.cardArr[this.check].bankcode
				console.log(bankcode)
				if(!this.verifiercardNum) return uni.showToast({title:"银行卡格式错误!",icon:"none"})
				if(!this.verifierName) return uni.showToast({title:"姓名格式错误!",icon:"none"})
				this.$http.post("/user/bindBank",{
					card:this.cardNum,
					tid:this.User.userinfo.tid,
					name:this.name,
					code:bankcode
				}).then(([err,res])=>{
					if(res.data.result === "SUCEESS"){
						uni.showToast({title:"绑定成功"})
					}else{
						uni.showToast({title:res.data.msg,icon:"none"})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page{
		background: #e5e5e5;
	}
	.content{
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
		
			.code {
				position: relative;
		
				input {
					border-top: 1rpx solid #e5e5e5;
				}
		
				.get-code {
					position: absolute;
					right: 50rpx;
					top: 29rpx;
					z-index: 99;
					height: 30rpx;
					line-height: 30rpx;
					border-bottom: 1rpx solid;
					font-size: 24rpx;
					color: #FF6434;
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
			}
		}
		.main-tow{
			.card-box{
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 20rpx 20rpx;
				.card-li{
					display: flex;
					justify-content: center;
					align-items: center;
					width: 160rpx;
					height: 60rpx;
					margin-bottom: 20rpx;
					border-radius: 20rpx;
					font-size: 28rpx;
					lighting-color: 30rpx;
					background: #FFFFFF;
				}
				.checked{
					background: green;
					color: #FFFFFF;
				}
			}
			.card-info{
				input{
					height: 88rpx;
					padding-left: 20rpx;
					background: #FFFFFF;
					margin-bottom: 20rpx;
					border-radius: 10rpx;
				}
			}
			.submit{
				height: 88rpx;
				line-height: 88rpx;
				margin: 60rpx 60rpx 0 60rpx;
				text-align: center;
				background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
				color: #FFFFFF;
				font-size: 30rpx;
			}
		}
	}
</style>
