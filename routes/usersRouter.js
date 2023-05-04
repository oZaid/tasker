const express = require('express');
const userControl = require('../controllers/userControl');
const authControl = require('../controllers/authControl');

const router = express.Router();

router.post('/signup', authControl.signup);
router.post('/login', authControl.login);
router.post('/logout', userControl.logout);

router.post('/forgot', userControl.forgotMyPass)
router.post('/reset/:token', userControl.resetMyPassword)


// router.post('/forgotMyPassword', authControl.forgotMyPassword)
// router.post('/resetPassword/:id', authControl.resetMyPassword)

router.route('/getAllUsers')
  .get(authControl.protect, authControl.authorized, userControl.getAllUsers)

router.route('/:id')
  .get(authControl.protect, authControl.authorized, userControl.getUser);



module.exports = router;