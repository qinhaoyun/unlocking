<template>
	<view class="content">
		<view class="li" v-for="(item,index) in detail" :key="index">
			<view class="left">
				<text>{{item.type==="REDUCE"?"提现":"收入"}}</text>
				<view class="time">{{item.createTime}}</view>
			</view>
			<view class="right">
				<text>{{item.money}}</text>
				<view class="balance">余额 {{balance}}</view>
			</view>
		</view>
		<uni-load-more :status="loadingType" :contentText="contentText" v-if="detail.length"></uni-load-more>
	</view>
</template>

<script>
	let pagenum = 0;
	// 上拉定时器
	let timer = null
	export default {
		data() {
			return {
				detail:[] ,// 流水明细
				balance:"0.00",
				loadingType: "more",
				showImage: true,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
			};
		},
		onLoad() {
			// 请求明细
			this.request()
			// 请求余额
			this.request1()
		},
		// 上拉加载
		onReachBottom() {
			if (timer != null) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				this.request_more();
			}, 1000);
		},
		methods:{
			request(){
				uni.showNavigationBarLoading(); //显示加载动画
				pagenum = 0;
				this.$http.post("/indent/quarymoneylist",{tid:this.User.userinfo.tid,pagenum,pagesize:14})
				.then(([err,res])=>{
					
					if(res.data.result === "SUCCESS"){
						uni.hideNavigationBarLoading(); //关闭加载动画
						
						this.detail = res.data.data
						if(this.detail.length < 14){
							this.loadingType = "noMore"
							return
						}
						this.loadingType = "more"
						pagenum++
					}
				})
			},
			request1(){
				this.$http.post("/indent/quarymoney",{tid:this.User.userinfo.tid})
				.then(([err,res])=>{
					if(res.data.result === "SUCCESS"){
						this.balance = res.data.data
					}else{
						uni.showToast({title:res.data.msg,icon:"none"})
					}
				})
			},
			request_more(){
				if (this.loadingType === "noMore") {
					return false; //直接返回
				}
				this.loadingType = "loading";
				uni.showNavigationBarLoading(); //显示加载动画
				this.$http.post("/indent/quarymoneylist",{tid:this.User.userinfo.tid,pagenum,pagesize:14})
				.then(([err,res])=>{
					if(res.data.result === "SUCCESS"){
						uni.hideNavigationBarLoading(); //关闭加载动画
						if(res.data.data.length === 0){
							this.loadingType = "noMore"
							return
						}
						this.detail = this.detail.concat(res.data.data)
						pagenum++
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.content{
		.li{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 120rpx;
			margin: 0 20rpx;
			border-bottom: 1rpx solid #E5E5E5;
			text{
				font-size: 26rpx;
			}
			.time{
				font-size: 20rpx;
			}
			.balance{
				font-size: 20rpx;
			}
			.right{
				text-align: right;
			}
		}
	}
</style>
