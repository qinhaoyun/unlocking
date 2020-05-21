<template>
	<view class="content">
		<view class="hd_empty"></view>
		<hd-nav class="hd" :title="title" :rtbtn="rtbtn"></hd-nav>
		<view class="main">
			<view class="lock-box">
				<scroll-view class="lock" scroll-y="true">
					<view class="type-tit text-title">
						<image class="icon-img" src="../../static/images/XZ.png" mode=""></image>
						<text>选择服务类型</text>

						<image class="star" src="../../static/images/technologistPic/xh.png" mode=""></image>
					</view>

					<sPicker v-if="one_type" :productArr="productArr" @tap="select_type" ref="sPicker"></sPicker>
					<view v-else class="one-type">{{one_type_data.name}}</view>
					<view class="text-title" v-if="show_unit">
						<image class="icon-img" src="../../static/images/XZ.png" mode=""></image>
						<text>选择产品数量</text>
						<image class="star" src="../../static/images/technologistPic/xh.png" mode=""></image>
					</view>
					<view class="unit-box" v-if="show_unit">
						<input type="number" v-model="unit_num" placeholder="点击输入.."/>
						<view class="unit"> <text>/</text>  {{unit}}</view>
					</view>
					<view class="describe text-title">
						<image class="icon-img" src="../../static/images/MS.png" mode=""></image>
						<text>描述状态</text>
						<image class="star" src="../../static/images/technologistPic/xh.png" mode=""></image>
					</view>
					<view class="uni-textarea"><textarea class="describe-info" auto-height="true" v-model="describe_text" adjust-position="fasle" placeholder="请描述服务的具体情况:" /></view>
					<view class="upload-pic text-title">
						<image class="icon-img" src="../../static/images/SC.png" mode=""></image>
						<text>上传图片</text>
						<image class="star" src="../../static/images/technologistPic/xh.png" mode=""></image>
					</view>
					<view class="pic-wrap">
						<view class="pics" v-for="(item, index) in picArr" :key="index">
							<image :src="item" mode=""></image>
							<view class="det" @tap="det(index)"><view class="txt">x</view></view>
						</view>
						<view class="upload-btn" @tap="upload_pic">
							<image class="icon-img" src="../../static/images/technologistPic/zp.png" mode=""></image>
							<view class="click">点击上传</view>
							<view class="num">(最多五张)</view>
						</view>
					</view>
					<view class="text-title">
						<image class="icon-img" src="../../static/images/xx.png" mode=""></image>
						<text>详细信息</text>
						<image class="star" src="../../static/images/technologistPic/xh.png" mode=""></image>
					</view>
					<view class="detailed-info">
						<view class="address" @tap="location">
							<image class="icon-img" src="../../static/images/DZ.png" mode=""></image>
							<view class="address-txt">{{ address ? address : '地址' }}</view>
							<view class="iconfont icon-gengduo"></view>
						</view>
						<view class="house-number">
							<image class="icon-img" src="../../static/images/xxdz.png" mode=""></image>
							<input type="text" :disabled="disabled" v-model="house_number" placeholder="详细地址及门牌号" />
						</view>
						<view class="name-phone">
							<view class="name">
								<image class="icon-img" src="../../static/images/LXR.png" mode=""></image>
								<input type="text" :disabled="disabled" v-model="linkman" placeholder="联系人" />
							</view>
							<view class="phone">
								<image class="icon-img" src="../../static/images/DH.png" mode=""></image>
								<input type="text" :disabled="disabled" v-model="linkmanPhone" placeholder="联系电话" />
							</view>
						</view>
					</view>
					<view class="select-default" v-if="isaddress">
						<view class="select" @tap="selectAddress">
							<view class="add-btn">+</view>
							<text>选择已有地址</text>
						</view>
						<view class="default" @tap="changeIsdefault">
							<view class="default-btn"><view class="iconfont icon-iconset0125" v-if="default_address"></view></view>
							<text class="default-txt">设为默认地址</text>
						</view>
					</view>
					<view class="select-default" v-else>
						<view class="select" @tap="selectAddress">
							<view class="add-btn">+</view>
							<text>选择已有地址</text>
						</view>
						<view class="default" @tap="amend_addre"><text class="default-txt">修改</text></view>
					</view>
					<view class="price-box">
						<text class="price">
							￥
							<text class="price-num">{{predict_money_sum}}</text>
						</text>
						<view class="predict">订购须知?</view>
					</view>
					<view class="booking-order">
						<view class="booking" @tap="openTime">
							<text class="mar1">预</text>
							<text>约</text>
						</view>
						<view class="order" @tap="PlaceOrder">
							<text class="mar1">下</text>
							<text>单</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<w-picker mode="limit" dayStep="60" startHour="8" endHour="20" minuteStep="5" afterStep="30" @confirm="onConfirm" ref="limit" themeColor="#f00"></w-picker>
	</view>
