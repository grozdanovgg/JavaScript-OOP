/* Task Description */
/* 
	Write a function that sums an array of numbers:
		numbers must be always of type Number
		returns `null` if the array is empty
		throws Error if the parameter is not passed (undefined)
		throws if any of the elements is not convertible to Number	

*/

function solve() {
	return function sum(arr) {
		if (!arr.every(x => !Number.isNaN(Number(x)))){
			throw "Error";
		}
		if (arr.length === 0){
			return null;
		}
		return arr.reduce((x,y) => +x + +y,0);
	}
}

module.exports = solve;
