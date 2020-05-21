import $http from "./request.js";
// 网络监听
const NetWork = {
	// 网络状态
	isConnect: false,
	// 监听网络状态
	On() {
		// 获取当前网络状态
		uni.getNetworkType({
			success: (res) => {
				if (res.networkType !== 'none') {
					this.isConnect = true;
					return;
				}
				uni.showToast({
					icon: "none",
					title: '请先连接网络',
				});
			}
		})
		// 监听网络状态变化
		uni.onNetworkStatusChange((res) => {
			this.isConnect = res.isConnected;
			if (!res.isConnected) {
				uni.showToast({
					icon: "none",
					title: '您目前处于断网状态',
				});
			}
		})
	}
}

// app更新
const Update = function(showToast = false) {
	// #ifdef APP-PLUS  
	let runapp = null  // 运行的环境
	runapp = uni.getSystemInfoSync().platform
	plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
		// console.log(widgetInfo);

		$http.post('/logins/updateAPP', {
			version: widgetInfo.version,
		}).then((result) => {
			let [err, res] = result;
			// 成功
			var data = res.data.data;
			// console.log(data);
			if (!data.url) {
				// 无需更新
				if (showToast) {
					return uni.showToast({
						title: '无需更新',
						icon: "none"
					})
				}
			}
			uni.showModal({
				title: '发现新的版本',
				content: '最新版本：' + data.version,
				cancelText: '放弃更新',
				confirmText: '立即更新',
				success: res => {
					// 用户点击确认更新
					if (res.confirm) {
						// 判断运行环境是
						if (runapp === "ios") {
							// 如果在ios端 又是热跟新,那么直接下载,如果是整包更新就跳转到商店更新
							if (data.url.match(RegExp(/.wgt/))) {
								uni.downloadFile({
									url: data.url,
									success: (downloadResult) => {
										if (downloadResult.statusCode === 200) {
											console.log(downloadResult.tempFilePath);
											plus.runtime.install(downloadResult.tempFilePath, {
												force: false
											}, function() {
												console.log('install success...');
												plus.runtime.restart();
											}, function(e) {
												console.log(e)
												console.error('install fail...');
											});
										}
									}
								});
							} else {
								plus.runtime.openURL(data.url)
							}
						} else {
							// 安卓端直接下载更新覆盖
							uni.downloadFile({
								url: data.url,
								success: (downloadResult) => {
									if (downloadResult.statusCode === 200) {
										console.log(downloadResult.tempFilePath);
										plus.runtime.install(downloadResult.tempFilePath, {
											force: false
										}, function() {
											console.log('install success...');
											plus.runtime.restart();
										}, function(e) {
											console.log(e)
											console.error('install fail...');
										});
									}
								}
							});
						}
					}
				}
			});
		});
	});
	// #endif  
}

import config from "./config.js"
export default {
	NetWork,
	Update
}
