<template>
	<view class="content">
		<view class="norm-box" :class="active ? 'norm-box-tran' : ''">
			<view class="norm" @tap="open_close(0)">
				<text>木人岛平台服务标准总则</text>
				<view v-if="!active" class="iconfont icon-jiantoushang-copy-copy"></view>
				<view v-else class="iconfont icon-jiantoushang"></view>
			</view>
			<view class="norm-text">
				<view class="front">
					本着消费者为上帝、服务至上的原则，与平台合作的师傅达成共识。制定以下服务标准， 平台方有权对未按照标准进行服务的师傅进行处罚、情节严重者甚至终止合作。
				</view>
				<view class="norm-main">
					<view class="norm-li">
						<view class="tit">一、电话询单</view>
						<view class="norm-intro">
							当消费者下单后，师傅应及时与消费者取得联系，电话确认服务具体内容。如服务价格与平台预估报价不符合，
							应与消费者重新确认服务价格并说明原因。通话全过程坚持礼貌服务、文明用语。不得先于消费者挂断电话。具体范本如下：
						</view>
						<view class="txt">A：您好！我是木人岛做XX服务的师傅，感谢您选择我为您服务。为了更好的服务质量，我电话跟您确定一下具体的服务内容，您看现在方便吗？</view>
						<view class="txt">B：好的，我了解了。平台的预估报价与实际相符，我即刻出发，预计到达目的地XX时XX分，服务时长约XX分。</view>
						<view class="txt">B1：好的，我了解了。因为XX原因，实际价格与平台预估报价不吻合，需要补XX差价。您同意吗？</view>
						<view class="txt">C：好的，一会见！</view>
						<view class="txt">C1：非常抱歉不能为您服务，您可以申请退款。您支付的金额会全额返还给您的，期待以后有机会能为您服务。再见！</view>
					</view>
					<view class="norm-li">
						<view class="tit">二、仪容仪表</view>
						<view class="norm-intro">为树立良好的服务形象，服务人员应注意自己的外在形象，保持整洁干净，具体要求如下：</view>
						<view class="txt">1、所有服务人员必须穿制式统一服装，并保证服装整洁、完整。</view>
						<view class="txt">2、不得外露纹身、穿拖鞋进行服务。</view>
						<view class="txt">3、面容整洁、身着干净。</view>
					</view>
					<view class="norm-li">
						<view class="tit">三、上门服务</view>
						<view class="norm-intro">
							到达目的地后，应正常登记，不可擅自进入。礼貌敲门，说明来意并主动出示工作证。若进入消费者家里应穿戴脚套（自备脚套），
							根据服务类别进行服务，不得进入不必要区域、咨询与服务无关问题或触碰与服务无关设备。
						</view>
					</view>
					<view class="norm-li">
						<view class="tit">四、核实服务</view>
						<view class="norm-intro"></view>
						<view class="txt">1、给消费者明确服务具体流程以及预计时长。</view>
						<view class="txt">2、如需拆装设备，应提前告知消费者并指明问题点。</view>
						<view class="txt">3、如需临时加价应说明原因，若消费者拒绝应把设备恢复原样。</view>
					</view>
					<view class="norm-li">
						<view class="tit">五、现场清理</view>

						<view class="txt">1、服务完成后应对现场进行清理，恢复原样（清洁类除外）。</view>
						<view class="txt">2、服务完成后拆卸的或破损的零部件应主动交于消费者，不得私自带走。</view>
						<view class="txt">3、服务过程中所产生的无用垃圾应主动收集带走。</view>
						<view class="txt"></view>
						<view class="txt"></view>
					</view>
					<view class="norm-li">
						<view class="tit">六、成果验收</view>

						<view class="txt">1、服务结束后应主动邀请消费者进行验收，以确保服务质量。</view>
						<view class="txt">2、消费者验收时应全程陪同，并给消费者指出潜在风险以及注意事项。</view>
						<view class="txt">3、消费者验收后应与用户确认并开具凭证（电子凭证）。</view>
					</view>
					<view class="norm-li">
						<view class="tit">七、完成离场</view>
						<view class="txt">1、所有服务完成后给消费者明确售后保障。</view>
						<view class="txt">2、应给消费者明确售后渠道。</view>
					</view>
				</view>
			</view>
		</view>
		<view class="norm-box" :class="active1 ? 'norm-box-tran1' : ''">
			<view class="norm" @tap="open_close(1)">
				<text>木人岛服务管理制度</text>
				<view v-if="!active1" class="iconfont icon-jiantoushang-copy-copy"></view>
				<view v-else class="iconfont icon-jiantoushang"></view>
			</view>
			<view class="norm-text">
				<!-- <view class="front">
					本着消费者为上帝、服务至上的原则，与平台合作的师傅达成共识。制定以下服务标准， 平台方有权对未按照标准进行服务的师傅进行处罚、情节严重者甚至终止合作。
				</view> -->
				<view class="norm-main">
					<view class="norm-li">
						<view class="tit">一、平台机制</view>
						<!-- <view class="norm-intro">
							当消费者下单后，师傅应及时与消费者取得联系，电话确认服务具体内容。如服务价格与平台预估报价不符合，
							应与消费者重新确认服务价格并说明原因。通话全过程坚持礼貌服务、文明用语。不得先于消费者挂断电话。具体范本如下：
						</view> -->
						<view class="txt">1、所有服务人员必须拥有对应领域的服务职业证。</view>
						<view class="txt">2、所有服务人员入驻平台都必须缴纳一定保证金，具体金额视服务类别而定（具体服务费金额见下表）。</view>
						<view class="txt">3、当保证金低于一定数额时则针对该服务人员平台不与匹配服务订单，直到补足保证金为止。</view>
						<view class="txt">4、平台和服务人员合作终止时，平台方全额退还该服务人员所交保证金，被平台罚款扣除部分除外。</view>
					</view>
					<view class="norm-li">
						<view class="tit">二、惩罚措施</view>
						<!-- <view class="norm-intro">为树立良好的服务形象，服务人员应注意自己的外在形象，保持整洁干净，具体要求如下：</view> -->
						<view class="txt">1、服务人员被用户投诉者，视情况扣除服务人员的保证金，情节严重者终止合作（用户恶意投诉除外）。</view>
						<view class="txt">
							2、服务人员被用户给予差评者，按照每个差评10元的金额扣除保证金，年度累计差评达到10者，将被限制接单， 情节严重者终止合作（恶意差评除外）。
						</view>
					</view>
					<view class="norm-li">
						<view class="tit">三、奖励制度</view>
						<!-- <view class="norm-intro">
							到达目的地后，应正常登记，不可擅自进入。礼貌敲门，说明来意并主动出示工作证。若进入消费者家里应穿戴脚套（自备脚套），
							根据服务类别进行服务，不得进入不必要区域、咨询与服务无关问题或触碰与服务无关设备。
						</view> -->
						<view class="txt">1、服务人员月度完成订单量达60者，平台给予一次性奖励388元；月度完成订单量达100者，平台给予一次性奖励888元。</view>
						<view class="txt">2、年度用户好评数达到500者，平台给予一次性奖励1200元（系统默认好评不纳入此政策）。</view>
					</view>
					<view class="norm-li">
						<view class="tit">四、争议处理</view>
						<view class="txt">1、服务人员按照约定时间为用户提供服务。若服务人员在无法在预约时间提供服务的，应征得用户同意后另行约定时间或者协助用户全额退款。</view>
						<view class="txt">2、服务人员按照约定地点为用户提供服务。若服务人员在无法在预约地点提供服务的，应征得用户同意后另行约定或者协助用户全额退款。</view>
						<view class="txt">3、服务人员在服务过程中，不得无故加价，为按照平台标准收费或者胡乱加价者，一经平台发现，将视情节严重性扣除保证金或终止合作。</view>
						<view class="txt">4、不得与用户在私下交易，一经平台发现，将视情节严重性扣除保证金或终止合作（用户特别提出需求让代购的材料费除外）。</view>
						<view class="txt">
							5、服务人员对自己的服务成果负责，根据不同服务类别，严格遵守平台的售后服务标准，在服务保质期内， 提供对应的售后服务（见用户端用户订购须知详情页）。
						</view>
						<view class="txt">6、当用户投诉，产生争议时，应积极配合平台客观、真实的反应情况，协助平台处理纠纷问题。</view>
						<view class="txt">7、若在服务过程中，损坏用户财产的应照价赔偿。</view>
					</view>
					<view class="form-tit">各服务类目需缴纳保证金如下:</view>
					<view class="table">
						<view class="table-list">
							<view class="">服务类目</view>
							<view class="">安锁</view>
							<view class="">开锁</view>
							<view class="">换锁</view>
							<view class="">安装</view>
							<view class="">疏通</view>
							<view class="">清洁（开荒）</view>
							<view class="">清洁（玻璃）</view>
							<view class="">清洁（空调）</view>
						</view>
						<view class="table-list">
							<view class="">服务费单价</view>
							<view class="">99----168</view>
							<view class="">58----199</view>
							<view class="">88----159</view>
							<view class="">59----159</view>
							<view class="">49/次</view>
							<view class="">3.5/平米</view>
							<view class="">5/平米</view>
							<view class="">80/台</view>
						</view>
						<view class="table-list">
							<view class="">保证金金额</view>
							<view class="">2000</view>
							<view class="">2000</view>
							<view class="">2000</view>
							<view class="">2000</view>
							<view class="">1000</view>
							<view class="">1000</view>
							<view class="">1000</view>
							<view class="">1000</view>
						</view>
						<view class="table-list">
							<view class="">备注</view>
							<view class="">门、锁的价格</view>
							<view class=""></view>
							<view class=""></view>
							<view class=""></view>
							<view class=""></view>
							<view class=""></view>
							<view class=""></view>
							<view class=""></view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			active: false,
			active1:false
		};
	},
	methods: {
		open_close(i) {
			if(i===0) this.active = !this.active;
			if(i===1) this.active1 = !this.active1;
		}
	},
	onReady() {
		
	}
};
</script>

