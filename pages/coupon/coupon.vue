<template>
	<view class="content">
		<view class="hd-empty"></view>
		<view class="hd">
			<hdNav class="hd-n" title="优惠卷" rtbtn="使用明细"></hdNav>
			<view class="hd-tab">
				<text :class="active === 0 ? 'cor-red bor-bot' : ''" @tap="showTab(0)">未使用</text>
				<text :class="active === 1 ? 'cor-red bor-bot' : ''" @tap="showTab(1)">已失效</text>
			</view>
		</view>
		<view class="main-list">
			<view class="main unused" :class="active === 0 ? 'left-0' : 'left-lose100'">
				<view class="list-box" v-if="unused.length">
					<view class="coupon-list" v-for="(item,index) in unused" :key="index">
						<view class="coupon">
							<view class="top">
								<view class="left">
									<view class="type-coupon">{{item.describe}}</view>
									<view class="deadline">{{item.createtime}}-{{item.endtime}}有效</view>
								</view>
								<view class="right">
									<view class="money">
										<text class="num">{{item.money}}</text>
										元
									</view>
									<view class="condition">满{{item.total}}元可用</view>
								</view>
							</view>
							<view class="bottom" @tap="look(index)">
								<text>查看详细规则</text>
								<view class="iconfont icon-jiantoushang-copy-copy"></view>
							</view>
							<view class="rule" :class="show && active1===index? 'rule-transition':''">
								<view class="item-one">1.使用于</view>
								<view class="">2.有效时间: {{item.createtime}}-{{item.endtime}}</view>
							</view>
							<view class="arch"></view>
						</view>
						<view class="coupon-empty" :class="show && active1===index? 'dsp-block' : ''"></view>
					</view>
				</view>
				<view class="unused-empty" v-else>无优惠卷...</view>
			</view>
			<view class="main lose-efficacy" :class="active === 1 ? 'left-0' : ''">
				<view class="list-box" v-if="lose_efficacy.length">
					<view class="coupon-list" v-for="(item,index) in lose_efficacy" :key="index">
						<view class="coupon">
							<view class="top">
								<view class="left">
									<view class="type-coupon">{{item.describe}}</view>
									<view class="deadline">{{item.createtime}}-{{item.endtime}}有效</view>
								</view>
								<view class="right">
									<view class="money">
										<text class="num">{{item.money}}</text>
										元
									</view>
									<view class="condition">满{{item.total}}元可用</view>
								</view>
							</view>
							<view class="bottom" @tap="look(index)">
								<text>查看详细规则</text>
								<view class="iconfont icon-jiantoushang-copy-copy"></view>
							</view>
							<view class="rule" :class="show && active1===index? 'rule-transition':''">
								<view class="item-one">1.使用于</view>
								<view class="">2.有效时间: {{item.createtime}}-{{item.endtime}}</view>
							</view>
							<view class="arch"></view>
						</view>
						<view class="coupon-empty" :class="show && active1===index? 'dsp-block' : ''"></view>
					</view>
				</view>
				<view class="lose_efficacy-empty" v-else>无优惠卷...</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			active: 0,
			active1:null, // 查看规则
			unused: [], // 未使用过的优惠价
			lose_efficacy: [] ,// 已失效的优惠卷
			negation:true ,// 显示关闭取反
			show:false // 显示隐藏
		};
	},
	onLoad() {
		this.request_unused(); // 未使用过的优惠价
		this.request_lose_efficacy(); // 已失效的优惠卷
	},
	methods: {
		// 父组件方法,跳转使用明细
		authentication(){
			uni.navigateTo({url:"./coupon_detail/coupon_detail"})
		},
		showTab(i) {
			this.active = i;
		},
		look(index) {
		
			// 第一次true 点击显示
			if(this.negation){
				// 序号赋值
				this.active1 = index;
				
				// 如果序号相等并且开关值为true,就为显示
				this.show = this.active1 === index && this.negation
			}
			// 序号相等,开关值为false,就为关闭
			if(this.active1 === index && !this.negation){
				this.show = false
			}
			// 一个优惠卷打开的时候,下一次点击其他优惠卷时,序号赋值,开关状态变为为true
			if(this.active1 !== index){
				this.active1 = index
				this.negation = !this.negation
				// 当前优惠卷打开
				this.show = this.active1 === index && this.negation
			}
			// 每次点击过后开关值取反,下次点击就取反
			this.negation = !this.negation
		},
		request_unused() {
			this.$http.post('/indent/selectcoupon', { uid: this.User.userinfo.uid, state: 0 }).then(([err, res]) => {
				
				if (res.data.result === 'SUCCESS') {
					this.unused = res.data.data;
				}
			});
		},
		request_lose_efficacy() {
			
			this.$http.post('/indent/selectcoupon', { uid: this.User.userinfo.uid, state: 2 }).then(([err, res]) => {
			
				if (res.data.result === 'SUCCESS') {
					this.lose_efficacy = res.data.data;
				}
			});
		}
	},
	onReady() {
		
	}
};
</script>

