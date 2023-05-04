const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.main = (req, res, next) => {
  if (!req.cookies.jwt) {
    console.log('No Token');
    return res.status(401)
      .redirect('/login')
  }
  res.status(200).render('main', {
    title: 'My Tasks'
  })
}

exports.login = (req, res) => {
  if (req.cookies.jwt) {
    return res.status(200).redirect('/')
  }
  res.status(200).render('login', {
    title: 'Login'
  })
}

exports.signup = (req, res) => {
  if (req.cookies.jwt) {
    return res.status(200).redirect('/')
  }
  res.status(200).render('signup', {
    title: 'Signup'
  })
}

exports.forgot = (req, res) => {
  if (req.cookies.jwt) {
    return res.status(200).redirect('/')
  }
  res.status(200).render('forgot', {
    title: 'Forgot My Password'
  })
}


exports.reset = (req, res) => {
  const token = req.params.token;
  if (req.cookies.jwt) {
    return res.status(200).redirect('/')
  }
  res.status(200).render('reset', {
    token,
    title: '🧐'
  })
}