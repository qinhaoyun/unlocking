<template>
	<view class="content">
		<view class="hd-empty"></view>
		<hdNav class="hd" title="我的钱包" rtbtn=" "></hdNav>
		<view class="main">
			<view class="top">
				<image class="top-img" src="../../../static/images/qbtit.png" mode=""></image>
				<view><text class="tit">我的余额</text></view>
				<view class="">
					<image class="yuan" src="../../../static/images/yuan.png" mode=""></image>
					<text class="num">{{balance}}</text>
				</view>
			</view>
			<view class="btn" @tap="go_detail_account">明细</view>
			<view class="btn mar-top30" @tap="withdraw_deposit">提现</view>
			<view class="hint">
				<view>提示:提现之前需要绑定微信账户,设置提现密码。 <text @tap="go_setPersonal ">点击前往设置</text> 已设置请忽略</view>
			</view>
		</view>
		<view class="pop-up-wrap">
			<view class="shade" v-if="show" @tap="close"></view>
			<view class="pop-up" :animation="animationData">
				<view class="h3">余额提现</view>
				<view class="li">
					<view class="left">
						<image src="../../../static/images/zhye.png" mode=""></image>
						<text>账户余额</text>
					</view>
					<view class="right">
						<text>{{ balance }}元</text>
					</view>
				</view>
				<view class="li">
					<view class="left">
						<image src="../../../static/images/tx.png" mode=""></image>
						<text>提现至微信</text>
					</view>
					<view class="right">
						<view class="circle1"><view class="circle2"></view></view>
					</view>
				</view>
				<view class="input-box">
					<image src="../../../static/images/yuan.png" mode=""></image>
					<input type="number" v-model="money" placeholder="请输入提现金额" />
				</view>
				<view class="service-charge">
					<view class="left">
						<view class="">服务费</view>
						<view class="">费率</view>
					</view>
					<view class="right">
						<view class="">¥ 2.00</view>
						<view class="">2.0% (最低 2.00)</view>
					</view>
				</view>
				<view class="sbumit" @tap="sbumit">申请提现</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			balance: '0.00',
			money: null,
			animationData: {},
			animation: null,
			show:false
		};
	},
	onLoad() {
		this.request()
	},
	methods:{
		// 请求钱包余额
		request(){
			this.$http.post("/indent/quarymoney",{tid:this.User.userinfo.tid})
			.then(([err,res])=>{
			
				if(res.data.result === "SUCCESS"){
					this.balance = res.data.data
				}
			})
		},
		go_setPersonal(){
			uni.navigateTo({
				url:"../technician_personal/technician_personal"
			})
		},
		// 点击提现开启弹窗
		withdraw_deposit(){
			this.show = true
			this.animation.bottom(0).step()
			this.animationData = this.animation.export()
		},
		// 关闭弹窗
		close(){
			this.show = false
			this.animation.bottom(-350).step()
			this.animationData = this.animation.export()
		},
		// 跳转到钱包明细页面
		go_detail_account(){
			uni.navigateTo({
				url:"./tech_detail_account/tech_detail_account"
			})
		},
		// 立即提现
		sbumit(){
			if(!this.money) return uni.showToast({title:"请输入提现金额",icon:"none"})
			if(this.money < 1000) return uni.showToast({title:"提现金额最低1000",icon:"none",duration:2000})
			
			
			this.$http.post("/indent/indnetwithdraw",{
				money:this.money,
				tid:this.User.userinfo.tid
			}).then(([err,res])=>{
				if(res.data.result === "SUCCESS"){
					uni.showToast({
						title:"申请成功",
						duration:2000
					})
				}
			})
		}
	},
	onReady() {
		// 调用动画,获取animation
		var animation = uni.createAnimation({
			duration: 300,
			timingFunction: 'ease',
		})
		// 存入data
		this.animation = animation
	}
};
</script>

<style lang="less">
.content {
	.hd-empty {
		height: 160rpx;
	}
	.hd {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}
	.main {
		height: calc(100vh - 160rpx - 1rpx);
		border-top: 1rpx solid #e5e5e5;
		.top {
			margin-top: 50rpx;
			text-align: center;
			.top-img {
				width: 125rpx;
				height: 106rpx;
			}
			.tit {
				font-size: 22rpx;
				color: #333333;
			}
			.yuan {
				width: 34rpx;
				height: 34rpx;
				margin-right: 10rpx;
				vertical-align: middle;
			}
			.num {
				font-size: 44rpx;
				font-weight: 700;
				color: #333333;
				vertical-align: middle;
			}
		}
		.btn {
			height: 88rpx;
			line-height: 88rpx;
			margin: 100rpx 75rpx 0 75rpx;
			background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
			border-radius: 44px;
			font-size: 30rpx;
			text-align: center;
			color: #ffffff;
		}
		.mar-top30{
			height: 86rpx;
			margin-top: 30rpx;
			border: 1rpx solid #999999;
			background: #FFFFFF;
			color: #FF285C;
		}
		.hint{
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 40rpx;
			view{
				font-size: 18rpx;
				text{
					border-bottom: 1rpx solid;
					color: red;
				}
			}
			
		}
	}
	.pop-up-wrap{
		.shade{
			height: 100vh;
			width: 100vw;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 1000;
			background: rgba(0,0,0,0.5);
		}
		.pop-up {
			position: fixed;
			bottom: -700rpx;
			right: 0;
			left: 0;
			height: 700rpx;
			z-index: 1001;
			background: #FFFFFF;
			.h3 {
				padding-top: 58rpx;
				line-height: 36px;
				font-size: 36rpx;
				color: rgba(51, 51, 51, 1);
				text-align: center;
			}
			.li {
				display: flex;
				justify-content: space-between;
				height: 100rpx;
				margin: 0 20rpx;
				border-bottom: 1rpx solid #dadada;
				.left {
					display: flex;
					align-items: center;
					image {
						width: 42rpx;
						height: 42rpx;
						margin: 0 50rpx 0 5rpx;
					}
					text {
						font-size: 30rpx;
						font-weight: 600;
						color: rgba(51, 51, 51, 1);
					}
				}
				.right {
					display: flex;
					align-items: center;
					margin-right: 52rpx;
					font-size: 30rpx;
					.circle1 {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 22rpx;
						height: 22rpx;
						border: 1rpx solid rgba(250, 31, 31, 1);
						border-radius: 50rpx;
						.circle2 {
							width: 12rpx;
							height: 12rpx;
							background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
							border-radius: 50%;
						}
					}
				}
			}
			.input-box {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100rpx;
				margin: 0 20rpx;
				border-bottom: 1rpx solid #dadada;
				image {
					width: 34rpx;
					height: 34rpx;
					padding-right: 20rpx;
				}
				input {
					width: 222rpx;
					font-size: 30rpx;
				}
			}
		
			.service-charge {
				display: flex;
				justify-content: space-between;
				margin: 30rpx 20rpx 0 20rpx;
				.left {
					font-size: 20rpx;
					color: #666666;
				}
				.right {
					padding-right: 52rpx;
					text-align: right;
				}
			}
			.sbumit {
				height: 88rpx;
				line-height: 88rpx;
				margin: 40rpx 20rpx 0 20rpx;
				background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
				font-size: 30rpx;
				text-align: center;
				color: #ffffff;
			}
		}
	}
}
</style>