<style lang="less">
page {
	background: rgb(243, 244, 246);
}
.content {
	.hd-empty{
		height: 214rpx;
	}
	.hd {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
		width: 100%;
		background: #FFFFFF;
		.hd-n,.hd-tab{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			z-index: 999;
		}
		.hd-tab {
			top: 160rpx;
			padding-left: 40rpx;
			background: #FFFFFF;
			text {
				font-size: 30rpx;
				margin-right: 73rpx;
			}
			.cor-red {
				color: #ff4800;
			}
			.bor-bot {
				border-bottom: 1rpx solid #ff4800;
			}
		}
	}
	.main-list {
		position: relative;
		width: 100vw;
		height:calc(100vh - 214rpx);
		overflow-y: auto;
		overflow-x: hidden;
		.main {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			margin-bottom: 87rpx;
			.list-box{
				.coupon-list {
					display: flex;
					justify-content: center;
					margin-top: 20rpx;
					.coupon-empty{
						display: none;
						height: 307rpx;
					}
					.dsp-block{
						display: block;
					}
					.coupon {
						position: relative;
						width: 652rpx;
						height: 220rpx;
						background: #ffffff;
						box-shadow: 0px 11px 25px 2px rgba(198, 198, 198, 0.2);
						border-radius: 30rpx;
						.arch {
							position: absolute;
							top: 60rpx;
							right: -25rpx;
							z-index: 100;
							width: 50rpx;
							height: 100rpx;
							border-radius: 50%;
							background: rgb(243, 244, 246);
						}
						.top {
							display: flex;
							justify-content: space-between;
							align-items: center;
							height: 160rpx;
							padding: 0 56rpx 0 17rpx;
							.type-coupon {
								height: 60rpx;
								line-height: 60rpx;
								font-size: 28rpx;
								color: #333333;
							}
							.deadline {
								font-size: 22rpx;
								color: #999999;
							}
							.right {
								text-align: center;
								.money {
									height: 60rpx;
									line-height: 60rpx;
									color: #ff0000;
									font-size: 22rpx;
									.num {
										font-size: 36rpx;
									}
								}
								.condition {
									font-size: 22rpx;
									color: #999999;
								}
							}
						}
						.bottom {
							display: flex;
							align-items: center;
							padding-left: 17rpx;
							border-top: 1rpx dashed #e5e5e5;
							font-size: 24rpx;
							color: #999999;
						}
						.rule {
							position: relative;
							top: -60rpx;
							z-index: -1;
							height: 58rpx;
							padding-left: 17rpx;
							box-shadow: 0px 11px 25px 2px rgba(198, 198, 198, 0.4);
							border-radius: 10px;
							overflow: hidden;
							background: rgb(252, 251, 251);
							.item-one {
								padding-top: 66rpx;
							}
							view {
								font-size: 20rpx;
								color: #999999;
							}
						}
						.rule-transition {
							height: 145rpx;
							transition: 0.5s;
						}
					}
				}
			}
			.unused-empty,.lose_efficacy-empty{
				width: 100vw;
				font-size: 40rpx;
				text-align: center;
			}
		}
		.lose-efficacy{
			left: 750rpx;
		}
		.left-0{
			left: 0;
			transition: 0.5s;
		}
		.left-lose100{
			left: -100%;
		}
	}
	
	
}
</style>
