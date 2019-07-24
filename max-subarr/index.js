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
function findMaxSubArr_tabliang(arr = []) {
	if (arr.length <= 0) {
		return [];
	}

	// 最大子数组开始位置
	let maxStart = 0;
	// 最大子数组长度
	let maxLength = 0;
	// 最大子数组求和
	let maxSum = 0;

	// 临时数据标记
	let start = 0;
	let length = 0;
	let sum = 0;

	for (let index = 0; index < arr.length; index++) {
		if (length <= 0 && arr[index] > 0) {
			start = index;
			maxStart = start;
			length = 1;
			maxLength = length;
			sum = arr[index];
			maxSum = sum;
		} else {
			length++;
			sum += arr[index];
			if (sum > maxSum) {
				maxSum = sum;
				maxLength = length;
				maxStart = start;
			} else if (sum < 0) {
				length = 0;
				sum = 0;
			}
		}
	}

	if (maxLength <= 0) {
		return [];
	}

	return arr.slice(maxStart, maxStart + maxLength);
}

{
	console.time('max-subarr')
	let rs = findMaxSubArr_tabliang(inputArr);
	console.timeEnd('max-subarr')
	let sum = rs.reduce(
		(sum, item) => {
			return sum + item;
		}, 0
	);
	let expectSum = expectArr.reduce(
		(sum, item) => {
			return sum + item;
		}, 0
	);
	console.log('input:', inputArr);
	console.log('expect:', expectArr);
	console.log('rs:', rs);
	console.log('sum:', sum);
	console.assert(rs.length === expectArr.length, `RsArr length should be ${expectArr.length}`);
	console.assert(sum === expectSum, `RsArr sum should be ${expectSum}`);
	rs.forEach((item, index) => {
		console.assert(item === expectArr[index], `Item should be ${expectArr[index]}`);
	});
}


