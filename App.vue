<script>
	export default {
		onLaunch: function() {
			// uni.redirectTo({
			// 	url: 'pages/technician_Iindex/technician_personal/bank_card/bank_card'
			// });
			// return
			// 网路监听（用户目前断网，切换wifi）
			// this.lib.NetWork.On();
			
			// this.lib.Update()
			// 判断是否登录
			uni.getStorage({
				key: "userinfo",
				success: (res) => {
					if(res.data.uid){
						uni.redirectTo({
							url:"./pages/index/index"
						})
					}
					if(res.data.tid){
						uni.redirectTo({
							url: './pages/technician_Iindex/technician_Iindex'
						});
					}
				},
				fail(err) {
					uni.redirectTo({
						url: "./pages/login/login"
					})
				}
			})
			// 初始化用户状态
			this.User.__init();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import url("./common/css/uni.css");
	@import url("./common/css/fonticon.css");

	page {
		width: 100%;
	}

	.fx {
		display: flex;
	}

	/* 左右浮动 */
	.lf {
		float: left;
	}

	.rf {
		float: right;
	}

	/* 去浮动 */
	.clearfix:after {
		display: block;
		content: "";
		clear: both;
	}

	/* 右边距为0 */
	.mar0-r {
		margin-right: 0 !important;
	}

	/* 字体红色 */
	.c-red {
		color: red;
	}

	image {
		vertical-align: middle;
	}
</style>
