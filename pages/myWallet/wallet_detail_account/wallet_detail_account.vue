<template>
	<view class="content">
		<view class="list" v-if="Arrdata.length">
			<view class="li" v-for="(item,index) in Arrdata" :key="index">
				<view class="left">
					<text>{{item.type=="REDUCE"?'消费':'充值'}}</text>
					<view class="time">{{item.createTime}}</view>
				</view>
				<view class="right">
					<text>{{item.money}}</text>
					<view class="balance">余额 {{balance}}</view>
				</view>
			</view>
		</view>
		<view class="empty" v-else>您还没有记录~</view>
		<uni-load-more :status="loadingType" :contentText="contentText" v-if="Arrdata.length"></uni-load-more>
	</view>
</template>

<script>
	//页数
	let pagenum = 0;
	let timer = null
	export default {
		data() {
			return {
				Arrdata:[] ,// 返回数据
				balance:0.00,
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
			uni.showNavigationBarLoading(); //显示加载动画
				this.$http.post("/indent/quarymoney",{
					uid:this.User.userinfo.uid
				}).then(([err,res])=>{
					uni.hideNavigationBarLoading(); //关闭加载动画
					if(res.data.result === "SUCCESS"){
						this.balance = res.data.data
					}else{
						uni.showToast({
							title:res.data.msg
						})
					}
				})
			
			pagenum = 0
			this.$http.post("/indent/quarymoneylist",{
				uid:this.User.userinfo.uid,
				pagenum,
				pagesize :14
			}).then(([err,res])=>{
				uni.hideNavigationBarLoading(); //关闭加载动画
				
				if(res.data.result === "SUCCESS"){
					this.Arrdata = res.data.data
					if(this.Arrdata.length < 14){
						this.loadingType = "noMore"
						return
					}
					this.loadingType = "more"
					
					pagenum++
				}
			})
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
			request_more(){
				if (this.loadingType === "noMore") {
					return false; //直接返回
				}
				this.loadingType = "loading";
				uni.showNavigationBarLoading(); //显示加载动画
				this.$http.post("/indent/quarymoneylist",{
					uid:this.User.userinfo.uid,
					pagenum,
					pagesize :14
				}).then(([err,res])=>{
					uni.hideNavigationBarLoading(); //关闭加载动画
					if(res.data.result === "SUCCESS"){
						if(res.data.data.length === 0){
							this.loadingType = "noMore"
							return
						}
						this.Arrdata = this.Arrdata.concat(res.data.data)
						pagenum++
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.content{
		.list{
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
		.empty{
			text-align: center;
			font-size: 30rpx;
		}
	}
</style>
