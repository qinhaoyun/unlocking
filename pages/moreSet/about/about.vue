<template>
	<view class="content">
		<hd-nav :title="title" :rtbtn="rtbtn"></hd-nav>
		<view class="main">
			<view class="logo-version">
				<view class="pic">
					<image src="../../../static/images/login_logo.png" mode=""></image>
				</view>
				<text>木人岛v {{version}}</text>
			</view>
			<view class="introduce">
				<view class="text">
					整合日常生活中的刚需服务，建立家政服务细分领域的
					<br />
					服务入口
					<br />
					招募各城市运营商，通 过APP为各品牌智能锁 销售商解
					<br />
					决安装、维修 服务问题，形成长期持续的战略合作。
				</view>
				<view class="string"></view>
				<view class="contact">
					<view class="phone">
						电话:
						<text>023-62617874</text>
					</view>
					<view class="email">
						邮箱:
						<text>ylh@puskel.cn </text>
					</view>
				</view>
			</view>
			<view class="copyright">
				<text>puskel.cn版权所有</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "关于木人岛",
				rtbtn: "",
				version:""
			};
		},
		onLoad() {

			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				this.version = wgtinfo.version; //应用版本号
			})
		}
	}
</script>

<style lang="less">
	page {
		background: rgb(243, 244, 246);
	}

	.content {
		.main {
			.logo-version {
				height: 218rpx;
				text-align: center;

				image {
					margin-top: 48rpx;
					width: 88rpx;
					height: 86rpx;
				}

				text {
					color: #FF6C00;
					font-size: 20rpx;
				}
			}

			.introduce {
				padding: 0 22rpx;
				background: #FFFFFF;

				.text {
					padding: 35rpx 0;
					line-height: 30rpx;
					font-size: 24rpx;
					color: #333333;
				}

				.string {
					height: 1rpx;
					background: #E5E5E5;
				}

				.contact {
					padding: 30rpx 0 12rpx 0;

					.phone,
					.email {
						font-size: 24rpx;
					}

					text {
						color: #FF6C00;
					}
				}
			}

			.copyright {
				margin-top: 36rpx;
				text-align: center;

				text {
					line-height: 24rpx;
					color: #999999;
					font-size: 24rpx;
				}
			}
		}
	}
</style>
