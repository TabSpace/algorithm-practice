// 动态规划-钢条切割
// 给定一段长度为 n 英寸的钢条
// 给定一个价格表 Pi(i=1,2...) 单位为元
// 钢条的长度均为整数英寸
// 求切割钢条的方案，使得销售收益 Rn 最大
// 注意：如果长度为 n 英寸的钢条价格 Pn 足够大
// 最优解可能就是完全不需要切割

const P = {
	'1': 1,
	'2': 5,
	'3': 8,
	'4': 9,
	'5': 10,
	'6': 17,
	'7': 17,
	'8': 20,
	'9': 24,
	'10': 30
}

function itemPrize(i) {
	if (P[i]) {
		return P[i]
	} else if (i > 10) {
		return P[10]
	}
}

// 简单递归方案
function cutRod (n) {
	if (n <= 0) {
		return 0
	}
	let prize = 0
	for (let i = 1; i <= n; i++) {
		prize = Math.max(prize, itemPrize(i) + cutRod(n - i))
	}
	return prize
}

// 动态规划
function cutRodTab (n) {
	if (n <= 0) {
		return 0
	}
	let cache = {}
	cache[0] = 0
	for (let j = 1; j <= n; j++) {
		let prize = 0;
		for (let i = 1; i <= j; i++) {
			prize = Math.max(prize, itemPrize(i) + cache[j - i])
		}
		cache[j] = prize
	}
	return cache[n]
}

{
	const inputN = 25
	console.time('cut-rod')
	const expectSum = cutRod(inputN)
	console.log('expect sum:', expectSum)
	console.timeEnd('cut-rod')

	console.time('cut-rod-tab')
	const sum = cutRodTab(inputN)
	console.log('tab sum:', sum)
	console.timeEnd('cut-rod-tab')
}
