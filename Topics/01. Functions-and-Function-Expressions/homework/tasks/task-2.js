/* Task description */
/*
	Write a function that finds all the prime numbers in a range
		1) it should return the prime numbers in an array
		2) it must throw an Error if any on the range params is not convertible to `Number`
		3) it must throw an Error if any of the range params is missing
*/

function solve() {
	return function (start, end) {
		let primes = [];
		if (start === undefined || end === undefined) {
			throw "Error";
		}
		if (start < 2) {
			start = 2;
		}
		for (var num = +start; num <= +end; num += 1) {
			prime = true;

			for (var j = 2; j < num; j += 1) {
				if (num % j === 0) {
					prime = false;
					break;
				}
			}
			if (prime) {
				primes.push(num)
			}
		}
		return primes;
	}
}

// console.log(solve(5));
// console.log(solve(1, 5));
// console.log(solve(5, 10));
// console.log(solve(5, 15));

module.exports = solve;