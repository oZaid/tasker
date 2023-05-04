import '@babel/polyfill'
const axios = require('axios')
import { signup } from './signup';
import { login, logout } from './login';
import { sendResetToken } from "./forgot";
import { resetPassword } from './reset';
const inps = document.querySelectorAll('input');
const themeToggle = document.querySelector('.check-bg');

if (localStorage.theme === 'light') {
  document.body.classList.toggle('light-theme')
  themeToggle.style.backgroundImage = "url('./img/moon.png')"
};
themeToggle.addEventListener('click', function () {
  document.body.classList.toggle('light-theme');
  if (!document.body.classList.contains('light-theme')) {
    localStorage.setItem('theme', 'dark')
    themeToggle.style.backgroundImage = "url('./img/sun.png')"
  } else {
    localStorage.setItem('theme', 'light')
    themeToggle.style.backgroundImage = "url('./img/moon.png')"
  }
})

// Forms
const signupForm = document.querySelector('.form--signup');
const frogotForm = document.querySelector('.form--forgot');
const loginForm = document.querySelector('.form--login');
const resetForm = document.querySelector('.form--reset');
const logoutBtn = document.querySelector('#logout')

// Signup #####################
if (signupForm) {
  signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    await signup(inps[0].value, inps[1].value, inps[2].value, inps[3].value);
  })
}

// Login #####################
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    await login(inps[0].value, inps[1].value)
  })
}

// Logout #####################
if (logoutBtn) {
  logoutBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    await logout();
  })
}

// Forgot #####################
if (frogotForm) {
  frogotForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log(inps[0].value);
    await sendResetToken(inps[0].value);
  })
}

// Reset #####################
if (resetForm) {
  const token = document.querySelector('.token').dataset['token']
  resetForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    await resetPassword(inps[0].value, inps[1].value, token);
  })
}