'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// //////////////////////////////////////////////////////////////////////////

// Elements
// Sections/Divisions
const movementsDiv = document.querySelector('.movements');
const appDiv = document.querySelector('.app');
const loginDiv = document.querySelector('.login-section');

// Labels
const balanceLabel = document.querySelector('.balance-value');
const inLabel = document.querySelector('.amount-in');
const outLabel = document.querySelector('.amount-out');
const interestLabel = document.querySelector('.amount-interest');
const welcomeLabel = document.querySelector('.welcome-label');

// Input Fields
const usernameInp = document.querySelector('.login-username');
const pinInp = document.querySelector('.login-pin');
const transferToInp = document.querySelector('.op-transfer-to');
const transferAmtInp = document.querySelector('.op-transfer-amount');
const loanAmtInp = document.querySelector('.op-loan-amount');
const closeUserInp = document.querySelector('.op-close-user');
const closePinInp = document.querySelector('.op-close-pin');

// Buttons
const loginBtn = document.querySelector('.login-btn');
const transferBtn = document.querySelector('.op-transfer-btn');
const loanBtn = document.querySelector('.op-loan-btn');
const closeBtn = document.querySelector('.op-close-btn');
const sortBtn = document.querySelector('.btn-sort');

// App variables
let currentAccount;
let sorted = false;

// //////////////////////////////////////////////////////////////////////////

// Code

// MOVEMENTS

const displayMovements = function (acc = currentAccount) {
  movementsDiv.innerHTML = '';
  const movsFrag = document.createDocumentFragment();
  const movements = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movements.forEach((mov, i) => {
    const moveEl = document.createElement('div');
    const direction = mov > 0 ? 'deposit' : 'withdrawal';

    moveEl.className = 'movement';

    moveEl.innerHTML = `
          <p class="movement-type mov-${direction}">${i + 1} ${direction}</p>
          <p class="movement-amount">${mov}€</p>
      `;

    movsFrag.prepend(moveEl);
  });
  movementsDiv.appendChild(movsFrag);
};

sortBtn.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements();
});

// Balance

const calcBalance = function (acc = currentAccount) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  balanceLabel.textContent = `${acc.balance}€`; // return the total of all movements
};

// Summary

const calcSummary = function (acc = currentAccount) {
  inLabel.textContent = `${acc.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => mov + sum, 0)}€`;

  outLabel.textContent = `${acc.movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => Math.abs(mov) + sum, 0)}€`;

  interestLabel.textContent = `${acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100) // Interests
    .filter(int => int >= 1) // filtering interests less than one
    .reduce((sum, mov) => mov + sum, 0)}€`;
};

// Usernames

const setUsername = function (acc = currentAccount) {
  acc.username = acc.owner
    .split(' ')
    .map(name => name[0])
    .join('')
    .toLowerCase();
};

accounts.forEach(setUsername);

// Login Functionality

function updateUI() {
  displayMovements();
  calcBalance();
  calcSummary();

  welcomeLabel.textContent = `Welcome back, ${
    currentAccount.owner.split(' ')[0]
  }`;

  appDiv.style.opacity = 1;
}

loginBtn.addEventListener('click', function (evt) {
  evt.preventDefault();

  currentAccount = accounts.find(acc => acc.username === usernameInp.value);

  if (Number(pinInp.value) === currentAccount?.pin) {
    updateUI();
    usernameInp.value = pinInp.value = '';

    // to remove focus after usage
    pinInp.blur();
    usernameInp.blur();
  }
});

// Transfer functionality

transferBtn.addEventListener('click', function (e) {
  e.preventDefault();

  const user = accounts.find(acc => acc.username === transferToInp.value);
  const amount = Number(transferAmtInp.value);
  transferToInp.value = transferAmtInp.value = '';
  transferAmtInp.blur();
  transferToInp.blur();
  transferBtn.blur();

  if (
    user &&
    user.username !== currentAccount.username &&
    amount > 0 &&
    currentAccount.balance >= amount
  ) {
    user.movements.push(amount);
    currentAccount.movements.push(-amount);
    updateUI();
  }
});

//  Loan functionality

loanBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const request = Number(loanAmtInp.value);

  if (
    request > 0 &&
    currentAccount.movements.some(mov => mov >= request * 0.1)
  ) {
    currentAccount.movements.push(request);
    updateUI();
  }
  loanAmtInp.value = '';
  loanAmtInp.blur();
  loanBtn.blur();
});

// Close functionality

closeBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    closeUserInp.value === currentAccount.username &&
    Number(closePinInp.value) === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex(acc => acc.username === currentAccount.username),
      1
    );
    welcomeLabel.textContent = `Log in to get started`;
    appDiv.style.opacity = 0;
  }
  closeUserInp.value = closePinInp.value = '';
  closeBtn.blur();
});
