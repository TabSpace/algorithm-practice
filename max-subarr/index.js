// 最大子数组问题
// 一家公司股价不稳定，准许在某个时刻买进，之后某个日期卖出
// 只能买一次，只能卖一次
// 给出未来若干天股票价格，期望获得最大收益
// 数组给出正负浮动的整数代表价格波动差值
// 求和最大的子数组

const inputArr = [
	13,
	-3,
	-25,
	20,
	-3,
	-16,
	-23,
	18,
	20,
	-7,
	12,
	-5,
	-22,
	15,
	-4,
	7
];

const expectArr = [
	18,
	20,
	-7,
	12
];

// A[1..j+1]的最大子数组
// 要么是A[1..j]的最大子数组
// 要么是A[i..j+1](1<=i<=j+1)
// 算法应当为线性时间
function findMaxSubArr(arr = []) {
	let rs = [];
	if (arr.length <= 0) {
		return rs;
	}
	// 记录最大子数组的和, 也是A[1..j]最大子数组的和
	// 最开始只有1个元素时，A[1..j]最大子数组就是其本身
	let rsSum = arr[0];
	// 记录最大子数组开始位置
	let rsStart = 0;
	// 记录最大子数组结束位置
	let rsEnd = 0;
	// 记录A[i..j]最大子数组的和
	let rightSum = arr[0];
	// 记录A[i..j+1]最大子数组开始位置
	let rightStart = 0;
	for (let index = 1; index < arr.length; index++) {
		// 插入一个元素后进行判断
		// A[i..j]插入这个元素，和如果增大，则最大子数组扩充，否则维持不变
		if (rsSum + arr[index] > rsSum) {
			rsSum = rsSum + arr[index];
			rsEnd = index;
		}
		// 从rsStart向右求和，得A[i..j+1]子数组之和，如果大于之前的子数组，则替换A[i..j]最大子数组
		// 这里没想明白，如果按照上一句注释的做法，就不是线性时间了，再想想
	}

	return rs;
}

let rs = findMaxSubArr(inputArr);
console.log('expect:', expectArr);
console.log('rs:', rs);
console.assert(rs.length === expectArr.length, `RsArr length should be ${expectArr.length}`);
rs.forEach((item, index) => {
	console.assert(item === expectArr[index], `Item should be ${expectArr[index]}`);
});