<style lang="less">
.content {
	.norm-box {
		height: 88rpx;
		margin-top: 40rpx;
		border: 1rpx solid #e5e5e5;
		overflow: hidden;
		.norm {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 88rpx;
			padding: 0 40rpx;
			font-size: 32rpx;
			font-weight: bold;
			.iconfont {
				font-size: 32rpx;
			}
		}
		.norm-text {
			.front {
				padding: 0 40rpx;
				font-size: 30rpx;
				line-height: 32rpx;
			}
			.norm-main {
				.norm-li {
					margin-top: 20rpx;
					.tit {
						font-size: 30rpx;
						font-weight: bold;
					}
					.norm-intro {
						text-indent: 2em;
						font-size: 28rpx;
						line-height: 32rpx;
					}
					.txt {
						padding: 10rpx 40rpx 0 40rpx;
						font-size: 26rpx;
						line-height: 28rpx;
					}
				}
				.form-tit {
					margin-top: 20rpx;
					font-size: 30rpx;
					font-weight: bold;
				}
				.table {
					display: flex;
					width: 600rpx;
					height: 418rpx;
					margin: 20rpx auto;
					border-right: 1rpx solid;
					border-bottom: 1rpx solid;
					.table-list {
						width: 25%;
						view {
							height: calc(400rpx / 9);
							font-size: 22rpx;
							border-top: 1rpx solid;
							border-left: 1rpx solid;
							line-height: calc(400rpx / 9);
							text-align: center;
						}
					}
				}
			}
		}
	}
	.norm-box-tran {
		height: 2084rpx;
		transition: 1s;
	}
	.norm-box-tran1 {
		height: 2030rpx;
		transition: 1s;
	}
}
</style>
