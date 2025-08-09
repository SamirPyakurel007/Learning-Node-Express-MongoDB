//syncronous

// console.log("I");
// console.log("eat");
// console.log("icecream");
// console.log("with a ");
// console.log("spoon");

//asynchronous

// console.log("I");
// console.log("eat");
// setTimeout(() => {
//   console.log("icecream");
// }, 1000);
// console.log("with a ");
// console.log("spoon");

//callback

// function one(two) {
//   console.log("step 1 finished call 2");
//   two();
// }
// function two() {
//   console.log("step 2");
// }

// one(two);

const stocks = {
  fruits: ["strawberry", "apple", "banana", "orange"],
  liquid: ["water", "ice"],
  holder: ["cone", "cup", "stick"],
  toppings: ["chocolate", "nuts"],
};

//callback hell

// const order = (fruit, production) => {
//   setTimeout(() => {
//     console.log(`${stocks.fruits[fruit]} is placed for order`);
//     production();
//   }, 2000);
// };
// const production = () => {
//   setTimeout(() => {
//     console.log("production has started");
//     setTimeout(() => {
//       console.log("fruit has been chopped");
//       setTimeout(() => {
//         console.log(`${stocks.liquid[0]} and ${stocks.liquid[1]} are added`);
//       }, 1000);
//     }, 2000);
//   }, 0);
// };

// order(0, production);

const isOpen = true;

const order = (time, work) => {
  return new Promise((resolve, reject) => {
    if (isOpen) {
      resolve();
    }
  });
};
const production = () => {};
