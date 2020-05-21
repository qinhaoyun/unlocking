<template>
	<view class="content">
		<view class="main">
			<view class="hd">
				<image src="../../../static/images/charge.png" mode=""></image>
				<view class="balance">{{balance}} <text>元</text></view>
				<view class="save">充值可为您节省0.00元</view>
				<view class="semicircle"></view>
			</view>
			<view class="money-input">
				<text class="h3">充值金额:</text>
				<input type="number" :disabled="iSdisabled" v-model="money"/>
			</view>
			<view class="list-box">
				<view class="list">
					<view class="li" :class="checked === index?'cheke-li':''" v-for="(item,index) in moneyArr" :key="index" @tap="check(index)">
						<view class="tit">充值</view>
						<view class="num"> <text>￥</text> {{item}}</view>
					</view>
				</view>
			</view>
			<view class="up" @tap="go_payment">立即充值</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money:100,
				moneyArr:[100,200,500,800,"其他"],
				checked:0,
				balance:0.00,
				iSdisabled:true
			};
		},
		onLoad() {
			this.$http.post("/indent/quarymoney",{
				uid:this.User.userinfo.uid
			}).then(([err,res])=>{
				if(res.data.result === "SUCCESS"){
					this.balance = res.data.data
				}else{
					uni.showToast({
						title:res.data.msg
					})
				}
			})
		},
		methods:{
			check(i){
				this.checked = i
				if(i === 4){
					this.money = "";
					this.iSdisabled = false;
				}else{
					this.money = this.moneyArr[this.checked];
					this.iSdisabled = true;
				}
				
				
			},
			go_payment(){
				if(this.money <= 0)return uni.showToast({title:"金额不能为空",icon:"none"})
				uni.navigateTo({
					url:"../payment_up/payment_up",
					success: () => {
						uni.$emit("send_up",{
							money:this.money
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.content{
		.main{
			.hd{
				position: relative;
				width: 100vw;
				height: 730rpx;
				text-align: center;
				overflow: hidden;
				image{
					position: absolute;
					top: 20rpx;
					left: 0;
					right: 0;
					z-index: -1;
					width: 100vw;
					height: 710rpx;
				}
				.balance{
					padding-top: 400rpx;
					font-size: 48rpx;
					font-weight:bold;
					color:rgba(197,162,108,1);
					line-height:43px;
					text{
						font-size: 22rpx;
					}
				}
				.save{
					position: absolute;
					left: 168.5rpx;
					bottom: 120rpx;
					z-index: 2;
					width:413rpx;
					height:80rpx;
					background:linear-gradient(251deg,rgba(219,185,126,1),rgba(254,230,200,1));
					box-shadow:0px 8px 16px 2px rgba(254,230,200,0.5);
					border-radius:40px;
					font-size:30rpx;
					line-height: 80rpx;
					text-align: center;
				}
			}
			.hd::after{
				position: absolute;
				width: 120%;
				height: 200rpx;
				left: -11%;
				bottom: -50rpx;
				content: "";
				z-index: 1;
				background: #FFFFFF;
				border-radius:50% 50% 0 0;  
			}
			.money-input{
				display: flex;
				align-items: center;
				padding-left: 75rpx;
			
				.h3{
					font-size: 40rpx;
					color: #2D2D2D;
					line-height: 40rpx;
					
				}
				input{
					height: 40rpx;
					padding-left: 50rpx;
					font-size: 40rpx;
					border-bottom: 1rpx solid;
				}
			}
			.list-box{
				margin-top: 54rpx;
				overflow: scroll;
				.list{
					display: flex;
					width: 1100rpx;
					padding: 20rpx 75rpx;
					.li{
						width:196rpx;
						height:234rpx;
						margin-right: 45rpx;
						background:rgba(255,255,255,1);
						box-shadow:1px 1px 10px rgba(0,0,0,0.2);
						border-radius:5px;
						text-align: center;
						.tit{
							margin-top: 40rpx;
							font-size: 24rpx;
							font-weight: bold;
						}
						.num{
							font-size: 50rpx;
							font-weight: bold;
							color: #FF0000;
							text{
								font-size: 30rpx;
							}
						}
					}
					.cheke-li{
						border:1px solid rgba(255,0,0,1);
						box-shadow:1px 1px 10px rgba(255,0,0,0.2);
					}
				}
			}
			.up{
				height:88rpx;
				margin: 60rpx 46rpx 0 46rpx;
				background:linear-gradient(94deg,rgba(255,40,92,1),rgba(255,137,110,1));
				box-shadow:0px 8px 16px 2px rgba(255,137,110,0.5);
				border-radius:45rpx;
				text-align: center;
				font-size: 32rpx;
				color: #FFFFFF;
				line-height: 88rpx;
			}
		}
	}
</style>