</template>
<script>
// 时间选择器插件
import wPicker from '@/components/w-picker/w-picker.vue';
// 查询服务分类的id
let numId = null;
// 地址的经纬度
let location = null;
// 预约的时间
let times = '';
// 默认地址id
let defaultAddrid = '';
// 下单或者预约成功
let strSuccess = ""
// 传递的时间
let timer = null
export default {
	components: {
		wPicker
	},
	data() {
		return {
			title: '添加订单',
			rtbtn: '',
			describe_text: '',
			productArr: [], // 产品类型
			picArr: [], // 预约开锁上传的照片数组
			address: '', // 定位地址
			linkmanPhone: '', // 联系人电话
			linkman: '', // 联系人
			house_number: '', //详细地址门牌号
			default_address: 0, //是否选勾选为默认地址,1为默认,0不默认
			idList: [],
			isaddress: true,
			userinfo: null,
			picstr: [], // 上传的图片的数组
			funId: null, // functions里面的id
			predict_money: '', // 预计金额
			disabled: false,
			one_type:true, // 是否显示插件
			one_type_data:null ,// 返回的默认一种类型时的数据
			unit:null, // 单位
			show_unit:false ,// 是否显示单价
			unit_num:"" // 数量
		};
	},
	onLoad() {
		uni.$once('send_funId', data => {
			this.funId = data.funId;
			numId = data.funId;
		});
		// 接受定位信息
		uni.$on('getLocation', data => {
			location = data.data;
			this.address = data.data1;
		});
		// 请求全部地址
		this.$http
			.post('/function/selectAddr', {
				uid: this.User.userinfo.uid,
				addrid: ''
			})
			.then(([err, res]) => {
				let deft = res.data.data;
				deft.map((item, i) => {
					if (item.state == 1) {
						defaultAddrid = item.id; // 默认地址id
						this.disabled = true; // 表单禁用
						this.isaddress = false; // 是否显示修改
						this.address = item.addr; // 定位地址
						this.linkmanPhone = item.phone; // 联系人手机号
						this.linkman = item.name; // 联系人
						this.house_number = item.doornum; //门牌号
						location = item.fixed
					}
				});
			});

		uni.$on('send_addrid1', data => {
			defaultAddrid = data.Id;
			if ((defaultAddrid = data.Id)) {
				this.$http
					.post('/function/selectAddr', {
						uid: this.User.userinfo.uid,
						addrid: defaultAddrid
					})
					.then(([err, res]) => {
					
						this.isaddress = true;
						this.disabled = false;
						if (res.data.result === 'SUCCESS') {
							let address = res.data.data[0];
							this.address = address.addr;
							this.linkmanPhone = address.phone;
							this.linkman = address.name; 
							this.house_number = address.doornum;
							location = address.fixed;
						}
					});
			}
		});
	},
	computed: {
		verDescribe() {
			return this.describe_text;
		},
		// 验证定位地址
		verAddress() {
			return this.address;
		},
		// 详细地址
		verHouse_number() {
			return this.house_number;
		},
		// 联系人姓名
		verLinkman() {
			let reg = /^[\u4E00-\u9FA5\uf900-\ufa2d_a-zA-Z]{1,10}$/
			return reg.test(this.linkman)
		},
		// 联系人手机号嘛
		verLinkmanPhone() {
			let mPattern = /^1[34578]\d{9}$/;
			return mPattern.test(this.linkmanPhone);
		},
		// 计算预计总价
		predict_money_sum(){
			if(this.show_unit){ // 如果显示计量,所以就需要计算总价
				return this.unit_num * this.predict_money
			}else{ // 反之就直接等于价格
				return this.predict_money
			}
		}
		
	},
	methods: {
		select_type() {
			this.$http
				.post('/function/selectType', {
					modeid: numId
				})
				.then(([err, res]) => {
					this.productArr = res.data.data;
					
					/*
						当类型只有一种的时候,就默认选者,不弹出弹出层
					*/
					if(res.data.data.length===1 && res.data.data[0].type.length === 0){
						this.one_type = false;
						this.one_type_data = res.data.data[0];
						this.predict_money = res.data.data[0].price
						if(res.data.data[0].unit){
							this.show_unit = true
							this.unit = res.data.data[0].unit
						}
						 
					}else{
						
					}
				});
		},
		// 修改地址
		amend_addre() {
			this.address = ''; // 初始化地址
			this.linkmanPhone = '';
			this.house_number = '';
			this.linkman = '';
			this.isaddress = true;
			this.disabled = false;
			defaultAddrid = ""; // 默认地址id清空
			location = "" // 定位清空
			
		},
		// 跳转,地图定位
		location() {
			if (!this.disabled) {
				uni.navigateTo({
					url: '../map/map'
				});
			}
		},
		// 获取价格
		get_money(e) {
			this.predict_money = this.$refs.sPicker.pri;
		},
		// 是否显示产品的单位
		showUnit(){
			this.show_unit = true;
			this.unit = this.$refs.sPicker.unit;
		},
		// 上传图片
		upload_pic() {
			uni.chooseImage({
				success: res => {
					for (let i = 0; i < res.tempFilePaths.length; i++) {
						if (this.picArr.length < 5) {
							this.picArr.push(res.tempFilePaths[i]);
						} else {
							uni.showToast({
								title: '最多只能上传5张照片',
								icon: 'none'
							});
						}
					}
				}
			});
		},
		// 删除图片
		det(index) {
			this.picArr.splice(index, 1);
		},
		// 选择已有地址
		selectAddress() {
			uni.navigateTo({
				url: '../addressList/addressList',
				success: () => {
					uni.$emit('add_order', { isAddorder: true });
				}
			});
		},
		// 是否勾选设为默认地址
		changeIsdefault() {
			if (this.default_address === 1) {
				this.default_address = 0;
			} else {
				this.default_address = 1;
			}
		},
		// 时间选择器
		openTime() {
			this.$refs.limit.show();
		},
		// 时间选择器的结果回调
		onConfirm(time) {
			times = time.result;
			this.PlaceOrder();
		},
		// 时间格式化
		addZero(n){
			return n < 10? "0" + n : n + "";
		},
		// 下单
		PlaceOrder(str) {
			if(this.one_type && this.$refs.sPicker.name === null){
				uni.showToast({
					title: '请选择产品类型'
				});
				return;
			}
			if (!this.verDescribe) {
				uni.showToast({ title: '请描述下锁状态', icon: 'none' });
				return;
			}
			if (!this.verAddress) {
				uni.showToast({ title: '请输入地址', icon: 'none' });
				return;
			}
			if (!this.verHouse_number) {
				uni.showToast({ title: '请输入详细地址', icon: 'none' });
				return;
			}
			if (!this.verLinkman) {
				uni.showToast({ title: '请输入联系人,并且不能为数字', icon: 'none' });
				return;
			}
			if (!this.verLinkmanPhone) {
				uni.showToast({ title: '请输正确的电话号码', icon: 'none' });
				return;
			}
			// 验证是否需要输入参评数量
			if(this.show_unit){
				if(!this.unit_num){
					uni.showToast({title:"产品数量不能为空,或者零~",icon:"none"})
					return
				}
			}
			// 服务类型id
			let type = this.one_type?this.$refs.sPicker.idList:this.one_type_data.id;
			
			//用户id
			let uid = this.User.userinfo.uid;
			// 地址
			let address = this.address + ' ' + this.house_number;
			// 物品
		
			let goods = this.one_type?this.$refs.sPicker.name:this.one_type_data.name;
			
			// 获取传递的时候,判断是预约时间还是,当前时间
			if (times) {
				timer = times;
			} else {
				var date = new Date();
				let yy = date.getFullYear(); //获取年
				let mm = date.getMonth() + 1; //获取月份 0-11
				let dd = date.getDate();
				let hh = this.addZero(date.getHours()); //小时
				let ff = this.addZero(date.getMinutes()); //分钟
				let ss = this.addZero(date.getSeconds()); //秒钟
				let sss = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + ff + ':' + ss;
				timer = sss;
			}
			// 传递的的下单/预约请求的数据
			let orderdata = {
				uid: uid,
				type: type,
				mode: numId,
				intro: this.describe_text,
				addrid: defaultAddrid, // 默认地址id
				username: this.linkman,
				phone: this.linkmanPhone,
				address: this.address, // 定位地址
				doornum: this.house_number,
				fixed: location,
				state: this.default_address,
				money: this.predict_money_sum,
				appointment: times,
				num:this.unit_num
			};
			
			// 表单数据
			let inputinfo = {
				username: this.linkman,
				phone: this.linkmanPhone,
				address,
				pic: this.picArr,
				goods: goods,
				pri:this.predict_money_sum,
				intro: this.describe_text,
				timer
			};
			uni.navigateTo({
				url: '../confirm_order/confirm_order',
				success: () => {
					times = "";
					uni.$emit('sendOderInfo', {
						orderdata,
						inputinfo,
						strSuccess: str
					});
				}
			});
		}
	},
	onReady() {
		// 锁请求服务类型
		this.select_type();
	}
};
</script>

