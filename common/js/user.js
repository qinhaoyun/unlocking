import $http from "./request.js"
export default {
	// 用户token
	token: false,
	// 用户信息
	userinfo: false,
	//用户相关统计
	counts: {},
	// 初始化
	__init() {
		// 获取用户信息
		this.userinfo = uni.getStorageSync("userinfo");
		this.token = uni.getStorageSync("token");
		// this.counts = uni.getStorageSync("counts");
	},
	//权限跳转
	navigate(options, type = "navigateTo") {
		// 验证是否登录
		if (!$http.checkToken(true)) return;
		// 跳转
		switch (type) {
			case "navigateTo":
				uni.navigateTo(options);
				break;
			case "redirectTo":
				uni.redirectTo(options);
				break;
			case "reLaunch":
				uni.reLaunch(options);
				break;
			case "switchTab":
				uni.switchTab(options);
				break;
		}
	},
	// 登录
	async login(options = {}) {
		uni.showLoading({
			title: '登录中...',
			mask: true
		});
		// 请求登录
		let [err, res] = await $http.post(options.url, options.data);
		uni.hideLoading();
		if (res.data.result === 'SUCCESS') {
			this.token = res.data.data.token;
			this.userinfo = res.data.data;
			// 本地存储
			uni.setStorageSync("userinfo", this.userinfo);
			uni.setStorageSync("token", this.token);

			uni.showToast({
				title: '登录成功',
				duration: 500,
				success() {
					// 去首页
					if (options.type) {
						setTimeout(() => {
							uni.reLaunch({
								url: "../../pages/index/index"
							})
						}, 1000)
					} else {
						setTimeout(() => {
							uni.reLaunch({
								url: "../../pages/technician_Iindex/technician_Iindex"
							})
						}, 1000)
					}
				}
			});
		} else {
			uni.showToast({
				title: res.data.msg,
				icon: "none"
			})
		}
	},

	// 手机验证码登录
	async phone_login(options = {}, account) {
		uni.showLoading({
			title: '登录中...',
			mask: true
		});
		// 请求登录
		let [err, res] = await $http.post(options.url, options.data);

		uni.hideLoading();
		//验证验证码
		if (res.data.result === "SUCCESS") {
			if (res.data.data.password === null) {
				uni.navigateTo({
					url: "../../pages/register_success/register_success",
					success() {
						// 发送电话号码
						uni.$emit("postphone", {
							phone: account
						})
					}
				})
			} else {
				this.token = res.data.data.token;
				this.userinfo = res.data.data;
				// 本地存储
				uni.setStorageSync("userinfo", this.userinfo);
				uni.setStorageSync("token", this.token);

				uni.showToast({
					title: '登录成功',
					duration: 500,
					success: () => {
						// 去首页
						if (options.login_type) {
							setTimeout(() => {
								uni.reLaunch({
									url: "../../pages/index/index"
								})
							}, 1000)
						} else {
							setTimeout(() => {
								uni.reLaunch({
									url: "../../pages/technician_Iindex/technician_Iindex"
								})
							}, 1000)
						}

					}
				});
			}
		} else {
			uni.showToast({
				title: res.data.msg,
				icon: "none"
			})
		}
	},

	// 获取验证码
	async phone_code(options = {}, phone, terminal) {

		uni.showLoading({
			title: '发送中...',
			mask: true
		});
		// 拿到登录类型 技术员/用户
		let login_type = options.type

		let [err, res] = await $http.post(options.url, options.data);
		uni.hideLoading();
		// 拿到验证码
		let code = res.data.data
		if (res.data.result === "SUCCESS") {
			uni.redirectTo({
				url: "../../pages/get_code/get_code",
				success() {
					uni.$emit("get_code", {
						phone,
						code,
						terminal,
						login_type
					})
				}
			})
		} else {
			uni.showToast({
				title: res.data.msg,
				icon: "none"
			})
		}
	},

	// 微信登录
	async weixin_(userInfo,phone) {
		uni.showLoading({
			title: '登录中...',
			mask: true
		});
		let [err, res] = await $http.post("/logins/wxlogin", {
			openid: userInfo.openId,
			nickname: userInfo.nickName,
			headurl: userInfo.avatarUrl,
			unionid: userInfo.unionId,
			phone
		})
		uni.hideLoading();
		if (res.data.result === "SUCCESS") {
			this.token = res.data.data.token;
			this.userinfo = res.data.data;
			// 本地存储
			uni.setStorageSync("userinfo", this.userinfo);
			uni.setStorageSync("token", this.token);
			uni.showToast({
				title: '登录成功',
				duration: 500,
				success() {
					// 去首页
					setTimeout(() => {
						uni.reLaunch({
							url:"../../../pages/index/index"
						})
					}, 1000)
				}
			})
		} else {
			uni.showToast({
				title: res.data.msg,
				icon: "none"
			})
		}
	},
	// 第一次绑定手机号码登录
	weixin_2(res){
		this.token = res.data.data.token;
		this.userinfo = res.data.data;
		// 本地存储
		uni.setStorageSync("userinfo", this.userinfo);
		uni.setStorageSync("token", this.token);
		uni.reLaunch({
			url:"../../pages/index/index"
		})
	}
}
