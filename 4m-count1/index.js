// 执行 node ./index.js

// 问题
// - 统计 0 ～ 4000000 所有的数字中(不包含末尾数)，出现过多少个数字1。
// - 例如单独数字 11 为 2 个 1
//
// - 查找排列组合规律
// - 举例求 1000 - 1999 之间 1 的数量，设总数为M，初始值M=0
// - 后面3位数字排列为 U(10, 3) （10x10x10=1000）首位数字为1，至少包含了所有排列状况中1的数量 M+=1000
// - 3位数字必有3个为1的组合数量 M+=1*3 (只有1个组合，这个组合有3个1)
// - 3位数字必有2个为1的组合数量 M+=9*3*2
// - 3位数字必有1个为1的组合数量 M+=9*9*3*1
// - 组合数量可依据概率C公式获得：
// - https://www.zybang.com/question/9a6b64253a8fbf6d7af07e1ff3b16ee3.html
// - C(4,2) = 4*3 / 2*1 = 6
// - 1000 + 1*3 + 9*3*2 + 9*9*3*1 = 1300
// - 再推：求0到999，1的重复个数，1可以视为001，2可以视为002，类推
// - 则依据组合公式求得:
// - F(999) = C(3,3)*3 + C(3,2)*9*2 + C(3,1)*9*9*1 = 1*3 + 3*9*2 + 3*9*9 = 3 + 54 + 243 = 300
// - 类似推理导出，F(9) = 1, F(99) = 20, F(999)=300, F(9999)=4000
// - 可发现公式：M(n) = F(10^n - 1) = n * 10^(n-1)
// - 相关推理证明比较复杂，不在此列举
// - 递归推理低位与高位状况，从1位到百万位，分别求值再整合
// - 考虑不同位数统计叠加推理0到所有数字的情况
// - 高位从0求值减去低位从0求值可解决任意差值情形 F(n, m) = F(n) - F(m)
// - F(4000000) = 4 * F(10^6-1) + 10^6 = 4 * 600000 + 1000000 = 3400000
// 算法效率优化到O(1)，OHYE
//
// 20180816 原理解析
// 对于从 0 到 99 这样的数据，假设把 0 写为 00, 1 写为 01 依次类推，9 写为 09
// 则一共100个数据，包含了 2 位数 0 和 9 的全部排列组合，2 位数单独数字总量为 2 * 100,。
// 单独的某个非 0 数字，如 1 或者 2 在每一位上出现概率都是 1 / 10
// 由于是全部的排列组合，可以直接乘以概率得到单独非 0 数字的出现次数 20。
// 其它位数以此类推

// start 参与计算
// end 不参与计算

var utils = {};

// 求一个数据的位数
utils.getDigits = number => {
	if (number <= 0) {
		return 0;
	}
	let digits = 0;
	do {
		number = Math.floor(number / 10);
		digits++;
	} while (number > 0)
	return digits;
};

// C(4, 2) === (4*3)/(2*1) === 6
// C(5, 3) === (5*4*3)/(3*2*1) === 10
utils.getC = (n, m) => {
	if (n < m) {
		return 0;
	}
	let fTop = getFactorial(n, m);
	let fBottom = getFactorial(m);
	return Math.floor(fTop / fBottom);
};

// 求阶乘
utils.getFactorial = (number, limit) => {
	if (number <= 0) {
		return 0;
	}
	let rs = 1;
	limit = limit || number;
	do {
		rs = rs * number;
		number = number - 1;
		limit--;
	} while (number > 0 && limit > 0)
	return rs;
};

// 通过拼接字符串累计，可靠但缓慢
var countByStr = (start, end) => {
	if (start > end) {
		return 0;
	}
	let i = start;
	let str = '';
	for (i = start; i < end; i++) {
		str += i;
	}
	let mount = 0;
	for (i = 0; i < str.length; i++) {
		if (str.charAt(i) === '1') {
			mount++;
		}
	}
	return mount;
};

