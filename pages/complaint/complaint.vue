<template>
	<view class="content">
		<view class="hd">
			<view class="nav-box">
				<view class="empty"></view>
				<view class="nav">
					<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
					<text>订单投诉</text>
					<view class="right"></view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="h3">请选择您要处理的问题</view>
			<view class="set">
				<view class="li" @tap="check(0)">
					<text>{{txt0}}</text>
					<view class="right">
						<view class="iconfont icon-iconset0125" v-if="checked0"></view>
					</view>
				</view>
				<view class="li" @tap="check(1)">
					<text>{{txt1}}</text>
					<view class="right">
						<view class="iconfont icon-iconset0125" v-if="checked1"></view>
					</view>
				</view>
				<view class="li" @tap="check(2)">
					<text>{{txt2}}</text>
					<view class="right">
						<view class="iconfont icon-iconset0125" v-if="checked2"></view>
					</view>
				</view>
				<view class="li" @tap="check(3)">
					<text>{{txt3}}</text>
					<view class="right">
						<view class="iconfont icon-iconset0125" v-if="checked3"></view>
					</view>
				</view>
				<view class="li" @tap="check(4)">
					<text>{{txt4}}</text>
					<view class="right">
						<view class="iconfont icon-iconset0125" v-if="checked4"></view>
					</view>
				</view>
				<view class="li bor-none" @tap="rests">
					<text>其他</text>
					<view class="right">
						<view class="iconfont icon-gengduo1"></view>
					</view>
				</view>
				<textarea class="rests-box" v-if="rests_show" v-model="txtrests" placeholder="请输入您的反馈"/>
			</view>
		</view>
		<view class="submit" @tap="sbumit">
			提交
		</view>
	</view>
</template>

<script>
	let dataObj = null
	export default {
		data() {
			return {
				checked0:false,
				checked1:false,
				checked2:false,
				checked3:false,
				checked4:false,
				rests_show:false,
				txt0:"技术员无故加价",
				txt1:"技术员迟到爽约",
				txt2:"与派单人员不符",
				txt3:"技术员问题未能解决",
				txt4:"技术员态度恶劣",
				txtrests:"" // 其他
				
			};
		},
		onLoad() {
			uni.$once("complaint",(data)=>{
				dataObj = data
			})
		},
		methods:{
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			check(i){
				this["checked" + i] = !this["checked" + i]
			},
			rests(){
				this.rests_show = true
			},
			sbumit(){
				let text = ""
				for (let i = 0; i < 5; i++) {
					if(this["checked" + i]){
						text += this["txt"+i] + ","
					}
				}
				text += this.txtrests
				this.$http.post("/indent/complaint",{
					indent:dataObj.indent,
					uid:dataObj.uid,
					tid:dataObj.tid,
					reason:text
				}).then(([err,res])=>{
					if(res.data.result === "SUCCESS"){
						if(res.data.result === "SUCCESS"){
							uni.showToast({
								title:"投诉成功"
							})
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:"none"
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page{
		background:rgb(238,238,238)
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
		.main{
			margin-top: 42rpx;
			.h3{
				line-height: 26rpx;
				margin-left: 20rpx;
				font-size: 26rpx;
				color: #333333;
			}
			.set{
				margin-top: 22rpx;
				padding-bottom: 20rpx;
				background: #FFFFFF;
			}
			.li{
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 88rpx;
				margin-left: 20rpx;
				border-bottom: 1rpx solid #E5E5E5;
				color: #333333;
				font-size: 30rpx;
				text{
					margin-left: 22rpx;
				}
				.right{
					display: flex;
					align-items: center;
					justify-content: center;
					width: 40rpx;
					height: 40rpx;
					border: 1rpx solid #999999;
					border-radius: 50%;
					margin-right: 42rpx;
					color: #6E6E6E;
					.iconfont{
						color: #FF0000;
					}
				}
			}
			.bor-none{
				border: none;
				.right{
					border: none;
				}
			}
			.recompose{
				margin-top: 20rpx;
				background: #FFFFFF;								
			}
			.color-0{
				color:rgba(51,51,51,1);
			}
			.rests-box{
				width: 626rpx;
				height: 40rpx;
				padding: 20rpx;
				margin: 0 42rpx;
				border-bottom: 1rpx solid #e5e5e5;
				background: #e5e5e5;
			}
		}
		.submit{
			height:88rpx;
			line-height: 88rpx;
			margin: 100rpx 20rpx 0 20rpx;
			background:linear-gradient(94deg,rgba(255,40,92,1),rgba(255,137,110,1));
			text-align: center;
			color: #FFFFFF;
		}
	}
</style>
