<template>
	<view class="content">
		<view class="matters">
			<view class="h1">一、注意事项</view>
			<view class="matters-text">
				<view class="">1、用户下单后师傅在15分钟内接单，并致电给用户询问具体情况。</view>
				<view class="">2、具体情况与平台预估报价不符合，师傅会申请补差价，用户可通过平台补足差价或者申请退款（全额退款）。</view>
				<view class="">3、如沟通后同意师傅上门，而后又因为用户单方面原因或者实际情况与描述问题不符合导致无法服务的
					，平台根据服务类别固定收取20元作为上门费（不全额退款</view>
				<view class="">4、如需取消预约订单，需在预约时间前2小时外取消（全额退款），如在预约前2小时内取消，平台将扣取20元作为空单费（不全额退款）</view>
				<view class="">5、如需更换零部件或者非人工服务的产品，需提前准备好；如需师傅代购请自行与师傅协商解决。</view>
				<view class="">6、如师傅上门，因师傅原因未能满足用户的服务，平台全额退款，不收取任何费用。</view>
			</view>
		</view>
		<view class="promise">
			<view class="h1">二、平台承诺</view>
			<view class="promise-text">
				<view class=""> 1、所有服务人员全部持证上岗，专业的技术人员提供专业的服务。</view>
				<view class="">2、所有服务明码标价，收费标准统一，拒绝乱加价。</view>
				<view class="">3、根据不同的服务提供质保，凡在质保期间内出现非人为原因造成的故障，可联系平台免费返修解决。</view>
			</view>
		</view>
		<view class="quality-guarantee">
			<view class="tit">提供质保服务如下:</view>
			<view class="form border-top">
				<view class="">服务类目	</view>
				<view class="">质保时间</view>
				<view class="">备注</view>
			</view>
			<view class="form">
				<view class="">疏通</view>
				<view class="">7天</view>
				<view class=""><text>因有残留物导致的未完全疏通</text></view>
			</view>
			<view class="form">
				<view class="">安锁</view>
				<view class="">30天</view>
				<view class="">因安装未牢固导致松动脱落等</view>
			</view>
			<view class="form">
				<view class="">换锁</view>
				<view class="">根据产品保质期定</view>
				<view class="">根据产品售后保障定</view>
			</view>
			<view class="form">
				<view class="">安装</view>
				<view class="">30天</view>
				<view class="">因安装未牢固导致松动脱落等</view>
			</view>
		</view>
		<view class="flow-chart">
			<view class="h1">三、下单流程图</view>
			<view class="flow">
				<text>下单</text>
				<text>选择师傅</text>
				<text>上门服务</text>
				<text>客户验收</text>
				<text>售后质保</text>
			</view>
			<image src="../../static/images/liuchengtu.png" mode=""></image>
			<view class="flow">
				<view class="">
					<view class="">选择服务</view>
					<view class="">问题描述</view>
				</view>
				<view class="">
					<view class="">选择师傅</view>
					<view class="">电话沟通</view>
				</view>
				<view class="">
					<view class="">师傅上门</view>
					<view class="">服务</view>
					
				</view>
				<view class="">
					<view class="">结束订单</view>
					<view class="">订单评价</view>
					
				</view>
				<view class="">
					<view class="">售后质保</view>
					<view class=""></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less">
	.content{
		padding: 0 20rpx;
		.h1{
			font-size: 26rpx;
		}
		.flow-chart{
			margin-top: 58rpx;
			.h1{
				margin-bottom: 60rpx;
			}
			.flow{
				padding:0 120rpx;
				display: flex;
				justify-content: space-between;
				font-size: 18rpx;
				view{
					font-size: 18rpx;
				}
			}
		}
		image{
			width: 650rpx;
			height: 40rpx;
			margin: 0 30rpx;
		}
		.matters,.promise{
			.matters-text,.promise-text{
				margin: 0 26rpx;
				view{
					font-size: 20rpx;
					line-height: 36rpx;
				}
			}
		}
		.promise{
			.h1{
				color: #FF0000;
			}
			.promise-text{
				color: #FF0000;
			}
		}
		.quality-guarantee{
			margin:0 26rpx;
			width: 658rpx;
			.tit{
				font-size: 20rpx;
			}
			.form{
				display: flex;
				justify-content: space-between;
				border-left: 1rpx solid;
				view{
					display: flex;
					justify-content: center;
					align-items: center;
					width: 33.3333%;
					height: 72rpx;
					border-right: 1rpx solid;
					border-bottom: 1rpx solid;
					font-size: 20rpx;
					text-align: center;
				}
			}
			.border-top{
				border-top: 1rpx solid;
			}
		}
	}
</style>
