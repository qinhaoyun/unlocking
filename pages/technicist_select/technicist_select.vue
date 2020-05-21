<template>
	<view class="content">
		<view class="hd">
			<view class="empty"></view>
			<view class="nav">
				<view class="iconfont icon-arrow-lift-copy" @tap="back"></view>
			</view>
		</view>
		<view class="main">
			<text class="h1">选择行业类别</text>
			<view class="list-box">
				<view class="list" v-for="(item,index) in dataArr" :key="index">
					<view class="li" @tap="changeCheck(index)">
						<view class="select lf" :class="item.color">
							<view v-if="item.check" class="iconfont icon-dui"></view>
						</view>
						<text class="lf">{{item.name}}</text>
						<view class="open-shut rf" @click.stop="show_content(index)">
							<view v-if="item.active" class="iconfont icon-jiantoushang icon-red"></view>
							<view v-else class="iconfont icon-jiantoushang-copy-copy"></view>
						</view>
					</view>
					<view class="li-conten clearfix" v-if="item.active">
						<view :class="item.color" v-for="(item1,index1) in item.functions" :key="index1">{{item1.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="next" @tap="next">
			下一步
		</view>
		<view class="hint">
			<image src="../../static/images/technologistPic/xh.png" mode=""></image>
			<text>注：行业分类可以选择多个</text>
		</view>
		<view class="agreement">
			<image v-if="agreement_checked" src="../../static/images/tongyi.png" mode="" @tap="agreement"></image>
			<view v-else class="no-checked" @tap="agreement"></view>
			<text @tap="go_agreement">已阅读并同意《师傅注册》协议</text>
		</view>
	</view>
</template>
<script>
	let str1 = ""
	export default {
		data() {
			return {
				dataArr: [] ,// 后台返回得数据,用于赋值
				agreement_checked:false
			};
		},
		computed:{
			// 验证是否至少选中一项
			verifier_check(){
				return this.dataArr.every((item)=>{
					return item.check === false
				})
			}
		},
		methods: {
			// 跳转协议页面
			go_agreement(){
				uni.navigateTo({url:"../agreement/tech_agreement"})
			},
			// 勾选协议
			agreement(){
				this.agreement_checked = !this.agreement_checked
			},
			getId() {
				let str = ""
				let dataArr = JSON.parse(JSON.stringify(this.dataArr))
				// 拼接id
				for (var i = 0; i < dataArr.length; i++) {
					if(dataArr[i].check) {
						// 当str没有值得时候就赋值
						if (!str) str+=dataArr[i].id
						// 有值得时候就拼接上逗号
						else str +=  ',' + dataArr[i].id
					}
				}
				str1 = str
			},
			// 改变状态,显示隐藏li的类容
			show_content(index) {
				let isActive = this.dataArr[index].active
				this.dataArr[index].active = !isActive
			},
			// 点击选中和取消选中
			changeCheck(index) {
				let bool = !this.dataArr[index].check
				this.dataArr[index].check = bool
				// 存id得方法
				this.getId()
			},
			// 从后台请求数据方法
			async request(options) {
				let [err, res] = await this.$http.post(options.url)
				
				if(res.data.result === "SUCCESS"){
					let data = res.data.data
					data.forEach((item, index) => {
						// 设置 选中,显示,颜色 的属性
						item.check = false
						item.active = false
						item.color = "color" + index
					})
					// 保存数据
					this.dataArr = data
				}else{
					uni.showToast({
						title:res.data.msg 
					})
				}
			},
			// 进入下一步
			next(){
				if(!this.agreement_checked) return uni.showToast({title:"请详细阅读协议,并勾选!",icon:"none"})
				// 是否至少选中一项
				if(this.verifier_check){
					uni.showToast({
						title:"至少选择一项",
						icon:"none"
					})
				}else{
					uni.navigateTo({
						url:"../technicist_register/technicist_register",
						success:()=>{
							uni.$emit("sendStr",{data:str1})
						}
					})
				}
			},
			//返回上一页
			back(){
				uni.navigateBack({
					delta:1
				})
			}
		},
		onLoad() {
			// 发起请求
			this.request({
				url: "/function/selectFunction"
			})
		}

	}
</script>

<style lang="less">
	.content {
		.hd {
			.empty {
				height: 80rpx;
			}

			.nav {
				height: 50rpx;

				.iconfont {
					width: 40rpx;
					padding-left: 40rpx;
					font-size: 33rpx;
				}
			}
		}

		.main {
			padding: 50rpx 0 0 60rpx;

			.h1 {
				line-height: 40rpx;
				font-size: 40rpx;
				color: rgba(51, 51, 51, 1);
			}
			.list-box{
				margin-top: 30rpx;
			}
			.list {
				// margin-top: 30rpx;
				.li {
					height: 110rpx;
					border-bottom: 1px solid rgba(225, 225, 225, 1);
					line-height: 110rpx;
					.select {
						width: 60rpx;
						height: 60rpx;
						margin-top: 25rpx;
						margin-left: 25rpx;
						border-radius: 50%;
						color: #FFFFFF;
						text-align: center;
						.iconfont {
							height: 60rpx;
							font-size: 34rpx;
						}
					}

					text {
						margin-left: 34rpx;
						color: rgba(51, 51, 51, 1);
						font-size: 34rpx;
					}

					.open-shut {
						position: relative;
						height: 60rpx;
						width: 40rpx;
						margin-top: 25rpx;
						margin-right: 76rpx;

						.iconfont {
							position: absolute;
							color: rgba(182, 182, 182, 1);
							font-size: 40rpx;
						}

						.icon-red {
							color: red;
						}
					}
				}

				.li-conten {
					padding-top: 60rpx;
					padding-left: 40rpx;

					view {
						float: left;
						width: 140rpx;
						height: 54rpx;
						margin-right: 60rpx;
						margin-bottom: 60rpx;
						border-radius: 6px;
						line-height: 54rpx;
						text-align: center;
						color: #FFFFFF;
						font-size: 30rpx;
					}
				}
			}

			// 每个item的颜色
			.color0 {
				background: rgba(78, 142, 250, 1);
			}

			.color1 {
				background: rgba(124, 198, 35, 1);
			}

			.color2 {
				background: rgba(241, 178, 101, 1);
			}

			.color3 {
				background: rgba(124, 86, 251, 1);
			}

			.color4 {
				background: rgba(247, 107, 46, 1);
			}
		}

		.next {
			height: 88rpx;
			line-height: 88rpx;
			margin: 60rpx 60rpx 0 60rpx;
			text-align: center;
			background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
			color: #FFFFFF;
			font-size: 30rpx;
		}

		.hint {
			margin-left: 60rpx;

			image {
				width: 16rpx;
				height: 16rpx;
			}

			text {
				font-size: 22rpx;
			}
		}
		.agreement {
			width: 100%;
			position: fixed;
			left: 0;
			bottom: 46rpx;
			text-align: center;
		
			image {
				width: 42rpx;
				height: 42rpx;
				margin-left: -6rpx;
				vertical-align: middle;
			}
		
			text {
				font-size: 22rpx;
				vertical-align: middle;
			}
			.no-checked{
				display: inline-block;
				width: 23rpx;
				height: 23rpx;
				margin-right: 9rpx;
				border-radius: 50%;
				border: 1rpx solid rgb(255, 68, 95);
				vertical-align: middle;
			}
		}
	}
</style>
