const utils = {
	compare(a, b) {
		return a - b;
	},
	swap(arr, s, e) {
		let tmp = arr[s];
		arr[s] = arr[e];
		arr[e] = tmp;
	}
};

// http://www.ruanyifeng.com/blog/2011/04/quicksort_in_javascript.html
const qsRuanyifeng = (() => {
	return arr => {
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
})();

// https://gist.github.com/wintercn/c30464ed3732ee839c3eeed316d73253
const qsWintercn = (arr, start, end) => {
	let midValue = arr[start];
	let p1 = start;
	let p2 = end;
	while (p1 < p2) {
		utils.swap(arr, p1, p1 + 1);
		while (utils.compare(arr[p1], midValue) >= 0 && p1 < p2) {
			utils.swap(arr, p1, p2--);
		}
		p1++;
	}
	if (start < p1 - 1)
		qsWintercn(arr, start, p1 - 1);
	if (p1 < end)
		qsWintercn(arr, p1, end);
};

// https://gist.github.com/wintercn/c30464ed3732ee839c3eeed316d73253#file-quicksortfp-js
const qsWintercnFp = (() => {
	const y = g =>
		(f => f(f))(
			self =>
			g((...args) => self(self).apply(this, args))
		)

	return y(qsWintercnFp =>
		(array, compare) =>
		array.length <= 1 ?
		array :
		qsWintercnFp(
			array.slice(1).filter(
				e => compare(e, array[0]) <= 0),
				compare
			)
			.concat([array[0]])
			.concat(
				qsWintercnFp(
					array.slice(1).filter(
						e => compare(e, array[0]) > 0),
						compare
					)
				)
		)
})();

// https://gist.github.com/ideawu/a114679bb8f0a94452d462ae14b7c977
const qsHoare = (() => {
	const partition_hoare = (arr, start, end) => {
		let pivot = arr[start];
		let s = start;
		let e = end;
		while (1) {
			while (utils.compare(arr[s], pivot) < 0) {
				s++;
			}
			while (utils.compare(arr[e], pivot) > 0) {
				e--;
			}
			if (s == e) {
				return s;
			} else if (s > e) {
				return s - 1;
			}
			utils.swap(arr, s, e);
			s++;
			e--;
		}
	}

	return (arr, start, end) => {
		if (start >= end) {
			return;
		}
		let p = partition_hoare(arr, start, end);
		qsHoare(arr, start, p);
		qsHoare(arr, p + 1, end);
	};
})();

// https://gist.github.com/ideawu/a114679bb8f0a94452d462ae14b7c977
const qsLomuto = (() => {
	const partition_lomuto = (arr, start, end) => {
		let pivot = arr[end];
		let s = start;
		for (let g = start; g < end; g++) {
			if (utils.compare(arr[g], pivot) < 0) {
				if (s != g) {
					utils.swap(arr, s, g);
				}
				s++;
			}
		}
		if (s == end) {
			return s - 1;
		} else {
			utils.swap(arr, s, end);
			return s;
		}
	}

	return (arr, start, end) => {
		if (start >= end) {
			return;
		}
		let p = partition_lomuto(arr, start, end);
		qsLomuto(arr, start, p);
		qsLomuto(arr, p + 1, end);
	}
})();

{
	console.log('');
	console.log('## sample test');
	const sample = [3, 1, 4, 1, 5, 9, 2, 6];
	
	{
		let arr = sample.slice(0);
		let rs = arr.sort(utils.compare);
		console.log('-', rs, 'proto');
	}

	{
		let arr = sample.slice(0);
		let rs = qsRuanyifeng(arr);
		console.log('-', rs, 'ruanyifeng');
	}

	{
		let arr = sample.slice(0);
		qsWintercn(arr, 0, arr.length - 1);
		let rs = arr;
		console.log('-', rs, 'wintercn');
	}

	{
		let arr = sample.slice(0);
		let rs = qsWintercnFp(arr, utils.compare);
		console.log('-', rs, 'wintercn-fp');
	}

	{
		let arr = sample.slice(0);
		qsHoare(arr, 0, arr.length - 1);
		let rs = arr;
		console.log('-', rs, 'hoare');
	}

	{
		let arr = sample.slice(0);
		qsLomuto(arr, 0, arr.length - 1);
		let rs = arr;
		console.log('-', rs, 'lomute');
	}
}

// 正式算法测试
console.log('');
console.log('# quick sort test');

const getOriginData = (() => {
	const count = 1000000;
	console.log('');
	console.time('- generate origin data');
	let arr = [];
	for (let i = 0; i < count; i++) {
		arr.push(Math.floor(count * Math.random()));
	}
	let sorted = arr.slice(0);
	sorted = sorted.sort(utils.compare);
	let max = sorted[sorted.length - 1];
	console.log('- Origin arr length:', count);
	console.log('- Origin arr max:', max);
	console.timeEnd('- generate origin data');

	return () => {
		let rs = {};
		rs.origin = arr.slice(0);
		rs.max = max;
		return rs;
	};
})();

const runTest = (fn, name) => {
	name = '- ' + name;
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
	console.log('## Result');
	console.log('');

	runTest(arr => {
		return arr.sort(utils.compare);
	}, 'proto');

	runTest(arr => {
		return qsRuanyifeng(arr);
	}, 'ruanyifeng');

	runTest(arr => {
		qsWintercn(arr, 0, arr.length - 1);
		return arr;
	}, 'wintercn');

	runTest(arr => {
		return qsWintercnFp(arr, utils.compare);
	}, 'wintercn-fp');

	runTest(arr => {
		qsHoare(arr, 0, arr.length - 1);
		return arr;
	}, 'hoare');

	runTest(arr => {
		qsLomuto(arr, 0, arr.length - 1);
		return arr;
	}, 'lomute');

}
