<template>
	<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="index" @change="getName" :range="multiArray">
		<view class="text">{{name?name:'请选择服务产品类型'}}</view>
	</picker>
</template>

<script>
	export default {
		data() {
			return {
				multiArray: [],
				multiIndex: [0, 0, 0],
				index: 0,
				remote: [],
				idList: "",
				pri: "",
				name: null,
				unit:""
			}
		},
		watch: {
			productArr(v) {
				if (v.length !==0 ) {
					this.getRemoteData();
				}
			}
		},
		props: ["productArr"],
		methods: {
			getIdList() {
				return this.idList;
			},
			getPri() {
				return this.pri;
			},
			getName(event) {
				// 存序号的数组
				let nums = this.multiIndex,
					// 三维数组
					multiArray = this.multiArray;
				// 申明 第一 第二 第三列的值
				let name1 = null,
					name2 = null,
					name3 = null;
				// 第一列的值必有
				name1 = multiArray[0][nums[0]]
				// 第二列的值有就赋值
				if (multiArray[1][nums[1]] !== ' ') name2 = multiArray[1][nums[1]]
				// 第三列的值有就赋值
				if (multiArray[2][nums[2]] !== ' ') name2 = multiArray[2][nums[2]]
				// name就等于 name3 没值就 等于name2  最后name1
				this.name = name3 || name2 || name1;
				
				// 调用父组件的api
				this.$parent.get_money();
				
				// 是否显示产品计量
				if(this.unit){
					this.$parent.showUnit();
				}
			},
			// 获取远程数据
			getRemoteData() {
				let data = this.productArr
				if ((this.productArr[0].type === null) || (this.productArr[0].type.length === 0)) {
					
					this.idList = this.productArr[0].id // 服务id
					this.pri = this.productArr[0].price // 产品价格
					this.unit = this.productArr[0].unit // 产品单位
					
				} else {
					if (((this.productArr[0].type[0].type === null) || (this.productArr[0].type[0].type.length === 0)) && ((this.productArr[0].type !== null) || (this.productArr[0].type.length !== 0))) {
						this.idList = this.productArr[0].type[0].id
						this.pri = this.productArr[0].type[0].price
						this.unit = this.productArr[0].type[0].unit
					}else{
						if (((this.productArr[0].type[0].type !== null) || (this.productArr[0].type[0].type.length !== 0)) && ((this.productArr[0].type[0].type !== null) || (this.productArr[0].type[0].type.length !== 0))) {
							this.idList = this.productArr[0].type[0].type[0].id
							this.pri = this.productArr[0].type[0].type[0].price
							this.unit = this.productArr[0].type[0].type[0].unit
						}
					}
				}
				let arr1 = [];
				let arr2 = [];
				let arr3 = [];

				for (let i = 0, len = data.length; i < len; i++) {
					arr1.push(data[i].name);
				}
				let data2 = null
				if(data[0].type && data[0].type.length !== 0){
					data2 = data[0].type
				}else {
					if(data[0].type === null || data[0].type.length === 0){
						data2 = [' ']
					}
				}
				if (data2[0] !== ' ') {
					for (let i = 0, len = data2.length; i < len; i++) {
						arr2.push(data2[i].name);
					}
				}
				if (data2[0] === ' ') {
					arr2 = data2;
				} else {
					let data3 = null
					if(data2[0].type && data2[0].type.length !== 0){
						data3 = data2[0].type
					}else{
						if(data2[0].type === null || data2[0].type.length === 0){
							data3 = [' ']
						}
					}
					if (data3[0] !== ' ') {
						for (let i = 0, len = data3.length; i < len; i++) {
							arr3.push(data3[i].name);
						}
					} else arr3 = data3;
				}
				this.multiArray = [arr1, arr2, arr3]
				this.remote = data;
			},
			// 拖动第一列
			changeData(index, a, b) {
				let arr = this.remote;

				let option = arr[index].type || [' '];
				let arr2 = [];
				let arr3 = [];
				if (option[0] !== ' ') {
					for (let i = 0, len = option.length; i < len; i++) {
						arr2.push(option[i].name);
					}
				} else arr2 = [' ']
				
				if (option[0] !== undefined) {
					
					let option2 = option[0].type || [' '];
					
					if (option2[0] !== ' ') {
						for (let j = 0, l = option2.length; j < l; j++) {
							arr3.push(option2[j].name);
						}
					} else arr3 = option2
				} else arr3 = option;

				this.multiArray[a] = arr2;
				this.multiArray[b] = arr3;
			},
			// 拖动第二列
			secondList(firstNumber, secondNumber, a) {
				let arr = this.remote;

				let option = arr[firstNumber].type[secondNumber].type || [' ']
				let arr3 = [];
				if (option[0] !== ' ') {
					for (let i = 0, len = option.length; i < len; i++) {
						arr3.push(option[i].name);
					}
				} else arr3 = option;
				this.multiArray[a] = arr3;
			},
			bindMultiPickerColumnChange: function(e) {

				this.multiIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0: //拖动第1列
						this.changeData(this.multiIndex[0], 1, 2)
						break
					case 1: //拖动第2列
						this.secondList(this.multiIndex[0], this.multiIndex[1], 2)
						this.multiIndex.splice(2, 1, 0)
						break
				}
				this.$forceUpdate()
				// 服务id
				let id1 = null;
				let id2 = null;
				let id3 = null;
				// 产品价格
				let pri1 = null;
				let pri2 = null;
				let pri3 = null;
				// 产品单位
				let unit1 = null;
				let unit2 = null;
				let unit3 = null;
				let obj = null;
				obj = this.remote[this.multiIndex[0]];
				id1 = obj.id;
				pri1 = obj.price
				unit1 = obj.unit
				if ((obj.type !== null) && (obj.type.length !== 0)) {
					obj = obj.type[this.multiIndex[1]]
					id2 = obj.id
					pri2 = obj.price
					unit2 = obj.unit
					if (obj.type) {
						obj = obj.type[this.multiIndex[2]]
						id3 = obj.id
						pri3 = obj.price
						unit3 = obj.unit
					}
				}
				let type = "";
				let pri = "";
				let unit = "";
				let price = [pri1, pri2, pri3];
				let idarr = [id1, id2, id3];
				let units = [unit1,unit2,unit3];
				for (let i = idarr.length; i > 0; i--) {
					if (idarr[i] === null) {
						idarr.splice(i, 1);
						price.splice(i, 1);
						units.splice(i, 1);
					}
				}


				if (idarr.length === 3) {
					type = idarr[2]
					pri = price[2]
					unit = units[2]
				}
				if (idarr.length === 2) {
					type = idarr[1]
					pri = price[1]
					unit = units[1]
				}
				if (idarr.length === 1) {
					type = idarr[0]
					pri = price[0]
					unit = units[0]
				}
				this.idList = type
				this.pri = pri
				this.unit = unit
			}
		}
	}
</script>

<style>
	.text {
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
</style>