<style lang="less">
page {
	background: rgb(238, 238, 238);
}
.content {
	.hd_empty {
		height: 160rpx;
	}
	.hd {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100%;
	}
	.lock-box {
		height: 100%;
		padding: 0 44rpx;
		margin-top: 1rpx;
		background: #ffffff;
		.lock {
			height: 100%;
			.icon-img {
				width: 40rpx;
				height: 40rpx;
			}
			.text-title {
				display: flex;
				margin-top: 40rpx;

				.star {
					width: 20rpx;
					height: 20rpx;
					margin-top: 10rpx;
				}
				text {
					margin: 0 6rpx 0 14rpx;
					line-height: 40rpx;
					font-size: 34rpx;
				}
			}
			.unit-box{
				display: flex;
				align-items: bottom;
				margin-top: 20rpx;
				input{
					width: 200rpx;
					height: 66rpx;
					padding-left: 20rpx;
					border: 1rpx solid rgba(167, 167, 167, 1);
					border-radius: 10rpx;
				}
				.unit{
					margin-left: 20rpx;
					font-size: 34rpx;
					color:rgba(100, 100, 100, 1);
					text{
						font-size: 40rpx;
					}
				}
			}
			.one-type {
				width: 346rpx;
				height: 66rpx;
				margin-top: 20rpx;
				border: 1px solid rgba(167, 167, 167, 1);
				border-radius: 6px;
				line-height: 66rpx;
				text-align: center;
				font-size: 30rpx;
				color: rgba(167, 167, 167, 1);
			}
			.describe {
				margin-top: 40rpx;
			}
			.uni-textarea {
				position: relative;
				margin-top: 22rpx;
				.describe-info {
					width: 100%;
					height: 40rpx;
					background: rgba(166, 166, 166, 0.1);
				}
			}
			.pic-wrap {
				display: flex;
				flex-wrap: wrap;
				margin-top: 40rpx;
				.pics {
					position: relative;
					width: 158rpx;
					height: 158rpx;
					margin-left: 2rpx;
					margin-right: 8rpx;
					margin-bottom: 15rpx;
					image {
						width: 158rpx;
						height: 158rpx;
						vertical-align: middle;
					}
					.det {
						position: absolute;
						top: -15rpx;
						left: -6rpx;
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						background: #ffffff;
						.txt {
							width: 30rpx;
							height: 30rpx;
							line-height: 23rpx;
							margin: 5rpx auto;
							border-radius: 50%;
							text-align: center;
							background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
						}
					}
				}
				.upload-btn {
					width: 156rpx;
					height: 156rpx;
					border: 1px dashed rgba(191, 191, 191, 1);
					text-align: center;
					color: rgba(191, 191, 191, 1);
					image {
						width: 80rpx;
						height: 80rpx;
						margin-left: 12rpx;
						vertical-align: middle;
					}
					.click {
						margin: 10rpx 0 5rpx 0;
						line-height: 20rpx;
						font-size: 20rpx;
					}
					.num {
						line-height: 14rpx;
						font-size: 14rpx;
					}
				}
			}
			.detailed-info {
				margin-top: 20rpx;
				.address {
					display: flex;
					height: 50rpx;
					line-height: 50rpx;
					border-bottom: 1px solid rgba(225, 225, 225, 1);
					.icon-img {
						margin-top: 10rpx;
					}
					.address-txt {
						width: 580rpx;
						margin-left: 16rpx;
						line-height: 50rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						color: #666666;
					}
					.icon-gengduo {
						color: rgba(182, 182, 182, 1);
					}
				}
				.house-number {
					display: flex;
					height: 50rpx;
					margin-top: 20rpx;
					border-bottom: 1px solid rgba(225, 225, 225, 1);
					.icon-img {
						margin-top: 10rpx;
					}
					input {
						margin-left: 16rpx;
					}
					.house-pla {
						font-size: 30rpx;
						color: rgba(51, 51, 51, 1);
					}
				}
				.name-phone {
					display: flex;
					height: 50rpx;
					margin-top: 20rpx;
					border-bottom: 1px solid rgba(225, 225, 225, 1);
					.icon-img {
						margin-top: 10rpx;
					}
					input {
						height: 50rpx;
					}
					.name {
						display: flex;
						position: relative;
						width: 50%;
					}
					.name:after {
						display: flex;
						position: absolute;
						top: 0;
						right: 0;
						content: '';
						width: 1px;
						height: 43rpx;
						background: rgba(154, 156, 155, 1);
					}

					.phone {
						display: flex;
						width: 50%;
					}
				}
			}
			.select-default {
				display: flex;
				justify-content: space-between;
				margin-top: 20rpx;
				.add-btn,
				.default-btn {
					width: 22rpx;
					height: 22rpx;
					border: 1px solid rgba(167, 167, 167, 1);
					line-height: 22rpx;
					text-align: center;
					.iconfont {
						line-height: 22rpx;
						font-size: 22rpx;
						color: red;
					}
				}
				.select,
				.default {
					display: flex;
					text {
						margin-left: 12rpx;
						line-height: 24rpx;
						font-size: 24rpx;
					}
					.default-txt {
						margin-right: 22rpx;
					}
				}
			}
			.price-box {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 20rpx;
				line-height: 52rpx;

				.price {
					font-size: 26rpx;
					.price-num {
						font-size: 52rpx;
					}
				}
				.predict {
					width: 78rpx;
					height: 22rpx;
					line-height: 22rpx;
					margin-top: 6rpx;
					border: 1px solid rgba(167, 167, 167, 1);
					font-size: 14rpx;
					text-align: center;
				}
			}
			.booking-order {
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
				padding-bottom: 15rpx;
				text-align: center;
				.booking,
				.order {
					width: 260rpx;
					height: 88rpx;
					line-height: 88rpx;
					background: linear-gradient(94deg, rgba(255, 40, 92, 1), rgba(255, 137, 110, 1));
					color: #ffffff;
					font-size: 36rpx;
					.mar1 {
						margin-right: 30rpx;
					}
				}
			}
		}
	}
}
</style>
