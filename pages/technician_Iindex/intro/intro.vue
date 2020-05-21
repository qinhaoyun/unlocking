<template>
	<view class="content">
		<hd-nav :title="title" :rtbtn="rtbtn"></hd-nav>
		<view class="main">
			<textarea class="intro" v-model="text" placeholder="请输入个人简介" />
			<view class="submit" @tap="submit">
				确定修改
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:"个人简介",
				rtbtn:"",
				text:""
			};
		},
		onLoad() {
			this.text = uni.getStorage({
				key:"userinfo",
				success: (res) => {
					this.text =  res.data
				}
			})
		},
		computed:{
			verText(){
				return this.text
			}
		},
		methods:{
			submit(){
				if(this.verText.length < 10){
					uni.showToast({
						title:"输入至少10个字",
						icon:"none"
					})
					return
				}
				this.$http.post("/user/updateTUserInfo",{
					tid:this.User.userinfo.tid,
					intro:this.text
				})
				.then(([err,res])=>{
					if(res.data.result === "SUCCESS"){
						this.$http.post("/user/selectUserInfo",{tid:this.User.userinfo.tid})
						.then(([err,res])=>{
							if(res.data.result === "SUCCESS"){
								uni.setStorageSync("userinfo",res.data.data)
								uni.showToast({
									title:"成功",
									success: () => {
										uni.navigateTo({
											url:"../technician_personal/technician_personal"
										})
									}
								})
							}
						})
						
					}
				})
				
			}
		}
	}
</script>

<style lang="less">
	page{
		background: rgb(238,238,238);
	}
	.content{
		.main{
			margin-top: 20rpx;
			.intro{
				width: 710rpx;
				background: #FFFFFF;
				padding: 10rpx 20rpx;
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
