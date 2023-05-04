const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const { promisify } = require("util")
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.signup = catchAsync(async (req, res) => {
    const { username, email, password, passwordConfirm } = req.body;
    const newUser = await User.create({
        username,
        email,
        password,
        passwordConfirm,
        isChanged: req.body.isChanged || 1000
    })

    const token = jwt.sign({
        id: newUser._id
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })

    res.cookie('jwt', token);
    res.status(201).json({
        status: "success",
        token,
        data: newUser,
    })
})

exports.login = catchAsync(async function (req, res, next) {
    const { username, password } = req.body;

    // 1) Check if eMail and Password Exists?
    if (!username || !password) {
        return next(new Error('Enter Username or Password...!'))
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Username or Password is Invalid...!', 401))
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })


    res.cookie('jwt', token, {
        expires: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)),
        httpOnly: true,
        // secure: true
    })

    res.status(200).json({
        status: "success",
        token
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    let token
    if (req.cookies.jwt) {
        token = req.cookies.jwt
    } else if (process.env.NODE_ENV === 'development') {
        return next(new AppError("You Are Not Authrized...!"))
    } else {
        return res.redirect('/login')
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id);
    if (!user || user.checkPasswordChanged(decoded.iat)) {
        return next(new AppError("Something Went wrong with User, try Login again...", 401))
    }

    // 'Access Granted'
    req.user = user;
    res.locals.user = user

    next();
})

exports.authorized = (req, res, next) => {
    if (req.user.role !== 'admin') return next(new AppError("Not Authorized Sugar pie 🧐"))
    next();
};


