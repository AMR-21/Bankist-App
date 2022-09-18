'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-09-14T23:36:17.929Z',
    '2022-09-17T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

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
const dateLabel = document.querySelector('.date');
const timerLabel = document.querySelector('.timer');

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
let currentAccount, timer;
let sorted = false;

// //////////////////////////////////////////////////////////////////////////
const accounts = [account1, account2];

// Code

// MOVEMENTS
const formatMovementDate = (date, locale) => {
  const daysPassed = Math.round(
    Math.abs((new Date() - date) / (1000 * 60 * 60 * 24))
  );

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = (acc, val) =>
  new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(val);

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

    const displayDate = formatMovementDate(
      new Date(acc.movementsDates[i]),
      acc.locale
    );

    moveEl.innerHTML = `
          <p class="movement-type mov-${direction}">${i + 1} ${direction}
          </p>
          <p class="movement-date">${displayDate}</p>
          <p class="movement-amount">${formatCurrency(acc, mov)}</p>
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

  balanceLabel.textContent = formatCurrency(acc, acc.balance); // return the total of all movements
};

// Summary

const calcSummary = function (acc = currentAccount) {
  inLabel.textContent = formatCurrency(
    acc,
    acc.movements.filter(mov => mov > 0).reduce((sum, mov) => mov + sum, 0)
  );

  outLabel.textContent = formatCurrency(
    acc,
    acc.movements
      .filter(mov => mov < 0)
      .reduce((sum, mov) => Math.abs(mov) + sum, 0)
  );

  interestLabel.textContent = formatCurrency(
    acc,
    acc.movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * acc.interestRate) / 100) // Interests
      .filter(int => int >= 1) // filtering interests less than one
      .reduce((sum, mov) => mov + sum, 0)
  );
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

const startLogout = () => {
  let time = 600;

  const tick = function () {
    const min = `${Math.trunc(time / 60)}`.padStart(2, '0');
    const sec = `${time % 60}`.padStart(2, '0');

    timerLabel.textContent = `${min}:${sec}`;
    time--;

    if (time === -1) {
      appDiv.style.opacity = 0;
      welcomeLabel.textContent = `Log in to get started`;
      clearInterval(timer);
    }
  };

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

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

  if (+pinInp.value === currentAccount?.pin) {
    if (timer) clearInterval(timer);

    timer = startLogout();
    updateUI();
    usernameInp.value = pinInp.value = '';

    // internationalizing dates Intl

    dateLabel.textContent = new Intl.DateTimeFormat(currentAccount.locale, {
      hour: 'numeric',
      minute: 'numeric',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date());

    // to remove focus after usage
    pinInp.blur();
    usernameInp.blur();
  }
});

// Transfer functionality

transferBtn.addEventListener('click', function (e) {
  e.preventDefault();

  const user = accounts.find(acc => acc.username === transferToInp.value);
  const amount = +transferAmtInp.value;
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
    currentAccount.movementsDates.push(new Date().toISOString());
    user.movementsDates.push(new Date().toISOString());

    updateUI();
  }

  clearInterval(timer);
  timer = startLogout();
});

//  Loan functionality

loanBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const request = Math.floor(loanAmtInp.value);

  if (
    request > 0 &&
    currentAccount.movements.some(mov => mov >= request * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(request);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI();
    }, 2500);
  }
  loanAmtInp.value = '';
  loanAmtInp.blur();
  loanBtn.blur();
  clearInterval(timer);
  timer = startLogout();
});

// Close functionality

closeBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    closeUserInp.value === currentAccount.username &&
    +closePinInp.value === currentAccount.pin
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
