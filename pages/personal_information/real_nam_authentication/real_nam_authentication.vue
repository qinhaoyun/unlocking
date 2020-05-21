<template>
	<view class="content">
		<hd-nav :title="title" :rtbtn="rtbtn"></hd-nav>
		<view class="main">
			<view class="name">
				<view class="name-box">
					<text>真实姓名</text>
					<input type="text" v-model="name" placeholder="请输入真实姓名" placeholder-class="txt-indent"/>
				</view>
			</view>
			<view class="name">
				<view class="name-box bor-top">
					<text>身份证号</text>
					<input type="text" v-model="Id_number" placeholder="请输入身份证号" placeholder-class="txt-indent"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:"实名信息",
				rtbtn:"保存",
				Id_number:"",
				name:""
			};
		},
		computed:{
			// 验证姓名
			verifierName() {
				let reg = /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,10}$/
				return reg.test(this.name)
			},
			// 验证身份证号码
			verifierID() {
				let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
				return reg.test(this.Id_number)
			},
		},
		methods:{
			authentication(){
				if(!this.verifierName){
					uni.showToast({title:"输入姓名",icon:"none"})
					return	
				}
				if(!this.verifierID){
					uni.showToast({title:"身份证格式错误",icon:"none"})
					return
				}
				this.$http.post("/user/updateUserInfo",{
					uid:this.User.userinfo.uid,
					IDcard:this.Id_number,
					realname:this.name
				}).then(([err,res])=>{
					if(res.data.result === "SUCCESS"){
						uni.showToast({
							title:"成功",
							success() {
								uni.navigateTo({
									url:"../personal_information"
								})
							}
						})
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
					}
				})
			}
		}
	}
</script>
<style lang="less">
	page{
		background: rgb(243,244,246);
	}
	.content{
		.main {
			margin-top: 22rpx;
			.name {
				height: 88rpx;
				line-height: 88rpx;
				font-size: 30rpx;
				background: #FFFFFF;
				.name-box{
					display: flex;
					margin-left: 20rpx;
					text{
						line-height: 88rpx;
						font-size: 30rpx;
					}
					input {
						flex: 1;
						height: 88rpx;
						margin-left: 20rpx;
					}
					.txt-indent{
						text-indent: 40rpx;
					}
				}
				.bor-top{
					border-top: 1rpx solid #E5E5E5;
				}
			}
		}
	}
</style>
