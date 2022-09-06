'use strict';
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// For each with maps and sets
currencies.forEach(function (value, key, map) {});

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// on each  iteration it will execute the inline function
movements.forEach(function (movement, index, array) {});
// for each passes the item, the index, and the whole array

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE
// arr.slice(1, 3); // similar to sting slice method and returns new array
// // ['c','d','e]
// // .slice(start-inclusive, end-exclusive)
// // We can create shallow copy with empty slice

// // SPLICE
// arr.splice(-1); // splice mutate the original array, it extracts target elements completely from the array and return new array of extracted elements
// // new array : ['c','d','e']
// // original : ['a','b']
// // When using splice we are interested in removing multiple elements
// // common use arr.splice(-1) to remove last element

// arr.splice(1, 2); // slice two elements starting from index one
// // new array : ['b','c']
// // original array : ['a','d']

// const arr2 = ['j', 'i', 'h', 'g', 'f'];

// // REVERSE
// arr2.reverse(); // mutate the original array

// // CONCAT
// arr = ['a', 'b', 'c', 'd', 'e'];
// const letters = arr.concat(arr2);
// // ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

// // we can use spread method
// const letters2 = [...arr, ...arr2];
// ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

// // JOIN
// console.log(letters2.join(' - ')); // returns strings of elements separated by given separator
// // a - b - c - d - e - f - g - h - i - j

// // AT METHOD
// const ar = [23, 11, 64];
// ar.at(0); // similar to ar[0]
// ar.at(-1); // To get last element of array
// // Perfect for method chaining
// // At method also works on strings

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// const eurToUsd = 1.1;

// const movementsUsd = movements.map(mov => mov * eurToUsd);

// console.log(movementsUsd); // [220.00000000000003, 495.00000000000006, -440.00000000000006, 3300.0000000000005, -715.0000000000001, -143, 77, 1430.0000000000002]

// const deposits = movements.filter(mov => mov > 0); // seems to be boolean but actually not it returns the value if it satisfies the condition

// console.log(deposits); // [200, 450, 3000, 70, 1300]

// const withdrawals = movements.filter(mov => mov < 0); // seems to be boolean but actually not it returns the value if it satisfies the condition

// console.log(withdrawals);

// // .reduce(function,initial value)
// // First parameter of reduce is the accumulator
// // Second parameter is the current item in iteration
// // 0 is the starting value for the accumulator
// const balance = movements.reduce((acc, mov) => acc + mov, 0); // return the total of all movements

// console.log(balance); // 3840

// ! Coding Challenge 1
function checkDogs(dogsJulia, dogsKate) {
  const corDogsJulia = dogsJulia.slice(1, -2);
  const dogs = [...corDogsJulia, ...dogsKate];

  dogs.forEach((dog, index) =>
    console.log(
      `Dog number ${index + 1} is ${
        dog >= 3 ? 'an adult' : 'a puppy'
      }, and is ${dog} years old`
    )
  );
}

// ! Coding Challenge 2 & 3
// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((sum, age, i, arr) => sum + age / arr.length, 0);

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// find Loops over array and retrieve first element from the array that satisfies the condition
console.log(movements.find(mov => mov < 0)); // -400

console.log(movements.findIndex(val => val === 3000)); // 3
// findIndex returns the index of element if exists and -1 if not
