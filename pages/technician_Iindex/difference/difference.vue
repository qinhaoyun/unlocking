<template>
	<view class="content">
		<hd-nav :title="title" :rtbtn="right"></hd-nav>
		<view class="content">
			<view class="main">
				<view class="li">
					<text>差价:</text>
					<input type="number" v-model="money" placeholder="请输入需补差价(元)"/>
				</view>
				<textarea v-model="justly" placeholder="请输入支付差价的理由" placeholder-class="text-indent"/>
				<view class="submit" @tap="submit">
					确认提交
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let indent = null
	export default {
		data() {
			return {
				title:"补差价",
				right:"",
				money:"",
				justly:""
			}
		},
		onLoad() {
			uni.$once("diff_indent",(data)=>{
				indent = data.indent
			})
		},
		methods: {
			submit(){
				if(!this.money){uni.showToast({
						title:"价格不能位空",
						icon:"none"
					})
					return
				}
				if(!this.justly){
					uni.showToast({
						title:"理由不能为空",
						icon:"none"
					})
					return
				}
				this.$http.post("/indent/tusertwomoney",{
					indent,
					money:this.money,
					reason:this.justly
				}).then(([err,res])=>{
					if(res.data.result === "SUCCESS"){
						uni.showToast({
							title:"成功",
							success() {
								uni.navigateTo({
									url:"../orderDetails/orderDetails",
									success: () => {
										uni.$emit("tec_sendindent",{indent})
									}
								})
							}
						})
					}else{
						uni.showToast({
							title:res.data.msg
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page{
		background: rgb(243,244,248);
	}
	.content{
		.main{
			.li{
				display: flex;
				align-items: center;
				margin-top: 10rpx;
				height: 88rpx;
				padding-left: 20rpx;
				background: #FFFFFF;
				font-size: 30rpx;
				input{
					margin-left: 20rpx;
				}
			}
			textarea{
				width: 730rpx;
				height: 200rpx;
				margin: 10rpx 0;
				padding: 0 20rpx;
				background: #FFFFFF;
				.text-indent{
					font-size: 30rpx;
				}
			}
			.submit{
				height: 88rpx;
				line-height: 88rpx;
				margin: 30rpx 20rpx 0 20rpx;
				text-align: center;
				color: #FFFFFF;
				font-size: 36rpx;
				background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
			}
		}
	}
</style>
