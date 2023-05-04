const User = require("../models/userModel");
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        length: users.length,
        users
    })
})



exports.getUser = catchAsync(async (req, res, next) => {
    if (!req.params.id) return next(new AppError('Where is the Idenfier?!', 401))
    const user = await User.findById(req.params.id).populate('tasks');

    res.status(200).json({
        status: "success",
        user
    })
})

exports.forgotMyPass = catchAsync(async (req, res, next) => {
    if (!req.body.email) return next(new AppError('No Email Enterd!', 400))

    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError('No User With That Email!', 400))

    const token = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // This is Main Dish

    const url = `http://localhost:3000/reset/${token}`
    try {
        await new Email(user, url).sendReset();
        return res.status(200).json({
            status: "success",
            msg: "🍵🙋🏻‍♂️"
        })
    } catch (error) {
        console.log('💥💥💥💥', error);
    }
})

exports.resetMyPassword = catchAsync(async (req, res, next) => {
    // 1) Decrypt the token and get user
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log('token ✔️✔️✔️');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() } // check if token expired
    })
    if (!user) return next(new AppError("Token is invalid or expired...!", 403));
    console.log(user);
    console.log('user ✔️✔️✔️');
    // 2)
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    if (process.env.NODE_ENV === 'production') {
        return res.status(200).redirect('/login')
    }
    res.status(200).json({
        status: "succes",
        token
    })
})

exports.logout = (req, res) => {
    const token = jwt.sign({
        ok: 'Logout',
    }, process.env.JWT_SECRET, { expiresIn: '0' })


    res.cookie('jwt', token, {
        expires: new Date(Date.now()),
        httpOnly: true,
        // secure: true
    })
    return res.status(200).json({
        status: "success"
    })
}