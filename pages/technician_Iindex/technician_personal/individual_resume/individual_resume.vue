<template>
	<view class="content">
		<textarea v-model="text" placeholder="请输入您的个人简介" />
		<view class="sbumit" @tap="sbumit">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text:""
			};
		},
		onLoad() {
			uni.getStorage({
				key: "userinfo",
				success: (res) => {
					this.text = res.data.intro?res.data.intro:"";
				}
			})
		},
		methods:{
			sbumit(){
				// 修改
				this.$http.post("/user/updateTUserInfo",{tid:this.User.userinfo.tid,intro:this.text})
				.then(([err,res])=>{
					if(res.data.result === "SUCCESS"){
						// 请求修改后的信息
						this.$http.post("/user/selectUserInfo",{tid:this.User.userinfo.tid})
							.then(([err,res])=>{
								if(res.data.result === "SUCCESS"){
									// 保存
									uni.setStorageSync('userinfo', res.data.data);
									uni.showToast({
										title: '修改成功',
										success: () => {
											uni.navigateTo({
												url:"../technician_personal"
											})
										}
									});
								}else{
									uni.showToast({
										title:res.data.msg,
										icon:"none"
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
		background: #e5e5e5;
	}
	.content{
		textarea{
			width: 710rpx;
			margin-top: 20rpx;
			padding: 20rpx 20rpx;
			background: #FFFFFF;
		}
		.sbumit{
			height: 88rpx;
			line-height: 88rpx;
			margin: 40rpx 20rpx 0 20rpx;
			background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
			// border-radius: 44px;
			font-size: 30rpx;
			text-align: center;
			color: #ffffff;
		}
	}
</style>
