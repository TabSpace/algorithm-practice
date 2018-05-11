const qsRuanyifeng = arr => {
	if (arr.length <= 1) {
		return arr;
	}
	let pivotIndex = Math.floor(arr.length / 2);
	let pivot = arr.splice(pivotIndex, 1)[0];
	let left = [];
	let right = [];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] < pivot) {
			left.push(arr[i]);
		} else {
			right.push(arr[i]);
		}
	}
	return qsRuanyifeng(left).concat(
		[pivot],
		qsRuanyifeng(right)
	);
};

{
	console.log('');
	console.log('sample test');
	const sample = [3, 1, 4, 1, 5, 9, 2, 6];
	{
		let arr = sample.slice(0);
		let rs = arr.sort((n1, n2) => (n1 - n2));
		console.log(rs, 'proto');
	}
	{
		let arr = sample.slice(0);
		let rs = qsRuanyifeng(arr);
		console.log(rs, 'ruan yi feng');
	}
}

// 正式算法测试
var getOriginData;

{
	const count = 1000000;
	console.log('');
	console.time('generate origin data');
	let arr = [];
	for (let i = 0; i < count; i++) {
		arr.push(Math.floor(count * Math.random()));
	}
	let sorted = arr.slice(0);
	sorted = arr.sort((n1, n2) => n1 - n2);
	let max = sorted[sorted.length - 1];
	console.log('Origin arr length:', count);
	console.log('Origin arr max:', max);
	console.timeEnd('generate origin data');

	getOriginData = () => {
		let rs = {};
		rs.origin = arr.slice(0);
		rs.max = max;
		return rs;
	};
}

const runTest = (fn, name) => {
	console.time(name);
	let rs = getOriginData();
	let arr = rs.origin;
	let sorted = fn(arr);
	let max = sorted[sorted.length - 1];
	console.assert(max === rs.max);
	console.timeEnd(name);
}

{
	console.log('');
	console.log('quick sort test start');

	// 原生排序方法
	runTest(arr => {
		return arr.sort((n1, n2) => (n1 - n2));
	}, 'proto');

	// 阮一峰版本
	runTest(arr => {
		return qsRuanyifeng(arr);
	}, 'ruan yi feng');
}

