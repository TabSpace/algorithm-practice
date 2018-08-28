// 最大子数组问题
// 一家公司股价不稳定，准许在某个时刻买进，之后某个日期卖出
// 给出未来若干天股票价格，期望通过低买高卖获得最大收益
// 数组给出正负浮动的整数代表价格波动
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
function findMaxCrossingSubArr(arr = []) {
	let rs = [];
	if (arr.length <= 0) {
		return rs;
	}

	let sum = null;
	arr.forEach(item => {
		if (sum === null) {
			sum = item;
		} else {
			sum += item;
		}
	});

	return rs;
}

let rs = findMaxCrossingSubArr(inputArr);
console.log('expect:', expectArr);
console.log('rs:', rs);
console.assert(rs.length, expectArr.length);
rs.forEach((item, index) => {
	console.assert(item, expectArr[index]);
});