// 依据排列组合规律计算，复杂但性能高
// 有了公式，性能直接上 O(1)
var countByArrangement = (() => {

	// 搞到了最终公式 M(n) = F(10^n - 1) = n * 10^(n-1)
	// M(2) = F(10^2 - 1) = F(99) = 2 * 10^(2-1) = 20
	// 有这个公式，上面的 getC 就没用了
	// 通过 getC 也可以求值，需要考虑排列组合
	// 求F(9), F(99), F(999) ...
	// n 为 9 的数量
	var fnM = n => {
		return n * Math.pow(10, n - 1)
	};

	// 如果 k > 1
	// N(k,j) = F(k * 10^j) = 10^j + k * M(j)
	// N(2,2) = F(2 * 10^2) = F(200) = 100 + 2 * M(2) = 140
	// 如果 k === 1 直接用 fnM(j)
	var fnN = (k, j) => {
		if (j < 0) {
			throw (new Error('j 必须大于等于 0'));
		}
		if (k <= 0) {
			return 0;
		} else if (k === 1) {
			if (j > 0) {
				return fnM(j);
			} else {
				return 0;
			}
		} else if (k > 1 && k < 10) {
			if (j > 0) {
				return Math.pow(10, j) + k * fnM(j);
			} else {
				return 1;
			}
		} else {
			throw (new Error('k 必须小于 10'));
		}
	};

	// 求从 0 到任意正整数，1 出现的数量
	var fnAny = number => {
		if (number <= 0) {
			return 0;
		}

		let arr = [];
		let digitsArr = [];
		let temp = number;
		do {
			let digit = temp % 10;
			arr.push(digit);
			temp = Math.floor(temp / 10);
		} while (temp > 0)
		arr.reverse();

		let count = arr.reduce((mount, num, index) => {
			let digit = arr.length - 1 - index;
			mount += fnN(num, digit);
			return mount;
		}, 0);

		if (arr[0] === 1) {
			let digitN = Math.pow(10, (arr.length - 1));
			let mod = number % digitN;
			count += mod;
		}

		return count;
	};

	// 求任意正整数到另一个正整数，1的出现数量
	// 不包含 end 本身
	// start 必须小于等于 end
	return (start, end) => {
		if (start > end) {
			return 0;
		} else {
			return fnAny(end) - fnAny(start);
		}
	}
})();

console.time('----- count-by-str');
console.log('countByStr(0, 0)', countByStr(0, 0)); //0
console.log('countByStr(0, 1)', countByStr(0, 1)); //0
console.log('countByStr(0, 9)', countByStr(0, 9)); //1
console.log('countByStr(0, 20)', countByStr(0, 20)); //12
console.log('countByStr(0, 99)', countByStr(0, 99)); //20
console.log('countByStr(0, 300)', countByStr(0, 200)); //160
console.log('countByStr(0, 300)', countByStr(0, 300)); //160
console.log('countByStr(0, 999)', countByStr(0, 999)); //300
console.log('countByStr(0, 9999)', countByStr(0, 9999)); //4000
console.log('countByStr(0, 99999)', countByStr(0, 99999)); //50000
console.log('countByStr(0, 999999)', countByStr(0, 999999)); //600000
console.log('countByStr(0, 1000)', countByStr(0, 1000)); //300
console.log('countByStr(0, 1999)', countByStr(0, 1999)); //1599
console.log('countByStr(1000, 1999)', countByStr(1000, 1999)); //1300
console.log('countByStr(1234, 5678)', countByStr(1234, 5678)); //2050
console.timeEnd('----- count-by-str');
console.time('----- count-by-str-4m');
console.log('countByStr(0, 4000000)', countByStr(0, 4000000)); //3400000
console.timeEnd('----- count-by-str-4m'); //4363ms(node)
console.log('\n');

console.time('----- count-by-arrangement');
console.log('countByArrangement(0, 0)', countByArrangement(0, 0)); //0
console.log('countByArrangement(0, 1)', countByArrangement(0, 1)); //0
console.log('countByArrangement(0, 9)', countByArrangement(0, 9)); //1
console.log('countByArrangement(0, 20)', countByArrangement(0, 20)); //12
console.log('countByArrangement(0, 99)', countByArrangement(0, 99)); //20
console.log('countByArrangement(0, 300)', countByArrangement(0, 200)); //160
console.log('countByArrangement(0, 300)', countByArrangement(0, 300)); //160
console.log('countByArrangement(0, 999)', countByArrangement(0, 999)); //300
console.log('countByArrangement(0, 9999)', countByArrangement(0, 9999)); //4000
console.log('countByArrangement(0, 99999)', countByArrangement(0, 99999)); //50000
console.log('countByArrangement(0, 999999)', countByArrangement(0, 999999)); //600000
console.log('countByArrangement(0, 1000)', countByArrangement(0, 1000)); //300
console.log('countByArrangement(0, 1999)', countByArrangement(0, 1999)); //1599
console.log('countByArrangement(1234, 5678)', countByArrangement(1234, 5678)); //2050
console.log('countByArrangement(1000, 1999)', countByArrangement(1000, 1999)); //1300
console.timeEnd('----- count-by-arrangement');
console.time('----- count-by-arrangement-4m');
console.log('countByArrangement(0, 4000000)', countByArrangement(0, 4000000)); //3400000
console.timeEnd('----- count-by-arrangement-4m'); //4363ms(node)

